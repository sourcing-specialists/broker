<template>
  <div>
    <v-select
      v-model="cargo"
      :label="$t('components.delivery_date')"
      :items="cargos"
      :loading="loading"
      persistent-hint
      @change="$emit('cargoChanged', cargo)"
    >
    </v-select>
    <div
      class="cargo-hint"
    >
      <ul>
        <li><strong>{{ $t('origin') }}:</strong> {{ selected.origin_country_name }}</li>
        <li><strong>{{ $t('cost') }}:</strong> {{ selected.cost }}</li>
      </ul>
    </div>
  </div>
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
    },
    selected() {
      const cargo = this.cargos.find(cargo => cargo.id == this.cargo)
      return cargo === undefined ? {} : cargo
    }
  },
  watch: {
    cargo(val) {
      const cargo = this.cargos.find(cargo => cargo.id == val)
      //if(this.inOrders == true) {
        this.$store.dispatch('cargoSelection', cargo)
      //}
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
                c.text = `${c.eta } (${c.name})`
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

<style lang="scss" scoped>
.cargo-hint {
  margin-top: -10px;
  ul {
    display: flex;
    li {
      padding-right: 5px;
    }
  }
}
</style>