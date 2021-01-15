const url = process.env.VUE_APP_API_ENDPOINT

const mixins = {
  methods: {
    endpoint: function (task) {
      return url+task
    },
  }
}

export default mixins