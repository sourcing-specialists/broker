<template>
  <v-card min-height="100">
    <loader v-model="loading"></loader>
    <div v-if="!loading">
      <v-card-title class="justify-space-between">
        <h2><span class="mColor-text pr-2">{{ `${ $tc('order', 1) } #${ order.orderNumber }` }}</span> - {{ order.company.name }}</h2>
        <div>
          <v-btn
            v-if="$store.getters.isAuthenticated"
            @click="copyToClipboard(`public/order/${order.protected_id}`, true)"
          >
            {{ $t('orders.public_url') }}<v-icon class="pl-3">mdi-content-copy</v-icon>
          </v-btn>
          <v-btn
            :href="order.download_url"
            target="_blank"
          >
            {{ $t('download') }}<v-icon class="pl-3">mdi-download</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <ul>
          <li><strong>{{ $t('orders.place_at') }}:</strong> {{ formatDate(order.date) }}</li>
          <li v-if="order.eta != null"><strong>{{ $t('orders.estimated_delivery') }}:</strong> {{ formatDate(order.eta) }}</li>
          <li><strong>{{ $t('orders.terms') }}:</strong> {{ order.incoterm }} - {{ order.transport_description }}</li>
          <li><strong>{{ $t('currency') }}:</strong> {{ order.currency }}</li>
        </ul>
      </v-card-text>
    </div>
  </v-card>
</template>
<script>
import loader from '../loadingBox'

export default {
  name: 'OrderHeader',
  props: ['loading', 'order'],
  components: {
    loader
  }
}
</script>