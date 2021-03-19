<template>
  <v-card
    :loading="listLoading"
  >
    <v-card-title>{{ $t('components.export_options') }}</v-card-title>
    <v-container
      fluid
      class="px-8"
    >
      <v-row>
        <v-col>
          <v-select
            :label="$t('components.select_incoterm')"
            v-model="inco"
            :items="incoterms"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            :label="$t('components.select_currency')"
            v-model="currency"
            :items="currencies"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            :label="$t('components.select_language')"
            v-model="language"
            item-text="name"
            item-value="code"
            :items="languages"
          ></v-select>
        </v-col>
        <v-col v-if="inco === 'REVOOLOOP'">
          <v-select
            :label="$t('components.delivery_date')"
            v-model="cargo"
            item-text="eta"
            item-value="id"
            :items="cargos"
            @change="cargoChange"
          >
          </v-select>
        </v-col>
        <v-col v-if="inco !== 'FOB'">
          <v-text-field
            :disabled="inco === 'REVOOLOOP'"
            :label="`${$t('price')} USD`"
            v-model="selectedCargo.cost"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-row>
            <v-col>
            <v-btn
              elevation="2"
              :color="vColor"
              dark
              :loading="generateLoading"
              @click="generate()"
            >{{ $t('generate') }}</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-card-title
      v-if="table.items.length"
    >{{ $t('components.export_history') }}</v-card-title>
    <v-container
      v-if="table.items.length"
      fluid
      class="px-10"
    >
      <v-row>
        <v-data-table
          class="elevation-3 list-history rounded-lg"
          :headers="table.headers"
          :items="table.items"
          :loading="listLoading"
        >
          <template v-slot:[`item.download`]="{ item, index }">
            <v-btn
              class="ma-2"
              x-small
              fab
              dark
              elevation="2"
              :color="$store.getters.vColor"
              @click="downloadFile(item.storageLocation, index)"
              :loading="item.downloadIconLoading"
            >
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCurrencies, getIncoterms, getLanguages, getCargos } from '../../endpoints'
import axios from 'axios'
import firebase from "firebase/app"
import "firebase/storage"
import 'firebase/firestore'

export default {
  name: 'exportOptions',
  props: ['list_id'],
  data() {
    return {
      cargos: [],
      currencies: [],
      incoterms: [],
      languages: [],
      inco: '',
      currency: null,
      cargo: null,
      language: null,
      selectedCargo: {},
      generateLoading: false,
      pdfSrc: '',
      listLoading: true,
      table: {
        headers: [
          { text: 'Created', value: 'date' },
          { text: 'File name', value: 'name' },
          { text: 'Incoterm', value: 'incoterm' },
          { text: 'Currency', value: 'currency' },
          { text: 'Language', value: 'language' },
          { text: 'Cost', value: 'cost' },
          { text: '', value: 'download' },
        ],
        items: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'getIncoterm',
      'getCurrency',
      'getLanguage',
      'vColor',
      'user'
    ]),
    url() {
      var price = this.selectedCargo.cost === undefined ? 0 : this.selectedCargo.cost
      return `?list_id=${this.list_id}&cargo_id=${(this.cargo !== 'custom') ? this.cargo : ''}&currency=${this.currency}&incoterm=${this.inco}&lang=${this.language}&cargo_price=${price}&user_id=${this.user.id}`
    },
    dateString() {
      const now = new Date()
      return now.toLocaleString('default', {day: 'numeric', month: 'short', year: 'numeric'})
    }
  },
  methods: {
    downloadFile(location, index) {
      this.table.items[index].downloadIconLoading = true
      firebase.storage().ref().child(location).getDownloadURL()
      .then( url => {
        this.table.items[index].downloadIconLoading = false
        window.open(url)
      })
    },
    generate() {
      this.generateLoading = true
      axios({
        method: 'get',
        url: this.ffunctions('generateListPdf' + this.url),
        responseType: 'blob'
      }).then( res => {
        this.pdfSrc = URL.createObjectURL(res.data)
        this.savePdf(res.data)
      })
    },
    savePdf(pdf) {
      const rightNow = Date.now()
      const filePath = `${this.user.id}/lists/${this.list_id}/${rightNow}.pdf`
      const storage = firebase.storage().ref()
      const location = storage.child(filePath)
      const filesCollection =  this.$db.collection('files')
      const fileData = {
        date: this.dateString,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        name: `${rightNow}.pdf`,
        incoterm: this.inco,
        currency: this.currency,
        language: this.language,
        cost: this.selectedCargo.cost === undefined ? '' : this.selectedCargo.cost,
        storageLocation: filePath,
        user: this.user.id,
        list: this.list_id
      }
      
      location.put(pdf)
      .then(() => {
        filesCollection.add(fileData)
      })
    },
    loadFilesHistory() {
      this.$db.collection('files').where('user', '==', this.user.id).where('list', '==', this.list_id).orderBy('created', 'asc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const file = {
            cost: change.doc.data().cost,
            created: change.doc.data().created,
            currency: change.doc.data().currency,
            date: change.doc.data().date,
            incoterm: change.doc.data().incoterm,
            language: change.doc.data().language,
            list: change.doc.data().list,
            name: change.doc.data().name,
            storageLocation: change.doc.data().storageLocation,
            user: change.doc.data().user,
            downloadIconLoading: false
          }
          if (change.type === "added") {
            this.table.items.unshift(file)
            this.generateLoading = false
          }
        })
        this.listLoading = false
      })
    },
    cargoChange() {
      const cargo = this.cargos.find( c => c.id === this.cargo)
      this.selectedCargo = cargo
    }
  },
  mounted() {
    this.inco = this.getIncoterm
    this.loadFilesHistory()
    getCurrencies().then( resp => {
      this.currencies = resp
      this.currency = this.getCurrency
    })
    getIncoterms().then( resp => {
      this.incoterms = resp
    })
    getLanguages()
    .then( resp => {
      this.languages = resp
      this.language = this.getLanguage
    })
    getCargos()
    .then(resp => {
      var vue = this
      this.cargos = resp.map( c => {
        c.eta = vue.formatDate(c.eta) + `(${c.name})`
        return c
      })
      if(this.inco === 'REVOOLOOP') {
        this.cargo = resp[0].id
        this.selectedCargo = resp[0]
      } else {
        this.cargo = 'custom'
      }
    })
  }
}
</script>

<style scoped>
.list-history {
  width: 100%;
  margin-bottom: 50px;
}
</style>