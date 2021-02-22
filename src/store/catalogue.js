
//session module
const catalogue = {
  state: () => ({
    selected: []
  }),
  mutations: {
    addToSelection(state, id) {
      const exist = state.selected.find(t => t === id)
      if(exist) {
        state.selected = state.selected.filter(t => t !== id)
      } else {
        state.selected.push(id)
      }
    },
    clearSelected(state) {
      state.selected = []
    }
  },
  actions: {


  },
  getters : {
    selected: state => state.selected
  }
}

export default catalogue