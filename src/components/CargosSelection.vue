<template>
  <v-select
    v-model="cargo"
    label="Delivery Date"
    :items="cargos"
    :loading="loading"
    hint="This field is mandatory"
    persistent-hint
    @change="$emit('cargoChanged', cargo)"
  >
  </v-select>
</template>
<script>
export default {
  name: 'CargosSelection',
  data() {
    return {
      cargos: [],
      cargo: this.$store.getters.cargo.id,
      loading: true
    }
  },
  computed: {
    inOrders() {
      return (this.$router.currentRoute.name == 'OrdersNew') ? true : false
    }
  },
  watch: {
    cargo(val) {
      const cargo = this.cargos.find(cargo => cargo.id == val)
      if(this.inOrders == true) {
        this.$store.dispatch('cargoSelection', cargo)
      }
    }
  },
  methods: {
    loadCargos() {
      return new Promise((resolve/*, reject*/) => {
        this.$http.get(this.endpoint(`cargo/get`))
          .then( resp => {
            if(resp.data.result == true) {
              resp.data.data.map(function(c) {
                c.value = c.id
                c.text = c.departure_date != '' ? c.departure_date : c.cutoff_date
              })
              this.cargos = resp.data.data
              //set cargo globally if it is the first time
              if(this.$store.getters.cargo.id == undefined) {
                this.$store.dispatch('cargoSelection', resp.data.data[0])
              }
              resolve()
            }
          })
      })
    }
  },
  beforeMount() {
    this.loadCargos()
    .then( () => {
      this.cargo = this.$store.getters.cargo.id
      this.loading = false
    })
  }
}
</script>