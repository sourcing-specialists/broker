<template>
  <div>
    <v-list-item-title><strong class="mColor-text">#{{ cargo.id }} - {{ cargo.name }}</strong></v-list-item-title>
    <v-list-item-subtitle class="mt-1">
      <strong>{{ $t('cost') }}:</strong> {{ numberToNiceString(cargo.cost) }} | 
      <strong>{{ $t('cutoff_date') }}:</strong> {{ formatDate(cargo.cutoff_date) }} |  
      <strong>{{ $t('orders.estimated_departure') }}:</strong> {{ formatDate(cargo.departure_date) }}
    </v-list-item-subtitle>
    <v-list-item-subtitle>
      <v-progress-linear
        :value="percent"
        color="light-green lighten-1"
        height="25"
        striped
      >
        <template v-slot:default>
          <strong>{{ round(cargo.cbm_in_use, 2) }} {{ $t('orders.cbm_used_vs_free') }}  {{ cargo.cbm_limit }} </strong>
        </template>
      </v-progress-linear>
      <h4 class="mt-3 ml-3 text-center">
        <v-icon>mdi-ferry</v-icon><strong class="mColor-text ml-3">{{ $t('orders.estimated_delivery') }}: </strong>{{ formatDate(cargo.eta) }}
      </h4>
    </v-list-item-subtitle>
  </div>
</template>
<script>
export default {
  name: 'cargoInfo',
  props: ['cargo'],
  computed: {
    percent() {
      return this.cargo.cbm_in_use/this.cargo.cbm_limit*100
    }
  }
}
</script>