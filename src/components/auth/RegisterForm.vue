<script setup>
import { ref } from 'vue'

const isPasswordConfirmVisible = ref(true)
</script>

<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field
  label="Password Confirmation"
  :type="isPasswordConfirmVisible ? 'text' : 'password'"
  variant="outlined"
  append-inner-icon="mdi-eye"
  @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
/>

    <v-btn class="mt-2" type="submit" block color="primary" prepend-icon="↑">Register</v-btn>
  </v-form>
</template>
