<template>
  <div>
    <v-text-field
      v-if="editable"
      v-model="inputText"
    >
    </v-text-field>
    <div
     v-else
    >{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'EditableTextField',
  props: ['value', 'editable'],
  computed: {
    inputText: {
      get: function() {
        return this.value
      },
      set: function(newValue) {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>