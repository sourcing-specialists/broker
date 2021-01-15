<template>
  <v-select
    v-model="categoriesSelected"
    label="Filter by Category"
    :items="categories"
    :loading="loading"
    @change="$emit('categoriesChanged', categoriesSelected)"
    clearable
    multiple
  >
  </v-select>
</template>
<script>
export default {
  name: 'CategoriesSelection',
  data() {
    return {
      categories: [],
      categoriesSelected: [],
      loading: true
    }
  },
  methods: {
    loadCategories() {
      return new Promise((resolve/*, reject*/) => {
        this.$http.get(this.endpoint(`category/get`))
          .then( resp => {
            if(resp.data.result == true) {
              resp.data.data.map(function(c) {
                c.value = c.id
                c.text = c.name
              })
              this.categories = resp.data.data
              resolve()
            }
          })
      })
    }
  },
  beforeMount() {
    this.loadCategories()
      .then(() => {
        this.loading = false
      })
  }
}
</script>