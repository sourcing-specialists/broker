<template>
  <v-data-table
    :loading="loading"
    :headers="table.headers"
    :items="table.orders"
    :items-per-page="pageSize"
    :page.sync="page"
    :options.sync="options"
    :server-items-length="pageCount"
    hide-default-footer
    class="elevation-1 pa-8"
  >
    <template v-slot:top>
      <v-row>
        <v-col>
          <v-select
            :items="[{text: $t('orders.all_orders'), value: 'all' }, { text: $t('orders.only_active'), value: '' }]"
            :label="type === 'orders' ? $tc('order', 2) : $tc('quotation', 2)"
            v-model="ordersType"
            @change="loadOrders()"
          >
          </v-select>
        </v-col>
        <v-col
          v-if="type === 'orders'"
        >
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
            @keyup.enter="loadOrders"
            @click:clear="loadOrders(true)"
            clearable
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
                {{ type === 'orders' ? item.orderNumber : item.id }}
              </v-btn>
            </template>
            <v-card max-width="960" class="py-2" flat>
              <order-products-list
                is-preview
                :order="item"
                :products="item.products"
              ></order-products-list>
            </v-card>
          </v-tooltip>
        </td>
        <td>{{ formatDate(item.date) }}</td>
        <td>
          <div class="font-weight-bold">{{ item.company }}</div>
          <p class="mb-0">{{ item.incoterm }} - {{ item.transport_description }}</p>
        </td>
        <td class="py-2">
          <tr v-if="item.cargos.length === 0">
            <td>
              <div class="order-notes"> {{ $t('orders.no_cargos_assigned')}}</div>
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
                    small
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
                  <v-icon small>{{ stageIcon(item.stage.slug) }}</v-icon>
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
                  v-if="item.expired_at !== null && item.expired_at !== ''"
                  label
                  :color="isExpired(item.expired_at) ? 'warning' : 'success'"
                  x-small
                >
                  <strong class="mr-1 ">{{ isExpired(item.expired_at) ? $t('orders.expired') : $t('orders.expiring_at') }}: </strong> {{ formatDate(item.expired_at) }}
                </v-chip>
                <v-tooltip
                  bottom
                  color="rgba(255, 255, 255, 1)"
                  v-for="payment in item.payments"
                  :key="payment.id"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      v-bind="attrs"
                      v-on="on"
                      label
                      :color="payment.status === 'Pending' ? 'red' : 'green'"
                      dark
                      x-small
                    >
                      <v-icon x-small>{{ payment.status === 'Pending' ? 'mdi-currency-usd-off' : 'mdi-currency-usd' }}</v-icon>
                    </v-chip>
                  </template>
                  <v-card class="py-2" flat>
                    <div><strong>{{ $t('created') }}:</strong> {{ formatDate(payment.created_at) }}</div>
                    <div><strong>{{ $t('reason') }}:</strong> {{ payment.reason }}</div>
                    <div><strong>{{ $t('amount') }}:</strong> {{ payment.amount_string }}</div>
                    <div v-if="payment.status === 'Pending'"><strong>{{ $t('orders.expiring_at') }}:</strong> {{ formatDate(payment.expired_at) }}</div>
                    <div v-else><strong>{{ $t('paid_at') }}:</strong> {{ formatDate(payment.paid_at) }}</div>
                  </v-card>
                </v-tooltip>
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
            @click="$router.push(viewPush(item.id))"
          >
            <span class="white--text"><v-icon>mdi-pencil</v-icon></span>
          </v-btn>
        </td>
      </tr>
    </template>
    <template v-slot:footer>
      <v-pagination
        class="mt-3"
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </template>
  </v-data-table>
</template>

<script>
import cargoInfo from '../../components/cargoInfo'
import { getOrderStages } from '../../endpoints'
import orderProductsList from '../../components/orders/orderProductsList'

export default {
  name: 'ordersList',
  props: {
    type: {
      default: 'orders'
    }
  },
  components: {
    cargoInfo, orderProductsList
  },
  data() {
    return {
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
      show_expired: false,
      ordersType: '',
      pageSize: 15,
      page: 1,
      pageCount: 1,
      totalRecords: 0, 
      options: {}
    }
  },
  watch: {
    options: {
      handler () {
        this.loadOrders()
      },
      deep: true,
    },
  },
  methods: {
    loadOrders(clear = false) {
      if(clear === true) {//has to be === true because clear get an event
        this.table.search = ''
      }
      this.loading = true
      this.$http.get(this.endpoint('order/get'), {
        params: {
          stage: this.orderStage,
          //client_id: '',
          //incoterm: '',
          search: this.table.search,
          order_type: this.ordersType,
          quotation: this.type === 'quotations' ? 1 : 0,
          pageSize: this.pageSize,
          pageNumber: this.page,
        }
      })
      .then((resp) => {
        //console.log(resp.data.data)
        this.table.orders = resp.data.data.records
        this.loading = false
        this.pageCount = resp.data.data.pagination.totalPages
        this.totalRecords = resp.data.data.pagination.itemsCount
      })
    },
    isExpired(date) {
      if(new Date() > new Date(date)) {
        return true
      }
      return false
    },
    viewPush(id) {
      return this.type === 'quotations' ? { name: 'viewQuotation', params: { id: id }} : { name: 'viewOrder', params: { id: id }}
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
</script>
