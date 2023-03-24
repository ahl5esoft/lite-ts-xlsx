import { deepStrictEqual } from 'assert';
import { ParserFactory } from 'lite-ts-parser';

import { FileParser as Self } from './file-parser';
import { IEnumItem } from './i-enum-factory';

describe('src/file-parser.ts', () => {
    describe('.parser(v: string)', () => {
        it.only('ok', async () => {
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
                            1: { value: 1, text: '鲈鱼历史最高重量数值' },
                            2: { value: 2, text: '鲫鱼历史最高重量数值' },
                            3: { value: 3, text: '所有装备基础攻击' },
                            4: { value: 4, text: '所有装备基础血量' },
                            5: { value: 5, text: '负伤减免' },
                            6: { value: 6, text: '每5秒恢复血量' },
                            7: { value: 7, text: '死亡恢复生命' },
                        });
                    else
                        this.enum[name] = new CustomEnum();
                    return this.enum[name];
                }
            };
            const self = new Self(enumFactory, new ParserFactory(enumFactory, {}, {}));
            const res = await self.parse('/Users/mac/Desktop/D-钓鱼-服-1.6(确定版1).xlsx');
            deepStrictEqual(res.FetterData, {
                rows: [
                    {
                        value: 1,
                        nameBase: '枫林弯',
                        collectType: [
                            {
                                key: 'collcet_name_1_1',
                                text: '没什么特别',
                                property: [{ count: 1, valueType: 3 }, { count: 1, valueType: 4 }]
                            },
                            {
                                key: 'collcet_name_1_2',
                                text: '华丽蜕变',
                                property: [
                                    { count: 1, valueType: 5 },
                                    { count: 1, valueType: 6 },
                                    { count: 1, valueType: 7 }
                                ]
                            }
                        ],
                        fishes: [{ maxWeight: 1 }, { maxWeight: 2 }]
                    },
                    { value: 2, nameBase: '喵村郊外' }
                ],
                columns: [
                    { field: 'value', title: '图鉴编号', type: 'int' },
                    { field: 'nameBase', title: '名字(策划看)', type: 'string' }
                ]
            });
        });

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
                            1: { value: 1, text: '每日登录次数' },
                            2: { value: 2, text: '每日挑战章节成功次数' },
                            3: { value: 3, text: '每日挑战章节失败次数' },
                        });
                    else
                        this.enum[name] = new CustomEnum();
                    return this.enum[name];
                }
            };
            const self = new Self(enumFactory, new ParserFactory(enumFactory, {}, {}));
            const res = await self.parse('/Users/mac/Desktop/科技装置商店模版最终版.xlsx');
            deepStrictEqual(res.ShopData, [
                {
                    value: 1,
                    name: '常驻',
                    order: 1,
                    oneExpendNum: 240,
                    tenExpendNum: 2100,
                    openTime: 0,
                    timeHide: 0,
                    timeEnd: 0,
                    videoNum: 1,
                    popup: {
                        todayCheckValueType: 1,
                        weight: 1,
                        condition: {
                            loginPopup: [[{ count: 1, op: '=', valueType: 1 }]],
                            challengeSucceedPopup: [[{ count: 1, op: '=', valueType: 2 }]],
                            challengeFailPopup: [[{ count: 1, op: '=', valueType: 3 }]]
                        }
                    }
                },
                {
                    value: 2,
                    name: '时间',
                    order: 2,
                    oneExpendNum: 240,
                    tenExpendNum: 2100,
                    openTime: '2023-02-05 00:00:00',
                    timeHide: '2023-10-05 00:00:00',
                    timeEnd: '2023-10-05 00:00:00',
                    videoNum: 1,
                    popup: {
                        todayCheckValueType: 1,
                        weight: 1,
                        condition: {
                            loginPopup: [[{ count: 1, op: '=', valueType: 1 }]],
                            challengeSucceedPopup: [[{ count: 1, op: '=', valueType: 2 }]],
                            challengeFailPopup: [[{ count: 1, op: '=', valueType: 3 }]]
                        }
                    }
                }
            ]);
        });
    });
});