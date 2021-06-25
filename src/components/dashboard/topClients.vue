<template>
  <v-card>
    <v-card-title>{{ $t('charts.top_clients_purchases') }}<v-btn @click="reload"><v-icon>mdi-refresh</v-icon></v-btn></v-card-title>
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
          v-if="$store.getters.user.is_admin"
          lg="4"
          md="12"
        >
          <broker-selection v-model="broker"></broker-selection>
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text style="position: relative; min-height: 100px;">
      <loading-box v-model="loading"></loading-box>
      <div v-if="chartData !== null">
        <bar-chart
          :chart-data="chartData"
          :options="chartOptions"
        ></bar-chart>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import barChart from '../charts/barChart.vue'
  import loadingBox from '../loadingBox'
  import dateRangePicker from '../dateRangePicker'
  import BrokerSelection from './brokerSelection.vue'

  export default {
    name: 'topClients',
    components: {
      barChart,
      loadingBox,
      dateRangePicker,
      BrokerSelection
    },
    data() {
      return {
        loading: true,
        chartData: null,
        chartOptions: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        },
        dates: [
          new Date(new Date().getFullYear(), 0, 2).toISOString().substr(0, 10),//first day of the year
          new Date().toISOString().substr(0, 10),//now
        ],
        broker: 'all'
      }
    },
    watch: {
      broker() {
        this.getData()
      }
    },
    methods: {
      rangeChange(dates) {
        this.dates = dates
        this.getData()
      },
      getData() {
        this.loading = true
        this.$http.get(this.endpoint('reports/topClients'), {
          params: {
            from: this.dates[0],
            to: this.dates[1],
            currency: this.$store.getters.getCurrency,
            broker: this.broker
          }
        })
        .then( resp => {
          this.loading = false
          var data = resp.data.data.top_clients
          const labels = data.map( c => {
            return c.company.name
          })
          const confirmed = data.map( c => {
            return c.total_purchases_confirmed
          })
          const pending = data.map( c => {
            return c.total_purchases_pending
          })
          this.chartData = {
            labels: labels,
            datasets: [
              {
                label: `${this.$t('charts.confirm_sales_in')} ${this.$store.getters.getCurrency}`,
                data: confirmed,
                backgroundColor: this.fillArray('#3F51B5', data.length),
              },
              {
                label: `${this.$t('charts.pending_sales_in')} ${this.$store.getters.getCurrency}`,
                data: pending,
                backgroundColor: this.fillArray('#B71C1C', data.length),
              }
            ]
          }
        })
      },
      reload() {
        this.getData()
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>