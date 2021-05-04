<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="date ? formatDate(date) : ''"
        :label="label"
        :prepend-icon="icon !== undefined ? 'mdi-calendar' : ''"
        readonly
        v-bind="attrs"
        v-on="on"
        :rules="required !== undefined ? requiredRule : []"
        :disabled="disabled"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      no-title
      scrollable
      @change="$refs.menu.save(date)"
    ></v-date-picker>
  </v-menu>
</template>
<script>
import { requiredRule } from '../constants/formRules'

export default {
  name: 'textFieldDatepicker',
  props: ['value', 'label', 'icon', 'required', 'disabled'],
  data() {
    return {
      menu: false,
      date: this.value,
      requiredRule
    }
  },
  watch: {
    date(v) {
      this.$emit('input', v)
    },
    value(v) {
      this.date = v
    }
  }
}
</script>