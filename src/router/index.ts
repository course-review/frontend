import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CourseView from '@/views/CourseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/course',
      name: 'course',
      component: CourseView
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue')
    },
  ]
})

export default router
