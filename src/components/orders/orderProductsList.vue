<template>
  <div>
    <v-data-table
      :search="table.search"
      :headers="table.headers"
      :items="products"
      :items-per-page="10"
      :hide-default-footer="isPreview"
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
      <template v-slot:[`item.quantity`]="{ item }">
        <h4>{{ item.quantity }} {{ $tc('carton', item.quantity) }}</h4>
        <p class="pa-0 mb-0">{{ item.total_units }} {{ unit(item) }}</p>
      </template>
      <template v-slot:[`item.total_price_string`]="{ item }">
        <h4>{{ item.total_price_string }}</h4>
        <p class="pa-0 mb-0">{{ item.unit_price_string }} {{ unit(item, 1) }}</p> 
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          v-if="canEdit"
          :color="$store.getters.vColor"
          @click="editProduct(item.id)"
          fab
          dark
          x-small
          elevation="1"
        ><v-icon>mdi-pencil</v-icon></v-btn>
      </template>
      <template v-if="isPreview === false" v-slot:[`body.append`]>
        <tr>
          <td colspan="3"></td>
          <td>{{ round(order.total_cbm) }}</td>
          <td>
            <h4 class="text-right">{{ order.total }}</h4>
          </td>
          <td></td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog
      v-model="productEditDialog"
      max-width="720"
    >
      <order-product-edit
        v-if="productEditDialog"
        :order="order"
        :product="editingProduct"
        :can-modify="canModify"
        v-on="$listeners"
        @productDeleted="productEditDialog = false"
      ></order-product-edit>
    </v-dialog>
  </div>
</template>
<script>
import orderProductEdit from './orderProductEdit'

export default {
  name: 'OrderProductsList',
  components: {
    orderProductEdit
  },
  props: {
    order: {
      default: {}
    },
    products: {
      default: []
    },
    edit: {//define if should display the edit buttons or not
      default: null
    },
    isPreview: {
      default: false
    },
    canModify: {//define if the order is paid or not to allow any change
      default: false
    }
  },
  data() {
    return {
      table: {
        search: '',
        headers: [
          { text: this.$t('ref'), align: 'start', sortable: true, value: 'ref' },
          { text: this.$t('product_name'), align: 'start', sortable: true, value: 'name' },
          { text: this.$t('quantity'), align: 'start', sortable: true, value: 'quantity' },
          { text: this.$t('cbm'), align: 'start', sortable: true, value: 'total_cbm' },
          { text: this.$t('price'), align: 'end', value: 'total_price_string' },
          { text: '', align: 'end', value: 'actions' }
        ],
      },
      productEditDialog: false,
      editingProduct: {}
    }
  },
  computed: {
    canEdit() {
      return this.edit === null ? false : true
    }
  },
  methods: {
    unit(item, q = 0) {
      const qty = q === 0 ? item.total_units : q
      const unitDescription = item.is_tree === 1 ? item.packing_base_unit_description : this.$tc('components.products.unit', qty)
      return `${unitDescription}`
    },
    editProduct(pid) {
      const prod = this.products.find( p => p.id === pid)
      this.editingProduct = prod
      this.productEditDialog = true
    }
  }
}
</script>