import { IToEnumValueParseOption, ParserFactoryBase, ParserType } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToEnumValuesParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^(.+):\[Enum\.([a-zA-Z]+Data)\.([a-zA-Z]+)\]$/);
    }

    public async parse(opt: ICellParseOption) {
        const valuePromises = opt.cellValue.split(/\r\n|\n|\r/g).map((r: string) => {
            return this.parserFactory.build(ParserType.enumValue).parse({
                enumName: this.match[2],
                itemField: this.match[3],
                itemValue: r,
            } as IToEnumValueParseOption)
        });
        return {
            field: this.match[1],
            value: await Promise.all(valuePromises)
        };
    }
}