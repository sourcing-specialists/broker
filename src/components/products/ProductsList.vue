<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-text-field
            append-icon="mdi-magnify"
            v-model="search"
            :label="$t('search')"
            @keyup="filterSearch"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col
          v-if="getIncoterm !== 'FOB'"
          :lg="3"
        >
          <cargos-selection
            :inOrders="true"
            @cargoChanged="cargoChanged"
          />
        </v-col>
        <v-col
          :lg="getIncoterm !== 'FOB' ? 4 : 5"
        >
          <categories-selection
            :cargo_id="selectedCargo"
            @categoriesChanged="categoriesChanged"
           />
        </v-col>
        <v-col
          :lg="getIncoterm !== 'FOB' ? 3 : 5"
        >
          <custom-catalogue-selection
            v-model="catalogue"
          ></custom-catalogue-selection>
        </v-col>
        <v-col
          :lg="2"
        >
          <ul class="d-flex justify-space-around">
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
      v-if="isLoading"
    />
    <v-container
      fluid
      v-if="products.length > 0 && $store.getters.catView == 'list'"
    >
      <v-row
        class="list-header"
      >
        <v-col
          class="productsHeader"
          :lg="h.col"
          :md="h.col"
          v-for="(h, index) in listHeader"
          :key="index"
        >
          <p v-if="h.text != 'input'"><strong>{{ h.text }}</strong></p>
          <v-checkbox v-if="h.text == 'input' && !isForOrders" v-model="activateSelection">
          </v-checkbox>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <product-as-list
        v-for="(product,index) in products"
        :key="index" 
        :productData="product"
        :addCart="isForOrders"
        :canSelect="activateSelection"
        @productAdd="$emit('addModal', product)"
      />
    </v-container>
    <v-container
      fluid
      v-if="products.length > 0 && $store.getters.catView == 'tiles'"
    >
      <v-row
        :class="['product-tile-row', $vuetify.breakpoint.name]"
      >
        <div
          class="tile-item"
          v-for="(product, index) in products"
          :key="index" 
          lg="3"
          md="4"
        >
          <product-as-tile 
            :product="product"
            :addCart="isForOrders"
            @productAdd="$emit('addModal', product)"
          />
        </div>
      </v-row>
    </v-container>
    <div
      class="no-results"
      v-if="products.length === 0 && isLoading === false"
    >
      <v-alert
        border="left"
        colored-border
        type="warning"
        elevation="2"
      >
        {{ $t('no_products') }}
      </v-alert>
    </div>
    <selection-options v-model="activateSelection"></selection-options>
  </div>
</template>

<script>
import ProductAsList from './ProductAsList.vue'
import ProductAsTile from './ProductAsTile.vue'
import CargosSelection from '../CargosSelection.vue'
import CategoriesSelection from '../CategoriesSelection.vue'
import CustomCatalogueSelection from '../CustomCatalogueSelection'
import SelectionOptions from './selectionOptions'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ProductsList',
  props: ['forOrders'],
  data: function() {
    return {
      search: '',
      selectedCargo: this.$store.getters.cargo.id,
      selectedCategories: [],
      products: [],
      activateSelection: false,
      listHeader: [],
      catalogue: '',
      isLoading: true
    }
  },
  components: {
    ProductAsList,
    ProductAsTile,
    CargosSelection,
    CategoriesSelection,
    CustomCatalogueSelection,
    SelectionOptions
  },
  watch: {
    getIncoterm: function(val, old) {
      if(val != old) {
        this.loadProducts()
      }
    },
    currency: function(val, old) {
      if(val != old) {
        this.loadProducts()
      }
    },
    catalogue: function() {
      this.loadProducts()
    },
    getLanguage: function() {
      this.loadProducts()
    }
  },
  computed: {
    ...mapGetters([
      'getLanguage',
      'getIncoterm',
      'cargo'
    ]),
    currency() {
      return this.$store.getters.getCurrency
    },
    isForOrders() {
      return this.forOrders == '' ? true : false
    }
  },
  methods: {
    filterSearch: _.debounce(function() {
      this.loadProducts()
    }, 600),
    loadProducts() {
      //must rebuild header because deeper nodes do not react
      this.listHeader = [
        { text: 'input', col: 1 },
        { text: this.$t('product_name'), col: 4 },
        { text: this.$t('categories'), col: 1 },
        { text: this.$t('packing'), col: 2 },
        { text: this.$t('price') + ' ' + this.$store.getters.getIncoterm, col: 3 }
      ]

      this.products = []
      this.isLoading = true
      this.$http.post(this.endpoint(`catalogue/get`), { 
        cargo_id: this.selectedCargo,
        currency: this.$store.getters.getCurrency,
        pageSize: '25',
        pageNumber: 1,
        incoterm: this.getIncoterm,
        filter: [
          {
            custom_catalogue: this.catalogue
          },
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
      }, { headers: { lang: this.getLanguage }})
      .then( resp => {
        if(resp.data.result == true) {
          this.$emit('loaded')
          this.products = resp.data.data
        }
        this.isLoading = false
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
      this.activateSelection = false
      this.$store.commit('setCatalogueView', display)
    }
  },
  beforeMount() {
    this.loadProducts()
  }
}
</script>
<style scoped lang="scss">
.activated {
  background-color: #CCC;
}
.product-tile-row {
  padding: 25px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  &.lg {
    grid-template-columns: repeat(4, 1fr);
  }
  &.md {
    grid-template-columns: repeat(3, 1fr);
  }
  &.sm {
    grid-template-columns: repeat(2, 1fr);
  }
  &.xs {
    grid-template-columns: repeat(1, 1fr);
  }
  .tile-item {
    width: 100%;
    display: flex;
  }
}
.productsHeader {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>