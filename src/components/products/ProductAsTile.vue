<template>
  <v-card class="tile-content">
    <v-img
      height="250"
      :src="product.images[0].small"
    ></v-img>
    <div
      class="pa-4"
    >
      <h4>
        <span :style="`color: ${$store.getters.hexColor}`">{{ product.name }}</span> 
        <span
          v-if="mainOption"
        >
          {{ mainOption.group_name }}: {{ mainOption.group_value }}
        </span>
      </h4>
      <v-divider></v-divider>
      <p>{{ product.description.length >= 30 ? `${product.description.substring(0,30)}...` : product.description }}</p>
      <ul>
        <li><span class="font-weight-bold">{{ $t('components.products.ref_number') }}:</span> {{ mainOption.ref }}</li>
        <li><span class="font-weight-bold">{{ $t('components.products.carton_size') }}:</span> {{ mxMeas(mainOption) }}</li>
        <li><span class="font-weight-bold">{{ $t('moq') }}:</span> {{ mainOption.min_order }} {{ $tc('carton',mainOption.min_order) }}</li>
      </ul>
      <ul v-html="mxPacking(mainOption)"></ul>
      <h5>{{ $t('price_tiers') }}</h5>
      <ul class="price-tiers" v-html="mxPriceTiers(mainOption)"></ul>
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
    <v-dialog
      v-model="showFullDetails"
      transition="dialog-bottom-transition"
    >
      <product-details-modal
        :product="product"
      />
    </v-dialog>
  </v-card>
</template>

<script> 
import ProductHiddenOptions from './ProductHiddenOptions.vue'
import ProductDetailsModal from './ProductDetailsModal'

export default {
  name: 'ProductAsTile',
  components: {
    ProductHiddenOptions,
    ProductDetailsModal
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
      showFullDetails: false
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
  display: flex;
  flex-direction: column;
}
.asTile {
  background-color: #F2F2F2;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 0px !important;
}
</style>