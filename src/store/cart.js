import Vue from 'vue'
import mixins from '../mixins'
import Axios from 'axios'
//import _ from 'lodash'

const defaultState = () => {
  return {
    cargo: {},
    products: [],
    company: {},
    distribution: {},
    incoterm: '',
    transport: 'sea'
  }
}

const cart = {
  state: defaultState(),
  namespaced: true,
  mutations: {
    add(state, product) {
      if(product.quantity < product.min_order) {
        Vue.toasted.error('Product quantity must be greater or equal to '+product.min_order)
        return
      }
      var price = {
        cost_per_carton: product.cost_per_carton
      }
      //replace with tier prices if REVOOLOOP
      if(state.incoterm === 'REVOOLOOP') {
        price = mixins.methods.getTier(product.tiers, product.quantity)
      }
      product.price = price
      product.subtotal = mixins.methods.round((price.cost_per_carton*product.quantity) ,2)
      product.formatted_subtotal = mixins.methods.round((price.cost_per_carton*product.quantity) ,2)
      state.products.push(product)
      Vue.toasted.success('Product added')
    },
    update(state, { product, addUp, failedUpdate }) {
      const existing = state.products.find(x => x.id === product.id)
      const quantity = addUp === true ? existing.quantity+product.quantity : product.quantity 
      var price = {
        cost_per_carton: existing.cost_per_carton
      }
      //replace with tier prices if REVOOLOOP
      if(state.incoterm === 'REVOOLOOP') {
        price = mixins.methods.getTier(existing.tiers, quantity)
      }
      existing.quantity = quantity
      existing.price = price
      existing.subtotal = mixins.methods.round((price.cost_per_carton*quantity), 2)
      existing.formatted_subtotal = mixins.methods.round((price.cost_per_carton*quantity), 2)
      if(failedUpdate === 'min') {
        Vue.toasted.error('Product quantity must be greater or equal to '+product.quantity)
        return
      }
      if(failedUpdate === 'capacity') {
        Vue.toasted.error('Quantity exceed cargo capacity.')
        return
      }
      Vue.toasted.success('Quantity updated')
    },
    remove(state, id) {
      state.products = state.products.filter( function(val) {
        return val.id != id
      })
    },
    clearProducts(state) {
      state.products = []
    },
    clear(state, clearOnlyItems = false) {
      // Merge rather than replace so we don't lose observers
      // https://github.com/vuejs/vuex/issues/1118
      if(clearOnlyItems) {
        state.products = []
        return
      }
      Object.assign(state, defaultState())
    },
    company(state, company) {
      state.company = company
    },
    setDistribution(state, dist) {
      state.distribution = dist
    },
    setCargo(state, cargo) {
      state.cargo = cargo
    },
    setIncoterm(state, incoterm) {
      state.incoterm = incoterm
    },
    setTransport(state, transport) {
      state.transport = transport
    }
  },
  actions: {
    setIncoterm({commit}, incoterm) {
      commit('setIncoterm', incoterm)
    },
    setTransport({commit}, transport) {
      commit('setTransport', transport)
    },
    addToCart({state, commit, dispatch, getters}, product) {
      
      //check if cargo has space with the quantities that want to be add || IGNORE ON FOB
      if(!mixins.methods.cargoHasSpace(getters.cargoAvCbm, product, state.incoterm)) {
        Vue.toasted.error('Quantity exceed cargo capacity.')
        return
      }
      //check if exist already in cart
      const existing = state.products.find(x => x.id === product.id)
      if(existing) {
        commit('update', { product, addUp: true })
      } else {
        commit('add', product)
      }
      if(state.incoterm === 'REVOOLOOP') {
        dispatch('getDistribution')
      }
    },
    removeFromCart({commit}, id) {
      Vue.toasted.success('Product deleted successfully')
      commit('remove', id)
    },
    clearCart({commit}) {
      commit('clear')
    },
    clearCartItems({commit}) {
      commit('clear', true)
    },
    updateQuantity({state, commit, dispatch, getters}, updates) {

      const item = state.products.find(i => i.id === updates.id)

      if(!mixins.methods.cargoHasSpace(getters.cargoAvCbm, { cbm_per_carton: item.cbm_per_carton, quantity: Math.abs(item.quantity-updates.quantity) }, state.incoterm)) {
        commit('update', { product: { id: updates.id, quantity: item.quantity }, failedUpdate: 'capacity' })
        return
      }

      if(updates.quantity == 0 || updates.quantity == '') {
        commit('remove', updates.id)
      } else if(updates.quantity < item.min_order) {
        commit('update', { product: { id: updates.id, quantity: item.min_order }, failedUpdate: 'min' })
      } else {
        commit('update', { product: { id: updates.id, quantity: updates.quantity }})
        if(state.incoterm === 'REVOOLOOP') {
          dispatch('getDistribution')
        }
      }
    },
    setCompany({commit}, company) {
      commit('company', company)
    },
    cargoSelection({state, commit}, cargo) {
      if(state.cargo != cargo) {
        commit('clearProducts')
        commit('setCargo', cargo)
      }
    },
    confirmOrder({state, getters, rootGetters}) {
      return new Promise((resolve, reject) => {
        Axios.post(mixins.methods.endpoint('order/create'), {
          reference: '',
          customer_id: getters.company.id,
          currency: rootGetters.getCurrency,
          cargo_id: state.cargo.id,
          products: state.products,
          incoterm: state.incoterm
        }).then(resp => {
          if(resp.data.result == true) {
            resolve(resp)
          } else {
            reject(resp)
          }
        }).catch((error) => {
          reject(error)
        })
      })
    },
    getDistribution({commit, getters, rootGetters}) {
      return new Promise((resolve, reject) => {
        Axios.get(mixins.methods.endpoint('distribution/get'), {
          params: {
            origin_zone: getters.origin_zone,
            destination_zone: getters.destination_zone,
            cbm: getters.cbm,
            currency: rootGetters.getCurrency
          }
        }).then(dist => {
          commit('setDistribution', dist.data.data)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    }
  },
  getters: {
    products: state => state.products,
    count: state => state.products.length,
    company: state => state.company,
    subtotal: state => {
      const sum = state.products.map(function(p) {
        return +p.subtotal
      })
      return sum.reduce((a, b) => a + b, 0)
    },
    cbm: state => {
      const sum = state.products.map(function(p) {
        return p.cbm_per_carton*p.quantity
      })
      return sum.reduce((a, b) => a + b, 0)
    },
    origin_zone: state => state.company.warehouse.zone.id,
    destination_zone: state => state.company.zone.id,
    distribution: state => state.distribution,
    cargo: state => state.cargo,
    cargoAvCbm: (state, getters) => {
      return state.cargo.cbm_free-getters.cbm
    },
    total: (state, getters) => {
      var total = getters.subtotal
      if(getters.incoterm === 'REVOOLOOP') {
        total += getters.distribution.cost_total
      }
      return total
    },
    incoterm: (state) => state.incoterm,
    transport: (state) => state.transport
  }
}

export default cart