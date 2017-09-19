// @isthmus/mithril - Copyright (c) 2017, Zach Dahl; This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree
const Component = {
  getData (vnode) {
    return {
      ...vnode.attrs,
      ...vnode.state.actions,
      ...vnode.state.atoms,
      vnode,
      children: vnode.children
    }
  },

  oninit (vnode) {
    this.atoms = {}
    this.actions = {}

    if (this.connectModel && this.connectModel.isAtom) {
      this.atoms.model = this.connectModel.view(null)

      if (this.etc.actions) {
        Object.keys(this.etc.actions).map(key => {
          this.actions[key] = this.etc.actions[key](this.atoms.model)
        })
      }
    }

    Object.keys(vnode.attrs || {}).forEach(key => {
      let atom = vnode.attrs[key]

      if (atom && atom.isAtom) {
        atom = atom.view(null)
        this.atoms[key] = atom
      }
    })

    const data = this.getData(vnode)
    this.render = this.component(data)

    if (this.etc.oninit) return this.etc.oninit.call(this, data)
  },

  onbeforeremove (vnode, old) {
    if (this.etc.onbeforeremove) return this.etc.onbeforeremove.call(this, this.getData(vnode), this.getData(old))
  },

  onremove (vnode) {
    Object.keys(this.atoms).forEach(key => {
      const atom = this.atoms[key]
      if (atom.type !== '@@isthmus/atom/ended') {
        atom.end()
      }
    })
    if (this.etc.onremove) return this.etc.onremove.call(this, this.getData(vnode))
  },

  view (vnode) {
    return this.render(this.getData(vnode))
  }
}
;['oncreate', 'onbeforeupdate', 'onupdate'].forEach(method => {
  Component[method] = function (vnode) {
    if (this.etc[method]) return this.etc[method].call(this, this.getData(vnode))
  }
})

const Connect = model => {
  const connect = (etc = {}) => component => {
    const result = Object.create(Component)
    result.etc = etc
    result.component = component
    Object.defineProperty(result, 'connectModel', {
      get () { return model }
    })
    return result
  }

  connect.of = Connect
  connect.get = () => model
  connect.set = pModel => { model = pModel }

  return connect
}

export default Connect({})
