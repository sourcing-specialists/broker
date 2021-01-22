<template>
  <v-autocomplete
    v-model="categoriesSelected"
    :items="categories"
    chips
    label="Categories"
    item-text="name"
    item-value="id"
    multiple
  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="remove(data.item)"
      >
        {{ data.item.name }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.name"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.parent_name"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
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
    remove (item) {
      const index = this.categoriesSelected.indexOf(item.id)
      if (index >= 0) this.categoriesSelected.splice(index, 1)
    },
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
  watch: {
    categoriesSelected: function(val) {
      this.$emit('categoriesChanged', val)
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