<template>
  <div class="home">
    <h1>{{ $t('dashboard_title') }}</h1>
     <v-btn
      v-if="debugging"
      x-large
      color="primary"
      @click="run"
    >RUN</v-btn>
    <v-container fluid>
      <v-row>
        <v-col
          v-if="$store.getters.user.is_admin"
          lg="12"
          md="12"
          sm="12"
        >
          <sales-by-broker></sales-by-broker>
        </v-col>
        <v-col
          lg="6"
          md="6"
          sm="12"
        >
          <sales-by-status></sales-by-status>
        </v-col>
        <v-col
          lg="6"
          md="6"
          sm="12"
        >
          <sales></sales>
        </v-col>
        <v-col
          lg="6"
          md="6"
          sm="12"
        >
          <top-clients></top-clients>
        </v-col>
        <v-col
          lg="6"
          md="6"
          sm="12"
        >
          <top-products></top-products>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import topClients from '../components/dashboard/topClients'
import sales from '../components/dashboard/sales'
import topProducts from '../components/dashboard/topProducts'
import salesByStatus from '../components/dashboard/salesByStatus'
import salesByBroker from '../components/dashboard/salesByBroker.vue'

export default {
  name: 'Dashboard',
  components: {
    topClients,
    sales,
    topProducts,
    salesByStatus,
    salesByBroker
  },
  data() {
    return {
      debugging: false
    }
  },
  methods: {
    run() {
      this.$http.get(this.endpoint('reports/sales_by_broker'), {
        params: {
          from: new Date(new Date().getFullYear(), 0, 2).toISOString().substr(0, 10),
          to: new Date().toISOString().substr(0, 10),
        }
      })
      .then( resp => {
        console.log(resp.data)
      })
    }
  }
}
</script>
