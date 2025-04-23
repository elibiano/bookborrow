import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from './views/auth/DashboardView.vue'
import Books from './views/Books.vue'
import Borrowings from './views/Borrowings.vue'
import Submission from './views/Submission.vue'
import About from './views/About.vue'
import Login from './views/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/books', component: Books },
    { path: '/borrowings', component: Borrowings },
    { path: '/submission', component: Submission },
    { path: '/about', component: About },
  ],
})

createApp(App).use(router).mount('#app')
