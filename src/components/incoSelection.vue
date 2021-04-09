<template>
  <div>
    <v-select
      label="Incoterm"
      :items="incoterms"
      v-model="inco"
      @change="$store.commit('changeInconterm', inco)"
      :disabled="forOrders"
    >
    </v-select>
  </div>
</template>

<script>
import incoterms from '../constants/incoterms'

import { mapGetters } from 'vuex'

export default {
  name: 'incoSelection',
  props: ['forOrders'],
  data() {
    return {
      incoterms: incoterms,
      inco: ''
    }
  },
  computed: {
    ...mapGetters(['getIncoterm']),
  },
  mounted() {
    if(this.forOrders) {
      this.inco = 'REVOOLOOP'
      return
    }
    this.inco = this.getIncoterm
  }
}
</script>