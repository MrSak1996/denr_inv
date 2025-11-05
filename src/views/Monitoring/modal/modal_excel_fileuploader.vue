<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import api from '@/api/axiosInstance'
import { useToast } from 'primevue/usetoast'

const emit = defineEmits(['close', 'proceed'])

const toast = useToast()
const selectedFile = ref(null)
const isUploading = ref(false)
const progress = ref(0)
const message = ref('')
const fileInput = ref(null)

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0]
}

const handleDrop = (e) => {
  selectedFile.value = e.dataTransfer.files[0]
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('excel_file', selectedFile.value)
  formData.append('filename', selectedFile.value.name)

  isUploading.value = true
  progress.value = 0
  message.value = ''

  try {
    const { data } = await api.post('/upload-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (e) => {
        if (e.lengthComputable) {
          progress.value = Math.round((e.loaded * 100) / e.total)
        }
      }
    })

    message.value = data.message || 'File uploaded successfully!'
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'File uploaded successfully!',
      life: 3000
    })
    emit('uploaded')
    emit('close')
    
    setTimeout(() => {
        location.reload();
    }, 10000);
    
  } catch (error) {
    console.error(error)
    message.value = error.response?.data?.message || 'Upload failed. Please try again.'
  } finally {
    isUploading.value = false
    selectedFile.value = null
    progress.value = 100
    if (fileInput.value) fileInput.value.value = ''
  }
}

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

onMounted(() => {})
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
        <h3 class="text-lg font-semibold">Import Data</h3>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
        >
          ✖
        </button>
      </div>

      <div class="qr-batch-generator">
        <div class="input-section">
          <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Toast />

            <div
              class="flex flex-col items-center justify-center p-4 bg-white rounded-2xl w-full max-w-lg mx-auto"
            >
              <!-- Dropzone -->
              <label
                class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input
                  type="file"
                  class="hidden"
                  @change="handleFileChange"
                  ref="fileInput"
                  accept=".xls,.xlsx"
                />
                <p class="text-gray-500" v-if="!selectedFile">
                  Drag & Drop your Excel file here, or click to browse
                </p>
                <p class="text-blue-600 font-medium" v-else>{{ selectedFile.name }}</p>
              </label>

              <!-- Upload Button -->
              <button
                class="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                :disabled="!selectedFile || isUploading"
                @click="uploadFile"
              >
                <span v-if="!isUploading">Upload</span>
                <span v-else>Uploading...</span>
              </button>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
