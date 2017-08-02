/* eslint-env jest */
import noop from 'index'

describe('noop', () => {
  it('should do nothing', () => {
    expect(noop()).toBe(undefined)
  })
})
