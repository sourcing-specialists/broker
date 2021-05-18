<template>
  <v-card>
    <loader v-model="loading"></loader>
    <v-card-title>
      {{ $t('orders.logistics_details') }}
    </v-card-title>
    <v-card-subtitle>{{ $tc('orders.order_assigned_to', this.cargos.length, { n: this.cargos.length }) }}</v-card-subtitle>
    <v-divider v-if="this.cargos.length > 0"></v-divider>
    <v-card-text v-if="this.cargos.length > 0">
      <v-list>
        <v-list-item-content
          v-for="(cargo, index) in cargos"
          :key="cargo.id"
        >
          <v-divider v-if="index !== 0"></v-divider>
          <cargo-info :cargo="cargo"></cargo-info>
        </v-list-item-content>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import loader from '../loadingBox'
import cargoInfo from '../cargoInfo'

export default {
  name: 'orderContainers',
  props: ['order-id'],
  components: {
    loader, cargoInfo
  },
  data() {
    return {
      cargos: [],
      loading: true
    }
  },
  watch: {
    orderId(val, oldVal) {
      if(val && val !== oldVal) {
        this.loadLogistics()
      }
    }
  },
  methods: {
    loadLogistics() {
      this.loading = true
      this.$http.get(this.endpoint(`orders/edit/${this.orderId}/logistics`))
      .then( resp => {
        if(resp.data.result) {
          if(resp.data.data.cargos.length > 0) {
            resp.data.data.cargos.map(function(c) {
              c.percent = c.cbm_in_use/c.cbm_limit*100
            })
            this.cargos = resp.data.data.cargos
          }
        } else {
          this.$t('friendly_errors')
        }
        this.loading = false
      })
    }
  }
}
</script>