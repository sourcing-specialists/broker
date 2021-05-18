<template>
  <v-card>
    <v-card-title>
      <div>
        <h3>{{ item.name }} - <strong class="mColor-text">{{ item.option.key }}:</strong> {{ item.option.value }}</h3>
        <div
          class="text-caption"
          v-if="item.attributes.length > 0"
        >
          <span
            class="pr-3"
            v-for="attr in item.attributes"
            :key="attr.key"
          ><strong>{{ attr.key }}:</strong> {{ attr.value }}</span>
        </div>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-form ref="productEditForm">
      <v-card-text class="pa-6">
        <v-row>
          <v-col>
            <v-text-field
              v-model="quantity"
              :label="$t('quantity')"
              type="number"
            >
              <template v-slot:append>
                 <v-btn
                  color="indigo"
                  @click="save"
                  dark
                  icon
                  :disabled="quantityDisabled"
                ><v-icon>fa-save</v-icon></v-btn>
              </template>
            </v-text-field>
            <v-progress-linear
              v-if="filled"
              :value="filled"
              striped
              height="20"
              color="light-green lighten-1"
            >
              <template v-slot:default>
                {{ round(filled, 2) }}%
              </template>
            </v-progress-linear>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col>
            <order-product-designs
              :order="order"
              :product="product"
              :designs="product.designs"
            ></order-product-designs>
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </v-card>
</template>
<script>
import orderProductDesigns from './orderProductDesigns'

export default {
  name: 'orderProductEdit',
  props: ['product', 'order'],
  components: {
    orderProductDesigns
  },
  data() {
    return  {
      quantity: this.product.quantity
    }
  },
  computed: {
    item() {
      return this.product
    },
    cargo() {
      if(this.product.cargos.length === 0) {
        return null
      }
      if(this.product.cargos.length === 1) {
        return this.product.cargos[0].id
      }
      return false
    },
    quantityDisabled() {
      if(this.cargo === false) {
        return true
      }
      if(this.quantity == 0) {
        return true
      }
      if(this.quantity === '') {
        return true
      }
      return false
    },
    filled() {
      if(this.product.cargos.length === 0 || this.product.cargos.length > 1) {
        return false
      }
      var pCbm = this.product.cbm_per_carton*this.quantity
      return pCbm*100/this.product.cargos[0].cbm_limit
    }
  },
  methods: {
    save() {
      this.$http.post(this.endpoint(`orders/edit/${this.order.id}/product/${this.product.id}/update`), {
        order_product_id: this.product.id,
        quantity: this.quantity,
        cargo: this.cargo
      })
      .then( resp => {
        if(resp.data.result) {
          this.$emit('quantityUpdated')
        } else {
          this.$toasted.error(this.$t('orders.quantity_exceed'))
        }
      })
    }
  },
  mounted() {
    console.log(this.product.cargos[0])
  }
}
</script>