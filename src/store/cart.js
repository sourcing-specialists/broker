import Vue from 'vue'
import mixins from '../mixins'
import Axios from 'axios'
//import _ from 'lodash'

const defaultState = () => {
  return {
    cargo: {},
    products: [],
    company: {},
    distribution: {}
  }
}

const cart = {
  state: defaultState(),
  mutations: {
    add(state, product) {
      if(product.quantity < product.min_order) {
        Vue.toasted.error('Product quantity must be greater or equal to '+product.min_order)
        return
      }
      const tier = mixins.methods.getTier(product.tiers, product.quantity)
      product.price = tier
      product.subtotal = mixins.methods.round((tier.cost_per_carton*product.quantity) ,2)
      product.formatted_subtotal = mixins.methods.round((tier.cost_per_carton*product.quantity) ,2)
      state.products.push(product)
      Vue.toasted.success('Product added')
    },
    update(state, { product, addUp, failedUpdate }) {
      const existing = state.products.find(x => x.id === product.id)
      const quantity = addUp === true ? existing.quantity+product.quantity : product.quantity 
      const tier = mixins.methods.getTier(existing.tiers, quantity)
      existing.quantity = quantity
      existing.price = tier
      existing.subtotal = mixins.methods.round((tier.cost_per_carton*quantity) ,2)
      existing.formatted_subtotal = mixins.methods.round((tier.cost_per_carton*quantity) ,2)
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
    clear(state) {
      // Merge rather than replace so we don't lose observers
      // https://github.com/vuejs/vuex/issues/1118
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
    }
  },
  actions: {
    addToCart({state, commit, dispatch, getters}, product) {
      //check if cargo has space with the quantities that want to be add
      if(!mixins.methods.cargoHasSpace(getters.cargoAvCbm, product)) {
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
      dispatch('getDistribution')
    },
    removeFromCart({commit}, id) {
      Vue.toasted.success('Product deleted successfully')
      commit('remove', id)
    },
    clearCart({commit}) {
      commit('clear')
    },
    updateQuantity({state, commit, dispatch, getters}, updates) {

      const item = state.products.find(i => i.id === updates.id)

      if(!mixins.methods.cargoHasSpace(getters.cargoAvCbm, { cbm_per_carton: item.cbm_per_carton, quantity: Math.abs(item.quantity-updates.quantity) })) {
        commit('update', { product: { id: updates.id, quantity: item.quantity }, failedUpdate: 'capacity' })
        return
      }

      if(updates.quantity == 0 || updates.quantity == '') {
        commit('remove', updates.id)
      } else if(updates.quantity < item.min_order) {
        commit('update', { product: { id: updates.id, quantity: item.min_order }, failedUpdate: 'min' })
      } else {
        commit('update', { product: { id: updates.id, quantity: updates.quantity }})
        dispatch('getDistribution')
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
    confirmOrder({state, getters}) {
      return new Promise((resolve, reject) => {
        Axios.post(mixins.methods.endpoint('order/create'), {
          reference: '',
          customer_id: getters.company.id,
          currency: getters.getCurrency,
          cargo_id: state.cargo.id,
          products: state.products
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
    getDistribution({commit, getters}) {
      return new Promise((resolve, reject) => {
        Axios.get(mixins.methods.endpoint('distribution/get'), {
          params: {
            origin_zone: getters.origin_zone,
            destination_zone: getters.destination_zone,
            cbm: getters.cbm,
            currency: getters.getCurrency
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
    total: (state, getters) => getters.subtotal+getters.distribution.cost_total
  }
}

export default cart