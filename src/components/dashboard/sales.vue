<template>
  <v-card>
    <v-card-title>
      {{ $t('charts.sales') }}
      <v-btn @click="reload"><v-icon>mdi-refresh</v-icon></v-btn>
    </v-card-title>
    <v-card-subtitle>
      <v-row>
        <v-col
          :lg="$store.getters.user.is_admin ? 6 : 8"
          md="12"
        >
          <date-range-picker
            @change="rangeChange"
          ></date-range-picker>
        </v-col>
        <v-col
          v-if="$store.getters.user.is_admin"
          lg="3"
          md="12"
        >
          <broker-selection v-model="broker"></broker-selection>
        </v-col>
        <v-col
          :lg="$store.getters.user.is_admin ? 3 : 4"
          md="12"
        >
          <v-menu
            v-model="clientsSelection"
            ref="clients"
            :return-value.sync="selectedClient"
            :close-on-content-click="false"
            content-class="menu-bg"
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
            <v-list max-height="500px">
              <v-list-item>
                <v-text-field
                  v-model="optionsSearch"
                  :label="$t('search')"
                  append-icon="mdi-magnify"
                  @keyup="filterSearch"
                ></v-text-field>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                @click="changeCompany('all')"
              >
                <v-list-item-title>{{ $t('all') }}</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-for="company in clients"
                :key="company.id"
                @click="changeCompany(company)"
                v-show="company.inSearch"
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
      <v-row>
        <v-col
          lg="6"
          md="6"
          sm="12"
          class="total_sales"
        >
          <div>
            <h4>{{ $t('charts.total_confirmed') }}</h4>
            <h1 class="indigo--text mb-3">{{ numberToNiceString(totalSalesConfirmed, $store.getters.getCurrency, 2) }}</h1>
            <h4>{{ $t('charts.total_pending') }}</h4>
            <h1 class="red--text text--darken-4">{{ numberToNiceString(totalSalesPending, $store.getters.getCurrency, 2) }}</h1>
          </div>
        </v-col>
        <v-col
          lg="6"
          md="6"
          sm="12"
        >
          <div v-if="chartData !== null">
            <doughnut-chart
              :chart-data="chartData"
              :options="chartOptions"
            ></doughnut-chart>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import doughnutChart from '../charts/doughnutChart.vue'
  import dateRangePicker from '../dateRangePicker'
  import loadingBox from '../loadingBox'
  import BrokerSelection from './brokerSelection.vue'

  export default {
    name: 'topClients',
    components: {
      doughnutChart,
      dateRangePicker,
      loadingBox,
      BrokerSelection
    },
    data() {
      return {
        loading: true,
        chartData: null,
        chartOptions: {
          cutoutPercentage: 65,
          legend: {
            display: false
          },
        },
        dates: [
          new Date(new Date().getFullYear(), 0, 2).toISOString().substr(0, 10),//first day of the year
          new Date().toISOString().substr(0, 10),//now
        ],
        clientsSelection: false,
        selectedClient: 'all',
        clients: [],
        labels: [],
        data: [],
        totalSales: '',
        totalSalesConfirmed: '',
        totalSalesPending: '',
        optionsSearch: '',
        broker: 'all'
      }
    },
    watch: {
      broker() {
        this.getData()
      }
    },
    methods: {
      filterSearch() {
        this.clients.map( c => {
          if(!c.name.toLowerCase().includes(this.optionsSearch.toLowerCase())) {
            c.inSearch = false
          } else {
            c.inSearch = true
          }
        })
      },
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
            company_id: this.selectedClient === '' ? this.selectedClient : this.selectedClient.id,
            broker: this.broker
          }
        })
        .then( resp => {
          //console.log(resp.data)
          this.loading = false
          this.labels = [ this.$t('charts.confirmed'), this.$t('charts.pending')]
          this.data = [resp.data.data.sales.total_sales_confirmed, resp.data.data.sales.total_sales_pending]
          this.totalSales = resp.data.data.sales.total_sales
          this.totalSalesConfirmed = resp.data.data.sales.total_sales_confirmed
          this.totalSalesPending = resp.data.data.sales.total_sales_pending
          this.chartData = {
            labels: this.labels,
            datasets: [
              {
                label: `${this.$t('charts.confirm_sales_in')} ${this.$store.getters.getCurrency}`,
                data: this.data,
                backgroundColor: ['#3F51B5', '#B71C1C'],
              }
            ]
          }
          //add clients
          if(this.clients.length === 0) {
            this.clients = resp.data.data.companies.map( c => {
              c.inSearch = true
              return c
            })
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
<style scoped>
.menu-bg {
  background-color: #FFF;
}
</style>