<template>
  <v-card
    tile
    flat
    class="pt-15 pa-10"
  >
    <v-btn
      v-if="isModal"
      icon
      dark
      :color="$store.getters.vColor"
      @click="$emit('modalClose')"
      :style="{
        position: 'absolute',
        top: '15px',
        right: '15px'
      }"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-form ref="paymentForm">
      <v-card-text
        class="elements-wrapper"
      >
        <v-row>
          <v-col>
            <v-text-field
              v-model="fullName"
              :label="$t('payment.full_name')"
              :rules="requiredRule"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <label for="card-element">Card</label>
            <div id="card-element"></div>
            <span id="card-errors"></span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <label for="expiry-element">Expiry</label>
            <div id="expiry-element"></div>
            <span id="expiry-errors"></span>
          </v-col>
          <v-col>
            <label for="cvc-element">CVC</label>
            <div id="cvc-element"></div>
            <span id="cvc-errors"></span>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="py-5 justify-end">
        <v-btn
          @click="pay"
          :color="$store.getters.vColor"
          elevation="1"
          dark
          block
          :loading="paying"
        >{{ $t('payment.pay_now') }}</v-btn>
      </v-card-actions>
    </v-form>
    <v-card-text>
      <v-divider></v-divider>
      <div class="pt-5 text-center">
        <v-icon>mdi-lock</v-icon> {{ $t('payment.secure_payments') }} <strong>Stripe</strong>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { loadStripe } from '@stripe/stripe-js'
import { requiredRule } from '../../constants/formRules'

export default {
  name: 'ccForm',
  props: {
    isModal: {
      default: false,
      type: Boolean
    },
    clientSecret: {
      default: ''
    }
  },
  data() {
    return {
      stripe: null,
      fullName: '',
      stripeElements: null,
      requiredRule,
      paying: false
    }
  },
  methods: {
    async pay() {
      var vue = this
      if(this.$refs.paymentForm.validate()) {
        vue.paying = true
        this.stripe.confirmCardPayment(this.clientSecret, {
          payment_method: {
            card: this.stripeElements.getElement('cardNumber'),
            billing_details: {
              name: this.fullName,
            },
          },
        })
        .then(function(resp) {
          vue.paying = false
          //console.log(resp.paymentIntent)
          console.log(resp)
          if(!resp.error) {
            vue.$toasted.success(vue.$t('payment.payment_successful'))
            vue.$emit('paymentDone')
          } else {
            vue.$toasted.error(resp.error.message)
          }
        }).catch(resp => {
          console.log(resp.message)
        })
      }
    },
    async loadElements() {
      this.stripe = await loadStripe(process.env.VUE_APP_STRIPE_PK)

      const style = {
        base: {
          fontFamily: '"Roboto", sans-serif',
          color: '#000',
          fontWeight: 400,
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            color: 'rgba(0,0,0,0.6)',
          },
          '::placeholder': {
            color: 'rgba(0,0,0,0.6)',
          },
        },
        invalid: {
          iconColor: '#E53935',
          color: '#E53935',
        }
      }

      this.stripeElements = this.stripe.elements()

      var card = this.stripeElements.create('cardNumber', {
        style: style,
        showIcon: true
      })
      var expiry = this.stripeElements.create('cardExpiry', {
        style: style
      })
      var cvc = this.stripeElements.create('cardCvc', {
        style: style
      })

      card.mount('#card-element')
      expiry.mount('#expiry-element')
      cvc.mount('#cvc-element')

      card.on('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      })

      expiry.on('change', function(event) {
        var displayError = document.getElementById('expiry-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      })

      cvc.on('change', function(event) {
        var displayError = document.getElementById('cvc-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      })

    }
  },
  mounted() {
    this.loadElements()
  }
}
</script>

<style scoped>
#card-element, #expiry-element, #cvc-element {
  border-bottom: 1px solid rgba(0,0,0,0.5);
  padding: 5px;
}
#card-errors, #expiry-errors, #cvc-errors {
  padding-top: 5px;
  height: 15px;
  display: block;
  color: #E53935;
  font-size: 10px;
  line-height: 1.2;
}
</style>