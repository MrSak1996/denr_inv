<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '@/router'

import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Dialog from 'primevue/dialog'

import { FilterMatchMode } from '@primevue/core/api'
import api from '../../../laravel-backend/resources/js/axiosInstance.js'

const customers = ref([]) // Stores customer data
const filters = ref() // Stores table filters
const visible = ref(false) // Controls visibility of dialogs
// const representatives = ref([...])  // Array of representative data
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'])
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
    customers.value = getCustomers(response.data) // Process the fetched data
    loading.value = false
    completeProgress() // Stop the progress bar
  } catch (error) {
    console.error('Error fetching customers:', error)
    loading.value = false
    completeProgress() // Stop the progress bar even in case of error
  }
}

// Initialize filter values
const initFilters = () => {
  filters.value = {
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    control_no: { value: null, matchMode: FilterMatchMode.CONTAINS },
    actual_division_title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    equipment_title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    acct_person: { value: null, matchMode: FilterMatchMode.CONTAINS },
    qr_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    brand: { value: null, matchMode: FilterMatchMode.CONTAINS },
    full_specs: { value: null, matchMode: FilterMatchMode.CONTAINS },
    range_category: { value: null, matchMode: FilterMatchMode.CONTAINS },
    actual_user: { value: null, matchMode: FilterMatchMode.CONTAINS }
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
const getCustomers = (data: any) => {
  return [...(data || [])].map((d: any) => {
    d.date = new Date(d.date)
    return d
  })
}

// Get severity based on status
const getSeverity = (status: string) => {
  switch (status) {
    case 'unqualified':
      return 'danger'
    case 'qualified':
      return 'success'
    case 'new':
      return 'info'
    case 'negotiation':
      return 'warn'
    case 'renewal':
      return null
  }
}

// View the record for a specific inventory item
const viewRecord = (id: string) => {
  router.push({
    path: `/inventory/create/${id}`,
    query: { api_token: localStorage.getItem('api_token') }
  })
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

// Page title
const pageTitle = ref('Inventory Management')
</script>

<style scoped>
.p-dialog-mask {
  background: rgba(0, 0, 0, 0.7); /* Adjust the overlay color and opacity */
}
.wrap-text {
  white-space: normal;
  word-wrap: break-word;
}
</style>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div class="flex flex-col gap-10">
      <div
        class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      >
        <!--Progress Bar-->
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
          :value="customers"
          paginator
          showGridlines
          :rows="10"
          dataKey="id"
          filterDisplay="menu"
          :loading="loading"
          :globalFilterFields="[
            'control_no',
            'actual_division',
            'equipment_title',
            'acct_person',
            'qr_code'
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
                type="button"
                icon="pi pi-filter-slash"
                label="Add"
                outlined
                @click="addMore()"
              />
              <Button
                type="button"
                icon="pi pi-file-export"
                label="Export"
                outlined
                @click="exportData()"
              />
              <Button
                type="button"
                icon="pi pi-refresh"
                label="Refresh"
                outlined
                @click="fetchData()"
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
          <Column field="id" header="Action" style="width: 1rem">
            <template #body="{ data }">
              <div class="card flex justify-center">
                <Button
                  label="View"
                  @click="viewRecord(data.id)"
                  icon="pi pi-eye"
                  size="small"
                  class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                />
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="control_no" header="Control No" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.control_no }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="qr_code" header="QR Code" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.qr_code }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="actual_division_title" header="Office/Division" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.actual_division_title }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="equipment_title" header="Type of ICT Equipment" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.equipment_title }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="brand" header="Brand & Model" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.brand }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column
            field="full_specs"
            header="Specifications / Descriptions"
            style="min-width: 100px"
          >
            <template #body="{ data }">
              <div class="wrap-text">
                {{ data.full_specs }}
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>

          <Column field="range_category" header="Range Category" style="min-width: 1rem">
            <template #body="{ data }">
              {{ data.range_category }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="acct_person" header="Accountable Person" style="min-width: 1rem">
            <template #body="{ data }">
              {{ data.acct_person }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="actual_user" header="Actual User" style="min-width: 1rem">
            <template #body="{ data }">
              {{ data.actual_user }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>

          <!-- <Column
            header="TYPE OF ICT EQUIPMENT"
            filterField="date"
            dataType="date"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              {{ formatDate(data.date) }}
            </template>
            <template #filter="{ filterModel }">
              <DatePicker
                v-model="filterModel.value"
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
              />
            </template>
          </Column>
          <Column
            header="YEAR ACQUIRED"
            filterField="balance"
            dataType="numeric"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              {{ formatCurrency(data.balance) }}
            </template>
            <template #filter="{ filterModel }">
              <InputNumber
                v-model="filterModel.value"
                mode="currency"
                currency="USD"
                locale="en-US"
              />
            </template>
          </Column>
          <Column
            header="SHELF LIFE"
            field="status"
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getSeverity(data.status)" />
            </template>
            <template #filter="{ filterModel }">
              <Select
                v-model="filterModel.value"
                :options="statuses"
                placeholder="Select One"
                showClear
              >
                <template #option="slotProps">
                  <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                </template>
              </Select>
            </template>
          </Column>
          <Column
            field="activity"
            header="BRAND"
            :showFilterMatchModes="false"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <ProgressBar
                :value="data.activity"
                :showValue="false"
                style="height: 6px"
              ></ProgressBar>
            </template>
            <template #filter="{ filterModel }">
              <Slider v-model="filterModel.value" range class="m-4"></Slider>
              <div class="flex items-center justify-between px-2">
                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
              </div>
            </template>
          </Column>
          <Column
            field="verified"
            header="SPECIFICATION/DESCRIPTION"
            dataType="boolean"
            bodyClass="text-center"
            style="min-width: 8rem"
          >
            <template #body="{ data }">
              <i
                class="pi"
                :class="{
                  'pi-check-circle text-green-500 ': data.verified,
                  'pi-times-circle text-red-500': !data.verified
                }"
              ></i>
            </template>
            <template #filter="{ filterModel }">
              <label for="verified-filter" class="font-bold"> Verified </label>
              <Checkbox
                v-model="filterModel.value"
                :indeterminate="filterModel.value === null"
                binary
                inputId="verified-filter"
              />
            </template>
          </Column>
          <Column
            field="verified"
            header="RANGE CATEGORY"
            dataType="boolean"
            bodyClass="text-center"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              <i
                class="pi"
                :class="{
                  'pi-check-circle text-green-500 ': data.verified,
                  'pi-times-circle text-red-500': !data.verified
                }"
              ></i>
            </template>
            <template #filter="{ filterModel }">
              <label for="verified-filter" class="font-bold"> Verified </label>
              <Checkbox
                v-model="filterModel.value"
                :indeterminate="filterModel.value === null"
                binary
                inputId="verified-filter"
              />
            </template>
          </Column>
          <Column
            field="verified"
            header="RANGE CATEGORY"
            dataType="boolean"
            bodyClass="text-center"
            style="min-width: 10rem"
          >
          </Column>
          <Column header="Accountable Person" filterField="country.name" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img
                  alt="flag"
                  src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                  :class="`flag flag-${data.acct_person}`"
                  style="width: 24px"
                />
                <span>{{ data.country.name }}</span>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
            </template>
            <template #filterclear="{ filterCallback }">
              <Button
                type="button"
                icon="pi pi-times"
                @click="filterCallback()"
                severity="secondary"
              ></Button>
            </template>
            <template #filterapply="{ filterCallback }">
              <Button
                type="button"
                icon="pi pi-check"
                @click="filterCallback()"
                severity="success"
              ></Button>
            </template>
            <template #filterfooter>
              <div class="px-4 pt-0 pb-4 text-center">Customized Buttons</div>
            </template>
          </Column>
          <Column
            header="Office/Division"
            filterField="representative"
            :showFilterMatchModes="false"
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img
                  :alt="data.representative.name"
                  :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`"
                  style="width: 32px"
                />
                <span>{{ data.representative.name }}</span>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <MultiSelect
                v-model="filterModel.value"
                :options="representatives"
                optionLabel="name"
                placeholder="Any"
              >
                <template #option="slotProps">
                  <div class="flex items-center gap-2">
                    <img
                      :alt="slotProps.option.name"
                      :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`"
                      style="width: 32px"
                    />
                    <span>{{ slotProps.option.name }}</span>
                  </div>
                </template>
              </MultiSelect>
            </template>
          </Column> -->
        </DataTable>
      </div>
    </div>
  </DefaultLayout>
</template>
