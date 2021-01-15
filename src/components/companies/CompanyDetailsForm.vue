<template>
  <v-card class="pa-8">
    <v-card-title class="ps-0">Company details</v-card-title>
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
        label="Company Name"
        required
        :rules="requiredRules"
      ></v-text-field>
      <v-text-field
        v-model="form.br"
        name="br_number"
        label="Business Registration number"
        required
        :rules="requiredRules"
      ></v-text-field>
      <v-textarea
        v-model="form.address"
        name="address"
        label="Company Address"
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
            label="Zone"
            name="zone"
            no-data-text="Please wait while we load the zones"
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
            label="Warehouse"
            name="warehouse"
            no-data-text="Please wait while we load the warehouses"
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
              {text: '20%', value: 20 },
              {text: '30%', value: 30 },
              {text: '40%', value: 40 },
              {text: '50%', value: 50 }
            ]"
            label="Required Deposit"
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
          label="Credit Days"
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
            label="Preferred Currency"
            name="currency"
            no-data-text="Please wait while we load the currencies"
            @click="loadCurrencies"
            :rules="requiredRules"
            required
          ></v-select>
        </v-col>
    </v-row>
      <v-text-field
        v-if="!id"
        v-model="form.user_name"
        name="user_name"
        label="User Name"
        required
        :rules="requiredRules"
      ></v-text-field>
      <v-text-field
        v-if="!id"
        v-model="form.user_email"
        name="user_email"
        label="User Email"
        required
        :rules="emailRules"
      ></v-text-field>
      <v-switch
        v-if="!id"
        v-model="form.notify_user"
        inset
        label="Notify User?"
      ></v-switch>
      <v-btn
        color="red darken-4"
        elevation="2"
        x-large
        type="submit"
        @click.prevent="validate()"
      >
        <span class="white--text">{{ !this.id ? 'Create Company' : 'Save Changes' }}</span>
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
        notify_user: false
      },
      requiredRules: [
        v => !!v || 'This field required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'Please input a valid E-mail',
      ],
      currencies: ['USD'],
      zones: [],
      warehouses: []
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
    validate() {
      if(this.$refs.form.validate()) {
        this.$store.commit('isLoading', true) //ON loading
        //define if editing or creating
        var endp = 'customer/create'
        if(this.id) endp = `customer/${this.id}/update`
        this.$http.post(this.endpoint(endp), this.form)
          .then( resp => {
            if(resp.data.result == true) {
              this.$toasted.success(!this.id ? 'Company created successfully' : 'Company updated')
              if(!this.id) this.$router.push({ name: 'Companies' })
              this.$store.commit('isLoading', false) //OFF loading
            }
          })
          .catch( () => {
            this.$toasted.error('Sorry, something when wrong.')
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
              this.loading = false
            })
        })
    } else {
      this.loading = false
    }
  },
  mounted() {
    this.$store.commit('isLoading', false) //OFF loading
  }
}
</script>