<template>
  <div class="top-nav-container d-flex">
    <ul class="d-flex">
      <li class="align-self menu-toggle-wrapper">
        <v-btn
          :class="{ inverted: isInverted }"
          fab
          small
          @click="$store.commit('menuToggle')"
        >
          <v-icon dark>
            mdi-menu-open
          </v-icon>
        </v-btn>
      </li>
      <li class="align-self mx-2">
        <img width="130" src="../assets/images/logo-original.png" alt="Sourcing Specialists Logo">
      </li>
    </ul>
    <ul class="d-flex justify-end">
      <li>
        <notifications-alert></notifications-alert>
      </li>
      <li>
        <language-selection />
      </li>
      <li>
        <currency-select />
      </li>
      <li>
        <v-btn
          dark
          color="secondary"
        >
          <span>{{ $store.state.auth.user.name }}</span>
        </v-btn>
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
import currencySelect from './currencySelect'
import languageSelection from './langSelection'
import notificationsAlert from './notifications/notificationsAlert'

export default {
  name: 'TopNavBar',
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  },
  components: { currencySelect, languageSelection, notificationsAlert },
  computed: {
    isInverted() {
      return this.$store.getters.menuOpen ? true : false
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
  .menu-toggle-wrapper {
    margin-left: -5px;
    .inverted {
      transform: rotate(180deg);
    }
  }

</style>