import { getField } from "./field";
import { getMapFunction, MapDirection } from "./mapFunction";

export class Mapper {
  static mapTo<T>(type: new () => T, data: any, source = "default"): T {
    const instance = new type();

    Object.keys(instance).forEach(key => {
      const mappedName = getField(type, key, source);
      if (mappedName && data[mappedName]) {
        instance[key] = data[mappedName];
        return;
      }
      if (data[key]) instance[key] = data[key];
    });
    let customMapFunction = getMapFunction(type, MapDirection.FromJson, source);
    if (customMapFunction) {
      instance[customMapFunction](data, source);
    }
    return instance;
  }
}
