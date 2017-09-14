/* eslint-env jest */
import m from 'mithril'
import connect from 'index'

describe('connect', () => {
  it('should return a component', () => {
    const result = connect()(() => () => m('div', 'abc'))
    expect(typeof result.view).toEqual('function')
  })
})
