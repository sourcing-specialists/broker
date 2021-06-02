<template>
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
            @click="$router.push(viewPush(item.id))"
          >
            <span class="white--text"><v-icon>mdi-pencil</v-icon></span>
          </v-btn>
        </td>
      </tr>
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
      ordersType: ''
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
          order_type: this.ordersType,
          quotation: this.type === 'quotations' ? 1 : 0
        }
      })
      .then((resp) => {
        //console.log(resp.data.data)
        this.table.orders = resp.data.data
        this.loading = false
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
