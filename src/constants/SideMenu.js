const SideMenu = [
  { 
    title: 'dashboard',
    to: '/dashboard',
    icon: 'fa-chart-pie',
    children: [] 
  },
  { 
    title: 'catalogue', 
    to: '', 
    icon: 'fa-list', 
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
    icon: 'fa-boxes', 
    children: []
  },
  { 
    title: 'client', 
    to: '/companies', 
    icon: 'fa-users', 
    children: []
  }
]

export default SideMenu