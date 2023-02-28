import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { IParser, ParserFactoryBase } from 'lite-ts-parser';

import { CellToObjectParser as Self } from './cell-to-object-paser';

describe('src/cell-to-object-paser.ts', () => {
    describe('.parse(opt: ICellParseOption)', () => {
        it('ok', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const ok = self.isMatch('{aa}.bb.cc:dd');
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
                aa: 'aa',
                bb: 'bb',
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
                value: {
                    aa: {
                        bb: {
                            cc: 'ee'
                        }
                    }
                }
            });
        });
    });
});