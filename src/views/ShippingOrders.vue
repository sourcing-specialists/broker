<template>
  <v-container fluid>
    <PageHeader :title="title" :subheader="subheader" />
  </v-container>
</template>

<script>
import PageHeader from '../components/PageHeader'


export default {
  name: 'Orders',
  components: {
    PageHeader
  },
  data() {
    return {
      title: this.$t('shipping'),
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

