<template>
  <v-dialog
    v-model="show"
    :persistent="true"
    max-width="720"
  >
    <v-card
      light
      class="pa-8"
      :loading="loading"
    >
      <v-card-title>{{ $t('payments') }}</v-card-title>
      <v-form
        ref="paymentForm"
        @submit.prevent="validate()"
      >
        <v-card-text>
          <v-expansion-panels
            v-model="panels"
            multiple
          >
            <v-expansion-panel
              v-for="payment in payments"
              :key="payment.id"
            >
              <v-expansion-panel-header>
                <h3>{{ payment.reason }}</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col>
                    <v-text-field
                      :label="$t('ref')"
                      :value="payment.reference"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      :label="$t('amount')"
                      :value="payment.amount"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions
          class="d-flex justify-space-between"
        >
          <v-btn
            @click="cancelPayment()"
            x-large
          ><v-icon>mdi-close-thick</v-icon> {{ $t('cancel') }}</v-btn>
          <v-btn
            :color="$store.getters.vColor"
            elevation="2"
            x-large
            @click="loadPayments()"
            dark
          >{{ $t('payment.confirm_payment') }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  props: ['order'],
  data() {
    return {
      loading: true,
      panels: [0],
      payments: []
    }
  },
  watch: {
    order(val) {
      if(val !== null) {
        this.loadPayments()
      }
    }
  },
  computed: {
    show: {
      get: function() {
        return this.order !== null ? true : false
      },
      set: function() {
        this.order = null
      }
    }
  },
  methods: {
    ...mapActions('cart', [
      'clearCart'
    ]),
    loadPayments() {
      this.$http.get(this.endpoint(`order/${this.order}/payments/list`))
      .then( resp => {
        console.log(resp.data.data)
        this.loading = false
        this.payments = resp.data.data
      }).catch( error => {
        this.$toasted.error(error.errors)
      })
    },
    cancelPayment() {
      this.clearCart()
      this.$router.push({ name: 'Orders' })
    }
  },
  mounted() {
    if(this.order !== null) {
      this.loadPayments()
    }
  }
}
</script>