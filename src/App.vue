<template>
  <!-- App.vue -->
  <v-app>

    <Loader />

    <v-navigation-drawer app v-if="isAuthenticated">
      <!-- -->
    </v-navigation-drawer>

    <v-app-bar app v-if="isAuthenticated">
      <!-- -->
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
  import Loader from './components/loader'
  export default {
    name: 'Layout',
    components: {
      Loader
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated
      }
    }
  }
</script>
