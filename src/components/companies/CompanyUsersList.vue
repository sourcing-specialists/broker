<template>
  <div>
    <v-card class="pa-8">
      <v-card-title class="ps-0">{{ $tc('users', 0) }}</v-card-title>
      <v-btn
        class="ma-2 add_button"
        :color="$store.getters.vColor"
        elevation="2"
        small
        fab
        @click="loadUser(null)"
      >
        <span class="white--text"><v-icon>mdi-plus</v-icon></span>
      </v-btn>
      <v-skeleton-loader
        class="mx-auto"
        type="list-item"
        v-if="loading"
      />
      <v-data-table
        v-if="!loading"
        :headers="table.headers"
        :items="table.users"
        hide-default-footer
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            class="ma-2"
            x-small
            fab
            elevation="2"
            :color="$store.getters.vColor"
            @click="loadUser(item.id)"
          >
            <span class="white--text"><v-icon>mdi-pencil</v-icon></span>
          </v-btn>
        </template>
      </v-data-table>
      <v-divider />
    </v-card>
    <v-overlay
      :value="overlay"
    >
      <v-card
        light
        class="pa-8"
        width="1000"
        max-width="480"
        v-click-outside="closeOverlay"
        :loading="loading"
      >
        <v-card-title class="ps-0">{{ !editing ? $t('views.companies.create_user') : $t('views.companies.edit_user') }}</v-card-title>
        <v-form
          ref="form"
        >
          <v-text-field
            v-model="form.user_name"
            name="user_name"
            :label="$t('components.companies.user_name')"
            required
            :rules="requiredRules"
          ></v-text-field>
          <v-text-field
            v-model="form.user_email"
            name="user_email"
            :label="$t('email')"
            required
            :rules="emailRules"
          ></v-text-field>
          <v-text-field
            v-if="editing"
            type="password"
            v-model="form.user_password"
            name="user_password"
            autocomplete="false"
            :label="$t('views.companies.set_new_password')"
          ></v-text-field>
          <v-switch
            v-if="!editing"
            v-model="form.notify_user"
            inset
            :label="$t('views.companies.notify_user')"
          ></v-switch>
          <v-btn
            color="red darken-4"
            elevation="2"
            x-large
            type="submit"
            :loading="loading"
            @click.prevent="validate()"
          >
            <span class="white--text">{{ !editing ? $t('views.companies.add_user') : $t('views.companies.update_user') }}</span>
          </v-btn>
        </v-form>
      </v-card>
    </v-overlay>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      default: undefined
    }
  },
  data() {
    return {
      editing: false,
      editing_id: null,
      loading: true,
      overlay: false,
      form: {
        user_name: '',
        user_email: '',
        user_password: '',
        user_password_confirmation: '',
        notify_user: false
      },
      emailTaken: false,
      requiredRules: [
        v => !!v || 'This field required',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'Please input a valid E-mail',
        () => !this.emailTaken || 'This email is not available'
      ],
      table: {
        headers: [
          { text: 'ID', align: 'start', sortable: true, value: 'id' },
          { text: this.$t('components.companies.user_name'), align: 'start', sortable: true, value: 'name' },
          { text: this.$t('email'), align: 'start', sortable: true, value: 'email' },
          { text: '', align: 'end', value: 'actions' }
        ],
        users: []
      }
    }
  },
  methods: {
    closeOverlay() {
      this.overlay = false
      this.editing_id = null
    },
    loadUser(id) {
      if(id == null) {
        this.editing = false
        this.overlay = true
        this.form = {
          user_name: '',
          user_email: '',
          notify_user: false
        }
        return
      }
      this.overlay = true
      this.editing = true
      this.loading = true
      this.editing_id = id
      this.$http.get(this.endpoint(`customer/${this.id}/user/get/${id}`))
        .then(resp => {
          this.form = resp.data.data
          this.loading = false
        })
    },
    loadUsers() {
      this.$http.get(this.endpoint(`customer/${this.id}/user/get`))
        .then(resp => {
          this.table.users = resp.data.data
          this.loading = false
        })
    },
    validate() {
      if(this.$refs.form.validate()) {
        this.loading = true
        //define if editing or creating
        var endp = `customer/${this.id}/user/create`
        if(this.editing) endp = `customer/${this.id}/user/${this.editing_id}/update`
        if(this.form.user_password != '')  this.form.user_password_confirmation = this.form.user_password
          this.$http.post(this.endpoint(endp), this.form)
          .then( resp => {
            if(resp.data.result == false) {
              this.emailTaken = true
              this.$refs.form.validate()
              this.emailTaken = false
              this.$toasted.error(resp.data.message.message)
            }
            if(resp.data.result == true) {
              this.$toasted.success('User Added / Updated')
              this.loadUsers()
              if(!this.editing) this.overlay = false
            }
            this.loading = false
          })
          .catch( (error) => {
            this.$toasted.error('Sorry, ' + error.response.data.message.message)
            this.loading = false
          })
      }
    }
  },
  mounted() {
    this.loadUsers()
  }
}
</script>