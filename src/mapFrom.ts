import 'reflect-metadata'
const MAP_FROM_KEY = Symbol("mapFrom");

export const mapFrom = (source = 'default'): MethodDecorator => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) as PropertyDescriptor;
        }
        var classConstructor = target.constructor;
        const metadata = Reflect.getMetadata(MAP_FROM_KEY, classConstructor) || {};
        metadata[source] = descriptor.value;
        Reflect.defineMetadata(MAP_FROM_KEY, metadata, classConstructor);
    };
};

export function getMappedFromFunction(type: any, source = "default") {
    let allMetadata = Reflect.getMetadata(MAP_FROM_KEY, type) || {};
    return allMetadata[source];
}
