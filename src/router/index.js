import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/system/DashboardView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ForbiddenView from '@/views/ForbiddenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ForbiddenView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    // Check if user is authenticated
    const { data } = await supabase.auth.getSession()
    
    if (data.session) {
      // Check if user has required role/permissions if needed
      // For now, we'll just check if they're authenticated
      
      // Here you can add additional checks for specific routes
      // For example, if certain routes need admin access:
      // if (to.meta.requiresAdmin && !userIsAdmin) {
      //   return next({ name: 'forbidden' })
      // }
      
      // User is authenticated and has permission, proceed
      next()
    } else {
      // User is not authenticated, redirect to login
      next({ name: 'login' })
    }
  } else {
    // Route doesn't require auth
    // If user is already logged in and tries to access login/register, redirect to dashboard
    if ((to.name === 'login' || to.name === 'register')) {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        next({ name: 'dashboard' })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router
