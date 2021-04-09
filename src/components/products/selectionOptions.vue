<template>
  <div
    :class="['wrapper', { hidden: !value }]"
    elevation="2"
  >
    <v-sheet
      class="rounded"
      elevation="10"
      width="100%"
    >
      <ul>
        <li
          class="counter"
          :style="{ backgroundColor: hexColor }"
        >
          <h3 color="white">{{ selected.length }}</h3>
        </li>
        <li>
          <v-menu
            offset-y
            top
            v-model="newList"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                x-large
                class="activators"
              >
                <v-icon>fa-folder</v-icon> {{ $t('components.products.new_catalogue') }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-form
                  ref="newListForm"
                >
                  <v-text-field
                    label="New list name"
                    v-model="newListName"
                    ref="newListNameField"
                    required
                    autofocus
                    :rules="requiredRules"
                  >
                    <template v-slot:append-outer>
                      <v-btn
                        :color="vColor"
                        elevation="2"
                        dark
                        @click="addNewList"
                      >{{ $t('components.products.add') }}</v-btn>
                    </template>
                  </v-text-field>
                </v-form>
              </v-list-item>
            </v-list>
          </v-menu>
        </li>
        <li>
          <v-menu
            offset-y
            top
            v-model="existingList"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ attrs }">
              <v-btn
                v-bind="attrs"
                v-on="{
                  'click': loadExistingLists
                }"
                x-large
                class="activators"
              >
                <v-icon>fa-folder-plus</v-icon> {{ $t('components.products.add_to_existing_catalogue') }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-text-field
                  v-model="optionsSearch"
                  :label="$t('search')"
                  append-icon="mdi-magnify"
                  @keyup="filterSearch"
                ></v-text-field>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                v-for="list in lists"
                :key="list.id"
                @click="addToExistingList(list.id)"
                v-show="list.inSearch"
              >
                <v-list-item-title>{{ list.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </li>
        <li
          @click="hide()"
        >
          <v-btn
            @click="hide()"
            x-large
          >
            <v-icon>fa-times</v-icon>
          </v-btn>
        </li>
      </ul>
    </v-sheet>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: ['value'],
  data() {
    return {
      newList: false,
      existingList: false,
      newListName: '',
      requiredRules: [
        v => !!v || 'This field is required',
      ],
      lists: [],
      optionsSearch: '',
    }
  },
  computed: {
    ...mapGetters([
      'selected',
      'vColor',
      'hexColor'
    ]),
  },
  methods: {
    filterSearch() {
      this.lists.map( l => {
        if(!l.name.toLowerCase().includes(this.optionsSearch.toLowerCase())) {
          l.inSearch = false
        } else {
          l.inSearch = true
        }
      })
    },
    ...mapMutations([
      'clearSelected'
    ]),
    hide() {
      this.$emit('input', false)
    },
    addNewList() {
      if(this.$refs.newListForm.validate()) {
        if(this.selected.length === 0) {
          this.$toasted.error('You need to select at least 1 product.')
          return
        }
        this.$http.post(this.endpoint('my_catalogues/create'), {
          name: this.newListName,
          share: 1,
          prices: 1,
          products: this.selected
        }).then( resp => {
          if(resp.data.result === true) {
            this.$toasted.success(`List "${this.newListName}" created successfully`)
            this.newList = false
            this.newListName = ''
            this.clearSelected()
            this.hide()
          }
        })
      }
    },
    loadExistingLists() {
      this.$http.get(this.endpoint('my_catalogues'))
      .then( resp => {
        this.lists = resp.data.data.adminCatalogues.map( ac => {
          ac.inSearch = true
          return ac
        })
        this.existingList = true
      })
    },
    addToExistingList(id) {
      const current = this.lists.find( l => l.id === id)
      this.$http.post(this.endpoint(`my_catalogues/${id}/update`), {
        name: current.name,
        prices: current.display_price,
        share: current.share,
        status: 1,
        products: this.selected,
        action: 'merge'
      }).then( resp => {
        if(resp.data.result === true) {
          this.$toasted.success(`Items added successfully to "${current.name}"`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .wrapper {
    z-index: 5;
    position: fixed;
    bottom: 25px;
    opacity: 1;
    border-radius: 3px;
    transition: all ease-in-out 0.3s;
    left: 50%;
    transform: translateX(-50%);
    .activators {
      i {
        margin-right: 10px;
      }
    }
    &.hidden {
      bottom: -100px;
      opacity: 0;
    }
    ul {
      display: flex;
      align-items: center;
      li.counter {
        padding: 16px 18px;
        h3 {
          color: #FFF;
        }
      }
    }
  }
</style>