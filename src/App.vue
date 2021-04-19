<template>
  <!-- App.vue -->
  <v-app>

    <Loader />

    <side-nav
      v-if="isAuthenticated"
    ></side-nav>

    <v-app-bar
      v-if="isAuthenticated"
      app
      color="white"
      clipped-left
    >
      <top-nav-bar></top-nav-bar>
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
        side: true,
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
