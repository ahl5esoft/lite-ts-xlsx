import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IParser, ParserFactoryBase } from 'lite-ts-parser';

import { CellWithNewRowParser as Self } from './cell-with-new-row-parser';

describe('src/cell-with-new-row-parser.ts', () => {
    describe('.parse(opt: ICellParseOption)', () => {
        it('ok', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            Reflect.set(self, 'match', ['', 'a:b']);

            const mockParser = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build('b'),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse('d'),
                'e'
            );

            let rows = [];
            const res = await self.parse({
                cellValue: 'd',
                row: {},
                rows,
            });
            deepStrictEqual(res, {
                field: 'a',
                value: 'e'
            });
            deepStrictEqual(rows, [{
                value: 'd'
            }]);
        });
    });
});