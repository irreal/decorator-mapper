import 'reflect-metadata';
export declare function field(name: string, source?: string): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function getField(target: any, propertyKey: string, source?: string): string;
