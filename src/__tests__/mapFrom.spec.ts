import { mapFrom, getMappedFromFunction } from "../mapFrom";

declare var global: any

class TestClass {

}

describe(`Map From decorator`, () => {
  beforeEach(() => {
    global.Reflect = {
      defineMetadata: jest.fn(),
      getMetadata: jest.fn(),
    }
  })

  it(`defines metadata`, () => {
    mapFrom('test source')(TestClass, 'prop', { value: jest.fn() });

    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { 'test source': expect.any(Function) },
      TestClass.constructor
    )
  })

  it(`does not override existing metadata`, () => {
    global.Reflect.getMetadata.mockReturnValue({ 'drugisors': jest.fn() });
    mapFrom('test source')(TestClass, 'prop', { value: jest.fn() });

    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { 'test source': expect.any(Function), 'drugisors': expect.any(Function) },
      TestClass.constructor
    )
  })

  it('calls into reflect getMetadata', () => {
    global.Reflect.getMetadata.mockReturnValue({ 'oracle': jest.fn() })
    let resp = getMappedFromFunction(TestClass, 'oracle')
    expect(Reflect.getMetadata).toBeCalledWith(
      expect.anything(),
      TestClass)
    expect(resp).toEqual(expect.any(Function));
  })

  it('returns undefined if method not decorated', () => {
    global.Reflect.getMetadata.mockReturnValue(undefined)
    let resp = getMappedFromFunction(TestClass, 'oracle')
    expect(Reflect.getMetadata).toBeCalledWith(
      expect.anything(),
      TestClass)
    expect(resp).toEqual(undefined)
  })

  it('falls back to default source', () => {
    mapFrom()(TestClass, 'prop', { value: jest.fn() });
    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { 'default': expect.any(Function) },
      TestClass.constructor
    )

    global.Reflect.getMetadata.mockReturnValue({ 'default': jest.fn() })
    let resp = getMappedFromFunction(TestClass);
    expect(Reflect.getMetadata).toBeCalledWith(
      expect.anything(),
      TestClass
    )
    expect(resp).toEqual(expect.any(Function));
  })

  it('gets property descriptor if not passed in', () => {
    let fn = jest.fn();
    fn.mockReturnValue({ value: jest.fn() });
    Object.getOwnPropertyDescriptor = fn;
    let ret = mapFrom() as any;
    ret(TestClass, 'prop');
    expect(Object.getOwnPropertyDescriptor).toHaveBeenCalledWith(TestClass, 'prop');
  })
})
