<template>
  <v-card class="tile-content">
    <img
      class="tile-product-image"
      contain
      :src="product.images[0].small"
    >
    <div
      class="pa-4"
    >
      <ul>
        <li><span class="font-weight-bold">{{ $t('components.products.ref_number') }}:</span> {{ mainOption.ref }}</li>
      </ul>
      <h4>
        <span :style="`color: ${$store.getters.hexColor}`">{{ product.name }}</span> 
        <span
          v-if="mainOption"
        >
          {{ mainOption.group_name }}: {{ mainOption.group_value }}
        </span>
        <v-btn
          color="indigo"
          v-if="product.certifications.length > 0"
          @click="showCertificationsModal = true"
        ><v-icon>mdi-certificate</v-icon></v-btn>
      </h4>
      <p>{{ product.description.length >= 40 ? `${product.description.substring(0,40)}...` : product.description }}</p>
      <!--<ul>
        <li><span class="font-weight-bold">{{ $t('components.products.ref_number') }}:</span> {{ mainOption.ref }}</li>
        <li><span class="font-weight-bold">{{ $t('components.products.carton_size') }}:</span> {{ mxMeas(mainOption) }}</li>
        <li><span class="font-weight-bold">{{ $t('moq') }}:</span> {{ mainOption.min_order }} {{ $tc('carton',mainOption.min_order) }}</li>
      </ul>
      <ul v-html="mxPacking(mainOption)"></ul>-->
      <h5>{{ $t('price') }}</h5>
      <v-divider></v-divider>
      <ul 
        v-html="mxPriceTiers(mainOption, false, $store.getters.getIncoterm, true)"
        :class="[ { ['price-tiers']: $store.getters.getIncoterm === 'REVOOLOOPPP' }, 'mt-1' ]"
      ></ul>
    </div>
    <v-card-actions
      :class="['asTile']"
    >
      <product-hidden-options
        tile
        :id="product.id"
        :datasheet="product.datasheet_url"
        :addCartButton="addToCart"
        @showToggle="fullDetailsToggle"
        v-on="$listeners"
      ></product-hidden-options>
    </v-card-actions>
    
    <product-details-modal
      :product="product"
      v-if="showFullDetails"
      @toggleDialogStatus="showFullDetails = false"
    ></product-details-modal>

    <v-dialog
      v-model="showCertificationsModal"
      transition="dialog-bottom-transition"
      max-width="720"
    >
      <product-certifications
        :product="product"
        :certifications="product.certifications"
      ></product-certifications> 
    </v-dialog>
  </v-card>
</template>

<script> 
import ProductHiddenOptions from './ProductHiddenOptions.vue'
import ProductDetailsModal from '../orders/productModal'
import productCertifications from './ProductCertifications'

export default {
  name: 'ProductAsTile',
  components: {
    ProductHiddenOptions,
    ProductDetailsModal,
    productCertifications
  },
  props: {
    product: {
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
    addCart: {
      default: false
    }
  },
  data() {
    return {
      showFullDetails: false,
      showCertificationsModal: false
    }
  },
  computed: {
    mainOption() {
      if(this.product.options[0] !== undefined) {
        return this.product.options[0]
      }
      return {}
    },
    addToCart() {
      return this.addCart ? true : false
    }
  },
  methods:{
    fullDetailsToggle(val) {
      this.showFullDetails = val
    },
  }
}
</script>
<style lang="scss" scoped>
.tile-content {
  width: 100%;
  display: table;
  height: 100%;
  //flex-direction: column;
}
.asTile {
  background-color: #F2F2F2;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 0px !important;
  vertical-align: bottom;
  display: table-row-group;
}
.tile-product-image {
  width: 100%;
  height: auto;
}
</style>