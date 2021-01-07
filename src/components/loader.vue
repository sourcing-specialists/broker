<template>
  <div id="loading" v-show="isLoading">
    <div class="loader-wrap">
      <div class="loader"></div>
      <span>Please wait... We are working on it!</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Loader',
  data: () => {
    return {

    }
  },
  computed: {
    isLoading() {
      return this.$store.getters.isLoading
    }
  },
  mounted() {
    console.log(this.isLoading)
  }
}
</script>
<style scoped lang="scss">
#loading {
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.9);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  .loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
    margin: auto;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  span {
    display: block;
    margin-top: 15px;
  }
}
</style>