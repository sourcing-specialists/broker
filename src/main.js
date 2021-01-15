import Vue from 'vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import Axios from 'axios'
import toasted from 'vue-toasted'
import mixins from './mixins'

//mounting in
import App from './App.vue'

//app scss
import './assets/scss/app.scss'

Vue.config.productionTip = false

//register axios globally & set header of user token
Vue.prototype.$http = Axios;
Vue.prototype.$http.defaults.headers.common['apiKey'] = process.env.VUE_APP_API_KEY
Vue.prototype.$http.defaults.headers.common['userToken'] = store.getters.token

//load toastr globally
Vue.use(toasted, {
  position: 'bottom-center',
  keepOnOver: true,
  className: 'toasted-message', 
  theme: "bubble", 
  duration : 5000
})

//load mixins
Vue.mixin(mixins)

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
