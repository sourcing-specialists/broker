<template>
  <v-card
    light
    class="pa-8"
  >
    <v-row>
      <v-col
        lg="4"
      >
        <v-carousel
          :continuous="false"
          :cycle="true"
          :show-arrows="true"
          hide-delimiter-background
          delimiter-icon="mdi-minus"
        >
          <v-carousel-item
            v-for="(image, i) in product.images"
            :key="i"
          >
            <v-img
              contain
              :lazy-src="image.thumb"
              :src="image.small"
            ></v-img>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col
        lg="8"
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
        <p>{{ product.description }}</p>
        <ul>
          <li><span class="font-weight-bold">Ref Number:</span> {{ mainOption.ref }}</li>
          <li><span class="font-weight-bold">Carton Size:</span> {{ mxMeas(mainOption) }}</li>
          <li><span class="font-weight-bold">MOQ:</span> {{ mainOption.min_order }} Cartons</li>
        </ul>
        <ul v-html="mxPacking(mainOption)"></ul>
      </v-col>
    </v-row>
    <h4>Options</h4>
    <v-data-table
      :headers="headers"
      :items="options"
      hide-default-footer
    >
      <template v-slot:item.packing="{ item }">
        <ul v-html="item.packing"></ul>
      </template>
      <template v-slot:item.price="{ item }">
        <ul class="price-tiers" v-html="item.price"></ul>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: 'ProductDetailsModal',
  props: ['product'],
  data() {
    return {
      headers: [
        { text: 'Ref', align: 'start', sortable: true, value: 'ref' },
        { text: 'Option', align: 'start', sortable: true, value: 'option' },
        { text: 'Min Order', align: 'start', sortable: true, value: 'min_order' },
        { text: 'Packing', align: 'start', sortable: false, value: 'packing' },
        { text: 'Price', align: 'start', sortable: false, value: 'price' },
      ]
    }
  },
  methods: {

  },
  computed: {
    options() {
      var vue = this
      this.product.options.map(function(o) {
        o.option = `${o.group_name}: ${o.group_value}`
        o.packing = vue.mxPacking(o)
        o.price = vue.mxPriceTiers(o)
      })
      return this.product.options
    },
    mainOption() {
      if(this.product.options[0] !== undefined) {
        return this.product.options[0]
      }
      return {}
    },
  }
}
</script>