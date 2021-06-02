const SideMenu = [
  { 
    title: 'dashboard_title',
    to: '/dashboard',
    icon: 'mdi-view-dashboard',
    children: [] 
  },
  { 
    title: 'catalogue', 
    to: '', 
    icon: 'mdi-format-list-bulleted-square', 
    children: [
      {
        title: 'catalogue',
        to: '/catalogue',
        icon: 'fa-list',
        exact: true
      },
      {
        title: 'custom_lists',
        to: '/catalogue/custom-lists',
        icon: ''
      }
    ]
  },
  { 
    title: 'order', 
    to: '/orders', 
    icon: 'mdi-file-cog-outline', 
    children: [
      {
        title: 'order',
        to: '/orders',
        icon: 'fa-list',
        exact: true
      },
      {
        title: 'quotation',
        to: '/quotations',
        icon: ''
      }
    ]
  },
  { 
    title: 'shipping', 
    to: '/shipments', 
    icon: 'mdi-ferry', 
    children: [],
    meta: {
      onlyAdmin: true
    }
  },
  { 
    title: 'client', 
    to: '/companies', 
    icon: 'mdi-account-multiple', 
    children: []
  }
]

export default SideMenu