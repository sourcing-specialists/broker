<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    <router-link :to="{ name: 'OrdersNew' }">
      <v-btn
        class="ma-2 add_button"
        :color="$store.getters.vColor"
        elevation="2"
        x-large
        dark
      >{{ newOrderText }} <v-icon>{{ newOrderIcon }}</v-icon></v-btn>
    </router-link>
    <orders-list></orders-list>
  </v-container>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import ordersList from '../../components/orders/ordersList'

export default {
  name: 'Orders',
  components: {
    PageHeader, ordersList
  },
  data() {
    return {
      title: this.$tc('order', 2),
      subheader: ''
    }
  },
  computed: {
    newOrderText() {
      if(this.$store.getters['cart/company'].id !== undefined) {
        return this.$t('views.orders.continue_order')
      }
      return this.$t('views.orders.start_new_order')
    },
    newOrderIcon() {
      return this.$store.getters['cart/company'].id !== undefined ? 'mdi-chevron-right' : 'mdi-plus'
    }
  }
}

</script>

<style scoped>
.order-notes {
  font-size: 11px;
  font-style: italic !important;
}
</style>

