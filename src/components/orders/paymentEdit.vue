<template>
  <v-card
    :loading="loading"
  >
    <v-toolbar
      flat
      dark
    >
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        dark
        @click="$emit('onClose')"
      ><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-card-text class="pt-5">
      <v-form
        ref="paymentForm"
      >
        <v-select
          :items="paymentReasons"
          :label="$t('reason')"
          :disabled="isEdit"
          :rules="requiredRule"
          v-model="payment.reason"
          @change="calculateAmount"
        ></v-select>
        <v-text-field
          :label="$t('amount')"
          :disabled="isEdit"
          :rules="requiredRule"
          v-model="payment.amount_string"
        ></v-text-field>
        <v-select
          v-if="isEdit"
          :items="paymentStatus"
          :label="$t('status')"
          :rules="requiredRule"
          :disabled="statusLocked"
          v-model="payment.status"
        ></v-select>
        <text-field-datepicker
          v-if="isEdit"
          v-model="payment.paid_at_helper"
          :label="$t('paid_at')"
          icon
          required
          :disabled="statusLocked"
        ></text-field-datepicker>
        <v-select
          v-if="isEdit"
          :items="[{ text: 'Postnet', value: 'postnet' }, { text: 'Transfer', value: 'tt' }]"
          :label="$t('payment.payment_type')"
          :rules="requiredRule"
          :disabled="statusLocked"
          v-model="payment.mode"
        ></v-select>
        <v-text-field
          v-if="isEdit"
          :label="$t('ref')"
          v-model="payment.reference"
        ></v-text-field>
        <v-textarea
          v-if="isEdit"
          v-model="payment.remarks"
          name="remarks"
          :label="$t('remarks')"
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-switch
        v-model="notify"
        inset
        :label=" isEdit ? $t('payment.notify_client_payment_done') : $t('payment.notify_client_payment_request')"
      ></v-switch>
      <v-spacer></v-spacer>
      <v-btn
        :color="$store.getters.vColor"
        dark
        x-large
        elevation="1"
        @click="savePayment"
        :loading="loading"
      >{{ isEdit ? $t('save_changes') : $t('payment.create_payment') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import paymentStatus from '../../constants/paymentStatus'
import textFieldDatepicker from '../textFieldDatepicker'
import { requiredRule } from '../../constants/formRules'

export default {
  name: 'paymentEdit',
  props: ['order', 'id'],
  components: {
    textFieldDatepicker
  },
  data() {
    return {
      paymentStatus: paymentStatus,
      statusLocked: false,
      payment: {},
      loading: true,
      requiredRule: requiredRule,
      notify: false
    }
  },
  computed: {
    isEdit() {
      return this.id ? true : false
    },
    title() {
      return this.isEdit ? `${this.$t('edit_payment')} - ${this.payment.reason}` : this.$t('payment.create_payment')
    },
    paymentReasons() {
      var deposit = { text: this.$t('payment.deposit'), value: 'deposit' }
      var balance = { text: this.$t('payment.balance'), value: 'balance' }
      return [deposit, balance]
    }
  },
  methods: {
    calculateAmount() {
      if(this.payment.reason === 'deposit') {
        this.payment.amount_string = this.order.deposit_as_number
      }
      if(this.payment.reason === 'balance') {
        this.payment.amount_string = this.order.balance_as_number
      }
    },
    loadPayment() {
      this.$http(this.endpoint(`order/${this.order.id}/payments/${this.id}`), {
        params: {
          protected_id: this.id
        }
      })
      .then(resp => {
        if(resp.data.result) {
          this.payment = resp.data.data
          console.log(this.payment)
          this.statusLocked = resp.data.data.status === 'Completed' ? true : false
        }
        this.loading = false
      })
    },
    savePayment() {
      var endpoint = this.isEdit ? this.endpoint(`order/${this.order.id}/payments/${this.id}/update`) : this.endpoint(`order/${this.order.id}/payments/create`)
      if(this.$refs.paymentForm.validate()) {
        this.loading = true
        this.$http.post(endpoint, {
          protected_id: this.id,
          reason: this.payment.reason,
          amount: !this.isEdit ? this.payment.amount_string : null,
          status: this.payment.status === 'Completed' ? 2 : 1,
          reference: this.payment.reference,
          remarks: this.payment.remarks,
          mode: this.payment.mode,
          paid_at: this.payment.paid_at_helper,
          notify: this.notify
        }).then( () => {
          if(this.isEdit) {
            this.$toasted.success(this.$t('payment.payment_updated_successfully'))
          } else {
            this.$toasted.success(this.$t('payment.payment_created_successfully'))
          }
          this.loading = false
          this.$emit('save')
        })
      }
    }
  },
  mounted() {
    if(this.id) {
      this.loadPayment()
      return
    }
    this.loading = false
  }
}
</script>