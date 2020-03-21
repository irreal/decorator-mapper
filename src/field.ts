import 'reflect-metadata'

// const fieldMetadataKey = Symbol('field-metadata-key')
export function field(name: string, source = 'default') {
  return Reflect.metadata(`dcmapper${source}`, name)
}

export function getField(
  target: any,
  propertyKey: string,
  source = 'default'
): string {
  return Reflect.getMetadata(
    `dcmapper${source}`,
    target,
    propertyKey
  );
}
