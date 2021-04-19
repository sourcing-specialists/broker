<template>
  <v-navigation-drawer
    dark
    app
    :v-model="menu"
    :color="$store.getters.vColor"
    fixed
    permanent
    clipped
    :mini-variant.sync="menu"
    :expand-on-hover="menu"
  >
    <v-list
      dense
      nav
      rounded
    >
      <div  v-for="item in items" :key="item.title">
        <v-list-group
          v-if="item.children.length > 0"
          :prepend-icon="item.icon"
          no-action
          color="white"
          class="subgroups-menu"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ $tc(item.title, 0) }}</v-list-item-title>
          </template>
          <v-list-item
            v-for="(child, i) in item.children"
            :key="i" link
            :to="child.to"
            :exact="child.exact ? true : false"
          >
            <v-list-item-title v-text="$tc(child.title, 0)" />            
          </v-list-item>
        </v-list-group>
        <v-list-item v-else :to="item.to">
          <v-list-item-icon
            class="menu-icons"
          >
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ $tc(item.title, 0) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import SideMenu from '../constants/SideMenu.js'
import logoIcon from '@/assets/images/logo-icon.png'
import { mapGetters } from 'vuex'

export default {
  name: 'SideNav',
  data: function() {
    return {
      logo: logoIcon,
      items: SideMenu,
      isDisabled: false
    }
  },
  computed: {
    ...mapGetters([
      'menuOpen'
    ]),
    menu: {
      get: function() {
        return this.menuOpen
      },
      set: function(val) {
        console.log(val)
        this.$emit('input', 1)
      }
    }
  }
}
</script>

<style lang="scss">
.subgroups-menu {
  .fa-chevron-down {
    font-size: 14px !important;
  }
}
.logo-avatar {
  .v-image__image--cover {
    background-size: contain !important;
  }
}
.disabled {
  pointer-events: none !important;
}
.menu-clipper {
  position: absolute;
  bottom: 10px;
  left: 3px;
}
</style>