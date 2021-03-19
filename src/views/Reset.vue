<template>
  <v-container>
    <reset-form></reset-form>
  </v-container>
</template>

<script>
import resetForm from '../components/resetForm.vue'

export default {
  name: 'Login',
  components: {
    resetForm
  }
}
</script>