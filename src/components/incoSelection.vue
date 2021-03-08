<template>
  <div>
    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on, attrs }">

        <v-btn
          dark
          color="secondary"
          v-bind="attrs"
          v-on="on"
        >
          <span class="font-weight-bold mr-2">{{ getIncoterm }} </span>
          <v-icon dark>
            mdi-handshake
          </v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="inco in incoterms"
          :key="inco"
          @click="$store.commit('changeInconterm', inco)"
        >
          <v-list-item-title>{{ inco }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import incoterms from '../constants/incoterms'

import { mapGetters } from 'vuex'

export default {
  name: 'incoSelection',
  data() {
    return {
      incoterms: incoterms
    }
  },
  computed: {
    ...mapGetters(['getIncoterm'])
  }
}
</script>

<style lang="scss" scoped>
.currency-select {
  max-width: 100px;
  padding: 0px !important;
  margin: 0px !important;
  div {
    background: none;
    padding: 0px !important;
    margin: 0px !important;
  }
  .v-input__slot {
    background-color: none !important;
  }
  .v-text-field__details {
    display: none !important;
  }
  
}
.v-input__control {
    background: none !important;
}
</style>