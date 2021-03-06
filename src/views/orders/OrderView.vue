<template>
  <v-container fluid>
    <v-row>
      <v-col
        xl="9"
        md="12"
        class="d-flex mb-1"
      >
        <v-btn
          :to="{ name: order.type === 'order' ? 'Orders' : 'Quotations' }"
          class="mb-5"
          color="blue-grey"
          elevation="2"
          dark
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="order.type === 'quotation'"
          class="mb-5"
          color="indigo"
          elevation="2"
          dark
          :loading="convertingToOrder"
          @click="convertToOrder"
        >
          {{ $t('orders.convert_to_order') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        xl="9"
        md="12"
      >
        <order-header :loading="loading" :order="order"></order-header>
        <v-row class="mt-6">
          <v-col>
            <order-logistics
              ref="orderLogisticsComponent"
              :order-id="order.id"
            ></order-logistics>
          </v-col>
        </v-row>
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
            <v-spacer></v-spacer>
            <v-tab
              href="#documents"
              v-if="$store.getters.user.is_admin"
            >
              {{ $t('documents') }}
              <v-icon>mdi-file-document-outline</v-icon>
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item
              value="products"
            >
              <v-container v-if="canEditOrder" fluid>
                <v-row class="pa-3">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="second"
                    dark
                    elevation="1"
                    @click="addProductModal = true"
                  >{{ $t('orders.add_product') }}</v-btn>
                </v-row>
              </v-container>
              <v-card
                class="pa-3"
                flat
              >
                <order-products-list
                  edit
                  :order="order"
                  :products="products"
                  :can-modify="canEditOrder"
                  @quantityUpdated="reload"
                  @productDeleted="reload"
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
            <v-tab-item
              v-if="$store.getters.user.is_admin"
              value="documents"
            >
              <keep-alive>
                <v-card
                  class="pa-3"
                  flat
                >
                  <order-documents :order-id="order.id"></order-documents>
                </v-card>
              </keep-alive>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col
        lg="3"
        class="overflow-hidden d-none d-xl-block"
      >
        <order-timeline :status="stage"></order-timeline>
      </v-col>
    </v-row>
    <v-dialog
      v-model="addProductModal"
    >
      <add-product-to-order
        :order-id="order.id"
        :currency="order.currency"
        :order-incoterm="order.incoterm"
        @productAdded="loadOrder"
      ></add-product-to-order>
    </v-dialog>
  </v-container>
</template>

<script>
import OrderTimeline from '../../components/orders/orderTimeline'
import orderPayments from '../../components/orders/payments'
import orderInspections from '../../components/orders/inspections'
import orderHeader from '../../components/orders/orderHeader'
import orderProductsList from '../../components/orders/orderProductsList'
import orderLogistics from '../../components/orders/orderLogistics'
import orderDocuments from '../../components/orders/orderDocuments'
import addProductToOrder from '../../components/orders/addProductToOrder'

export default {
  name: 'Order',
  props: ['id'],
  components: {
    OrderTimeline, orderPayments, orderInspections, orderHeader, orderProductsList, orderLogistics, orderDocuments, addProductToOrder
  },
  data: function() {
    return {
      loading: true,
      order: {},
      company: {},
      products: [],
      stage: 'pending',
      tab: 'products',
      convertingToOrder: false,
      addProductModal: false
    }
  },
  computed: {
    canEditOrder() {
      if(this.order.type === 'quotation') {
        return true
      }
      for(var payment in this.order.payments) {
        if(this.order.payments[payment].reason === 'deposit' && this.order.payments[payment].status !== 'Completed') {
          return true
        }
      }
      return false
    }
  },
  watch: {
    id(new_val, old_val) {
      if(new_val !== old_val) {
        this.reload()
      }
    }
  },
  methods: {
    reload() {
      this.loadOrder()
      this.$refs.orderLogisticsComponent.loadLogistics()
    },
    loadOrder() {
      this.loading = true
      this.$http.get(this.endpoint(`order/get/${this.id}`))
      .then( resp => {
        console.log(resp.data)
        if(resp.data.result) {
          this.company = resp.data.data.order.company
          this.order = resp.data.data.order
          this.products = resp.data.data.order_items
          this.stage = resp.data.data.order.stage.slug
        } else {
          this.$t('friendly_error')
        }
        this.loading = false
      })
    },
    convertToOrder() {
      this.convertingToOrder = true
      this.$http.post(this.endpoint(`order/${this.order.id}/convert_to_order`), {
        notify_client: 1
      }).then( () => {
        this.$router.push({ name: 'viewOrder', params: { id: this.order.id } })
        this.reload()
      })
    }
  },
  mounted() {
    this.loadOrder()
    if(this.$route.query.tab) {
      this.tab = this.$route.query.tab
    }
  }
}
</script>
