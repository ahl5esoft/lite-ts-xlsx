export interface IEnumItem {
    readonly value: number;
    readonly key?: string;
    readonly text?: string;
}

export interface IEnum<T extends IEnumItem> {
    readonly allItem: Promise<{ [value: number]: T }>;
}

export interface IEnumFactory {
    build<T extends IEnumItem>(name: string): IEnum<T>;
}