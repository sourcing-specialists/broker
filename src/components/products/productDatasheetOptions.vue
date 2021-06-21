<template>
  <v-container>
    <v-form ref="params">
      <v-row>
        <v-col>
          <v-select
            :label="$t('components.hide_price')"
            v-model="no_price"
            :items="[{text: $t('yes'), value: 1},{text: 'No', value: 0}]"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            :label="$t('components.select_incoterm')"
            v-model="inco"
            :items="incoterms"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            :label="$t('components.select_currency')"
            v-model="currency"
            :items="currencies"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            :label="$t('components.select_language')"
            v-model="language"
            item-text="name"
            item-value="code"
            :items="languages"
          ></v-select>
        </v-col>
      </v-row>
      <v-row
        class="mt-3"
      >
        <v-col>
          <v-row>
            <v-col class="d-flex">
              <v-btn
                elevation="2"
                color="indigo"
                dark
                @click="customDatasheetValidate()"
              >{{ $t('customize') }}</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                elevation="2"
                :color="vColor"
                dark
                @click="openDatasheet()"
              >{{ $t('export') }}</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCurrencies, getIncoterms, getLanguages } from '../../endpoints'

export default {
  props: ['datasheet_url', 'product_id'],
  data() {
    return {
      no_price: 0,
      inco: '',
      incoterms: [],
      currency: '',
      currencies: [],
      language: '',
      languages: [],
      requiredRules: [
        v => !!v || this.$t('field_required'),
        v => /^\d*\.?\d*$/.test(v) || this.$t('no_number')
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getIncoterm',
      'getCurrency',
      'vColor',
      'getLanguage',
      'user'
    ]),
    customDatasheet() {
      return { 
        name: 'customDatasheet', 
        params: { 
          product_id: this.product_id 
        },
        query: {
          incoterm: this.inco,
          currency: this.currency,
          language: this.language
        } 
      }
    }
  },
  methods: {
    customDatasheetValidate() {
      if(!this.$refs.params.validate()) {
        return false
      }
      this.$router.push(this.customDatasheet)
    },
    openDatasheet() {
      if(!this.$refs.params.validate()) {
        return false
      }
      var params = [`lang=${this.language}`, `incoterm=${this.inco}`, `currency=${this.currency}`, `no_price=${this.no_price}`, `broker_id=${this.user.id}`]
      window.open(`${this.datasheet_url}?${params.join('&')}`, '_blank')
    }
  },
  mounted() {
    this.inco = this.getIncoterm
    getCurrencies().then( resp => {
      this.currencies = resp
      this.currency = this.getCurrency
    })
    getIncoterms().then( resp => {
      this.incoterms = resp
    })
    getLanguages()
    .then( resp => {
      this.languages = resp
      this.language = this.getLanguage
    })
  }
}
</script>