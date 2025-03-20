<script setup>
import { ref, computed, onMounted } from 'vue'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { generateQRCodeWithLogo, formatQRCodeText } from './qrCodeUtils.js'
import { useApi } from '@/composables/useApi'
import img from '@/assets/images/prev.jpg'
import api from '../../../../laravel-backend/resources/js/axiosInstance.ts'

const files = ref([])

const getGoogleFile = async () => {
  try {
    const response = await api.get(`/getGoogleFile?id=${props.id}`) // Corrected template string syntax
    files.value = response.data // Assuming response is an array of objects like [{ url: 'image1.jpg' }, { url: 'image2.jpg' }]
  } catch (err) {
    console.error('Error fetching files:', err)
  }
}

const emit = defineEmits(['close', 'proceed'])

const props = defineProps({
  id: {
    type: Number
  },
  open: {
    type: Boolean,
    default: false
  }
})

const closeModal = () => {
  emit('close')
}

onMounted(() => {
  getGoogleFile()
})
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
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl w-full max-w-lg mx-4 transition-transform duration-500 transform"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
        <h3 class="text-lg font-semibold">View Attachments</h3>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
        >
          ✖
        </button>
      </div>

      <div class="qr-batch-generator">
        <div class="input-section">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="(file, index) in files" :key="index">
              <img class="h-auto max-w-full rounded-lg" :src="img" alt="Gallery Image" />
              <a
                :href="`https://drive.google.com/file/d/`+file.file_id+`/view?usp=drive_link`"
                target="_blank"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                View
                <svg
                  class="rtl:rotate-180 w-15 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-batch-generator {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.number-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #2c3e50;
}

input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.logo-preview {
  text-align: center;
  margin-top: 1rem;
}

.logo-img {
  width: 100px;
  height: auto;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.error {
  color: #dc3545;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
}

.generate-btn {
  background-color: #0f766e;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

.generate-btn:hover:not(:disabled) {
  background-color: #3aa876;
}

.generate-btn:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}

.progress-bar {
  margin-top: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  height: 20px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  background-color: #42b883;
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
