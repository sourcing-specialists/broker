<template>
  <v-dialog
    v-model="dialog"
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
          <h3>
            <span :style="`color: ${$store.getters.hexColor}`">{{ product.name }}</span> 
          </h3>
          <v-divider></v-divider>
          <p>{{ product.description }}</p>
        </v-col>
      </v-row>
      <h4>Options</h4>
      <v-form
        v-for="(option, option_index) in options"
        :key="option.id"
        class="option-in-modal"
        ref="opt"
      >
        <v-row>
          <v-col lg="1" md="1" class="d-flex align-center">
            {{ option.ref }}
          </v-col>
          <v-col lg="3" md="3" class="d-flex align-center">
            <div>
              <h5><span :style="`color: ${$store.getters.hexColor}`">{{ option.group_name }}:</span> {{ option.group_value }}</h5>
              <ul>
                <li><span class="font-weight-bold">Carton Size:</span> {{ mxMeas(option) }}</li>
                <li><span class="font-weight-bold">MOQ:</span> {{ option.min_order }} Cartons</li>
              </ul>
              <ul v-html="mxPacking(option)"></ul>
            </div>
          </v-col>
          <v-col lg="2" md="2" class="d-flex align-center">
            <ul>
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
            </ul>
          </v-col>
          <v-col lg="4" md="4" class="d-flex align-center">
            <ul class="price-tiers" v-html="mxPriceTiers(option)"></ul>
          </v-col>
          <v-col lg="2" md="2" class="d-flex align-center">
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
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import ProductImage from '../products/ProductImage'
import VueNumberInput from '@chenfengyuan/vue-number-input'
import { mapActions } from 'vuex'

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

        var attrs = this.options[index].attributes_grouped.map(function(a) {
          return a['selected']
        })
        
        var cartProduct = this.buildCartProduct(this.product, this.options[index], attrs)

        this.addToCart(cartProduct)
        this.$toasted.success('Product Added')
      }
    },
    ...mapActions([
      'addToCart'
    ])
  },
  computed: {
    image() {
      return this.product.images[0].thumb ? this.product.images[0].thumb : ''
    },
  }
}
</script>

<style scoped>
  .option-in-modal {
    border-bottom: 1px solid #CCC;
  }
</style>