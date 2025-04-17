import { createRouter, createWebHistory } from 'vue-router'
import GridView from '../views/Layout/GridView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GridView,
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import('../views/Layout/FormView.vue'),
    },
  ],
})

export default router
