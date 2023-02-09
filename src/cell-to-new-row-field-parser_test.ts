import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IParser, ParserFactoryBase } from 'lite-ts-parser';

import { CellToNewRowFieldParser as Self } from './cell-to-new-row-field-parser';

describe('src/cell-to-new-row-field-parser.ts', () => {
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

            const rows = [{}];
            const res = await self.parse({
                cellValue: 'd',
                row: null,
                rows,
            });
            strictEqual(res, undefined);
            deepStrictEqual(rows, [{
                a: 'e'
            }]);
        });
    });
});