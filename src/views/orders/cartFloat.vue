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
      <v-btn @click="$emit('clearCart')">Clear</v-btn>
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
    </v-card>
  </div>
</template>

<script>
import cartContent from './cartContent'
export default {
  name: 'cartFloat',
  props: ['value'],
  components: {
    cartContent
  },
  methods: {
    hide() {
      this.$emit('input', false)
    },
    swipe(direction) {
      if(direction == 'right') {
        this.showCart = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .cart-floating {
    position: absolute;
    right: 12px;
    top: 0px;
    z-index: 99;
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
  }
</style>