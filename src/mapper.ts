import { getField } from "./field";

export class Mapper {
  static mapTo<T>(type: new () => T, data: any): T {
    const instance = new type();

    Object.keys(instance).forEach(key => {
      const mappedName = getField(type, key);
      if (mappedName) {
        instance[key] = data[mappedName];
        return;
      }
      if (data[key]) instance[key] = data[key];
    });
    return instance;
  }
}
