<template>
  <v-container>
    <login-form></login-form>
  </v-container>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'

export default {
  name: 'Login',
  components: {
    LoginForm,
  }
}
</script>