import 'reflect-metadata';
export declare enum MapDirection {
    FromJson = 0,
    ToJson = 1
}
export declare const mapFunction: (mapDirection?: MapDirection, source?: string) => MethodDecorator;
export declare function getMapFunction(type: any, mapDirection?: MapDirection, source?: string): any;
