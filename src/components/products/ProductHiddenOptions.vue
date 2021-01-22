<template>
  <div 
    class="product-hidden-options d-flex align-center justify-end"
  >
    <ul
      class="d-flex align-center justify-end"
    >
      <li>
        <v-btn
          class="ma-2"
          x-small
          fab
          @click="openDatasheet()"
        >
          <v-icon>fa-download</v-icon>
        </v-btn>
      </li>
      <li>
        <v-btn
          class="ma-2"
          x-small
          fab
          @click="$emit('showToggle', true)"
        >
          <v-icon>fa-eye</v-icon>
        </v-btn>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'ProductHiddenOptions',
  props: ['id', 'datasheet'],
  methods: {
    openDatasheet() {
      window.open(this.datasheet, '_blank')
    }
  }
}
</script>