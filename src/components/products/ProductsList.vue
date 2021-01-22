<template>
  <div>
    <v-card-title>Products</v-card-title>
    <v-container fluid>
      <v-row>
        <v-col lg="2" md="2">
          <cargos-selection
            @cargoChanged="cargoChanged"
           />
        </v-col>
        <v-col lg="4" md="4">
          <v-text-field
            append-icon="mdi-magnify"
            v-model="search"
            label="Search"
            @keyup="filterSearch"
          ></v-text-field>
        </v-col>
        <v-col lg="4" md="4">
          <categories-selection
            @categoriesChanged="categoriesChanged"
           />
        </v-col>
        <v-col lg="2" md="2">
          <ul class="d-flex d-justify-end">
            <li>
              <v-btn
                fab
                :class="{ activated: $store.getters.catView == 'list' }"
                @click="changeView('list')"
              >
                <v-icon>fa-stream</v-icon>
              </v-btn>
            </li>
            <li>
              <v-btn
                fab
                :class="{ activated: $store.getters.catView == 'tiles' }"
                @click="changeView('tiles')"
              >
                <v-icon>fa-th-large</v-icon>
              </v-btn>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
    <v-skeleton-loader
      class="mx-auto"
      type="table"
      v-if="products.length == 0"
    />
    <v-container
      fluid
      v-if="products.length > 0 && $store.getters.catView == 'list'"
    >
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
      />
    </v-container>
    <v-container
      fluid
      v-if="products.length > 0 && $store.getters.catView == 'tiles'"
    >
      <v-row
        class="d-flex align-stretch"
      >
        <v-col
          v-for="(product, index) in products"
          :key="index" 
          lg="3"
          md="4"
        >
          <product-as-tile :product="product" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ProductAsList from './ProductAsList.vue'
import ProductAsTile from './ProductAsTile.vue'
import CargosSelection from '../CargosSelection.vue'
import CategoriesSelection from '../CategoriesSelection.vue'
import _ from 'lodash'

export default {
  name: 'ProductsList',
  data() {
    return {
      search: '',
      selectedCargo: '',
      selectedCategories: [],
      products: [],
      listHeader: [
        { text: '', col: 1 },
        { text: 'Name', col: 4 },
        { text: 'Categories', col: 1 },
        { text: 'Packing', col: 2 },
        { text: 'Price', col: 3 }
      ]
    }
  },
  components: {
    ProductAsList,
    ProductAsTile,
    CargosSelection,
    CategoriesSelection
  },
  watch: {
    currency: function(val, old) {
      if(val != old) {
        this.loadProducts()
      }
    }
  },
  methods: {
    filterSearch: _.debounce(function() {
      console.log(123)
      this.loadProducts()
    }, 300),
    loadProducts() {
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
        }
      })
    },
    cargoChanged(e) {
      this.selectedCargo = e
      this.loadProducts()
    },
    categoriesChanged(e) {
      this.selectedCategories = e
      this.loadProducts()
    },
    changeView(display) {
      this.$store.commit('setCatalogueView', display)
    }
  },
  computed: {
    currency() {
      return this.$store.getters.getCurrency
    }
  },
  beforeMount() {
    this.loadProducts()
  }
}
</script>
<style scoped>
.activated {
  background-color: #CCC;
}
</style>