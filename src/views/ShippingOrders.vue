<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    <v-card>
      <v-data-table>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import PageHeader from '../components/PageHeader'


export default {
  name: 'Orders',
  components: {
    PageHeader
  },
  data() {
    return {
      title: this.$t('shipping'),
      subheader: '',
    }
  },
  methods: {
    loadShippingOrders() {
      this.$http.get(this.endpoint('shipping_orders/get'))
    }
  },
  mounted() {
    this.loadShippingOrders()
  }
}

</script>

