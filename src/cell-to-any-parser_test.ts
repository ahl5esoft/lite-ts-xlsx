import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IParser, ParserFactoryBase, ParserType } from 'lite-ts-parser';

import { CellToAnyParser as Self } from './cell-to-any-parser';

describe('src/cell-to-any-parser.ts', () => {
    describe('.parse(opt: ICellParseOption)', () => {
        it('aa:Enum.ValueTypeData.text', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const ok = self.isMatch('aa:Enum.ValueTypeData.text');
            strictEqual(ok, true);

            const mockParser = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build(ParserType.enumValue),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse({
                    enumName: 'ValueTypeData',
                    itemField: 'text',
                    itemValue: 'ttt',
                }),
                'e'
            );

            const res = await self.parse({
                cellValue: 'ttt',
                row: {},
                rows: [],
            });
            deepStrictEqual(res, {
                field: 'aa',
                value: 'e'
            });
        });

        it('bb:[Enum.ValueTypeData.text]', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const ok = self.isMatch('aa:[Enum.ValueTypeData.text]');
            strictEqual(ok, true);

            const mockParser = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build(ParserType.enumValue),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse({
                    enumName: 'ValueTypeData',
                    itemField: 'text',
                    itemValue: 'ttt',
                }),
                'e'
            );

            mockParserFactory.expectReturn(
                r => r.build(ParserType.enumValue),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse({
                    enumName: 'ValueTypeData',
                    itemField: 'text',
                    itemValue: 'ddd',
                }),
                'c'
            );

            const res = await self.parse({
                cellValue: 'ttt\nddd',
                row: {},
                rows: [],
            });
            deepStrictEqual(res, {
                field: 'aa',
                value: ['e', 'c']
            });
        });
    });
});