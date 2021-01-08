<template>
  <ul class="d-flex justify-end">
    <li class="justify-end">
      <v-btn
        class="mx-2"
        fab
        dark
        small
        color="secondary"
        @click="logout"
      >
      <v-icon dark>
        mdi-login
      </v-icon>
    </v-btn>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TopNavBar',
  data: () => {
    return {

    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    debug() {
      console.log(this.$store.getters.token)
    }
  }
}
</script>

<style lang="scss" scoped>
  ul {
    width: 100%;
    li {
      list-style-type: none;
    }
  }
</style>