import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userId = computed(() => user.value?.id)
  
  // Actions
  async function fetchUser() {
    try {
      loading.value = true
      error.value = null
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (userError) throw userError
        
        user.value = {
          ...session.user,
          ...userData
        }
      }
    } catch (err) {
      console.error('Error fetching user:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function login(email, password) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (loginError) throw loginError
      
      await fetchUser()
      return data
    } catch (err) {
      console.error('Error logging in:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function logout() {
    try {
      loading.value = true
      error.value = null
      
      const { error: logoutError } = await supabase.auth.signOut()
      
      if (logoutError) throw logoutError
      
      user.value = null
    } catch (err) {
      console.error('Error logging out:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function register(email, password, userData) {
    try {
      loading.value = true
      error.value = null
      
      // Register the user with Supabase Auth
      const { data, error: registerError } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (registerError) throw registerError
      
      // If registration is successful, add user details to users table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            ...userData,
            role: 'student' // Default role
          })
        
        if (profileError) throw profileError
      }
      
      await fetchUser()
      return data
    } catch (err) {
      console.error('Error registering:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Initialize by checking current session
  fetchUser()
  
  return {
    // State
    user,
    loading,
    error,
    
    // Getters
    isLoggedIn,
    isAdmin,
    userId,
    
    // Actions
    fetchUser,
    login,
    logout,
    register
  }
})
