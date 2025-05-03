<script setup>
import { ref } from 'vue'
import { requiredValidator, emailValidator } from '@/utils/validator'

const isPasswordVisible = ref(false)
const refVForm = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault,
})

const onLogin = () => {
  alert(formData.value)
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onLogin()
  })
}
</script>

<template>
  <v-form ref="refVForm" fast-fail @submit.prevent="onFormSubmit">
    <v-text-field
      v-model="formData.email"
      label="Email"
      prepend-inner-icon="✉"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>

    <v-text-field
      v-model="formData.password"
      prepend-inner-icon="🔒"
      label="Password"
      :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator]"
    ></v-text-field>

    <v-btn class="mt-2" type="submit" block color="deep-orange-lighten-1" prepend-icon="↳">
      Login
    </v-btn>
  </v-form>
</template>
