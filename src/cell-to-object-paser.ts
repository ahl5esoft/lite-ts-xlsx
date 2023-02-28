import { ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToObjectParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^{(.+)}\.(.+):(.+)$/);
    }

    public async parse(opt: ICellParseOption) {
        const [_, key, field, type] = this.match;
        opt.temp[opt.row.value] ??= {};
        opt.temp[opt.row.value][opt.row[key]] ??= {};

        const fieldParts = field.split('.');
        const obj = [key, ...fieldParts].slice(0, -1).reduce((memo, r) => {
            memo[r] ??= {};
            return memo[r];
        }, opt.temp[opt.row.value]);
        obj[fieldParts[fieldParts.length - 1]] = await this.parserFactory.build(type).parse(opt.cellValue);

        return {
            field: '$',
            value: opt.temp[opt.row.value]
        };
    }
}