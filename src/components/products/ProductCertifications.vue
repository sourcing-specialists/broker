<template>
  <v-card>
    <v-card-title>
      {{ $t('components.products.certificates') }}
    </v-card-title>
    <v-card-subtitle>{{ product.name }}</v-card-subtitle>

    <v-card-text>
      <v-data-table
        :headers="tableHeaders"
        :items="certifications"
        :hide-default-footer="true"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            :color="$store.getters.vColor"
            :href="item.original"
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
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'productCertifications',
  props: ['product', 'certifications'],
  data() {
    return {
      tableHeaders: [
        { text: this.$t('ref'), align: 'start', sortable: true, value: 'id' },
        { text: this.$t('components.products.certificate_name'), align: 'start', sortable: true, value: 'name' },
        { text: '', align: 'end', value: 'actions' }
      ]
    }
  },
  mounted() {
    console.log(this.certifications)
  }
}
</script>