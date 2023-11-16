import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/user/Login.vue'
import Signup from '../views/user/Signup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name:'login',
      component: Login
    },
    {
      path: '/signup',
      name:'signup',
      component: Signup
    }
  ]
})

export default router
