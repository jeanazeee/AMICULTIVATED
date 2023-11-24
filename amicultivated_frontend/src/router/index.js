import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/user/Login.vue'
import Signup from '../views/user/Signup.vue'
import Profil from '../views/user/Profil.vue'
import Room from '../views/game/room.vue'
import {store} from '../store/store.js'
import Room from '../views/game/Room.vue'
import API from '../api/api'


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
      path: '/profil',
      name:'profil',
      component: Profil
    },
    {
      path: '/room/:roomCode',
      name: 'room',
      component: Room,
      beforeEnter: async (to, from, next) => {
        const currentRoom = store.getters.currentRoomCode;
        // check room status
        const roomInfos = (await api.getRoomInfos(to.params.roomCode)).room;

        if (roomInfos.status === 'Open') {

            if (currentRoom && currentRoom == to.params.roomCode) {
              next();
            } else {
              // Else, user join the room if he's logged in and has a token
              // Else, redirect to home

              await api.joinRoom(to.params.roomCode, store.getters.username);
              next();
            }
          } else if(roomInfos.status === 'Started'){

            //Check if user is alraedy in room
            
            const isPlayerInRoom = roomInfos.players.find(player =>  player === store.getters.username);
            if(isPlayerInRoom){
              next();
            }else{
              next({ name: 'home' });
            }
        } else {
          next({ name: 'home' });
        }
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  if  ( (to.name == 'login' || to.name == 'signup') && store.getters.loggedIn == true) {
    next('/'); 
  }
  else if (store.getters.loggedIn == false && to.name != 'signup' && to.name != 'login'){
    next('/login');
  }
  else {
    next();
  }
});

export default router
