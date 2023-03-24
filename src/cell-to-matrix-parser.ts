import { ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellToMatrixParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /^((\[\w+\])+)\.(\w+)\:(.+)$/);
    }

    public async parse(opt: ICellParseOption) {
        const fieldParts = this.match[1].substring(1).split('[');
        opt.temp[opt.row.value] ??= [];
        const obj = fieldParts.reduce((memo, r, i) => {
            r = r.replace(']', '');
            const index = opt.row[r];

            if (!memo[index])
                memo[index] = fieldParts.length - 1 == i ? {} : [];

            return memo[index];
        }, opt.temp[opt.row.value]);

        obj[this.match[3]] = await this.parseCellValue(this.match[4], opt.cellValue);

        return {
            field: '$',
            value: opt.temp[opt.row.value]
        };
    }
}