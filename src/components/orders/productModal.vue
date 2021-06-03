<template>
  <v-dialog
    v-model="dialog"
    max-width="1080"
  >
    <v-card
      light
      class="pa-8"
    >
      <v-row>
        <v-col
          lg="4"
        >
          <image-slider :images="images"></image-slider>
        </v-col>
        <v-col
          lg="6"
        >
          <h2 class="mColor-text">{{ product.name }}</h2>
          <p class="ps-2">{{ product.description }}</p>
        </v-col>
      </v-row>
      <div
        class="pa-3"
      >
        <h4>{{ $t('options') }}</h4>
        <v-form
          v-for="(option, option_index) in options"
          :key="option.id"
          class="option-in-modal mt-3"
          ref="opt"
        >
          <v-card
            elevation="2"
            class="mb-4"
          >
            <v-card-title
              class="pa-2"
            >
              <h5><span :style="`color: ${$store.getters.hexColor}`">{{ option.group_name }}:</span> {{ option.group_value }}</h5>
            </v-card-title>
            <v-divider></v-divider>
            <v-container>
              <v-row>
                <v-col
                  :lg="canOrder ? 3 : 5"
                  :md="canOrder ? 3 : 5"
                  class="d-flex align-center"
                >
                  <div>
                    <ul>
                      <li><span class="font-weight-bold">{{ $t('ref') }}:</span> {{ option.ref }}</li>
                      <li><span class="font-weight-bold">{{ $t('components.products.carton_size') }}:</span> {{ mxMeas(option) }}</li>
                      <li><span class="font-weight-bold">{{ $t('moq') }}:</span> {{ option.min_order }} {{ $t('components.products.carton') }}</li>
                    </ul>
                    <ul v-html="mxPacking(option)"></ul>
                  </div>
                </v-col>
                <v-col
                  v-if="canOrder"
                  lg="2"
                  md="2"
                  class="d-flex align-center"
                >
                  <div>
                    <v-select
                      v-for="(attrs, index) in option.attributes_grouped"
                      :key="index"
                      :items="attrs"
                      item-text="value"
                      item-value="attribute_id"
                      :rules="requiredRules"
                      :label="attrs[0].group_name"
                      v-model="attrs.selected"
                      full-width
                    >
                      <template v-slot:selection="{ item }">
                        <div>{{ item.value }}</div>
                      </template>
                    </v-select>
                    <div class="i-exist" v-if="inCart(option)">{{ $t('orders.products_in_cart') }}: {{ inCartQuantity(option) }} {{ $tc('components.products.carton', 2) }}</div>
                  </div>
                </v-col>
                <v-col 
                  :lg="canOrder ? 4 : 7"
                  :md="canOrder ? 4 : 7"
                  class="d-flex align-center"
                >
                  <ul class="price-tiers" v-html="mxPriceTiers(option, true)"></ul>
                </v-col>
                <v-col
                  v-if="canOrder"
                  lg="3" md="3"
                  class="d-flex align-center"
                >
                  <vue-number-input v-model="option.quantity" :min="0" center controls />
                  <v-btn
                    class="ma-2"
                    x-small
                    fab
                    elevation="2"
                    :color="$store.getters.vColor"
                    @click="addOption(option_index)"
                  >
                    <span class="white--text"><v-icon>mdi-plus</v-icon></span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>

import imageSlider from '../imageSlider'
import VueNumberInput from '@chenfengyuan/vue-number-input'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'productModal',
  props: ['product', 'can-order'],
  components: {
    imageSlider,
    VueNumberInput
  },
  data() {
    return {
      dialog: true,
      quantity: 0,
      test: '',
      options: this.product.options,
      selectedAttributes: [],
      headers: [
        { text: 'Ref', align: 'start', sortable: true, value: 'ref' },
        { text: 'Option Details', align: 'start', sortable: true, value: 'option' },
        { text: 'Attributtes', align: 'start', sortable: false, value: 'attrs' },
        { text: 'Price', align: 'start', sortable: false, value: 'price' },
        { text: '', align: 'start', sortable: false, value: 'cart' },
      ],
      requiredRules: [
        v => !!v || 'This field required',
      ],
    }
  },
  watch: {
    dialog() {
      this.$emit('toggleDialogStatus')
    }
  },
  computed: {
    ...mapGetters('cart', [
      'products',
      'cargoAvCbm'
    ]),
    image() {
      return this.product.images[0] ? this.product.images[0].thumb : ''
    },
    images() {
      var images = this.product.images.map( i => {
        return i.large
      })
      return images
    }
  },
  methods: {
    addOption(index) {
      if(this.$refs.opt[index].validate()) {

        var attrs = this.getSelectedAttributes(this.options[index])
        
        var cartProduct = this.buildCartProduct(this.product, this.options[index], attrs)

        this.addToCart(cartProduct)
      }
    },
    inCart(option) {
      var attrs = this.getSelectedAttributes(option)
      var idd =  `${option.id}-${attrs.join('-')}`
      return this.products.some( p => p.id == idd )
    },
    inCartQuantity(option) {
      var attrs = this.getSelectedAttributes(option)
      var idd =  `${option.id}-${attrs.join('-')}`
      var p = this.products.find( p => p.id == idd )
      return p.quantity
    },
    ...mapActions('cart', [
      'addToCart'
    ])
  }
}
</script>


