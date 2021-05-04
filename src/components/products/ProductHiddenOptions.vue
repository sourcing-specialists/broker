<template>
  <div 
    :class="['product-hidden-options', 'd-flex', 'align-center', 'justify-end', { asTile: isTile }, { isForOrders: addCartButton }]"
  >
    <ul
      :class="['d-flex', 'align-center', 'justify-end']"
    >
      <li>
        <v-btn
          class="ma-2"
          x-small
          :fab="!isTile"
          @click="exportDialog = true"
        >
          <v-icon>fa-download</v-icon>
        </v-btn>
      </li>
      <li
        @click="$emit('showToggle', true)"
      >
        <v-btn
          class="ma-2"
          x-small
          :fab="!isTile"
          @click="$emit('showToggle', true)"
        >
          <v-icon>fa-eye</v-icon>
        </v-btn>
      </li>
      <li
        v-if="addCartButton"
        class="addCartButton"
        @click="$emit('productAdd')"
      >
        <v-btn
            class="ma-2"
            x-small
            :color="$store.getters.vColor"
            @click="$emit('productAdd')"
          >
            <span class="white--text"><v-icon>mdi-plus</v-icon></span>
          </v-btn>
      </li>
    </ul>
    <v-dialog
      v-model="exportDialog"
      v-if="exportDialog"
      max-width="720"
    >
      <v-card>
        <v-card-title>{{ $t('export_options') }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <product-datasheet-options :datasheet_url="datasheet"></product-datasheet-options>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import productDatasheetOptions from './productDatasheetOptions'

export default {
  name: 'ProductHiddenOptions',
  props: ['id', 'datasheet', 'tile', 'addCartButton'],
  components: {
    productDatasheetOptions
  },
  data() {
    return {
      exportDialog: false
    }
  },
  computed: {
    isTile() {
      return this.tile == '' ? true : false
    },
    ...mapGetters([
      'getLanguage'
    ])
  },
  methods: {
    openDatasheet() {
      this.exportDialog = true

      //  window.open(`${this.datasheet}?lang=${this.getLanguage}&no_price=1`, '_blank')
    }
  }
}
</script>
<style scoped lang="scss">
.asTile {
  width: 100%;
  ul {
    width: 100%;
    justify-content: center !important;
    li {
      text-align: center;
      width: 50%;
      padding: 10px;
      &:hover {
        background-color: #CCC;
      }
    }
  }
  &.isForOrders {
    li {
      width: 33%;
      &.addCartButton {
        background-color: #B71C1C;
        border-bottom-right-radius: 5px;
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
}
</style>