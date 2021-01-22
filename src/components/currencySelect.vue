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
          <span class="font-weight-bold mr-2">{{ $store.getters.getCurrency }} </span>
          <v-icon dark>
            fa-coins
          </v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="curr in currencies"
          :key="curr"
          @click="$store.commit('currencyChange', curr)"
        >
          <v-list-item-title>{{ curr }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'Currencies',
  data() {
    return {
      loading: true,
      currency: this.$store.getters.getCurrency,
      currencies: []
    }
  },
  mounted() {
    this.$http.get(this.endpoint('currencies'))
    .then( currencies => {
      this.currencies = currencies.data.data
      this.loading = false
    })
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