import { field, getField } from "../field";

declare var global: any

describe(`Field decorator`, () => {
  beforeEach(() => {
    global.Reflect = {
      metadata: jest.fn(),
      getMetadata: jest.fn(),
    }
  })

  it(`calls into reflect metadata`, () => {
    field('test value', 'test source')

    expect(Reflect.metadata).toHaveBeenCalledWith(
      'dcmappertest source',
      'test value'
    )
  })

  it('calls into reflect getMetadata', () => {
    global.Reflect.getMetadata.mockReturnValue('test')
    let resp = getField('tgt', 'prop', 'oracle')
    expect(Reflect.getMetadata).toBeCalledWith(
      'dcmapperoracle',
      'tgt',
      'prop'
    )
    expect(resp).toEqual('test')
  })

  it('falls back to default source', () => {
    field('test name')
    expect(Reflect.metadata).toBeCalledWith(
      'dcmapperdefault',
      'test name'
    )

    getField('tgt', 'prop')
    expect(Reflect.getMetadata).toBeCalledWith(
      'dcmapperdefault',
      'tgt',
      'prop'
    )
  })
})
