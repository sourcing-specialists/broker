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
          class="d-flex align-center"
        >
          <div>
            <h4>
              <span>
                {{ option.group_name }}: {{ option.group_value }}
              </span>
            </h4>
            <p><span class="font-weight-bold">Ref Number:</span> {{ option.ref }}</p>
            <p><span class="font-weight-bold">Carton Size:</span> {{ meas(option) }}</p>
            <p>{{ option.description.length >= 100 ? `${option.description.substring(0,100)}...` : option.description }}</p>
          </div>
        </v-col>
        <v-col
          lg="2"
          md="2"
          class="d-flex align-center"
        >
          <ul v-html="packing(option)"></ul>
        </v-col>
        <v-col
          lg="1"
          md="1"
          class="d-flex align-center"
        >
          <p>{{ option.min_order }} Cartons</p>
        </v-col>
        <v-col
          lg="3"
          md="3"
          class="d-flex align-center"
        >
          <ul class="pa-2" v-html="prices(option)"></ul>
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
  methods: {
    packing(option) {
      var string = `
        <li><span class="font-weight-bold">${option.inner_unit_text}:</span> ${option.inner_units}</li>
        <li><span class="font-weight-bold">${option.outer_unit_text}:</span> ${option.outer_units}</li>
      `
      return string
    },
    meas(option) {
      var string = `${option.length}cm x ${option.width}cm x ${option.height}cm`
      return string
    },
    prices(option) {
      var string = ''
      option.tiers.map(function(t) {
        string+= `<li><span class="font-weight-bold">${t.cost_per_carton}</span> (${t.from} to ${t.to})</li>`
      })
      return string
    },
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
      background-color: #FFF;
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