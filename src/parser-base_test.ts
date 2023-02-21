import { strictEqual } from 'assert';

import { ParserBase } from './parser-base';

class Self extends ParserBase {
    protected async getWorkbook() {
        return null;
    }
}

describe('src/parser-base.ts', () => {
    describe('.getSheetRange(sheet: WorkSheet)', () => {
        it('ok', async () => {
            const self = new Self(null, null);

            const fn = Reflect.get(self, 'getSheetRange').bind(self) as (_: any) => string;
            const res = fn({
                '!ref': 'A1:XEX3557',
                'A1': { v: 'id' },
                'E1': { v: 'cht' },
                'T1': { v: '' },
                'A20': { v: '1' },
                'E50': { v: '2' },
                'T100': { v: '' }
            });
            strictEqual(res, 'A1:E50');
        });
    });
});