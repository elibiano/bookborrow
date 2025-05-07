<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBorrowingsStore } from '@/stores/borrowings';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const borrowingsStore = useBorrowingsStore();
const userStore = useUserStore();

const searchQuery = ref('');
const page = ref(1);
const editDialog = ref(false);
const deleteDialog = ref(false);
const borrowDialog = ref(false);
const showBorrowingHistory = ref(false);
const editedBook = ref({});
const selectedBook = ref({});
const dueDate = ref('');
const snackbarMessage = ref('');
const snackbarColor = ref('success');
const loading = ref(false);
const showSnackbar = ref(false);
const viewMode = ref('grid'); // 'grid' or 'table'

// We're using hardcoded books instead of fetching from Supabase
async function updateLocalBookAvailability() {
  // This function updates the available_copies of books locally when borrowings change
  loading.value = true;
  try {
    // Get active borrowings for books
    await borrowingsStore.fetchBorrowings();
    
    // Update local book availability based on active borrowings
    const activeBorrows = borrowingsStore.activeBorrowings;
    
    // Reset all books to their total copies first
    books.value.forEach(book => {
      book.available_copies = book.total_copies;
    });
    
    // Reduce available copies for each borrowed book
    activeBorrows.forEach(borrowing => {
      const book = books.value.find(b => b.id === borrowing.book_id);
      if (book && book.available_copies > 0) {
        book.available_copies--;
      }
    });
    
    return books.value;
  } catch (error) {
    showSnackbarMessage(error.message || 'Failed to update book availability', 'error');
    return [];
  } finally {
    loading.value = false;
  }
}

// Function to initialize the component
async function initialize() {
  // No need to fetch books as they are hardcoded
  await borrowingsStore.fetchBorrowings();
  await updateLocalBookAvailability();
}

// Call initialization on component mount
onMounted(() => {
  initialize();
});

// Books list
const books = ref([
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    publishYear: 1925,
    available_copies: 2,
    total_copies: 3,
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    publishYear: 1960,
    available_copies: 1,
    total_copies: 4,
  },
  {
    id: 3,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    publishYear: 1813,
    available_copies: 0,
    total_copies: 2,
  },
  {
    id: 4,
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    publishYear: 1949,
    available_copies: 5,
    total_copies: 5,
  },
  {
    id: 5,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    category: 'Fiction',
    publishYear: 1951,
    available_copies: 3,
    total_copies: 3,
  },
])

const searchBooks = () => {
  // Here would go the API call to search for books
  console.log('Searching for:', searchQuery.value)
}

const editBook = (book) => {
  editedBook.value = { ...book }
  editDialog.value = true
}

const saveBookEdit = () => {
  // Here would go the API call to update the book
  const index = books.value.findIndex((book) => book.id === editedBook.value.id)
  if (index !== -1) {
    books.value[index] = { ...editedBook.value }
  }
  editDialog.value = false
}

const confirmDeleteBook = (book) => {
  editedBook.value = { ...book }
  deleteDialog.value = true
}

const deleteBook = () => {
  // Here would go the API call to delete the book
  books.value = books.value.filter((book) => book.id !== editedBook.value.id)
  deleteDialog.value = false
}

const navigateToAddBook = () => {
  router.push('/submit')
}

const borrowBook = (book) => {
  if (book.available_copies > 0) {
    selectedBook.value = { ...book };
    borrowDialog.value = true;
    dueDate.value = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10); // 14 days from now
  } else {
    showSnackbarMessage('This book is not available for borrowing', 'error');
  }
};

const confirmBorrow = async () => {
  if (!userStore.isLoggedIn) {
    showSnackbarMessage('You must be logged in to borrow a book', 'error');
    return;
  }

  if (!dueDate.value) {
    showSnackbarMessage('Please select a due date', 'error');
    return;
  }
  
  loading.value = true;
  try {
    // Create a borrowing record in Supabase
    const result = await borrowingsStore.borrowBook(selectedBook.value.id, dueDate.value);
    if (result) {
      // Update local books availability based on the new borrowing
      await updateLocalBookAvailability();
      showSnackbarMessage(`Book borrowed successfully`, 'success');
    } else {
      showSnackbarMessage(borrowingsStore.error || 'Failed to borrow book', 'error');
    }
  } catch (error) {
    showSnackbarMessage(error.message || 'An error occurred', 'error');
  } finally {
    loading.value = false;
    borrowDialog.value = false;
    dueDate.value = '';
  }
};

const showSnackbarMessage = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

const returnBook = async (borrowingId) => {
  loading.value = true;
  try {
    const result = await borrowingsStore.returnBook(borrowingId);
    if (result) {
      showSnackbarMessage('Book returned successfully');
      // Update local book availability after return
      await updateLocalBookAvailability();
    } else {
      showSnackbarMessage('Failed to return book', 'error');
    }
  } catch (error) {
    showSnackbarMessage(error.message || 'An error occurred', 'error');
  } finally {
    loading.value = false;
  }
};

// Use the borrowings store for active borrows
const activeBorrows = computed(() => borrowingsStore.activeBorrowings);

const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value

  const query = searchQuery.value.toLowerCase()
  return books.value.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query),
  )
})

// Function to get a consistent color based on book category
function getBookColor(category) {
  const colors = {
    'Fiction': '#4f46e5',
    'Romance': '#ec4899',
    'Dystopian': '#f97316',
    'Science Fiction': '#0ea5e9',
    'Mystery': '#8b5cf6',
    'Fantasy': '#06b6d4',
    'Biography': '#14b8a6',
    'History': '#eab308',
    'Self-Help': '#22c55e',
    'Business': '#64748b'
  }
  
  return colors[category] || '#4f46e5' // Default to primary color if category not found
}

</script>

<template>
  <div class="fade-in book-library">
    <v-card class="header-card mb-6" elevation="3" rounded="lg">
      <v-img
        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        height="200"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
        cover
      >
        <div class="d-flex flex-column justify-end fill-height pa-6">
          <h1 class="text-h3 text-white mb-2">Library Management</h1>
          <p class="text-subtitle-1 text-white">Find, borrow and manage your favorite books</p>
          
          <div class="d-flex mt-4 gap-3">
            <v-btn 
              color="primary" 
              prepend-icon="mdi-plus" 
              @click="navigateToAddBook" 
              elevation="3"
              variant="elevated"
              size="large"
            >Add New Book</v-btn>
            
            <v-btn 
              color="secondary" 
              prepend-icon="mdi-history" 
              elevation="3"
              variant="elevated"
              size="large"
              @click="showBorrowingHistory = true"
            >Borrowing History</v-btn>
          </div>
        </div>
      </v-img>
    </v-card>

    <v-card elevation="2" class="mb-6 search-card" rounded="lg">
      <v-card-text>
        <div class="d-flex justify-space-between align-center flex-wrap mb-4">
          <div class="d-flex flex-grow-1 flex-sm-grow-0">
            <v-text-field
              v-model="searchQuery"
              label="Search books..."
              hide-details
              density="comfortable"
              class="mr-2"
              width="300"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              rounded="lg"
              bg-color="white"
            ></v-text-field>
            <v-btn color="primary" variant="elevated" rounded="lg" @click="searchBooks">Search</v-btn>
          </div>
          
          <div class="d-flex align-center">
            <v-chip color="primary" class="mr-2">
              <v-icon start icon="mdi-book-multiple"></v-icon>
              {{ filteredBooks.length }} books
            </v-chip>
            
            <v-btn-toggle v-model="viewMode" mandatory rounded="lg" color="primary" density="comfortable">
              <v-btn value="grid" icon="mdi-view-grid"></v-btn>
              <v-btn value="table" icon="mdi-table"></v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- Grid View -->
    <div v-if="viewMode === 'grid'">
      <v-row>
        <v-col v-for="book in filteredBooks" :key="book.id" cols="12" sm="6" md="4" lg="3">
          <v-card class="book-card h-100" elevation="2" rounded="lg">
            <div class="book-card__image">
              <div class="book-cover" :style="{ backgroundColor: getBookColor(book.category) }">
                <div class="book-title">{{ book.title }}</div>
              </div>
              <div class="book-availability">
                <v-chip
                  :color="book.available_copies > 0 ? 'success' : 'error'"
                  size="small"
                  class="availability-chip"
                >
                  {{ book.available_copies > 0 ? 'Available' : 'Unavailable' }}
                </v-chip>
              </div>
            </div>
            
            <v-card-text>
              <h3 class="text-h6 mb-1 book-title-text">{{ book.title }}</h3>
              <p class="text-subtitle-2 mb-3 text-medium-emphasis">{{ book.author }}</p>
              
              <div class="d-flex justify-space-between align-center mb-2">
                <v-chip size="small" color="info" variant="tonal" class="mr-2">{{ book.category }}</v-chip>
                <span class="text-caption">{{ book.publishYear }}</span>
              </div>
              
              <div class="book-stats d-flex align-center justify-space-between mt-3">
                <div class="text-caption">
                  <v-icon icon="mdi-book-multiple" size="small" class="mr-1"></v-icon>
                  {{ book.available_copies }} / {{ book.total_copies }} copies
                </div>
              </div>
            </v-card-text>
            
            <v-divider></v-divider>
            
            <v-card-actions>
              <v-btn
                color="secondary"
                variant="text"
                density="comfortable"
                prepend-icon="mdi-pencil"
                @click="editBook(book)"
              >Edit</v-btn>
              
              <v-spacer></v-spacer>
              
              <v-btn
                color="error"
                variant="text"
                density="comfortable"
                prepend-icon="mdi-delete"
                @click="confirmDeleteBook(book)"
              >Delete</v-btn>
              
              <v-btn
                color="success"
                variant="elevated"
                prepend-icon="mdi-book-arrow-right"
                @click="borrowBook(book)"
                :disabled="book.available_copies <= 0"
                class="borrow-btn"
              >Borrow</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      
      <div class="d-flex justify-center mt-4">
        <v-pagination
          v-model="page"
          :length="Math.ceil(filteredBooks.length / 12)"
          rounded="circle"
        ></v-pagination>
      </div>
    </div>
    
    <!-- Table View -->
    <v-card v-if="viewMode === 'table'" elevation="2" class="mb-6" rounded="lg">
      <v-card-text class="pa-0">
        <v-table class="custom-table">
          <thead>
            <tr>
              <th class="text-left">Title</th>
              <th class="text-left">Author</th>
              <th class="text-left">Category</th>
              <th class="text-left">Publish Year</th>
              <th class="text-center">Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book.id" class="book-row">
              <td class="text-left font-weight-medium">{{ book.title }}</td>
              <td class="text-left">{{ book.author }}</td>
              <td class="text-left">
                <v-chip size="small" color="info" variant="tonal">{{ book.category }}</v-chip>
              </td>
              <td class="text-left">{{ book.publishYear }}</td>
              <td class="text-center">
                <v-chip
                  :color="book.available_copies > 0 ? 'success' : 'error'"
                  size="small"
                >
                  {{ book.available_copies }} / {{ book.total_copies }}
                </v-chip>
              </td>
              <td>
                <div class="d-flex justify-center gap-2">
                  <v-btn
                    size="small"
                    color="secondary"
                    variant="elevated"
                    icon="mdi-pencil"
                    @click="editBook(book)"
                    density="comfortable"
                  ></v-btn>
                  <v-btn
                    size="small"
                    color="success"
                    variant="elevated"
                    icon="mdi-book-arrow-right"
                    @click="borrowBook(book)"
                    density="comfortable"
                    :disabled="book.available_copies <= 0"
                  ></v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="elevated"
                    icon="mdi-delete"
                    @click="confirmDeleteBook(book)"
                    density="comfortable"
                  ></v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
        
        <div class="d-flex justify-center mt-4">
          <v-pagination
            v-model="page"
            :length="Math.ceil(filteredBooks.length / 10)"
            rounded="circle"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>

    <!-- Active Borrowers Section -->
    <v-card v-if="activeBorrows.length > 0" elevation="2" class="mt-8" rounded="lg">
      <v-card-title class="text-h5 py-4 px-6 bg-primary text-white">
        <v-icon icon="mdi-account-multiple" class="mr-2"></v-icon>
        Active Borrowers
      </v-card-title>
      <v-card-text class="pa-0">
        <v-table class="custom-table">
          <thead>
            <tr>
              <th class="text-left">Book ID</th>
              <th class="text-left">Borrow Date</th>
              <th class="text-left">Due Date</th>
              <th class="text-center">Status</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="borrowing in activeBorrows" :key="borrowing.id">
              <td class="text-left font-weight-medium">{{ borrowing.book_id }}</td>
              <td class="text-left">{{ new Date(borrowing.borrow_date).toLocaleDateString() }}</td>
              <td class="text-left">{{ new Date(borrowing.return_date).toLocaleDateString() }}</td>
              <td class="text-center">
                <span class="badge badge--info">{{ borrowing.borrow_status }}</span>
              </td>
              <td class="text-center">
                <v-btn
                  size="small"
                  color="success"
                  variant="elevated"
                  prepend-icon="mdi-keyboard-return"
                  @click="returnBook(borrowing.id)"
                  :loading="loading"
                >
                  Return
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Dialog for editing a book -->
    <v-dialog v-model="editDialog" max-width="500" class="dialog">
      <v-card rounded="lg">
        <v-card-title class="text-h5 py-4 px-6 bg-secondary text-white">
          <v-icon icon="mdi-pencil" class="mr-2"></v-icon>
          Edit Book
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form @submit.prevent="saveBookEdit">
            <v-text-field
              v-model="editedBook.title"
              label="Title"
              variant="outlined"
              class="mb-3"
              rounded="lg"
            ></v-text-field>
            <v-text-field
              v-model="editedBook.author"
              label="Author"
              variant="outlined"
              class="mb-3"
              rounded="lg"
            ></v-text-field>
            <v-text-field
              v-model="editedBook.category"
              label="Category"
              variant="outlined"
              class="mb-3"
              rounded="lg"
            ></v-text-field>
            <v-text-field
              v-model="editedBook.publishYear"
              label="Publish Year"
              type="number"
              variant="outlined"
              class="mb-3"
              rounded="lg"
            ></v-text-field>
            <v-text-field
              v-model="editedBook.total_copies"
              label="Total Copies"
              type="number"
              variant="outlined"
              class="mb-3"
              rounded="lg"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveBookEdit">Save Changes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for confirming deletion -->
    <v-dialog v-model="deleteDialog" max-width="500" class="dialog">
      <v-card rounded="lg">
        <v-card-title class="text-h5 py-4 px-6 bg-error text-white">
          <v-icon icon="mdi-alert" class="mr-2"></v-icon>
          Delete Book
        </v-card-title>
        <v-card-text class="pa-6">
          <p class="text-body-1">Are you sure you want to delete this book?</p>
          <p class="mt-4 pa-4 bg-error-lighten-5 rounded-lg">
            <strong class="text-h6 d-block mb-1">{{ editedBook.title }}</strong>
            <span class="text-body-2">by {{ editedBook.author }}</span>
          </p>
        </v-card-text>
        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteBook">Delete Book</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for borrowing a book -->
    <v-dialog v-model="borrowDialog" max-width="500" class="dialog">
      <v-card rounded="lg">
        <v-card-title class="text-h5 py-4 px-6 bg-success text-white">
          <v-icon icon="mdi-book-arrow-right" class="mr-2"></v-icon>
          Borrow Book
        </v-card-title>
        <v-card-text class="pa-6">
          <p class="text-body-1 mb-4">Enter borrower details:</p>

          <p class="mb-4 pa-4 bg-success-lighten-5 rounded-lg">
            <strong class="text-h6 d-block mb-1">{{ selectedBook.title }}</strong>
            <span class="text-body-2">by {{ selectedBook.author }}</span>
          </p>

          <v-form @submit.prevent="confirmBorrow">
            <div class="text-body-2 mb-3" v-if="userStore.user">
              <strong>Borrower:</strong> {{ userStore.user.email }}
            </div>
            <div v-else class="text-error mb-3">
              You must be logged in to borrow books
            </div>

            <v-text-field
              v-model="dueDate"
              label="Due Date"
              type="date"
              variant="outlined"
              class="mb-3"
              rounded="lg"
              prepend-inner-icon="mdi-calendar"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="borrowDialog = false">Cancel</v-btn>
          <v-btn color="success" variant="elevated" @click="confirmBorrow">Confirm Borrow</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" location="top" timeout="3000">
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.book-library {
  max-width: 1280px;
  margin: 0 auto;
}

.header-card {
  margin-bottom: 2rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.book-card {
  position: relative;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.book-card__image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.book-cover {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  padding: 1rem;
  text-align: center;
}

.book-title {
  font-size: 1.25rem;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.book-title-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.book-availability {
  position: absolute;
  top: 10px;
  right: 10px;
}

.availability-chip {
  font-weight: bold;
}

.borrow-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
}

.search-card {
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .header-card {
    margin-bottom: 1rem;
  }
  
  .book-card__image {
    height: 150px;
  }
}
</style>
