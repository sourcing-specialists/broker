import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import Auth from './auth.js'
import Settings from './settings.js'
import Cart from './cart.js'

Vue.use(Vuex)

const authentication = Auth

const appSettings = Settings

const cart = Cart

const store = new Vuex.Store({
  modules: {
    auth: authentication,
    appSettings: appSettings,
    cart: cart
  },
  plugins: [createPersistedState()],
})

export default store