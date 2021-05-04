<template>
  <v-container
    class="public_order"
  >
    <loader v-model="loading"></loader>
    <div 
      v-if="!loading"
      class="public_order_wrapper"
    >
      <order-header :order="order"></order-header>
      <v-card
        class="mt-5"
      >
        <v-card-title>
          <h4 class="mColor-text">{{ $t('products') }}</h4>
        </v-card-title>
        <v-divider></v-divider>
        <order-products-list :order="order" :products="products"></order-products-list>
      </v-card>
      <v-card
        class="mt-5"
      >
        <v-card-title class="justify-space-between">
          <h4 class="mColor-text">{{ $t('payments') }}</h4>
          <v-btn
            @click="reloadPayments"
          >
            {{ $t('refresh') }}<v-icon class="pl-3">mdi-refresh</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <order-payments
          ref="paymentsComponent"
          :canPay="true"
          :order="order"
        ></order-payments>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import loader from '../../components/loadingBox'
import orderHeader from '../../components/orders/orderHeader'
import orderProductsList from '../../components/orders/orderProductsList'
import orderPayments from '../../components/orders/payments'

export default {
  name: 'PublicOrder',
  props: ['id'],
  components: {
    loader, orderHeader, orderProductsList, orderPayments
  },
  data() {
    return {
      loading: true,
      order: {},
      products: []
    }
  },
  methods: {
    getOrder() {
      this.$http.get(this.endpoint(`order/get_protected/${this.id}`), {
        params: {
          protected_id: true
        }
      }).then((resp) => {
        console.log(resp.data.data)
        if(resp.data.result) {
          this.loading = false
          this.order = resp.data.data.order
          this.products = resp.data.data.order_items
        }
      })
    },
    reloadPayments() {
      this.$refs.paymentsComponent.loadAllPayments()
    }
  },
  mounted() {
    this.getOrder()
  }
}
</script>
<style scoped lang="scss">
.public_order {
  min-height: 100vh;
  .public_order_wrapper {
    max-width: 1080px;
    margin: auto;
  }
}
</style>