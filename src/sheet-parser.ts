import { IParser, ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase } from './cell-parser-base';
import { CellToEnumValueParser } from './cell-to-enum-value-parser';
import { CellToEnumValuesParser } from './cell-to-enum-values-parser';
import { CellToNewRowExpParser } from './cell-to-new-row-exp-parser';
import { CellToNewRowFieldParser } from './cell-to-new-row-field-parser';
import { CellWithNewRowParser } from './cell-with-new-row-parser';
import { IEnumFactory, IEnumItem } from './i-enum-factory';

export interface ISheetParseOption {
    sheetName: string,
    rows: any[];
}

export class SheetParser implements IParser {
    public static cover = 'cover';

    private m_Parsers: CellParserBase[];

    public constructor(
        private m_EnumFactory: IEnumFactory,
        private m_ParserFactory: ParserFactoryBase,
    ) {
        this.m_Parsers = [
            new CellToEnumValueParser(this.m_ParserFactory),
            new CellToEnumValuesParser(this.m_ParserFactory),
            new CellToNewRowExpParser(this.m_ParserFactory),
            new CellToNewRowFieldParser(this.m_ParserFactory),
            new CellWithNewRowParser(this.m_ParserFactory),
        ];
    }

    public async parse(opt: ISheetParseOption) {
        let allEnumItem: { [value: number]: IEnumItem; };
        const sheetNames = opt.sheetName.split('.');
        const sheetName = sheetNames[0];
        if (sheetName.endsWith('Data') && sheetNames[1] !== SheetParser.cover)
            allEnumItem = await this.m_EnumFactory.build<IEnumItem>(sheetName).allItem;

        let rows = [];
        for (const [i, r] of opt.rows.entries()) {
            if (i == 0)
                continue;

            const row: any = {};
            for (let [k, v] of Object.entries(r)) {
                if (!v)
                    continue;

                const parser = this.m_Parsers.find(cr => {
                    return cr.isMatch(k);
                });
                if (parser) {
                    const res = await parser.parse({
                        cellValue: v,
                        row,
                        rows,
                    });
                    if (res)
                        row[res.field] = res.value;
                } else {
                    const [field, type] = k.split(':');
                    row[field] = await this.m_ParserFactory.build(type).parse(v);
                }
            }

            Object.keys(row).forEach(cr => {
                const fields = cr.split('.');
                if (fields.length == 1)
                    return;

                const lastField = fields.pop();
                fields.reduce((memo, sr) => {
                    memo[sr] ??= {};
                    return memo[sr];
                }, row)[lastField] = row[cr];
                delete row[cr];
            });

            rows.push(row);

            if (!allEnumItem)
                continue;

            if (allEnumItem[row.value])
                Object.assign(allEnumItem[row.value], row);
            else
                allEnumItem[row.value] = row;
        }

        return allEnumItem ? Object.values(allEnumItem) : rows;
    }
}