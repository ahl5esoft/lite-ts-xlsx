import { IParser, ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase } from './cell-parser-base';
import { CellToEnumValueParser } from './cell-to-enum-value-parser';
import { CellToEnumValuesParser } from './cell-to-enum-values-parser';
import { CellToMatrixParser } from './cell-to-matrix-parser';
import { CellToNewRowExpParser } from './cell-to-new-row-exp-parser';
import { CellToNewRowFieldParser } from './cell-to-new-row-field-parser';
import { CellToNullParser } from './cell-to-null-parser';
import { CellToObjectParser } from './cell-to-object-paser';
import { CellWithNewRowParser } from './cell-with-new-row-parser';
import { IEnumFactory, IEnumItem } from './i-enum-factory';

export interface ISheetParseOption {
    sheetName: string,
    rows: any[];
}

export class SheetParser implements IParser {
    public static unmergeFlag = '$';

    private m_Parsers: CellParserBase[];

    public constructor(
        private m_EnumFactory: IEnumFactory,
        private m_ParserFactory: ParserFactoryBase,
    ) {
        this.m_Parsers = [
            new CellToNullParser(this.m_ParserFactory),
            new CellToEnumValueParser(this.m_ParserFactory),
            new CellToEnumValuesParser(this.m_ParserFactory),
            new CellToMatrixParser(this.m_ParserFactory),
            new CellToNewRowExpParser(this.m_ParserFactory),
            new CellToNewRowFieldParser(this.m_ParserFactory),
            new CellToObjectParser(this.m_ParserFactory),
            new CellWithNewRowParser(this.m_ParserFactory),
        ];
    }

    public async parse(opt: ISheetParseOption) {
        let allEnumItem: { [value: number]: IEnumItem; };
        const sheetNameParts = opt.sheetName.split('.');
        if (!opt.sheetName.includes(SheetParser.unmergeFlag) && !sheetNameParts[1] && sheetNameParts[0].endsWith('Data'))
            allEnumItem = await this.m_EnumFactory.build<IEnumItem>(sheetNameParts[0]).allItem;

        let rows = [];
        const temp = {};
        for (const [i, r] of opt.rows.entries()) {
            if (i == 0)
                continue;

            const row: any = {};
            for (let [k, v] of Object.entries(r)) {
                const parser = this.m_Parsers.find(cr => {
                    return cr.isMatch(k);
                });
                try {
                    if (parser) {
                        const res = await parser.parse({
                            cellValue: v,
                            row,
                            rows,
                            temp
                        });
                        if (res)
                            row[res.field] = res.value;
                    } else {
                        const [field, type] = k.split(':');
                        row[field] = await this.m_ParserFactory.build(type).parse(v);
                    }
                } catch (ex) {
                    throw new Error(`${opt.sheetName} 第 ${i} 行 ${ex.message}`);
                }
            }

            if (Object.keys(temp).length) {
                const item = rows.find(r => r.value == row.value);
                if (item) {
                    item['$'] = temp[row.value];
                } else {
                    rows.push({
                        value: row.value,
                        '$': temp[row.value]
                    });
                }
            } else {
                rows.push(row);
            }
        }

        for (const r of rows) {
            Object.keys(r).forEach(cr => {
                const fields = cr.split('.');
                if (fields.length == 1)
                    return;

                const lastField = fields.pop();
                fields.reduce((memo, sr) => {
                    memo[sr] ??= {};
                    return memo[sr];
                }, r)[lastField] = r[cr];
                delete r[cr];
            });

            if (!allEnumItem)
                continue;

            if (allEnumItem[r.value])
                Object.assign(allEnumItem[r.value], r);
            else
                allEnumItem[r.value] = r;
        }

        return allEnumItem ? Object.values(allEnumItem) : rows;
    }
}