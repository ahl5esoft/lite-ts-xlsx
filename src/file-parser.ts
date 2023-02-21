import { readFile } from 'xlsx';

import { ParserBase } from './parser-base';

export class FileParser extends ParserBase {
    protected async getWorkbook(filePath: string) {
        return readFile(filePath, {
            type: 'file'
        });
    }
}