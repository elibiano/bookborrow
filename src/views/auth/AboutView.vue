<script>
export default {
  // No data or methods needed for About page
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">About Library</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="space-y-6">
        <section>
          <h2 class="text-xl font-semibold mb-4">Our Mission</h2>
          <p class="text-gray-600">
            Our library management system aims to provide efficient and user-friendly tools for managing book collections,
            tracking borrowings, and facilitating seamless interactions between students and library resources.
          </p>
        </section>
        
        <section>
          <h2 class="text-xl font-semibold mb-4">Library Hours</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="font-medium">Monday - Friday</p>
              <p class="text-gray-600">8:00 AM - 8:00 PM</p>
            </div>
            <div>
              <p class="font-medium">Saturday - Sunday</p>
              <p class="text-gray-600">10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 class="text-xl font-semibold mb-4">Contact Information</h2>
          <div class="space-y-2">
            <p><span class="font-medium">Address:</span> 123 Library Street, City, Country</p>
            <p><span class="font-medium">Phone:</span> (123) 456-7890</p>
            <p><span class="font-medium">Email:</span> contact@library.example.com</p>
          </div>
        </section>
        
        <section>
          <h2 class="text-xl font-semibold mb-4">Library Rules</h2>
          <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>Books can be borrowed for a maximum of 14 days</li>
            <li>Maximum of 5 books can be borrowed at a time</li>
            <li>Late returns incur a fine of $0.50 per day</li>
            <li>Lost or severely damaged books must be replaced or paid for</li>
            <li>Library cards are non-transferable</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
