<template>
  <div>
    <v-container
      v-if="company.id"
      fluid
    >
      <h4 :style="`color: ${$store.getters.hexColor}`">{{ company.name }}</h4>
      <p><span class="font-weight-bold">BR:</span> {{ company.br_number }}
      <br><span class="font-weight-bold">Zone:</span> {{ company.zone ? company.zone.name : '' }}</p>
    </v-container>
    <v-divider></v-divider>
    <cargo-bar></cargo-bar>
    <v-divider></v-divider>
    <v-list
      v-if="products.length > 0"
    >
      <v-list-item
        v-for="p in products"
        :key="p.id"
      >
        <v-list-item-content
          class="product_content"
        >
          <v-list-item-title>
            <h4
              :style="`color: ${$store.getters.hexColor}`"
            >
              {{ p.product_name }}
            </h4>
          </v-list-item-title>
          <v-list-item-subtitle>
            <span class="font-weight-bold">{{ p.option_group_name }}: </span>{{ p.option_group_value }}
          </v-list-item-subtitle>
          <p><strong>Cbm per carton:</strong> {{ p.cbm_per_carton }}</p>
          <p><strong>MEAS:</strong> {{ p.meas }}</p>
          <ul
            class="product_details"
          >
            <li>
              <v-text-field
                class="text-center"
                v-model="p.quantity"
                @blur="updateQuantity({ id: p.id, quantity: p.quantity })"
              >
                <v-btn
                  :title="p.quantity === p.min_order ? '2 is the minimum order' : 'Reduce quantity'"
                  slot="prepend"
                  fab
                  small
                  :disabled="p.quantity === p.min_order"
                  color="red darken-4"
                  @click="p.quantity-- && updateQuantity({ id: p.id, quantity: p.quantity })"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-btn
                  :title="!cargoHasSpace(cargoAvCbm, { cbm_per_carton: p.cbm_per_carton, quantity: 1 }) ? 'Container is full' : 'Add quantity'"
                  slot="append-outer"
                  fab
                  small
                  color="red darken-4"
                  :disabled="!cargoHasSpace(cargoAvCbm, { cbm_per_carton: p.cbm_per_carton, quantity: 1 })"
                  @click="p.quantity++ && updateQuantity({ id: p.id, quantity: p.quantity })"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-text-field>
            </li>
            <li class="price"><span class="font-weight-bold">{{ numberToNiceString(p.formatted_subtotal, getCurrency) }}</span></li>
          </ul>
          <v-btn
            class="delete_product"
            x-small
            fab
            elevation="2"
            @click="$store.dispatch('removeFromCart', p.id)"
          >
            <span class="black--text"><v-icon>fa-times</v-icon></span>
          </v-btn>
          <v-divider></v-divider>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="!isCheckout">
        <v-list-item-content>
          <ul class="cart_total">
            <li></li>
            <li><span class="font-weight-bold">CBM: {{ round(cbm) }}</span></li>
            <li class="price"><span class="font-weight-bold">Subtotal: {{ numberToNiceString(subtotal, getCurrency) }}</span></li>
          </ul>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-container v-else>
      <div>The cart is empty</div>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import cargoBar from '../cargoBar'

export default {
  name: 'cartContent',
  props: ['checkout'],
  components: {
    cargoBar
  },
  computed: {
    isCheckout() {
      return this.checkout == '' ? true : false
    },
    ...mapGetters([
      'products',
      'company',
      'subtotal',
      'getCurrencyText',
      'getCurrency',
      'cbm',
      'distribution',
      'cargoAvCbm'
    ])
  },
  methods: {
    ...mapActions([
      'updateQuantity',
      'confirmOrder'
    ])
  }
}
</script>
<style lang="scss" scoped>
.product_content {
  position: relative;
  .delete_product {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
.product_details {
  display: inline-grid;
  grid-template-columns: 30% 70%;
  .price {
    display: flex;
    text-align: right;
    font-size: 14px;
    align-items: center;
    flex-direction: row-reverse;
  }
}
.cart_total {
  display: inline-grid;
  grid-template-columns: 30% 30% 40%;
  li {
    display: flex;
    text-align: right;
    font-size: 14px;
    align-items: center;
    flex-direction: row-reverse;
  }
}
</style>