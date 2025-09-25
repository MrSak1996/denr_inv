<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

import api from '@/api/axiosInstance';
import { useApi } from '@/composables/useApi'

const { roles_opts, getUserRoles } = useApi()
const authStore = useAuthStore()
const api_token = authStore.api_token
const role_id = authStore.role_id ?? 0;
const generating = ref(false)
const error = ref('')
const selectedRoles = ref('')
const progress = ref(0) // Added progress state
const emit = defineEmits(['close', 'proceed'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const exportData = async () => {
  try {
    generating.value = true
    progress.value = 10 // Start progress

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 10
      }
    }, 500)

    const response = await api.get(`/export?export=true&role_id=${role_id}`, {
      responseType: 'blob'
    })




    clearInterval(progressInterval)
    progress.value = 100 // Complete progress

    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'denr_ict_inv_2024.xlsx'
    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.log(error)
  } finally {
    setTimeout(() => {
      generating.value = false
      progress.value = 0
    }, 1000) // Reset after download
  }
}

const closeModal = () => {
  emit('close')
}

onMounted(() => {
  getUserRoles(role_id)
})
</script>

<template>
  <div v-if="props.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog" tabindex="-1" aria-labelledby="progress-modal">
    <div
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl w-full max-w-lg mx-4 transition-transform duration-500 transform">
      <!-- Modal Header -->
      <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
        <h3 class="text-lg font-semibold">Generate ICT Report</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400">
          ✖
        </button>
      </div>

      <div class="qr-batch-generator">
        <div class="input-section">
          <div class="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span class="font-medium">Report Generation Instructions:</span>
            Select the desired <strong>CENRO</strong> or <strong>PENRO</strong>
            from the dropdown list to generate their respective reports. Ensure that the correct
            parameters are set before proceeding. Click the
            <strong>"Generate Report"</strong> button to download the report.
          </div>

          <Select v-model="selectedRoles" :options="roles_opts" optionLabel="name" filter
            placeholder="Select CENRO/PENRO" :maxSelectedLabels="3" class="w-full" />
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <!-- Progress Bar -->
        <div v-if="generating" class="mt-6">
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div class="bg-blue-500 h-4 rounded-full transition-all duration-300" :style="{ width: progress + '%' }">
            </div>
          </div>
          <p class="mt-2 text-center text-sm text-gray-600">{{ progress }}% completed</p>
        </div>

        <div class="actions">
          <button @click="exportData" :disabled="generating" class="generate-btn">
            {{ generating ? 'Generating...' : 'Generate Report' }}
          </button>
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
</style>
