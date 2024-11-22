<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog"
    aria-labelledby="reserve-control-no"
    aria-modal="true"
  >
    <div
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-lg w-full max-w-2xl mx-4 lg:mx-auto transition-transform duration-300 transform scale-100"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center py-4 px-6 border-b dark:border-neutral-700">
        <h3 id="reserve-control-no" class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Operating System
        </h3>
      </div>

      <!-- Modal Body -->
      <div class="flex flex-col justify-center items-center py-8 px-6">
        <p class="text-gray-700 dark:text-gray-300 mb-4 text-center">
          Please select the installed operating system:
        </p>
        <InputText v-model="software" class="w-full mb-4" />
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-150"
          @click="proceed"
        >
          <i class="pi pi-save"></i>
          <span>Proceed</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router'
import InputText from 'primevue/inputtext'
import api from '../../../../laravel-backend/resources/js/axiosInstance.js'
const toast = useToast()
const route = useRoute()


// Props
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'proceed'])

// Reactive state
const software = ref('')

// Methods
const closeModal = () => {
  emit('close')
}

const proceed = async () => {
  try {
    const requestData = {
      control_id: route.params.id,
      os_installed: software.value
    }
    const response = await api.post('/post_add_os', requestData)
    
    setTimeout(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data saved successfully!',
        life: 3000
      })
      emit("close");

     
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}
</script>
