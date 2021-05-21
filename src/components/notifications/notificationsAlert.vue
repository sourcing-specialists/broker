<template>
  <div>
    <v-btn
      dark
      color="secondary"
      @click="showNotifications = !showNotifications"
    >
      <v-badge
        :content="notificationsCounter"
        :value="notificationsCounter"
        :color="$store.getters.vColor"
        overlap
        dark
      >
        <v-icon>
          mdi-bell
        </v-icon> 
      </v-badge>
    </v-btn>

    <v-dialog
      v-model="showNotifications"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card
        tile
        elevation="4"
        class="notification-center-wrapper"
      >
        <v-toolbar
          flat
          dark
        >
          <v-btn
            icon
            dark
            @click="showNotifications = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ $t('notifications.notifications_center') }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col
              lg="4"
              class="notification-list-wrapper"
            >
              <div class="notification-list__title">
                <h2 class="my-3 black--text">{{ $t('notifications.orders_notifications') }}</h2>
                <v-btn
                  text
                  small
                  @click="clearAll(orders, 'order')"
                >{{ $t('notifications.clear_all') }}</v-btn>
              </div>
              <notification-list
                :list="orders"
                type="order"
                @dismiss="notificationDismiss"
                @close="showNotifications = false"
              ></notification-list>
            </v-col>
            <v-col
              lg="4"
              class="notification-list-wrapper"
            >
              <div class="notification-list__title">
                <h2 class="my-3 black--text">{{ $t('notifications.payments_notifications') }}</h2>
                <v-btn
                  text
                  small
                  @click="clearAll(orders, 'payment')"
                >{{ $t('notifications.clear_all') }}</v-btn>
              </div>
              <notification-list
                :list="payments"
                type="payment"
                @dismiss="notificationDismiss"
                @close="showNotifications = false"
              ></notification-list>
            </v-col>
            <v-col
              lg="4"
              class="notification-list-wrapper"
            >
              <div class="notification-list__title">
                <h2 class="my-3 black--text">{{ $t('notifications.catalogue_notifications') }}</h2>
                <v-btn
                  text
                  small
                  @click="clearAll(orders, 'catalogue')"
                >{{ $t('notifications.clear_all') }}</v-btn>
              </div>
              <notification-list
                :list="catalogue"
                type="catalogue"
                @dismiss="notificationDismiss"
                @close="showNotifications = false"
              ></notification-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import notificationList from './notificationList'

export default {
  name: 'notificationsAlert',
  components: { notificationList },
  data() {
    return {
      orders: [],
      payments: [],
      catalogue: [],
      showNotifications: false
    }
  },
  computed: {
    notificationsCounter() {
      return this.orders.length+this.payments.length+this.catalogue.length
    }
  },
  methods: {
    loadNotifications() {
      this.$http.get(this.endpoint('notification/get'), {
        params: {
          mode: 'unseen'
        }
      }).then(resp => {
        this.orders = resp.data.data.orders.map( n => {
          return this.buildNotification(n)
        })
        this.catalogue = resp.data.data.catalogue.map( n => {
          return this.buildNotification(n)
        })
        this.payments = resp.data.data.payments.map( n => {
          return this.buildNotification(n)
        })
      })
    },
    notificationDismiss(n) {
      if(n.type === 'order') {
        this.orders = this.orders.filter( function(not) {
          return not.id != n.id
        })
      }
      if(n.type === 'payment') {
        this.payments = this.payments.filter( function(not) {
          return not.id != n.id
        })
      }
      if(n.type === 'catalogue') {
        this.catalogue = this.catalogue.filter( function(not) {
          return not.id != n.id
        })
      }
      this.$http.post(this.endpoint('notification/update'), {
        ids: [n.id],
        seen: 1
      })
    },
    clearAll(list, type) {
      if(type === 'order') {
        this.orders = []
      }
      if(type === 'payment') {
        this.payments = []
      }
      if(type === 'catalogue') {
        this.catalogue = []
      }
      const ids = list.map( l => {
        return l.id
      })
      this.$http.post(this.endpoint('notification/update'), {
        ids: ids,
        seen: 1
      })
    }
  },
  mounted() {
    this.loadNotifications()
  }
}
</script>
<style scoped lang="scss">
.notification-center-wrapper {
  display: flex;
  flex-direction: column;
  .v-toolbar {
    flex: 0;
  }
  .v-card__text {
    display: flex;
    flex: 1;
  }
}
.notification-list-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 76px);
  .notification-list__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
