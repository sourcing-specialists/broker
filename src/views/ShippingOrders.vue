<template>
  <v-container fluid>
    <PageHeader :title="$t('shipping')" :subheader="''" />
    <v-card class="pa-5">
      <v-data-table
        :loading="loading"
        :headers="table_headers"
        :items="shipping_orders"
        :search="search"
      >
        <template v-slot:top>
          <v-text-field
            append-icon="mdi-magnify"
            v-model="search"
            :label="$t('search')"
          ></v-text-field>
        </template>
        <template v-slot:[`item.type`]="{ item }">
          <v-icon v-if="item.type === 'port'">mdi-ferry</v-icon>
          <v-icon v-if="item.type === 'airport'">mdi-airplane</v-icon>
        </template>
        <template v-slot:[`item.cargos`]="{ item }">
          <v-chip-group
            column
          >
            <v-tooltip
              right
              color="rgba(255, 255, 255, 1)"
              v-for="cargo in item.cargos"
              :key="cargo.id"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  v-bind="attrs"
                  v-on="on"
                  dark
                  small
                  color="blue-grey lighten-1"
                >{{ cargo.capacity }}</v-chip>
              </template>
              <v-card flat>
                <v-card-title>
                  <strong class="mr-1">{{ $t('orders.container_number') }}:</strong> {{ cargo.container_number }}
                </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="[
                      { text: $tc('order', 1), align: 'start', sortable: true, value: 'order_sku' },
                      { text: $t('product_name'), align: 'start', sortable: true, value: 'name' },
                      { text: $t('quantity'), align: 'start', sortable: true, value: 'quantity' },
                      { text: $t('cbm'), align: 'start', sortable: true, value: 'total_cbm' },
                    ]"
                    :items="cargo.products"
                    hide-default-footer
                  >
                    <template v-slot:[`item.name`]="{ item }">
                      <h4>{{ item.name }} - <strong class="mColor-text">{{ item.option.key }}:</strong> {{ item.option.value }}</h4>
                      <div
                        class="text-caption"
                        v-if="item.attributes.length > 0"
                      >
                        <span
                          class="pr-3"
                          v-for="attr in item.attributes"
                          :key="attr.key"
                        ><strong>{{ attr.key }}:</strong> {{ attr.value }}</span>
                      </div> 
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-tooltip>
          </v-chip-group>
        </template>
        <template v-slot:[`item.departure_date`]="{ item }">
          {{ formatDate(item.departure_date) }}
        </template>
        <template v-slot:[`item.arrival_date`]="{ item }">
          {{ formatDate(item.arrival_date) }}
        </template>
        <template v-slot:[`item.order_status`]="{ item }">
          <v-chip
            v-if="item.order_status === 'on the way'"
            dark
            color="green"
            small
          >{{ $t('orders.on_the_way') }}</v-chip>
          <v-chip
            v-if="item.order_status === 'arrived'"
            dark
            color="secondary"
            small
          >{{ $t('orders.arrived') }}</v-chip>
          <v-chip
            v-if="item.order_status === 'waiting for departure'"
            dark
            color="indigo"
            small
          >{{ $t('orders.waiting_for_departure') }}</v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="false"
            fab
            color="indigo"
            dark
            small
            @click="openDialog(item, 'contents')"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            fab
            color="primary"
            dark
            small
            @click="openDialog(item, 'files')"
          >
            <v-icon>mdi-file-search-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="720"
    >
      <v-card>
        <v-data-table
          :headers="documentsHeader"
          :items="modalItem.documents"
        >
          <template v-slot:[`item.file`]="{ item }">
            <v-btn
              fab
              color="primary"
              dark
              target="_black"
              :href="item.url"
              small
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogContents"
      max-width="720"
    >
      <v-card>
        <v-card-text
          v-for="cargo in modalItem.cargos"
          :key="cargo.id"
        >
          
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PageHeader from '../components/PageHeader'

export default {
  name: 'Orders',
  components: {
    PageHeader
  },
  data() {
    return {
      loading: true,
      table_headers: [
        { text: this.$t('ref'), align: 'start', sortable: true, value: 'id' },
        { text: this.$t('orders.transportation'), align: 'start', sortable: true, value: 'type' },
        { text: this.$t('orders.cargos'), align: 'start', sortable: false, value: 'cargos' },
        { text: this.$tc('order', 2), align: 'start', sortable: false, searchable: true, value: 'order_numbers' },
        { text: this.$t('orders.bl_number'), align: 'start', sortable: true, value: 'bl_number' },
        { text: this.$t('origin'), align: 'start', sortable: true, value: 'origin_name' },
        { text: this.$t('destination'), align: 'start', sortable: true, value: 'destination_name' },
        { text: this.$t('orders.departure_date'), align: 'start', sortable: true, value: 'departure_date' },
        { text: this.$t('orders.arrival_date'), align: 'start', sortable: true, value: 'arrival_date' },
        { text: this.$t('status'), align: 'start', sortable: true, value: 'order_status' },
        { text: '', align: 'end', value: 'actions' }
      ],
      documentsHeader: [
        { text: this.$t('orders.transportation'), align: 'start', sortable: true, value: 'key_id' },
        { text: this.$t('orders.notes'), align: 'start', sortable: true, value: 'description' },
        { text: '', align: 'end', sortable: true, value: 'file' },
      ],
      modalItem: '',
      shipping_orders: [],
      dialog: false,
      dialogContents: false,
      search: ''
    }
  },
  methods: {
    loadShippingOrders() {
      this.loading = true
      this.$http.get(this.endpoint('shipping_orders/get'))
      .then(resp => {
        //console.log(resp.data.data.records)
        var so = resp.data.data.records
        for(var i in so) {
          var orders = ''
          for(var io in so[i].orders) {
            orders += so[i].orders[io].sku + ', '
          }
          so[i].order_numbers = orders.replace(/,\s*$/, "")
        }
        this.shipping_orders = so
        //console.log(this.shipping_orders)
        this.loading = false
      })
    },
    openDialog(item, type) {
      this.modalItem = item
      if(type === 'files') {
        this.dialog = true
      }
      if(type === 'contents') {
        this.dialogContents = true
      }
    }
  },
  mounted() {
    this.loadShippingOrders()
  }
}

</script>

