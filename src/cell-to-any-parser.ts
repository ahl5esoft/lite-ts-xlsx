import { ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToAnyParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^(.+):(.+)$/);
    }

    public async parse(opt: ICellParseOption) {
        return {
            field: this.match[1],
            value: await this.parseCellValue(this.match[2], opt.cellValue)
        };
    }
}