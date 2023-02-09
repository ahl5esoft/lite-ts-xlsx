import { ParserFactoryBase } from 'lite-ts-parser';

import { ICellParseOption, CellParserBase } from './cell-parser-base';

export class CellToNewRowExpParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^#\.[a-zA-Z.]+=.+/);
    }

    public async parse(opt: ICellParseOption) {
        eval(`(newRow, oldRow) => ${this.match[0].replace('#', 'newRow').replace('$', 'oldRow').replace('{0}', opt.cellValue)}`)(
            opt.rows[opt.rows.length - 1],
            opt.row,
        );
    }
}