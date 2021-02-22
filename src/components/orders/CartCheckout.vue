<template>
  <div>
    <cart-content checkout></cart-content>
    <div class="totals d-flex justify-end">
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr
              v-for="total in totals"
              :key="total.name"
            >
              <td><span class="font-weight-bold">{{ total.name }}</span></td>
              <td>{{ total.value }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <v-container fluid>
      <v-row class="justify-end">
        <v-select
          :items="[{ text: 'Confirm', value: 'confirm' }, { text: 'Confirm and pay', value: 'confirm_pay' }]"
          filled
          label="Submit type"
          v-model="submit_type"
          dense
        ></v-select>
        <v-btn
          :color="vColor"
          elevation="2"
          x-large
          type="submit"
          :loading="loading"
          :disabled="count == 0"
          @click.prevent="submitOrder()"
        >
          <span class="white--text">{{ count == 0 ? 'No items' : 'Confirm Order' }}</span>
        </v-btn>
        <v-btn
          v-if="true"
          color="red darken-1"
          elevation="2"
          x-large
          type="submit"
          @click.prevent="debug()"
        >
          <span class="white--text">Debug</span>
        </v-btn>
      </v-row>
    </v-container>
    <order-pay :order="pay"></order-pay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import cartContent from './cartContent.vue'
import OrderPay from './orderPay'

export default {
  components: { cartContent, OrderPay },
  data() {
    return {
      loading: false,
      submit_type: 'confirm_pay',
      pay: null,
    }
  },
  computed: {
    totals() {
      var totals = [
        {
          name: 'Order Subtotal:',
          value: this.getCurrencyText + this.formattedNumber(this.subtotal),
        },
        {
          name: 'Distribution:',
          value: this.getCurrencyText + this.formattedNumber(this.distribution.cost_total)
        },
        {
          name: 'Total:',
          value: this.getCurrencyText + this.formattedNumber(this.total)
        }
      ]
      return totals
    },
    ...mapGetters([
      'count',
      'subtotal',
      'getCurrencyText',
      'distribution',
      'total',
      'vColor'
    ])
  },
  methods: {
    ...mapActions([
      'getDistribution',
      'confirmOrder',
      'clearCart'
    ]),
    submitOrder() {
      this.loading = true
      this.confirmOrder()
      .then( resp => {
        if(this.submit_type == 'confirm_pay') {
          this.pay = resp.data.data
          return
        }
        this.clearCart()
        this.$router.push({ name: 'Orders'})
      }).catch((result) => {
        console.log(result)
      })
    },
    debug() {
      console.log(this.$store.state.cart)
    }
  },
  mounted() {
    this.getDistribution()
  }
}
</script>

<style lang="scss" scoped>
.totals {
  width: 100%;
}
</style>