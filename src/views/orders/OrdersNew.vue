<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    <v-btn
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
            @click="pickProducts()"
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
            <v-skeleton-loader
              class="mx-auto"
              type="table"
              v-if="productsLoading"
            />
            <v-container
              fluid
              v-if="!productsLoading"
            >
              <v-row>
                <v-btn
                  :color="$store.getters.vColor"
                  elevation="2"
                  @click="debug()"
                >
                  <span class="white--text">Dump Cart</span>
                </v-btn>
              </v-row>
              <v-row
                class="list-header"
              >
                <v-col
                  :lg="h.col"
                  :md="h.col"
                  v-for="(h, index) in listHeader"
                  :key="index"
                >
                <p>{{ h.text }}</p>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <product-as-list
                v-for="(product,index) in products"
                :key="index" 
                :productData="product"
                addCart
                @orderProductModal="productModal(product)"
              />
            </v-container>
          </v-stepper-content>

          <v-stepper-content step="3">
            <cart-content></cart-content>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </div>
    <product-modal
      :product="productInModal"
      v-if="showProductModal"
      @toggleDialogStatus="toggleDialog()"
    />
    <cart-float v-model="showCart" @clearCart="clear()" />
  </v-container>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import ProductAsList from '../../components/products/ProductAsList.vue'
import ProductModal from '../../components/orders/productModal'
import CartFloat from './cartFloat'
import CartContent from './cartContent'
import { mapGetters } from 'vuex'

export default {
  name: 'OrdersNew',
  data() {
    return {
      title: 'Create a new order',
      subheader: '',
      company_id: this.$store.getters.company.id ? this.$store.getters.company.id : '',
      loading: true,
      productsLoading: true,
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
    ProductAsList,
    ProductModal,
    CartFloat,
    CartContent
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
  watch: {
    step(val) {
      if(val == 3 && this.cbm > 0) {
        this.$http.get(this.endpoint('distribution/get'), {
          params: {
            origin_zone: this.origin_zone,
            destination_zone: this.destination_zone,
            cbm: this.cbm
          }
        }).then(dist => {
          console.log(dist)
        })
      }
    }
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
    pickProducts() {
      console.log(this.products)
    },
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
      this.loadProducts()
    },
    productModal(product) {
      this.productInModal = product
      this.showProductModal = true
    },
    loadProducts() {
      this.productsLoading = true
      this.products = []
      this.$http.post(this.endpoint(`catalogue/get`), { 
        cargo_id: this.selectedCargo,
        currency: this.$store.getters.getCurrency,
        pageSize: '25',
        pageNumber: 1,
        filter: [
          {
            categories: this.selectedCategories
          },
          {
            keywords: this.search
          },
          {
            ref: ''
          },
        ]
      })
      .then( resp => {
        if(resp.data.result == true) {
          console.log(resp.data.data)
          this.products = resp.data.data
          this.productsLoading = false
        }
      })
    },
    debug() {
      console.log(this.$store.getters.company)
    },
    clear() {
      this.company_id = ''
      this.step = 1
      this.$store.dispatch('clearCart')
    },
    remove(id) {
      this.$store.dispatch('removeFromCart', id)
    }
  },
  mounted() {
    if(this.company_id != '') {
      this.loadProducts()
    }
  },
}
</script>
