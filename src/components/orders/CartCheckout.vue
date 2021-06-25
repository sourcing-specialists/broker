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
    <v-container class="mt-8" fluid>
      <v-row>
        <v-btn
          color="blue-grey"
          elevation="2"
          type="submit"
          :loading="loading"
          :disabled="count == 0"
          @click.prevent="submitOrder(false, 'quotation')"
        >
          <span class="white--text">{{ count == 0 ? $t('no_items') : $t('orders.save_as_quotation') }}</span>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="green"
          elevation="2"
          x-large
          type="submit"
          :loading="loading"
          :disabled="count == 0"
          @click.prevent="submitOrder(false, 'order')"
        >
          <span class="white--text">{{ count == 0 ? $t('no_items') : $t('views.orders.confirm_order') }}</span>
        </v-btn>
        <v-btn
          class="ml-3"
          :color="vColor"
          elevation="2"
          x-large
          type="submit"
          :loading="loading"
          :disabled="count == 0"
          @click.prevent="submitOrder(true, 'order')"
        >
          <span class="white--text">{{ count == 0 ? $t('no_items') : $t('views.orders.confirm_order_pay') }}</span>
        </v-btn>
        <v-btn
          v-if="false"
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
    <v-dialog 
      v-model="paymentModal"
      max-width="720"
      persistent
    >
      <payment-edit
        v-if="paymentModal"
        :order="order"
        :id="payment_id"
        @onClose="backToOrders"
        @save="backToOrders"
        :disabled="false"
      ></payment-edit>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import cartContent from './cartContent.vue'
import paymentEdit from './paymentEdit'

export default {
  name: 'OrderCheckout',
  components: { cartContent, paymentEdit },
  data() {
    return {
      loading: false,
      pay: null,
      paymentModal: false,
      order: {},
      payment_id: ''
    }
  },
  computed: {
    totals: function() {
      const subtotal = {
        name: `${this.$t('orders.subtotal')}:`,
        value: this.getCurrencyText + this.formattedNumber(this.subtotal),
      }
      const distribution = {
        name: `${this.$t('orders.distribution_cost')}:`,
        value: this.getCurrencyText + this.formattedNumber(this.distribution.cost_total)
      }
      const total = {
        name: `${this.$t('total')}:`,
        value: this.getCurrencyText + this.formattedNumber(this.total)
      }
      return this.incoterm === 'REVOOLOOP' ? [subtotal, distribution, total] : [subtotal, total]
    },
    ...mapGetters('cart', [
      'count',
      'subtotal',
      'distribution',
      'total',
      'incoterm'
    ]),
    ...mapGetters([
      'getCurrencyText',
      'vColor'
    ])
  },
  methods: {
    ...mapActions('cart', [
      'getDistribution',
      'confirmOrder',
      'clearCart'
    ]),
    submitOrder(updatePayment = false, type) {
      this.loading = true
      this.confirmOrder(type)
      .then( resp => {
        //console.log(resp.data)
        if(updatePayment) {
          this.paymentModal = true
          this.order = resp.data.data.order
          this.payment_id = resp.data.data.payment.protected_id
          return
        }
        if(type === 'quotation') {
          this.clearCart()
          this.$router.push({ name: 'Quotations'})
          return
        }
        this.backToOrders()
      }).catch(() => {
        this.$toasted.error(this.$t('something_wrong'))
        this.loading = false
      })
    },
    backToOrders() {
      this.clearCart()
      this.$router.push({ name: 'Orders'})
    }
  },
  mounted() {
    if(this.incoterm === 'REVOOLOOP') {
      this.getDistribution()
    }
  }
}
</script>

<style lang="scss" scoped>
.totals {
  width: 100%;
}
</style>