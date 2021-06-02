<template>
  <div class="newOrder">
    <v-container fluid>
      <PageHeader :title="$t('orders.create_order')" subheader="" />
      <v-btn
        v-if="step != 3"
        class="ma-2 add_button"
        :color="$store.getters.vColor"
        elevation="2"
        fab
        @click="toggleCart()"
      >
        <span class="white--text"><v-icon>mdi-cart</v-icon>({{ count }})</span>
      </v-btn>
      <div>
        <v-stepper
          v-model="step"
        >
          <v-stepper-header>
            <v-stepper-step
              step="1"
              :complete="step > 1"
              edit-icon="mdi-pencil"
              editable
            >
              {{ $t('views.orders.order_settings') }}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              step="2"
              :editable="company.id !== undefined"
              :complete="step > 2"
              edit-icon="mdi-pencil"
            >
              {{ $t('views.orders.add_items') }}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              step="3"
              :editable="count > 0"
              :complete="step > 3"
            >
              {{ $t('views.orders.confirm_order') }}
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <order-new-settings
                v-if="step == 1"
                @onConfirm="step = 2"
              ></order-new-settings>
            </v-stepper-content>

            <v-stepper-content step="2">
              <products-list
                v-if="step == 2"
                forOrders
                @addModal="productModal"
              ></products-list>
            </v-stepper-content>

            <v-stepper-content step="3">
              <cart-checkout v-if="step == 3"></cart-checkout>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </div>
      <product-modal
        :product="productInModal"
        v-if="showProductModal"
        @toggleDialogStatus="toggleDialog()"
        :can-order="true"
      />
    </v-container>
    <cart-float
      v-model="showCart" 
      @checkout="step = 3" 
      @clearCart="clear()"
    ></cart-float>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '../../components/PageHeader'
import ProductsList from '../../components/products/ProductsList.vue'
import ProductModal from '../../components/orders/productModal'
import CartFloat from '../../components/orders/cartFloat'
import CartCheckout from '../../components/orders/CartCheckout'
import orderNewSettings from '../../components/orders/orderNewSettings'

export default {
  name: 'OrdersNew',
  data() {
    return {
      loading: true,
      step: 1,
      showCart: false,
      listHeader: [
        { text: '', col: 1 },
        { text: 'Name', col: 4 },
        { text: 'Packing', col: 2 },
        { text: 'Price', col: 4 }
      ],
      products: [],
      productInModal: {},
      showProductModal: false
    }
  },
  components: {
    PageHeader,
    ProductsList,
    ProductModal,
    CartFloat,
    CartCheckout,
    orderNewSettings
  },
  computed: {
    ...mapGetters('cart', [
      'company',
      'subtotal',
      'cbm',
      'origin_zone',
      'destination_zone',
      'count'
    ])
  },
  methods: {
    toggleCart() {
      this.showCart = !this.showCart
    },
    toggleDialog() {
      this.showProductModal = !this.showProductModal
    },
    productModal(product) {
      this.productInModal = product
      this.showProductModal = true
    },
    clear() {
      this.step = 1
      this.$store.dispatch('cart/clearCart')
    },
    remove(id) {
      this.$store.dispatch('removeFromCart', id)
    }
  }
}
</script>
