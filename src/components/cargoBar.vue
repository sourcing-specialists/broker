<template>
  <div class="pa-3"
    v-if="cargo.id"
  >
    <h4>Container space</h4>
    <p><strong>Cut off: </strong>{{ cargo.cutoff_date }} | <strong>Estimated Arrival: </strong>{{ cargo.eta }} </p>
    <v-progress-linear
      color="cyan"
      height="40"
      :value="filledUpTo"
      striped
    >
      <template v-slot:default>
        {{ filledUpTo }}% - {{ cbmLeft }}cbm available.
      </template>
    </v-progress-linear>
    <v-divider></v-divider>
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