<template>
  <div class="image-container">
    <v-img
      contain
      :lazy-src="noImage"
      :src="src"
    ></v-img>
  </div>
</template>
<script>
import notFound from '@/assets/images/not-found.png'

export default {
  name: 'ProductImage',
  props: {
    src: {
      type: String,
      default: notFound
    },
    alt: {
      type: String,
      default: 'No image found'
    }
  },
  data() {
    return {
      noImage: this.notFound
    }
  }
}
</script>

<style scoped lang="scss">
.image-container {
  border-radius: 100%;
  overflow: hidden;
  border: 2px solid #CCC;
}
</style>