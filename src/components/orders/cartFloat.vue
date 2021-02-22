<template>
  <div
    :class="['cart-floating', { hidden: !value }]"
  >
    <v-card
      v-touch="{
        left: () => swipe('left'),
        right: () => swipe('right'),
      }"
      elevation="4"
    >
      <v-card-title>Cart</v-card-title>
      <v-btn v-if="count > 0" @click="$emit('clearCart')">Clear</v-btn>
      <v-divider></v-divider>
      <v-btn
        class="close_cart"
        color="secondary"
        x-small
        @click="hide()"
      >
        <v-icon>fa-long-arrow-alt-right</v-icon>
      </v-btn>
      <cart-content></cart-content>
      <v-divider></v-divider>
      <v-card-actions class="checkout-button">
        <v-btn
          :color="$store.getters.vColor"
          elevation="2"
          :disabled="count == 0"
          @click="toCheckout()"
        >
          <span class="white--text">{{ count == 0 ? 'Please add items' : 'Checkout' }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import cartContent from './cartContent'
import { mapGetters } from 'vuex'

export default {
  name: 'cartFloat',
  props: ['value'],
  components: {
    cartContent
  },
  computed: {
    ...mapGetters([
      'count'
    ])
  },
  methods: {
    hide() {
      this.$emit('input', false)
    },
    swipe(direction) {
      if(direction == 'right') {
        this.showCart = true
      }
    },
    toCheckout() {
      console.log(1)
      this.hide()
      this.$emit('checkout')
    }
  }
}
</script>

<style lang="scss" scoped>
  .cart-floating {
    position: absolute;
    right: 12px;
    top: 25px;
    z-index: 1;
    width: 480px;
    transition: 0.5s ease-in-out;
    transform: translateX(0px);
    &.hidden {
      transform: translateX(500px);
    }
    .close_cart {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .checkout-button {
      display: flex;
      justify-content: flex-end;
      padding: 15px;
    }
  }
</style>