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
      <v-card-text>
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
                ><v-icon>fa-save</v-icon></v-btn>
              </template>
            </v-text-field>
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
    }
  },
  methods: {
    save() {
      this.$http.post(this.endpoint(`orders/edit/${this.order.id}/product/${this.product.id}/update`), {
        order_product_id: this.product.id,
        quantity: this.quantity
      })
      .then( resp => {
        if(resp.data.result) {
          this.$emit('quantityUpdated')
        }
      })
    }
  }
}
</script>