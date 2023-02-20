import { IParser, ParserFactoryBase } from 'lite-ts-parser';
import lodash from 'lodash';
import { readFile, utils, WorkSheet } from 'xlsx';

import { IEnumFactory } from './i-enum-factory';
import { ISheetParseOption, SheetParser } from './sheet-parser';

export class FileParser implements IParser {
    private m_SheetParser: IParser;
    protected get sheetParser() {
        this.m_SheetParser ??= new SheetParser(this.m_EnumFactory, this.m_ParserFactory);
        return this.m_SheetParser;
    }

    public constructor(
        private m_EnumFactory: IEnumFactory,
        private m_ParserFactory: ParserFactoryBase,
    ) { }

    public async parse(filePath: string) {
        const excel = readFile(filePath, {
            type: 'file'
        });
        console.log(excel.Sheets);
        const result = {};
        for (const r of excel.SheetNames) {
            excel.Sheets[r]['!ref'] = this.getSheetRange(excel.Sheets[r]);
            result[r] = await this.sheetParser.parse({
                rows: utils.sheet_to_json(excel.Sheets[r]),
                sheetName: r,
            } as ISheetParseOption);
        }
        return result;
    }

    /**
     * 获取 sheet 实际范围
     * 
     * @param sheet 
     */
    private getSheetRange(sheet: WorkSheet) {
        const sheetWithValues = lodash.pickBy(sheet, r => !!r.v);
        const cellNames = lodash.keys(sheetWithValues);
        const cellAddreses = cellNames.map(r => {
            return utils.decode_cell(r);
        });
        const maxRow = lodash.max(
            cellAddreses.map(r => r.r),
        );
        const maxCell = lodash.max(
            cellAddreses.map(r => r.c),
        );
        const lastCell = utils.encode_cell({
            c: maxCell,
            r: maxRow,
        });
        return `A1:${lastCell}`;
    }
}