<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    <router-link :to="{ name: 'createCompany' }">
      <v-btn
        class="ma-2 add_button"
        :color="$store.getters.vColor"
        elevation="2"
        fab
        >
          <span class="white--text"><v-icon>mdi-plus</v-icon></span>
        </v-btn>
    </router-link>
    <v-skeleton-loader
      class="mx-auto"
      type="table"
      v-if="loading"
    />
    <v-data-table
      v-if="!loading"
      :search="table.search"
      :headers="table.headers"
      :items="table.companies"
      :items-per-page="10"
      class="elevation-1 pa-8"
    >
      <template v-slot:top>
        <v-text-field
          append-icon="mdi-magnify"
          v-model="table.search"
          label="Search"
        ></v-text-field>
      </template>
      <template v-slot:[`item.zone`]="{ item }">
        {{ item.zone.name }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          class="ma-2"
          x-small
          fab
          elevation="2"
          :color="$store.getters.vColor"
          @click="$router.push({ name: 'editCompany', params: { id: item.id }})"
        >
          <span class="white--text"><v-icon>mdi-pencil</v-icon></span>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'Companies',
  data() {
    return {
      title: this.$t('views.companies.companies'),
      subheader: this.$t('views.companies.subtitle'),
      table: {
        headers: [
          { text: 'ID', align: 'start', sortable: true, value: 'id' },
          { text: this.$t('company'), align: 'start', sortable: true, value: 'name' },
          { text: this.$t('views.companies.br_number'), align: 'start', sortable: true, value: 'br_number' },
          { text: this.$t('views.companies.zone'), align: 'start', sortable: true, value: 'zone' },
          { text: '', align: 'end', value: 'actions' }
        ],
        companies: [],
        search: '',
      },
      loading: true
    }
  },
  components: {
    PageHeader
  },
  mounted() {
    this.$http.get(this.endpoint('customer/get'))
    .then( resp => {
      //console.log(resp)
      this.table.companies = resp.data.data
      this.loading = false
    })
  }
}
</script>
