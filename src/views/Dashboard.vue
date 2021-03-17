<template>
  <div class="home">
    <h1>{{ $t('dashboard_title') }}</h1>
    <v-container>
      <v-row>
        <v-col
          lg="8"
        >
          <calendar></calendar>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import calendar from '../components/dashboard/calendar'
export default {
  name: 'Dashboard',
  components: {
    calendar
  },
  data() {
    return {
    }
  }
}
</script>
