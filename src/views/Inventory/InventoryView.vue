<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useForm } from '@/composables/useForm'
import { useInventory } from '@/composables/useInventory'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'

import router from '@/router'
import api from '@/api/axiosInstance'

// Modal
import modal_qr_scan from './modal/modal_qr_scan.vue'
import modal_review_form from './modal/modal_review_form.vue'
import modal_gen_qr from './modal/modal_gen_qr.vue'
import modal_print_qr from './modal/modal_print_qr.vue'
import modal_export_report from './modal/modal_export_report.vue'
import modal_attachments from './modal/modal_attachments.vue'

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
  progress,
  getDivision
} = useApi()

const { form, specs_form, peripheral_form } = useForm()

const { printRecord } = useInventory()
const authStore = useAuthStore()

const route = useRoute()
const customers = ref([])
const software = ref([])
const qr_code = ref()
const total_item = ref(0)
const serviceable_count = ref(0)
const unserviceable_count = ref(0)
const return_count = ref(0)
const outdated_count = ref(0)
const invalid_data_count = ref(0)
const filters = ref()
const loading = ref(false)
const openScanForm = ref(false)
const imageUrl = ref('')
const item_id = ref()

const isUploading = ref(false)
const image = ref<null | File>(null)
const isModalOpen = ref(false)
const openQR = ref(false)
const openAttachments = ref(false)
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
const item = ref(0)
const user_role = ref(0)
const api_token = authStore.api_token
const role_id = authStore.role_id
const role_office = ref('')

const loadUserData = async () => {
  const userData = await fetchCurUser()
  user_role.value = role_id

  // getting the user's office
  const roleMapping: Record<string, string> = {
    '1': 'PENRO CAVITE',
    '2': 'PENRO LAGUNA',
    '3': 'PENRO BATANGAS',
    '4': 'PENRO RIZAL',
    '5': 'PENRO QUEZON',
    '6': 'CENRO Sta. Cruz',
    '7': 'CENRO Lipa City',
    '8': 'CENRO Calaca',
    '9': 'CENRO Calauag',
    '10': 'CENRO Catanauan',
    '11': 'CENRO Tayabas',
    '12': 'CENRO Real',
    '13': 'Regional Office'
  }

  const roleId = role_id // use the **fetched role_id**
  role_office.value = roleMapping[String(roleId)] || 'Unknown Office'
}

const fetchData = async (selectedRoleId: number) => {
  try {
    startProgress() // Start the progress bar

    // await loadUserData()

    const response = await api.get(
      `/vw-gen-info?api_tokes=${api_token}&designation=${authStore.role_id}&office=${selectedRoleId}`
    )
    total_item.value = Number(response.data.count) // Set the count if it exists
    customers.value = response.data.data // Process the fetched data
    loading.value = false
    if (selectedRoleId == 0) {
      completeProgress() // Stop the progress bar
      getCountStatus(0)
      getOutdatedEquipment(0)
      getInvalidData(0)
    }
  } catch (error) {
    console.error('Error fetching customers:', error)
    loading.value = false
    completeProgress() // Stop the progress bar even in case of error
  }
}

const filterByOffice = async (selectedRoleId: number) => {
  try {
    startProgress()
    fetchData(selectedRoleId)
    getCountStatus(selectedRoleId)
    getOutdatedEquipment(selectedRoleId)
    getInvalidData(selectedRoleId)

    const api_token = authStore.api_token

    const response = await api.get(
      `/vw-gen-info?api_tokes=${api_token}&designation=${authStore.role_id}&office=${selectedRoleId}`
    )

    loading.value = false
    customers.value = response.data.data
    completeProgress()
  } catch (error) {
    console.error('Error fetching customers:', error)
    loading.value = false
    completeProgress()
  }
}

const getCountStatus = async (selectedRoleId: number | null) => {
  try {
    await loadUserData()

    // ✅ Corrected: If selectedRoleId is empty, use `/getCountStatus`
    // Otherwise, use `/getCountStatusPerDivision`
    const baseUrl = `/getCountStatus${selectedRoleId ? 'PerDivision' : ''}`

    const url = `${baseUrl}?api_token=${api_token}&designation=${role_id}&office=${
      selectedRoleId ?? 0
    }`

    const response = await api.get(url)
    const data = response.data

    // ✅ Safely handle response
    if (Array.isArray(data) && data.length > 0) {
      serviceable_count.value = Number(data[0]?.serviceable ?? 0)
      unserviceable_count.value = Number(data[0]?.unserviceable ?? 0)
      return_count.value = Number(data[0]?.returned ?? 0)
    } else {
      console.warn('No data returned from API. Setting default values.')
      serviceable_count.value = 0
      unserviceable_count.value = 0
      return_count.value = 0
    }
  } catch (error) {
    serviceable_count.value = 0
    unserviceable_count.value = 0
    return_count.value = 0
  }
}

const getOutdatedEquipment = async (selectedRoleId: number) => {
  try {
    // Load user data before API call
    await loadUserData()
    const baseUrl = `/getOutdatedEquipment${selectedRoleId ? 'PerDivision' : ''}`
    const url = `${baseUrl}?api_token=${api_token}&designation=${role_id}&office=${
      selectedRoleId ?? 0
    }`

    const response = await api.get(url)

    const data = response.data

    // ✅ Safely handle and validate response
    outdated_count.value = Array.isArray(data) && data.length > 0 ? Number(data[0]?.count ?? 0) : 0

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No outdated equipment data returned. Setting default value.')
    }
  } catch (error) {
    console.error('Error fetching outdated equipment:', error)
    outdated_count.value = 0 // ✅ Default to 0 in case of error
  }
}

const getInvalidData = async (selectedRoleId: number) => {
  try {
    const baseUrl = `/vw-invalid-data${selectedRoleId ? 'PerDivision' : ''}`
    const url = `${baseUrl}?api_token=${api_token}&designation=${role_id}&office=${
      selectedRoleId ?? 0
    }`
    const response = await api.get(url)
    const data = response.data
    invalid_data_count.value = Number(response.data.count ?? 0)

    // const response = await api.get(
    //   `/vw-invalid-data?api_token=${api_token}&designation=${authStore.role_id}`
    // )

    // Check if response.data exists and has at least one item
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
    serial_no: {
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

const handlePrint = (id: number) => {
  try {
    const url = `http://10.201.12.189:8000/api/generatePDFReport?id=${id}`
    window.open(url, '_blank') // opens PDF in new tab
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
const openModal = (id: string) => {
  isModalOpen.value = true
  qr_code.value = id
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target?.files) {
    image.value = target.files[0]
  }
}

const triggerFileInput = () => {
  const fileInput = document.querySelector("input[type='file']") as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

const uploadImage = async () => {
  if (!image.value) return

  const formData = new FormData()
  formData.append('image', image.value)
  formData.append('destination_folder', role_office.value)
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
      imageUrl.value = response.data.image_url
    }
  } catch (error) {
    uploadSuccess.value = false
    uploadError.value = 'An error occurred'
  }
}

const openFile = async (id: string) => {
  try {
    item_id.value = id
    openAttachments.value = true
  } catch (error) {
    console.log(error)
  }
}

const resetForm = () => {
  image.value = null
  progress.value = 0
  isUploading.value = false
  uploadSuccess.value = false
  uploadError.value = ''
}

const updateFilterWithQrValue = (qrValue: string) => {
  filters.value['global'].value = qrValue
}

const remarksMap = {
  perpetual: '1',
  subscription: '2',
  evaluation: '3'
}

const retrieveDataviaAPI = async (id: number) => {
  const item_id = id
  item.value = item_id
  if (item_id) {
    try {
      const response = await api.get(`/retriveDataviaAPI?id=${id}`)
      Object.assign(form, response.data[0])

      const res = await api.get(`/retrieveSoftwareData?id=${id}`)
      software.value = res.data
      response.data.forEach((software: { remarks: string }) => {
        const selectedOption = Object.keys(remarksMap).find(
          (key) => remarksMap[key as keyof typeof remarksMap] === software.remarks
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

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'F2') {
    openScanForm.value = true
    event.preventDefault() // Prevent default browser action (if needed)
  } else if (event.key === 'F3') {
    openQR.value = true
  }
}

const disableRightClick = (event: MouseEvent) => {
  event.preventDefault()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('contextmenu', disableRightClick)
  loadUserData()
  fetchData(0)
  getCountStatus(0)
  getOutdatedEquipment(0)
  getInvalidData(0)
  getDivision()
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
        :total_returned_count="invalid_data_count"
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
    <!-- <modal_qr_scan v-if="openScanForm" :isLoading="openScanForm" @close="openScanForm = false" /> -->
    <modal_review_form
      v-if="openReviewForm"
      :genForm="form"
      :periForm="peripheral_form"
      :division="division_opts"
      :wnature="work_nature"
      :emp_type="employment_opts"
      :category="range_category"
      :softwareData="software"
      :specsData="specs_form"
      :equipment="equipment_type"
      :open="openReviewForm"
      :item_id="item"
      @close="openReviewForm = false"
    />
    <modal_export_report v-if="openReport" :open="openReport" @close="openReport = false" />
    <modal_gen_qr v-if="openQR" :open="openQR" @close="openQR = false"></modal_gen_qr>
    <modal_attachments
      v-if="openAttachments"
      :open="openAttachments"
      :id="item_id"
      @close="openAttachments = false"
    >
    </modal_attachments>

    <modal_print_qr v-if="selectQR" :open="selectQR" @close="selectQR = false"></modal_print_qr>
    <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" />

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
              <div
                class="p-4 text-sm text-red-800 rounded-lg mb-4 bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span class="font-medium">Uploading MOV'S:</span>
                To ensure proper tracking and organization, upload clear images of ICT equipment
                with visible serial numbers and asset tags. Use JPEG, PNG, or JPG formats with a max
                size of <strong>5MB per image.</strong>
                Double-check entries before clicking "Upload", then verify uploads in the system.
              </div>
              <!-- Upload Form -->
              <form @submit.prevent="uploadImage">
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
            'file_id',
            'roles',
            'acct_person',
            'equipment_title',
            'acct_person',
            'qr_code',
            'serial_no',
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
                style="background-color: brown"
              />
              <Button
                type="button"
                icon="pi pi-refresh"
                label="Refresh"
                outlined
                @click="fetchData(0)"
              />
              <Button
                severity="danger"
                icon="pi pi-qrcode"
                label="Generate QR Code [F3]"
                @click="openQR = true"
              />
              <Select
                filter
                v-model="peripheral_form.mon1division2"
                :options="division_opts"
                optionValue="id"
                optionLabel="name"
                placeholder="Division"
                class="md:w-50 pull-right"
                @update:modelValue="filterByOffice"
              />
              <Button
                style="left: 300px"
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

          <Column field="id" header="Action" style="width: 500px !important">
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

                <!-- Only show if file_id does not exist -->
                <Button
                  v-if="!data.file_id"
                  @click="openModal(data.id)"
                  icon="pi pi-cloud-upload"
                  size="small"
                  class="text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                />

                <!-- <Button @click="handlePrint(data.id)" icon="pi pi-print" size="small"
                class="text-white mr-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" /> -->
              </div>
            </template>
          </Column>
          <Column field="control_no" header="Equipment Type" style="min-width: 12rem">
            <template #body="{ data }">
              <Tag :value="data.equipment_title" severity="success" class="text-center" /><br />
              {{ data.control_no }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="attachments" header="Attachments" style="min-width: 12rem">
            <template #body="{ data }">
              <div v-if="data.file_id">
                <Button
                  @click="openFile(data.id)"
                  rel="noopener noreferrer"
                  style="background-color: #d84315 !important; border-color: #d84315 !important"
                  class="text-white mr-2 border hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  :href="'https://drive.google.com/file/d/' + data.file_id + '/view?usp=drive_link'"
                >
                  <i class="pi pi-external-link mr-2"></i>
                  Open File
                </Button>
              </div>
              <span v-else> No attachment </span>
            </template>
          </Column>
          <Column field="qr_code" header="ICT Equipment QR Code" style="min-width: 12rem; text-align: center;">
            <template #body="{ data }">
              <div class="flex justify-center items-center h-24">
                <QrcodeVue
                  v-if="data.qr_code && data.qr_code.trim() !== ''"
                  :value="data.qr_code"
                  :size="50"
                />
              </div>

              {{ data.qr_code }}

              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>

          <Column
            field="mon_qr_code1"
            header="Primary Monitor QR Code"
            style="min-width: 12rem; text-align: center"
          >
            <template #body="{ data }">
              <div class="flex justify-center items-center h-24">
                <QrcodeVue
                  v-if="data.mon_qr_code1 && data.mon_qr_code1.trim() !== ''"
                  :value="data.mon_qr_code1"
                  :size="50"
                />
              </div>

              {{ data.mon_qr_code1 }}

              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column
            field="mon_qr_code2"
            header="Secondary Monitor QR Code"
            style="min-width: 12rem; text-align: center !important"
          >
            <template #body="{ data }">
              <div class="flex justify-center items-center h-24">
                <QrcodeVue
                  v-if="data.mon_qr_code2 && data.mon_qr_code2.trim() !== ''"
                  :value="data.mon_qr_code2"
                  :size="50"
                />
              </div>

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
                :size="50"
                class="text-center"
              />
              {{ data.ups_qr_code }}

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
          <Column field="brand" header="Brand & Model" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.brand }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="serial_no" header="Serial No." style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.serial_no }}
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
