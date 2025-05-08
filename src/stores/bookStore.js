import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { books as initialBooks } from '@/components/common/books.js'
import { useAuthUserStore } from './userAuthUserStore'

// Debounce function to prevent multiple calls
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const useBookStore = defineStore('books', () => {
  // States
  const books = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const initialized = ref(false)
  const activeBorrowings = ref(0)

  // Getters
  const totalBooks = computed(() => books.value.length)
  const availableBooks = computed(() => 
    books.value.reduce((total, book) => total + parseInt(book.availableCopies), 0)
  )
  const borrowedBooks = computed(() => activeBorrowings.value)

  // Actions
  // Initialize books in Supabase if they don't exist
  const initializeBooks = debounce(async () => {
    if (initialized.value) return
    
    try {
      isLoading.value = true
      error.value = null
      
      // Check if books table has data
      const { data: existingBooks, error: fetchError } = await supabase
        .from('books')
        .select('id')
        .limit(1)
      
      if (fetchError) throw fetchError
      
      // If no books exist, insert the initial books
      if (!existingBooks || existingBooks.length === 0) {
        const { error: insertError } = await supabase
          .from('books')
          .insert(
            initialBooks.map(book => ({
              title: book.title,
              author: book.author,
              category: book.category,
              total_copies: book.totalCopies,
              available_copies: book.availableCopies,
              publish_year: book.publishYear
            }))
          )
        
        if (insertError) throw insertError
      }
      
      initialized.value = true
    } catch (err) {
      console.error('Error initializing books:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }, 500)

  // Count active borrowings (books currently borrowed by users)
  const countActiveBorrowings = async () => {
    try {
      const { count, error: countError } = await supabase
        .from('borrowings')
        .select('id', { count: 'exact' })
        .eq('borrow_status', 'borrowed')
      
      if (countError) throw countError
      
      activeBorrowings.value = count || 0
    } catch (err) {
      console.error('Error counting active borrowings:', err)
      // Don't update the count if there's an error
    }
  }

  // Fetch all books
  const fetchBooks = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const { data, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .order('title')
      
      if (fetchError) throw fetchError
      
      books.value = data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        totalCopies: book.total_copies,
        availableCopies: book.available_copies,
        publishYear: book.publish_year
      }))
      
      // After fetching books, also count active borrowings
      await countActiveBorrowings()
    } catch (err) {
      console.error('Error fetching books:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Borrow a book
  const borrowBook = async (bookId, borrowDate, returnDate) => {
    const authStore = useAuthUserStore()
    if (!authStore.userData) {
      error.value = 'You must be logged in to borrow a book'
      return { error: error.value }
    }

    try {
      isLoading.value = true
      error.value = null
      
      // Get the book
      const { data: book, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single()
      
      if (bookError) throw bookError
      
      // Check if book is available
      if (parseInt(book.available_copies) <= 0) {
        throw new Error('This book is not available for borrowing')
      }
      
      // Update book available copies
      const { error: updateError } = await supabase
        .from('books')
        .update({ available_copies: parseInt(book.available_copies) - 1 })
        .eq('id', bookId)
      
      if (updateError) throw updateError
      
      // Use provided dates or defaults
      const actualBorrowDate = borrowDate || new Date().toISOString()
      
      // Create borrowing record with UUID
      const { error: borrowError } = await supabase
        .from('borrowings')
        .insert({
          id: crypto.randomUUID(), // Generate UUID for the id field
          book_id: bookId,
          student_id: authStore.userData.id,
          borrow_date: actualBorrowDate,
          return_date: returnDate, // Can be null if not provided
          borrow_status: 'borrowed'
        })
      
      if (borrowError) throw borrowError
      
      // Refresh books
      await fetchBooks()
      
      return { success: true }
    } catch (err) {
      console.error('Error borrowing book:', err)
      error.value = err.message
      return { error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Return a book
  const returnBook = async (borrowingId) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Get the borrowing record
      const { data: borrowing, error: borrowingError } = await supabase
        .from('borrowings')
        .select('*, books(*)')
        .eq('id', borrowingId)
        .single()
      
      if (borrowingError) throw borrowingError
      
      // Update borrowing record
      const { error: updateBorrowingError } = await supabase
        .from('borrowings')
        .update({ 
          return_date: new Date().toISOString(),
          borrow_status: 'returned'
        })
        .eq('id', borrowingId)
      
      if (updateBorrowingError) throw updateBorrowingError
      
      // Update book available copies
      const { error: updateBookError } = await supabase
        .from('books')
        .update({ 
          available_copies: parseInt(borrowing.books.available_copies) + 1 
        })
        .eq('id', borrowing.book_id)
      
      if (updateBookError) throw updateBookError
      
      // Refresh books
      await fetchBooks()
      
      return { success: true }
    } catch (err) {
      console.error('Error returning book:', err)
      error.value = err.message
      return { error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Get user borrowings
  const getUserBorrowings = async () => {
    const authStore = useAuthUserStore()
    if (!authStore.userData) {
      return { data: [] }
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('borrowings')
        .select(`
          id,
          borrow_date,
          return_date,
          borrow_status,
          books (
            id,
            title,
            author,
            category
          )
        `)
        .eq('student_id', authStore.userData.id)
        .order('borrow_date', { ascending: false })
      
      if (fetchError) throw fetchError
      
      return { data }
    } catch (err) {
      console.error('Error fetching user borrowings:', err)
      return { error: err.message }
    }
  }

  return {
    books,
    isLoading,
    error,
    totalBooks,
    availableBooks,
    borrowedBooks,
    activeBorrowings,
    initializeBooks,
    fetchBooks,
    borrowBook,
    returnBook,
    getUserBorrowings,
    countActiveBorrowings
  }
})
