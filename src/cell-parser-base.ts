import { IParser, ParserFactoryBase } from 'lite-ts-parser';

export interface ICellParseOption {
    cellValue: any;
    row: any;
    rows: any[];
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
}