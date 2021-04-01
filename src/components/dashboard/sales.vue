<template>
  <v-card>
    <v-card-title>
      {{ $t('charts.sales') }}
    </v-card-title>
    <v-card-subtitle>
      <v-row>
        <v-col
          lg="8"
          md="12"
        >
          <date-range-picker
            @change="rangeChange"
          ></date-range-picker>
        </v-col>
        <v-col
          lg="4"
          md="12"
        >
          <v-menu
            v-model="clientsSelection"
            ref="clients"
            :return-value.sync="selectedClient"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                x-small
                color="blue"
                transition="scale-transition"
              ><v-icon class="mr-2" dense>mdi-account-group</v-icon> {{ selectedClient === 'all' ? $t('all') : selectedClient.name }}</v-btn>
            </template>
            <v-list>
              <v-list-item
                @click="changeCompany('all')"
              >
                <v-list-item-title>{{ $t('all') }}</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-for="company in clients"
                :key="company.id"
                @click="changeCompany(company)"
              >
                <v-list-item-title>{{ company.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text style="position: relative; min-height: 100px;">
      <loading-box v-model="loading"></loading-box>
      <div v-if="chartData !== null">
        <doughnut-chart
          :chart-data="chartData"
          :options="chartOptions"
        ></doughnut-chart>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import doughnutChart from '../charts/doughnutChart.vue'
  import dateRangePicker from '../dateRangePicker'
  import loadingBox from '../loadingBox'

  export default {
    name: 'topClients',
    components: {
      doughnutChart,
      dateRangePicker,
      loadingBox
    },
    data() {
      return {
        loading: true,
        chartData: null,
        chartOptions: {},
        dates: [
          new Date(new Date().getFullYear(), 0, 2).toISOString().substr(0, 10),//first day of the year
          new Date().toISOString().substr(0, 10),//now
        ],
        clientsSelection: false,
        selectedClient: 'all',
        clients: []
      }
    },
    methods: {
      changeCompany(company) {
        this.$refs.clients.save(company)
        this.selectedClient = company
        this.getData()
      },
      rangeChange(dates) {
        this.dates = dates
        this.getData()
      },
      getData() {
        this.loading = true
        this.$http.get(this.endpoint('reports/sales'), {
          params: {
            to: this.dates[1],
            from: this.dates[0],
            currency: this.$store.getters.getCurrency,
            company_id: this.selectedClient === '' ? this.selectedClient : this.selectedClient.id
          }
        })
        .then( resp => {
          //console.log(resp.data)
          this.loading = false
          const labels = [ this.$t('charts.confirmed'), this.$t('charts.pending')]
          const data = [resp.data.data.sales.total_sales_confirmed, resp.data.data.sales.total_sales_pending]
          this.chartData = {
            labels: labels,
            datasets: [
              {
                label: `${this.$t('charts.confirm_sales_in')} ${this.$store.getters.getCurrency}`,
                data: data,
                backgroundColor: ['#3F51B5', '#B71C1C'],
              }
            ]
          }
          //add clients
          if(this.clients.length === 0) {
            this.clients = resp.data.data.companies
          }
        })
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>