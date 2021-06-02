<template>
  <div>

    <loader v-model="loading"></loader>
    <div v-if="!production">
      <v-btn
        elevation="1"
        color="success"
        @click="generateWithFunctions"
      >{{ $t('generate') }}</v-btn>
    </div>

    <section id="customDatasheet">
      <section>
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
                  width="300"
                  class="logo"
                  src="https://mp-ypa-general.s3.ap-southeast-1.amazonaws.com/sps/preference/674/LOGO_20210120050157653949.jpg"
                >
              </td>
              <td
                :style="{
                  textAlign: 'right',
                }"
              >
                <h3 style="margin: 0px; padding: 0px;">{{ user.office.name }}</h3>
                <p style="margin: 0px; padding: 0px;">{{ user.office.address }}<br>
                {{ user.office.country }}<br>
                Tel: {{ user.office.tel }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <table
          :style="{
            width: '100%',
            marginTop: '25px'
          }"
        >
          <tbody>
            <tr>
              <td>
                <div style="margin: 0px; padding: 0px;">
                  <strong>{{ $t('customDatasheet.created_by') }}:</strong> {{ $store.getters.user.name }}
                </div>
                <p style="margin: 0px; padding: 0px;">
                  <strong>{{ $t('customDatasheet.email') }}:</strong> {{ $store.getters.user.email }}
                </p>
                <p v-if="$store.getters.user.tel !== null" style="margin: 0px; padding: 0px;">
                  <strong>{{ $t('customDatasheet.phone') }}:</strong> {{ $store.getters.user.tel_country_code }} {{ $store.getters.user.tel }}
                </p>
              </td>
              <td
                :style="{
                  textAlign: 'right'
                }"
              >
                <div><strong>{{ $t('orders.date') }}:</strong> {{ formatDate(new Date()) }}</div>
                <div v-if="productParams.incoterm !== 'REVOOLOOP'"><strong>Incoterm:</strong> {{ productParams.incoterm }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h1
          class="hide-hide"
          :style="{
            fontSize: '42px',
            textAlign: 'center',
            color: '#B71C1C',
            fontWeight: 700,
            padding: 0,
            marginTop: '25px',
            paddingBottom: '0px',
            marginBottom: '0px'
          }"
        >{{ p.title }}</h1>
        <input
          class="hide"
          :style="{
            fontSize: '42px',
            textAlign: 'center',
            color: '#B71C1C',
            fontWeight: 700,
            padding: 0,
            marginTop: '25px',
            paddingBottom: '0px',
            marginBottom: '0px'
          }"
          type="text"
          v-model="p.title"
        >
        <h3
          class="hide-hide"
          :style="{
            fontSize: '16px',
            textAlign: 'center',
            color: '#666',
            fontWeight: 700,
            marginBottom: '15px',
            marginTop: '0px',
            padding: 0,
          }"
        >{{ p.subtitle }}</h3>
        <input
          class="hide"
          :style="{
            fontSize: '16px',
            textAlign: 'center',
            color: '#666',
            fontWeight: 700,
            marginBottom: '15px',
            marginTop: '0px',
            padding: 0,
          }"
          type="text"
          v-model="p.subtitle"
        >
      </section>
      <section>
        <table>
          <tr>
            <td v-if="productImage !== null">
              <img width="300" :src="productImage">
            </td>
            <td>
              <h2 class="title">{{ product.name }}</h2>
              <p>{{ product.description }}</p>
              <div class="product_details">
                <div><strong>{{ $t('ref') }}:</strong> {{ product.status }}</div>
                <div><strong>{{ $t('origin') }}:</strong> {{ product.id }}</div>
                <div><strong>{{ $t('status') }}:</strong> {{ product.origin }}</div>
                <div><strong>{{ $t('production_time') }}:</strong> {{ product.production_time }}</div>
                <div><strong>{{ $t('hs_code') }}:</strong> {{ product.hs_code }}</div>
              </div>
            </td>
          </tr>
        </table>
      </section>
      <section>
        <h2 style="color: #B71C1C;">{{ $t('options') }}</h2>
      </section>
      <section
        class="pdf-item no-break"
        v-for="(option) in product.options"
        :key="option.id"
      >
        <table
          :style="{
            width: '100%'
          }"
        >
          <tr :class="[ { hide: !option.show } ]">
            <td style="padding: 5px; border-bottom: 1px solid #CCC;">
              <ul
                :style="{
                  padding: '0px',
                  margin: '0px'
                }"
              >
                <div class="hide"><input type="checkbox" v-model="option.show">Show option</div>
                <strong style="color: #B71C1C;">{{ option.group_name }}:</strong> {{ option.group_value }} ({{ option.ref }})
                <li><strong>{{ $t('components.products.carton_size') }}:</strong> {{ mxMeas(option) }}</li>
                <li><strong>{{ $t('moq') }}:</strong> {{ option.min_order }} {{ $tc('components.products.carton', 1) }}</li>
              </ul>
              <ul
                v-html="mxPacking(option)"
                :style="{
                  padding: '0px',
                  margin: '0px'
                }"
              ></ul>
            </td>
            <td style="padding: 5px; border-bottom: 1px solid #CCC;">
              <ul
                v-if="productParams.incoterm === 'REVOOLOOP'"
                class="price-tiers"
              >
                <template
                  v-for="(t, index) in option.tiers"
                >
                  <li :key="index"> 
                    <div v-if="t.to === 'onwards'">{{ $t('notifications.from') }} {{ t.from }} {{ $t('components.products.cartons_onwards') }}</div>
                    <div v-else>{{ t.from }} to {{ t.to }} {{ $tc('carton',2) }}</div>
                    <p>
                      <strong class="hide-hide">{{ t.cost_per_carton }}</strong>
                      <input
                        class="hide"
                        :style="{
                          fontSize: '14px',
                          textAlign: 'center',
                          color: '#666',
                          fontWeight: 700,
                          width: '100px',
                          textAlign: 'left'
                        }"
                        type="text"
                        v-model="t.cost_per_carton"
                      > / {{ $tc('components.products.carton',1) }} 
                      <br> 
                      <span class="hide-hide">{{ t.cost_per_unit }}</span>
                      <input
                        class="hide"
                        :style="{
                          fontSize: '14px',
                          textAlign: 'center',
                          color: '#666',
                          fontWeight: 700,
                          width: '100px',
                          textAlign: 'left'
                        }"
                        type="text"
                        v-model="t.cost_per_unit"
                      > / {{ $tc('components.products.unit',1) }} 
                    </p>
                  </li>
                </template>
              </ul>
              <ul
                v-if="productParams.incoterm === 'DDP'"
                class="price-tiers"
              >
                <li>
                  <p>
                    <strong class="hide-hide">{{ option.ddp_carton_sale_price_string }}</strong>
                    <input
                      class="hide"
                      :style="{
                        fontSize: '14px',
                        textAlign: 'center',
                        color: '#666',
                        fontWeight: 700,
                        width: '100px',
                        textAlign: 'left'
                      }"
                      type="text"
                      v-model="option.ddp_carton_sale_price_string"
                    > / {{ $tc('components.products.carton',1) }}
                    <br> 
                    <span class="hide-hide">{{ option.ddp_unit_sale_price_string }}</span>
                    <input
                      class="hide"
                      :style="{
                        fontSize: '14px',
                        textAlign: 'center',
                        color: '#666',
                        fontWeight: 700,
                        width: '100px',
                        textAlign: 'left'
                      }"
                      type="text"
                      v-model="option.ddp_unit_sale_price_string"
                    > / {{ option.packing_base_unit_description === '' ? option.inner_unit_text : option.packing_base_unit_description }} 
                  </p>
                </li>
              </ul>
              <ul
                v-if="productParams.incoterm === 'FOB'"
                class="price-tiers"
              >
                <li>
                   <p>
                    <strong class="hide-hide">{{ option.carton_price_string }}</strong>
                    <input
                      class="hide"
                      :style="{
                        fontSize: '14px',
                        textAlign: 'center',
                        color: '#666',
                        fontWeight: 700,
                        width: '100px',
                        textAlign: 'left'
                      }"
                      type="text"
                      v-model="option.carton_price_string"
                    > / {{ $tc('components.products.carton',1) }}
                    <br> 
                    <span class="hide-hide">{{ option.unit_price_string }}</span>
                    <input
                      class="hide"
                      :style="{
                        fontSize: '14px',
                        textAlign: 'center',
                        color: '#666',
                        fontWeight: 700,
                        width: '100px',
                        textAlign: 'left'
                      }"
                      type="text"
                      v-model="option.unit_price_string"
                    > / {{ option.packing_base_unit_description === '' ? option.inner_unit_text : option.packing_base_unit_description }} 
                  </p>
                </li>
              </ul>
            </td>
          </tr>
        </table>
      </section>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import loader from '../../components/loadingBox'

export default {
  name: 'customDatasheet',
  props: ['product_id'],
  components: { loader },
  data() {
    return {
      loading: true,
      productParams: {
        broker_id: this.$store.getters.user.id,
        cargo_id: this.$route.query.cargo_id,
        currency: this.$route.query.currency,
        incoterm: this.$route.query.incoterm,
        cargo_price: this.$route.query.cargo_price
      },
      product: {},
      production: this.$route.query.production == 1 ? true : false,
      p: {
        title: 'OFERTA',
        subtitle: 'Valida hasta el dd/mm/yyyy',
      }
    }
  },
  computed: {
    ...mapGetters(['user']),
    productImage() {
      return this.product.images && this.product.images[0] ? this.product.images[0].large : null
    }
  },
  methods: {
    generateWithFunctions() {
      this.loading = true
      var element = document.getElementById('customDatasheet')
      var styles = `
        <style>
          @page {
            size: A4;
            margin: 25pt 10pt;
          }
          .hide {
            display: none;
          }
          #customDatasheet {
            background: #FFF;
            font-family: "Helvetica", sans-serif;
            padding: 25px;
            max-width: 960px;
            margin: auto;
          }
          h1, h2, h3, h4, h5, h6, p, div, span, strong, ul {
            font-family: "Helvetica", sans-serif;
          }
          .no-break {
            page-break-inside: avoid;
          }
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
          }
          .v-divider {
            margin: 15px 0px;
          }
          input[type="text"] {
            width: 100%;
            border: 1px dotted #ccc;
          }
          .product_details {
            margin-top: 25px;
            font-size: 14px;
          }
          .product_details strong {
            color: #B71C1C;
          }
          .price-tiers {
            width: 100%;
            display: inline-grid;
            grid-template-columns: 50% 50%;
            columns: 2;
          }
          .price-tiers li {
            padding: 5px;
            position: relative;
          }
          .price-tiers li:before {
            position: absolute;
            content: " ";
            height: calc(100% - 20px);
            width: 2px;
            background-color: #ccc;
            top: 10px;
            left: -5px;
          }
          .price-tiers li.highlight:before {
            width: 5px;
            background-color: #b71c1c;
          }
          .price-tiers li.highlight span {
            color: #b71c1c;
          }
          .price-tiers p {
            margin: 0px !important;
            padding: 0px !important;
          }
          li, p {
            font-size: 12px;
          }
 
        </style>
      `
      var par = this.productParams
      axios({
        method: 'post',
        url: this.ffunctions(`generateProductPdf`),
        responseType: 'blob',
        data: {
          html: element.innerHTML+styles,
          product_id: this.product_id,
          par
        }
      }).then( res => {
        var url = URL.createObjectURL(res.data)
        this.loading = false
        window.open(url)
      })
    },
    loadProduct() {
      this.$http.post(this.endpoint(`catalogue/get/${this.product_id}`), this.productParams)
      .then(resp => {
        resp.data.data.options.map(o => {
          o.show = true
        })
        this.product = resp.data.data
        this.loading = false
      })
    }
  },
  mounted() {
    this.loadProduct()
    document.getElementById('app').style.backgroundColor = '#FFF'
    console.log(this.user)
  }
}
</script>

<style scoped>
@page {
  size: A4;
  margin: 25pt 10pt;
}
.hide-hide {
  display: none;
}
#customDatasheet {
  background: #FFF;
  font-family: "Helvetica", sans-serif;
  padding: 25px;
  max-width: 960px;
  margin: auto;
}
.no-break {
  page-break-inside: avoid;
}
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
}
.v-divider {
  margin: 15px 0px;
}
input[type="text"] {
  width: 100%;
  
}
.product_details {
  margin-top: 25px;
  font-size: 14px;
}
.product_details strong {
  color: #B71C1C;
}
</style>

