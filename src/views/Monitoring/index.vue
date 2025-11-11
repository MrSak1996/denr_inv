<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import { useApi } from '@/composables/useApi'
import { useInventory } from '@/composables/useInventory'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import api from '@/api/axiosInstance';
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import modal_excel_fileuploader from './modal/modal_excel_fileuploader.vue'
import { RefSymbol } from '@vue/reactivity'

const authStore = useAuthStore()
const { fetchCurUser, roles_opts, getUserRoles } = useApi()
const route = useRoute()
const toast = useToast()

const userId = route.query.id
const api_token = route.query.api_token
const imported_data = ref([])
const filters = ref()
const loading = ref(false)
const progress = ref(0)
const isLoading = ref(false)
const openFileUploader = ref(false)
const currentMessage = ref('Loading, please wait...')
const selectedRole = ref<number | null>(null); // Selected role from dropdown
const messages = ref([
  'Loading, please wait...',
  'Processing data...',
  'Initializing data...',
  'Fetching resources...',
  'Preparing your data...',
  'Almost there, hang tight...'
])
const generating = ref(false)


const user_role = ref(0)
const designation = ref('')
const user_id = ref('')

const loadUserData = async () => {
  const userData = await fetchCurUser()
  user_role.value = userData.data[0].role_id
  designation.value = userData.data[0].roles

  user_id.value = userData.data[0].id
}

const startProgress = () => {
  progress.value = 0
  isLoading.value = true
  updateMessage()
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Number((Math.random() * 10).toFixed(2)) // Simulate progress increase
      updateMessage()
    } else {
      clearInterval(interval)
    }
  }, 500)
}

const completeProgress = () => {
  progress.value = 100
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const updateMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.value.length)
  currentMessage.value = messages.value[randomIndex]
}

const fetchImportedData = async () => {
  try {
    startProgress();
    const response = await api.get(
      `/file-summary`
    );

    loading.value = false;
    imported_data.value = response.data.data;
    completeProgress();
  } catch (error) {
    console.error("Error fetching customers:", error);
    loading.value = false;
    completeProgress();
  }
};



const initFilters = () => {
  filters.value = {
    id: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    equipment_title: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    year_202: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    year_2023: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    year_2022: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    below_2021: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  }
}

const clearFilter = () => {
  initFilters()
}

const openModal = async () => {
  openFileUploader.value = true;
}

const formatMessage = (message) => {
  if (!message) return '';
  // Preserve emojis and timestamps; replace newlines with <br>
  return message.replace(/\n/g, '<br>');
};

const formatDetails = (details) => {
  if (!details) return '';
  try {
    const parsed = typeof details === 'string' ? JSON.parse(details) : details;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return details;
  }
};


initFilters()

onMounted(() => {
  loadUserData()
  getUserRoles(authStore.role_id)
  fetchImportedData()
})
// Page title
const pageTitle = ref('Data Monitoring')
</script>
<template>
  <Toast />

  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <modal_excel_fileuploader v-if="openFileUploader" :open="openFileUploader" @close="openFileUploader = false"
      @uploaded="fetchImportedData()" />
    <div class="flex flex-col gap-10 mt-4">
      <div
        class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

        <DataTable size="small" :value="imported_data" paginator showGridlines :rows="10" dataKey="filename"
          :loading="loading" :globalFilterFields="['filename', 'created_at', 'uploaded_by']">
          <template #header>
            <div class="flex items-center gap-4 justify-start">
              <Button
                class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
                icon="pi pi-filter-slash" label="Clear" @click="clearFilter" />
              <Button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
                icon="pi pi-file-export" label="Import Report" @click="openModal" />
            </div>
          </template>

          <!-- File Name -->
          <Column field="filename" header="File Name" style="min-width: 12rem;">
            <template #body="{ data }">
              <span class="font-semibold">{{ data.filename }}</span>
            </template>
          </Column>

          <!-- Message -->
          <Column field="message" header="Message" style="min-width: 600px;">
            <template #body="{ data }">
              <div
                class="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded-md border overflow-y-auto  max-w-[600px] max-h-32 leading-relaxed"
                v-html="formatMessage(data.message)"></div>
            </template>
          </Column>

          <!-- Details -->
          <Column field="details" header="Details" style="min-width: 10rem;">
            <template #body="{ data }">
              <div class="bg-gray-50 text-xs p-2 rounded-md border overflow-y-auto max-h-32 max-w-[250px] whitespace-pre-wrap">
                <pre>{{ formatDetails(data.details) }}</pre>
              </div>
            </template>
          </Column>

          <!-- Date Imported -->
          <Column field="created_at" header="Date Imported" style="min-width: 10rem;">
            <template #body="{ data }">
              {{ new Date(data.created_at).toLocaleString() }}
            </template>
          </Column>

         

          <!-- Uploaded By -->
          <Column field="uploaded_by" header="Uploaded By" style="min-width: 8rem;">
            <template #body="{ data }">
              {{ data.uploaded_by }}
            </template>
          </Column>
        </DataTable>


      </div>
    </div>
  </DefaultLayout>
</template>
