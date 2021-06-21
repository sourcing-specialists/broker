<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex justify-end">
        <div style="width: 75px;">
          <v-select
            v-model="pageSize"
            :items="[5,10,15,25,50,100]"
            outlined
            dense
          ></v-select>
        </div>
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="totalPages >= 6 ? 7 : totalPages"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'productsListPagination',
  props: ['value', 'total-pages'],
  data() {
    return {
      pageSize: 15,
      page: this.value
    }
  },
  watch: {
    value() {
      this.page = this.value
    },
    page() {
      this.$emit('input', this.page)
    },
    pageSize() {
      this.$emit('pageSizeChange', this.pageSize)
    }
  }
}
</script>
