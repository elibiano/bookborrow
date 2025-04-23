<script>
import { BookIcon, UsersIcon, ClockIcon } from 'lucide-vue-next'

export default {
components: {
BookIcon,
UsersIcon,
ClockIcon
}
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <BookIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Books</p>
            <p class="text-2xl font-bold text-gray-900">1,234</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <UsersIcon class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Active Borrowings</p>
            <p class="text-2xl font-bold text-gray-900">156</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100">
            <ClockIcon class="h-6 w-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Due Today</p>
            <p class="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Recent Borrowings</h2>
        <div class="space-y-4"><div v-for="i in 3" :key="i" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
  <div>
    <p class="font-medium">The Great Gatsby</p>
    <p class="text-sm text-gray-500">Borrowed by John Doe</p>
  </div>
  <span class="text-sm text-gray-500">2 days ago</span>
</div>
</div>
</div>

<div class="bg-white p-6 rounded-lg shadow">
<h2 class="text-lg font-semibold mb-4">Overdue Books</h2>
<div class="space-y-4">
<div v-for="i in 3" :key="i" class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
  <div>
    <p class="font-medium">1984</p>
    <p class="text-sm text-gray-500">Borrowed by Jane Smith</p>
  </div>
  <span class="text-sm text-red-600">Overdue 3 days</span>
</div>
</div>
</div>
</div>
</div>
</template>

