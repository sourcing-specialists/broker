<template>
  <v-card>
    <v-card-title>{{ $t('charts.sales_by_broker') }}<v-btn @click="reload"><v-icon>mdi-refresh</v-icon></v-btn></v-card-title>
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
      </v-row>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text style="position: relative; min-height: 100px;">
      <loading-box v-model="loading"></loading-box>
      <v-data-table
        :headers="[
          { text: '', align: 'center', sortable: false, value: 'avatar' },
          { text: this.$t('name'), align: 'start', sortable: false, value: 'name' },
          { text: this.$t('charts.companies_created'), align: 'start', sortable: true, value: 'companies_count' },
          { text: this.$t('charts.assigned_total_sales'), align: 'start', sortable: true, value: 'assigned_total_sales' },
          { text: this.$t('charts.fellow_total_sales'), align: 'start', sortable: true, value: 'fellow_total_sales' },
          { text: this.$t('charts.cbm_sold'), align: 'start', sortable: true, value: 'cbm_sold' },
          { text: this.$t('charts.created_total_sales'), align: 'start', sortable: true, value: 'created_total_sales' },
          /*{ text: this.$t('charts.created_total_sales'), align: 'start', sortable: true, value: 'orders_numbers' },*/
        ]"
        :items="brokers"
      >
        <template v-slot:[`item.avatar`]="{ index }">
          <v-icon
            v-if="index === 0"
            color="green"
            large
          >mdi-trophy</v-icon>
          <v-icon
            v-if="index === 1"
            color="blue-grey"
          >mdi-medal</v-icon>
          <v-icon
            v-if="index > 1"
            small
          >mdi-account</v-icon>
        </template>
        <template v-slot:[`item.name`]="{ item, index }">
          <div :class="[
            { ['font-weight-black']: index === 0 },
            { ['font-weight-bold']: index === 1 },
            { ['text-h5']: index === 0 },
            { ['text-h6']: index === 1 }
          ]">{{ item.first_name }} {{ item.last_name }}</div>
        </template>
        <template v-slot:[`item.fellow_total_sales`]="{ item }">
          {{ numberToNiceString(item.fellow_total_sales, $store.getters.getCurrency, 2)}}
        </template>
        <template v-slot:[`item.assigned_total_sales`]="{ item }">
          {{ numberToNiceString(item.assigned_total_sales, $store.getters.getCurrency, 2)}}
        </template>
        <template v-slot:[`item.cbm_sold`]="{ item }">
          <div class="font-weight-black">{{ round(item.cbm_sold, 2) }} ({{ round(item.weight_sold, 2) }}kg)</div>
        </template>
        <template v-slot:[`item.created_total_sales`]="{ item }">
          <div class="font-weight-black">{{ numberToNiceString(item.created_total_sales, $store.getters.getCurrency, 2)}}</div>
        </template>
        <template v-slot:[`item.orders_numbers`]="{ item }">
          <div class="font-weight-black">{{ item.orders_numbers.join(', ') }}</div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  import { SALES_BY_BROKER } from '@/constants/endpoints.js'
  import loadingBox from '../loadingBox'
  import dateRangePicker from '../dateRangePicker'

  export default {
    name: 'topClients',
    components: {
      loadingBox,
      dateRangePicker
    },
    data() {
      return {
        loading: true,
        dates: [
          new Date(new Date().getFullYear(), 0, 2).toISOString().substr(0, 10),//first day of the year
          new Date().toISOString().substr(0, 10),//now
        ],
        brokers: []
      }
    },
    methods: {
      filterSearch() {
        this.categories.map( c => {
          if(!c.name.toLowerCase().includes(this.optionsSearch.toLowerCase())) {
            c.inSearch = false
          } else {
            c.inSearch = true
          }
        })
      },
      rangeChange(dates) {
        this.dates = dates
        this.getData()
      },
      getData() {
        this.loading = true
        this.$http.get(this.buildEndpoint(SALES_BY_BROKER), {
          params: {
            from: this.dates[0],
            to: this.dates[1],
            currency: this.$store.getters.getCurrency,
          }
        })
        .then( resp => {
          this.loading = false
          //console.log(resp.data.data)
          this.brokers = resp.data.data
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
.winner {
  background-color: #C8E6C9;
}
</style>