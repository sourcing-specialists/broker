<template>
  <div>
    <v-container
      v-if="company.id"
      fluid
    >
      <h1 class="mColor-text mb-3">{{ company.name }}</h1>
      <p class="ps-3">
        <span class="font-weight-bold">{{ $t('orders.order_incoterm') }}:</span> {{ incoterm }}
        <br>
        <span class="font-weight-bold">{{ $t('orders.transport') }}:</span> {{ $store.getters['cart/transport'] }}
        <br>
        <span class="font-weight-bold">{{ $t('currency') }}:</span> {{ getCurrency }}
      </p>
    </v-container>
    <v-divider></v-divider>
    <v-list
      v-if="products.length > 0"
    >
      <v-list-item
        v-for="p in products"
        :key="p.id"
      >
        <v-list-item-avatar
          width="120"
          height="120"
        >
          <v-img :src="p.image"></v-img>
        </v-list-item-avatar>
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
            <span><strong>{{ p.option_group_name }}:</strong> {{ p.option_group_value }}</span>
            <span v-for="attr in p.attributes_data" :key="attr.id"> - <strong>{{ attr.group_name }}:</strong> {{ attr.value }}</span>
          </v-list-item-subtitle>
          <p><strong>{{ $t('orders.cbm_per_carton') }}:</strong> {{ p.cbm_per_carton }}</p>
          <p><strong>{{ $t('orders.box_size') }}:</strong> {{ p.meas }}</p>
          <ul
            class="product_details"
          >
            <li>
              <v-text-field
                class="text-center"
                :value="p.quantity"
                @keyup.enter="updQty(p.id, $event)"
                @blur="updQty(p.id, $event)"
              >
                <v-btn
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
                  slot="append-outer"
                  fab
                  small
                  color="red darken-4"
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
            @click="$store.dispatch('cart/removeFromCart', p.id)"
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

export default {
  name: 'cartContent',
  props: ['checkout'],
  data() {
    return {
      qty: 0
    }
  },
  computed: {
    isCheckout() {
      return this.checkout == '' ? true : false
    },
    ...mapGetters('cart', [
      'products',
      'company',
      'subtotal',
      'cbm',
      'distribution',
      'incoterm'
    ]),
    ...mapGetters([
      'getCurrencyText',
      'getCurrency',
    ])
  },
  methods: {
    ...mapActions('cart', [
      'updateQuantity',
      'confirmOrder'
    ]),
    updQty(id, event) {
      this.updateQuantity({ 
        id: id, 
        quantity: event.target.value,
        valueChanged: true 
      }).then(qty => {
        event.target.value = qty
        event.target.dispatchEvent(new Event('input'))
      })
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