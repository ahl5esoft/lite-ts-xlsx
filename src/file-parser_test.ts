import { deepStrictEqual } from 'assert';
import { ParserFactory } from 'lite-ts-parser';

import { FileParser as Self } from './file-parser';
import { IEnumItem } from './i-enum-factory';

describe('src/file-parser.ts', () => {
    describe('.parser(v: string)', () => {
        it('ok', async () => {
            class CustomEnum {
                public get allItem() {
                    return Promise.resolve(this.m_EnumData);
                }

                public constructor(private m_EnumData = {}) { }

                public async get(predicate: (item: IEnumItem) => boolean) {
                    const allItem = await this.allItem;
                    return Object.values(allItem).find(predicate);
                }
            }

            const enumFactory = {
                enum: {},
                build(name: string) {
                    if (name == 'ValueTypeData')
                        this.enum[name] ??= new CustomEnum({
                            1: { value: 1, text: '钞票' },
                            2: { value: 2, text: '购买手推车容量次数' },
                            3: { value: 3, text: '等级' },
                            4: { value: 4, text: '王二狗等级' },
                            5: { value: 5, text: '购买手推车次数' },
                            6: { value: 6, text: '挖掘层' },
                            7: { value: 7, text: '挖掘力' },
                            8: { value: 8, text: '挖掘速度' },
                            9: { value: 9, text: '背篓空间上限' },
                            10: { value: 10, text: '幸运' },
                            11: { value: 11, text: '移动速度' },
                            1000: { value: 1000, text: '块坐标0-0', block: { x: 0, y: 0 } },
                            1001: { value: 1001, text: '快坐标1-0', block: { x: 1, y: 0 } },
                            1002: { value: 1002, text: '快坐标2-0', block: { x: 2, y: 0 } },
                            1003: { value: 1003, text: '快坐标3-0', block: { x: 3, y: 0 } },
                            1004: { value: 1004, text: '快坐标4-0', block: { x: 4, y: 0 } }
                        });
                    else
                        this.enum[name] = new CustomEnum();
                    return this.enum[name];
                }
            };
            const self = new Self(enumFactory, new ParserFactory(enumFactory, {}, {}));
            const res = await self.parse('/Users/mac/Desktop/配置.xlsx');
            console.dir(res, { depth: null });
            deepStrictEqual(res.WorkerData, [
                {
                    value: 1,
                    levels: [
                        {
                            index: 0,
                            consume: [{ count: -490, valueType: 1 }],
                            rewards: [
                                { count: 85, valueType: 7 },
                                { count: 15, valueType: 8 },
                                { count: 80, valueType: 9 },
                                { count: 50, valueType: 10 },
                                { count: 4, valueType: 11 },
                                { count: 1, valueType: 3 }
                            ]
                        },
                        {
                            index: 1,
                            consume: [{ count: -725, valueType: 1 }],
                            rewards: [
                                { count: 50, valueType: 7 },
                                { count: 54, valueType: 9 },
                                { count: 1, valueType: 3 }
                            ]
                        }
                    ]
                },
                { value: 2 },
                {
                    value: 3,
                    conditions: [[{ count: 5, op: '>=', valueType: 6 }]],
                    consume: [{ count: -2500, valueType: 1 }]
                }
            ]);
        });
    });
});