<template>
  <v-container fluid>
    <PageHeader 
      :title="`${ $tc('order', 1) } #${ order.orderNumber }`"
      subheader=""
    />
    <router-link :to="{ name: 'Orders' }">
      <v-btn
        class="ma-2 add_button"
        color="secondary"
        elevation="2"
        fab
        dark
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </router-link>
    <v-row>
      <v-col
        lg="3"
      >
        <order-timeline :status="stage"></order-timeline>
      </v-col>
      <v-col
        lg="9"
      >
        <v-card>
          <v-card-title>{{ company.name }}</v-card-title>
          <v-card-text>
            <ul>
              <li><strong>{{ $t('orders.place_at') }}:</strong> {{ order.date }}</li>
              <li><strong>{{ $t('orders.estimated_delivery') }}:</strong> {{ order.date }}</li>
              <li><strong>{{ $t('orders.terms') }}:</strong> {{ order.incoterm }} - {{ order.transport_description }}</li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card
          class="mt-8"
        >
          <v-card-title>{{ $tc('product', 0) }}</v-card-title>
          <v-card-text>
            <v-data-table
              :search="table.search"
              :headers="table.headers"
              :items="products"
              :items-per-page="10"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import OrderTimeline from '../../components/orders/orderTimeline'

export default {
  name: 'Order',
  props: ['id'],
  components: {
    PageHeader,
    OrderTimeline
  },
  data: function() {
    return {
      order: {},
      company: {},
      products: [],
      stage: 'pending',
      table: {
        search: '',
        headers: [
          { text: 'Ref', align: 'start', sortable: true, value: 'ref' },
          { text: 'Name', align: 'start', sortable: true, value: 'name' },
          { text: 'Cbm', align: 'start', sortable: true, value: 'total_cbm' },
          { text: 'Price', align: 'end', value: 'total_price_string' }
        ]
      }
    }
  },
  methods: {
    loadOrder() {
      this.$http.get(this.endpoint(`order/get/${this.id}`))
      .then( resp => {
        this.company = resp.data.data.order.company
        this.order = resp.data.data.order
        this.products = resp.data.data.order_items
        this.stage = resp.data.data.order.stage.slug
      })
    }
  },
  mounted() {
    this.loadOrder()
  }
}
</script>
