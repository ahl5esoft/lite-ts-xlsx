import { IParser, ParserFactoryBase } from 'lite-ts-parser';
import { read, utils } from 'xlsx';

import { IEnumFactory } from './i-enum-factory';
import { ISheetParseOption, SheetParser } from './sheet-parser';

export interface IProgressBar {
    hide(): void;
    show(): void;
}

export class DomParser implements IParser {
    private m_SheetParser: IParser;
    protected get sheetParser() {
        this.m_SheetParser ??= new SheetParser(this.m_EnumFactory, this.m_ParserFactory);
        return this.m_SheetParser;
    }

    public constructor(
        private m_EnumFactory: IEnumFactory,
        private m_ProgressBar: IProgressBar,
        private m_ParserFactory: ParserFactoryBase,
    ) { }

    public async parse(domSelector: string) {
        this.m_ProgressBar?.show();

        const el = document.querySelector(domSelector) as any;
        return new Promise((s, f) => {
            const reject = f;
            f = arg => {
                this.m_ProgressBar?.hide();
                reject(arg);
            };

            const file = el.files[0];
            const ext = file.name.split('.').pop();
            if (ext !== 'xlsx' && ext !== 'xls')
                return f('只能选择excel文件导入');

            const result = {};
            const reader = new FileReader();
            reader.onload = async e => {
                const data = e.target.result;
                const excel = read(data, {
                    type: 'binary',
                });
                for (const r of excel.SheetNames) {
                    result[r] = await this.sheetParser.parse({
                        rows: utils.sheet_to_json(excel.Sheets[r]),
                        sheetName: r,
                    } as ISheetParseOption);
                }

                el.value = null;
                s(result);
            };
            reader.onerror = () => {
                el.value = null;
                f('转义错误');
            };
            reader.readAsBinaryString(file);
        });
    }
}