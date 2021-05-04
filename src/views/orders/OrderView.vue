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
        <order-header :loading="loading" :order="order"></order-header>
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
                <order-products-list
                  edit
                  :order="order"
                  :products="products"
                  @productUpdated="loadOrder"
                ></order-products-list>
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
                  <order-payments :order="order"></order-payments>
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
import orderHeader from '../../components/orders/orderHeader'
import orderProductsList from '../../components/orders/orderProductsList'

export default {
  name: 'Order',
  props: ['id'],
  components: {
    OrderTimeline, orderPayments, orderInspections, orderHeader, orderProductsList
  },
  data: function() {
    return {
      loading: true,
      order: {},
      company: {},
      products: [],
      stage: 'pending',
      tab: 'products'
    }
  },
  methods: {
    loadOrder() {
      this.loading = true
      this.$http.get(this.endpoint(`order/get/${this.id}`))
      .then( resp => {
        this.company = resp.data.data.order.company
        this.order = resp.data.data.order
        this.products = resp.data.data.order_items
        this.stage = resp.data.data.order.stage.slug
        this.loading = false
      })
    }
  },
  mounted() {
    this.loadOrder()
  }
}
</script>
