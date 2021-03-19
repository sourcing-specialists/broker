<template>
  <v-container class="login-container d-flex align-center container-fluid">
    <v-card
      elevation="2"
    >
      <div class="login-header">
        <img width="250" src="../assets/images/logo-original.png" alt="Sourcing Specialists Logo"><br>
        <h1>Reset password</h1>
      </div>
      <v-form ref="resetForm">
        <v-container>
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRule"
              :type="show ? 'text' : 'password'"
              name="password"
              :label="$t('password')"
              @click:append="show = !show"
            />
            <v-text-field
              v-model="passwordConfirmation"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordConfirmationRule"
              :type="showConfirmation ? 'text' : 'password'"
              name="password"
              :label="$t('password_confirmation')"
              @click:append="showConfirmation = !showConfirmation"
            />
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
                @click.prevent="submitReset"
                dark
                :loading="buttonLoading"
              >{{ $t('reset') }}</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'LoginForm',
  data: function() {
    return {
      email: '',
      password: '',
      passwordConfirmation: '',
      show: false,
      showConfirmation: false,
      passwordRule: [
        v => !!v || this.$t('required'),
        v => v.length >= 8 || this.$t('password_length')
      ],
      passwordConfirmationRule: [
        v => !!v || this.$t('required'),
        v => v === this.password || this.$t('password_unmatch')
      ],
      buttonLoading: false
    }
  },
  methods: {
    submitReset() {
      if(this.$refs.resetForm.validate()) {
        this.buttonLoading = !this.forgotButtonLoading
        this.$http.post(this.endpoint('reset'), {
          token: this.$route.query.token,
          password: this.password,
          password_confirmation: this.passwordConfirmation
        }).then(() => {
          this.$toasted.success(this.$t('reset_success'))
          this.buttonLoading = !this.forgotButtonLoading
          this.$router.push({ name: 'Login' })
        }).catch(() => {
          this.$toasted.error(this.$t('something_wrong'))
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
