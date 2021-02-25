<template>
  <div>
    <v-btn
      color="success"
      elevation="2"
      :href="pdfSrc"
      :download="`list_${id}.pdf`"
    >{{ $t('download') }}</v-btn>
    <iframe :src="pdfSrc"></iframe>
  </div>
</template>

<script>
import axios from 'axios'
import firebase from "firebase/app"
import { mapGetters } from 'vuex'
import "firebase/storage"

export default {
  name: 'viewCataloguePdf',
  props: ['id'],
  data() {
    return {
      pdfSrc: ''
    }
  },
  computed: {
    ...mapGetters([
      'getLanguage'
    ])
  },
  methods: {
    save(pdf) {
      const storage = firebase.storage().ref()
      const location = storage.child('pdf/test.pdf')

      location.put(pdf)
      .then(snapshot => {
        console.log(snapshot)
      })
    }
  },
  mounted() {

    let str = this.objectToUrlString(this.$route.query)

    axios({
      method: 'get',
      url: this.ffunctions(`generateListPdf?list_id=${this.id}${str}`),
      responseType: 'blob'
    }).then( res => {
      this.pdfSrc = URL.createObjectURL(res.data)
    })
  }
}
</script>

<style scoped>
  iframe {
    width: 100%;
    min-height: 100vh;
  }
</style>