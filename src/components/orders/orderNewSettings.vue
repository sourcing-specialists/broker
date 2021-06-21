<template>
  <div>
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
        <v-row class="pb-5">
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
    <confirmation-dialog ref="confirm"></confirmation-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { requiredRule } from '../../constants/formRules'
import incoterms from '../../constants/incoterms'

export default {
  name: 'OrderNewSettings',
  components: {
    confirmationDialog: () => import("../confirmationDialog"),
  },
  data() {
    return {
      loading: true,
      company_id: this.$store.getters['cart/company'].id ? this.$store.getters['cart/company'].id : '',
      companies: [],
      incoterms: incoterms,
      order_incoterm: this.$store.getters['cart/incoterm'],
      transport: this.$store.getters['cart/transport'],
      requiredRule: requiredRule
    }
  },
  computed: {
    ...mapGetters('cart', [
      'company',
      'incoterm',
      'count'
    ]),
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
  watch: {
    company(val) {
      if(Object.keys(val).length === 0) {
        this.company_id = ''
        this.order_incoterm = this.$store.getters['cart/incoterm']
        this.transport = this.$store.getters['cart/cargo']
      }
    }
  },
  methods: {
    ...mapActions('cart', [
      'clearCartItems',
      'setCompany',
      'setIncoterm',
      'setTransport',
      'clearCart'
    ]),
    customerChanged() {
      //pass client to the cart store
      const company = this.companies.find(c => c.id === this.company_id)
      this.setCompany(company)
      this.setIncoterm(company.pref_incoterm)
      this.order_incoterm = company.pref_incoterm
    },
    confirmSettings() {
      if(this.$refs.order_settings.validate()) {
        this.$emit('onConfirm')
      }
    },
    async changeIncoterm() {
      if(this.count > 0) {
        var confirmation = await this.$refs.confirm.open(
          this.$t('orders.please_confirm'),
          this.$t('orders.changing_incoterm_confirmation_text')
        )
        if(confirmation) {
          this.setIncoterm(this.order_incoterm)
          this.clearCartItems()
          if(this.order_incoterm === 'FOB') {
            this.transport = ''
          }
        }
      } else {
        this.setIncoterm(this.order_incoterm)
        if(this.order_incoterm === 'FOB') {
          this.transport = ''
        }
      }
      this.order_incoterm = this.incoterm
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
  }
}
</script>