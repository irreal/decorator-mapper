import "reflect-metadata";
const MAP_FROM_KEY = Symbol("mapFrom");

export enum MapDirection {
  FromJson,
  ToJson,
}
export const mapFunction = (
  mapDirection: MapDirection = MapDirection.FromJson,
  source = "default"
): MethodDecorator => {
  return (target: any, propertyKey: string | symbol, _: PropertyDescriptor) => {
    const classConstructor = target.constructor;
    const metadata = Reflect.getMetadata(MAP_FROM_KEY, classConstructor) || {};
    metadata[`${source}${MapDirection[mapDirection]}`] = propertyKey;
    Reflect.defineMetadata(MAP_FROM_KEY, metadata, classConstructor);
  };
};

export function getMapFunction(
  type: any,
  mapDirection: MapDirection = MapDirection.FromJson,
  source = "default"
) {
  const allMetadata = Reflect.getMetadata(MAP_FROM_KEY, type) || {};
  return allMetadata[`${source}${MapDirection[mapDirection]}`];
}
