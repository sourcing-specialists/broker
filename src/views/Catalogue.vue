<template>
    <v-container fluid>
      <PageHeader :title="title" :subheader="subheader" />
      <v-card>
        <ProductsList />
      </v-card>
    </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import ProductsList from '@/components/products/ProductsList.vue'

export default {
  name: 'Catalogue',
  data() {
    return {
      title: 'Catalogue',
      subheader: 'Full list of products available. Please note that prices are filterd according to the delivery date.'
    }
  },
  components: {
    PageHeader,
    ProductsList
  }
}
</script>
