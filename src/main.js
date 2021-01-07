import Vue from 'vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import Axios from 'axios'

//mounting in
import App from './App.vue'

Vue.config.productionTip = false

//register axios globally & set header of user token
Vue.prototype.$http = Axios;
Vue.prototype.$http.defaults.headers.common['apiKey'] = 'c5dea9e73f756766773e06f264f1a9a9'

//start app
new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
