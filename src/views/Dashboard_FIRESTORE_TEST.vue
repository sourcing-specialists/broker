<template>
  <div class="home">
    <h1>I am a dashboard</h1>

    <v-btn  
      color="red"
      elevation="2"
      @click="addWarehouse"
    >Add Warehouse</v-btn>

    <v-btn  
      color="blue"
      elevation="2"
      @click="getWarehouses"
    >Get all warehouses</v-btn>

    <v-btn  
      color="green"
      elevation="2"
      @click="debugWarehouses"
    >Debug warehouses</v-btn>

    <v-btn  
      color="red"
      elevation="2"
      @click="mpProducts"
    >Load MP Products</v-btn>

    <v-btn  
      color="secondary"
      elevation="2"
      @click="getProducts('Xfssynnvjgk')"
    >Find Products on Warehouse Xfssynnvjgk</v-btn>

    <v-container>
      <div v-for="p in products" :key="p.id">
        <v-row v-for="o in p.options" :key="'o'+o.id">
          <v-col>{{ p.name+o.group_name+o.group_value }}</v-col>
          <v-col>{{ p.sku+'_'+o.sku }}</v-col>
          <v-col>
            {{ getStock(p.sku+'_'+o.sku) }}
          </v-col>
          <v-col>
            <v-btn
              elevation="2"
              color="light-green"
              @click="updateProduct(p.sku, o.sku, 25)"
            >Add</v-btn>
            <v-btn
              elevation="2"
              @click="updateProduct(p.sku, o.sku, -25)"
            >Remove</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <ul>
      <li v-for="(w, index) in warehouses" :key="index">{{ w.name }}</li>
    </ul>

    <div>
      <h3>Receive Products</h3>
      <v-form ref="receive">
        <v-text-field
          label="Product Sku"
          v-model="receive.sku"
        ></v-text-field>
        <v-text-field
          label="Name"
          v-model="receive.name"
        ></v-text-field>
        <v-text-field
          label="Attribute Identifier"
          v-model="receive.attribute"
        ></v-text-field>
        <v-text-field
          label="Quantity"
          v-model="receive.qty"
        ></v-text-field>
        <v-btn
          @click="addTransaction()"
          elevation="2"
          color="orange"
          dark
        >Receive</v-btn>
      </v-form>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
  name: 'Dashboard',
  data() {
    return {
      warehouses: [],
      warehouse: 'JOuqqAwqnWmd15AHWH8b',
      products: [],
      stocks: [],
      receive: {
        sku: '95ASAY_Z830WFOY',
        name: 'Sneaky mobile zoom',
        attribute: 'A5-A89',
        qty: 10
      }
    }
  },
  methods: {
    addTransaction() {
      const existing = this.$db.collection('products').doc(this.receive.sku)
      const transaction = {
        created: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'Pending',
        products: [
          this.receive
        ],
        startedBy: 'Tomas Lucena',
        closedBy: null
      }
      this.$db.collection('transactions').add(transaction)
      existing.get().then(product => {
        if(product.exists) {
          existing.update({
            onStock: firebase.firestore.FieldValue.increment(this.receive.qty),
            [`attributes.${this.receive.attribute}`]: firebase.firestore.FieldValue.increment(this.receive.qty)
          })
        }
      })
    },
    getStock(sku) {
      const thisStock = this.stocks.find(s => s.id === sku)
      return thisStock.data().onStock
    },
    debugWarehouses() {
      console.log(this.stocks)
    },
    getWarehouses() {
      this.$db.collection('warehouses').get()
      .then(snapshot => {
        snapshot.forEach(w => {
          this.warehouses.push(w.data())
        })
      })
    },
    addWarehouse() {
      var warehouse = {
        address: 'Somewhere in Spain',
        country: 'Spain',
        name: 'Warehouse in Murcia'
      }
      this.$db.collection('warehouses').add(warehouse)
      .then( docRef => {
        console.log("Document written with ID: ", docRef.id)
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      })
    },
    mpProducts() {
      this.$http.post(this.endpoint(`catalogue/get`), { 
        cargo_id: '',
        currency: this.$store.getters.getCurrency,
        pageSize: '25',
        pageNumber: 1,
        filter: [
          {
            categories: []
          },
          {
            keywords: ''
          },
          {
            ref: ''
          },
        ]
      })
      .then( resp => {
        this.products = resp.data.data 
      })
    },
    updateProduct(psku, osku, qty) {
      const sku = psku+'_'+osku
      var update = {
        onStock: firebase.firestore.FieldValue.increment(qty),
      }
      this.$db.collection('products').doc(sku).update(update)
    },
    getProducts(warehouse) {
      console.log(warehouse)
    },
    listProducts() {

    },
    remove(key) {
      console.log(key)
    }
  },
  mounted() {
    this.$db.collection('products').where('warehouse', '==', this.$db.collection('warehouses').doc(this.warehouse))
    .onSnapshot(snapshot => {
      this.stocks = snapshot.docs
    })
  }
}
</script>
