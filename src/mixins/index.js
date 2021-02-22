import { mapGetters } from 'vuex'

const url = process.env.VUE_APP_API_ENDPOINT
const functions_url = process.env.VUE_APP_FUNCTIONS

const mixins = {
  computed: {
    ...mapGetters({
      cartProducts: 'products'
    })
  },
  methods: {
    endpoint: function (task, noAuth = false) {
      const is_public = noAuth ? 'public/' : ''
      return url+is_public+task
    },
    ffunctions: function(task) {
      return functions_url+task
    },
    //format packing as a list
    mxPacking(option) {
      var string = `
        <li><span class="font-weight-bold">${option.inner_unit_text}:</span> ${option.inner_units}</li>
        <li><span class="font-weight-bold">${option.outer_unit_text}:</span> ${option.outer_units}</li>
        <li><span class="font-weight-bold">Total Units Carton:</span> ${option.inner_units*option.outer_units}</li>
      `
      return string
    },
    //format measurements
    mxMeas(option) {
      var string = `${option.length}cm x ${option.width}cm x ${option.height}cm`
      return string
    },
    //format price tiers as a list
    mxPriceTiers(option, hightlight = false) {
      var string = ''
      var highlighted = ''
      var vue = this
      option.tiers.map(function(t) {
        highlighted = (vue.checkTier(t, option.quantity) && hightlight) ? 'highlight' : ''
        if(t.to === 'onwards') {
          string+= `
            <li class="${highlighted}"> 
              <div>From ${t.from} cartons onwards</div>
              <p>
                <span class="font-weight-bold">${vue.$store.getters.getCurrencyText}${t.cost_per_carton}</span> / carton 
                <br> 
                ${vue.$store.getters.getCurrencyText}${t.cost_per_unit} / unit
              </p>
            </li>`
        } else {
          string+= `
            <li class="${highlighted}"> 
              <div>${t.from} to ${t.to} cartons</div>
              <p>
                <span class="font-weight-bold">${vue.$store.getters.getCurrencyText}${t.cost_per_carton}</span> / carton 
                <br> 
                ${vue.$store.getters.getCurrencyText}${t.cost_per_unit} / unit
              </p>
            </li>`
        }
      })
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
        tiers: option.tiers,
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
    cargoHasSpace(space, product) {
      if(space > (product.cbm_per_carton*product.quantity)) {
        return true
      }
      return false
    }
  },
}

export default mixins