<template>
  <v-container fluid>
    <PageHeader 
      :title="`Order #${order.orderNumber}`"
      subheader=""
    />
    <v-row>
      <v-col
        lg="3"
      >
        <order-timeline :status="order.stage_slug"></order-timeline>
      </v-col>
      <v-col
        lg="9"
      >
        <v-card>
          <v-card-title>{{ company.name }}</v-card-title>
          <v-card-text>
            <ul>
              <li><strong>Placed at:</strong> {{ order.date }}</li>
              <li><strong>Estimated delivery:</strong> {{ order.date }}</li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card
          class="mt-8"
        >
          <v-card-title>Products</v-card-title>
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
        console.log(resp.data.data)
        this.company = resp.data.data.order.company
        this.order = resp.data.data.order
        this.products = resp.data.data.order_items
      })
    }
  },
  mounted() {
    this.loadOrder()
  }
}
</script>
