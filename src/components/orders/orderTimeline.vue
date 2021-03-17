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
      :color="stage_id < stage.id ? 'rgba(0,0,0,0.2)' : $store.getters.vColor"
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
  data: function() {
    return {
      stages: [
        { name: this.$t('orders.pending'), icon: 'mdi-clock-outline', slug: 'pending', id: 1 },
        { name: this.$t('orders.waiting_customer'), icon: 'mdi-cogs', slug: 'waiting_for_customer_confirmation', id: 2 },
        { name: this.$t('orders.production'), icon: 'mdi-factory', slug: 'production', id: 3 },
        { name: this.$t('orders.quality_control'), icon: 'mdi-magnify-scan', slug: 'quality_control', id: 4 },
        { name: this.$t('orders.collection'), icon: 'mdi-truck', slug: 'collection', id: 5 },
        { name: this.$t('orders.shipped'), icon: 'mdi-ferry', slug: 'shipped', id: 6 },
        { name: this.$t('orders.delivered'), icon: 'mdi-airport', slug: 'delivered', id: 7 },
      ]
    }
  },
  computed: {
    stage_id() {
      var current_stage = this.stages.find(s => s.slug === this.status)
      return current_stage.id
    }
  }
}
</script>
<style scoped>
.aligned-center {
  align-items: center !important;
}
</style>