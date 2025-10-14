<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import api from '@/api/axiosInstance';
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'

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
const authStore = useAuthStore()

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

const loadUserData = async () => {
  const userData = await fetchCurUser()
  user_role.value = userData.data[0].role_id
  designation.value = userData.data[0].roles
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

const fetchTransaction = async () => {
  try {
    startProgress() // Start the progress bar
    const api_token = localStorage.getItem('api_token')
    const userData = await fetchCurUser()
 
    const response = await api.get(
      `/fetchTransaction?api_token=${api_token}&designation=${authStore.role_id}`
    )
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
    transaction_type: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    qr_code: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    quantity: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    previous_quantity: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    current_quantity: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    destination_location: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    accountable_user: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    transaction_date: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    remarks: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    updated_by: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
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

const viewRecord = (id: string) => {
  router.push({
    path: `/inventory/create/${id}`,
    query: { api_token: localStorage.getItem('api_token') }
  })
}

const resetForm = () => {
  // Add logic to reset form fields here
  console.log('Form reset logic goes here')
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const updateFilterWithQrValue = (qrValue: string) => {
  filters.value['global'].value = qrValue
}
initFilters()

onMounted(() => {
  loadUserData()
  fetchTransaction()
})
// Page title
const pageTitle = ref('ICT Equipment Transaction Logs')
</script>
<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
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
            'transaction_type',
            'qr_code',
            'quantity',
            'equipment_title',
            'accountable_user',
            'destination_location',
            'transaction_date',
            'remarks',
            'updated_by'
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

          <Column field="transaction_type" header="Transaction Type" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="flex justify-center items-center">
                <Tag :value="data.transaction_type" severity="success" class="text-center" />
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText
                v-model="filterModel.value"
                type="text"
                placeholder="Search by transaction"
              />
            </template>
          </Column>

          <Column field="qr_code" header="QR Code" style="min-width: 8rem">
            <template #body="{ data }">
              <QrcodeVue
                v-if="data.qr_code && data.qr_code.trim() !== ''"
                :value="data.qr_code"
                :size="80"
                class="text-center"
              />
              {{ data.qr_code }}

              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>

          <Column field="source_location" header="Source Location" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data.source_location }}
            </template>
            <template #filter="{ filterModel }">
              <InputText
                v-model="filterModel.value"
                type="text"
                placeholder="Search by source location"
              />
            </template>
          </Column>
          <Column
            field="destination_location"
            header="Destination Location"
            style="min-width: 5rem"
          >
            <template #body="{ data }">
              {{ data.destination_location }}
            </template>
            <template #filter="{ filterModel }">
              <InputText
                v-model="filterModel.value"
                type="text"
                placeholder="Search by destination"
              />
            </template>
          </Column>
          <Column field="accountable_user" header="Accountable User" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data.accountable_user }}
            </template>
            <template #filter="{ filterModel }">
              <InputText
                v-model="filterModel.value"
                type="text"
                placeholder="Search by destination"
              />
            </template>
          </Column>
          <Column field="transaction_date" header="Transaction Date" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data.transaction_date }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>

          <Column field="remarks" header="Remarks" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data.remarks }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by remarks" />
            </template>
          </Column>
          <Column field="updated_by" header="Updated By" style="min-width: 5rem">
            <template #body="{ data }">
              {{ data.updated_by }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </DefaultLayout>
</template>
