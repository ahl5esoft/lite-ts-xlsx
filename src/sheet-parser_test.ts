import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IParser, ParserFactoryBase } from 'lite-ts-parser';

import { IEnum, IEnumFactory, IEnumItem } from './i-enum-factory';
import { SheetParser as Self } from './sheet-parser';

describe('src/sheet-parser.ts', () => {
    describe('.parse(v: { [key: string]: any })', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<IEnumFactory>();
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockEnumFactory.actual, mockParserFactory.actual);

            const mockEnum = new Mock<IEnum<IEnumItem>>({
                allItem: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build('EnumData'),
                mockEnum.actual
            );

            const mockParserA = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build('b'),
                mockParserA.actual
            );

            mockParserA.expectReturn(
                r => r.parse(1),
                'g'
            );

            const mockParserB = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build('e'),
                mockParserB.actual
            );

            mockParserB.expectReturn(
                r => r.parse('f'),
                'h'
            );

            const res = await self.parse({
                rows: [null, {
                    'a:b': 1,
                    'c.d.i:e': 'f'
                }],
                sheetName: 'EnumData',
            });
            deepStrictEqual(res, [{
                a: 'g',
                c: {
                    d: {
                        i: 'h'
                    }
                }
            }]);
        });

        it('cover', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(null, mockParserFactory.actual);

            const mockParserA = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build('b'),
                mockParserA.actual
            );

            mockParserA.expectReturn(
                r => r.parse(1),
                'g'
            );

            const mockParserB = new Mock<IParser>();
            mockParserFactory.expectReturn(
                r => r.build('e'),
                mockParserB.actual
            );

            mockParserB.expectReturn(
                r => r.parse('f'),
                'h'
            );

            const res = await self.parse({
                rows: [null, {
                    'a:b': 1,
                    'c.d.i:e': 'f'
                }],
                sheetName: `EnumData.${Self.unmergeFlag}`,
            });
            deepStrictEqual(res, [{
                a: 'g',
                c: {
                    d: {
                        i: 'h'
                    }
                }
            }]);
        });
    });
});