<template>
  <div v-if="value" class="loader-box">
    <v-progress-circular
      :size="70"
      :width="7"
      :color="$store.getters.vColor"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: 'LoaderBox',
  props: ['value']
}
</script>

<style scoped>
.loader-box {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-color: rgba(255,255,255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>