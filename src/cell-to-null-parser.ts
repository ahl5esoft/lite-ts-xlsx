import { ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToNullParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, null);
    }

    public isMatch(text: string) {
        return !text?.includes(':');
    }

    public async parse(_: ICellParseOption) {
        return null;
    }
}