import { deepStrictEqual, strictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';
import { ParserFactory } from 'lite-ts-parser';

import { IEnum, IEnumFactory, IEnumItem } from './i-enum-factory';
import { ParserBase } from './parser-base';

class Self extends ParserBase {
    protected async getWorkbook() {
        return {
            SheetNames: ['ValueTypeData$', 'ValueTypeData$.fixed'],
            Sheets: {
                'ValueTypeData$': {
                    '!ref': 'A1:D5',
                    A1: {
                        t: 's',
                        v: 'value:int',
                        r: '<t>value:int</t>',
                        h: 'value:int',
                        w: 'value:int'
                    },
                    B1: {
                        t: 's',
                        v: 'material:数值数组',
                        r: '<t>material:数值数组</t>',
                        h: 'material:数值数组',
                        w: 'material:数值数组'
                    },
                    C1: {
                        t: 's',
                        v: 'cycle:int',
                        r: '<t>cycle:int</t>',
                        h: 'cycle:int',
                        w: 'cycle:int'
                    },
                    D1: {
                        t: 's',
                        v: 'randRewards:奖励',
                        r: '<t>randRewards:奖励</t>',
                        h: 'randRewards:奖励',
                        w: 'randRewards:奖励'
                    },
                    A2: { t: 's', v: '层数', r: '<t>层数</t>', h: '层数', w: '层数' },
                    B2: { t: 's', v: '对应材料', r: '<t>对应材料</t>', h: '对应材料', w: '对应材料' },
                    C2: { t: 's', v: '是否循环', r: '<t>是否循环</t>', h: '是否循环', w: '是否循环' },
                    D2: { t: 's', v: '随机掉落', r: '<t>随机掉落</t>', h: '随机掉落', w: '随机掉落' },
                    A3: { t: 'n', v: 1, w: '1' },
                    B3: { t: 's', v: '土壤*10', r: '<t>土壤*10</t>', h: '土壤*10', w: '土壤*10' },
                    C3: { t: 'n', v: 0, w: '0' },
                    D3: {
                        t: 's',
                        v: '钞票*500*1\n钞票*0*999',
                        r: '<r><t>钞票*500*1</t></r><r><rPr><sz val="10"/><color theme="1"/><rFont val="宋体"/><charset val="134"/></rPr><t xml:space="preserve">&#10;钞票*0*999</t></r>',
                        h: '钞票*500*1<span style="font-size:10pt;"><br/>钞票*0*999</span>',
                        w: '钞票*500*1\n钞票*0*999'
                    },
                    '!margins': {
                        left: 0.75,
                        right: 0.75,
                        top: 1,
                        bottom: 1,
                        header: 0.511805555555556,
                        footer: 0.511805555555556
                    }
                },
                'ValueTypeData$.fixed': {
                    '!ref': 'A1:D4',
                    A1: {
                        t: 's',
                        v: 'value:int',
                        r: '<t>value:int</t>',
                        h: 'value:int',
                        w: 'value:int'
                    },
                    B1: {
                        t: 's',
                        v: 'index:int',
                        r: '<t>index:int</t>',
                        h: 'index:int',
                        w: 'index:int'
                    },
                    C1: {
                        t: 's',
                        v: 'rewards:数值数组',
                        r: '<t>rewards:数值数组</t>',
                        h: 'rewards:数值数组',
                        w: 'rewards:数值数组'
                    },
                    D1: {
                        t: 's',
                        v: 'conditions:json',
                        r: '<t>conditions:json</t>',
                        h: 'conditions:json',
                        w: 'conditions:json'
                    },
                    A2: { t: 's', v: '层数', r: '<t>层数</t>', h: '层数', w: '层数' },
                    B2: { t: 's', v: '索引', r: '<t>索引</t>', h: '索引', w: '索引' },
                    C2: { t: 's', v: '固定掉落', r: '<t>固定掉落</t>', h: '固定掉落', w: '固定掉落' },
                    D2: { t: 's', v: '产物坐标', r: '<t>产物坐标</t>', h: '产物坐标', w: '产物坐标' },
                    A3: { t: 'n', v: 1, w: '1' },
                    B3: { t: 'n', v: 0, w: '0' },
                    C3: {
                        t: 's',
                        v: '废弃轮胎*1',
                        r: '<t>废弃轮胎*1</t>',
                        h: '废弃轮胎*1',
                        w: '废弃轮胎*1'
                    },
                    D3: {
                        t: 's',
                        v: '[1,1,3,2]',
                        r: '<t>[1,1,3,2]</t>',
                        h: '[1,1,3,2]',
                        w: '[1,1,3,2]'
                    },
                    A4: { t: 'n', v: 1, w: '1' },
                    B4: { t: 'n', v: 1, w: '1' },
                    C4: { t: 's', v: '土疙瘩*1', r: '<t>土疙瘩*1</t>', h: '土疙瘩*1', w: '土疙瘩*1' },
                    D4: {
                        t: 's',
                        v: '[10,11,3,2]',
                        r: '<t>[10,11,3,2]</t>',
                        h: '[10,11,3,2]',
                        w: '[10,11,3,2]'
                    },
                    '!margins': {
                        left: 0.75,
                        right: 0.75,
                        top: 1,
                        bottom: 1,
                        header: 0.5,
                        footer: 0.5
                    }
                }
            }
        };
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

    describe('.parse(v: string)', () => {
        it('ok', async () => {
            const enumFactoryMock = new Mock<IEnumFactory>();
            const self = new Self(enumFactoryMock.actual, new ParserFactory(enumFactoryMock.actual, {}, {}));
            const valueTypeDataMock = new Mock<IEnum<IEnumItem>>();
            valueTypeDataMock.expectReturn(
                r => r.get(mockAny),
                {
                    value: 1,
                    text: '土壤'
                }
            );
            valueTypeDataMock.expectReturn(
                r => r.get(mockAny),
                {
                    value: 2,
                    text: '钞票'
                }
            );
            valueTypeDataMock.expectReturn(
                r => r.get(mockAny),
                {
                    value: 2,
                    text: '钞票'
                }
            );
            valueTypeDataMock.expectReturn(
                r => r.get(mockAny),
                {
                    value: 3,
                    text: '废弃轮胎'
                }
            );
            valueTypeDataMock.expectReturn(
                r => r.get(mockAny),
                {
                    value: 4,
                    text: '土疙瘩'
                }
            );
            for (let i = 0; i < 10; i++) {
                enumFactoryMock.expectReturn(
                    r => r.build('ValueTypeData'),
                    valueTypeDataMock.actual
                );
            }
            const res = await self.parse('');
            deepStrictEqual(res, {
                'ValueTypeData$': [
                    {
                        value: 1,
                        material: [
                            {
                                count: 10,
                                valueType: 1
                            }
                        ],
                        cycle: 0,
                        randRewards: [
                            [
                                { count: 500, valueType: 2, weight: 1 },
                                { count: 0, valueType: 2, weight: 999 },
                            ]
                        ],
                        fixed: [
                            {
                                rewards: [
                                    {
                                        count: 1,
                                        valueType: 3
                                    }
                                ],
                                conditions: [1, 1, 3, 2]
                            },
                            {
                                rewards: [
                                    {
                                        count: 1,
                                        valueType: 4
                                    }
                                ],
                                conditions: [10, 11, 3, 2]
                            }
                        ]
                    }
                ],
                'ValueTypeData$.fixed': [
                    {
                        rewards: [{ count: 1, valueType: 3 }],
                        conditions: [1, 1, 3, 2]
                    },
                    {
                        rewards: [{ count: 1, valueType: 4 }],
                        conditions: [10, 11, 3, 2]
                    }
                ]
            });
        });
    });
});