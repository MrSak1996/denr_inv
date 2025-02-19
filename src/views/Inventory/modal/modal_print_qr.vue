<script setup>
import { ref } from 'vue'
import api from '../../../../laravel-backend/resources/js/axiosInstance.ts'

const emit = defineEmits(['close', 'proceed'])

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

// File Input Handling
const fileInput = ref(null)
const selectedFiles = ref([])
const formData = ref(new FormData())

// Trigger file input dialog
const triggerFileInput = () => {
  fileInput.value.click()
}

// Handle file selection
const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = files.map(file => file.name) // Store file names

  formData.value = new FormData()
  files.forEach(file => {
    formData.value.append('files[]', file) // Append files to FormData
  })
}

// Send Files to Backend
const uploadAndGenerateReport = async () => {
  try {
    const response = await api.post('/upload-qrcodes', formData.value, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success) {
      emit('proceed'); // Trigger print process
      alert('QR Code Report Generated Successfully!');
    } else {
      alert('Failed to generate report');
    }
  } catch (error) {
    console.error('Error generating report:', error);
    alert('Error generating report');
  }
};


const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog"
    tabindex="-1"
    aria-labelledby="progress-modal"
  >
    <div
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-xl w-full max-w-md mx-4 transition-all duration-300 transform scale-95"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center py-4 px-5 border-b dark:border-neutral-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Generate QR Code Report</h3>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none"
        >
          ✖
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex flex-col items-center justify-center p-6 space-y-4">
        <!-- Hidden File Input -->
         
        <input 
          type="file" 
          multiple 
          class="hidden"
          ref="fileInput"
          accept="image/*"
          @change="handleFileChange"
        />

        <!-- Drag & Drop File Upload -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 w-full"
          @click="triggerFileInput"
        >
          <p class="text-gray-400" v-if="selectedFiles.length === 0">Click to select QR Code images</p>
          <ul v-else class="text-gray-700 font-medium text-sm space-y-1">
            <li v-for="(file, index) in selectedFiles" :key="index">{{ file }}</li>
          </ul>
        </div>

        <!-- Generate PDF Button -->
        <button
          class="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-150"
          @click="uploadAndGenerateReport"
        >
          Generate QR Code Report
        </button>
      </div>
    </div>
  </div>
</template>
