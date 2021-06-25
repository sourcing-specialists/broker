const messages = {
  dashboard_title: 'Dashboard',
  catalogue: 'Catalogue',
  custom_lists: 'Custom lists',
  order: 'Order | Orders',
  client: 'Client | Clients',
  zone: 'Zone | Zones',
  address: 'Address',
  warehouse: 'Warehouse | Warehouses',
  required_deposit: 'Required deposit',
  credit_days: 'Credit days',
  save_changes: 'Save changes',
  users: 'User | Users',
  product: 'Product | Products',
  option: 'Option | Options',
  item_selected: 'Item selected | Items selected',
  item_removed: '{qty} item removed | {qty} items removed',
  delete: 'Delete',
  delete_question: 'Delete item?',
  show_prices: 'Show prices',
  show_hide_price: 'Show or hide prices',
  packing: 'Packing',
  price: 'Price',
  moq: 'Min Order',
  ref: 'Reference',
  ref_ab: 'Ref',
  origin: 'Origin',
  destination: 'Destination',
  production_time: 'Production time',
  hs_code: 'HS Code',
  carton: 'Carton | Cartons',
  day: 'Day | Days',
  products: 'Products',
  mandatory_field: 'This field is mandatory',
  search: 'Search',
  select: 'Select',
  categories: 'Categories',
  product_name: 'Product name',
  download: 'Download',
  currency: 'Currency',
  friendly_error: 'Sorry, something went wrong',
  price_tiers: 'Price tiers',
  something_wrong: 'Something went wrong',
  password_length: 'Password min length is 8 characteres',
  password_unmatch: 'Passwords does not match',
  required: 'Field required',
  password: 'Password',
  password_confirmation: 'Password confirmation',
  email: 'Email',
  reset: 'Reset',
  reset_success: 'Your password has been changed',
  forgot_reset_success: 'An email has been sent to the specified address.',
  forgot_password: 'Forgot password',
  login: 'Login',
  remember_me: 'Remember me',
  yes: 'Yes',
  field_required: 'Field required',
  cost: 'Cost',
  no_products: 'No products match the selected criteria',
  export: 'Export',
  customer: 'Customer',
  stage: 'Stage',
  payments: 'Payments',
  inspections: 'Inspections',
  total: 'Total',
  outstanding: 'Outstanding',
  quantity: 'Quantity',
  cbm: 'CBM',
  created: 'Created',
  reason: 'Reason',
  due_date: 'Due date',
  status: 'Status',
  paid_at: 'Paid at',
  amount: 'Amount',
  all: 'All',
  company: 'Company',
  cutoff_date: 'Cut off date',
  cargo_price: 'Cargo price',
  cargo_price_explain: 'To calculate DDP price the system must know the cargo price. Please specify the cargo price in this field before exporting the datasheet.',
  export_options: 'Export options',
  no_number: 'This field only allows numbers and .',
  cancel: 'Cancel',
  confirm: 'Confirm',
  edit_payment: 'Edit payment',
  remarks: 'Remarks',
  refresh: 'Refresh',
  link_copied: 'Link copied',
  view_file: 'View file',
  designs: 'Designs',
  confirm_delete: 'Are you sure you want to delete this item?',
  quotation: 'Quotation | Quotations',
  shipping: 'Shipping orders',
  documents: 'Documents',
  customize: 'Customize',
  options: 'Options',
  search_categories: 'Search categories',
  //new
  name: 'Name',
  //end new
  charts: {
    top_clients_purchases: 'Top clients purchases',
    confirm_sales_in: 'Confirmed sales in',
    pending_sales_in: 'Pending sales in',
    sales: 'Sales - Confirmed vs Pending',
    pending: 'Pending',
    confirmed: 'Confirmed',
    orders_status: 'Sales by order status',
    top_product_sales: 'Sales by Top Products',
    total_confirmed: 'Total confirmed',
    total_pending: 'Total Pending',
    total_sales: 'Total sales',
    //new
    sales_by_broker: 'Brokers performance',
    companies_created: 'Companies created',
    assigned_total_sales: 'Sales assigned',
    fellow_total_sales: 'Sales brokers',
    created_total_sales: 'Sales created',
    cbm_sold: 'Cbm Sold'
    //emd mew
  },
  dashboard: {
    coming_events: 'Coming events',
  },
  orders: {
    pending: 'Pending',
    waiting_customer: 'Waiting customer confirmation',
    production: 'Production',
    quality_control: 'Quantily control',
    collection: 'Collection',
    shipped: 'Shipped',
    delivered: 'Delivered',
    place_at: 'Placed at',
    estimated_delivery: 'Estimated delivery',
    terms: 'Terms',
    no_payments: 'You have no payments registered at the moment.',
    no_inspections: 'You have no inspections schedule at the moment.',
    pass: 'Pass',
    date: 'Date',
    inspector: 'Inspector',
    result: 'Result',
    incoterm: 'Incoterm',
    transport: 'Transport',
    sea: 'Sea',
    air: 'Air',
    select_cargo: 'Please chose a cargo',
    cbm_used_vs_free: 'used out of',
    weight_used_vs_free: 'kg out of',
    confirm_settings: 'Confirm settings',
    please_confirm: 'Please confirm',
    changing_incoterm_confirmation_text: 'Changing the incoterm on started orders will result in the loss of all the products in your cart. Are you sure you want to proceed?',
    cart: 'Cart',
    clear_cart: 'Clear cart',
    create_order: 'Create order',
    order_incoterm: 'Order incoterm',
    public_url: 'Public link',
    cbm_per_carton: 'CBM per carton',
    box_size: 'Box size',
    subtotal: 'Subtotal',
    distribution_cost: 'Distribution cost',
    available: 'available',
    estimated_departure: 'Estimated departure',
    add_design: 'Add design',
    edit_product: 'Edit Product',
    product_design_name: 'File title',
    product_design_file: 'Select file',
    design_uploaded: 'Design uploaded',
    design_deleted: 'Design deleted',
    logistics_details: 'Logistics details',
    order_assigned_to: 'This order is not assigned to any cargo | This order is assigned to 1 cargo | This order is assigned to {n} cargos',
    quantity_exceed: 'Quantity exceeds container space',
    no_cargos_assigned: 'This order has no cargos assigned',
    expiring_at: 'Expiring at',
    expired: 'Expired',
    all_orders: 'All orders',
    only_active: 'Only active orders',
    save_as_quotation: 'Save as quotation',
    select_delivery_date: 'Delivery date',
    order_before: 'Order before',
    convert_to_order: 'Convert to order',
    products_in_cart: 'Products in cart',
    arrival_date: 'Arrival date',
    bl_number: 'Bill of landing',
    departure_date: 'Departure date',
    transportation: 'Transportation',
    notes: 'Notes',
    //new
    add_product: 'Add product',
    search_your_product: 'Search your product',
    product_added: 'Product has been added',
    deleting_confirmation_text: 'The product will be deleted from the order, are you sure?',
    cargos: 'Cargos',
    container_number: 'Container number',
    on_the_way: 'On the way',
    arrived: 'Arrived',
    waiting_for_departure: 'Waiting for departure'
    //end new
  },
  validation: {
    this_field_required: 'This field is required',
    email_is_required: 'Email is required',
    please_input_a_valid_email: 'Please input a valid email',
    this_email_is_not_available: 'This email is not available'
  },
  components: {
    hide_price: 'Hide price',
    delivery_date: 'Delivery date',
    export_options: 'Export options',
    select_currency: 'Select currency',
    select_language: 'Select languange',
    select_incoterm: 'Select incoterm',
    set_price: 'Set new price',
    export_history: 'Export History',
    companies: {
      company_details: 'Company Details',
      company_name: 'Company name',
      business_registration_number: 'Business registration number',
      please_white_while_we_load_the_zones: 'Please wait while we load the zones',
      please_wait_while_we_load_the_warehouses: 'Please wait while we load the warehouses',
      preferred_currency: 'Preferred currency',
      please_wait_while_we_load_the_currencies: 'Please wait while we load the currencies',
      user_name: 'User name',
      user_email: 'User email',
      notify_user: 'Notify user',
      create_company: 'Create company',
      company_created_successfully: 'Company created successfully',
      company_updated: 'Company updated',
      categories_interest: 'Categories interest'
    },
    products: {
      total_units_carton: 'Total units',
      cartons_onwards: 'cartons onwards',
      carton: 'carton | cartons',
      unit: 'unit | units',
      ref_number: 'Ref Number',
      weight: 'Weight (kg)',
      carton_size: 'Carton size',
      certificate_name: 'Certificate name',
      certificates: 'Certificates',
      add_to_existing_catalogue: 'Add to existing catalogue',
      add: 'Add',
      new_catalogue: 'New catalogue',
    }
  },
  views: {
    orders: {
      order_settings: 'Order settings',
      add_items: 'Select items',
      confirm_order: 'Confirm order',
      start_new_order: 'Start new order',
      continue_order: 'Continue order',
      confirm_order_pay: 'Confirm & take deposit',
    },
    lists: {
      no_lists_text: 'Seems you do not have any lists yet. Please go to the catalogue and create your first list from there.',
      show_products: 'Show products',
      hide_product: 'Hide product | Hide products',
      download_list: 'Download list',
      list_updated: 'List updated',
      list_removed: 'List removed',
      delete_list: 'Delete list',
      save_current_sequence: 'Save sequence',
      new_sequence_saved: 'Sequence saved'
    },
    catalogue: {
      catalogue_subheader: 'Full list of products available. Please note that prices are filterd according to the delivery date.',
      page_size: 'Products per page',
    },
    companies: {
      create_new: 'Create a new company',
      editing: 'Edit company',
      companies: 'Companies',
      subtitle: 'Manage companies and users',
      br_number: 'Br Number',
      zone: 'Zone',
      create_user: 'Create user',
      edit_user: 'Edit user',
      set_new_password: 'Set new password',
      notify_user: 'Notify user?',
      update_user: 'Update user',
      add_user: 'Add user',
    }
  },
  payment: {
    create_payment: 'Create new payment request',
    payment_updated_successfully: 'Payment updated',
    payment_created_successfully: 'Payment created',
    deposit: 'Deposit',
    balance: 'Balance',
    pay_now: 'Pay now',
    full_name: 'Full name',
    secure_payments: 'Secure payments powered by',
    pay_by_credit_card: 'Pay by credit card',
    pay_by_transfer: 'Pay by transfer',
    payment_options: 'Payment options',
    payment_successful: 'Payment was successful',
    payment_type: 'Payment type',
    notify_client_payment_done: 'Notify client of payment received?',
    notify_client_payment_request: 'Notify client of this new request?',
    confirm_payment: 'Confirm payment',
    pending: 'Pending',
    paid: 'Paid'
  },
  notifications: {
    notifications_center: 'Notifications center',
    orders_notifications: 'Order notifications',
    payments_notifications: 'Payment notifications',
    catalogue_notifications: 'Catalogue notifications',
    order_product_updated_title: 'Product <strong class="mColor-text">{product_name}</strong> has been updated.',
    done_by: 'By {user}.',
    clear_all: 'Clear all',
    order_payment_created: 'New payment request',
    order_status_changed: 'Order status has changed',
    order_documents_uploaded: 'A new <strong class="mColor-text">{document}</strong> has been uploaded.',
    order_created: 'New {type} created',
    from: 'From',
    to: 'to',
    order_payment_status_changed: 'Payment status has changed',
    order_product_created_title: 'Product <strong class="mColor-text">{product_name}</strong> has been added.',
    order_product_deleted_title: 'Product <strong class="mColor-text">{product_name}</strong> has been deleted.',
    product_created: '<strong class="mColor-text">{product_name}</strong> has been added to the system',
    product_price_updated: 'The PRICE of <strong class="mColor-text">{product_name}</strong> has been updated',
    product_updated: 'Product <strong class="mColor-text">{product_name}</strong> has been modified'
  },
  customDatasheet: {
    show_header: 'Show header',
    image_for_reference_only: 'This image is for reference only',
    created_by: 'Created by',
    phone: 'Phone',
    email: 'Email'
  }
}

export default messages