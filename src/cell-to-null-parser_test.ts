import { strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { ParserFactoryBase } from 'lite-ts-parser';

import { CellToNullParser as Self } from './cell-to-null-parser';

describe('src/cell-to-null-parser.ts', () => {
    describe('.isMatch()', () => {
        it('text is __EMPTY_x', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const res = self.isMatch('__EMPTY_1');
            strictEqual(res, true);
        });

        it('text is aa:bb', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const res = self.isMatch('aa:bb');
            strictEqual(res, false);
        });

        it('text is null', async () => {
            const mockParserFactory = new Mock<ParserFactoryBase>();
            const self = new Self(mockParserFactory.actual);

            const res = self.isMatch(null);
            strictEqual(res, true);
        });
    });
});