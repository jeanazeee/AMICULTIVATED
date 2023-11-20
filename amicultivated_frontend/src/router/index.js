import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/user/Login.vue'
import Signup from '../views/user/Signup.vue'
import RoomStarting from '../views/game/RoomStarting.vue'
import API from '../api/api'

import {store} from '../store/store.js'

const api = new API(store);

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
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/room/:roomCode',
      name: 'room-starting',
      component: RoomStarting,
      beforeEnter: async (to, from, next) => {
        const currentRoom = localStorage.getItem('currentRoomCode');
        if (currentRoom && currentRoom == to.params.roomCode) {

          next();
        } else {
          // Else, user join the room if he's logged in and has a token
          // Else, redirect to home
          
          await api.joinRoom(to.params.roomCode, store.getters.username);
          next();
        }
      }
    }
  ]
})

export default router
