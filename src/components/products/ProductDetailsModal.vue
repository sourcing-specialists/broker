<template>
  <v-card
    light
    class="pa-8"
  >
    <v-card-title class="ps-0">{{ product.name }}</v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'ProductDetailsModal',
  props: ['product'],
}
</script>