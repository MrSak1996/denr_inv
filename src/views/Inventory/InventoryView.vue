<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
const { fetchCurUser } = useApi()
const route = useRoute()

import router from '@/router'
import form_dash from './form_dash.vue';
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

const customers = ref([])
const qr_code = ref()
const total_item = ref(0)
const serviceable_count = ref(0)
const unserviceable_count = ref(0)
const outdated_count = ref(0)
const filters = ref()
const loading = ref(false)
const progress = ref(0)
const isLoading = ref(false)
const isUploading = ref(false)
const image = ref(null)
const isModalOpen = ref(false)
const openQR = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref()
const currentMessage = ref('Loading, please wait...')
const statuses = ref(['Serviceable', 'Unserviceable'])
const messages = ref([
  'Loading, please wait...',
  'Processing data...',
  'Initializing data...',
  'Fetching resources...',
  'Preparing your data...',
  'Almost there, hang tight...'
])
const userId = route.query.id
const user_role =ref(0)
const designation =ref('')
const api_token = route.query.api_token

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

const fetchData = async () => {
  try {
    startProgress() // Start the progress bar
    const api_token = localStorage.getItem('api_token')
    const response = await api.get(`/getInventoryData?api_token=${api_token}`)
    total_item.value = Number(response.data.count) // Set the count if it exists
    customers.value = response.data.data // Process the fetched data
    loading.value = false
    completeProgress() // Stop the progress bar
  } catch (error) {
    console.error('Error fetching customers:', error)
    loading.value = false
    completeProgress() // Stop the progress bar even in case of error
  }
}

const getCountStatus = async () => {
  const response = await api.get(`/getCountStatus?api_token=${api_token}`)
  serviceable_count.value = response.data.serviceable_count // Set the count if it exists
  unserviceable_count.value = Number(response.data.unserviceable_count) // Set the count if it exists
}

const getOutdatedEquipment = async () => {
  const response = await api.get(`/getOutdatedEquipment?api_token=${api_token}`)
  outdated_count.value = Number(response.data.count) // Set the count if it exists
}

const initFilters = () => {
  filters.value = {
    id: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    actual_division_title: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    acct_division_title: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    equipment_title: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    acct_person: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    qr_code: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    mon_qr_code1: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    mon_qr_code2: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    ups_qr_code: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    brand: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    full_specs: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    range_category: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    actual_user: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    control_no: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    registered_loc: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const addMore = () => {
  router.push({ name: 'InventoryCreate', query: { id: userId, api_token: api_token } })
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

const printRecord = async (id: string) => {
  try {
    const url = `http://127.0.0.1:8000/api/generatePDFReport?id=${id}`
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}

const simulateUpload = () => {
  isUploading.value = true
  progress.value = 0

  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 10 // Increment progress
    } else {
      clearInterval(interval)
      isUploading.value = false
      uploadSuccess.value = true // Mark upload as successful
      setTimeout(() => closeModal(), 2000) // Auto close modal after completion
    }
  }, 500)
}

const openModal = (id: String) => {
  isModalOpen.value = true
  qr_code.value = id
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const onFileChange = (event) => {
  image.value = event.target.files[0]
}

const triggerFileInput = () => {
  document.querySelector("input[type='file']").click()
}

const uploadImage = async () => {
  if (!image.value) return

  const formData = new FormData()
  formData.append('image', image.value)
  formData.append('destination_folder', designation.value)
  formData.append('qr_code', qr_code.value)
  try {
    simulateUpload()

    const response = await api.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.status) {
      uploadSuccess.value = true
      uploadError.value = null
    }
  } catch (error) {
    uploadSuccess.value = false
    uploadError.value = error.response?.data?.message || 'An error occurred.'
  }
}

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

const resetForm = () => {
  image.value = null
  progress.value = 0
  isUploading.value = false
  uploadSuccess.value = false
  uploadError.value = ''
}

onMounted(() => {
  loadUserData()
  fetchData()
  getCountStatus()
  getOutdatedEquipment()
})
// Page title
const pageTitle = ref('Inventory Management')
</script>

<style scoped>
.p-dialog-mask {
  background: rgba(0, 0, 0, 0.7);
  /* Adjust the overlay color and opacity */
}

.wrap-text {
  white-space: normal;
  word-wrap: break-word;
}
</style>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
      <!-- <DataStatsOne
        :total_equipment="total_item"
        :total_serviceable_count="serviceable_count"
        :total_unserviceable_count="unserviceable_count"
        :outdated_equipment="outdated_count"
      /> -->
    </div>

     <form_dash 
     :role_id="user_role" 
     :office="designation" 
     :total_equipment="total_item"
     :total_serviceable_count="serviceable_count"
     :total_unserviceable_count="unserviceable_count"
     :outdated_equipment="outdated_count" />

    <div class="flex flex-col gap-10 mt-4">
      <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1" >
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
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          tabindex="-1"
          aria-labelledby="progress-modal"
        >
          <div
            class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl w-full max-w-lg mx-4 transition-transform duration-500 transform"
          >
            <!-- Modal Header -->
            <div
              class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700"
            >
              <h3 class="text-lg font-semibold">Attach MOV's</h3>
              <button
                @click="closeModal"
                class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
              >
                ✖
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-4">
              <!-- Upload Form -->
              <form @submit.prevent="uploadImage">
                <label class="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400"
                  @click="triggerFileInput"
                >
                  <p v-if="!image" class="text-gray-400">Click to select an image file</p>
                  <p v-else class="text-gray-700 font-medium">{{ image.name }}</p>
                  <input type="file" @change="onFileChange" accept="image/*" class="hidden" />
                </div>

                <button
                  type="submit"
                  class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
                  :disabled="!image || isUploading"
                >
                  Upload
                </button>
              </form>

              <!-- Progress Bar -->
              <div v-if="isUploading" class="mt-6">
                <div class="w-full bg-gray-200 rounded-full h-4">
                  <div
                    class="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    :style="{ width: progress + '%' }"
                  ></div>
                </div>
                <p class="mt-2 text-center text-sm text-gray-600">{{ progress }}% completed</p>
              </div>

              <!-- Success/Error Messages -->
              <div v-if="uploadSuccess" class="mt-4 text-green-600">
                Image uploaded successfully!
              </div>
              <div v-if="uploadError" class="mt-4 text-red-600">
                Failed to upload image: {{ uploadError }}
              </div>
            </div>
          </div>
        </div>
        <!-- end of progress bar -->

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
            'registered_loc',
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
                  @click="viewRecord(data.id)"
                  icon="pi pi-eye"
                  size="small"
                  class="text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                />
                <Button
                  @click="printRecord(data.id)"
                  icon="pi pi-print"
                  size="small"
                  class="text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                />
                <Button
                  @click="openModal(data.control_no)"
                  icon="pi pi-cloud-upload"
                  size="small"
                  class="text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                />
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="control_no" header="Control No" style="min-width: 12rem">
            <template #body="{ data }">
              <Tag value="new" severity="success" class="text-center" /><br>
              {{ data.control_no }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="registered_loc" header="Registered Location" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.registered_loc }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column
            header="Status"
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
          <Column field="qr_code" header="ICT Equipment QR Code" style="min-width: 12rem">
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

          <Column field="mon_qr_code1" header="Monitor 1 QR Code" style="min-width: 12rem">
            <template #body="{ data }">
              <QrcodeVue
                v-if="data.mon_qr_code1 && data.mon_qr_code1.trim() !== ''"
                :value="data.mon_qr_code1"
                :size="80"
                class="text-center"
              />
              {{ data.mon_qr_code1 }}

              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="mon_qr_code2" header="Monitor 2 QR Code" style="min-width: 12rem">
            <template #body="{ data }">
              <QrcodeVue
                v-if="data.mon_qr_code2 && data.mon_qr_code2.trim() !== ''"
                :value="data.mon_qr_code2"
                :size="80"
                class="text-center"
              />
              {{ data.mon_qr_code2 }}

              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="ups_qr_code" header="UPS QR Code" style="min-width: 12rem">
            <template #body="{ data }">
              <QrcodeVue
                v-if="data.ups_qr_code && data.ups_qr_code.trim() !== ''"
                :value="data.ups_qr_code"
                :size="80"
                class="text-center"
              />
              {{ data.ups_qr_code }}

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
        </DataTable>
      </div>
    </div>
  </DefaultLayout>
</template>
