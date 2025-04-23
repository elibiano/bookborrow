<script setup>
import { RouterView } from 'vue-router'
</script>

<template><template>
  <div class="min-h-screen bg-gray-100">
    <Navigation v-if="!isLoginPage" />
    <main v-if="!isLoginPage" class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-20">
      <RouterView />
    </main>
    <RouterView v-else />
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'

export default {
  components: {
    Navigation
  },
  computed: {
    isLoginPage() {
      return this.$route.path === '/login'
    }
  }
}
</script>
  <RouterView />
</template>
