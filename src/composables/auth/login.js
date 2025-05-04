import { formActionDefault, supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

// by convention, composable function names start with "use"
export function useLogin() {
  const router = useRouter()

  const formDataDefault = {
    email: '',
    password: '',
  }

  const formData = ref({ ...formDataDefault })
  const formAction = ref({ ...formActionDefault })
  const refVForm = ref()

  const login = async () => {
    const { email, password } = {
      email: formData.value.email.trim(),
      password: formData.value.password,
    }

    try {
      formAction.value = { ...formActionDefault, formProcess: true }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Supabase login error:', error)
        formAction.value.formErrorMessage = error.message
        formAction.value.formStatus = error.status
      } else if (data) {
        formAction.value.formSuccessMessage = 'Successfully Logged Account.'
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      formAction.value.formErrorMessage = 'An unexpected error occurred.'
    } finally {
      refVForm.value?.reset()
      formAction.value.formProcess = false
    }
  }

  const onFormSubmit = () => {
    refVForm.value?.validate().then(({ valid }) => {
      if (valid) login()
    })
  }

  return {
    formData,
    formAction,
    refVForm,
    login,
    onFormSubmit,
  }
}
