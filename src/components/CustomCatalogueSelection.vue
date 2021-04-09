<template>
  <v-autocomplete
    v-model="catalogue"
    :label="$t('custom_lists')"
    :items="catalogues"
    :loading="loading"
    item-text="name"
    item-value="id"
    clearable
    @change="$emit('input', catalogue)"
    @focus="loadCatalogues()"
    open-on-clear
  >
  </v-autocomplete>
</template>
<script>
export default {
  name: 'CustomCatalogueSelection',
  props: ['value'],
  data() {
    return {
      catalogues: [],
      catalogue: null,
      loading: true
    }
  },
  computed: {
    inOrders() {
      return (this.$router.currentRoute.name == 'OrdersNew') ? true : false
    }
  },
  methods: {
    loadCatalogues() {
      return new Promise((resolve/*, reject*/) => {
        this.$http.get(this.endpoint(`my_catalogues`))
          .then( resp => {
            if(resp.data.result == true) {
              this.catalogues = resp.data.data.adminCatalogues
              resolve()
            }
          })
      })
    }
  },
  beforeMount() {
    var vue = this
    this.loadCatalogues()
    .then( () => {
      vue.loading = false
    })
  }
}
</script>