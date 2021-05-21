<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-text-field
            append-icon="mdi-magnify"
            v-model="search"
            :label="$t('search')"
            clearable
            @input="filterSearch"
            @keyup="filterSearch"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col
          v-if="!isForOrders"
          :lg="listIncoterm === 'FOB' ? 2 : 1"
        >
          <inco-selection
            :forOrders="isForOrders"
          ></inco-selection>
        </v-col>
        <v-col
          v-if="!isForOrders && listIncoterm !== 'FOB'"
          :lg="3"
        >
          <cargo-select
            v-model="selectedCargo"
            @change="cargoChanged"
          ></cargo-select>
        </v-col>
        <v-col
          :lg="isForOrders ? 5 : (listIncoterm !== 'FOB' ? 3 : 4)"
        >
          <categories-selection
            :listIncoterm="listIncoterm"
            :inOrders="isForOrders"
            @categoriesChanged="categoriesChanged"
          ></categories-selection>
        </v-col>
        <v-col
          :lg="isForOrders ? 5 : (listIncoterm !== 'FOB' ? 3 : 4)"
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
    <!--Pagination-->
    <v-container
      class="pagination_container"
      fluid
      v-if="products.length > 0"
    >
      <v-row>
        <v-col class="d-flex justify-end">
          <div style="width: 75px;">
            <v-select
              v-model="pageSize"
              :items="[5,10,25,50,100]"
              outlined
              dense
            ></v-select>
          </div>
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="totalPages >= 6 ? 7 : totalPages"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <!--END Pagination-->
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
    </v-container>
    <v-container
      fluid
      v-if="$store.getters.catView == 'tiles'"
    >
      <loading-box v-model="isLoading"></loading-box>
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
    <!--Pagination-->
    <v-container
      v-if="products.length > 0"
      fluid
    >
      <v-row>
        <v-col class="d-flex justify-end">
          <div style="width: 75px;">
            <v-select
              v-model="pageSize"
              :items="[5,10,25,50,100]"
              outlined
              dense
            ></v-select>
          </div>
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="totalPages >= 6 ? 7 : totalPages"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
    <!--END Pagination-->
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
import cargoSelect from '../cargoSelect'
import CategoriesSelection from '../CategoriesSelection.vue'
import CustomCatalogueSelection from '../CustomCatalogueSelection'
import SelectionOptions from './selectionOptions'
import IncoSelection from '../incoSelection'
import loadingBox from '../loadingBox'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ProductsList',
  props: ['forOrders'],
  data: function() {
    return {
      search: '',
      selectedCargo: this.forOrders !== undefined ? this.$store.getters['cart/cargo'] : this.$store.getters.catalogueCargo,
      selectedCategories: [],
      products: [],
      activateSelection: false,
      listHeader: [],
      catalogue: '',
      isLoading: true,
      error: '',
      page: 1,
      totalPages: 1,
      pageSize: 25
    }
  },
  components: {
    ProductAsList,
    ProductAsTile,
    cargoSelect,
    CategoriesSelection,
    CustomCatalogueSelection,
    SelectionOptions,
    IncoSelection,
    loadingBox
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
  },
  computed: {
    ...mapGetters('cart', [
      'incoterm',
      'cargo'
    ]),
    ...mapGetters([
      'getLanguage',
      'getIncoterm',
      'catalogueCargo'
    ]),
    currency() {
      return this.$store.getters.getCurrency
    },
    isForOrders() {
      return this.forOrders == '' ? true : false
    },
    canSelectCargo() {
      if(this.isForOrders) return false
      if(this.getIncoterm !== 'FOB') return true
      return false
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
      if(this.selectedCargo === undefined) {
        this.selectedCargo = this.$store.getters.catalogueCargo
      }
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
        cargo_id: this.selectedCargo.id,
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
    cargoChanged(e) {
      this.selectedCargo = e
      this.page = 1
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
.pagination_container {
  margin-bottom: -25px;
}
</style>