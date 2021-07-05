<template>
  <div
  >
    <div
      :class="['product-row', { opened: showOptions }]"
      @click="select(productData.id)"
    >
      <v-row
        :class="[{swiped: swiped}, { selected: isSelected }]"
        v-touch="{
          left: () => swipe('left'),
          right: () => swipe('right'),
        }"
      >
        <v-col
          lg="1"
          md="1"
          class="pa-4 d-flex align-center"
        >
          <ProductImage :src="image" />
        </v-col>
        <v-col
          lg="4"
          md="4"
          class="d-flex align-center"
        >
          <div>
            <h4>
              <span :style="`color: ${$store.getters.hexColor}`">{{ productData.name }}</span> 
              <span
                v-if="mainOption"
              >
                {{ mainOption.group_name }}: {{ mainOption.group_value }}
              </span>
              <v-btn
                color="indigo"
                v-if="productData.certifications.length > 0"
                @click="showCertifications"
              ><v-icon>mdi-certificate</v-icon></v-btn>
            </h4>
            <div class="product_option_description" v-html="mxOptionDetails(mainOption)"></div>
          </div>
        </v-col>
        <v-col
          lg="1"
          md="1"
          class="d-flex align-center"
          v-if="!canOrder"
        >
          <p>{{ categories }}</p>
        </v-col>
        <v-col
          lg="2"
          md="2"
          class="d-flex align-center"
        >
          <ul style="padding-left: 10px !important;" v-html="mxPacking(mainOption)"></ul>
        </v-col>
        <v-col
          :lg="canOrder ? 4 : 4"
          :md="canOrder ? 4 : 4"
          class="d-flex align-center"
        >
          <ul class="pa-2 price-tiers" v-html="mxPriceTiers(mainOption)"></ul>
        </v-col>
        <v-col
          lg="1"
          md="1"
          class="d-flex align-center"
          v-if="canOrder"
        >
          <v-btn
            class="ma-2"
            x-small
            fab
            elevation="2"
            :color="$store.getters.vColor"
            @click="$emit('productAdd')"
          >
            <span class="white--text"><v-icon>mdi-plus</v-icon></span>
          </v-btn>
        </v-col>
        <div
          class="options-toggle"
          v-if="productData.options.length > 1 && !canOrder && !canSelect"
        >
          <v-btn
            :class="['ma-2 show-options', { opened: showOptions }]"
            x-small
            fab
            @click="toggleOptions()"
          >
            <v-icon>fa-chevron-down</v-icon>
          </v-btn>
        </div>
        <div class="options-trigger" v-if="!canSelect">
          <v-btn
            @click="swipe('left')"
            text
            dark
            :color="$store.getters.vColor"
          >
            <v-icon v-if="!swiped">fa-long-arrow-alt-left</v-icon>
            <v-icon v-if="swiped">fa-long-arrow-alt-right</v-icon>
          </v-btn>
        </div>
      </v-row>
      <product-hidden-options
        :id="productData.id"
        :datasheet="productData.datasheet_url"
        @showToggle="fullDetailsToggle"
      />
    </div>
    <vue-page-transition name="fade-in-right">
      <product-as-list-options 
        v-if="showOptions"
        :options="productData.options"
      ></product-as-list-options>
    </vue-page-transition>
    <v-divider />
    <product-details-modal
      :product="productData"
      v-if="showFullDetails"
      @toggleDialogStatus="showFullDetails = false"
    ></product-details-modal>
    <v-dialog
      v-model="showCertificationsModal"
      transition="dialog-bottom-transition"
      max-width="720"
    >
      <product-certifications
        :product="productData"
        :certifications="productData.certifications"
      ></product-certifications> 
    </v-dialog>
  </div>
</template>

<script> 
import ProductImage from './ProductImage.vue'
import ProductAsListOptions from './ProductAsListOptions.vue'
import ProductHiddenOptions from './ProductHiddenOptions'
import ProductDetailsModal from '../orders/productModal'
import productCertifications from './ProductCertifications'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'Product',
  props: {
    productData: {
      type: Object,
      default: () => {
        return {
          img: '',
          ref: '',
          name: '',
          description: '',
          packing: '',
          carton: '',
          price: ''
        }
      }
    },
    displayType: {
      default: 'list'
    },
    addCart: {
      default: false
    },
    canSelect: {
      default: false
    }
  },
  components: {
    ProductImage,
    ProductAsListOptions,
    ProductHiddenOptions,
    ProductDetailsModal,
    productCertifications
  },
  data() {
    return {
      color: this.$store.getters.vColor,
      swiped: false,
      showOptions: false,
      showFullDetails: false,
      showCertificationsModal: false
    }
  },
  computed: {
    ...mapGetters([
      'selected',
      'getIncoterm'
    ]),
    isSelected() {
      return this.canSelect ? this.selected.some(s => s === this.productData.id) : false
    },
    canOrder() {
      if(this.addCart === false) return false
      return true
    },
    mainOption() {
      if(this.productData.options[0] !== undefined) {
        return this.productData.options[0]
      }
      return {}
    },
    image() {
      return this.productData.images[0] !== undefined ? this.productData.images[0].thumb : ''
    },
    categories() {
      var str = ''
      if(this.productData.categories !==  null) {
        this.productData.categories.map(function(c) {
          str+= c.name+', ' 
        })
      }
      return str
    }
  },
  methods: {
    ...mapMutations([
      'addToSelection'
    ]),
    showCertifications() {
      this.showCertificationsModal = true
    },
    fullDetailsToggle(val) {
      this.showFullDetails = val
    },
    swipe(direction) {
      if(this.canSelect) {
        return
      }
      if(direction == 'right') {
        this.swiped = false
        return
      }
      this.swiped = !this.swiped
    },
    toggleOptions() {
      this.showOptions = !this.showOptions
    },
    select(id) {
      if(!this.canSelect) {
        return
      }
      this.addToSelection(id)
    }
  }
}
</script>
<style scoped lang="scss">
  .product-row {
    overflow: hidden;
    position: relative;
    transition: all ease-in-out 0.5s;
    &.opened {
      .row {
        background-color: #E3F2FD !important;
      }
    }
    .options-trigger {
      position: absolute;
      top: 0px;
      right: 0px;
      z-index: 2;
    }
    .options-toggle {
      position: absolute;
      right: 10px;
      top: calc(50% - 20px);
    }
    .product-hidden-options {
      background-color: #F2F2F2;
      position: absolute;
      height: 100%;
      min-width: 150px;
      right: 0px;
      top: 0px;
      z-index: 0;
    }
    .row {
      position: relative;
      z-index: 1;
      margin: 0px;
      background-color: #FFF;
      transform: translateX(0px);
      transition: all ease-in-out 0.5s;
      &.selected {
        background-color: #BBDEFB !important;
      }
      &.swiped {
        transform: translateX(-100px);
      }
      .show-options {
        transition: all ease-in-out 0.3s;
        &.opened {
          transform: rotate(180deg);
        }
      }
      &:hover {
        background-color: #F2F2F2;
      }
    }
  }
  p {
    margin-bottom: 0px !important;
  }
</style>