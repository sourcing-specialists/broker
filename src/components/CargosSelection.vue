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
      cargo: '',
      loading: true
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
              resolve()
            }
          })
      })
    }
  },
  beforeMount() {
    if(this.cargo == '') {
      this.loadCargos()
      .then( () => {
        this.cargo = this.cargos[0].id
        this.loading = false
      })
    }
  }
}
</script>