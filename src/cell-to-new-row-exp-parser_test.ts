import { deepStrictEqual, strictEqual } from 'assert';

import { CellToNewRowExpParser as Self } from './cell-to-new-row-exp-parser';

describe('src/cell-to-new-row-exp-parser.ts', () => {
    describe('.parse(opt: ICellParseOption)', () => {
        it('ok', async () => {
            const self = new Self(null);

            Reflect.set(self, 'match', [`#['a.b']=$.c.d+'{0}'`]);

            const rows = [{}];
            const res = await self.parse({
                cellValue: 'e',
                row: {
                    c: {
                        d: 'f'
                    }
                },
                rows,
            });
            strictEqual(res, undefined);
            deepStrictEqual(rows, [{
                'a.b': 'fe'
            }]);
        });
    });
});