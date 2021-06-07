<template>
  <v-container fluid>
    <PageHeader :title="$t('shipping')" :subheader="''" />
    <v-card class="pa-5">
      <v-data-table
        :loading="loading"
        :headers="table_headers"
        :items="shipping_orders"
      >
        <template v-slot:[`item.arrival_date`]="{ item }">
          {{ formatDate(item.arrival_date) }}
        </template>
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
      loading: true,
      table_headers: [
        { text: this.$t('orders.bl_number'), align: 'start', sortable: true, value: 'bl_number' },
        { text: this.$t('origin'), align: 'start', sortable: true, value: 'origin_name' },
        { text: this.$t('destination'), align: 'start', sortable: true, value: 'destination_name' },
        { text: this.$t('orders.departure_date'), align: 'start', sortable: true, value: 'departure_date' },
        { text: this.$t('orders.arrival_date'), align: 'start', sortable: true, value: 'arrival_date' },
        { text: this.$t('status'), align: 'start', sortable: true, value: 'status' },
        { text: '', align: 'end', value: 'actions' }
      ],
      shipping_orders: [] 
    }
  },
  methods: {
    loadShippingOrders() {
      this.loading = true
      this.$http.get(this.endpoint('shipping_orders/get'))
      .then(resp => {
        console.log(resp.data.data.records)
        this.shipping_orders = resp.data.data.records
        this.loading = false
      })
    }
  },
  mounted() {
    this.loadShippingOrders()
  }
}

</script>

