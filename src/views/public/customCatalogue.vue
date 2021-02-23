<template>
  <div>
    <div ref="wrapper" id="customCatalogue">
      <table
        :style="{
          width: '100%'
        }"
      >
        <tbody>
          <tr>
            <td
              :style="{
                width: '300px'
              }"
            >
              <img
                class="logo"
                src="../../assets/images/logo-color.jpg"
              >
            </td>
            <td
              :style="{
                textAlign: 'right'
              }"
            >
              <h3>Sourcing Specialists Ltd.</h3>
              <p>Office 605, 6/F, Hua Fu Commercial Bldg<br>
              111 Queen's Road West, Sheung Wan<br>
              Hong Kong<br>
              Tel: +852 8888 8888</p>
            </td>
          </tr>
        </tbody>
      </table>
      <v-container>
        <v-row>
          <h1 class="title">{{ list.name }}</h1> 
        </v-row>
      </v-container>
      <v-container>
        <div
          class="product_row"
          v-for="product in list.products"
          :key="`product_${product.id}`"
        >
          <v-row>
            <div
              :style="{
                width: '25%',
                border: '3px solid #CCC',
                borderRadius: '15px',
                display: 'inline-table',
                marginTop: '15px'
              }"
            >
              <img
                :src="getImage(product)"
                :style="{
                  borderRadius: '11px',
                  display: 'block'
                }"
              >
            </div>
            <div
              :style="{
                width: '75%',
                padding: '15px'
              }"
            >
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <ul
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }"
              >
                <li>
                  <span style="font-weight: 700;">{{ $t('ref') }}: </span>{{ product.ref }}
                </li>
                <li>
                  <span style="font-weight: 700;">{{ $t('origin') }}: </span>{{ product.origin }}
                </li>
                <li>
                  <span style="font-weight: 700;">{{ $t('production_time') }}: </span>{{ product.production_time }} {{ $tc('day', product.production_time)}}
                </li>
                <li>
                  <span style="font-weight: 700;">{{ $t('hs_code') }}: </span>{{ product.hscode.number }}
                </li>
              </ul>
              <table class="options-table">
                <thead>
                  <tr>
                    <th>{{ $t('ref_ab') }}</th>
                    <th>{{ $tc('option', 1) }}</th>
                    <th>{{ $t('packing') }}</th>
                    <th>{{ $t('moq') }}</th>
                    <th v-if="list.display_price === 1">{{ $t('price') }} FOB</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="option in product.options"
                    :key="`option_${option.id}`"
                  >
                    <td>{{ option.ref }}</td>
                    <td>{{ option.group_name }}: {{ option.group_value }}</td>
                    <td v-html="mxPacking(option)"></td>
                    <td>{{ option.min_order }} {{ $tc('carton', option.min_order) }}</td>
                    <td v-if="list.display_price === 1">{{ getCurrencyText }} {{ option.sale_price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-row>
          <v-divider></v-divider>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
const html2pdf = require('html2pdf.js')

export default {
  name: 'customCatalogue',
  props: ['id'],
  data() {
    return {
      list: {}
    }
  },
  methods: {
    ...mapGetters([
      'getCurrencyText'
    ]),
    getImage(product) {
      if(product.images.length > 0) {
        return product.images[0].small
      }
    },
    download() {
      const element = document.getElementById('customCatalogue')
      html2pdf().from(element).save();
    }
  },
  beforeMount() {
    axios.get(this.endpoint(`my_catalogues/${this.id}`, true))
    .then( resp => {
      this.list = resp.data.data.catalogue
      console.log(this.list)
    })
  }
}
</script>

<style lang="scss">
@page {
  size: A4;
  margin: 25pt 10pt;
}
#customCatalogue {
  font-family: "Roboto", sans-serif;
  li {
    list-style-type: none !important;
  }
  .logo {
    margin-left: -15px;
    width: 100%;
    height: auto;
  }
  .title {
    color: #B71C1C !important;
    font-size: 38px !important;
  }
  .v-divider {
    margin: 15px 0px;
  }
  .product_row {
    page-break-inside: avoid;
    img {
      width: 100%;
      height: auto;
    }
    .row {
      padding-bottom: 15px;
    }
    .options-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      th {
        padding: 3px;
        text-align: left;
        background: #E2E2E2;
        border: 1px solid #CCC;
      }
      td {
        border: 1px solid #CCC;
        padding: 5px;
      }
    }
  }
}
</style>