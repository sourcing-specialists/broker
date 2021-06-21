<template>
  <v-card
    class="mt-3 pa-3"
    outlined
  >
    <v-text-field
      :label="$t('search_categories')"
      outlined
      dense
      v-model="search"
    ></v-text-field>
    <v-treeview
      v-model="categoriesSelected"
      :items="categories"
      :search="search"
      selectable
      dense
    ></v-treeview>
  </v-card>
</template>

<script>

export default {
  name: 'categoriesTree',
  props: ['listIncoterm', 'selectedCategories'],
  data() {
    return {
      loading: true,
      search: '',
      categoriesSelected: this.selectedCategories,
      categories: []
    }
  },
  watch: {
    categoriesSelected: function(val) {
      this.$emit('categoriesChanged', val)
    },
  },
  methods: {
    loadCategories() {
      this.loading = true
      this.categories = []

      return new Promise((resolve/*, reject*/) => {
        this.$http.get(this.endpoint(`category/get`), {
          params: {
            incoterm: this.listIncoterm
          }
        }).then( resp => {
          if(resp.data.result == true) {
            var newCats = []
            resp.data.data.map( c => {
              if(c.parent_name === undefined) {
                c.name = c.header
                c.children = []
                newCats.push(c)
              } else {
                var ind = newCats.findIndex(parent_c => parent_c.id === c.group)
                newCats[ind].children.push(c)
              }
            })
            this.categories = newCats
            resolve()
          }
          this.loading = false
        })
      })
    }
  },
  mounted() {
    this.loadCategories()
  }
}
</script>
