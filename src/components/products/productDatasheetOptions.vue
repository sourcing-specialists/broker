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
      <v-col>
        <v-select
          :label="$t('components.select_language')"
          v-model="language"
          item-text="name"
          item-value="code"
          :items="languages"
        ></v-select>
      </v-col>
      <v-col v-if="inco === 'REVOOLOOP'">
        <v-select
          :label="$t('components.delivery_date')"
          v-model="cargo"
          item-text="eta"
          item-value="id"
          :items="cargos"
          @change="cargoChange"
        >
        </v-select>
      </v-col>
      <v-col v-if="inco !== 'FOB'">
        <v-text-field
          :disabled="inco === 'REVOOLOOP'"
          :label="`${$t('price')} USD`"
          v-model="selectedCargo.cost"
          :rules="requiredRules"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-row>
          <v-col>
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
import { getCurrencies, getIncoterms, getLanguages, getCargos } from '../../endpoints'

export default {
  props: ['datasheet_url'],
  data() {
    return {
      no_price: 0,
      inco: '',
      incoterms: [],
      currency: '',
      currencies: [],
      language: '',
      languages: [],
      cargo: '',
      cargos: [],
      selectedCargo: {},
      requiredRules: [
        v => !!v || this.$t('field_required'),
      ],
    }
  },
  computed: {
    ...mapGetters([
      'getIncoterm',
      'getCurrency',
      'vColor',
      'getLanguage',
      'user'
    ])
  },
  methods: {
    openDatasheet() {
      if(!this.$refs.params.validate()) {
        return false
      }
      var params = [`lang=${this.language}`, `incoterm=${this.inco}`, `currency=${this.currency}`, `no_price=${this.no_price}`, `broker_id=${this.user.id}`]
      if(this.inco === 'DDP') {
        params.push(`cargo_price=${this.selectedCargo.cost}`)
      }
      if(this.inco === 'REVOOLOOP') {
        params.push(`cargo_id=${this.cargo}`)
      }
      window.open(`${this.datasheet_url}?${params.join('&')}`, '_blank')
    },
    cargoChange() {
      const cargo = this.cargos.find( c => c.id === this.cargo)
      this.selectedCargo = cargo
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
    getCargos()
    .then(resp => {
      var vue = this
      this.cargos = resp.map( c => {
        c.eta = vue.formatDate(c.eta) + `(${c.name})`
        return c
      })
      if(this.inco === 'REVOOLOOP') {
        this.cargo = resp[0].id
        this.selectedCargo = resp[0]
      } else {
        this.cargo = 'custom'
      }
    })
  }
}
</script>