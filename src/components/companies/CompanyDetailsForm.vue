<template>
  <v-card class="pa-8">
    <v-card-title class="ps-0">{{ $t('components.companies.company_details') }}</v-card-title>
    <v-skeleton-loader
      class="mx-auto"
      type="table, actions"
      v-if="loading"
    />
    <v-form
      ref="form"
      v-if="!loading"
    >
      <v-text-field
        v-model="form.company_name"
        name="name"
        :label="$t('components.companies.company_name')"
        required
        :rules="requiredRules"
      ></v-text-field>
      <v-text-field
        v-model="form.br"
        name="br_number"
        :label="$t('components.companies.business_registration_number')"
        required
        :rules="requiredRules"
      ></v-text-field>
      <v-textarea
        v-model="form.address"
        name="address"
        :label="$t('address')"
        required
        :rules="requiredRules"
      ></v-textarea>
      <v-row>
        <v-col
          lg="6"
          sm="12"
        >
          <v-select
            v-model="form.zone"
            :items="zones"
            :label="$tc('zone', 1)"
            name="zone"
            :no-data-text="$t('components.companies.please_white_while_we_load_the_zones')"
            @click="loadZones"
            required
            :rules="requiredRules"
          ></v-select>
        </v-col>
        <v-col
            lg="6"
            sm="12"
          >
          <v-select
            v-model="form.warehouse"
            :items="warehouses"
            :label="$tc('warehouse', 1)"
            name="warehouse"
            :no-data-text="$t('components.companies.please_wait_while_we_load_the_warehouses')"
            @click="loadWarehouses"
            :rules="requiredRules"
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col
            lg="6"
            sm="12"
          >
          <v-select
            v-model="form.deposit"
            :items="[
              {text: '10%', value: 10 },
              {text: '15%', value: 15 },
              {text: '20%', value: 20 },
              {text: '25%', value: 25 },
              {text: '30%', value: 30 },
              {text: '40%', value: 40 },
              {text: '50%', value: 50 }
            ]"
            :label="$t('required_deposit')"
            name="deposit"
            required
            :rules="requiredRules"
          ></v-select>
        </v-col>
        <v-col
          lg="6"
          sm="12"
        >
        <v-select
          v-model="form.credit_days"
          :items="[
            {text: '-10', value: -10 },
            {text: '0', value: 0 },
            {text: '10', value: 10 },
            {text: '20', value: 20 },
            {text: '30', value: 30 }
          ]"
          :label="$t('credit_days')"
          name="credit_days"
          required
        ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          lg="12"
          sm="12"
        >
          <v-select
            v-model="form.pref_currency"
            :items="currencies"
            :label="$t('components.companies.preferred_currency')"
            name="currency"
            :no-data-text="$t('components.companies.please_wait_while_we_load_the_currencies')"
            @click="loadCurrencies"
            :rules="requiredRules"
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          lg="12"
          sm="12"
        >
          <v-select
            v-model="form.category_ids"
            :items="categories"
            :label="$t('components.companies.categories_interest')"
            :rules="requiredRules"
            required
            multiple
          >
            <template v-slot:selection="{ item, index }">
              <v-chip outlined v-if="index === 0 || index === 1">
                <span>{{ item.text }}</span>
              </v-chip>
              <span
                v-if="index === 2"
                class="grey--text text-caption"
              >
                (+{{ form.category_ids.length - 2 }} others)
              </span>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-text-field
        v-if="!id"
        v-model="form.user_name"
        name="user_name"
        :label="$t('components.companies.user_name')"
        required
        :rules="requiredRules"
      ></v-text-field>
      <v-text-field
        v-if="!id"
        v-model="form.user_email"
        name="user_email"
        :label="$t('components.companies.user_email')"
        required
        :rules="emailRules"
      ></v-text-field>
      <v-switch
        v-if="!id"
        v-model="form.notify_user"
        inset
        :label="$t('components.companies.notify_user')"
      ></v-switch>
      <v-btn
        color="red darken-4"
        elevation="2"
        x-large
        type="submit"
        @click.prevent="validate()"
      >
        <span class="white--text">{{ !this.id ? $t('components.companies.create_company') : $t('save_changes') }}</span>
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    id: {
      default: undefined
    }
  },
  data() {
    return {
      loading: true,
      form: {
        company_name: '',
        br: '',
        address: '',
        zone: '',
        warehouse: '',
        deposit: 10,
        credit_days: 0,
        pref_currency: 'USD',
        user_name: '',
        user_email: '',
        notify_user: false,
        category_ids: []
      },
      emailTaken: false,
      requiredRules: [
        v => !!v || '',
      ],
      emailRules: [
        v => !!v || '',
        v => /.+@.+\..+/.test(v) || '',
        () => !this.emailTaken || '',
      ],
      currencies: ['USD'],
      zones: [],
      warehouses: [],
      categories: []
    }
  },
  methods: {
    loadZones() {
      if(this.zones.length !== 0) return false
      this.$http.get(this.endpoint('zones'))
        .then( resp => {
          resp.data.data.map(function(z) {
            z.text = z.name
            z.value = z.id
          })
          this.zones = resp.data.data
        })
    },
    loadWarehouses() {
      if(this.warehouses.length !== 0) return false
      this.$http.get(this.endpoint('warehouses'))
        .then( resp => {
          resp.data.data.map(function(z) {
            z.text = z.name
            z.value = z.id
          })
          this.warehouses = resp.data.data
        })
    },
    loadCurrencies() {
      if(this.currencies.length !== 1) return false
      this.$http.get(this.endpoint('currencies'))
        .then( resp => {
          this.currencies = resp.data.data
        })
    },
    loadFields() {
      return new Promise((resolve/*, reject*/) => {
        this.loadZones()
        this.loadWarehouses()
        this.loadCurrencies()
        resolve()
      })
    },
    loadCategories() {
      this.$http.get(this.endpoint(`category/get`), { 
        params: {
          incoterm: 'FOB'
        } 
      }).then( resp => {
        var cats = []
        resp.data.data.map( c => {
          if(c.header) {
            cats.push({
              text: c.header,
              value: c.id
            })
            if(!this.id) {
              this.form.category_ids.push(c.id)
            }
          }
        })
        this.categories = cats
      })
    },
    validate() {
      if(this.$refs.form.validate()) {
        this.$store.commit('isLoading', true) //ON loading
        //define if editing or creating
        var endp = 'customer/create'
        if(this.id) endp = `customer/${this.id}/update`
        this.$http.post(this.endpoint(endp), this.form)
        .then( resp => {
          if(resp.data.result == false) {
            this.emailTaken = true
            this.$refs.form.validate()
            this.emailTaken = false
            this.$toasted.error(resp.data.message.message)
          }
          if(resp.data.result == true) {
            this.$toasted.success(!this.id ? '' : '')
            if(!this.id) this.$router.push({ name: 'Companies' })
          }
          this.$store.commit('isLoading', false) //OFF loading
        })
        .catch( (error) => {
          this.$toasted.error('ERROR: ' + error.response.data.message.message)
          this.$store.commit('isLoading', false) //OFF loading
        })
      }
    }
  },
  beforeMount() {
    //we try to load the company and fill up the form
    if(this.id) {
      this.loadFields()
        .then( () => {
          this.$http.get(this.endpoint(`customer/get/${this.id}`))
            .then(resp => {
              this.form = resp.data.data
              this.form.category_ids = resp.data.data.categories.map( c => c.id )
              this.loading = false
            })
        })
    } else {
      this.loading = false
    }
  },
  mounted() {
    this.$store.commit('isLoading', false) //OFF loading
    this.loadCategories()
  }
}
</script>