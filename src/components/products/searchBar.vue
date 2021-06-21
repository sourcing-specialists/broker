<template>
  <ais-instant-search :search-client="searchClient" index-name="products">
    <ais-autocomplete>
      <div class="search" slot="default" slot-scope="{ currentRefinement, indices, refine }">
        <v-text-field
          type="search"
          :value="currentRefinement"
          append-icon="mdi-magnify"
          :label="$t('search')"
          v-model="search"
          clearable
          class="d-block"
          @input="refine(search)"
          @keydown="aNav($event, indices)"
          @click:clear="clear()"
        ></v-text-field>

        <ais-hits v-if="currentRefinement && displayResults">
          <v-card
            slot-scope="{ items }"
            class="search-results pa-5"
          >
            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="item.objectID"
                :class="[{ active: currentActive === index }, 'result-item']"
                @click="goSearch(item)"
              >
                <v-list-item-avatar>
                  <v-img v-if="item.image !== null" :src="item.image"></v-img>
                  <v-icon v-else>mdi-image</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    <strong><ais-highlight :attribute="`name_${$store.getters.getLanguage}`" :hit="item"/></strong>
                  </v-list-item-title>
                  <v-list-item-subtitle><ais-highlight attribute="ref" :hit="item"/></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </ais-hits>
      </div>
    </ais-autocomplete>
  </ais-instant-search>
</template>

<script>

import Vue from 'vue'
import InstantSearch from 'vue-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

//searching tool
Vue.use(InstantSearch);

export default {
  name: 'searchBar',
  props: ['value'],
  data() {
    return {
      displayResults: true,
      search: '',
      currentActive: 0,
      qty: 0,
      searchClient: instantMeiliSearch(
        process.env.VUE_APP_MEILISEARCH_HOST,
        process.env.VUE_APP_MEILISEARCH_KEY
      )
    }
  },
  computed: {
    resultsLength() {
      return this.indices[0].hits.length
    }
  },
  watch: {
    search() {
      this.currentActive = 0
      this.displayResults = true
    }
  },
  methods: {
    aNav(e, indices) {
      var length = indices[0].hits.length
      if(e.keyCode === 40) {
        if(this.currentActive > length-1) {
          this.currentActive = 0
        } else {
          this.currentActive++
        }
      }
      if(e.keyCode === 38) {
        if(this.currentActive < 0) {
          this.currentActive = length-1
        } else {
          this.currentActive--
        }
      }
      if(e.keyCode === 13) {
        this.goSearch(indices[0].hits[this.currentActive])
      }
    },
    clear() {
      this.$emit('input', null)
    },
    goSearch(hit) {
      this.search = this.search !== '' ? hit[`name_${this.$store.getters.getLanguage}`] : this.search
      this.$emit('input', this.search)
      this.$nextTick(function() {
        this.displayResults = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search {
  position: relative;
  .search-results {
    margin: 0px;
    position: absolute;
    top: calc(100% - 15px);
    z-index: 2;
    width: 100%;
    max-height: 250px;
    overflow-y: scroll;
    .result-item {
      &:hover {
        cursor: pointer;
        background-color: #E2E2E2;
      }
    }
    .active {
      background-color: #CCC;
    }
  }
}
</style>
