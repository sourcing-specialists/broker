<template>
  <div>
    <v-data-table
      :headers="tableHeaders"
      :items="designs"
      :hide-default-footer="true"
      :hide-default-header="true"
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>{{ $t('designs') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="addDesignDialog"
            max-width="720"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                elevation="1"
                small
              >
                {{ $t('orders.add_design') }}
              </v-btn>
            </template>
            <v-card
              v-if="addDesignDialog"
            >
              <v-form ref="productDesignForm">
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-text-field
                        :rules="requiredRule"
                        :label="$t('orders.product_design_name')"
                        v-model="designName"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-file-input
                        v-model="designFile"
                        small-chips
                        accept=".jpg,.png,.pdf"
                        :label="$t('orders.product_design_file')"
                        prepend-icon="mdi-file-image-outline"
                        :rules="requiredRule"
                      ></v-file-input>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions
                  class="pa-3"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="$store.getters.vColor"
                    @click="addDesign"
                    dark
                    elevation="1"
                    x-large
                    :loading="loading"
                  >{{ $t('orders.add_design') }}</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider></v-divider>
      </template>
      <template v-slot:[`item.file`]="{ item }">
        <v-btn
          link
          :href="item.full_url"
          target="_blank"
        >{{ $t('view_file') }}</v-btn>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          @click="deleteDesign(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <confirmation-dialog ref="confirm"></confirmation-dialog>
  </div>
</template>
<script>
import { requiredRule } from '../../constants/formRules'
export default {
  name: 'orderProductDesigns',
  props: ['order', 'product'],
  components: {
    confirmationDialog: () => import("../confirmationDialog"),
  },
  data() {
    return {
      designs: [],
      addDesignDialog: false,
      loading: true,
      tableHeaders: [
         { text: '', align: 'start', sortable: false, value: 'title' },
         { text: '', align: 'start', sortable: false, value: 'file' },
         { text: '', align: 'end', sortable: false, value: 'actions' },
      ],
      designName: '',
      designFile: [],
      requiredRule
    }
  },
  methods: {
    addDesign() {
      if(this.$refs.productDesignForm.validate()) {
        this.loading = true
        var formData = new FormData()
        formData.append('add_design_file', this.designFile, this.designFile.name)
        formData.append('add_title', this.designName)
        formData.append('product_id', this.product.id)
        formData.append('key', this.product.built_sku)
        formData.append('add_target_product_option_design_id', '')
        formData.append('add_sku', this.product.built_sku)

        const headers =  {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }

        this.$http.post(this.endpoint(`orders/edit/${this.order.id}/product/${this.product.id}/designs/update`), formData, headers)
        .then( resp => {
          if(resp.data.result) {
            this.$toasted.success(this.$t('orders.design_uploaded'))
            this.addDesignDialog = false
          }
          this.loadDesigns()
        })
      }
    },
    async deleteDesign(design) {
      var confirmation = await this.$refs.confirm.open(
        this.$t('orders.please_confirm'),
        this.$t('confirm_delete')
      )
      if(confirmation) {
        this.loading = true
        this.$http.post(this.endpoint(`orders/edit/${this.order.id}/product/${this.product.id}/designs/delete`), {
          product_id: this.product.id,
          key: this.product.built_sku,
          add_sku: this.product.built_sku,
          [`delete_file_${design.id}`]: 'on'
        }).then(resp => {
          console.log(resp.data)
          if(resp.data.result) {
            this.$toasted.success(this.$t('orders.design_deleted'))
            this.loadDesigns()
          }
        })
      }
    },
    loadDesigns() {
      this.loading = true
      this.$http.get(this.endpoint(`orders/edit/${this.order.id}/product/${this.product.id}/designs`))
      .then(resp => {
        if(resp.data.result) {
          this.designs = resp.data.data
        }
        this.loading = false
      })
    }
  },
  mounted() {
    this.loadDesigns()
  }
}
</script>