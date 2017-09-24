/* eslint-env jest */
import m from 'mithril'
import Atom from '@isthmus/atom'
import R from 'ramda'
import connect from 'index'

describe('connect', () => {
  it('should return a component', () => {
    const result = connect()(() => () => m('div', 'abc'))
    expect(typeof result.view).toEqual('function')
  })

  it('should create a proxy model', () => {
    connect.set(Atom({ count: 0 }))
    const Component = connect({
      actions: {
        sub: model => () => model.over('count', R.add(1)),
        add: model => () => model.over('count', R.add(1))
      }
    })(() => ({ model }) => model.get('count'))

    const vnode = {
      state: Object.create(Component)
    }

    Component.oninit.call(vnode.state, vnode)
    expect(Component.view.call(vnode.state, vnode)).toEqual(0)
    vnode.state.actions.add()
    expect(Component.view.call(vnode.state, vnode)).toEqual(1)

    Component.onremove.call(vnode.state, vnode)
    expect(vnode.state.atoms.model.type).toEqual('@@isthmus/atom/ended')

    expect(() => vnode.state.actions.add()).toThrow()
  })

  it('should bind actions with present over model', () => {
    const model = Atom({ count: 0 })

    function present ({ type }) {
      if (type === 'INCREMENT') model.over('count', R.add(1))
      if (type === 'DECREMENT') model.over('count', R.add(-1))
    }

    connect.set(model, present)

    const Component = connect({
      actions: {
        add: present => () => present({ type: 'INCREMENT' }),
        sub: present => () => present({ type: 'DECREMENT' })
      }
    })(() => ({ model }) => model.get('count'))

    const vnode = {
      state: Object.create(Component)
    }

    Component.oninit.call(vnode.state, vnode)
    expect(Component.view.call(vnode.state, vnode)).toEqual(0)
    vnode.state.actions.add()
    expect(Component.view.call(vnode.state, vnode)).toEqual(1)
  })
})
