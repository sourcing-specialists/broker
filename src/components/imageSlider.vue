<template>
  <v-card>
    <v-carousel
      v-model="model"
      height="auto"
      hide-delimiters
      next-icon="mdi-chevron-right"
      prev-icon="mdi-chevron-left"
    >
      <v-carousel-item
        v-for="image in images"
        :key="image"
      >
        <img :src="image">
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
  export default {
    props: {
      images: {
        default: []
      }
    },
    data: () => ({
      model: 0,
    }),
  }
</script>
<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>