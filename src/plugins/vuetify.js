import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.red.darken4,
        second: colors.indigo
      },
      dark: {
        primary: colors.red.darken4,
        second: colors.indigo
      }
    }
  },
  icons: {
    iconfont: 'fa',
  }
});
