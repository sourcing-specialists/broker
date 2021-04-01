<template>
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
    <template v-slot:[`body.append`]>
      <tr>
        <td colspan="5"></td>
        <td>
          <h4 class="text-right"><strong>{{ $t('total') }}:</strong> {{ paymentsTotal }}</h4>
        </td>
      </tr>
    </template>
  </v-data-table>
  <div v-else>{{ $t('orders.no_payments') }}</div>
</template>
<script>
export default {
  name: 'OrderPayments',
  props: ['order-id'],
  data() {
    return {
      tableHeaders: [
        { text: this.$t('created'), align: 'start', sortable: true, value: 'created_at' },
        { text: this.$t('reason'), align: 'start', sortable: true, value: 'reason' },
        { text: this.$t('due_date'), align: 'start', sortable: true, value: 'expired_at' },
        { text: this.$t('status'), align: 'start', sortable: true, value: 'status' },
        { text: this.$t('paid_at'), align: 'start', sortable: true, value: 'paid_at' },
        { text: this.$t('amount'), align: 'end', sortable: true, value: 'amount_string' }
      ],
      payments: []
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
  mounted() {
    this.$http.get(this.endpoint(`order/${this.orderId}/payments/list`))
    .then(resp => {
      //console.log(resp.data.data)
      if(resp.data.result === true) {
        this.payments = resp.data.data
      }
    })
  }
}
</script>