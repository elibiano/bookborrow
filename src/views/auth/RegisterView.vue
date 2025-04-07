<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <v-responsive class="border rounded">
    <v-app :theme="theme">
      <v-app-bar class="px-3" color="cyan-lighten-2">
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          text="Toggle Theme"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-col cols="12" md="6" class="mx-auto">
            <v-card
              class="mx-auto"
              prepend-icon="mdi-book-open-blank-variant"
              subtitle="Registration Form"
            >
              <template v-slot:title>
                <span class="font-weight-black">Library Book Borrowing</span>
              </template>

              <v-card-text class="bg-surface-light pt-4">
                <v-form fast-fail @submit.prevent>
                  <v-text-field label="First Name" variant="outlined"></v-text-field>
                  <v-text-field label="Last Name" variant="outlined"></v-text-field>
                  <v-text-field label="Email" variant="outlined"></v-text-field>

                  <v-text-field label="Password" type="password" variant="outlined"></v-text-field>
                  <v-text-field
                    label="Password Confirmation"
                    type="password"
                    variant="outlined"
                  ></v-text-field>

                  <v-btn class="mt-2" type="submit" block>Submit</v-btn>
                </v-form>

                <v-divider class="my-5"></v-divider>

                <h5>
                  Already have account? <RouterLink to="/login">Click here to Login</RouterLink>
                </h5>
              </v-card-text>
            </v-card>
          </v-col>
        </v-container>
      </v-main>
      <v-footer color="cyan-lighten-2" border app>2025 - Library Book Borrowing</v-footer>
    </v-app>
  </v-responsive>
</template>
