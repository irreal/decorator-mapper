import 'reflect-metadata';
export declare function field(name: string, source?: string): (target: any, propertyKey: string) => void;
export declare function getField(target: any, propertyKey: string, source?: string): string;
