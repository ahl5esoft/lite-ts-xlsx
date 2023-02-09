import { IToEnumValueParseOption, ParserFactoryBase, ParserType } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToEnumValueParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^(.+):Enum\.([a-zA-Z]+Data)\.([a-zA-Z]+)$/);
    }

    public async parse(opt: ICellParseOption) {
        return {
            field: this.match[1],
            value: await this.parserFactory.build(ParserType.enumValue).parse({
                enumName: this.match[2],
                itemField: this.match[3],
                itemValue: opt.cellValue,
            } as IToEnumValueParseOption)
        };
    }
}