<script>
import { SearchIcon } from 'lucide-vue-next'

export default {
  components: {
    SearchIcon
  },
  data() {
    return {
      searchTerm: '',
      books: [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', available: 3, total: 5 },
        { id: 2, title: '1984', author: 'George Orwell', category: 'Fiction', available: 2, total: 3 },
        { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic', available: 1, total: 4 },
        { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', available: 4, total: 4 },
        { id: 5, title: 'Algorithms', author: 'Robert Sedgewick', category: 'Computer Science', available: 2, total: 2 }
      ]
    }
  },
  methods: {
    viewBook(id) {
      console.log('View book with ID:', id)
      // Would navigate to book detail page in a real app
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Books</h1>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Add New Book
      </button>
    </div>
    
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b">
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search books..."
            class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="book in books" :key="book.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ book.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ book.author }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ book.category }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ book.available }}/{{ book.total }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="viewBook(book.id)" class="text-blue-600 hover:text-blue-900">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { SearchIcon } from 'lucide-vue-next'

export default {
  components: {
    SearchIcon
  },
  data() {
    return {
      searchTerm: '',
      books: [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', available: 3, total: 5 },
        { id: 2, title: '1984', author: 'George Orwell', category: 'Fiction', available: 2, total: 3 },
        { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic', available: 1, total: 4 },
        { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', available: 4, total: 4 },
        { id: 5, title: 'Algorithms', author: 'Robert Sedgewick', category: 'Computer Science', available: 2, total: 2 }
      ]
    }
  },
  methods: {
    viewBook(id) {
      console.log('View book with ID:', id)
      // Would navigate to book detail page in a real app
    }
  }
}
</script>