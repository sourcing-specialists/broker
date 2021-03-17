<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    <router-link :to="{ name: 'OrdersNew' }">
      <v-btn
        class="ma-2 add_button"
        :color="$store.getters.vColor"
        elevation="2"
        fab
      >
        <span class="white--text"><v-icon>mdi-plus</v-icon></span>
      </v-btn>
    </router-link>
    <v-data-table
      :loading="loading"
      :search="table.search"
      :headers="table.headers"
      :items="table.orders"
      :items-per-page="10"
      class="elevation-1 pa-8"
    >
      <template v-slot:top>
        <v-row>
          <v-col>
            <v-select
              :items="[{text: 'All Orders', value: 'all' }, { text: 'Active Orders', value: '' }]"
              label="Orders"
              v-model="ordersType"
              @change="loadOrders()"
            >
            </v-select>
          </v-col>
          <v-col>
            <v-text-field
              append-icon="mdi-magnify"
              v-model="table.search"
              label="Search"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:[`item.terms`]="{ item }">
        {{ item.incoterm }} - {{ item.transport_description }}
      </template>
      <template v-slot:[`item.stage`]="{ item }">
        <v-chip
          class="ma-2"
          :color="stageColor(item.stage.slug)"
          text-color="white"
        >
          <v-avatar left>
            <v-icon>{{ stageIcon(item.stage.slug) }}</v-icon>
          </v-avatar>
          {{ item.stage.description }} 
          <div v-if="item.stage.slug === 'shipped'">
            . ETA: {{ item.eta }}
          </div>
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          class="ma-2"
          x-small
          fab
          elevation="2"
          :color="$store.getters.vColor"
          @click="$router.push({ name: 'viewOrder', params: { id: item.id }})"
        >
          <span class="white--text"><v-icon>mdi-pencil</v-icon></span>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import PageHeader from '../../components/PageHeader'

export default {
  name: 'Orders',
  data() {
    return {
      title: 'Orders',
      subheader: 'List of all orders',
      ordersType: '',
      loading: true,
      table: {
        search: '',
        headers: [
          { text: 'ID', align: 'start', sortable: true, value: 'orderNumber' },
          { text: 'Company', align: 'start', sortable: true, value: 'company' },
          { text: 'Terms', align: 'start', sortable: true, value: 'terms' },
          { text: 'Date', align: 'start', sortable: true, value: 'date' },
          { text: 'Amount', align: 'start', sortable: true, value: 'total_string' },
          { text: 'Status', align: 'start', sortable: true, value: 'stage' },
          { text: '', align: 'end', value: 'actions' }
        ],
        orders: []
      }
    }
  },
  components: {
    PageHeader
  },
  methods: {
    loadOrders() {
      this.loading = true
      this.$http.get(this.endpoint('order/get'), {
        params: {
          order_type: this.ordersType
        }
      })
      .then((resp) => {
        this.table.orders = resp.data.data
        this.loading = false
        console.log(this.table.orders)
      })
    }
  },
  mounted() {
    this.loadOrders()
  }
}
</script>
