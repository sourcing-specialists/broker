<template>
  <v-container fluid>
    <PageHeader :title="$t('shipping')" :subheader="''" />
    <v-card class="pa-5">
      <v-data-table
        :loading="loading"
        :headers="table_headers"
        :items="shipping_orders"
      >
        <template v-slot:[`item.type`]="{ item }">
          <v-icon v-if="item.type === 'port'">mdi-ferry</v-icon>
          <v-icon v-if="item.type === 'airport'">mdi-airplane</v-icon>
        </template>
        <template v-slot:[`item.departure_date`]="{ item }">
          {{ formatDate(item.departure_date) }}
        </template>
        <template v-slot:[`item.arrival_date`]="{ item }">
          {{ formatDate(item.arrival_date) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            fab
            color="primary"
            dark
            small
            @click="openDialog(item)"
          >
            <v-icon>mdi-file-search-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="720"
    >
      <v-card>
        <v-data-table
          :headers="documentsHeader"
          :items="modalItem.documents"
        >
          <template v-slot:[`item.file`]="{ item }">
            <v-btn
              fab
              color="primary"
              dark
              target="_black"
              :href="item.url"
              small
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
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
        { text: this.$t('orders.transportation'), align: 'start', sortable: true, value: 'type' },
        { text: this.$t('orders.bl_number'), align: 'start', sortable: true, value: 'bl_number' },
        { text: this.$t('origin'), align: 'start', sortable: true, value: 'origin_name' },
        { text: this.$t('destination'), align: 'start', sortable: true, value: 'destination_name' },
        { text: this.$t('orders.departure_date'), align: 'start', sortable: true, value: 'departure_date' },
        { text: this.$t('orders.arrival_date'), align: 'start', sortable: true, value: 'arrival_date' },
        { text: this.$t('status'), align: 'start', sortable: true, value: 'status' },
        { text: '', align: 'end', value: 'actions' }
      ],
      documentsHeader: [
        { text: this.$t('orders.transportation'), align: 'start', sortable: true, value: 'key_id' },
        { text: this.$t('orders.notes'), align: 'start', sortable: true, value: 'description' },
        { text: '', align: 'end', sortable: true, value: 'file' },
      ],
      modalItem: '',
      shipping_orders: [],
      dialog: false 
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
    },
    openDialog(item) {
      this.modalItem = item
      this.dialog = true
    }
  },
  mounted() {
    this.loadShippingOrders()
  }
}

</script>

