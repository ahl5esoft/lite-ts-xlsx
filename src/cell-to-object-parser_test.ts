import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IParser, ParserFactoryBase, ParserType } from 'lite-ts-parser';

import { CellToObjectParser as Self } from './cell-to-object-paser';

describe('src/cell-to-object-paser.ts', () => {
    describe('.parse(opt: ICellParseOption)', () => {
        it('{aa.bb}.cc:dd', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const ok = self.isMatch('{aa.bb}.cc:dd');
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
                aa: 'aaaa',
                bb: 'bb',
                value: 1,
            };
            const res = await self.parse({
                cellValue: 'ttt',
                row,
                rows: [],
                temp: {
                    1: {
                        aaaa: {
                            bb: {
                                other: 1
                            }
                        },
                    }
                }
            });
            deepStrictEqual(res, {
                field: '$',
                value: {
                    aaaa: {
                        bb: {
                            cc: 'ee',
                            other: 1
                        }
                    }
                }
            });
        });

        it('{aa}:dd', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const ok = self.isMatch('{aa}:dd');
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
                aa: 'aaaa',
                value: 1,
            };
            const res = await self.parse({
                cellValue: 'ttt',
                row,
                rows: [],
                temp: {}
            });
            deepStrictEqual(res, {
                field: '$',
                value: {
                    aaaa: 'ee'
                }
            });
        });

        it('{index}.valueType:Enum.ValueTypeData.text', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const ok = self.isMatch('{index}.valueType:Enum.ValueTypeData.text');
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
                index: 'aaaa',
                value: 1,
            };
            const res = await self.parse({
                cellValue: 'ttt',
                row,
                rows: [],
                temp: {}
            });
            deepStrictEqual(res, {
                field: '$',
                value: {
                    aaaa: {
                        valueType: 'ee'
                    }
                }
            });
        });
    });
});