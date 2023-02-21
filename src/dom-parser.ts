import { ParserFactoryBase } from 'lite-ts-parser';
import { read, WorkBook } from 'xlsx';

import { IEnumFactory } from './i-enum-factory';
import { ParserBase } from './parser-base';

export interface IProgressBar {
    hide(): void;
    show(): void;
}

export class DomParser extends ParserBase {
    public constructor(
        private m_ProgressBar: IProgressBar,
        enumFactory: IEnumFactory,
        parserFactory: ParserFactoryBase,
    ) {
        super(enumFactory, parserFactory);
    }

    protected async getWorkbook(domSelector: string) {
        this.m_ProgressBar?.show();

        const el = document.querySelector(domSelector) as any;
        return new Promise<WorkBook>((s, f) => {
            const reject = f;
            f = arg => {
                this.m_ProgressBar?.hide();
                reject(arg);
            };

            const file = el.files[0];
            const ext = file.name.split('.').pop();
            if (ext !== 'xlsx' && ext !== 'xls')
                return f('只能选择excel文件导入');

            const reader = new FileReader();
            reader.onload = async e => {
                const excel = read(e.target.result, {
                    type: 'binary',
                });
                el.value = null;
                s(excel);
            };
            reader.onerror = () => {
                el.value = null;
                f('转义错误');
            };
            reader.readAsBinaryString(file);
        });
    }
}