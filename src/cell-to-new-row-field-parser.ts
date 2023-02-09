import { ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToNewRowFieldParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^#\.([^=]+)$/);
    }

    public async parse(opt: ICellParseOption) {
        const [field, type] = this.match[1].split(':');
        opt.rows[opt.rows.length - 1][field] = await this.parserFactory.build(type).parse(opt.cellValue);
    }
}