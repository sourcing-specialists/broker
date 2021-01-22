const url = process.env.VUE_APP_API_ENDPOINT

const mixins = {
  methods: {
    endpoint: function (task) {
      return url+task
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
    mxPriceTiers(option) {
      var string = ''
      var vue = this
      option.tiers.map(function(t) {
        string+= `
        <li> 
          <div>${t.from} to ${t.to} cartons</div>
          <p>
            <span class="font-weight-bold">${vue.$store.getters.getCurrencyText}${t.cost_per_carton}</span> / carton 
            <br> 
            ${vue.$store.getters.getCurrencyText}${t.cost_per_unit} / unit</p>
        </li>`
      })
      return string
    },
    buildCartProduct(product, option, attrs) {
      const tier = this.getTier(option.tiers, option.quantity)
      return {
        id: `${option.id}-${attrs.join('-')}`,
        product_id: product.id,
        product_name: product.name,
        option_id: option.id,
        option_group_name: option.group_name,
        option_group_value: option.group_value,
        inner_units: option.inner_units,
        outer_units: option.outer_units,
        cbm_per_carton: option.cbm_per_carton,
        quantity: option.quantity,
        tiers: option.tiers,
        price: tier,
        subtotal: this.fixDigits(tier.cost_per_unit*option.inner_units*option.outer_units*option.quantity),
        formatted_subtotal: this.formattedNumber(tier.cost_per_unit*option.inner_units*option.outer_units*option.quantity)
      }
    },
    getTier(tiers, quantity) {
      //find price tier
      const tier = tiers.filter(function(p) {
        return quantity >= p.from && quantity <= p.to
      })
      return tier[0]
    },
    formattedNumber(n) {
      const num = this.fixDigits(n)
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    fixDigits(n) {
      return Math.round(n*100)/100
    }
  }
}

export default mixins