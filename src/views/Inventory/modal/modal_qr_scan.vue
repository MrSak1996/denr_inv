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
      <div
        v-focustrap
        class="flex justify-between items-center py-4 px-6 border-b dark:border-neutral-700"
      >
        <InputText autofocus class="w-full" v-model="searchValue" placeholder="Scan QR Code" />
      </div>

      <!-- Modal Body -->
      <div class="flex flex-col justify-center items-center py-2 px-2">
        <Button @click="closeModal" severity="info" label="Close" icon="pi pi-undo" class="mt-2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

// Reactive variables
const searchValue = ref('')
const debounceTimer = ref<NodeJS.Timeout | null>(null)

// Props and Emits
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close'])
const route = useRoute()
const api_token = route.query.api_token

// Close Modal
const closeModal = () => {
  emit('close')
}

// Watch for changes in the search input and debounce navigation
watch(searchValue, (newValue) => {
  if (newValue) {
    // Clear any existing debounce timer
    if (debounceTimer.value) clearTimeout(debounceTimer.value)

    // Set a new debounce timer
    debounceTimer.value = setTimeout(() => {
      // const targetUrl = `http://10.201.12.184:8080/inventory/create/${newValue}?api_token=${api_token}`
      router.push({
        path: `/inventory/create/${newValue}&item_id=${newValue}`,
        query:{api_token:api_token,option:"scan"}
      })
    }, 1000) // Delay of 1 second
  }
})
</script>
