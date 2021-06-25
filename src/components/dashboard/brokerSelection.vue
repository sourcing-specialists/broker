<template>
  <v-menu
    v-model="menu"
    :return-value.sync="menu"
    content-class="menu-bg"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        x-small
        color="blue"
        transition="scale-transition"
        @click="loadBrokers"
      ><v-icon class="mr-2" dense>mdi-account-tie</v-icon> {{ broker === 'all' ? $t('all') : broker }}</v-btn>
    </template>
    <v-list max-height="500px">
      <v-divider></v-divider>
      <v-list-item
        @click="changeBroker('all')"
      >
        <v-list-item-title>{{ $t('all') }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-for="broker in brokers"
        :key="broker.id"
        @click="changeBroker(broker)"
      >
        <v-list-item-title>{{ broker.first_name }} {{ broker.last_name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  import { GET_BROKERS } from '../../constants/endpoints'
  export default {
    name: 'topClients',
    props: ['value'],
    data() {
      return {
        menu: false,
        brokers: [],
        broker: 'all'
      }
    },
    methods: {
      loadBrokers() {
        if(this.brokers.length === 0) {
          this.$http.get(this.buildEndpoint(GET_BROKERS))
          .then(resp => {
            this.brokers = resp.data.data
          })
        }
      },
      changeBroker(broker) {
        var b = this.brokers.find( b => b.id === broker.id)
        this.broker = broker === 'all' ? 'all' : `${b.first_name} ${b.last_name}`
        this.$emit('input', broker === 'all' ? 'all' : b.id)
      }
    }
  }
</script>
<style scoped>
.menu-bg {
  background-color: #FFF;
}
</style>