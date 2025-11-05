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
    <modal_excel_fileuploader v-if="openFileUploader" :open="openFileUploader" @close="openFileUploader = false"  @uploaded="fetchImportedData()"/>
    <div class="flex flex-col gap-10 mt-4">
      <div
        class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
       
        <DataTable size="small" :value="imported_data" paginator showGridlines :rows="10" dataKey="filename"
          :loading="loading" :globalFilterFields="['filename', 'Date Imported', 'Total Rows']">
          <template #header>
            <div class="flex items-center gap-4 justify-start">
              <Button
                class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                type="button" icon="pi pi-filter-slash" label="Clear" @click="clearFilter()" />
              <Button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                type="button" icon="pi pi-file-export" label="Import Report" @click="openModal()" />
              <!-- <div class="ml-auto flex items-center">
                <IconField class="flex items-center">
                  <InputIcon><i class="pi pi-search" /></InputIcon>
                  <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
              </div> -->
            </div>
          </template>

          <!-- File Name -->
          <Column field="filename" header="File Name" style="min-width: 10rem">
            <template #body="{ data }">
              {{ data.filename }}
            </template>
          </Column>

          <!-- Date Imported -->
          <Column field="Date Imported" header="Date Imported" style="min-width: 10rem">
            <template #body="{ data }">
              {{ new Date(data['created_at']).toLocaleString() }}
            </template>
          </Column>

          <!-- Total Rows -->
          <Column field="Total Rows" header="Total Rows" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data['total_rows'] }}
            </template>
          </Column>
                   <Column field="uploaded_by" header="Uploaded By" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data['uploaded_by'] }}
            </template>
          </Column>
        </DataTable>

      </div>
    </div>
  </DefaultLayout>
</template>
