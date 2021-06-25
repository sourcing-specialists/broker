const endpoint = process.env.VUE_APP_API_ENDPOINT

const ADD_PRODUCT_TO_ORDER = endpoint+'order/:order_id/add_order_product'

//reports
const SALES_BY_BROKER = endpoint+'reports/sales_by_broker'

export {
  ADD_PRODUCT_TO_ORDER,
  SALES_BY_BROKER
}