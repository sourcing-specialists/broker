<template>
  <div
  >
    <div
      class="product-row"
    >
      <v-row
        :class="{swiped: swiped}"
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
            </h4>
            <p><span class="font-weight-bold">Ref Number:</span> {{ mainOption.ref }}</p>
            <p><span class="font-weight-bold">Carton Size:</span> {{ meas(mainOption) }}</p>
            <p>{{ productData.description.length >= 100 ? `${productData.description.substring(0,100)}...` : productData.description }}</p>
          </div>
        </v-col>
        <v-col
          lg="2"
          md="2"
          class="d-flex align-center"
        >
          <ul v-html="packing(mainOption)"></ul>
        </v-col>
        <v-col
          lg="1"
          md="1"
          class="d-flex align-center"
        >
          <p>{{ mainOption.min_order }} Cartons</p>
        </v-col>
        <v-col
          lg="3"
          md="3"
          class="d-flex align-center"
        >
          <ul class="pa-2" v-html="prices(mainOption)"></ul>
        </v-col>
        <v-col
          lg="1"
          md="1"
          class="d-flex align-center"
        >
          <v-btn
            :class="['ma-2 show-options', { opened: showOptions }]"
            x-small
            fab
            v-if="productData.options.length > 1"
            @click="toggleOptions()"
          >
            <v-icon>fa-chevron-down</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <product-hidden-options
        :id="productData.id"
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
    <v-dialog
      v-model="showFullDetails"
      transition="dialog-bottom-transition"
      max-width="720"
    >
      <product-details-modal
        :product="productData"
      />
    </v-dialog>
  </div>
</template>

<script> 
import ProductImage from './ProductImage.vue'
import ProductAsListOptions from './ProductAsListOptions.vue'
import ProductHiddenOptions from './ProductHiddenOptions'
import ProductDetailsModal from './ProductDetailsModal'

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
    }
  },
  components: {
    ProductImage,
    ProductAsListOptions,
    ProductHiddenOptions,
    ProductDetailsModal
  },
  data() {
    return {
      color: this.$store.getters.vColor,
      swiped: false,
      showOptions: false,
      showFullDetails: false
    }
  },
  methods: {
    fullDetailsToggle(val) {
      this.showFullDetails = val
    },
    packing(option) {
      var string = `
        <li><span class="font-weight-bold">${option.inner_unit_text}:</span> ${option.inner_units}</li>
        <li><span class="font-weight-bold">${option.outer_unit_text}:</span> ${option.outer_units}</li>
      `
      return string
    },
    meas(option) {
      var string = `${option.length}cm x ${option.width}cm x ${option.height}cm`
      return string
    },
    prices(option) {
      var string = ''
      option.tiers.map(function(t) {
        string+= `<li><span class="font-weight-bold">${t.cost_per_carton}</span> (${t.from} to ${t.to})</li>`
      })
      return string
    },
    swipe(direction) {
      if(direction == 'right') {
        this.swiped = false
        return
      }
      this.swiped = !this.swiped
    },
    toggleOptions() {
      this.showOptions = !this.showOptions
    }
  },
  computed: {
    mainOption() {
      if(this.productData.options[0] !== undefined) {
        return this.productData.options[0]
      }
      return false
    },
    image() {
      return this.productData.images[0].thumb ? this.productData.images[0].thumb : ''
    }
  },
  beforeMount() {

  }
}
</script>
<style scoped lang="scss">
  .product-row {
    overflow: hidden;
    position: relative;
    transition: all ease-in-out 0.5s;
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
      &.swiped {
        transform: translateX(-100px);
      }
      .show-options {
        transition: all ease-in-out 0.3s;
        &.opened {
          transform: rotate(180deg);
        }
      }
    }
  }
  p {
    margin-bottom: 0px !important;
  }
</style>