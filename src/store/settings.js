//app general settings
const appSettings = {
  state: () => ({
    menuOpen: false,
    loading: false,
    vuetifyColor: 'red darken-4',
    hexColor: '#B71C1C', 
    catalogueView: 'list',
    currency: 'USD',
    language: 'en',
    incoterm: 'REVOOLOOP',
    catalogueCargo: {}
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
    },
    currencyChange(state, currency) {
      state.currency = currency
    },
    languageChange(state, language) {
      state.language = language
    },
    changeInconterm(state, incoterm) {
      state.incoterm = incoterm
    },
    setCatalogueCargo(state, cargo) {
      state.catalogueCargo = cargo
    }
  },
  getters: {
    menuOpen: state => state.menuOpen,
    isLoading: state => state.loading,
    vColor: state => state.vuetifyColor,
    hexColor: state => state.hexColor,
    catView: state => state.catalogueView,
    getCurrency: state => state.currency,
    getCurrencyText: (state) => {
      var str = state.currency
      if(state.currency == 'EUR') {
        str+= ' €'
      }
      if(state.currency == 'USD') {
        str+= ' $'
      }
      if(state.currency == 'CNY') {
        str+= ' ¥'
      }
      if(state.currency == 'GBP') {
        str+= ' £'
      }
      return str
    },
    getLanguage: state => state.language,
    getIncoterm: state => {
      return state.incoterm
    },
    catalogueCargo: state => state.catalogueCargo
  }
}

export default appSettings