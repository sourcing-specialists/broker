<template>
  <!-- App.vue -->
  <v-app>

    <Loader />

    <SideNav v-if="isAuthenticated" v-model="side" />

    <v-app-bar app v-if="isAuthenticated">
      <TopNavBar @toggleSideNav="side = !side" />
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <vue-page-transition name="fade-in-right">
        <!-- If using vue-router -->
          <router-view></router-view>
        </vue-page-transition>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
  import Loader from './components/loader'
  import TopNavBar from './components/TopNavBar'
  import SideNav from './components/SideNav'

  export default {
    name: 'Layout',
    data() {
      return {
        side: false,
      }
    },
    components: {
      Loader,
      TopNavBar,
      SideNav
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated
      }
    }
  }
</script>
<style scoped>
.container {
  position: inherit;
}
</style>
