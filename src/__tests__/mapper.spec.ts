import { Mapper } from "../mapper";
import { field } from "../field";
import { mapFunction } from "../mapFunction";

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
      const mapped = Mapper.mapTo<TestClass>(TestClass, {});
      expect(mapped).toBeTruthy();
      expect(mapped).toEqual(new TestClass());
    });

    it("assigns values without maps", () => {
      const mapped = Mapper.mapTo<TestClass>(TestClass, {
        propWithNoMap: "prop value",
      });
      expect(mapped).toBeTruthy();
      expect(mapped.propWithNoMap).toEqual("prop value");
    });

    it("assigns values with maps", () => {
      const mapped = Mapper.mapTo<TestClass>(TestClass, {
        jsonName: "a name",
      });
      expect(mapped).toBeTruthy();
      expect(mapped.name).toEqual("a name");
    });

    it("assigns values with maps with custom sources", () => {
      const mapped = Mapper.mapTo<TestClass>(
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
      const mapped = Mapper.mapTo<TestClass>(TestClass, {
        jsonName: "a name",
        somethingElse: "something else",
      });
      expect(mapped.propToOverride).toEqual("overriden");
    });
  });
});
