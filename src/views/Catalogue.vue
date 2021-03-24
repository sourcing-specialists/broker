<template>
    <v-container fluid>
      <PageHeader :title="title" :subheader="subheader" />
      <v-card class="pa-5">
        <ProductsList />
      </v-card>
    </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import ProductsList from '@/components/products/ProductsList.vue'

export default {
  name: 'Catalogue',
  data: function() {
    return {
      title: this.$t('catalogue'),
      subheader: this.$t('views.catalogue.catalogue_subheader')
    }
  },
  components: {
    PageHeader,
    ProductsList
  }
}
</script>
