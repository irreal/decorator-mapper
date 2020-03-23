import { getField } from "./field";
import { getMapFunction, MapDirection } from "./mapFunction";

export class Mapper {
  static mapFromJson<T>(type: new () => T, data: any, source = "default"): T {
    const instance = new type();

    Object.keys(instance).forEach(key => {
      const mappedName = getField(type, key, source);
      if (mappedName && data[mappedName]) {
        instance[key] = data[mappedName];
        return;
      }
      if (data[key]) instance[key] = data[key];
    });
    const customMapFunction = getMapFunction(
      type,
      MapDirection.FromJson,
      source
    );
    if (customMapFunction) {
      instance[customMapFunction](data, source);
    }
    return instance;
  }

  static mapToJson(instance: object, source = "default"): any {
    const mapped = {};
    Object.keys(instance).forEach(key => {
      const mappedName = getField(instance.constructor, key, source);
      if (mappedName) {
        mapped[mappedName] = instance[key];
        return;
      }
      mapped[key] = instance[key];
    });

    const customMappingFunctionName = getMapFunction(
      instance.constructor,
      MapDirection.ToJson,
      source
    );
    if (customMappingFunctionName) {
      instance[customMappingFunctionName](mapped, source);
    }

    return mapped;
  }
}
