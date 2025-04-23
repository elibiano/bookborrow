<script setup>
import { ref } from 'vue'

const isPasswordVisible = ref(false)
</script>

<template>
  <v-form fast-fail @submit.prevent>
    <v-text-field label="Email" variant="outlined" />
    <v-text-field
      :type="isPasswordVisible ? 'text' : 'password'"
      label="Password"
      variant="outlined"
    />
    <v-btn class="mt-2" type="submit" block color="primary" prepend-icon="">
      Login
    </v-btn>
  </v-form>
</template>
