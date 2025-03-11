<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useInventory } from '@/composables/useInventory.ts'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import api from '../../../laravel-backend/resources/js/axiosInstance.ts'
import router from '@/router'
import modal_export_summary_report from './modal/modal_export_summary_report.vue'

const { fetchCurUser } = useApi()
const route = useRoute()
const userId = route.query.id
const api_token = route.query.api_token
const trans_logs = ref([])
const filters = ref()
const loading = ref(false)
const progress = ref(0)
const isLoading = ref(false)
const isModalOpen = ref(false)
const currentMessage = ref('Loading, please wait...')
const messages = ref([
  'Loading, please wait...',
  'Processing data...',
  'Initializing data...',
  'Fetching resources...',
  'Preparing your data...',
  'Almost there, hang tight...'
])

const user_role = ref(0)
const designation = ref('')
const user_id = ref('')

const loadUserData = async () => {
  const userData = await fetchCurUser()
  user_role.value = userData.data[0].role_id
  designation.value = userData.data[0].roles

  user_id.value = userData.data[0].id
  summary(user_id.value)

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

const summary = async (user_id) => {
  try {
    startProgress() // Start the progress bar
    const api_token = localStorage.getItem('api_token')
    const response = await api.get(`/getSummaryData?id=` + user_id + `&api_token=${api_token}`)
    loading.value = false
    trans_logs.value = response.data.data // Process the fetched data

    completeProgress() // Stop the progress bar
  } catch (error) {
    console.error('Error fetching customers:', error)
    loading.value = false
    completeProgress() // Stop the progress bar even in case of error
  }
}

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
    },
  }
}

const clearFilter = () => {
  initFilters()
}

const getSeverity = (status: string) => {
  switch (status) {
    case 'Serviceable':
      return 'success'

    case 'Unserviceable':
      return 'danger'
  }
}

initFilters()

onMounted(() => {
  loadUserData()
})
// Page title
const pageTitle = ref('TOTAL NUMBER OF FUNCTIONING UNITS BY YEAR ACQUIRED')
</script>
<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <modal_export_summary_report v-if="isModalOpen" :open="isModalOpen" @close="isModalOpen = false"/>

    <div class="flex flex-col gap-10 mt-4">
      <div
        class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      >
        <div
          v-if="isLoading"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          tabindex="-1"
          aria-labelledby="progress-modal"
        >
          <div
            class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl w-full max-w-4xl mx-4 lg:mx-auto transition-transform duration-500 transform"
          >
            <!-- Modal Header -->
            <div
              class="modal-content flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700"
            >
              <h3 class="text-lg font-semibold">{{ currentMessage }}</h3>
              <!-- Dynamic Message -->
            </div>
            <!-- Modal Body -->
            <div class="flex flex-col justify-center items-center gap-x-2 py-6 px-4">
              <!-- Progress Bar Container -->
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div
                  class="bg-teal-500 h-4 rounded-full transition-all"
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
              <!-- Progress Percentage -->
              <p class="mt-2 text-gray-700 dark:text-gray-300">{{ progress }}%</p>
            </div>
          </div>
        </div>
        <DataTable
          size="small"
          v-model:filters="filters"
          :value="trans_logs"
          paginator
          showGridlines
          :rows="10"
          dataKey="id"
          filterDisplay="menu"
          :loading="loading"
          :globalFilterFields="[
            'equipment_title',
            'year_2024',
            'year_2023',
            'year_2023',
            'below_2021',
          ]"
        >
          <template #header>
            <div class="flex items-center gap-4 justify-start">
              <Button
                class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                icon="pi pi-filter-slash"
                label="Clear"
                @click="clearFilter()"
              />
              <Button
                class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                icon="pi pi-file-export"
                label="Export Report"
                @click="isModalOpen=true"

              />
              <!-- Additional space between buttons and search field -->
              <div class="ml-auto flex items-center">
                <IconField class="flex items-center">
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
              </div>
            </div>
          </template>

          <Column field="equipment_title" header="Equipment Type" style="min-width: 8rem">
            <template #body="{ data }">
              {{ data.equipment_title }}

              <!-- Ensure this field exists in the data object -->
            </template>
          </Column>
          <Column
            header="2025"
            field="year_2025"
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 5rem"
          >
            <template #body="{ data }">
              {{ data.year_2025 }}
            </template>
          </Column>
          <Column
            header="2024"
            field="year_2024"
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 5rem"
          >
            <template #body="{ data }">
              {{ data.year_2024 }}
            </template>
          </Column>
          <Column field="year_2023" header="2023" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data.year_2023 }}
            </template>
          </Column>

          <Column field="year_2022" header="2022" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data.year_2022 }}
              <!-- Ensure this field exists in the data object -->
            </template>
          </Column>

          <Column field="below_2021" header="2021 Below" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data.below_2021 }}
              <!-- Ensure this field exists in the data object -->
            </template>
          </Column>
          
        </DataTable>
      </div>
    </div>
  </DefaultLayout>
</template>
