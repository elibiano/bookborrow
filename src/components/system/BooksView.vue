<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const page = ref(1);
const editDialog = ref(false);
const deleteDialog = ref(false);
const editedBook = ref({});

const books = ref([
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    publishYear: 1925,
    available: 2,
    total: 3
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    publishYear: 1960,
    available: 1,
    total: 4
  },
  {
    id: 3,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    publishYear: 1813,
    available: 0,
    total: 2
  },
  {
    id: 4,
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    publishYear: 1949,
    available: 5,
    total: 5
  },
  {
    id: 5,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    category: 'Fiction',
    publishYear: 1951,
    available: 3,
    total: 3
  }
]);

const searchBooks = () => {
  // Here would go the API call to search for books
  console.log('Searching for:', searchQuery.value);
};

const editBook = (book) => {
  editedBook.value = { ...book };
  editDialog.value = true;
};

const saveBookEdit = () => {
  // Here would go the API call to update the book
  const index = books.value.findIndex(book => book.id === editedBook.value.id);
  if (index !== -1) {
    books.value[index] = { ...editedBook.value };
  }
  editDialog.value = false;
};

const confirmDeleteBook = (book) => {
  editedBook.value = { ...book };
  deleteDialog.value = true;
};

const deleteBook = () => {
  // Here would go the API call to delete the book
  books.value = books.value.filter(book => book.id !== editedBook.value.id);
  deleteDialog.value = false;
};

const navigateToAddBook = () => {
  router.push('/submit');
};
</script>

<template>
  <div>
    <h1 class="text-h3 mb-6">Books Management</h1>
    
    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="d-flex">
            <v-text-field
              v-model="searchQuery"
              label="Search books..."
              hide-details
              density="compact"
              class="mr-2"
              width="300"
            ></v-text-field>
            <v-btn color="primary" @click="searchBooks">Search</v-btn>
          </div>
          
          <v-btn color="primary" @click="navigateToAddBook">Add New Book</v-btn>
        </div>
        
        <v-table class="mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Publish Year</th>
              <th>Available / Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>{{ book.id }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.category }}</td>
              <td>{{ book.publishYear }}</td>
              <td>{{ book.available }} / {{ book.total }}</td>
              <td>
                <v-btn
                  size="small"
                  color="primary"
                  class="mr-2"
                  @click="editBook(book)"
                >
                  Edit
                </v-btn>
                <v-btn
                  size="small"
                  color="error"
                  @click="confirmDeleteBook(book)"
                >
                  Delete
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        
        <div class="d-flex justify-center mt-4">
          <v-pagination
            v-model="page"
            :length="3"
            rounded="circle"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- Dialog for editing a book -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Edit Book</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveBookEdit">
            <v-text-field v-model="editedBook.title" label="Title"></v-text-field>
            <v-text-field v-model="editedBook.author" label="Author"></v-text-field>
            <v-text-field v-model="editedBook.category" label="Category"></v-text-field>
            <v-text-field v-model="editedBook.publishYear" label="Publish Year" type="number"></v-text-field>
            <v-text-field v-model="editedBook.total" label="Total Copies" type="number"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="saveBookEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Dialog for confirming deletion -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Delete Book</v-card-title>
        <v-card-text>
          Are you sure you want to delete this book?
          <p class="mt-2"><strong>{{ editedBook.title }}</strong> by {{ editedBook.author }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" text @click="deleteBook">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>