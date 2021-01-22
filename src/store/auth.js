import Vue from 'vue'
import router from '../router'
import Axios from 'axios'

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

export default authentication