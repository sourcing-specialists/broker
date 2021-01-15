<template>
  <v-container fluid>
    <PageHeader 
      :title="!this.id ? 'Create new company' : `Editing company`"
      :subheader="!this.id ? 'Add a new company to later place orders.' : ''"
    />
    <v-row>
      <v-col
        lg="6"
        md="6"
        sm="12"
      >
        <CompanyDetailsForm :id="id" />
      </v-col>
      <v-col
        lg="6"
        md="6"
        sm="12"
      >
        <CompanyUsersList v-if="id" :id="id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import CompanyDetailsForm from '@/components/companies/CompanyDetailsForm'
import CompanyUsersList from '@/components/companies/CompanyUsersList'

export default {
  name: 'Companies',
  props: ['id'],
  data: () => {
    return {
      
    }
  },
  components: {
    PageHeader,
    CompanyDetailsForm,
    CompanyUsersList
  },
}
</script>
