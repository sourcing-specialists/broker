<template>
    <v-container fluid>
      <PageHeader :title="$t('custom_lists')" />
      <v-card>
        <v-alert v-if="lists.length === 0" type="warning">
          {{ $t('views.lists.no_lists_text') }}
        </v-alert>
        <ul>
          <li
            v-for="(list, index) in lists"
            :key="`list_${list.id}`"
          >
            <v-card
              flat
              :loading="list.isLoading"
            >
              <v-list
                class="custom_list"
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <editable-text-field
                        v-model="list.name"
                        :editable="list.show_products"
                      ></editable-text-field>
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ list.cnt }} {{ $tc('product', list.cnt) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  class="actions"
                >
                  <v-tooltip
                    bottom
                    v-if="list.show_products"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="green"
                        v-bind="attrs"
                        v-on="on"
                        fab
                        @click="saveList(list.id)"
                      >
                        <v-icon>fa-save</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('save_changes') }}</span>
                  </v-tooltip>
                  <v-tooltip
                    bottom
                    v-if="list.show_products"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-checkbox
                        v-bind="attrs"
                        v-on="on"
                        v-model="list.display_price"
                        color="red darken-4"
                        :label="$t('show_prices')"
                      ></v-checkbox>
                    </template>
                    <span>{{ $t('show_hide_price') }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        fab
                        @click="openList(list.id)"
                      >
                        <v-icon v-if="!list.show_products">fa-eye</v-icon>
                        <v-icon v-else>fa-eye-slash</v-icon>
                      </v-btn>
                    </template>
                    <span v-if="!list.show_products">{{ $t('views.lists.show_products') }}</span>
                    <span v-else>{{ $tc('views.lists.hide_product', list.products.length) }}</span>
                  </v-tooltip>
                  <v-menu
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dark
                        color="secondary"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon dark>
                          fa-ellipsis-v
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-btn
                          :href="`/public/catalogue/download/${list.id}`"
                          target="_blank"
                        >{{ $t('views.lists.download_list') }}</v-btn>
                      </v-list-item>
                      <v-list-item>
                        <v-btn
                          @click="deleteList(list.id)"
                        >{{ $t('views.lists.delete_list') }}</v-btn>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </v-list>
              <v-list
                class="custom_list_products"
                v-if="list.show_products === true"
                dense
              >
                <div
                  class="delete-items"
                  v-if="list.checked.length > 0"
                >
                  {{ list.checked.length }} {{ $tc('item_selected', list.checked.length)}} - 
                  <a color="red" @click.prevent="removeItems(list.id)">{{ $t('delete') }}</a>
                </div>
                <draggable
                  v-model="list.products"
                  :disabled="list.checked.length > 0"
                  ghost-class="ghost"
                  handle=".mover"
                >
                  <transition-group>
                    <v-list-item
                      class="custom_list_products-each"
                      v-for="product in list.products"
                      :key="`product_${product.id}`"
                    >
                      <v-list-item-action>
                        <v-checkbox v-model="list.checked" :value="product.id"></v-checkbox>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>{{ product.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ product.options.length }} {{ $tc('option', product.options.length) }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn
                          x-small
                          fab
                          :disabled="list.checked.length > 0"
                          inline-block
                        ><v-icon class="mover">fa-arrows-alt</v-icon></v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </transition-group>
                </draggable>
              </v-list>
            </v-card>
            <v-divider
              v-if="index < lists.length - 1"
              :key="index"
            ></v-divider>
          </li>
        </ul>
      </v-card>
    </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import draggable from 'vuedraggable'
import EditableTextField from '../components/EditableTextField'

export default {
  name: 'CustomLists',
  data() {
    return {
      lists: []
    }
  },
  components: {
    PageHeader,
    draggable,
    EditableTextField
  },
  methods: {
    saveList(list_id) {
      const list = this.lists.find(l => l.id === list_id)
      const products = list.products.map( p => {
        return p.id
      }) 
      this.$http.post(this.endpoint(`my_catalogues/${list_id}/update`),{
        name: list.name,
        prices: list.display_price ? 1 : 0,
        share: list.share,
        status: 1,
        products: products,
        action: 'replace'
      }).then( () => {
        this.$toasted.success(this.$t('views.lists.list_updated'))
        this.listReload(list_id)
      })
    },
    listReload(list_id) {
      const list = this.lists.find(l => l.id === list_id)
      list.checked = []
      list.isLoading = true
      this.getList(list_id)
      .then( data => {
        list.cnt = data.catalogue.products.length
        list.products = data.catalogue.products
        list.isLoading = false
      })
    },
    openList(id) {
      const getCurrent = this.lists.find(l => l.id === id)
      if(getCurrent.products.length > 0 || getCurrent.cnt === 0) {
        getCurrent.show_products = !getCurrent.show_products
      } else {
        getCurrent.isLoading = true
        this.getList(id)
        .then( data => {
          getCurrent.show_products = true
          getCurrent.products = data.catalogue.products
          getCurrent.isLoading = false
        })
      }
    },
    getList(id) {
      return new Promise((resolve) => {
        this.$http.get(this.endpoint(`my_catalogues/${id}`))
        .then( resp => {
          resolve(resp.data.data)
        })
      })
    },
    deleteList(list_id) {
      if(confirm(this.$t('delete_question'))) {
        this.$http.post(this.endpoint(`my_catalogues/${list_id}/update`),{
          status: 0,
        }).then( () => {
          this.$toasted.success(this.$t('views.lists.list_removed'))
          this.lists = this.lists.filter(l => l.id !== list_id)
        })
      }
    },
    loadLists() {
      this.$http.get(this.endpoint('my_catalogues'))
      .then( resp => {
        this.lists = resp.data.data.adminCatalogues.map( l => {
          l.products = []
          l.show_products = false
          l.isLoading = false
          l.checked = []
          return l
        })
      })
    },
    removeItems(list_id) {
      const list = this.lists.find(l => l.id === list_id)

      this.$http.post(this.endpoint(`my_catalogues/${list_id}/update`),{
        name: list.name,
        prices: list.display_price,
        share: list.share,
        status: 1,
        products: list.checked,
        action: 'remove'
      }).then( () => {
        this.$toasted.success(this.$tc('item_removed', list.checked.length, { qty: list.checked.length }))
        this.listReload(list_id)
      })
    }
  },
  beforeMount() {
    this.loadLists()
  }
}
</script>

<style lang="scss">
.custom_list {
  display: flex;
  align-items: center;
  .actions {
    display: flex;
    justify-content: flex-end;
  }
}
.custom_list_products {
  position: relative;
  .delete-items {
    position: absolute;
    z-index: 2;
    top: -10px;
    left: 15px;
  }
}
.custom_list_products-each {
  background-color: #FFF;
  &:hover {
    background-color: #E2E2E2;
  }
}
.ghost {
  opacity: 0.5;
  background: #E2E2E2;
}
</style>
