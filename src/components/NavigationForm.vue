<script>
import { HomeIcon, BookIcon, BookOpenIcon, PlusCircleIcon, InfoIcon, LogOutIcon } from 'lucide-vue-next'

export default {
  components: {
    HomeIcon,
    BookIcon,
    BookOpenIcon,
    PlusCircleIcon,
    InfoIcon,
    LogOutIcon
  },
  data() {
    return {
      navItems: [
        { path: '/dashboard', label: 'Dashboard', icon: 'HomeIcon' },
        { path: '/books', label: 'Books', icon: 'BookIcon' },
        { path: '/borrowings', label: 'Borrowings', icon: 'BookOpenIcon' },
        { path: '/submission', label: 'Return Books', icon: 'PlusCircleIcon' },
        { path: '/about', label: 'About', icon: 'InfoIcon' },
      ]
    }
  },
  methods: {
    logout() {
      this.$router.push('/login')
    }
  }
}
</script>

<template>
  <nav class="bg-white shadow-md fixed w-full z-10">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <span class="text-xl font-bold text-gray-800">Library Management</span>
        </div>
        <div class="flex items-center space-x-4">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium"
            :class="[
              $route.path === item.path
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span class="ml-2">{{ item.label }}</span>
          </router-link>
          <button
            @click="logout"
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800"
          >
            <LogOutIcon class="h-5 w-5" />
            <span class="ml-2">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
