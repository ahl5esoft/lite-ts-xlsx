import { ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToArrayParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^([a-zA-Z]+)\[\]\.([a-zA-Z]+)\:(.*)$/);
    }

    public async parse(opt: ICellParseOption) {
        const value: any[] = opt.row[this.match[1]] ?? [];
        const cellValue = await this.parserFactory.build(this.match[3]).parse(opt.cellValue);

        if (value[value.length - 1] && value[value.length - 1][this.match[2]] == null) {
            value[value.length - 1][this.match[2]] = cellValue;
        } else {
            value.push({
                [this.match[2]]: cellValue
            });
        }

        return {
            field: this.match[1],
            value: value
        };
    }
}