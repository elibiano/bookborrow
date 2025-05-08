<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBookStore } from '@/stores/bookStore'
import { useAuthUserStore } from '@/stores/userAuthUserStore'
import AppLayout from '@/components/layout/AppLayout.vue'

const bookStore = useBookStore()
const authStore = useAuthUserStore()
const searchQuery = ref('')
const selectedCategory = ref('All')
const showBorrowDialog = ref(false)
const selectedBook = ref(null)
const userBorrowings = ref([])
const showMyBooks = ref(false)
const loading = ref(true)

// Date selection for borrowing
const borrowDate = ref(new Date().toISOString().substr(0, 10))
const returnDate = ref(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10)) // Default to 14 days later
const dateRules = [(v) => !!v || 'Date is required']

// Filtered books based on search and category
const filteredBooks = computed(() => {
  let result = bookStore.books

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (book) =>
        book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query),
    )
  }

  // Filter by category
  if (selectedCategory.value !== 'All') {
    result = result.filter((book) => book.category === selectedCategory.value)
  }

  return result
})

// Get unique categories for filter
const categories = computed(() => {
  const uniqueCategories = [...new Set(bookStore.books.map((book) => book.category))]
  return ['All', ...uniqueCategories.sort()]
})

// Stats for the dashboard
const stats = computed(() => [
  {
    title: 'Total Books',
    value: bookStore.totalBooks,
    icon: 'mdi-book-multiple',
    color: 'primary',
  },
  {
    title: 'Available Books',
    value: bookStore.availableBooks,
    icon: 'mdi-book-open-variant',
    color: 'success',
  },
  {
    title: 'Borrowed Books',
    value: bookStore.borrowedBooks,
    icon: 'mdi-book-lock',
    color: 'warning',
  },
  {
    title: 'My Borrowings',
    value: userBorrowings.value.length,
    icon: 'mdi-account-box',
    color: 'info',
  },
])

async function loadData() {
  loading.value = true

  // Initialize books if needed (debounced)
  await bookStore.initializeBooks()

  // Fetch books
  await bookStore.fetchBooks()

  // Fetch user borrowings
  const { data } = await bookStore.getUserBorrowings()
  if (data) {
    userBorrowings.value = data
  }

  loading.value = false
}

async function borrowBook() {
  if (!selectedBook.value) return

  // Convert dates to ISO format for database
  const borrowDateISO = new Date(borrowDate.value).toISOString()
  const returnDateISO = returnDate.value ? new Date(returnDate.value).toISOString() : null

  const result = await bookStore.borrowBook(selectedBook.value.id, borrowDateISO, returnDateISO)
  if (result.success) {
    // Refresh user borrowings
    const { data } = await bookStore.getUserBorrowings()
    if (data) {
      userBorrowings.value = data
    }
  }

  showBorrowDialog.value = false
  selectedBook.value = null

  // Reset dates for next time
  borrowDate.value = new Date().toISOString().substr(0, 10)
  returnDate.value = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10)
}

async function returnBook(borrowingId) {
  const result = await bookStore.returnBook(borrowingId)
  if (result.success) {
    // Refresh user borrowings
    const { data } = await bookStore.getUserBorrowings()
    if (data) {
      userBorrowings.value = data
    }
  }
}

function openBorrowDialog(book) {
  selectedBook.value = book
  showBorrowDialog.value = true
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <!-- Loading Overlay -->
        <v-overlay :model-value="loading" class="align-center justify-center" persistent>
          <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <!-- Welcome Banner -->
        <v-sheet color="cyan-lighten-1" class="welcome-banner pa-6 mb-6 rounded text-white">
          <h1 class="text-h4 mb-2">Welcome to Book Borrow System</h1>
          <p class="text-subtitle-1">
            Hello, {{ authStore.userData?.firstname }}! Manage your book borrowings efficiently.
          </p>
        </v-sheet>

        <!-- Stats Cards -->
        <v-row>
          <v-col v-for="(stat, index) in stats" :key="index" cols="12" sm="6" md="3">
            <v-card class="stat-card h-100" variant="outlined" :color="stat.color" flat>
              <v-card-text class="text-center">
                <v-icon :icon="stat.icon" size="large" class="mb-2"></v-icon>
                <p class="text-subtitle-1 text-medium-emphasis">{{ stat.title }}</p>
                <p class="text-h3 font-weight-bold">{{ stat.value }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-card class="mt-6 mb-6" variant="outlined">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  label="Search books"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="selectedCategory"
                  :items="categories"
                  label="Filter by category"
                  variant="outlined"
                  hide-details
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="2" class="d-flex align-center">
                <v-switch
                  v-model="showMyBooks"
                  label="My Books"
                  color="primary"
                  hide-details
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Books or Borrowings Table -->
        <v-card v-if="!showMyBooks" variant="outlined">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-book-multiple" class="mr-2"></v-icon>
            Available Books
          </v-card-title>
          <v-card-text>
            <v-table fixed-header height="400px">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Available Copies</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in filteredBooks" :key="book.id">
                  <td>{{ book.title }}</td>
                  <td>{{ book.author }}</td>
                  <td>
                    <v-chip size="small" color="primary" variant="outlined">{{
                      book.category
                    }}</v-chip>
                  </td>
                  <td>
                    <v-chip
                      size="small"
                      :color="parseInt(book.availableCopies) > 0 ? 'success' : 'error'"
                    >
                      {{ book.availableCopies }} / {{ book.totalCopies }}
                    </v-chip>
                  </td>
                  <td>{{ book.publishYear }}</td>
                  <td>
                    <v-btn
                      size="small"
                      color="primary"
                      variant="tonal"
                      :disabled="parseInt(book.availableCopies) <= 0"
                      @click="openBorrowDialog(book)"
                    >
                      Borrow
                    </v-btn>
                  </td>
                </tr>
                <tr v-if="filteredBooks.length === 0">
                  <td colspan="6" class="text-center py-5">
                    No books found matching your criteria
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- My Borrowings -->
        <v-card v-else variant="outlined">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-account-box" class="mr-2"></v-icon>
            My Borrowings
          </v-card-title>
          <v-card-text>
            <v-table fixed-header height="400px">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Borrowed Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borrowing in userBorrowings" :key="borrowing.id">
                  <td>{{ borrowing.books.title }}</td>
                  <td>{{ borrowing.books.author }}</td>
                  <td>
                    <v-chip size="small" color="primary" variant="outlined">{{
                      borrowing.books.category
                    }}</v-chip>
                  </td>
                  <td>{{ new Date(borrowing.borrow_date).toLocaleDateString() }}</td>
                  <td>
                    <v-chip
                      size="small"
                      :color="borrowing.borrow_status === 'borrowed' ? 'warning' : 'success'"
                    >
                      {{ borrowing.borrow_status === 'borrowed' ? 'Borrowed' : 'Returned' }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn
                      v-if="borrowing.borrow_status === 'borrowed'"
                      size="small"
                      color="success"
                      variant="tonal"
                      @click="returnBook(borrowing.id)"
                    >
                      Return
                    </v-btn>
                    <span v-else
                      >Returned on {{ new Date(borrowing.return_date).toLocaleDateString() }}</span
                    >
                  </td>
                </tr>
                <tr v-if="userBorrowings.length === 0">
                  <td colspan="6" class="text-center py-5">You haven't borrowed any books yet</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Borrow Confirmation Dialog -->
        <v-dialog v-model="showBorrowDialog" max-width="800px" scrollable>
          <v-card>
            <v-card-title class="text-h5 pb-2 pt-4 px-4">Borrow Book</v-card-title>

            <v-divider></v-divider>

            <v-card-text class="px-4 py-4">
              <v-container v-if="selectedBook">
                <!-- Book Details -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-2">{{ selectedBook.title }}</h3>
                    <p class="text-subtitle-1 mb-2">By {{ selectedBook.author }}</p>
                    <v-chip size="small" color="primary" class="mb-4">{{
                      selectedBook.category
                    }}</v-chip>
                  </v-col>
                </v-row>

                <!-- Date Selection -->
                <v-row>
                  <v-col cols="12" class="mb-2">
                    <h3 class="text-subtitle-1 font-weight-medium">Select Dates</h3>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6" class="pb-0">
                    <p class="text-subtitle-2 mb-2">Borrow Date:</p>
                    <v-text-field
                      v-model="borrowDate"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                      :rules="dateRules"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6" class="pb-0">
                    <p class="text-subtitle-2 mb-2">Return Date:</p>
                    <v-text-field
                      v-model="returnDate"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                      :rules="dateRules"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- Notice -->
                <v-row>
                  <v-col cols="12">
                    <v-alert type="info" variant="tonal" class="mb-0">
                      <p>Please return the book by the selected return date to avoid late fees.</p>
                    </v-alert>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="error" variant="text" @click="showBorrowDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="borrowBook">Confirm Borrowing</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.welcome-banner {
  background: linear-gradient(to right, var(--v-primary-base), var(--v-primary-darken1));
}

.stat-card {
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}
</style>
