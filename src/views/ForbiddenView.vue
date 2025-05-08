<template>
  <div class="forbidden-container">
    <v-container class="d-flex flex-column align-center justify-center text-center" style="height: 100vh;">
      <v-icon icon="mdi-shield-alert" size="100" color="error" class="mb-4"></v-icon>
      <h1 class="text-h2 mb-4">403</h1>
      <h2 class="text-h4 mb-6">Access Forbidden</h2>
      <p class="text-body-1 mb-8">You don't have permission to access this page.</p>
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
.forbidden-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>
