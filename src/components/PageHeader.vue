<template>
  <div>
    <div
      :class="[`text-h4`]"
      class="transition-swing"
      v-text="title"
    >
    </div>
    <v-subheader>{{ subheader }}</v-subheader>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      default: null
    },
    subheader: {
      type: String,
      default: null
    }
  }
}
</script>