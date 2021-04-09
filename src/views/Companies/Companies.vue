<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    {{ $store.getters.getIncoterm }}
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
      v-if="table.companies.length == 0"
    />
    <v-data-table
      v-if="table.companies.length > 0"
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
  data: () => {
    return {
      title: 'Companies',
      subheader: 'Manage companies and users',
      table: {
        headers: [
          { text: 'ID', align: 'start', sortable: true, value: 'id' },
          { text: 'Company', align: 'start', sortable: true, value: 'name' },
          { text: 'BR Number', align: 'start', sortable: true, value: 'br_number' },
          { text: 'Zone', align: 'start', sortable: true, value: 'zone' },
          { text: '', align: 'end', value: 'actions' }
        ],
        companies: [],
        search: ''
      }
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
    })
  }
}
</script>
