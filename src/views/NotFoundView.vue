<template>
  <div class="not-found-container">
    <v-container class="d-flex flex-column align-center justify-center text-center" style="height: 100vh;">
      <v-icon icon="mdi-alert-circle" size="100" color="error" class="mb-4"></v-icon>
      <h1 class="text-h2 mb-4">404</h1>
      <h2 class="text-h4 mb-6">Page Not Found</h2>
      <p class="text-body-1 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <v-btn color="primary" size="large" to="/dashboard" v-if="isAuthenticated">
        Back to Dashboard
      </v-btn>
      <v-btn color="primary" size="large" to="/" v-else>
        Back to Login
      </v-btn>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthUserStore } from '@/stores/userAuthUserStore'

const isAuthenticated = ref(false)
const authStore = useAuthUserStore()

onMounted(async () => {
  isAuthenticated.value = await authStore.isAuthenticated()
})
</script>

<style scoped>
.not-found-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>
