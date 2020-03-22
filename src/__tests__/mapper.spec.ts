import { Mapper } from "../mapper";
import { field } from "../field";

class TestClass {
  @field("jsonName")
  name: string = "";
  id: number = 0;
  entryDate?: Date = undefined;
  propWithNoMap: string = "";
}
describe("mapper", () => {
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
});
