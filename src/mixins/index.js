import { mapGetters } from 'vuex'
import { DateTime } from 'luxon'

const url = process.env.VUE_APP_API_ENDPOINT
const functions_url = process.env.VUE_APP_FUNCTIONS
const public_url = process.env.VUE_APP_URL

const mixins = {
  computed: {
    ...mapGetters('cart', {
      cartIncoterm: 'incoterm'
    }),
    ...mapGetters({
      incoterm: 'getIncoterm',
      lang: 'getLanguage'
    })
  },
  methods: {
    objectToUrlString(object) {
      let str = ''
      Object.keys(object).map( (key) => {
        str += `&${key}=${object[key]}`
      })
      return str
    },
    endpoint: function (task, noAuth = false) {
      const is_public = noAuth ? 'public/' : ''
      return url+is_public+task
    },
    buildEndpoint: function(url, data = null) {
      if(data !== null) {
        var regex = new RegExp(':(' + Object.keys(data).join('|') + ')', 'g')
        return url.replace(regex, (m, $1) => data[$1] || m)
      }
      return url
    },
    ffunctions: function(task) {
      return functions_url+task
    },
    //format packing as a list
    mxPacking(option) {
      var string = ''
      if(option.is_tree === 1) {
        var packing = option.packing_tree
        var count = []
        packing.forEach(p => {
          count.push(parseInt(p.value))
          string += `<li><span class="font-weight-bold">${p.name}:</span> ${p.value}</li>`
        })
        //string += `<li><span class="font-weight-bold">${this.$t('components.products.total_units_carton')}:</span> ${count.reduce((a, b) => a * b, 1)}</li>`
      } else {
        string = `
          <li><span class="font-weight-bold">${option.inner_unit_text}:</span> ${option.inner_units}</li>
          <li><span class="font-weight-bold">${option.outer_unit_text}:</span> ${option.outer_units}</li>
          <!--<li><span class="font-weight-bold">${this.$t('components.products.total_units_carton')}:</span> ${option.inner_units*option.outer_units}</li>-->
        `
      }
      return string
    },
    //format measurements
    mxMeas(option) {
      if(option.length === null && option.width === null && option.height === null) {
        return false
      }
      var string = `${option.length}cm x ${option.width}cm x ${option.height}cm`
      return string
    },
    //get a generic info of a product option
    mxOptionDetails(option) {
      var string = `<p><span class="font-weight-bold">${ this.$t('components.products.ref_number') }:</span> ${ option.ref }</p>`
      if(this.mxMeas(option)) {
        string += `<p><span class="font-weight-bold">${ this.$t('components.products.carton_size') }:</span> ${ this.mxMeas(option) }</p>`
      }
      if(option.weight_per_carton !== null) {
        string += `<p><span class="font-weight-bold">${ this.$t('components.products.weight') }:</span> ${ option.weight_per_carton }</p>`
      }
      if(option.description !== '') {
        const description = (option.description.length >= 100) ? (option.description.substring(0,100)+'...') : option.description
        string += `<p>${description}</p>`
      }
      return string
    },
    //format price tiers as a list
    mxPriceTiers(option, hightlight = false, inco = false, onlyFirstTier = false) {
      var string = ''
      var highlighted = ''
      var vue = this
      var thisIncoterm = inco === false ? this.incoterm : inco
      if(this.$route.name === 'OrdersNew') {
        thisIncoterm = this.cartIncoterm
      }

      var packing_outer_description = option.is_tree === 1 ? option.packing_tree[option.packing_tree.length - 1].value + ' ' + option.packing_tree[option.packing_tree.length - 1].name : vue.$tc('components.products.carton',1)
      var packing_inner_description = option.is_tree === 1 ? option.packing_tree[0].value + ' ' + option.packing_tree[0].name : vue.$tc('components.products.unit',1)

      if(thisIncoterm === 'REVOOLOOP' && option.tiers) {
        if(onlyFirstTier) {
          string+= `
            <li class="${highlighted}"> 
              <div>${option.tiers[0].from} to ${option.tiers[0].to} cartons</div>
              <p>
                <span class="font-weight-bold">${vue.$store.getters.getCurrencyText}${option.tiers[0].cost_per_carton}</span> / ${packing_outer_description} 
                <br> 
                ${vue.$store.getters.getCurrencyText}${option.tiers[0].cost_per_unit} / ${packing_inner_description}  
              </p>
            </li>`
        } else {
          option.tiers.map(function(t) {
            highlighted = (vue.checkTier(t, option.quantity) && hightlight) ? 'highlight' : ''
            if(t.to === 'onwards') {
              string+= `
                <li class="${highlighted}"> 
                  <div>From ${t.from} ${vue.$t('components.products.cartons_onwards')}</div>
                  <p>
                    <span class="font-weight-bold">${vue.$store.getters.getCurrencyText}${t.cost_per_carton}</span> / ${packing_outer_description} 
                    <br> 
                    ${vue.$store.getters.getCurrencyText}${t.cost_per_unit} / ${packing_inner_description} 
                  </p>
                </li>`
            } else {
              string+= `
                <li class="${highlighted}"> 
                  <div>${t.from} to ${t.to} cartons</div>
                  <p>
                    <span class="font-weight-bold">${vue.$store.getters.getCurrencyText}${t.cost_per_carton}</span> / ${packing_outer_description} 
                    <br> 
                    ${vue.$store.getters.getCurrencyText}${t.cost_per_unit} / ${packing_inner_description}  
                  </p>
                </li>`
            }
          })
        }
      } else if(thisIncoterm === 'DDP') {
        string = `
          <li>
            <p>
              <span class="font-weight-bold">${option.ddp_carton_sale_price_string}</span> / ${packing_outer_description} 
              <br> 
              ${option.ddp_unit_sale_price_string} / ${packing_inner_description}  
            </p>
          </li>
        `
      } else if(thisIncoterm === 'FOB') {
        //console.log(option)
        string = `
          <li>
            <p>
              <span class="font-weight-bold">${option.carton_price_string}</span> / ${packing_outer_description} 
              <br> 
              ${option.unit_price_string} / ${packing_inner_description}  
            </p>
          </li>
        `
      }
      return string
    },
    getSelectedAttributes(option) {
      var a = option.attributes_grouped.map(function(a) {
        return a['selected']
      })
      return a
    },
    buildCartProduct(product, option, attrs) {
      const idd = `${option.id}-${attrs.join('-')}` //product + attributes
      var image = (product.images[0]) ? product.images[0].small : ''
      var attributes = []
      option.attributes.map( a => {
        if(attrs.includes(a.attribute_id)) {
          attributes.push(a)
        }
      })
      return {
        id: idd,
        product_id: product.id,
        product_name: product.name,
        meas: this.mxMeas(option),
        option_id: option.id,
        option_group_name: option.group_name,
        option_group_value: option.group_value,
        inner_units: option.inner_units,
        outer_units: option.outer_units,
        min_order: option.min_order,
        cbm_per_carton: option.cbm_per_carton,
        quantity: option.quantity,
        attributes: attrs,
        attributes_data: attributes,
        tiers: option.tiers,
        cost_per_carton: this.cartIncoterm === 'DDP' ? option.ddp_carton_sale_price : option.carton_price,
        image: image,
        weight_per_carton: option.weight_per_carton
      }
    },
    checkTier(tier, quantity) {
      if(quantity >= tier.from && tier.to === 'onwards') {
        return true
      }
      return (quantity >= tier.from && quantity < tier.to) ? true : false
    },
    getTier(tiers, quantity) {
      //find price tier
      const tier = tiers.filter(function(p) {
        if(p.to === 'onwards') {
          return quantity >= p.from
        }
        return quantity >= p.from && quantity < p.to
      })
      return tier[0]
    },
    countDecimals(n) {
      // Convert to String
      const numStr = String(n)
      // String Contains Decimal
      if (numStr.includes('.')) {
          return numStr.split('.')[1].length
      }
      // String Does Not Contain Decimal
      return 0
    },
    numberToNiceString(n, currency = 'USD', maxDecimals = null) {
      //get the nice decimals
      let decimals = maxDecimals
      if(maxDecimals === null) {
        decimals = 2
        if(this.countDecimals(n) >= 4) {
          decimals = 4
        }
        if(this.countDecimals(n) == 3) {
          decimals = 3
        }
      }
      var formatter = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: decimals
      })
      return `${formatter.format(n)}`
    },
    formattedNumber(n) {
      const num = this.fixDigits(n)
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    fixDigits(n) {
      return Math.round(n*100)/100
    },
    round(n, decimals = 4) {
      var ceros = Math.pow(10, decimals)
      return Math.round((n + Number.EPSILON) * ceros) / ceros
    },
    stageColor(stage, hex = false) {
      switch (stage) {
        case 'pending':
          return hex ? '#B71C1C' : 'red darken-4'
        case 'waiting_for_customer_confirmation':
          return hex ? '#3F51B5' : 'indigo'
        case 'require_deposit':
          return hex ? '#3F51B5' : 'indigo'
        case 'production':
          return hex ? '#4CAF50' : 'green'
        case 'quality_control':
          return hex ? '#673AB7' : 'deep-purple'
        case 'collection':
          return hex ? '#00BCD4' : 'cyan'
        case 'shipped':
          return hex ? '#0D47A1' : 'blue darken-4'
        case 'on_ship':
          return hex ? '#0D47A1' : 'light-blue'
        case 'delivered':
          return hex ? '#FFC107' : 'amber'
        default:
          return ''
      }
    },
    stageIcon(stage) {
      var icon = ''
      switch (stage) {
        case 'pending':
          icon += 'mdi-account-cog-outline'
          break
        case 'waiting_for_customer_confirmation':
          icon += 'mdi-clock-outline'
          break
        case 'require_deposit':
          icon += 'mdi-clock-outline'
          break
        case 'production':
          icon += 'mdi-factory'
          break
        case 'quality_control':
          icon += 'mdi-magnify-scan'
          break
        case 'collection':
          icon += 'mdi-truck'
          break
        case 'shipped':
          icon += 'mdi-ferry'
          break
        case 'on_ship':
          icon += 'mdi-ferry'
          break
        case 'delivered':
          icon += 'amber'
          break
        default:
          icon += ''
          break
      }
      return icon
    },
    formatDate(string) {
      var dMain = new Date(string)
      var d = DateTime.fromJSDate(dMain, { locale: this.$store.getters.getLanguage })
      return d.toLocaleString(DateTime.DATE_MED)
    },
    fillArray(value, len) {
      var arr = [];
      for (var i = 0; i < len; i++) {
        arr.push(value);
      }
      return arr;
    },
    copyToClipboard(text, is_url = false) {
      if(is_url) {
        var url = public_url+text
        const el = document.createElement('textarea');
        el.value = url;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.$toasted.success(this.$t('link_copied'))
      }
    },
    paymentStatusString(n) {
      if(n == 1) {
        return this.$t('payment.pending')
      } else if(n == 2) {
        return this.$t('payment.paid')
      }
      return ''
    },
    buildNotification(n) {

      var data = n.data
      
      var link = data.linked_model_id
      var order = data.order_number ?? null
      var text = ''
      var details = ''
      var by = data.by_name

      switch(n.key_id) {
        case 'order_created':
          text = this.$t('notifications.order_created', { type: data.order_type })
          break
        case 'order_artworks_confirmed':
          return null //this has to be deleted when I handle this notification case and add BREAK below like the others
        case 'order_documents_uploaded':
          text = this.$t('notifications.order_documents_uploaded', { document: data.file_type })
          break
        case 'order_inspection_confirmed':
          return null //this has to be deleted when I handle this notification case and add BREAK below like the others
        case 'order_inspection_document_uploaded':
          return null //this has to be deleted when I handle this notification case and add BREAK below like the others
        case 'order_product_created':
          text = this.$t('notifications.order_product_created_title', { product_name: data.product_name ?? null })
          break
        case 'order_product_deleted':
          text = this.$t('notifications.order_product_deleted_title', { product_name: data.product_name ?? null })
          break
        case 'order_product_design_uploaded':
          return null //this has to be deleted when I handle this notification case and add BREAK below like the others
        case 'order_product_purchase_price_changed':
          return null //this has to be deleted when I handle this notification case and add BREAK below like the others
        case 'order_product_quantity_updated':
          return null //this has to be deleted when I handle this notification case and add BREAK below like the others
        case 'order_product_sale_price_changed':
          return null //this has to be deleted when I handle this notification case and add BREAK below like the others
        case 'order_product_updated':
          text = this.$t('notifications.order_product_updated_title', { product_name: data.product_name ?? null })
          break
        case 'order_status_changed':
          text = this.$t('notifications.order_status_changed')
          details = `${this.$t('notifications.from')} <strong>${ data.stage_from ?? null }</strong> ${this.$t('notifications.to')} <strong>${ data.stage_to ?? null }</strong>`
          break
        case 'order_payment_status_changed':
          text = this.$t('notifications.order_payment_status_changed')
          var from = data.payment_status_from ?? null
          var to = data.payment_status_to ?? null
          details = `
            ${this.$t('notifications.from')} <strong>${this.paymentStatusString(from)}</strong> 
            ${this.$t('notifications.to')} <strong>${this.paymentStatusString(to)}</strong>
          `
          break
        case 'order_payment_created':
          text = this.$t('notifications.order_payment_created')
          break
        case 'product_created':
          text = this.$t('notifications.product_created', { product_name: data.product_name })
          break
        case 'product_price_updated':
          text = this.$t('notifications.product_price_updated', { product_name: data.product_name })
          break
        case 'product_updated':
          text = this.$t('notifications.product_updated', { product_name: data.product_name })
          break
        case 'production_time_updated':
          return null //this has to be deleted when I handle this notification case and add BREAK below like the others
        case 'supplier_updated_po':
          return null //this has to be deleted when I handle this notification case and add BREAK below like the others
      }

      return {
        id: n.id,
        link: link,
        order: order,
        text: text,
        details: details,
        by: by
      }

    }
  },
}

export default mixins