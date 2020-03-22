import { field, getField } from "../field";

declare var global: any

describe(`Field decorator`, () => {
  beforeEach(() => {
    global.Reflect = {
      defineMetadata: jest.fn(),
      getMetadata: jest.fn(),
    }
  })

  it(`defines metadata`, () => {
    field('test value', 'test source')({ constructor: 'target' }, 'prop');

    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { 'proptest source': 'test value' },
      'target'
    )
  })

  it(`does not override existing metadata`, () => {
    global.Reflect.getMetadata.mockReturnValue({ 'propdrugisors': 'drugival' });
    field('test value', 'test source')({ constructor: 'target' }, 'prop');

    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { 'proptest source': 'test value', 'propdrugisors': 'drugival' },
      'target'
    )
  })

  it('calls into reflect getMetadata', () => {
    global.Reflect.getMetadata.mockReturnValue({ 'proporacle': 'test' })
    let resp = getField('tgt', 'prop', 'oracle')
    expect(Reflect.getMetadata).toBeCalledWith(
      expect.anything(),
      'tgt')
    expect(resp).toEqual('test')
  })

  it('returns undefined if prop not decorated', () => {
    global.Reflect.getMetadata.mockReturnValue(undefined)
    let resp = getField('tgt', 'prop', 'oracle')
    expect(Reflect.getMetadata).toBeCalledWith(
      expect.anything(),
      'tgt')
    expect(resp).toEqual(undefined)
  })

  it('falls back to default source', () => {
    field('test name')({ constructor: 'target' }, 'prop');
    expect(Reflect.defineMetadata).toHaveBeenCalledWith(
      expect.anything(),
      { 'propdefault': 'test name' },
      'target'
    )

    global.Reflect.getMetadata.mockReturnValue({ 'propdefault': 'test name' })
    let resp = getField('tgt', 'prop')
    expect(Reflect.getMetadata).toBeCalledWith(
      expect.anything(),
      'tgt'
    )
    expect(resp).toEqual('test name');
  })
})
