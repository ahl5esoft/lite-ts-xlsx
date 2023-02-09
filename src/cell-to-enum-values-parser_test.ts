import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IParser, ParserFactoryBase, ParserType } from 'lite-ts-parser';

import { CellToEnumValuesParser as Self } from './cell-to-enum-values-parser';

describe('src/cell-to-enum-values-parser.ts', () => {
    describe('.parse(opt: ICellParseOption)', () => {
        it('ok', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            Reflect.set(self, 'match', ['', 'a', 'b', 'c']);

            const mockParser = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build(ParserType.enumValue),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse({
                    enumName: 'b',
                    itemField: 'c',
                    itemValue: 'd',
                }),
                'e'
            );

            mockParserFactory.expectReturn(
                r => r.build(ParserType.enumValue),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse({
                    enumName: 'b',
                    itemField: 'c',
                    itemValue: 'f',
                }),
                'g'
            );

            const res = await self.parse({
                cellValue: `d\nf`,
                row: {},
                rows: [],
            });
            deepStrictEqual(res, {
                field: 'a',
                value: ['e', 'g']
            });
        });
    });
});