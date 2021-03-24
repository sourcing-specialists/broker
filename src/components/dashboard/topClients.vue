<template>
  <v-card>
    <v-card-title>{{ $t('top_clients_sales') }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="table.header"
        :items="table.companies"
        :disable-pagination="true"
        :items-per-page="5"
      ></v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'topClients',
    data() {
      return {
        loading: true,
        table: {
          header: [
            { text: this.$t('company'), align: 'start',  value: 'name' },
            { text: this.$t('total_purchases'), align: 'end',  value: 'totalPurchases' }
          ],
          companies: [],
        }
      }
    },
    mounted() {
      this.$http.get(this.endpoint('reports/topClients'), {
        params: {
          currency: this.$store.getters.getCurrency
        }
      })
      .then( resp => {
        this.loading = false
        this.table.companies = resp.data
        //console.log(this.table.companies)
      })
    }
  }
</script>