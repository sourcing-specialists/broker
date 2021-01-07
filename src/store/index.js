import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

//session module
const authentication = {
  state: () => ({
    auth: false,
    status: '',
    token: localStorage.getItem('token') || '',
    user : {}
  }),
  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, token, user){
      state.auth = true
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.auth = false
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    //login the user 
    login({commit}, user){
      return new Promise((resolve, reject) => {
        //commit('auth_request')
        Axios({url: 'https://playground.inmarcopolo.com/api/broker/auth', data: user, method: 'POST' })
        .then(resp => {
          console.log(resp.data)
          if(resp.data.result === true) {
            const token = resp.data.token
            const user = resp.data.user
            localStorage.setItem('token', token)
            Axios.defaults.headers.common['userToken'] = token
            commit('auth_success', token, user)
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
        localStorage.removeItem('token')
        delete Axios.defaults.headers.common['userToken']
        resolve()
      })
    }  
  },
  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isAuthenticated: state => state.auth
  }
}

//loading module
const loading = {
  state: () => ({
    loading: false
  }),
  mutations: {
    isLoading(state, bool) {
      state.loading = bool
    }
  },
  getters: {
    isLoading: state => state.loading
  }
}

const store = new Vuex.Store({
  modules: {
    auth: authentication,
    loading: loading
  }
})

export default store