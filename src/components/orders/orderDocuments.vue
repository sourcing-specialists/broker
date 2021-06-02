<template>
  <v-container>
    <loader v-model="loading"></loader>
    <v-data-table
      v-if="files.length > 0"
      :headers="tableHeaders"
      :items="files"
      :hide-default-footer="true"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          fab
          dark
          elevation="1"
          :color="$store.getters.vColor"
          :href="item.original"
          target="_blank"
          x-small
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import loader from '../loadingBox'

export default {
  name: 'orderDocuments',
  props: ['order-id'],
  components: { loader },
  data() {
    return {
      tableHeaders: [
        { text: this.$t('name'), align: 'start', sortable: true, value: 'title' },
        { text: '', align: 'end', sortable: false, value: 'actions' },
      ],
      loading: true,
      files: []
    }
  },
  methods: {
    loadDocuments() {
      this.loading = true
      this.$http.get(this.endpoint(`order/${this.orderId}/documents/list`))
      .then( resp => {
        console.log(resp.data.data)
        this.files = resp.data.data
        this.loading = false
      })
    }
  },
  mounted() {
    this.loadDocuments()
  }
}
</script>
