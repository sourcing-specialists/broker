<template>
  <div class="top-nav-container d-flex">
    <ul class="d-flex">
      <li class="align-self">
        <v-btn
          class="mx-2"
          fab
          dark
          small
          color="secondary"
          @click="$store.commit('menuToggle')"
          >
          <v-icon dark>
            fa-bars
          </v-icon>
        </v-btn>
      </li>
    </ul>
    <ul class="d-flex justify-end">
      <li>
        <router-link to="/account">
          <v-btn
            dark
            color="secondary"
          >
            <span>{{ $store.state.auth.user.name }}</span>
          </v-btn>
        </router-link>
      </li>
      <li>
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
  </div>
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-nav-container {
    width: 100%;
    ul {
      width: 100%;
      margin: 0px;
      padding: 0px;
    }
    li {
      list-style-type: none;
    }
  }
</style>