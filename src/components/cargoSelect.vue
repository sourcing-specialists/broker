<template>
  <v-autocomplete
    v-model="cargo"
    :items="cargos"
    :label="$t('orders.select_cargo')"
    @change="setCargo"
    :rules="requiredRuleCargo"
    :loading="loading"
  >
    <template v-slot:selection="data">
      #{{ data.item.id }} - {{ data.item.name }}
    </template>
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title><strong class="mColor-text">#{{ data.item.id }} - {{ data.item.name }}</strong></v-list-item-title>
        <v-list-item-subtitle class="mt-1">
          <strong>{{ $t('cost') }}:</strong> {{ numberToNiceString(data.item.cost) }} | 
          <strong>{{ $t('cutoff_date') }}:</strong> {{ formatDate(data.item.cutoff_date) }} |  
          <strong>{{ $t('orders.estimated_departure') }}:</strong> {{ formatDate(data.item.departure_date) }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-progress-linear
            v-model="data.item.percent"
            color="light-green lighten-1"
            height="25"
            striped
          >
            <template v-slot:default>
              <strong>{{ data.item.cbm_in_use }} {{ $t('orders.cbm_used_vs_free') }}  {{ data.item.cbm_limit }} </strong>
            </template>
          </v-progress-linear>
          <h4 class="mt-3 ml-3 text-center">
            <v-icon>mdi-ferry</v-icon><strong class="mColor-text ml-3">{{ $t('orders.estimated_delivery') }}: </strong>{{ formatDate(data.item.eta) }}
          </h4>
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: 'cargoSelect',
  props: {
    value: {
      default: null
    },
    required: {
      default: false
    },
    inOrders: {
      default: false
    }
  },
  data() {
    return {
      loading: true,
      cargo: '',
      cargos: [],
      requiredRuleCargo: [
        v => !!v || this.$t('orders.select_cargo')
      ]
    }
  },
  watch: {
    cargo(v) {
      const cargo = this.cargos.find( c => c.id === v)
      this.$emit('input', cargo)
    }
  },
  methods: {
    setCargo() {
      const cargo = this.cargos.find( c => c.id === this.cargo)
      this.$emit('change', cargo)
      if(this.inOrders) {
        this.$store.commit('cart/setCargo', cargo)
      } else {
        this.$store.commit('setCatalogueCargo', cargo)
      }
    },
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
                  c.percent = c.cbm_in_use/c.cbm_limit*100
                })
                this.cargos = resp.data.data
              }
              resolve()
            }
          })
      })
    },
  },
  beforeMount() {
    this.loadCargos().then( () => {
      if(this.inOrders) {
        this.cargo = this.$store.getters['cart/cargo']
      } else {
        var catCargo = this.$store.getters['catalogueCargo']
        //if nothing set we chose the sooner cutoff cargo
        if(!this.$store.getters['catalogueCargo'].id) {
          if(this.cargos.length > 0) {
            catCargo = this.cargos[0]
          }
        }
        this.cargo = catCargo
      }
      this.loading = false
    })
  }
}
</script>