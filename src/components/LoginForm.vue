<template>
  <v-container class="login-container d-flex align-center container-fluid">
    <v-card
      elevation="2"
    >
      <div class="login-header">
        <img width="250" src="../assets/images/logo-original.png" alt="Sourcing Specialists Logo"><br>
        <h1>Brokers Login</h1>
      </div>
      <v-form ref="loginForm">
        <v-container>
            <v-text-field
              v-model="email"
              :rules="rules.emailRule"
              label="E-mail"
              type="email"
              name="email"
              required
            />
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="rules.requiredRule"
              :type="show ? 'text' : 'password'"
              name="password"
              label="Password"
              @click:append="show = !show"
            />
        </v-container>
        <v-container>
          <v-row>
            <v-col>
              <v-checkbox
                v-model="remember"
                :label="`${$t('remember_me')}`"
                color="indigo"
                value="red"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row>
            <v-col
              lg="6"
              md="12"
            >
              <v-btn
                :color="$store.getters.vColor"
                elevation="2"
                x-large
                @click.prevent="login"
                dark
              >{{ $t('login') }}</v-btn>
            </v-col>
            <v-col
              lg="6"
              md="12"
              class="text-right"
            >
              <v-btn
                @click.prevent="forgotDialog = true"
              >{{ $t('forgot_password') }}?</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <v-dialog
      v-model="forgotDialog"
      v-if="forgotDialog"
      max-width="720"
    >
      <v-card
        class="pa-3"
      >
        <v-card-title>{{ $t('forgot_password') }}</v-card-title>
        <v-form ref="forgot">
          <v-card-text>
          <v-text-field
            v-model="forgotEmail"
            :rules="rules.requiredRule"
            name="email_forget"
            :label="$t('email')"
          >
          </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click.prevent="submitForget"
              :color="$store.getters.vColor"
              elevation="2"
              x-large
              type="submit"
              dark
              :loading="forgotButtonLoading"
            >{{ $t('reset') }}</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { emailRule, requiredRule } from '../constants/formRules'
import firebase from "firebase/app"
import 'firebase/auth'
  export default {
    name: 'LoginForm',
    data: () => {
      return {
        email: '',
        password: '',
        show: false,
        remember: false,
        rules: {
          emailRule,
          requiredRule
        },
        forgotDialog: false,
        forgotEmail: '',
        forgotButtonLoading: false
      }
    },
    methods: {
      login() {
        //check if form is complete
        if(!this.$refs.loginForm.validate()) return false

        this.$store.commit('isLoading', true) //ON loading

        //
        let email = this.email
        let password = this.password
        let remember_me = this.remember ? 1 : 0
        this.$store.dispatch('login', { email, password, remember_me })
       .then(() => {
         //login to firebase
         firebase.auth().signInWithCustomToken(this.$store.getters.jwt)
         this.$router.push('/')
         this.$store.commit('isLoading', false) //OFF loading
       })
       .catch(() => {
         this.$toasted.error('This credentials do not match our records.')
         this.$store.commit('isLoading', false) //OFF loading
       })
      },
      submitForget() {
        if(this.$refs.forgot.validate()) {
          this.forgotButtonLoading = !this.forgotButtonLoading
          this.$http.post(this.endpoint('forget'), {
            email: this.forgotEmail,
            callback_url: process.env.VUE_APP_URL+'reset'
          }).then(() => {
            this.forgotEmail = ''
            this.$toasted.success(this.$t('forgot_reset_success'))
            this.forgotDialog = false
            this.forgotButtonLoading = !this.forgotButtonLoading
          })
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .login-container {
    height: calc(100vh - 60px);
    justify-content: center;
    .login-header {
      text-align: center;
      padding-top: 30px;
    }
    .v-card {
      width: 100%;
      max-width: 720px;
    }
    form {
      padding: 25px;
    }
  }
</style>
