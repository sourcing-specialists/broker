<template>
  <div class="pa-3"
    v-if="cargo.id"
  >
    <h4>{{ cargo.name }}</h4>
    <p>
      <strong>{{ $t('cost') }}: </strong>{{ cargo.cost }} | 
      <strong>{{ $t('cutoff_date') }}: </strong>{{ formatDate(cargo.cutoff_date) }} | 
      <strong>{{ $t('orders.estimated_departure') }}: </strong>{{ formatDate(cargo.departure_date) }}</p>
    <v-progress-linear
      color="cyan"
      height="40"
      :value="filledUpTo"
      striped
    >
      <template v-slot:default>
        <strong>{{ filledUpTo }}% - {{ cbmLeft }}cbm {{ $t('orders.available') }}.</strong>
      </template>
    </v-progress-linear>
    <v-progress-linear
      class="mt-1"
      v-model="weightPercent"
      color="blue-grey lighten-3"
      height="10"
      striped
    >
      <template v-slot:default>
        <p class="ma-0" style="font-size: 9px;"><strong>{{ weightUpTo }} {{ $t('orders.weight_used_vs_free') }}  {{ cargo.weight_limit }} </strong></p>
      </template>
    </v-progress-linear>
    <h2 class="mt-3 ml-3 text-center">
      <v-icon>mdi-ferry</v-icon><strong class="mColor-text ml-3">{{ $t('orders.estimated_delivery') }}: </strong>{{ formatDate(cargo.eta) }}
    </h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'cargobar',
  computed: {
    ...mapGetters('cart', [
      'cbm',
      'cargo',
      'weight',
      'products'
    ]),
    filledUpTo() {//cbms
      return this.round(((this.cargo.cbm_in_use+this.cbm)*100)/this.cargo.cbm_limit,2)
    },
    cbmLeft() {
      var left =  this.cargo.cbm_limit - (this.cargo.cbm_in_use+this.cbm)
      return this.round(left)
    },
    weightPercent() {
      return this.round(((this.cargo.weight_in_use+this.weight)*100)/this.cargo.weight_limit,2)
    },
    weightUpTo() {
      return this.round((this.cargo.weight_in_use+this.weight),2)
    },
    weightLeft() {
      var left =  this.cargo.weight_limit - (this.cargo.weight_in_use+this.weight)
      return this.round(left)
    }
  },
    mounted() {
      console.log(this.products)
    }
}
</script>