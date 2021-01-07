import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

//components
//import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    component: Login,
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
router.beforeEach((to, from, next) => {
  //console.log(store.state.isAuthenticated)
  if (to.name !== 'Login' && !store.getters.isAuthenticated) next({ name: 'Login' })
  else next()
})

export default router
