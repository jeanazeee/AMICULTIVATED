import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Jeu from '../views/game/Jeu.vue'
import FinDeJeu from '../views/game/FinDeJeu.vue'
import CreationPartie from '../views/game/CreationPartie.vue'
import OeuvreJour from '../views/game/OeuvreJour.vue'
import Connexion from '../views/user/Connexion.vue'
import Profil from '../views/user/Profil.vue'
import Stats from '../views/user/Stats.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/creer',
      name: 'creer',
      component: Home
    },
    {
      path: '/fin',
      name: 'findejeu',
      component: FinDeJeu
    },
    {
      path: '/partie',
      name: 'partie',
      component: Jeu
    },
    {
      path: '/quotidient',
      name: 'quotidient',
      component: OeuvreJour
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: Connexion
    },
    {
      path: '/profil',
      name: 'profil',
      component: Profil
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    }
  ]
})

export default router
