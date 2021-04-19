<template>
  <v-sheet
    max-width="720"
    class="ma-auto pa-3"
  >
    <v-form ref="order_settings">
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="company_id"
            :label="$t('company')"
            :items="companies"
            :loading="loading"
            @change="customerChanged()"
            :rules="requiredRule"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            v-model="order_incoterm"
            :label="$t('orders.incoterm')"
            :items="incoterms"
            :disabled="company_id === ''"
            @change="changeIncoterm()"
            :rules="requiredRule"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            v-model="transport"
            :label="$t('orders.transport')"
            :items="transports"
            :disabled="order_incoterm === ''"
            @change="setTransport(transport)"
            :rules="requiredRule"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row
        v-if="company_id !== '' && order_incoterm !== 'FOB' && transport !== 'air'"
      >
        <v-col>
          <v-autocomplete
            v-model="selectedCargo"
            :items="availableCargos"
            :label="$t('orders.select_cargo')"
            item-text="name"
            item-value="id"
            @change="setCargo"
            :rules="requiredRuleObjects"
          >
            <template v-slot:selection="data">
              {{ data.item.name }}
            </template>
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title><strong class="mColor-text">{{ data.item.name }}</strong></v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <strong>{{ $t('cost') }}:</strong> {{ numberToNiceString(data.item.cost) }} | 
                  <strong>{{ $t('cutoff_date') }}:</strong> {{ formatDate(data.item.cutoff_date) }} |  
                  <strong>ETA:</strong> {{ formatDate(data.item.eta) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-progress-linear
                    v-model="data.item.percent"
                    color="light-green lighten-1"
                    height="25"
                    striped
                  >
                    <template v-slot:default>
                      <strong>{{ data.item.cbm_in_use }} {{ $t('orders.cbm_used_vs_free') }}  {{ data.item.cbm_limit }} </strong>
                    </template>
                  </v-progress-linear>
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            :color="$store.getters.vColor"
            elevation="2"
            dark
            @click="confirmSettings"
          >{{ $t('orders.confirm_settings') }}</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script>
import { mapActions } from 'vuex'
import { requiredRule, requiredRuleObjects } from '../../constants/formRules'
import incoterms from '../../constants/incoterms'

export default {
  data() {
    return {
      loading: true,
      company_id: this.$store.getters['cart/company'].id ? this.$store.getters['cart/company'].id : '',
      companies: [],
      incoterms: incoterms,
      order_incoterm: this.$store.getters['cart/incoterm'],
      transport: this.$store.getters['cart/transport'],
      availableCargos: [],
      selectedCargo: this.$store.getters['cart/cargo'],
      requiredRule: requiredRule,
      requiredRuleObjects: requiredRuleObjects
    }
  },
  computed: {
    transports() {
      if(this.order_incoterm === 'FOB') {
        return [{
          value: 'sea',
          text: this.$t('orders.sea')
        }]
      } 
      return [
        {
          value: 'sea',
          text: this.$t('orders.sea')
        },
        {
          value: 'air',
          text: this.$t('orders.air')
        }
      ]
    }
  },
  methods: {
    ...mapActions('cart', [
      'setCompany',
      'setIncoterm',
      'setTransport'
    ]),
    customerChanged() {
      //pass client to the cart store
      const company = this.companies.find(c => c.id == this.company_id)
      this.setCompany(company)
      this.setIncoterm(company.pref_incoterm)
      this.order_incoterm = company.pref_incoterm
    },
    loadCargos() {
      return new Promise((resolve/*, reject*/) => {
        this.$http.get(this.endpoint(`cargo/get`))
          .then( resp => {
            if(resp.data.result == true) {
              if(resp.data.data.length > 0) {
                var vue = this
                resp.data.data.map(function(c) {
                  c.value = c.id
                  c.text = `${ vue.formatDate(c.eta) } (${c.name})`
                  c.percent = c.cbm_in_use/c.cbm_limit*100
                })
                this.availableCargos = resp.data.data
              }
              resolve()
            }
          })
      })
    },
    setCargo() {
      const cargo = this.availableCargos.find( c => c.id === this.selectedCargo)
      this.$store.commit('cart/setCargo', cargo)
    },
    confirmSettings() {
      if(this.$refs.order_settings.validate()) {
        this.$emit('onConfirm')
      }
    },
    changeIncoterm() {
      this.setIncoterm(this.order_incoterm)
      if(this.order_incoterm === 'FOB') {
        this.transport = ''
      }
    }
  },
  mounted() {
    //load customers
    this.$http.get(this.endpoint('customer/get'))
    .then( resp => {
      resp.data.data.map(function(c) {
        c.value = c.id
        c.text = c.name
      })
      this.companies = resp.data.data
      this.loading = false
    })
    this.loadCargos()
    //console.log(this.selectedCargo)
  }
}
</script>