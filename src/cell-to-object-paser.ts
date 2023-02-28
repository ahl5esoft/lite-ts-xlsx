import { ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToObjectParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^{(.+)}\.?(.*):(.+)$/);
    }

    public async parse(opt: ICellParseOption) {
        const [_, key, field, type] = this.match;
        opt.temp[opt.row.value] ??= {};

        const keyParts = key.split('.');
        const fieldParts = field ? field.split('.') : [];

        const value = await this.parserFactory.build(type).parse(opt.cellValue);

        const obj = keyParts.reduce((memo, r, index) => {
            if (!fieldParts.length && index == keyParts.length - 1)
                memo[opt.row[r]] ??= value;
            else
                memo[opt.row[r]] ??= {};
            return memo[opt.row[r]];
        }, opt.temp[opt.row.value]);

        fieldParts.reduce((memo, r, index) => {
            if (index == fieldParts.length - 1)
                memo[r] = value;
            else
                memo[r] ??= {};
            return memo[r];
        }, obj);

        return {
            field: '$',
            value: opt.temp[opt.row.value]
        };
    }
}