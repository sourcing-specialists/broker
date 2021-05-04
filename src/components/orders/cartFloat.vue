<template>
    <div
      :class="['cart-floating', { hidden: !value }]"
    >
      <v-card
        tile
        v-touch="{
          left: () => swipe('left'),
          right: () => swipe('right'),
        }"
        elevation="4"
      >
        <v-toolbar
          flat
          dark
        >
          <v-btn
            icon
            dark
            @click="hide()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t('orders.cart') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="clearCart"
          >{{ $t('orders.clear_cart') }}</v-btn>
        </v-toolbar>
        <v-card-text>
          <vuescroll :ops="ops">
            <cart-content></cart-content>
          </vuescroll>
        </v-card-text>
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
import vuescroll from 'vuescroll';
import cartContent from './cartContent'
import { mapGetters } from 'vuex'

export default {
  name: 'cartFloat',
  props: ['value'],
  components: {
    cartContent,
    vuescroll
  },
  data() {
    return {
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {
          background: this.$store.getters.hexColor
        }
      }
    }
  },
  computed: {
    ...mapGetters('cart', [
      'count'
    ])
  },
  watch: {
    value(val) {
      if(val) {
        document.body.classList.add('stop-scroll')
      } else {
        document.body.classList.remove('stop-scroll')
      }
    }
  },
  methods: {
    clearCart() {
      this.$emit('clearCart')
      this.hide()
    },
    hide() {
      this.$emit('input', false)
    },
    swipe(direction) {
      if(direction == 'right') {
        this.showCart = true
      }
    },
    toCheckout() {
      //console.log(1)
      this.hide()
      this.$emit('checkout')
    }
  }
}
</script>

<style lang="scss" scoped>
  .cart-floating {
    position: absolute;
    padding-top: 0px;
    right: 0;
    top: 0px;
    z-index: 1;
    width: 100%;
    transition: 0.5s ease-in-out;
    transform: translateX(0px);
    &.hidden {
      transform: translateX(100%);
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
    .v-card {
      height: calc(100vh - 76px);
      display: flex;
      flex-direction: column;
    }
    .v-card__text {
      overflow: hidden;
      flex: 1;
    }
    .v-toolbar {
      flex: 0;
    }
  }
</style>