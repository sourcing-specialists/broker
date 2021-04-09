<template>
  <v-card>
    <v-card-title>{{ $t('charts.top_product_sales') }}</v-card-title>
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
            v-model="categorySelection"
            ref="categories"
            :return-value.sync="categoriesSelected"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                x-small
                color="blue"
                transition="scale-transition"
              ><v-icon class="mr-2" dense>mdi-folder-cog</v-icon> {{ categoriesSelectedName }}</v-btn>
            </template>
            <v-list>
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
                @click="changeCategories('all')"
              >
                <v-list-item-title>{{ $t('all') }}</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-for="category in categories"
                :key="category.id"
                @click="changeCategories(category)"
                v-show="category.inSearch"
              >
                <v-list-item-title>{{ category.name }}</v-list-item-title>
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

  export default {
    name: 'topClients',
    components: {
      barChart,
      loadingBox,
      dateRangePicker
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
        categoriesSelectedName: this.$t('all'),
        categoriesSelected: [],
        categories: [],
        categorySelection: false,
        optionsSearch: '',
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
      changeCategories(category) {
        this.categoriesSelectedName = category.name
        this.categoriesSelected = [category.id]
        this.getData()
      },
      getData() {
        this.loading = true
        this.$http.get(this.endpoint('reports/topProducts'), {
          params: {
            from: this.dates[0],
            to: this.dates[1],
            currency: this.$store.getters.getCurrency,
            categories: JSON.stringify(this.categoriesSelected)
          }
        })
        .then( resp => {
          this.loading = false
          const labels = resp.data.data.products.map( p => {
            return p.name
          })
          const salesByProduct = resp.data.data.products.map( p => {
            return p.total_sales
          })
          this.chartData = {
            labels: labels,
            datasets: [
              {
                label: `${this.$t('charts.confirm_sales_in')} ${this.$store.getters.getCurrency}`,
                data: salesByProduct,
                backgroundColor: this.fillArray('#009688', resp.data.data.products.length),
              }
            ]
          }

          //add categories
          if(this.categories.length === 0) {
            this.categories = resp.data.data.categories.map( c => {
              c.inSearch = true
              return c
            })
          }

        })
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>