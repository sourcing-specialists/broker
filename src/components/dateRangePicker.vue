<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="dates"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        x-small
        color="blue"
      ><v-icon class="mr-2" dense>mdi-calendar</v-icon> {{ fromTo }}</v-btn>
    </template>
    <v-date-picker
      v-model="dates"
      no-title
      scrollable
      range
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="menu = false"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="saveDates(dates)"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
export default {
  data: function() {
    return {
      dates: [
        new Date(new Date().getFullYear(), 0, 2).toISOString().substr(0, 10),//first day of the year
        new Date().toISOString().substr(0, 10),//now
      ],
      menu: false,
      modal: false,
      menu2: false,
    } 
  },
  computed: {
    fromTo() {
      return `${this.formatDate(this.dates[0])} ~ ${this.formatDate(this.dates[1])}`
    }
  },
  methods: {
    saveDates(dates) {
      this.$refs.menu.save(dates)
      this.$emit('change', dates)
    }
  }
}
</script>