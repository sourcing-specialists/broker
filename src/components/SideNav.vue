<template>
  <v-navigation-drawer
    dark
    app
    :mini-variant="drawer"
    mini-variant-width="60"
    >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Marcopolo API
        </v-list-item-title>
        <v-list-item-subtitle>
          List of end points to our API
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <v-list dense nav>
      <div  v-for="item in items" :key="item.title">
        <v-list-group v-if="item.children.length > 0" :prepend-icon="item.icon" no-action>
          <template v-slot:activator>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>
          <v-list-item v-for="(child, i) in item.children" :key="i" link :to="child.to">
            <v-list-item-title v-text="child.title" />            
          </v-list-item>
        </v-list-group>
        <v-list-item v-else :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import SideMenu from '../constants/SideMenu.js'

export default {
  name: 'SideNav',
  data: () => {
    return {
      items: SideMenu,
      drawer: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .v-icon {
    font-size: 20px;
  }
</style>