import Vue from 'vue'
import router from '../router'
import Axios from 'axios'

//session module
const authentication = {
  state: () => ({
    auth: false,
    status: '',
    token: '',
    user : '',
    jwt: ''
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
      state.jwt = data.jwt
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.auth = false
      state.status = ''
      state.token = ''
      state.user = ''
      state.jwt = ''
    }
  },
  actions: {
    //login the user 
    login({commit}, user){
      return new Promise((resolve, reject) => {
        //commit('auth_request')
        Axios({
          url: `${process.env.VUE_APP_API_ENDPOINT}auth`, 
          data: user,
          method: 'POST'
        }).then(resp => {
          if(resp.data.result === true) {
            const token = resp.data.data.token
            const user = resp.data.data.user
            const jwt = resp.data.data.jwt
            Vue.prototype.$http.defaults.headers.common['userToken'] = token
            commit('auth_success', { token, user, jwt })
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
    logout({commit}, expired = false) {
      if(expired) {
        this.dispatch('cart/clearCart')
        commit('logout')
        router.push('/login')
        return
      }
      return new Promise((resolve/*, reject*/) => {
        Axios({
          url: `${process.env.VUE_APP_API_ENDPOINT}logout`,
          method: 'POST'
        }).then( () => {
          this.dispatch('cart/clearCart')
          commit('logout')
          router.push('/login')
          resolve()
        })
      })
    }  
  },
  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isAuthenticated: state => state.auth,
    token: state => state.token,
    user: state => state.user,
    jwt: state => state.jwt
  }
}

export default authentication
