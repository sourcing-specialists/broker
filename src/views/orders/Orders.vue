<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    <router-link :to="{ name: 'OrdersNew' }">
      <v-btn
        class="ma-2 add_button"
        :color="$store.getters.vColor"
        elevation="2"
        fab
      >
        <span class="white--text"><v-icon>mdi-plus</v-icon></span>
      </v-btn>
    </router-link>
    <v-card>
      
    </v-card>
  </v-container>
</template>

<script>
import PageHeader from '../../components/PageHeader'

export default {
  name: 'Orders',
  data() {
    return {
      title: 'Orders',
      subheader: 'List of all orders'
    }
  },
  components: {
    PageHeader
  }
}
</script>
