<template>
  <v-timeline
    style="margin-left: -50%;"
  >
    <v-timeline-item
      class="aligned-center"
      v-for="(stage, i) in stages"
      :key="i"
      :icon="stage.icon"
      large
      right
      :color="orderStatus < stage.id ? 'rgba(0,0,0,0.2)' : $store.getters.vColor"
    >
      <template slot:default>
        <h5>{{ stage.name }}</h5>
      </template>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: 'pending'
    }
  },
  data() {
    return {
      stages: [
        { name: 'Deposit Required', icon: 'fa-hand-holding-usd', id: 1 },
        { name: 'Producing', icon: 'fa-cogs', id: 2 },
        { name: 'On Ship', icon: 'fa-ship', id: 3 },
        { name: 'Balance Required', icon: 'fa-hand-holding-usd', id: 4 },
        { name: 'Done', icon: 'fa-check', id: 5 },
      ]
    }
  },
  computed: {
    orderStatus() {
      switch(this.status) {
        case 'production':
          return 2
        case 'quality_control':
          return 2
        case 'on_ship':
          return 3
        case 'waiting_for_balance':
          return 4
        case 'done':
          return 5
        default:
          return 1
      }
    }
  }
}
</script>
<style scoped>
.aligned-center {
  align-items: center !important;
}
</style>