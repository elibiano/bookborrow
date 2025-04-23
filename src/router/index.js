import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import AboutView from '@/views/auth/AboutView.vue'
import BooksView from '@/views/auth/BooksView.vue'
import BorrowingsView from '@/views/auth/BorrowingsView.vue'
import ReturningView from '@/views/auth/ReturningView.vue'
import DashboardView from '@/views/auth/DashboardView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/books',
      name: 'books',
      component: BooksView,
    },
    {
      path: '/borrowings',
      name: 'borrowings',
      component: BorrowingsView,
    },
    {
      path: '/returning',
      name: 'returning',
      component: ReturningView,
    },
  ],
})

export default router
