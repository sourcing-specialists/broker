<template>
  <v-row
  >
    <v-col
      lg="1"
      class="pa-6"
    >
    <ProductImage :src="productData.img" />
    </v-col>
    <v-col
      lg="1"
      class="d-flex align-center"
    >
      {{ productData.ref }}
    </v-col>
    <v-col
      lg="4"
      class="d-flex align-center"
    >
      <div>
        <h4>{{ productData.name }}</h4>
        <p>{{ productData.description }}</p>
      </div>
    </v-col>
    <v-col
      lg="2"
      class="d-flex align-center"
    >
      {{ productData.packing }}
    </v-col>
    <v-col
      lg="2"
      class="d-flex align-center"
    >
      {{ productData.carton }}
    </v-col>
    <v-col
      lg="2"
      class="d-flex align-center"
    >
      {{ productData.price }}
    </v-col>
    <v-divider></v-divider>
  </v-row>
</template>

<script> 
import ProductImage from './ProductImage.vue'
export default {
  name: 'Product',
  props: {
    productData: {
      type: Object,
      default: () => {
        return {
          img: '',
          ref: '',
          name: '',
          description: '',
          packing: '',
          carton: '',
          price: ''
        }
      }
    },
    displayType: {
      default: 'list'
    }
  },
  components: {
    ProductImage,
  },
  data() {
    return {

    }
  },
  beforeMount() {

  }
}
</script>