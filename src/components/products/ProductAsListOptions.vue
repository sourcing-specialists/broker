<template>
  <div
    class="option-row"
  >
    <div
      v-for="(option, index) in options"
      :key="option.id"
    >
      <v-row
        v-if="index != 0"
      >
        <v-col
          lg="1"
          md="1"
          class="pa-4 d-flex align-center"
        >
          <ProductImage :src="image" />
        </v-col>
        <v-col
          lg="4"
          md="4"
          class="d-flex align-center pl-8"
        >
          <div>
            <h4>
              <span>
                {{ option.group_name }}: {{ option.group_value }}
              </span>
            </h4>
            <div class="product_option_description" v-html="mxOptionDetails(option)"></div>
          </div>
        </v-col>
        <v-col
          lg="1"
          md="1"
          class="d-flex align-center"
        >
        </v-col>
        <v-col
          lg="2"
          md="2"
          class="d-flex align-center"
        >
          <ul v-html="mxPacking(option)"></ul>
        </v-col>
        <v-col
          lg="3"
          md="3"
          class="d-flex align-center"
        >
          <ul class="pa-2 price-tiers" v-html="mxPriceTiers(option)"></ul>
        </v-col>
        <v-col
          lg="1"
          md="1"
          class="d-flex align-center"
        >
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script> 
import ProductImage from './ProductImage.vue'

export default {
  name: 'ProductOptions',
  props: ['options'],
  components: {
    ProductImage,
  },
  data() {
    return {
      color: this.$store.getters.vColor
    }
  },
  computed: {
    image() {
      return ''
    }
  }
}
</script>
<style scoped lang="scss">
  .option-row {
    overflow: hidden;
    position: relative;
    .row {
      position: relative;
      z-index: 1;
      margin: 0px;
      background-color: #E3F2FD;
      transform: translateX(0px);
      transition: all ease-in-out 0.5s;
      &.swiped {
        transform: translateX(-100px);
      }
    }
  }
  p {
    margin-bottom: 0px !important;
  }
</style>