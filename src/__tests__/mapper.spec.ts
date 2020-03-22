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
  @mapFunction()
  customMapFunction(data: any, source: string) {
    this.name = "overriden";
    console.log('got called with', data, source);
    // expect(data).toBeTruthy();
    // expect(data.somethingElse).toEqual("else");
    // expect(source).toEqual("default");
  }
}
describe("mapper", () => {
  describe("mapping from json", () => {
    it("returns empty default class with empty json", () => {
      const mapped = Mapper.mapTo<TestClass>(TestClass, {});
      expect(mapped).toBeTruthy();
    });

    it("assigns values without maps", () => {
      const mapped = Mapper.mapTo<TestClass>(TestClass, {
        propWithNoMap: "prop value"
      });
      expect(mapped).toBeTruthy();
      expect(mapped.propWithNoMap).toEqual("prop value");
    });

    it("assigns values with maps", () => {
      const mapped = Mapper.mapTo<TestClass>(TestClass, {
        jsonName: "a name"
      });
      expect(mapped).toBeTruthy();
      expect(mapped.name).toEqual("a name");
    });

    it("assigns values with maps with custom sources", () => {
      const mapped = Mapper.mapTo<TestClass>(TestClass, {
        customSourceName: "a name"
      }, 'custom source');
      expect(mapped).toBeTruthy();
      expect(mapped.name).toEqual("a name");
    });

    it("calls custom mapping function if defined", () => {
      const mapped = Mapper.mapTo<TestClass>(TestClass, { jsonName: "a name", somethingElse: "else" });
      expect(mapped.name).toEqual("overriden");
    });
  });
});
