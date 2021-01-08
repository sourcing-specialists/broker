<template>
  <v-container class="login-container d-flex align-center container-fluid">
    <v-card
      elevation="2"
    >
      <v-card-title>Brokers Login</v-card-title>
      <v-form @submit.prevent="login">
        <v-container>
            <v-text-field
              v-model="email"
              :rules="[rules.required]"
              label="E-mail"
              type="email"
              name="email"
              required
            />
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              :type="show ? 'text' : 'password'"
              name="password"
              label="Password"
              @click:append="show = !show"
            />
        </v-container>
        <v-container>
          <v-btn
            color="primary"
            elevation="2"
            x-large
            type="submit"
            :disabled="!formValid"
          >
          <span class="white--text">Login</span>
          </v-btn>
        </v-container>
      </v-form>
    </v-card>
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
        //check if form is complete
        if(!this.formValid) return false

        this.$store.commit('isLoading', true) //ON loading

        //
        let email = this.email
        let password = this.password
        this.$store.dispatch('login', { email, password })
       .then(() => {
         this.$router.push('/')
         this.$store.commit('isLoading', false) //OFF loading
       })
       .catch(() => {
         this.$toastr.e('This credentials do not match our records.')
         this.$store.commit('isLoading', false) //OFF loading
       })
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
<style scoped lang="scss">
  .login-container {
    height: calc(100vh - 60px);
    justify-content: center;
    .v-card {
      min-width: 720px;
    }
  }
</style>
