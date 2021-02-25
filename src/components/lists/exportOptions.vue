<template>
  <div>
    <v-card-title>{{ $t('components.export_options') }}</v-card-title>
    <v-container>
      <v-row>
        <v-col>
          <v-select
            :label="$t('components.select_incoterm')"
            v-model="incoterm"
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
        <v-col>
          <v-select
            :label="$t('components.select_language')"
            v-model="lang"
            item-text="name"
            item-value="code"
            :items="languages"
          ></v-select>
        </v-col>
        <v-col v-if="incoterm !== 'FOB'">
          <v-select
            :label="$t('components.delivery_date')"
            v-model="cargo"
            item-text="eta"
            item-value="id"
            :items="cargos"
          >
          </v-select>
        </v-col>
        <v-col v-if="incoterm !== 'FOB'">
          <v-text-field
            :disabled="cargo !== 'custom'"
            :label="$t('price')"
            v-model="selectedCargoPrice"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn
            elevation="2"
            :color="vColor"
            dark
            :href="url"
            target="_blank"
          >{{ $t('generate') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCurrencies, getIncoterms, getLanguages, getCargos } from '../../endpoints'
export default {
  name: 'exportOptions',
  props: ['list_id'],
  data() {
    return {
      cargos: [],
      currencies: [],
      incoterms: [],
      languages: [],
      incoterm: 'REVOOLOOP',
      currency: null,
      cargo: null,
      lang: null,
      selectedCargoPrice: null
    }
  },
  computed: {
    ...mapGetters([
      'getCurrency',
      'getLanguage',
      'vColor',
      'user'
    ]),
    url() {
      return `/public/catalogue/download/${this.list_id}?cargo_id=${(this.cargo !== 'custom') ? this.cargo : ''}&currency=${this.currency}&incoterm=${this.incoterm}&lang=${this.lang}&cargo_price=${this.selectedCargoPrice}&user_id=${this.user.id}`
    }
  },
  methods: {
    debug() {
      console.log(this.currency)
    }
  },
  mounted() {
    getCurrencies().then( resp => {
      this.currencies = resp
      this.currency = this.getCurrency
    })
    getIncoterms().then( resp => this.incoterms = resp)
    getLanguages()
    .then( resp => {
      this.languages = resp
      this.lang = this.getLanguage
    })
    getCargos()
    .then(resp => {
      this.cargos = resp
      this.cargos.push({
        id: 'custom',
        eta: this.$t('components.set_price')
      })
      this.cargo = resp[0].id
      this.selectedCargoPrice = resp[0].cost
    })
  }
}
</script>