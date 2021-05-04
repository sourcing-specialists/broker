<template>
  <div>
    <loader v-model="loading"></loader>
    <div class="d-flex justify-end py-3">
      <v-btn
        v-if="!canPay"
        dark
        elevation="1"
        :color="$store.getters.vColor"
        @click="paymentEditDialog = true"
      >{{ $t('payment.create_payment') }}</v-btn>
    </div>
    <v-data-table
      v-if="payments.length > 0"
      :headers="tableHeaders"
      :items="payments"
      :hide-default-footer="true"
    >
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          class="ma-2"
          :color="item.status === 'Completed' ? 'green' : 'warning'"
          text-color="white"
        >
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          v-if="!canPay"
          fab
          dark
          elevation="1"
          :color="$store.getters.vColor"
          @click="loadPayment(item.protected_id, 'paymentEdit')"
          x-small
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="canPay && item.status !== 'Completed'"
          dark
          elevation="1"
          :color="$store.getters.vColor"
          @click="loadPayment(item.protected_id, 'paymentOptions')"
          small
        >
          {{ $t('payment.pay_now') }}
        </v-btn>
      </template>
      <template v-slot:[`body.append`]>
        <tr>
          <td colspan="6"></td>
          <td>
            <h4 class="text-right"><strong>{{ $t('total') }}:</strong> {{ paymentsTotal }}</h4>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-container v-else>{{ $t('orders.no_payments') }}</v-container>
    <v-dialog
      max-width="720"
      v-model="paymentEditDialog"
    >
      <payment-edit
        v-if="paymentEditDialog"
        :order="order"
        :id="paymentId"
        @onClose="paymentEditDialog = false"
        @save="loadAllPayments"
      ></payment-edit>
    </v-dialog>
    <v-dialog
      max-width="720"
      v-model="paymentOptionsDialog"
    >
      <payment-options
        v-if="paymentOptionsDialog"
        :payment="paymentId"
        @paymentDone="paymentDone"
      ></payment-options>
    </v-dialog>
  </div>
</template>
<script>
import paymentEdit from './paymentEdit'
import paymentOptions from './paymentOptions'
import loader from '../loadingBox'

export default {
  name: 'OrderPayments',
  props: {
    'order': {
      default: null
    },
    canPay: {
      default: false
    }
  },
  components: {
    paymentEdit, paymentOptions, loader
  },
  data() {
    return {
      tableHeaders: [
        { text: this.$t('created'), align: 'start', sortable: true, value: 'created_at' },
        { text: this.$t('reason'), align: 'start', sortable: true, value: 'reason' },
        { text: this.$t('due_date'), align: 'start', sortable: true, value: 'expired_at' },
        { text: this.$t('status'), align: 'start', sortable: true, value: 'status' },
        { text: this.$t('paid_at'), align: 'start', sortable: true, value: 'paid_at' },
        { text: this.$t('amount'), align: 'end', sortable: true, value: 'amount_string' },
        { text: '', align: 'end', sortable: false, value: 'actions' },
      ],
      payments: [],
      paymentId: '',
      paymentEditDialog: false,
      paymentOptionsDialog: false,
      loading: true
    }
  },
  watch: {
    paymentEditDialog(v) {
      if(!v) this.paymentId = ''
    }
  },
  computed: {
    paymentsTotal() {
      let total = 0;
      var currency = 'USD'
      this.payments.map(p => {
        total+= Number(p.amount)
        currency = p.currency
      })
      return this.numberToNiceString(total, currency)
    }
  },
  methods: {
    loadPayment(protected_id, modal) {
      this.paymentId = protected_id
      if(modal === 'paymentOptions') {
        this.paymentOptionsDialog = true
      }
      if(modal === 'paymentEdit') {
        this.paymentEditDialog = true
      }
    },
    loadAllPayments() {
      this.paymentEditDialog = false
      this.loading = true
      var endpoint = this.canPay ? this.endpoint(`order/get_protected/${this.order.id}/payments/list`) : this.endpoint(`order/${this.order.id}/payments/list`)
      this.$http.get(endpoint)
        .then(resp => {
          if(resp.data.result === true) {
            this.payments = resp.data.data
          }
          this.loading = false
        })
    },
    paymentDone() {
      this.paymentOptionsDialog = false
      var vue = this
      setTimeout(function() {
        vue.loadAllPayments()
      }, 3000)
      this.loadAllPayments()
    }
  },
  mounted() {
    this.loadAllPayments()
  }
}
</script>