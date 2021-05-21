import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import VuePageTransition from 'vue-page-transition'

//components
import Login from '../views/Login.vue'
import Reset from '../views/Reset.vue'
import Dashboard from '../views/Dashboard.vue'
import Companies from '../views/Companies/Companies.vue'
import crudCompany from '../views/Companies/Crud.vue'
import Catalogue from '../views/Catalogue.vue'
import Orders from '../views/orders/Orders.vue'
import OrdersNew from '../views/orders/OrdersNew.vue'
import Quotations from '../views/orders/Quotations.vue'
import Account from '../views/Account.vue'
import OrderView from '../views/orders/OrderView'
import CustomLists from '../views/CustomLists'
import CustomCatalogue from '../views/public/customCatalogue'
import PublicOrder from '../views/public/PublicOrder'

Vue.use(VueRouter)
Vue.use(VuePageTransition)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/reset',
    name: 'Reset',
    component: Reset,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/public/catalogue/:id',
    name: 'showPublicCatalogue',
    props: true,
    component: CustomCatalogue,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/public/order/:id',
    name: 'showPublicOrder',
    props: true,
    component: PublicOrder,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/companies',
    name: 'Companies',
    component: Companies,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/companies/create',
    name: 'createCompany',
    component: crudCompany,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/companies/:id/edit',
    name: 'editCompany',
    component: crudCompany,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/catalogue',
    name: 'Catalogue',
    component: Catalogue,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/catalogue/custom-lists',
    name: 'CatalogueCustomLists',
    component: CustomLists,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/orders/view/:id',
    name: 'viewOrder',
    component: OrderView,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/orders/new',
    name: 'OrdersNew',
    component: OrdersNew,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/quotations',
    name: 'Quotations',
    component: Quotations,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/shipments',
    name: 'Shipments',
    component: () => import(/* webpackChunkName: "about" */ '../views/ShippingOrders.vue'),
    meta: {
      requiresAuth: true,
      onlyAdmin: true
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//validate routes and check sessions
router.beforeEach( function(to, from, next) {
  //redirect login to dashboard
  if (to.name === 'Login' && store.getters.isAuthenticated) next({ name: 'Dashboard' })
  //confirm if there is not auth require
  if(to.meta.requiresAuth === false) {
    return next()
  }
  //check if route is for only admins
  //console.log(store.getters.user)
  if(to.meta.onlyAdmin && !store.getters.user.is_admin) {
    return next(from.path)
  }
  //logout on session expired
  if (to.name !== 'Login' && !store.getters.isAuthenticated) next({ name: 'Login' })
  else next()
})

export default router
