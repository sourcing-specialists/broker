<template>
  <div class="home">
    <h1>{{ $t('dashboard_title') }}</h1>
    <v-container fluid>
      <v-row>
        <v-col
          lg="4"
        >
          <top-clients></top-clients>
        </v-col>
      </v-row>
      <v-btn
        v-if="debugging"
        x-large
        color="primary"
        @click="run"
      >RUN</v-btn>
    </v-container>
  </div>
</template>

<script>
import topClients from '../components/dashboard/topClients'
export default {
  name: 'Dashboard',
  components: {
    topClients
  },
  data() {
    return {
      debugging: false
    }
  },
  methods: {
    run() {
      this.$http.get(this.endpoint('reports/topClients'), {
        params: {
          currency: this.$store.getters.getCurrency
        }
      })
      .then( resp => {
        console.log(resp.data)
      })
    }
  }
}
</script>
