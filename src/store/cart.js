import mixins from '../mixins'

const defaultState = () => {
  return {
    products: [],
    company: {}
  }
}

const cart = {
  state: defaultState(),
  mutations: {
    add(state, product) {
      //check if exist option exist
      const record = state.products.find(p => p.id === product.id)
      if(!record) {
        state.products.push(product)
      } else {
        record.quantity = record.quantity+product.quantity
      }
    },
    update(state, product) {
      const ind = state.products.findIndex(x => x.id == product.id)
      const tier = mixins.methods.getTier(state.products[ind].tiers, product.quantity)
      state.products[ind].quantity = product.quantity
      state.products[ind].price = tier
      state.products[ind].subtotal = mixins.methods.fixDigits(tier.cost_per_carton*product.quantity)
      state.products[ind].formatted_subtotal = mixins.methods.formattedNumber(tier.cost_per_carton*product.quantity)
    },
    remove(state, id) {
      state.products = state.products.filter( function(val) {
        return val.id != id
      })
    },
    clear(state) {
      // Merge rather than replace so we don't lose observers
      // https://github.com/vuejs/vuex/issues/1118
      Object.assign(state, defaultState())
    },
    company(state, company) {
      state.company = company
    }
  },
  actions: {
    addToCart({commit}, product) {
      commit('add', product)
    },
    removeFromCart({commit}, id) {
      commit('remove', id)
    },
    clearCart({commit}) {
      commit('clear')
    },
    updateQuantity({commit}, updates) {
      commit('update', updates)
    },
    setCompany({commit}, company) {
      commit('company', company)
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
  }
}

export default cart