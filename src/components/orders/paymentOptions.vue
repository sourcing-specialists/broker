<template>
  <v-card>
    <v-card-title>{{ $t('payment.payment_options') }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <v-btn
              color="info"
              dark
              elevation="1"
              large
              block
              @click="getPayment"
              :loading="cardPaymentLoading"
            >
              <v-icon class="mr-3">mdi-credit-card-check</v-icon>{{ $t('payment.pay_by_credit_card') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              color="dark"
              dark
              elevation="1"
              large
              block
              @click="transferInfo = !transferInfo"
            >
              <v-icon class="mr-3">mdi-bank-transfer</v-icon>{{ $t('payment.pay_by_transfer') }}
            </v-btn>
            <transition name="slide-fade">
              <div
                v-if="transferInfo"
                class="pa-3"
              >
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr v-for="a in bankSpain" :key="a.text">
                        <td>{{ a.text }}</td>
                        <td>{{ a.value }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-dialog
      persistent
      v-model="payByCardModal"
      max-width="480"
      :overlay-color="$store.getters.vColor"
      overlay-opacity="1"
      transition="dialog-bottom-transition"
      tile
      flat
    >
      <cc-form
        :isModal="true"
        :clientSecret="clientSecret"
        @modalClose="payByCardModal = false"
        @paymentDone="payByCardModal = false"
        v-on="$listeners"
      ></cc-form>
    </v-dialog>
  </v-card>
</template>
<script>
import ccForm from '../payments/ccForm'
import { bankSpain } from '../../constants/bankDetails'

export default {
  name: 'paymentOptions',
  props: ['payment'],
  components: {
    ccForm
  },
  data() {
    return {
      panel: [0],
      payByCardModal: false,
      clientSecret: '',
      cardPaymentLoading: false,
      transferInfo: false,
      bankSpain
    }
  },
  methods: {
    getPayment() {
      this.cardPaymentLoading = true
      this.$http.get(this.endpoint('payments/getPaymentToken'), {
        params: {
          payment_id: this.payment
        }
      })
      .then(resp => {
        console.log(resp)
        if(resp.data.result) {
          this.clientSecret = resp.data.data.client_secret
          this.payByCardModal = true
        } else {
          this.$toasted.error(resp.data.response_message)
        }
        this.cardPaymentLoading = false
      })
    },
  }
}
</script>