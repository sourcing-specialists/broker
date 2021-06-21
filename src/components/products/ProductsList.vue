<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col>
          <search-bar v-model="search"></search-bar>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col
          v-if="!isForOrders"
          :lg="2"
        >
          <inco-selection
            :forOrders="isForOrders"
          ></inco-selection>
        </v-col>
        <v-col
          :lg="isForOrders ? 5 : 4"
        >
          <categories-selection
            :listIncoterm="listIncoterm"
            :inOrders="isForOrders"
            @categoriesChanged="categoriesChanged"
          ></categories-selection>
        </v-col>
        <v-col
          :lg="isForOrders ? 5 : 4"
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
    <v-divider></v-divider>
    <v-container
      fluid
      v-if="$store.getters.catView == 'list'"
      style="min-height: 100px;"
    >
      <loading-box v-model="isLoading"></loading-box>
      <v-row
        class="list-header"
        v-if="products.length > 0"
      >
        <v-col
          class="productsHeader"
          :lg="h.col"
          :md="h.col"
          v-for="(h, index) in listHeader"
          :key="index"
        >
          <p
            v-if="filterHeader(h)"
          ><strong>{{ h.text }}</strong></p>
          <v-checkbox
            v-if="h.text == 'input' && !isForOrders"
            v-model="activateSelection">
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
      <!--Pagination-->
      <products-list-pagination
        v-model="page"
        :totalPages="totalPages"
        @pageSizeChange="pageSize = $event"
      ></products-list-pagination>
      <!--END Pagination-->
    </v-container>
    <v-container
      fluid
      v-if="$store.getters.catView == 'tiles'"
    >
      <v-row>
        <v-col lg="3">
          <categories-tree
            :listIncoterm="listIncoterm"
            :selectedCategories="selectedCategories"
            @categoriesChanged="categoriesChanged"
          ></categories-tree>
        </v-col>
        <v-col>
          <!--END Pagination-->
          <v-row :class="['product-tile-row', $vuetify.breakpoint.name]">
            <loading-box v-model="isLoading"></loading-box>
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
          <!--Pagination-->
          <products-list-pagination
            v-model="page"
            :totalPages="totalPages"
            @pageSizeChange="pageSize = $event"
          ></products-list-pagination>
          <!--END Pagination-->
        </v-col>
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
        v-if="error == ''"
      >
        {{ $t('no_products') }} {{ error }}
      </v-alert>
      <v-alert
        border="left"
        colored-border
        type="error"
        elevation="2"
        v-if="error != ''"
      >
        {{ error }}
      </v-alert>
    </div>
    <selection-options v-model="activateSelection"></selection-options>
  </div>
</template>

<script>
import ProductAsList from './ProductAsList.vue'
import ProductAsTile from './ProductAsTile.vue'
import CategoriesSelection from '../CategoriesSelection.vue'
import CustomCatalogueSelection from '../CustomCatalogueSelection'
import SelectionOptions from './selectionOptions'
import IncoSelection from '../incoSelection'
import loadingBox from '../loadingBox'
import searchBar from './searchBar'
import categoriesTree from '../categoriesTree'
import productsListPagination from './productsListPagination'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ProductsList',
  props: ['forOrders'],
  components: {
    ProductAsList,
    ProductAsTile,
    CategoriesSelection,
    CustomCatalogueSelection,
    SelectionOptions,
    IncoSelection,
    loadingBox,
    searchBar,
    categoriesTree,
    productsListPagination
  },
  data: function() {
    return {
      search: '',
      selectedCategories: [],
      products: [],
      activateSelection: false,
      listHeader: [],
      catalogue: '',
      isLoading: true,
      error: '',
      page: 1,
      totalPages: 1,
      pageSize: 15
    }
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
    },
    page() {
      this.loadProducts()
    },
    pageSize() {
      this.loadProducts()
    },
    search() {
      this.loadProducts()
    }
  },
  computed: {
    ...mapGetters('cart', [
      'incoterm'
    ]),
    ...mapGetters([
      'getLanguage',
      'getIncoterm'
    ]),
    currency() {
      return this.$store.getters.getCurrency
    },
    isForOrders() {
      return this.forOrders == '' ? true : false
    },
    listIncoterm() {
      if(this.isForOrders) return this.incoterm
      return this.getIncoterm
    }
  },
  methods: {
    filterSearch: _.debounce(function() {
      this.loadProducts()
    }, 600),
    filterHeader(header) {
      //h.text != 'input' && isForOrders === h.inOrders
      if(header.text == 'input') {
        return false
      }
      if(this.isForOrders) {
        if(header.inOrders) {
          return true
        }
        return false
      }
      return true
    },
    loadProducts() {
      //must rebuild header because deeper nodes do not react
      this.listHeader = [
        { text: 'input', inOrders: true, col: 1 },
        { text: this.$t('product_name'), inOrders: true, col: (this.isForOrders ? 3 : 4) },
        { text: this.$t('categories'), inOrders: false, col: 1 },
        { text: this.$t('packing'), inOrders: true, col: 2 },
        { text: this.$t('price') + ' ' + this.listIncoterm, inOrders: true, col: 3 }
      ]

      this.products = []
      this.isLoading = true

      this.$http.post(this.endpoint(`catalogue/get`), { 
        currency: this.$store.getters.getCurrency,
        pageSize: this.pageSize,
        pageNumber: this.page,
        incoterm: this.listIncoterm,
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
          this.products = resp.data.data.items
          this.totalPages = resp.data.data.pagination.totalPages
        }
        this.isLoading = false
      }).catch( error => {
        this.isLoading = false
        this.error = `${error.response.data.message.message}`
      })
    },
    categoriesChanged(e) {
      this.page = 1
      this.selectedCategories = e
      this.loadProducts()
    },
    changeView(display) {
      this.activateSelection = false
      this.$store.commit('setCatalogueView', display)
    }
  },
  mounted() {
    if(this.$route.query.search) {
      this.search = this.$route.query.search
    }
    this.loadProducts()
  }
}
</script>
<style scoped lang="scss">
.activated {
  background-color: #CCC;
}
.product-tile-row {
  position: relative;
  padding: 25px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  &.lg {
    grid-template-columns: repeat(3, 1fr);
  }
  &.md {
    grid-template-columns: repeat(2, 1fr);
  }
  &.sm {
    grid-template-columns: repeat(1, 1fr);
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
.pagination_container {
  margin-bottom: -25px;
}
</style>