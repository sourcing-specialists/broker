<template>
  <v-container class="d-flex align-center container-fluid">
    <v-form @submit.prevent="login">
      <v-container>
        <v-row>
          <v-text-field
            v-model="email"
            :rules="[rules.required]"
            label="E-mail"
            type="email"
            required
          />
        </v-row>
        <v-row>
          <v-text-field
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="show ? 'text' : 'password'"
            label="Password"
            @click:append="show = !show"
          />
        </v-row>
      </v-container>
      <v-container>
        <v-btn
          elevation="2"
          x-large
          type="submit"
        >Login</v-btn>
      </v-container>
    </v-form>
    <v-btn
      elevation="2"
      x-large
      @click.prevent="debug"
    >Debug</v-btn>
  </v-container>
</template>

<script>
  export default {
    name: 'LoginForm',
    data: () => {
      return {
        email: '',
        password: '',
        show: false,
        rules: {
          required: value => !!value || 'Required.',
        },
      }
    },
    methods: {
      login() {
        if(!this.formValid) return false
        this.$store.commit('isLoading', true) //ON loading
        let email = this.email
        let password = this.password
        this.$store.dispatch('login', { email, password })
       .then(() => {
         this.$router.push('/')
         this.$store.commit('isLoading', false) //OFF loading
       })
       .catch(err => console.log(err))
      },
      debug() {
        console.log(this.$store.getters.isAuthenticated)
      }
    },
    computed: {
      formValid: function() {
        if(this.email.length > 0 && this.password.length > 0) {
          return true
        }
        return false
      }
    }
  }
</script>
