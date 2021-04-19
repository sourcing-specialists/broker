const messages = {
  dashboard_title: 'Tablero',
  catalogue: 'Catálogo',
  custom_lists: 'Listas personalizadas',
  order: 'Orden | Órdenes',
  client: 'Cliente | Clientes',
  zone: 'Zona | Zonas',
  address: 'Dirección',
  warehouse: 'Almacén | Almacenes',
  required_deposit: 'Deposito Requerido',
  credit_days: 'Días de credito',
  save_changes: 'Guardar cambios',
  users: 'Usuario | Usuarios',
  product: 'Producto | Productos',
  option: 'Opción | Opciones',
  item_selected: 'Artículo seleccionado | Artículos seleccionados',
  item_removed: '{qty} artículo removido | {qty} artículos removidos',
  delete: 'borrar',
  delete_question: 'Borrar artículos?',
  show_prices: 'Mostrar precios',
  show_hide_price: 'Mostrar o no los precios',
  packing: 'Empaque',
  price: 'Precio',
  moq: 'Min orden',
  ref: 'Referencia',
  ref_ab: 'Ref',
  origin: 'Origen',
  production_time: 'Tiempo de producción',
  hs_code: 'Código HS',
  carton: 'Cartón | Cartones',
  day: 'Día | Días',
  products: 'Productos',
  mandatory_field: 'Este campo es oligatorio',
  search: 'Buscar',
  select: 'Seleccionar',
  categories: 'Categorias',
  product_name: 'Nombre del producto',
  download: 'Descargar',
  generate: 'Generar',
  currency: 'Moneda',
  friendly_error: 'Algo salio mal, intenta mas tarde',
  price_tiers: 'Precios por nivel',
  something_wrong: 'Algo salio mal, intenta mas tarde',
  password_length: 'La contraseña necesita 8 caracteres',
  password_unmatch: 'Las contraseñas no coinciden',
  required: 'Campo requerido',
  password: 'Contraseña',
  password_confirmation: 'Confirmar contraseña',
  email: 'Correo electronico',
  reset: 'Restaurar',
  reset_success: 'Ha actualizado su contraseña exitosamente',
  forgot_reset_success: 'Hemos enviando un mail al correo especificado.',
  forgot_password: 'Olvidaste tu contraseña',
  login: 'Iniciar sesión',
  remember_me: 'Recordarme',
  yes: 'Si',
  field_required: 'Campo requerido',
  cost: 'Costo',
  no_products: 'No se encontraron productos',
  export: 'Exportar',
  customer: 'Cliente',
  stage: 'Estado',
  payments: 'Pagos',
  inspections: 'Inspecciones',
  total: 'Total',
  outstanding: 'Monto pendiente',
  quantity: 'Cantidad',
  cbm: 'CBM',
  created: 'Creada',
  reason: 'Razón',
  due_date: 'Vencimiento',
  status: 'Estado',
  paid_at: 'Pagado',
  amount: 'Monto',
  all: 'Todas',
  company: 'Compañía',
  cutoff_date: 'Día de corte',
  charts: {
    top_clients_purchases: 'Compras mejores clientes',
    confirm_sales_in: 'Compras confirmadas en',
    pending_sales_in: 'Compras pendientes en',
    sales: 'Ventas - Confirmadas vs Pendientes',
    pending: 'Pendientes',
    confirmed: 'Confirmadas',
    orders_status: 'Ventas por estado de orden',
    top_product_sales: 'Mejores ventas por producto',
    total_confirmed: 'Total confirmadas',
    total_pending: 'Total Pendientes'
  },
  dashboard: {
    coming_events: 'Próximos eventos',
  },
  orders: {
    pending: 'Pendiente',
    waiting_customer: 'Esperando confirmación del cliente',
    production: 'Producción',
    quality_control: 'Control de calidad',
    collection: 'Recolección',
    shipped: 'Enviado',
    delivered: 'Entregado',
    place_at: 'Fecha de creación',
    estimated_delivery: 'Entrega estimada',
    terms: 'Términos',
    no_payments: 'No hay pagos registrados hasta el momento.',
    no_inspections: 'No hay ninguna inspección en la agenda por el momento.',
    pass: 'Aprovada',
    date: 'Fecha',
    inspector: 'Inspector',
    result: 'Resultado',
    incoterm: 'Incoterm',
    transport: 'Transporte',
    sea: 'Mar',
    air: 'Aire',
    select_cargo: 'Seleccionar cargo',
    cbm_used_vs_free: 'usado de',
    confirm_settings: 'Confirmar configuración',
  },
  validation: {
    this_field_required: 'Este campo es obligatorio',
    email_is_required: 'Email es obligatorio',
    please_input_a_valid_email: 'Agregue un email valido',
    this_email_is_not_available: 'Este email no esta disponible'
  },
  components: {
    hide_price: 'Ocultar precio',
    delivery_date: 'Fecha de entrega',
    export_options: 'Opciones para exportar',
    select_currency: 'Moneda',
    select_language: 'Idioma',
    select_incoterm: 'Incoterm',
    set_price: 'Precio del contenedor',
    export_history: 'Archivos generados previamente',
    companies: {
      company_details: 'Detalles de la compañia',
      company_name: 'Nombre de la compañia',
      business_registration_number: 'Número de registro',
      please_white_while_we_load_the_zones: 'Espera mientras cargamos las zonas',
      please_wait_while_we_load_the_warehouses: 'Espera mientras cargamos los almacenes',
      preferred_currency: 'Moneda preferida',
      please_wait_while_we_load_the_currencies: 'Espera mientras cargamos las monedas',
      user_name: 'Nombre del usuario',
      user_email: 'Email',
      notify_user: 'Notificar',
      create_company: 'Crear compañia',
      company_created_successfully: 'Compañia creada exitosamente',
      company_updated: 'Compañia actualizada'
    },
     products: {
      total_units_carton: 'Total unidades por carton',
      cartons_onwards: 'cartones en adelante',
      carton: 'cartón | cartones',
      unit: 'unidad | unidades',
      ref_number: 'Número referencia',
      weight: 'Peso (kg)',
      carton_size: 'Tamaño de la caja',
      certificate_name: 'Nombre del certificado',
      certificates: 'Certificados',
      add_to_existing_catalogue: 'Agregar a catálogo existente',
      add: 'Agregar',
      new_catalogue: 'Catálogo nuevo',
    }
  },
  views: {
    orders: {
      order_settings: 'Order settings',
      add_items: 'Select items',
      confirm_order: 'Confirm'
    },
    lists: {
      no_lists_text: 'Al parecer no tienes ninguna lista todavia. Por favor ve a la sección de catalogos y crea tu primera lista.',
      show_products: 'Mostrar productos',
      hide_product: 'Esconder producto | Esconder productos',
      download_list: 'Descargar lista',
      list_updated: 'Lista actualizada',
      list_removed: 'Lista removida',
      delete_list: 'Borrar lista',
      save_current_sequence: 'Guardar secuencia',
      new_sequence_saved: 'Secuencia guardada'
    },
    catalogue: {
      catalogue_subheader: 'Lista completa de productos disponibles de acuerdo a la fecha de entrega.'
    }
  },
}

export default messages