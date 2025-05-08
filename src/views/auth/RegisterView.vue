<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { ref, onMounted } from 'vue'

// Variables
const loading = ref(true)

// Remove loading after component mounts
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="auth-page">
    <!-- Loading overlay -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent>
      <v-progress-circular color="cyan-lighten-1" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-container class="auth-container fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <!-- Left panel with brand info -->
        <v-col cols="12" md="6" class="brand-panel d-none d-md-flex">
          <div class="brand-content d-flex flex-column justify-center">
            <div class="text-center">
              <v-img
                src="/public/images/lbb.png"
                class="mx-auto mb-6"
                max-width="120"
                alt="Logo"
              ></v-img>
              <h1 class="text-h2 font-weight-bold text-white mb-4">Book Borrow</h1>
              <p class="text-h6 text-white mb-8 mx-auto" style="max-width: 500px">
                Join our community of book lovers and start exploring
              </p>
              <v-card
                class="mx-auto quote-card"
                max-width="500"
                color="rgba(255, 255, 255, 0.1)"
                flat
              >
                <v-card-text class="text-white">
                  <p class="text-body-1 font-italic">"Books are a uniquely portable magic."</p>
                  <p class="text-right text-caption mt-2">— Stephen King</p>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-col>

        <!-- Right panel with registration form -->
        <v-col cols="12" md="6" class="form-panel d-flex align-center justify-center">
          <v-sheet class="register-form mx-auto" max-width="480" rounded="lg" elevation="0">
            <div class="d-flex d-md-none justify-center mb-6">
              <v-img src="/public/images/lbb.png" max-width="80" alt="Logo"></v-img>
            </div>

            <h2 class="text-h4 font-weight-bold mb-2 text-center">Create Account</h2>
            <p class="text-subtitle-1 text-medium-emphasis text-center mb-8">
              Sign up to start borrowing books
            </p>

            <RegisterForm></RegisterForm>

            <div class="text-center mt-6">
              <span class="text-medium-emphasis">Already have an account? </span>
              <RouterLink class="text-cyan-darken-1 font-weight-medium" to="/">
                Sign In
              </RouterLink>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.auth-container {
  min-height: 100vh;
}

.brand-panel {
  background: linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%);
  position: relative;
  overflow: hidden;
}

.brand-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/public/images/pattern.png');
  background-size: cover;
  opacity: 0.1;
  z-index: 1;
}

.brand-content {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 2rem;
}

.quote-card {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-panel {
  background-color: #ffffff;
  padding: 2rem;
}

.register-form {
  width: 100%;
  padding: 2rem;
}

@media (max-width: 960px) {
  .form-panel {
    min-height: 100vh;
  }
}
</style>
