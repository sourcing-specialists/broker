const endpoint = process.env.VUE_APP_API_ENDPOINT

const ADD_PRODUCT_TO_ORDER = endpoint+'order/:order_id/add_order_product'

export {
  ADD_PRODUCT_TO_ORDER
}