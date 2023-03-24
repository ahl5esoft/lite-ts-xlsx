import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IParser, ParserFactoryBase, ParserType } from 'lite-ts-parser';

import { CellToMatrixParser as Self } from './cell-to-matrix-parser';

describe('src/cell-to-matrix-parser.ts', () => {
    describe('.parse(opt: ICellParseOption)', () => {
        it('ok', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const ok = self.isMatch('[aa][bb].cc:dd');
            strictEqual(ok, true);

            const mockParser = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build('dd'),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse('ttt'),
                'ee'
            );

            const row = {
                aa: 0,
                bb: 0,
                value: 1
            };
            const res = await self.parse({
                cellValue: 'ttt',
                row,
                rows: [],
                temp: {}
            });
            deepStrictEqual(res, {
                field: '$',
                value: [
                    [{
                        cc: 'ee'
                    }]
                ]
            });
            deepStrictEqual(row, {
                aa: 0,
                bb: 0,
                value: 1
            });
        });

        it('[index].valueType:Enum.ValueTypeData.text', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const ok = self.isMatch('[index].valueType:Enum.ValueTypeData.text');
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
                    itemValue: 'ttt'
                }),
                'ee'
            );

            const row = {
                index: 0,
                value: 1
            };
            const res = await self.parse({
                cellValue: 'ttt',
                row,
                rows: [],
                temp: {}
            });
            deepStrictEqual(res, {
                field: '$',
                value: [
                    {
                        valueType: 'ee'
                    }
                ]
            });
            deepStrictEqual(row, {
                index: 0,
                value: 1
            });
        });
    });
});