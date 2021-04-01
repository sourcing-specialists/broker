<template>
  <v-data-table
    v-if="inspections.length > 0"
    :headers="tableHeaders"
    :items="inspections"
    :hide-default-footer="true"
  >
    <template v-slot:[`item.inspector_photo`]="{ item }">
      <div class="image-container">
        <v-img
          :src="hasPhoto(item.inspector_photo)"
        >
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
        </v-img>
      </div>
    </template>
    <template v-slot:[`item.pass`]="{ item }">
      <v-chip
        class="ma-2"
        :color="item.pass === 1 ? 'green' : 'default'"
        :text-color="item.pass === 1 ? 'white' : 'default'"
      >
        {{ item.pass === 1 ? $t('orders.pass') : $t('orders.pending') }}
      </v-chip>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        v-if="item.inspection_file !== null"
        :color="$store.getters.vColor"
        :href="hasFileUrl(item.inspection_file)"
        target="_blank"
        dark
        fab
        elevation="1"
        x-small
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </template>
  </v-data-table>
  <div v-else>{{ $t('orders.no_inspections') }}</div>
</template>
<script>
import notFound from '../../assets/images/not-found.png'

export default {
  name: 'OrderPayments',
  props: ['order-id'],
  data() {
    return {
      tableHeaders: [
        { text: '', align: 'center', sortable: true, value: 'inspector_photo' },
        { text: this.$t('orders.inspector'), align: 'start', sortable: true, value: 'inspector_name' },
        { text: this.$t('orders.date'), align: 'start', sortable: true, value: 'date' },
        { text: this.$t('orders.result'), align: 'start', sortable: true, value: 'pass' },
        { text: '', align: 'end', sortable: false, value: 'actions' },
      ],
      inspections: []
    }
  },
  methods: {
    hasFileUrl(file) {
      if(file !== null) {
        return file.url
      }
      return ''
    },
    hasPhoto(image) {
      if(image === null || image.thumb === '') {
        return notFound
      }
      return image.thumb
    }
  },
  mounted() {
    this.$http.get(this.endpoint(`order/${this.orderId}/inspections/list`))
    .then(resp => {
      console.log(resp.data.data)
      if(resp.data.result === true) {
        this.inspections = resp.data.data
      }
    })
  }
}
</script>

<style scoped>
.image-container {
  width: 75px;
  border-radius: 100%;
  overflow: hidden;
  border: 2px solid #CCC;
  margin: 10px auto;
}
</style>