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
          lg="1"
        >
          <ProductImage :src="image" />
        </v-col>
        <v-col
          lg="11"
        >
          <h2 class="mColor-text">{{ product.name }}</h2>
          <p class="ps-2">{{ product.description }}</p>
        </v-col>
      </v-row>
      <div
        class="pa-3"
      >
        <h4>Options</h4>
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
                <v-col lg="3" md="3" class="d-flex align-center">
                  <div>
                    <ul>
                      <li><span class="font-weight-bold">Ref:</span> {{ option.ref }}</li>
                      <li><span class="font-weight-bold">Carton Size:</span> {{ mxMeas(option) }}</li>
                      <li><span class="font-weight-bold">MOQ:</span> {{ option.min_order }} Cartons</li>
                    </ul>
                    <ul v-html="mxPacking(option)"></ul>
                  </div>
                </v-col>
                <v-col lg="2" md="2" class="d-flex align-center">
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
                    ></v-select>
                    <div class="i-exist" v-if="inCart(option)">Product in cart: {{ inCartQuantity(option) }} Cartons</div>
                  </div>
                </v-col>
                <v-col lg="4" md="4" class="d-flex align-center">
                  <ul class="price-tiers" v-html="mxPriceTiers(option, true)"></ul>
                </v-col>
                <v-col lg="3" md="3" class="d-flex align-center">
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
import ProductImage from '../products/ProductImage'
import VueNumberInput from '@chenfengyuan/vue-number-input'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'productModal',
  props: ['product'],
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
  components: {
    ProductImage,
    VueNumberInput
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
  },
  computed: {
    ...mapGetters('cart', [
      'products',
      'cargoAvCbm'
    ]),
    image() {
      return this.product.images[0].thumb ? this.product.images[0].thumb : ''
    },
  }
}
</script>
