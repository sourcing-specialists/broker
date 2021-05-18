<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    <router-link :to="{ name: 'OrdersNew' }">
      <v-btn
        class="ma-2 add_button"
        :color="$store.getters.vColor"
        elevation="2"
        x-large
        dark
      >{{ newOrderText }} <v-icon>{{ newOrderIcon }}</v-icon></v-btn>
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
              :items="[{text: $t('orders.all_orders'), value: 'all' }, { text: $t('orders.only_active'), value: '' }]"
              label="Orders"
              v-model="ordersType"
              @change="loadOrders()"
            >
            </v-select>
          </v-col>
          <v-col>
            <v-select
              clearable
              :items="orderStages"
              :label="$t('stage')"
              v-model="orderStage"
              @change="loadOrders()"
            >
            </v-select>
          </v-col>
          <v-col>
            <v-text-field
              append-icon="mdi-magnify"
              v-model="table.search"
              :label="$t('search')"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>
             <v-tooltip
              right
              color="rgba(255, 255, 255, 1)"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  v-bind="attrs"
                  v-on="on"
                  :color="$store.getters.vColor"
                  @click.prevent
                >
                  {{ item.orderNumber }}
                </v-btn>
              </template>
              <v-card class="py-2" flat>
                <order-products-list
                  is-preview
                  :order="item"
                  :products="item.products"
                ></order-products-list>
              </v-card>
            </v-tooltip>
          </td>
          <td>{{ formatDate(item.date) }}</td>
          <td>{{ item.company }}</td>
          <td class="py-2">
            <tr>
              <td>
                {{ item.incoterm }} - {{ item.transport_description }}
                <div class="order-notes" v-if="item.cargos.length === 0"> {{ $t('orders.no_cargos_assigned')}}</div>
              </td>
            </tr>
            <tr
              v-for="cargo in item.cargos"
              :key="cargo.id"
            >
              <td>
                <v-tooltip
                  bottom
                  color="rgba(255, 255, 255, 1)"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      x-small
                      color="blue lighten-4"
                      v-bind="attrs"
                      v-on="on"
                      label
                    >
                      <v-icon small>mdi-ferry</v-icon> #{{ cargo.id }} - <strong>Eta:</strong> {{ formatDate(cargo.eta) }}
                    </v-chip>
                  </template>
                  <v-card class="py-2" flat>
                    <cargo-info :cargo="cargo"></cargo-info>
                  </v-card>
                </v-tooltip>
              </td>
            </tr>
          </td>
          <td>{{ item.total_string }}</td>
          <td class="py-2">
            <tr>
              <td>
                <v-chip
                  :color="stageColor(item.stage.slug)"
                  label
                  dark
                  small
                >
                  <v-avatar left>
                    <v-icon>{{ stageIcon(item.stage.slug) }}</v-icon>
                  </v-avatar>
                  {{ item.stage.description }} 
                  <div v-if="item.stage.slug === 'shipped'">
                    . ETA: {{ item.eta }}
                  </div>
              </v-chip>
              </td>
            </tr>
            <tr>
              <td>
                <v-chip-group>
                  <v-chip
                    v-if="item.stage.slug === 'pending' && item.expired_at !== null"
                    label
                    :color="isExpired(item.expired_at) ? 'warning' : 'success'"
                    x-small
                  >
                    <strong class="mr-1 ">{{ isExpired(item.expired_at) ? $t('orders.expired') : $t('orders.expiring_at') }}: </strong> {{ formatDate(item.expired_at) }}
                  </v-chip>
                </v-chip-group>
              </td>
            </tr>
          </td>
          <td>
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
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import cargoInfo from '../../components/cargoInfo'
import PageHeader from '../../components/PageHeader'
import { getOrderStages } from '../../endpoints'
import orderProductsList from '../../components/orders/orderProductsList'

export default {
  name: 'Orders',
  components: {
    PageHeader, cargoInfo, orderProductsList
  },
  data() {
    return {
      title: 'Orders',
      subheader: 'List of all orders',
      ordersType: '',
      loading: true,
      table: {
        search: '',
        headers: [
          { text: this.$t('ref'), align: 'start', sortable: true, filterable: true, value: 'orderNumber', width: '100px', fixed: true },
          { text: this.$t('orders.place_at'), align: 'start', sortable: true, value: 'date' },
          { text: this.$t('company'), align: 'start', sortable: true, filterable: true, value: 'company' },
          { text: this.$t('orders.terms'), align: 'start', sortable: true, filterable: true, value: 'terms' },
          { text: this.$t('total'), align: 'start', sortable: true, value: 'total_string' },
          { text: this.$t('status'), align: 'start', sortable: true, value: 'stage' },
          { text: '', align: 'end', value: 'actions', sortable: false, width: '50px' }
        ],
        orders: [],
      },
      orderStages: [],
      orderStage: '',
      show_expired: false
    }
  },
  computed: {
    newOrderText() {
      if(this.$store.getters['cart/company'].id !== undefined) {
        return this.$t('views.orders.continue_order')
      }
      return this.$t('views.orders.start_new_order')
    },
    newOrderIcon() {
      return this.$store.getters['cart/company'].id !== undefined ? 'mdi-chevron-right' : 'mdi-plus'
    }
  },
  methods: {
    loadOrders() {
      //console.log(this.orderStage)
      this.loading = true
      this.$http.get(this.endpoint('order/get'), {
        params: {
          stage: this.orderStage,
          //client_id: '',
          //incoterm: '',
          order_type: this.ordersType
        }
      })
      .then((resp) => {
        //console.log(resp.data)
        this.table.orders = resp.data.data
        this.loading = false
      })
    },
    isExpired(date) {
      if(new Date() > new Date(date)) {
        return true
      }
      return false
    }
  },
  mounted() {
    getOrderStages().then(stages => {
      this.orderStages = stages.map( s => {
        return {
          text: s.name,
          value: s.slug
        }
      })
    })
    this.loadOrders()
  }
}
//AQExhmfuXNWTK0Qc+iSDnXEqpO2VT7hdCJBDWWlf1Wy4snJPLR5EqPVduc2K1vRK0mfj9BDBXVsNvuR83LVYjEgiTGAH-8efjiq+PDE6qBloHY11dOt1bRjHW4t/zO0U1peZL07M=-XRNfn;}6,Pam4vKz
</script>

<style scoped>
.order-notes {
  font-size: 11px;
  font-style: italic !important;
}
</style>

