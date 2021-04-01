<template>
  <v-container fluid>
    <v-btn
      :to="{ name: 'Orders' }"
      class="mb-5"
      color="blue-grey"
      elevation="2"
      dark
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-row>
      <v-col
        lg="9"
      >
        <v-card>
          <v-card-title class="justify-space-between">
            <h2><span class="mColor-text pr-2">{{ `${ $tc('order', 1) } #${ order.orderNumber }` }}</span> - {{ company.name }}</h2>
            <v-btn
              :href="order.download_url"
              target="_blank"
            >
              {{ $t('download') }}<v-icon class="pl-3">mdi-download</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <ul>
              <li><strong>{{ $t('orders.place_at') }}:</strong> {{ formatDate(order.date) }}</li>
              <li v-if="order.eta != null"><strong>{{ $t('orders.estimated_delivery') }}:</strong> {{ formatDate(order.eta) }}</li>
              <li><strong>{{ $t('orders.terms') }}:</strong> {{ order.incoterm }} - {{ order.transport_description }}</li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card
          class="mt-8"
        >
          <v-tabs
            v-model="tab"
            :background-color="$store.getters.vColor"
            dark
            icons-and-text
          >
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#products">
              {{ $tc('product',2) }}
              <v-icon>mdi-format-list-text</v-icon>
            </v-tab>

            <v-tab href="#payments">
              {{ $t('payments') }}
              <v-icon>mdi-cash-check</v-icon>
            </v-tab>

            <v-tab href="#inspections">
              {{ $t('inspections') }}
              <v-icon>mdi-magnify-scan</v-icon>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item
              value="products"
            >
              <v-card
                class="pa-3"
                flat
              >
                <v-data-table
                  :search="table.search"
                  :headers="table.headers"
                  :items="products"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.name`]="{ item }">
                    <h4>{{ item.name }}</h4>
                    <p class="pa-0 mb-0"><strong class="mColor-text">{{ item.option.key }}:</strong> {{ item.option.value }}</p> 
                  </template>
                  <template v-slot:[`item.quantity`]="{ item }">
                    <h4>{{ item.quantity }} {{ $tc('carton', item.quantity) }}</h4>
                    <p class="pa-0 mb-0">{{ item.total_units }} {{ unit(item) }}</p>
                  </template>
                  <template v-slot:[`item.total_price_string`]="{ item }">
                    <h4>{{ item.total_price_string }}</h4>
                    <p class="pa-0 mb-0">{{ item.unit_price_string }} {{ unit(item, 1) }}</p> 
                  </template>
                  <template v-slot:[`body.append`]>
                    <tr>
                      <td colspan="3"></td>
                      <td>{{ round(order.total_cbm) }}</td>
                      <td>
                        <h4 class="text-right">{{ $t('total') }}: {{ order.currency }} {{ order.total }}</h4>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4"></td>
                      <td>
                        <h4 class="text-right"><strong class="mColor-text">{{ $t('outstanding') }}:</strong> {{ order.currency }} {{ order.outstanding }}</h4>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>
            <v-tab-item
              value="payments"
            >
              <keep-alive>
                <v-card
                  class="pa-3"
                  flat
                >
                  <order-payments :order-id="order.id"></order-payments>
                </v-card>
              </keep-alive>
            </v-tab-item>
             <v-tab-item
              value="inspections"
            >
              <keep-alive>
                <v-card
                  class="pa-3"
                  flat
                >
                  <order-inspections :order-id="order.id"></order-inspections>
                </v-card>
              </keep-alive>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col
        lg="3"
        class="overflow-hidden"
      >
        <order-timeline :status="stage"></order-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OrderTimeline from '../../components/orders/orderTimeline'
import orderPayments from '../../components/orders/payments'
import orderInspections from '../../components/orders/inspections'

export default {
  name: 'Order',
  props: ['id'],
  components: {
    OrderTimeline,
    orderPayments,
    orderInspections
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
          { text: this.$t('ref'), align: 'start', sortable: true, value: 'ref' },
          { text: this.$t('product_name'), align: 'start', sortable: true, value: 'name' },
          { text: this.$t('quantity'), align: 'start', sortable: true, value: 'quantity' },
          { text: this.$t('cbm'), align: 'start', sortable: true, value: 'total_cbm' },
          { text: this.$t('price'), align: 'end', value: 'total_price_string' }
        ]
      },
      tab: 'products'
    }
  },
  methods: {
    unit(item, q = 0) {
      const qty = q === 0 ? item.total_units : q
      const unitDescription = item.is_tree === 1 ? item.packing_base_unit_description : this.$tc('components.products.unit', qty)
      return `${unitDescription}`
    },
    downloadOrderPdf() {
      console.log(123)
    },
    loadOrder() {
      this.$http.get(this.endpoint(`order/get/${this.id}`))
      .then( resp => {
        this.company = resp.data.data.order.company
        this.order = resp.data.data.order
        this.products = resp.data.data.order_items
        this.stage = resp.data.data.order.stage.slug
        console.log(resp.data.data)
      })
    }
  },
  mounted() {
    this.loadOrder()
  }
}
</script>
