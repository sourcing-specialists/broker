<template>
  <div>
    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on, attrs }">

        <v-btn
          dark
          color="secondary"
          v-bind="attrs"
          v-on="on"
        >
          <span class="font-weight-bold mr-2">{{ $store.getters.getLanguage }} </span>
          <v-icon dark>
            fa-globe-americas
          </v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="lang in languages"
          :key="lang.code"
          @click="changeLocale(lang.code)"
        >
          <v-list-item-title>{{ lang.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { getLanguages } from '../endpoints'

export default {
  name: 'Currencies',
  data() {
    return {
      loading: true,
      language: this.$store.getters.getCurrency,
      languages: []
    }
  },
  methods: {
    changeLocale(lang) {
      this.$store.commit('languageChange', lang)
      this.$emit('languageChange')
      this.$i18n.locale = lang
    }
  },
  mounted() {
    getLanguages()
    .then( languages => {
      this.languages = languages
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
.currency-select {
  max-width: 100px;
  padding: 0px !important;
  margin: 0px !important;
  div {
    background: none;
    padding: 0px !important;
    margin: 0px !important;
  }
  .v-input__slot {
    background-color: none !important;
  }
  .v-text-field__details {
    display: none !important;
  }
  
}
.v-input__control {
    background: none !important;
}
</style>