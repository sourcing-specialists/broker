<template>
  <div class="list-container">
    <vuescroll :ops="ops">
      <v-list
        class="pa-7"
      >
        <transition-group name="list" tag="div">
          <v-list-item
            v-for="item in items"
            :key="item.id"
            class="mb-5 px-0"
            @click="goTo(item.link, type)"
          >
            <v-card
              class="notification-holder"
              shaped
            >
              <v-btn
                class="dismiss-btn"
                @click="$emit('dismiss', { type: type, id: item.id })"
                fab
                elevation="2"
                dark
                color="blue-grey"
                x-small
              ><v-icon>mdi-close</v-icon></v-btn>
              <v-card-subtitle
                class="pb-0"
              >
                <strong>{{ type === 'payment' ? $tc('order', 1) : $t('ref') }}: </strong>{{ item.order }}
              </v-card-subtitle>
              <v-card-text
                class="py-0 main-text"
                v-html="item.text"
              ></v-card-text>
              <v-card-subtitle
                class="py-0 details-text"
                v-html="item.details"
              ></v-card-subtitle>
              <v-card-text class="py-0">
                <p><i>{{ $t('notifications.done_by', { user: item.by }) }}</i></p>
              </v-card-text>
            </v-card>
          </v-list-item>
        </transition-group>
      </v-list>
    </vuescroll>
  </div>
</template>
<script>
import vuescroll from 'vuescroll'

export default {
  name: 'notificationList',
  components: { vuescroll },
  props: ['list', 'type'],
  data() {
    return {
      items: this.list,
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {
          background: this.$store.getters.hexColor
        }
      }
    }
  },
  watch: {
    list() {
      this.items = this.list
    }
  },
  methods: {
    goTo(ref, type) {
      this.$emit('close')
      if(type === 'order') {
        this.$router.push({ name: 'viewOrder', params: { id: ref }}).catch(() => {})
      }
      if(type === 'payment') {
        this.$router.push({ name: 'viewOrder', params: { id: ref }, query: { tab: 'payments'} }).catch(() => {})
      }
      if(type === 'catalogue') {
        this.$router.push({ name: 'Catalogue', query: { search: ref } }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.list-container {
  overflow: hidden;
  flex: 1;
  border-top: 1px solid #E2E2E2;
  border-bottom: 1px solid #E2E2E2;
}
.list-enter-active, .list-leave-active {
  transition: all .5s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
.notification-holder {
  display: block;
  position: relative;
  width: 100%;
  .main-text {
    color: #000;
    font-weight: 700;
  }
  .details-text {
    font-size: 13px;
  }
  .dismiss-btn {
    position: absolute;
    top: -15px;
    right: -15px;
  }
}
</style>