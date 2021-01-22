<template>
  <v-card>
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
      <p>{{ product.description.length >= 100 ? `${product.description.substring(0,100)}...` : product.description }}</p>
      <ul>
        <li><span class="font-weight-bold">Ref Number:</span> {{ mainOption.ref }}</li>
        <li><span class="font-weight-bold">Carton Size:</span> {{ mxMeas(mainOption) }}</li>
        <li><span class="font-weight-bold">MOQ:</span> {{ mainOption.min_order }} Cartons</li>
      </ul>
      <ul v-html="mxPacking(mainOption)"></ul>
      <h5>Price Tiers</h5>
      <ul class="price-tiers" v-html="mxPriceTiers(mainOption)"></ul>
    </div>
  </v-card>
</template>

<script> 
export default {
  name: 'ProductAsTile',
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
    }
  },
  data() {
    return {

    }
  },
  computed: {
    mainOption() {
      if(this.product.options[0] !== undefined) {
        return this.product.options[0]
      }
      return {}
    },
  }
}
</script>