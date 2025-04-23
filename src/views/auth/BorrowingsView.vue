<script>
import { SearchIcon } from 'lucide-vue-next'

export default {
  components: {
    SearchIcon
  },
  data() {
    return {
      searchTerm: '',
      filterStatus: '',
      borrowings: [
        { id: 1, student: 'John Doe', book: 'The Great Gatsby', borrowDate: '2024-04-15', returnDate: '2024-04-22', status: 'active' },
        { id: 2, student: 'Jane Smith', book: '1984', borrowDate: '2024-04-10', returnDate: '2024-04-20', status: 'overdue' },
        { id: 3, student: 'Mike Johnson', book: 'To Kill a Mockingbird', borrowDate: '2024-04-05', returnDate: '2024-04-12', status: 'returned' },
        { id: 4, student: 'Sarah Lee', book: 'Pride and Prejudice', borrowDate: '2024-04-18', returnDate: '2024-04-25', status: 'active' },
        { id: 5, student: 'Alex Brown', book: 'Algorithms', borrowDate: '2024-04-01', returnDate: '2024-04-08', status: 'returned' }
      ]
    }
  },
  computed: {
    filteredBorrowings() {
      return this.borrowings.filter(borrowing => {
        // Filter by status if selected
        if (this.filterStatus && borrowing.status !== this.filterStatus) return false;
        
        // Filter by search term
        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          return borrowing.student.toLowerCase().includes(term) || 
                 borrowing.book.toLowerCase().includes(term);
        }
        
        return true;
      });
    }
  },
  methods: {
    viewDetails(id) {
      console.log('View borrowing details for ID:', id);
      // Would navigate to borrowing detail view or show modal in a real app
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Borrowings</h1>
    
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b">
        <div class="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <select 
            v-model="filterStatus" 
            class="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
          </select>
          <div class="relative flex-1">
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search by student or book..."
              class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="borrowing in filteredBorrowings" :key="borrowing.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ borrowing.student }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ borrowing.book }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ borrowing.borrowDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ borrowing.returnDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': borrowing.status === 'active',
                    'bg-red-100 text-red-800': borrowing.status === 'overdue',
                    'bg-gray-100 text-gray-800': borrowing.status === 'returned'
                  }"
                >
                  {{ borrowing.status.charAt(0).toUpperCase() + borrowing.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="viewDetails(borrowing.id)" class="text-blue-600 hover:text-blue-900">View Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>