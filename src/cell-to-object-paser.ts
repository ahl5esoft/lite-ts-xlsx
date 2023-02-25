import { ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToObjectParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^{(.+)}:(.+)$/);
    }

    public async parse(opt: ICellParseOption) {
        const fieldParts = this.match[1].split('.');
        opt.temp[opt.row.value] ??= {};
        const obj = fieldParts.slice(0, -1).reduce((memo, r) => {
            const key = opt.row[r];
            if (!memo[key])
                memo[key] = {};

            return memo[key];
        }, opt.temp[opt.row.value]);
        obj[fieldParts[fieldParts.length - 1]] = await this.parserFactory.build(this.match[2]).parse(opt.cellValue);

        return {
            field: '$',
            value: opt.temp[opt.row.value]
        };
    }
}