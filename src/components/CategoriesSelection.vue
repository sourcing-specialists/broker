<template>
  <v-autocomplete
    v-model="categoriesSelected"
    :items="categories"
    :label="$t('categories')"
    item-text="name"
    item-value="id"
    multiple
  >
    <template v-slot:selection="data">
      <v-chip
        v-if="data.index === 0"
        style="padding: 10px;"
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="remove(data.item, data)"
      >
        {{ data.item.name }}
      </v-chip>
      <span
        v-if="data.index === 1"
        class="grey--text caption"
      >
        (+{{ categoriesSelected.length - 1 }} others)
      </span>
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
import { mapGetters } from 'vuex'
export default {
  name: 'CategoriesSelection',
  data: function() {
    return {
      categories: [],
      categoriesSelected: [],
      loading: true
    }
  },
  computed: {
    ...mapGetters([
      'getIncoterm',
      'cargo'
    ])
  },
  methods: {
    remove (item) {
      const index = this.categoriesSelected.indexOf(item.id)
      if (index >= 0) this.categoriesSelected.splice(index, 1)
    },
    loadCategories() {
      this.categories = []
      this.categoriesSelected = []
      return new Promise((resolve/*, reject*/) => {
        this.$http.get(this.endpoint(`category/get`), {
          params: {
            incoterm: this.getIncoterm,
            cargo_id: this.cargo.id !== undefined ? this.cargo.id : ''
          }
        }).then( resp => {
          if(resp.data.result == true) {
            resp.data.data.map(function(c) {
              c.value = c.id
              c.text = c.name
            })
            //console.log(resp.data.data)
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
    },
    getIncoterm: function() {//reset on incoterm change
      this.loadCategories()
    },
    cargo: function() {//reset on cargo change
      this.loadCategories()
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