<template>
  <div>
    <v-autocomplete
      v-model="cargo"
      :items="cargos"
      :label="$t('components.delivery_date')"
      :loading="loading"
      persistent-hint
    >
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title><strong class="mColor-text">{{ data.item.name }}</strong></v-list-item-title>
          <v-list-item-subtitle class="mt-1">
            <strong>{{ $t('cost') }}:</strong> {{ numberToNiceString(data.item.cost) }} | 
            <strong>{{ $t('cutoff_date') }}:</strong> {{ formatDate(data.item.cutoff_date) }} |  
            <strong>ETA:</strong> {{ formatDate(data.item.eta) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>
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
      cargo: this.$store.getters.catalogueCargo.id,
      loading: true
    }
  },
  computed: {
    inOrders() {
      return (this.$router.currentRoute.name == 'OrdersNew') ? true : false
    },
    selected() {
      const cargo = this.cargos.find(cargo => cargo.id === this.cargo)
      return cargo === undefined ? {} : cargo
    }
  },
  watch: {
    cargo(val) {
      const cargo = this.cargos.find(cargo => cargo.id === val)
      this.$emit('cargoChanged', cargo)
      this.$store.commit('setCatalogueCargo', cargo)
    }
  },
  methods: {
    loadCargos() {
      return new Promise((resolve/*, reject*/) => {
        this.$http.get(this.endpoint(`cargo/get`))
          .then( resp => {
            if(resp.data.result == true) {
              if(resp.data.data.length > 0) {
                var vue = this
                resp.data.data.map(function(c) {
                  c.value = c.id
                  c.text = `${ vue.formatDate(c.eta) } (${c.name})`
                })
                this.cargos = resp.data.data
                //set cargo globally if it is the first time
                if(this.$store.getters.catalogueCargo.id === undefined) {
                  this.$store.commit('setCatalogueCargo', resp.data.data[0])
                }
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
      this.cargo = this.$store.getters.catalogueCargo.id
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