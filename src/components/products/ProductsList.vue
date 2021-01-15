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
          ></v-text-field>
        </v-col>
        <v-col lg="4" md="4">
          <categories-selection
            @cargoChanged="cargoChanged"
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
      <product-as-tile />
    </v-container>
  </div>
</template>

<script>
import ProductAsList from './ProductAsList.vue'
import ProductAsTile from './ProductAsTile.vue'
import CargosSelection from '../CargosSelection.vue'
import CategoriesSelection from '../CategoriesSelection.vue'

export default {
  name: 'ProductsList',
  data() {
    return {
      search: '',
      selectedCargo: '',
      products: [],
      listHeader: [
        { text: '', col: 1 },
        { text: 'Name', col: 4 },
        { text: 'Packing', col: 2 },
        { text: 'Min. Order', col: 1 },
        { text: 'Price', col: 3 },
        { text: '', col: 1 },
      ]
    }
  },
  components: {
    ProductAsList,
    ProductAsTile,
    CargosSelection,
    CategoriesSelection
  },
  methods: {
    loadProducts() {
      this.$http.post(this.endpoint(`catalogue/get`), { cargo_id: this.selectedCargo })
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
    changeView(display) {
      this.$store.commit('setCatalogueView', display)
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