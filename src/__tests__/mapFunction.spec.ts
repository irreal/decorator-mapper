import { mapFunction, getMapFunction, MapDirection } from "../mapFunction";

declare var global: any;

class TestClass {}

describe(`Map Function decorator`, () => {
  beforeEach(() => {
    global.Reflect = {
      defineMetadata: jest.fn(),
      getMetadata: jest.fn()
    };
  });

  it(`defines metadata`, () => {
    mapFunction(MapDirection.FromJson, "test source")(TestClass, "prop", {
      value: jest.fn()
    });

    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { "test sourceFromJson": expect.any(Function) },
      TestClass.constructor
    );
  });

  it(`does not override existing metadata`, () => {
    global.Reflect.getMetadata.mockReturnValue({ drugisors: jest.fn() });
    mapFunction(MapDirection.FromJson, "test source")(TestClass, "prop", {
      value: jest.fn()
    });

    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      {
        "test sourceFromJson": expect.any(Function),
        drugisors: expect.any(Function)
      },
      TestClass.constructor
    );
  });

  it("calls into reflect getMetadata", () => {
    global.Reflect.getMetadata.mockReturnValue({ oracleFromJson: jest.fn() });
    const resp = getMapFunction(TestClass, MapDirection.FromJson, "oracle");
    expect(Reflect.getMetadata).toBeCalledWith(expect.anything(), TestClass);
    expect(resp).toEqual(expect.any(Function));
  });

  it("returns undefined if method not decorated", () => {
    global.Reflect.getMetadata.mockReturnValue(undefined);
    const resp = getMapFunction(TestClass, MapDirection.FromJson, "oracle");
    expect(Reflect.getMetadata).toBeCalledWith(expect.anything(), TestClass);
    expect(resp).toEqual(undefined);
  });

  it("falls back to default source", () => {
    mapFunction()(TestClass, "prop", { value: jest.fn() });
    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { defaultFromJson: expect.any(Function) },
      TestClass.constructor
    );

    global.Reflect.getMetadata.mockReturnValue({ defaultFromJson: jest.fn() });
    const resp = getMapFunction(TestClass);
    expect(Reflect.getMetadata).toBeCalledWith(expect.anything(), TestClass);
    expect(resp).toEqual(expect.any(Function));
  });

  it("gets property descriptor if not passed in", () => {
    const fn = jest.fn();
    fn.mockReturnValue({ value: jest.fn() });
    Object.getOwnPropertyDescriptor = fn;
    const ret = mapFunction() as any;
    ret(TestClass, "prop");
    expect(Object.getOwnPropertyDescriptor).toHaveBeenCalledWith(
      TestClass,
      "prop"
    );
  });
});
