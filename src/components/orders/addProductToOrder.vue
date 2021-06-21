<template>
  <v-card
    style="height: 800px;"
  >
    <v-card-title>{{ $t('orders.add_product') }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <search-bar 
        v-model="search"
      ></search-bar>
    </v-card-text>
    <v-card-text>
      <loading-box v-model="loading"></loading-box>
      <product-as-list
        v-for="(product,index) in products"
        :key="index" 
        :productData="product"
        :addCart="true"
        @productAdd="addModal(product)"
      ></product-as-list>
    </v-card-text>
    <product-modal
      v-if="showProductModal"
      :product="addProduct"
      :can-order="true"
      :add-to-order="true"
      :order-id="orderId"
      @toggleDialogStatus="showProductModal = !showProductModal"
      v-on="$listeners"
    ></product-modal>
  </v-card>
</template>

<script>
import searchBar from '../products/searchBar.vue'
import ProductAsList from '../products/ProductAsList.vue'
import LoadingBox from '../loadingBox.vue'
import productModal from './productModal.vue'

export default {
  name: 'addProductToOrder',
  props: ['order-id', 'currency', 'order-incoterm'],
  components: {
    searchBar,
    ProductAsList,
    LoadingBox,
    productModal
  },
  data() {
    return {
      search: '',
      loading: false,
      products: [],
      addProduct: '',
      showProductModal: false
    }
  },
  watch: {
    search() {
      this.loadProducts()
    }
  },
  methods: {
    addModal(p) {
      this.showProductModal = true
      this.addProduct = p
    },
    loadProducts() {
      if(this.search === null) {
        this.products = []
        return
      }
      if(this.search !== '') {
        this.loading = true
        this.$http.post(this.endpoint(`catalogue/get`), { 
          currency: this.currency,
          pageSize: 25,
          pageNumber: 1,
          incoterm: this.orderIncoterm,
          filter: [
            {
              keywords: this.search
            },
            {
              ref: ''
            },
          ]
        }).then( resp => {
          if(resp.data.result == true) {
            console.log(resp.data.data.items)
            this.products = resp.data.data.items
          }
          this.loading = false
        }).catch( () => {
          this.loading = false
        })
      }
    }
  }
}
</script>