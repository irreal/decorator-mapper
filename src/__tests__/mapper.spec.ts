// tslint:disable: max-classes-per-file
import { Mapper } from "../mapper";
import { field } from "../field";
import { mapFunction, MapDirection } from "../mapFunction";

class TestClass {
  @field("jsonName")
  @field("customSourceName", "custom source")
  name: string = "";
  id: number = 0;
  entryDate?: Date = undefined;
  propWithNoMap: string = "";
  propToOverride: string = "";
  @mapFunction()
  customMapFunction(data: any, source: string) {
    if (data.somethingElse) {
      this.propToOverride = "overriden";
      expect(data).toBeTruthy();
      expect(data.somethingElse).toEqual("something else");
      expect(source).toEqual("default");
    }
  }
}
describe("mapper", () => {
  describe("mapping from json", () => {
    it("returns empty default class with empty json", () => {
      const mapped = Mapper.mapFromJson<TestClass>(TestClass, {});
      expect(mapped).toBeTruthy();
      expect(mapped).toEqual(new TestClass());
    });

    it("assigns values without maps", () => {
      const mapped = Mapper.mapFromJson<TestClass>(TestClass, {
        propWithNoMap: "prop value",
      });
      expect(mapped).toBeTruthy();
      expect(mapped.propWithNoMap).toEqual("prop value");
    });

    it("assigns values with maps", () => {
      const mapped = Mapper.mapFromJson<TestClass>(TestClass, {
        jsonName: "a name",
      });
      expect(mapped).toBeTruthy();
      expect(mapped.name).toEqual("a name");
    });

    it("assigns values with maps with custom sources", () => {
      const mapped = Mapper.mapFromJson<TestClass>(
        TestClass,
        {
          customSourceName: "a name",
        },
        "custom source"
      );
      expect(mapped).toBeTruthy();
      expect(mapped.name).toEqual("a name");
    });

    it("calls custom mapping function if defined", () => {
      const mapped = Mapper.mapFromJson<TestClass>(TestClass, {
        jsonName: "a name",
        somethingElse: "something else",
      });
      expect(mapped.propToOverride).toEqual("overriden");
    });
  });

  class MapToJsonPlain {
    name: string = "";
    id: number = 0;
  }
  describe("mapping to json", () => {
    it("maps non custom names", () => {
      const instance = new MapToJsonPlain();
      instance.name = "test name";
      instance.id = 3;
      const mapped = Mapper.mapToJson(instance);
      expect(mapped).toEqual(instance);
    });

    class MapToJsonCustom {
      @field("customName")
      name: string = "";
      id: number = 3;
    }
    it("maps custom names in default source", () => {
      const instance = new MapToJsonCustom();
      instance.name = "test name";
      const mapped = Mapper.mapToJson(instance);
      expect(mapped).toEqual(
        expect.objectContaining({ customName: "test name", id: 3 })
      );
    });

    class MapToJsonCustomSource {
      @field("customName", "custom source")
      name: string = "";
    }

    it("maps custom names from a custom source", () => {
      const instance = new MapToJsonCustomSource();
      instance.name = "test name";
      const mapped = Mapper.mapToJson(instance, "custom source");
      expect(mapped).toEqual({ customName: "test name" });
    });

    class MapToJsonCustomFunction {
      name: string = "";
      @mapFunction(MapDirection.ToJson)
      customToJsonFunction(mappedJson: any, _: string) {
        mappedJson.name = "overriden name";
      }
    }

    it("calls custom mapping function if defined", () => {
      const instance = new MapToJsonCustomFunction();
      instance.name = "test name";
      const mapped = Mapper.mapToJson(instance);
      expect(mapped.name).toEqual("overriden name");
    });

    class MapToJsonCustomFunctionCustomSource {
      name: string = "";

      @mapFunction(MapDirection.ToJson)
      customToJsonFunction(_: any, __: any) {
        fail(new Error("called incorrect mapping function"));
      }
      @mapFunction(MapDirection.ToJson, "custom source")
      customToJsonCustomSourceFunction(mappedJson: any, source: string) {
        expect(source).toEqual("custom source");
        mappedJson.name = "overriden";
      }
    }
    it("calls custom mapping function for custom source", () => {
      const instance = new MapToJsonCustomFunctionCustomSource();
      instance.name = "test name";
      const mapped = Mapper.mapToJson(instance, "custom source");
      expect(mapped.name).toEqual("overriden");
    });
  });
});
