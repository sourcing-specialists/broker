import Vue from 'vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import Axios from 'axios'
import toastr from 'vue-toastr'

//mounting in
import App from './App.vue'

Vue.config.productionTip = false

//register axios globally & set header of user token
Vue.prototype.$http = Axios;
Vue.prototype.$http.defaults.headers.common['apiKey'] = 'c5dea9e73f756766773e06f264f1a9a9'
Vue.prototype.$http.defaults.headers.common['userToken'] = store.getters.token

//load toastr globally
Vue.use(toastr,{
  defaultClassNames: ["animated", "zoomInUp"],
  defaultTimeout: 2000,
  defaultProgressBar: false
})

//start app
new Vue({
  router,
  vuetify,
  store,
  created: function () {
    //check the status of the session on the server before doing any request
    this.$http.interceptors.response.use(undefined, (err) => {
      return new Promise((/*resolve, reject*/) => {
        if (err.response.status === 401 && err.response.config && !err.response.config.__isRetryRequest) {
          this.$store.dispatch('logout')
        }
        throw err
      })
    })
  },
  render: h => h(App)
}).$mount('#app')
