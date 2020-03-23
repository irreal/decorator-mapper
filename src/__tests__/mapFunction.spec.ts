import { mapFunction, getMapFunction, MapDirection } from "../mapFunction";

declare var global: any;

class TestClass { }

describe(`Map Function decorator`, () => {
  beforeEach(() => {
    global.Reflect = {
      defineMetadata: jest.fn(),
      getMetadata: jest.fn()
    };
  });

  it(`defines metadata`, () => {
    mapFunction(MapDirection.FromJson, "test source")(TestClass, "mapMethod", {});

    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { "test sourceFromJson": 'mapMethod' },
      TestClass.constructor
    );
  });

  it(`does not override existing metadata`, () => {
    global.Reflect.getMetadata.mockReturnValue({ "existing sourceFromJson": 'existingMethod' });
    mapFunction(MapDirection.FromJson, "new source")(TestClass, "newMethod", {});

    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      {
        "new sourceFromJson": "newMethod",
        "existing sourceFromJson": "existingMethod"
      },
      TestClass.constructor
    );
  });

  it("calls into reflect getMetadata", () => {
    global.Reflect.getMetadata.mockReturnValue({ "test sourceFromJson": 'testMethod' });
    const resp = getMapFunction(TestClass, MapDirection.FromJson, "test source");
    expect(Reflect.getMetadata).toBeCalledWith(expect.anything(), TestClass);
    expect(resp).toEqual("testMethod");
  });

  it("returns undefined if method not decorated", () => {
    global.Reflect.getMetadata.mockReturnValue(undefined);
    const resp = getMapFunction(TestClass, MapDirection.FromJson, "test source");
    expect(Reflect.getMetadata).toBeCalledWith(expect.anything(), TestClass);
    expect(resp).toEqual(undefined);
  });

  it("falls back to default source", () => {
    mapFunction()(TestClass, "testMethod", {});
    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { defaultFromJson: "testMethod" },
      TestClass.constructor
    );

    global.Reflect.getMetadata.mockReturnValue({ defaultFromJson: "testMethod" });
    const resp = getMapFunction(TestClass);
    expect(Reflect.getMetadata).toBeCalledWith(expect.anything(), TestClass);
    expect(resp).toEqual("testMethod");
  });
});
