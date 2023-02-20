import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IParser, ParserFactoryBase } from 'lite-ts-parser';

import { CellToArrayParser as Self } from './cell-to-array-parser';

describe('src/cell-to-array-parser.ts', () => {
    describe('.parse(opt: ICellParseOption)', () => {
        it('row is empty array', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            Reflect.set(self, 'match', ['', 'fixed', 'rewards', 'IRewardData[]']);

            const mockParser = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build('IRewardData[]'),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse('废弃轮胎*1'),
                [
                    {
                        count: 1,
                        valueType: 1,
                    }
                ]
            );

            const res = await self.parse({
                cellValue: '废弃轮胎*1',
                row: {},
                rows: [],
            });
            deepStrictEqual(res, {
                field: 'fixed',
                value: [{
                    rewards: [
                        {
                            count: 1,
                            valueType: 1,
                        }
                    ]
                }]
            });
        });

        it('row is not empty array', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            Reflect.set(self, 'match', ['', 'fixed', 'rewards', 'IRewardData[]']);

            const mockParser = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build('IRewardData[]'),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse('废弃轮胎*1'),
                []
            );

            const res = await self.parse({
                cellValue: '废弃轮胎*1',
                row: {
                    fixed: [
                        {
                            rewards: []
                        }
                    ]
                },
                rows: [],
            });
            deepStrictEqual(res, {
                field: 'fixed',
                value: [
                    {
                        rewards: []
                    },
                    {
                        rewards: []
                    }
                ]
            });
        });

        it('row first element has another field', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            Reflect.set(self, 'match', ['', 'fixed', 'rewards', 'IRewardData[]']);

            const mockParser = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build('IRewardData[]'),
                mockParser.actual
            );

            mockParser.expectReturn(
                r => r.parse('废弃轮胎*1'),
                []
            );

            const res = await self.parse({
                cellValue: '废弃轮胎*1',
                row: {
                    fixed: [
                        {
                            conditions: []
                        }
                    ]
                },
                rows: [],
            });
            deepStrictEqual(res, {
                field: 'fixed',
                value: [
                    {
                        conditions: [],
                        rewards: [],
                    },
                ]
            });
        });
    });
});