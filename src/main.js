import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from './views/auth/DashboardView.vue'
import Login from './views/auth/LoginView.vue'
import Register from './views/auth/RegisterView.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/dashboard', component: Dashboard },
  ],
})

createApp(App).use(router).mount('#app')
