<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
    <orders-list
      type="quotations"
    ></orders-list>
  </v-container>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import ordersList from '../../components/orders/ordersList'

export default {
  name: 'Orders',
  components: {
    PageHeader, ordersList
  },
  data() {
    return {
      title: this.$t('quotations'),
      subheader: '',
    }
  }
}

</script>

<style scoped>
.order-notes {
  font-size: 11px;
  font-style: italic !important;
}
</style>

