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
    children: []
  },
  { 
    title: 'client', 
    to: '/companies', 
    icon: 'mdi-account-multiple', 
    children: []
  }
]

export default SideMenu