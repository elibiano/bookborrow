<script setup>
import { ref } from 'vue'
import ProfileHeader from './ProfileHeader.vue'
import { useAuthUserStore } from '@/stores/userAuthUserStore'
import { onMounted } from 'vue'

// Use Pinia Store
const authStore = useAuthUserStore()

// Load Variables
const isLoggedIn = ref(false)

const theme = ref(localStorage.getItem('theme') ?? 'light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

// Load Functions during component rendering
onMounted(async () => {
  isLoggedIn.value = await authStore.isAuthenticated()
})
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar
        class="px-3"
        :color="theme === 'light' ? 'cyan-lighten-1' : 'cyan-lighten-2'"
        border
      >
        <v-app-bar-title class="text-white"><b>Book Borrow</b></v-app-bar-title>
        <v-spacer></v-spacer>

        <ProfileHeader v-if="isLoggedIn"></ProfileHeader>

        <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          slim
          @click="onClick"
          class="ml-5"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>

      <v-footer :color="theme === 'light' ? 'cyan-lighten-1' : 'cyan-lighten-2'" border app>
        2025 - BookFlow
      </v-footer>
    </v-app>
  </v-responsive>
</template>
