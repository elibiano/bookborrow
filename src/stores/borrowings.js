import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useUserStore } from './user'

export const useBorrowingsStore = defineStore('borrowings', () => {
  // State
  const borrowings = ref([])
  const loading = ref(false)
  const error = ref(null)
  const userStore = useUserStore()

  // Getters
  const activeBorrowings = computed(() => 
    borrowings.value.filter(borrowing => borrowing.borrow_status === 'active')
  )

  const returnedBorrowings = computed(() => 
    borrowings.value.filter(borrowing => borrowing.borrow_status === 'returned')
  )

  const getBorrowingsByBookId = computed(() => (bookId) =>
    borrowings.value.filter(borrowing => borrowing.book_id === bookId)
  )

  const getBorrowingsByStudentId = computed(() => (studentId) =>
    borrowings.value.filter(borrowing => borrowing.student_id === studentId)
  )

  // Actions
  async function fetchBorrowings() {
    try {
      loading.value = true
      error.value = null
      
      let query = supabase
        .from('borrowings')
        .select(`
          *,
          books (
            id,
            title,
            author,
            category,
            publish_year
          )
        `)
        .order('created_at', { ascending: false })
      
      // If not an admin, only show current user's borrowings
      if (!userStore.isAdmin) {
        query = query.eq('student_id', userStore.user.id)
      }
      
      const { data, error: err } = await query
      
      if (err) throw err
      
      borrowings.value = data
      return data
    } catch (err) {
      console.error('Error fetching borrowings:', err)
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  async function borrowBook(bookId, dueDate) {
    try {
      loading.value = true
      error.value = null
      
      if (!userStore.user) {
        throw new Error('You must be logged in to borrow a book')
      }

      // First update the book to decrease available copies
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('available_copies')
        .eq('id', bookId)
        .single()

      if (bookError) throw bookError

      if (bookData.available_copies <= 0) {
        throw new Error('This book is not available for borrowing')
      }

      // Update available copies in the books table
      const { error: updateError } = await supabase
        .from('books')
        .update({ available_copies: bookData.available_copies - 1 })
        .eq('id', bookId)

      if (updateError) throw updateError
      
      // Create a new borrowing record
      const borrowData = {
        student_id: userStore.user.id,
        book_id: bookId,
        borrow_date: new Date().toISOString(),
        return_date: dueDate,
        borrow_status: 'active'
      }
      
      const { data, error: borrowError } = await supabase
        .from('borrowings')
        .insert(borrowData)
        .select()
      
      if (borrowError) throw borrowError
      
      // Refresh borrowings list
      await fetchBorrowings()
      
      return data
    } catch (err) {
      console.error('Error borrowing book:', err)
      error.value = err.message
      
      return null
    } finally {
      loading.value = false
    }
  }

  async function returnBook(borrowingId) {
    try {
      loading.value = true
      error.value = null
      
      // Get the borrowing to find the book_id
      const { data: borrowingData, error: fetchError } = await supabase
        .from('borrowings')
        .select('book_id')
        .eq('id', borrowingId)
        .single()
      
      if (fetchError) throw fetchError
      
      // Update the borrowing status
      const { error: updateError } = await supabase
        .from('borrowings')
        .update({ 
          borrow_status: 'returned',
          return_date: new Date().toISOString()
        })
        .eq('id', borrowingId)
      
      if (updateError) throw updateError
      
      // Increase available copies in the books table
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('available_copies')
        .eq('id', borrowingData.book_id)
        .single()
      
      if (bookError) throw bookError
      
      const { error: incrementError } = await supabase
        .from('books')
        .update({ available_copies: bookData.available_copies + 1 })
        .eq('id', borrowingData.book_id)
      
      if (incrementError) throw incrementError
      
      // Refresh borrowings list
      await fetchBorrowings()
      
      return true
    } catch (err) {
      console.error('Error returning book:', err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function getBorrowingHistory(bookId) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: err } = await supabase
        .from('borrowings')
        .select(`
          *,
          books (
            id,
            title,
            author
          )
        `)
        .eq('book_id', bookId)
        .order('created_at', { ascending: false })
      
      if (err) throw err
      
      return data
    } catch (err) {
      console.error('Error fetching borrowing history:', err)
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    borrowings,
    loading,
    error,
    
    // Getters
    activeBorrowings,
    returnedBorrowings,
    getBorrowingsByBookId,
    getBorrowingsByStudentId,
    
    // Actions
    fetchBorrowings,
    borrowBook,
    returnBook,
    getBorrowingHistory
  }
})
