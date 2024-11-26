<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '@/router'

import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DataStatsOne from '@/components/DataStats/DataStatsOne.vue'

import DefaultLayout from '@/layouts/DefaultLayout.vue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import Select from 'primevue/select'

import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import api from '../../../laravel-backend/resources/js/axiosInstance.js'

const customers = ref([]) // Stores customer data
const total_item = ref(0)
const serviceable_count = ref(0)
const unserviceable_count = ref(0)
const outdated_count = ref(0)
const filters = ref() // Stores table filters
const visible = ref(false) // Controls visibility of dialogs
// const representatives = ref([...])  // Array of representative data
const statuses = ref(['Serviceable', 'Unserviceable'])
const loading = ref(false) // Tracks loading state

// Progress bar state
const progress = ref(0)
const isLoading = ref(false)
const currentMessage = ref('Loading, please wait...')
const messages = ref([
  'Loading, please wait...',
  'Processing data...',
  'Initializing data...',
  'Fetching resources...',
  'Preparing your data...',
  'Almost there, hang tight...'
])

// Start progress bar animation
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

// Complete progress bar animation
const completeProgress = () => {
  progress.value = 100
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

// Random message for progress updates
const updateMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.value.length)
  currentMessage.value = messages.value[randomIndex]
}

// Fetch customer data from the API
const fetchData = async () => {
  try {
    startProgress() // Start the progress bar
    const response = await api.get(`/getInventoryData`)
    total_item.value = Number(response.data.count) // Set the count if it exists
    customers.value = getRawData(response.data.data) // Process the fetched data
    loading.value = false
    completeProgress() // Stop the progress bar
  } catch (error) {
    console.error('Error fetching customers:', error)
    loading.value = false
    completeProgress() // Stop the progress bar even in case of error
  }
}

const getCountStatus = async () => {
  const response = await api.get(`/getCountStatus`)
  serviceable_count.value = getRawData(Number(response.data.serviceable_count)) // Set the count if it exists
  unserviceable_count.value = getRawData(Number(response.data.unserviceable_count)) // Set the count if it exists
}

const getOutdatedEquipment = async () => {
  const response = await api.get(`/getOutdatedEquipment`)
  outdated_count.value = Number(response.data.count) // Set the count if it exists
}

// Initialize filter values
const initFilters = () => {
  filters.value = {
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    actual_division_title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    acct_division_title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    equipment_title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    acct_person: { value: null, matchMode: FilterMatchMode.CONTAINS },
    qr_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mon_qr_code1: { value: null, matchMode: FilterMatchMode.CONTAINS },
    mon_qr_code2: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ups_qr_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    brand: { value: null, matchMode: FilterMatchMode.CONTAINS },
    full_specs: { value: null, matchMode: FilterMatchMode.CONTAINS },
    range_category: { value: null, matchMode: FilterMatchMode.CONTAINS },
    actual_user: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    control_no: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  }
}

initFilters()

// Format date to 'MM/DD/YYYY'
const formatDate = (value: Date) => {
  return value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Format value to currency (USD)
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

// Clear all filters
const clearFilter = () => {
  initFilters()
}

// Navigate to the create page for inventory
const addMore = () => {
  router.push({ path: '/inventory/create' })
}

// Process fetched customer data
const getRawData = (data: any) => {
  return [...(data || [])].map((d: any) => {
    d.date = new Date(d.date)
    return d
  })
}

// Get severity based on status
const getSeverity = (status: string) => {
  switch (status) {
    case 'Serviceable':
      return 'success'

    case 'Unserviceable':
      return 'danger'
  }
}

// View the record for a specific inventory item
const viewRecord = (id: string) => {
  router.push({
    path: `/inventory/create/${id}`,
    query: { api_token: localStorage.getItem('api_token') }
  })
}

const printRecord = async (id: string) => {
  try {
    const url = `http://127.0.0.1:8000/api/generatePDFReport?id=${id}`
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}

// Export inventory data to Excel
const exportData = async () => {
  try {
    const response = await api.get('http://localhost:8000/api/export?export=true', {
      responseType: 'blob'
    })

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
    console.error('Error exporting data:', error)
  }
}

onMounted(() => {
  fetchData()
  getCountStatus()
  getOutdatedEquipment()
})
// Page title
const pageTitle = ref('User Management')
</script>
<style>
.bg-primary {
  background: rgb(28 36 52) !important;
}
.border-primary {
  border-color: rgb(28 36 52) !important;
}
</style>
<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div class="grid grid-cols-12 gap-6 mb-4">
      <!-- Buttons Column (Equivalent to Bootstrap col-lg-3) -->
      <div class="col-span-12 md:col-span-2">
        <div class="grid grid-cols-1 gap-4">
          <router-link
            to="/user-management/account-details"
            class="block w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white text-center transition hover:bg-opacity-90"
          >
            Account Details
          </router-link>
          <router-link
            to="/user-management/accounts?create"
            class="block w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white text-center transition hover:bg-opacity-90"
          >
            Create Accounts
          </router-link>
          <router-link
            to="/user-management/block-accounts"
            class="block w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white text-center transition hover:bg-opacity-90"
          >
            Block Accounts
          </router-link>
          <router-link
            to="/user-management/newly-registered"
            class="block w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white text-center transition hover:bg-opacity-90"
          >
            Newly Registered Accounts
          </router-link>
        </div>
      </div>

      <!-- DataTable Column (Equivalent to Bootstrap col-lg-9) -->
      <div class="col-span-12 md:col-span-10">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <DataTable
            size="small"
            v-model:filters="filters"
            :value="customers"
            paginator
            showGridlines
            :rows="10"
            dataKey="id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="[
              'control_no',
              'acct_person',
              'equipment_title',
              'acct_person',
              'qr_code',
              'mon_qr_code1',
              'mon_qr_code2',
              'ups_qr_code',
              'actual_division_title',
              'acct_division_title',
              'brand',
              'status'
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
            <!-- <template #empty> No customers found. </template>
          <template #loading> Loading customers data. Please wait. </template> -->
            <Column field="id" header="Employee No." style="width: 1rem">
              <template #body="{ data }">
                <div class="card flex justify-center">
                  <Button
                    @click="viewRecord(data.id)"
                    icon="pi pi-eye"
                    size="small"
                    class="text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  />
                  <Button
                    @click="printRecord(data.id)"
                    icon="pi pi-print"
                    size="small"
                    class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-blue-800"
                    severity="info"
                  />
                </div>
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
            <Column field="control_no" header="Designation" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.control_no }}
                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>

            <Column field="qr_code" header="Employee Name" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.qr_code }}

                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>

            <Column field="mon_qr_code1" header="Division" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.mon_qr_code1 }}

                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
            <Column field="mon_qr_code2" header="Position" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.mon_qr_code2 }}

                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
            <Column field="ups_qr_code" header="Username" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.ups_qr_code }}

                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
            <Column field="actual_division_title" header="Active Email" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.actual_division_title }}
                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
            <Column field="equipment_title" header="Contact Details" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.equipment_title }}
                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
