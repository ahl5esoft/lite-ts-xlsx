import { ParserFactoryBase } from 'lite-ts-parser';

import { CellParserBase, ICellParseOption } from './cell-parser-base';

export class CellWithNewRowParser extends CellParserBase {
    public constructor(
        parserFactory: ParserFactoryBase,
    ) {
        super(parserFactory, /(.+):#$/);
    }

    public async parse(opt: ICellParseOption) {
        opt.rows.push({
            value: opt.cellValue
        });

        const [field, type] = this.match[1].split(':');
        return {
            field,
            value: await this.parserFactory.build(type).parse(opt.cellValue)
        };
    }
}