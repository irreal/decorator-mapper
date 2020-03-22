import "reflect-metadata";

const FIELD_KEY = Symbol("field");

export function field(name: string, source = "default") {
  return (target: any, propertyKey: string) => {
    const classConstructor = target.constructor;
    const metadata = Reflect.getMetadata(FIELD_KEY, classConstructor) || {};
    metadata[`${propertyKey}${source}`] = name;
    Reflect.defineMetadata(FIELD_KEY, metadata, classConstructor);
  };
}

export function getField(
  target: any,
  propertyKey: string,
  source = "default"
): string {
  const allData = Reflect.getMetadata(FIELD_KEY, target) || {};
  return allData[`${propertyKey}${source}`];
}
