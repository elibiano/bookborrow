<script setup>
import { ref } from 'vue'

// Sample data for recent borrowings
const recentBorrowings = ref([
  {
    studentId: 'ST101',
    bookTitle: 'The Great Gatsby',
    borrowDate: '2025-04-10',
    returnDate: '2025-04-24',
    status: 'Borrowed',
  },
  {
    studentId: 'ST105',
    bookTitle: 'To Kill a Mockingbird',
    borrowDate: '2025-04-12',
    returnDate: '2025-04-26',
    status: 'Borrowed',
  },
  {
    studentId: 'ST098',
    bookTitle: 'Pride and Prejudice',
    borrowDate: '2025-04-05',
    returnDate: '2025-04-19',
    status: 'Overdue',
  },
])

// Sample data for recently added books
const recentBooks = ref([
  {
    title: 'The Algorithm Design Manual',
    author: 'Steven S. Skiena',
    category: 'Computer Science',
    availableCopies: '3',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Science Fiction',
    availableCopies: '5',
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    availableCopies: '2',
  },
])
</script>

<template>
  <div>
    <v-sheet color="primary" class="welcome-banner pa-10 mb-8 rounded text-white">
      <h1 class="text-h4 mb-2">Welcome to Library Management System</h1>
      <p>Manage your library's books and borrowings efficiently.</p>
    </v-sheet>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-text class="text-center">
            <p class="text-subtitle-1 text-medium-emphasis">Total Books</p>
            <p class="text-h3 font-weight-bold text-grey-darken-3">523</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-text class="text-center">
            <p class="text-subtitle-1 text-medium-emphasis">Books Borrowed</p>
            <p class="text-h3 font-weight-bold text-grey-darken-3">48</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-text class="text-center">
            <p class="text-subtitle-1 text-medium-emphasis">Available Books</p>
            <p class="text-h3 font-weight-bold text-grey-darken-3">475</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card">
          <v-card-text class="text-center">
            <p class="text-subtitle-1 text-medium-emphasis">Active Students</p>
            <p class="text-h3 font-weight-bold text-grey-darken-3">127</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-6">
      <v-card-title>Recent Borrowings</v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Book Title</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in recentBorrowings" :key="index">
              <td>{{ item.studentId }}</td>
              <td>{{ item.bookTitle }}</td>
              <td>{{ item.borrowDate }}</td>
              <td>{{ item.returnDate }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-card class="mt-6">
      <v-card-title>Recently Added Books</v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Available Copies</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(book, index) in recentBooks" :key="index">
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.category }}</td>
              <td>{{ book.availableCopies }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>
