<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useForm } from '@/composables/useForm'
import { useStore } from 'vuex'
import { useInventory } from '@/composables/useInventory.ts'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'

import router from '@/router'
import form_dash from './form_dash.vue'
import api from '../../../laravel-backend/resources/js/axiosInstance.ts'

// Modal
import modal_qr_scan from './modal/modal_qr_scan.vue'
import modal_review_form from './modal/modal_review_form.vue'
import modal_gen_qr from './modal/modal_gen_qr.vue'
import modal_print_qr from './modal/modal_print_qr.vue'
import modal_export_report from './modal/modal_export_report.vue'

const {
  isLoading,
  currentMessage,
  fetchCurUser,
  division_opts,
  work_nature,
  equipment_type,
  range_category,
  employment_opts,
  startProgress,
  completeProgress,
  progress
} = useApi()

const { form, specs_form, peripheral_form } = useForm()

const { printRecord } = useInventory()
const store = useStore()
const authStore = useAuthStore()

const route = useRoute()
const customers = ref([])
const software = ref([])
const qr_code = ref()
const total_item = ref(0)
const serviceable_count = ref(0)
const unserviceable_count = ref(0)
const outdated_count = ref(0)
const invalid_data_count = ref(0)
const filters = ref()
const loading = ref(false)
const openScanForm = ref(false)

const isUploading = ref(false)
const image = ref(null)
const isModalOpen = ref(false)
const openQR = ref(false)
const openReport = ref(false)
const selectQR = ref(false)
const openReviewForm = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref()
const statuses = ref(['Serviceable', 'Unserviceable', 'Returned'])
const office = ref([
  'PENRO CAVITE',
  'PENRO LAGUNA',
  'PENRO BATANGAS',
  'PENRO RIZAL',
  'PENRO QUEZON',
  'CENRO Sta. Cruz',
  'CENRO Lipa City',
  'CENRO Calaca',
  'CENRO Calauag',
  'CENRO Catanauan',
  'CENRO Tayabas',
  'CENRO Real',
  'Regional Office'
])
const userId = route.query.id
const item = ref(null)
const user_role = ref(0)
const designation = ref('')
const api_token = authStore.api_token

const loadUserData = async () => {
  const userData = await fetchCurUser()
  user_role.value = userData.data[0].role_id
  designation.value = userData.data[0].roles
}

const fetchData = async () => {
  try {
    startProgress() // Start the progress bar

    await loadUserData()

    const response = await api.get(
      `/vw-gen-info?api_tokes=${api_token}&designation=${authStore.role_id}`
    )
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
  await loadUserData()

  try {
    const response = await api.get(
      `/getCountStatus?api_token=${api_token}&designation=${user_role.value}`
    )

    // Ensure response.data is an array and has at least one item
    if (Array.isArray(response.data) && response.data.length > 0) {
      serviceable_count.value = Number(response.data[0].serviceable || 0)
      unserviceable_count.value = Number(response.data[0].unserviceable || 0)
    } else {
      console.warn('No data returned from API. Setting default values.')
      serviceable_count.value = 0
      unserviceable_count.value = 0
    }
  } catch (error) {
    console.error('Error fetching count status:', error)
    serviceable_count.value = 0
    unserviceable_count.value = 0
  }
}

const getOutdatedEquipment = async () => {
  await loadUserData()

  try {
    const response = await api.get(
      `/getOutdatedEquipment?api_token=${api_token}&designation=${user_role.value}`
    )

    console.log('API Response:', response.data) // Debugging step

    // Ensure response.data is an array and has at least one item
    if (Array.isArray(response.data) && response.data.length > 0) {
      outdated_count.value = Number(response.data[0].count || 0)
    } else {
      console.warn('No outdated equipment data returned. Setting default value.')
      outdated_count.value = 0
    }
  } catch (error) {
    console.error('Error fetching outdated equipment:', error)
    outdated_count.value = 0
  }
}

const getInvalidData = async () => {
  try {
    const response = await api.get(
      `/vw-invalid-data?api_token=${api_token}&designation=${authStore.role_id}`
    )

    // Check if response.data exists and has at least one item
    invalid_data_count.value = Number(response.data.count)
  } catch (error) {
    invalid_data_count.value = 0
  }
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
    roles: {
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
  router.push({
    name: 'InventoryCreate',
    query: {
      id: userId,
      item_id: null,
      api_token: api_token,
      create_new: 'true' // Convert the boolean to a string
    }
  })
}

const getSeverity = (status: string) => {
  switch (status) {
    case 'Serviceable':
      return 'success'

    case 'Unserviceable':
      return 'danger'

    case 'Returned':
      return 'danger'
  }
}

const viewRecord = (id: string) => {
  router.push({
    path: `/inventory/create/${id}`,
    query: { api_token: localStorage.getItem('api_token'), item_id: id }
  })
}

const handlePrint = (id) => {
  printRecord(id) // Example ID
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

const resetForm = () => {
  image.value = null
  progress.value = 0
  isUploading.value = false
  uploadSuccess.value = false
  uploadError.value = ''
}

const updateFilterWithQrValue = (qrValue) => {
  filters.value['global'].value = qrValue
}

const remarksMap = {
  perpetual: '1',
  subscription: '2',
  evaluation: '3'
}

const retrieveDataviaAPI = async (id) => {
  const item_id = id
  item.value = item_id
  if (item_id) {
    try {
      const response = await api.get(`/retriveDataviaAPI?id=${id}`)
      Object.assign(form, response.data[0])

      const res = await api.get(`/retrieveSoftwareData?id=${id}`)
      software.value = res.data
      response.data.forEach((software) => {
        const selectedOption = Object.keys(remarksMap).find(
          (key) => remarksMap[key] === software.remarks
        )
      })

      const specs_res = await api.get(`/retrieveSpecsData?id=${id}`)
      Object.assign(specs_form, specs_res.data[0])

      const peri_res = await api.get(`/retrievePeripheralsData?id=${id}`)
      Object.assign(peripheral_form, peri_res.data[0])
    } catch (error) {
      console.error('Error retrieving data:', error)
    }
    openReviewForm.value = true
  }
}

const handleKeydown = (event) => {
  if (event.key === 'F2') {
    openScanForm.value = true
    event.preventDefault() // Prevent default browser action (if needed)
  } else if (event.key === 'F3') {
    openQR.value = true
  }
}

const disableRightClick = (event) => {
  event.preventDefault()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('contextmenu', disableRightClick)
  loadUserData()
  fetchData()
  getCountStatus()
  getOutdatedEquipment()
  getInvalidData()
})

const pageTitle = ref('Inventory Management')
</script>

<style scoped>
.p-dialog-mask {
  background: rgba(0, 0, 0, 0.7);
}

.wrap-text {
  white-space: normal;
  word-wrap: break-word;
}
</style>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5 mb-4">
      <DataStatsOne
        :total_equipment="total_item"
        :total_serviceable_count="serviceable_count"
        :total_unserviceable_count="unserviceable_count"
        :outdated_equipment="outdated_count"
        :invalid_data="invalid_data_count"
      />
    </div>

    <!-- <form_dash
      :role_id="user_role"
      :office="designation"
      :total_equipment="total_item"
      :total_serviceable_count="serviceable_count"
      :total_unserviceable_count="unserviceable_count"
      :outdated_equipment="outdated_count"
      :invalid_data="invalid_data_count"
    /> -->
    <modal_qr_scan v-if="openScanForm" :isLoading="openScanForm" @close="openScanForm = false" />
    <modal_review_form
      v-if="openReviewForm"
      :genForm="form"
      :periForm="peripheral_form"
      :division="division_opts"
      :wnature="work_nature"
      :emp_type="employment_opts"
      :equipment="equipment_type"
      :category="range_category"
      :softwareData="software"
      :specsData="specs_form"
      :open="openReviewForm"
      :item_id="item"
      @close="openReviewForm = false"
    />
    <modal_export_report v-if="openReport" :open="openReport" @close="openReport = false" />
    <modal_gen_qr v-if="openQR" :open="openQR" @close="openQR = false"></modal_gen_qr>

    <modal_print_qr v-if="selectQR" :open="selectQR" @close="selectQR = false"></modal_print_qr>

    <div class="flex flex-col gap-10 mt-4">
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
                  class="mt-4 px-4 py-2 bg-teal-900 text-white rounded-md hover:bg-teal-900 w-full"
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
          :rows="5"
          dataKey="id"
          filterDisplay="menu"
          :loading="loading"
          :globalFilterFields="[
            'control_no',
            'roles',
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
              <Button type="button" icon="pi pi-add" label="Add" outlined @click="addMore()" />
              <Button
                type="button"
                icon="pi pi-file-export"
                label="Export"
                outlined
                @click="openReport = true"
              />
              <Button
                type="button"
                icon="pi pi-refresh"
                label="Refresh"
                outlined
                @click="fetchData()"
              />
              <Button
                type="button"
                icon="pi pi-qrcode"
                label="Scan QR [F2]"
                @click="openScanForm = true"
                outlined
              />

              <Button
                severity="danger"
                icon="pi pi-qrcode"
                label="Generate QR Code [F3]"
                @click="openQR = true"
              />
              <Button
                style="left: 350px"
                severity="info"
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
          <Column field="id" header="Action" style="width: 1rem">
            <template #body="{ data }">
              <div class="card flex justify-center">
                <Button
                  @click="retrieveDataviaAPI(data.id)"
                  icon="pi pi-eye"
                  size="small"
                  class="text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                />
                <Button
                  @click="viewRecord(data.id)"
                  icon="pi pi-file-edit"
                  size="small"
                  class="text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                />
                <Button
                  @click="handlePrint(data.id)"
                  icon="pi pi-print"
                  size="small"
                  class="text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                />
                <Button
                data.mon_qr_code1
                data.mon_qr_code2
                data.ups_qr_code
                @click="openModal(data.qr_code || data.mon_qr_code1 || data.mon_qr_code2 || data.ups_qr_code)"
                icon="pi pi-cloud-upload"
                  size="small"
                  class="text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                />
              </div>
            </template>
            <!-- <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template> -->
          </Column>
          <Column field="control_no" header="Control No" style="min-width: 12rem">
            <template #body="{ data }">
              <Tag :value="data.equipment_title" severity="success" class="text-center" /><br />
              {{ data.control_no }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="roles" header="Registered Location" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.roles }}<br />{{ data.actual_division_title }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <Select
                v-model="filterModel.value"
                :options="office"
                placeholder="Select One"
                showClear
              >
                <template #option="slotProps">
                  <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                </template>
              </Select>
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

          <Column field="mon_qr_code1" header="Primary Monitor QR Code" style="min-width: 12rem">
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
          <Column field="mon_qr_code2" header="Secondary Monitor QR Code" style="min-width: 12rem">
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
        </DataTable>
      </div>
    </div>
  </DefaultLayout>
</template>
