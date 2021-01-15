import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import VuePageTransition from 'vue-page-transition'

//components
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Companies from '../views/Companies/Companies.vue'
import crudCompany from '../views/Companies/Crud.vue'
import Catalogue from '../views/Catalogue.vue'
import Orders from '../views/Orders.vue'
import Account from '../views/Account.vue'

Vue.use(VueRouter)
Vue.use(VuePageTransition)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
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
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: {
      requiresAuth: true
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
  if (to.name !== 'Login' && !store.getters.isAuthenticated) next({ name: 'Login' })
  else next()
})

export default router
