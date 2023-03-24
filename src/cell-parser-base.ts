import { IParser, IToEnumValueParseOption, ParserFactoryBase, ParserType } from 'lite-ts-parser';

export interface ICellParseOption {
    cellValue: any;
    row: any;
    rows: any[];
    temp?: any;
}

export abstract class CellParserBase implements IParser {
    protected match: RegExpMatchArray;

    public constructor(
        protected parserFactory: ParserFactoryBase,
        private m_Reg: RegExp,
    ) { }

    public isMatch(text: string) {
        this.match = text.match(this.m_Reg);
        return !!this.match;
    }

    public abstract parse(opt: ICellParseOption): Promise<void | {
        field: string;
        value: any;
    }>;

    protected async parseCellValue(type: string, cellValue: any) {
        const enumTypeMatch = type.match(/^Enum\.([a-zA-Z]+Data)\.([a-zA-Z]+)$/);
        if (enumTypeMatch) {
            return await this.parserFactory.build(ParserType.enumValue).parse({
                enumName: enumTypeMatch[1],
                itemField: enumTypeMatch[2],
                itemValue: cellValue
            });
        }
        const enumsTypeMatch = type.match(/^\[Enum\.([a-zA-Z]+Data)\.([a-zA-Z]+)\]$/);
        if (enumsTypeMatch) {
            const valuePromises = cellValue.split(/\r\n|\n|\r/g).map((r: string) => {
                return this.parserFactory.build(ParserType.enumValue).parse({
                    enumName: enumsTypeMatch[1],
                    itemField: enumsTypeMatch[2],
                    itemValue: r,
                } as IToEnumValueParseOption);
            });
            return await Promise.all(valuePromises);
        }
        return await this.parserFactory.build(type).parse(cellValue);
    }
}