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
        {{ filledUpTo }}% - {{ cbmLeft }}cbm {{ $t('orders.available') }}.
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
      'cargo'
    ]),
    filledUpTo() {
      return this.round(((this.cargo.cbm_in_use+this.cbm)*100)/this.cargo.cbm_limit,2)
    },
    cbmLeft() {
      var left =  this.cargo.cbm_limit - (this.cargo.cbm_in_use+this.cbm)
      return this.round(left)
    }
  }
}
</script>