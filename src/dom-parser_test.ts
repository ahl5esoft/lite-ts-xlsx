import { deepStrictEqual } from 'assert';

import { DomParser as Self } from './dom-parser';

describe('src/dom-parser.ts', () => {
    describe('.getSheetRange(sheet: WorkSheet)', () => {
        it('ok', async () => {
            const self = new Self(null, null, null);

            const fn = Reflect.get(self, 'getSheetRange');
            const res = fn({
                '!ref': 'A1:XEX3557',
                'A1': { v: 'id' },
                'E1': { v: 'cht' },
                'T1': { v: '' },
                'A20': { v: '1' },
                'E50': { v: '2' },
                'T100': { v: '' }
            });

            deepStrictEqual(res, 'A1:E50');
        });
    });
});