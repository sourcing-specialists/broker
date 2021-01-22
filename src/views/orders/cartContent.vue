<template>
  <div>
    <v-container>
      <h4 :style="`color: ${$store.getters.hexColor}`">{{ company.name }}</h4>
      <p><span class="font-weight-bold">BR:</span> {{ company.br_number }}
      <br><span class="font-weight-bold">Zone:</span> {{ company.zone.name }}</p>
    </v-container>
    <v-list
      v-if="cartProducts.length > 0"
    >
      <v-list-item
        v-for="p in cartProducts"
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
          <ul
            class="product_details"
          >
            <li>
              <v-text-field
                v-model="p.quantity"
                @blur="$store.dispatch('updateQuantity', { id: p.id, quantity: p.quantity })"
              >
                <v-icon
                  slot="append"
                  color="red"
                  @click="updateQuantity(p.id, p.quantity)"
                >
                  mdi-plus
                </v-icon>
              </v-text-field>
            </li>
            <li class="price"><span class="font-weight-bold">{{ $store.getters.getCurrencyText }}{{ p.formatted_subtotal }}</span></li>
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
      <v-list-item>
        <v-list-item-content>
          <ul class="cart_total">
            <li></li>
            <li class="price"><span class="font-weight-bold">CBM: {{ cbm }}</span></li>
            <li class="price"><span class="font-weight-bold">Subtotal: {{ getCurrencyText }}{{ subtotal }}</span></li>
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
import { mapGetters } from 'vuex'
export default {
  name: 'cartContent',
  computed: {
    cartProducts() {
      return this.$store.getters.products
    },
    ...mapGetters([
      'company',
      'subtotal',
      'getCurrencyText',
      'cbm',
      'origin_zone',
      'destination_zone'
    ])
  },
  methods: {
    updateQuantity(id, qty) {
      qty++
      this.$store.dispatch('updateQuantity', { id: id, quantity: qty })
    }
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