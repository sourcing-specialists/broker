import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import createPersistedState from "vuex-persistedstate";
import Axios from 'axios'

Vue.use(Vuex)

//session module
const authentication = {
  state: () => ({
    auth: false,
    status: '',
    token: '',
    user : 123
  }),
  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, data) {
      state.auth = true
      state.status = 'success'
      state.token = data.token
      state.user = data.user
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.auth = false
      state.status = ''
      state.token = ''
    }
  },
  actions: {
    //login the user 
    login({commit}, user){
      return new Promise((resolve, reject) => {
        //commit('auth_request')
        Axios({url: `${process.env.VUE_APP_API_ENDPOINT}auth`, data: user, method: 'POST' })
        .then(resp => {
          if(resp.data.result === true) {
            const token = resp.data.data.token
            const user = resp.data.data.user
            Vue.prototype.$http.defaults.headers.common['userToken'] = token
            commit('auth_success', { token, user })
            resolve(resp)
          } else {
            commit('auth_error')
          }
        })
        .catch(err => {
          //console.log(err.message)
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      })
    },
    //log him out
    logout({commit}){
      return new Promise((resolve/*, reject*/) => {
        commit('logout')
        router.push('/login')
        resolve()
      })
    }  
  },
  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isAuthenticated: state => state.auth,
    token: state => state.token
  }
}

//app general settings
const appSettings = {
  state: () => ({
    menuOpen: true,
    loading: false,
    vuetifyColor: 'red darken-4',
    hexColor: '#B71C1C', 
    catalogueView: 'list',
  }),
  mutations: {
    menuToggle(state) {
      state.menuOpen = !state.menuOpen
    },
    isLoading(state, bool) {
      state.loading = bool
    },
    setCatalogueView(state, display) {
      state.catalogueView = display
    }
  },
  getters: {
    menuOpen: state => state.menuOpen,
    isLoading: state => state.loading,
    vColor: state => state.vuetifyColor,
    hexColor: state => state.hexColor,
    catView: state => state.catalogueView
  }
}

const store = new Vuex.Store({
  modules: {
    auth: authentication,
    appSettings: appSettings
  },
  plugins: [createPersistedState()],
})

export default store