<template>
  <div class="home">
    <h1>I am the clients view</h1>
  </div>
</template>

<script>

export default {
  name: 'Companies',
  data: () => {
    return {
      endpoint: `${process.env.VUE_APP_API_ENDPOINT}customer/get`
    }
  },
  mounted() {
    this.$http.get(this.endpoint)
    .then( resp => {
      console.log(resp)
    })
  }
}
</script>
