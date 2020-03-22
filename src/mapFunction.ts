import 'reflect-metadata'
const MAP_FROM_KEY = Symbol("mapFrom");

export enum MapDirection { FromJson, ToJson };
export const mapFunction = (mapDirection: MapDirection = MapDirection.FromJson, source = 'default'): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) as PropertyDescriptor;
        }
        var classConstructor = target.constructor;
        const metadata = Reflect.getMetadata(MAP_FROM_KEY, classConstructor) || {};
        metadata[`${source}${MapDirection[mapDirection]}`] = descriptor.value;
        Reflect.defineMetadata(MAP_FROM_KEY, metadata, classConstructor);
    };
};

export function getMapFunction(type: any, mapDirection: MapDirection = MapDirection.FromJson, source = "default") {
    let allMetadata = Reflect.getMetadata(MAP_FROM_KEY, type) || {};
    return allMetadata[`${source}${MapDirection[mapDirection]}`];
}
