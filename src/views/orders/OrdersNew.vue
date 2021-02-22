<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    <v-btn
      v-if="step != 3"
      class="ma-2 add_button"
      :color="$store.getters.vColor"
      elevation="2"
      fab
      @click="toggleCart()"
    >
      <span class="white--text"><v-icon>mdi-cart</v-icon>({{ $store.getters.count }})</span>
    </v-btn>
    <div>
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step
            step="1"
            :complete="step > 1"
            edit-icon="mdi-pencil"
            editable
          >
            Select Customer
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            step="2"
            :editable="company_id != ''"
            :complete="step > 2"
            edit-icon="mdi-pencil"
          >
            Add items to cart
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            step="3"
            :editable="company_id != ''"
            :complete="step > 3"
          >
            Confirm
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-autocomplete
              v-model="company_id"
              label="Company"
              :items="companies"
              :loading="loading"
              @change="customerChanged()"
            >
            </v-autocomplete>
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
    />
    <cart-float 
      v-model="showCart" 
      @checkout="step = 3" 
      @clearCart="clear()"
    />
  </v-container>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import ProductsList from '../../components/products/ProductsList.vue'
import ProductModal from '../../components/orders/productModal'
import CartFloat from '../../components/orders/cartFloat'
import CartCheckout from '../../components/orders/CartCheckout'
import { mapGetters } from 'vuex'

export default {
  name: 'OrdersNew',
  data() {
    return {
      title: 'Create a new order',
      subheader: '',
      company_id: this.$store.getters.company.id ? this.$store.getters.company.id : '',
      loading: true,
      step: 1,
      showCart: false,
      listHeader: [
        { text: '', col: 1 },
        { text: 'Name', col: 4 },
        { text: 'Packing', col: 2 },
        { text: 'Price', col: 4 }
      ],
      companies: [],
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
  },
  computed: {
    ...mapGetters([
      'company',
      'subtotal',
      'getCurrencyText',
      'cbm',
      'origin_zone',
      'destination_zone'
    ])
  },
  beforeMount() {
    //load customers
    this.$http.get(this.endpoint('customer/get'))
    .then( resp => {
      resp.data.data.map(function(c) {
        c.value = c.id
        c.text = c.name
      })
      this.companies = resp.data.data
      this.loading = false
    })
  },
  methods: {
    toggleCart() {
      this.showCart = !this.showCart
    },
    toggleDialog() {
      this.showProductModal = !this.showProductModal
    },
    customerChanged() {
      this.step = 2
      //pass client to the cart store
      const company = this.companies.filter(c => c.id == this.company_id)
      this.$store.dispatch('setCompany', company[0])
    },
    productModal(product) {
      this.productInModal = product
      this.showProductModal = true
    },
    clear() {
      this.company_id = ''
      this.step = 1
      this.$store.dispatch('clearCart')
    },
    remove(id) {
      this.$store.dispatch('removeFromCart', id)
    }
  }
}
</script>
