import Vue from 'vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueI18n from 'vue-i18n'
import en from './translations/en'
import es from './translations/es'
import store from './store'
import Axios from 'axios'
import toasted from 'vue-toasted'
import mixins from './mixins'
import firebaseConfig from './configs/firebase.js'
import firebase from 'firebase/app'
import 'firebase/firestore'

//mounting in
import App from './App.vue'

//app scss
import './assets/scss/app.scss'

Vue.config.productionTip = false

//register axios globally & set header of user token
Vue.prototype.$http = Axios;
Vue.prototype.$http.defaults.headers.common['apiKey'] = process.env.VUE_APP_API_KEY
Vue.prototype.$http.defaults.headers.common['userToken'] = store.getters.token
Vue.prototype.$http.defaults.headers.common['lang'] = store.getters.getLanguage

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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
Vue.prototype.$db = firebase.firestore()

//language
Vue.use(VueI18n)

const messages = { en, es }

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: store.getters.getLanguage, // set locale
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  messages
})

//start app
new Vue({
  router,
  vuetify,
  store,
  i18n,
  computed: {
    lang() {
      return this.$store.getters.getLanguage
    }
  },
  watch: {
    lang(new_lang, old_lang) {
      if(new_lang !== old_lang) {
        this.$http.defaults.headers.common['lang'] = new_lang
      }
    }
  },
  created: function () {
    //check the status of the session on the server before doing any request
    this.$http.interceptors.response.use(undefined, (err) => {
      return new Promise((/*resolve, reject*/) => {
        if (err.response.status === 401 && err.response.config && !err.response.config.__isRetryRequest) {
          this.$store.dispatch('logout', true)
        }
        throw err
      })
    })
  },
  render: h => h(App)
}).$mount('#app')
