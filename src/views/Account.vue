<template>
  <div class="home">
    <h1>I am an interface to update your profile</h1>
    
    <v-btn
      @click="getPayment"
      elevation="1"
      color="dark"
    >Get Payment</v-btn>
    <v-btn
      @click="payByCardModal = true"
      elevation="1"
      color="dark"
    >Load Modal</v-btn>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';


export default {
  name: 'Account',
  components: {
  },
  data() {
    return {
      payByCardModal: false,
      clientSecret: ''
    }
  },
  methods: {
    getPayment() {
      this.$http.get(this.endpoint('payments/183/getPaymentToken'), {
        params: {
          payment_id: '1dc75dfa0708f8259924901bdc271479c8772504'
        }
      })
      .then(resp => {
        if(resp.data.result) {
          this.clientSecret = resp.data.data.client_secret
          this.payByCardModal = true
        }
      })
    },
    close() {
      console.log(123)
    },
    async debug() {
      const stripe = await loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

      console.log(stripe)
    }
  }
}
</script>