<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="720"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title>
        <v-icon class="red--text" large>mdi-clipboard-alert</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-5">{{ message }}</v-card-text>
      <v-card-actions>
        <v-btn
          v-if="!options.noconfirm"
          color="red darken-1"
          text
          @click.native="cancel"
        >
          {{ $t('cancel') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          dark
          elevation="2"
          @click.native="agree"
        >
          {{ $t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "confirmationDialog",
    data() {
      return {
        dialog: false,
        resolve: null,
        reject: null,
        message: null,
        title: null,
        options: {
          color: "grey lighten-3",
          width: 400,
          zIndex: 200,
          noconfirm: false,
        },
      };
    },
    methods: {
      open(title, message, options) {
        this.dialog = true;
        this.title = title;
        this.message = message;
        this.options = Object.assign(this.options, options);
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
      },
      agree() {
        this.resolve(true);
        this.dialog = false;
      },
      cancel() {
        this.resolve(false);
        this.dialog = false;
      },
    },
  };
</script>