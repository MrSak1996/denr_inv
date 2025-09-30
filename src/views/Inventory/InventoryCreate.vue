<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useApi } from '@/composables/useApi'
import { useForm } from '@/composables/useForm'

import api from '@/api/axiosInstance'
import modal_reserved from './modal/modal_reserved.vue'
import modal_software from './modal/modal_software.vue'
import modal_transfer_item from './modal/modal_transfer_item.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import Modal_msoffice from './modal/modal_msoffice.vue'
import { useInventory } from '@/composables/useInventory'
const { checkItemStatus } = useInventory()

// Page title and modal state
const pageTitle = ref('ICT Equipment')

// Toast, router, route, and store instances
const toast = useToast()
const router = useRouter()
const route = useRoute()
const store = useStore()
const isModalOpen = ref(!route.params.id)
const form_option = ref()
// Forms and API options
const { form, specs_form, software_form, peripheral_form } = useForm()
const {
  sex_opts,
  status_opts,
  division_opts,
  section_opts,
  work_nature,
  equipment_type,
  range_category,
  employment_opts,
  capacity_opts,
  ram_opts,
  ram_capacity_opts,
  getControlNo,
  getDivision,
  getNatureWork,
  getEquipment,
  getRangeCategory,
  getEmploymentType,
  isLoading,
  currentMessage,
  startProgress,
  completeProgress,
  progress
} = useApi()

const sameAsAccountable = ref(false);

const isButtonDisabled = ref(false)
const errors = ref({})
let selectedNetwork = ref<null | string>(null)
let selectedGPU = ref<null | string>(null)
let selectedWireless = ref<null | string>(null)
const selectedSoftware = ref<Record<string, string>>({})
let software = ref([])

const item_status = ref('')
const isVisible = ref(false)
const openReviewForm = ref(false)
const isMicrosoftOffice = ref(false)
const modalData = ref('')
const role_id = ref(0)
const isDedicatedSelected = computed(() => selectedGPU.value === '2')
const isWirelessSelected = computed(() => selectedNetwork.value === '2')
const image = ref(null)
const uploadSuccess = ref(false)
const uploadError = ref(null)
const userId = !route.query.id ? localStorage.getItem('userId') : route.query.id
const item_id = ref(null)
const api_token = route.query.api_token
const openTransferModal = ref(false)
const loading = ref(false)

const user_id = route.params.id ? route.params.id : route.query.id

// Functions
const checkUrlAndDisableButton = () => {
  const url = window.location.href
  const regex = /\/create\/\d+/
  isButtonDisabled.value = regex.test(url)
}

const btnBack = () => {
  router.push({ path: '/inventory' })
}

// Retrieve data from store after saving
const retrieveData = async () => {
  const savedData = store.state.formData
  if (savedData) {
    Object.assign(form, savedData)
  }
}

// Check year and update shelf life
const checkYear = () => {
  const yearValue = form.year_acquired

  if (yearValue === 'N/A' || yearValue === 'n/a') {
    form.shelf_life = 'N/A'
  } else {
    const year = parseInt(yearValue, 10)
    form.shelf_life = !isNaN(year) ? (year <= 2017 ? 'Beyond 5 years' : 'Within 5 years') : ''
  }
}

const network_type = ref([
  { name: 'LAN', key: '1' },
  { name: 'Wireless', key: '2' },
  { name: 'Both', key: '3' }
])

const gpu_type = ref([
  { name: 'Built-in', key: '1' },
  { name: 'Dedicated', key: '2' }
])

const software_installed = ref([
  { title: 'Operating System', key: 'operating_system' },
  { title: 'Microsoft Office', key: 'ms_office' },
  { title: 'ARCGIS', key: 'arcgis' },
  { title: 'Adobe PDF', key: 'adobe_pdf' },
  { title: 'Adobe Photoshop', key: 'adobe_photoshop' },
  { title: 'Autocad', key: 'autocad' }
])

const remarksMap: Record<string, string> = {
  perpetual: '1',
  subscription: '2',
  evaluation: '3'
}
const onRadioChange = (key: string, option: string) => {
  modalData.value = `${key}: ${option}`
  if (key == 'operating_system') {
    isVisible.value = true // Show the modal
  } else if (key == 'ms_office') {
    isMicrosoftOffice.value = true
  }
}
const transferItem = async (form_val: string) => {
  openTransferModal.value = true
  form_option.value = form_val // Corrected assignment
}

// GENERAL INFORMATION
const saveGeneralInfo = async () => {
  try {
    errors.value = {}
    const requestData = {
      ...form,
      registered_loc: role_id.value,
      id: userId
    }

    const response = await api.post('/post_insert_gen_info', requestData)

    setTimeout(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data saved successfully!',
        life: 3000
      })

      const id = response.data.id
      router.push({
        name: 'InventoryEdit',
        params: { id: id },
        query: {
          item_id: route.query.item_id,
          api_token: localStorage.getItem('api_token')
        }
      })



      // location.reload()
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}
//SPECS
const saveSpecsInfo = async () => {
  try {
    errors.value = {}

    // ✅ Extract from route params instead of query
    const controlId = route.params.id || route.query.item_id || null

    const requestData = {
      ...specs_form,
      control_id: controlId,
      specs_net: selectedNetwork.value,
      specs_gpu: selectedGPU.value,
      specs_net_iswireless: selectedWireless.value
    }

    const response = await api.post('/post_insert_specs_info', requestData)

    setTimeout(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data saved successfully!',
        life: 3000
      })

      const id = response.data.id
      // router.push({ name: 'Inventory', params: { id }, query: { api_token: localStorage.getItem('api_token') } })
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

//SOFTWARE INSTALLED
const saveSoftwareInfo = async () => {
  try {
    errors.value = {}
    const controlId = route.params.id || route.query.item_id || null


    // Prepare the request data by combining form data with selected software options
    const requestData = {
      selectedSoftware: Object.fromEntries(
        Object.entries(selectedSoftware.value).map(([key, value]) => [
          key,
          remarksMap[value] || null
        ])
      ),
      control_id: controlId
    }
    // Make the API call
    const response = await api.post('/post_insert_software', requestData)

    // Notify the user and redirect after successful save
    setTimeout(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data saved successfully!',
        life: 3000
      })

      // Redirect to the edit page with the new ID
      const id = response.data.id
      // router.push({
      //   name: 'Inventory',
      //   params: { id },
      //   query: { api_token: localStorage.getItem('api_token') }
      // })
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

//PERIPHERALS
const savePeripheralInfo = async () => {
  try {
    errors.value = {}

    const controlId = route.params.id || route.query.item_id || null

    const requestData = {
      ...peripheral_form,
      monitor1Model: peripheral_form.monitor1Model,
      control_id: controlId,
      id: userId
    }
    const response = await api.post('/post_insert_peripheral', requestData)
    setTimeout(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data saved successfully!',
        life: 3000
      })

      const id = response.data.id
      // router.push({
      //   name: 'Inventory',
      //   params: { id },
      //   query: { item_id: route.query.item_id, api_token: localStorage.getItem('api_token') }
      // })
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}
// RETRIEVE DATA USING DATABASE
const retrieveDataviaAPI = async () => {
  const id = route.params.id
  if (id) {
    try {
      startProgress()
      const response = await api.get(`/retriveDataviaAPI?id=${id}`)
      Object.assign(form, response.data[0])
      loading.value = false
      completeProgress()
    } catch (error) {
      console.error('Error retrieving data:', error)
    }
  }
}

const retrieveSpecsData = async () => {
  const id = route.params.id
  if (id) {
    try {
      const response = await api.get(`/retrieveSpecsData?id=${id}`)
      selectedNetwork.value = String(response.data[0].specs_net)
      selectedGPU.value = String(response.data[0].specs_gpu)
      selectedWireless.value = String(response.data[0].specs_net_iswireless)

      Object.assign(specs_form, response.data[0])
    } catch (error) {
      console.error('Error retrieving data:', error)
    }
  }
}

const retrieveSoftwareData = async () => {
  const id = route.query.item_id;
  if (id) {
    try {
      const response = await api.get(`/retrieveSoftwareData?id=${id}`)
      software.value = response.data

      response.data.forEach((software: { software: string; remarks: string }) => {
        // Reverse the mapping: match the value from 'remarksMap' and find the option
        const selectedOption = Object.keys(remarksMap).find(
          (key) => remarksMap[key] === software.remarks
        )

        if (selectedOption) {
          selectedSoftware.value[software.software] = selectedOption // Update the selectedSoftware object
        }
      })
    } catch (error) {
      console.error('Error retrieving data:', error)
    }
  }
}

const retrievePeripheralsData = async () => {
  const id = route.query.item_id;
  if (id) {
    try {
      const response = await api.get(`/retrievePeripheralsData?id=${id}`)
      Object.assign(peripheral_form, response.data[0])
    } catch (error) {
      console.error('Error retrieving data:', error)
    }
  }
}

const generateQRCode = async (
  form: Record<string, any>,
  tab_form: string,
  item_id: string | null,
  userId: string | null
) => {
  item_id = Array.isArray(route.query?.gen_id)
    ? route.query.gen_id[0]
    : route.query?.gen_id ??
    (Array.isArray(route.query?.item_id) ? route.query.item_id[0] : route.query?.item_id)

  try {
    if (tab_form === 'genForm') {
      await saveGeneralInfo()
      try {
        const res = await api.get(
          `/generateQRCode?id=${userId}&item_id=${item_id}&control_no=${form.control_no}&tab_form=${tab_form}`
        )

        let controlNo = res.data?.control_no || '0'
        form.qr_code = String(controlNo).padStart(4, '0')
      } catch (error) {
        console.error('Error fetching QR Code:', error)
      }
    } else if (tab_form === 'p1Form') {
      if (!item_id) {
        console.error('item_id is undefined or null before API call', item_id)
        return
      }
      await savePeripheralInfo()
      try {
        const res = await api.get(
          `/generateQRCode?id=${userId}&item_id=${item_id}&tab_form=${tab_form}` // Fixed typo
        )

        let controlNo = res.data?.control_no || '0'
        peripheral_form.monitor1QrCode = String(controlNo).padStart(4, '0')
        retrievePeripheralsData()
      } catch (error) {
        console.error('Error fetching QR Code:', error)
      }
    } else if (tab_form === 'p2Form') {
      if (!item_id) {
        console.error('item_id is undefined or null before API call', item_id)
        return
      }
      await savePeripheralInfo()
      try {
        const res = await api.get(
          `/generateQRCode?id=${userId}&item_id=${item_id}&tab_form=${tab_form}` // Fixed typo
        )

        let controlNo = res.data?.control_no || '0'
        peripheral_form.monitor2QrCode = String(controlNo).padStart(4, '0')
        retrievePeripheralsData()
      } catch (error) {
        console.error('Error fetching QR Code:', error)
      }
    } else if (tab_form === 'upsForm') {
      if (!item_id) {
        console.error('item_id is undefined or null before API call', item_id)
        return
      }
      await savePeripheralInfo()
      try {
        const res = await api.get(
          `/generateQRCode?id=${userId}&item_id=${item_id}&tab_form=${tab_form}` // Fixed typo
        )

        let controlNo = res.data?.control_no || '0'
        peripheral_form.ups_qr_code = String(controlNo).padStart(4, '0')
        retrievePeripheralsData()
      } catch (error) {
        console.error('Error fetching QR Code:', error)
      }
    } else {
      throw new Error('Invalid tab_form provided')
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'QR code generated and data saved successfully!',
      life: 3000
    })

    // Retrieve peripherals data if applicable
    retrievePeripheralsData()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate QR code. Please try again.',
      life: 3000
    })
  }
}

const status_checker = async () => {
  try {
    const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    const res = await checkItemStatus(id)
    item_status.value = res
  } catch (error) {
    console.log(error)
  }
}

const closeModal = () => {
  isVisible.value = false
  isMicrosoftOffice.value = false // Close the modal by setting isLoading to false
}

const fetchLatestID = async () => {
  try {
    const response = await api.get(`/fetchLatestID`)
    updateIdInURL(response.data.id)
  } catch (error) {
    console.log(error)
  }
}

const updateIdInURL = (newId: string) => {
  if (route.query.option == 'scan') {
    return null
  } else {
    router.replace({
      query: {
        ...route.query, // Keep existing query params
        gen_id: newId // Change only the 'id' param
      }
    })
  }
}

const formattedCost = computed(() => {
  let num = form.acquisition_cost
  return num
    ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(num))
    : '₱0.00'
})
watch(sameAsAccountable, (newVal) => {
  if (newVal) {
    form.actual_user = form.acct_person;
    form.selectedActualDivision = form.selectedAcctDivision;
  } else {
    form.actual_user = '';
    form.selectedActualDivision = '';
  }
});
onMounted(() => {
  const id = route.params.id
  if (!id) {
    getControlNo(form, userId ? Number(userId) : 0)
    setTimeout(() => {
      // toast.add({
      //   severity: 'success',
      //   summary: 'Success',
      //   detail: 'Control Number saved successfully!',
      //   life: 3000
      // })
      // window.location.href =
      //   '/inventory/create/' + id + '?api_token=' + localStorage.getItem('api_token')
    }, 1000)
  }
  retrieveDataviaAPI(), retrieveSpecsData(), retrieveSoftwareData(), retrievePeripheralsData()
  // fetchLatestID()
  status_checker()
  getDivision()
  getNatureWork()
  getEquipment()
  getRangeCategory()
  getEmploymentType()
  retrieveData()
  checkUrlAndDisableButton()

})
</script>
<style>
.upload-form {
  max-width: 400px;
  margin: 2rem auto;
}

.badge-align-left {
  margin-left: 40%;
  margin-top: 10px;
}
</style>
<template>
  <Toast />

  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- <modal_reserved
      v-if="isModalOpen"
      :controlNo="form.control_no"
      :isLoading="isModalOpen"
      @proceed="saveGeneralInfo"
      @close="isModalOpen = false"
    /> -->
    <modal_software v-if="isVisible" :isLoading="isVisible" @close="closeModal" />
    <modal_transfer_item v-if="openTransferModal" :form="form_option" :openModal="openTransferModal"
      :gen_info_id="route.params.id" :division="division_opts" :status="status_opts" :userID="userId"
      :inventory_id="form.selectedEquipmentType ?? 0" :acct_person="form.acct_person" :actual_user="form.actual_user"
      :monitor1AccountPersonInPN="peripheral_form.monitor1AccountPersonInPN"
      :monitor1ActualUser="peripheral_form.monitor1ActualUser" :monitor1QrCode="peripheral_form.monitor1QrCode"
      :monitor1Model="peripheral_form.monitor1Model" :monitor1BrandModel="peripheral_form.monitor1BrandModel"
      :form_option="form_option" @close="openTransferModal = false" />

    <!-- <modal_review_form v-if="openReviewForm" 
    :genForm="form" 
    :periForm="peripheral_form" 
    :division="division_opts"
    :wnature="work_nature" 
    :emp_type="employment_opts" 
    :equipment="equipment_type" 
    :category="range_category"
    :softwareData="software"
    :open="openReviewForm" 
    @close="openReviewForm = false" /> -->

    <Modal_msoffice v-if="isMicrosoftOffice" :isLoading="isMicrosoftOffice" @close="closeModal" />
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog" tabindex="-1" aria-labelledby="progress-modal">
      <div
        class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl w-full max-w-4xl mx-4 lg:mx-auto transition-transform duration-500 transform">
        <!-- Modal Header -->
        <div class="modal-content flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
          <h3 class="text-lg font-semibold">{{ currentMessage }}</h3>
          <!-- Dynamic Message -->
        </div>
        <!-- Modal Body -->
        <div class="flex flex-col justify-center items-center gap-x-2 py-6 px-4">
          <!-- Progress Bar Container -->
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div class="bg-teal-500 h-4 rounded-full transition-all" :style="{ width: progress + '%' }"></div>
          </div>
          <!-- Progress Percentage -->
          <p class="mt-2 text-gray-700 dark:text-gray-300">{{ progress }}%</p>
        </div>
      </div>
    </div>
    <Tabs value="0">
      <TabList>
        <Tab value="0" as="div" class="flex items-center gap-2">
          <i class="pi pi-info-circle" />
          <span class="font-bold whitespace-nowrap">General Information</span>
        </Tab>
        <Tab value="1" as="div" class="flex items-center gap-2">
          <i class="pi pi-folder" />
          <span class="font-bold whitespace-nowrap">Specification</span>
        </Tab>
        <Tab value="2" as="div" class="flex items-center gap-2">
          <i class="pi pi-code" />
          <span class="font-bold whitespace-nowrap">Major Software Installed</span>
        </Tab>
        <Tab value="3" as="div" class="flex items-center gap-2">
          <i class="pi pi-desktop" />
          <span class="font-bold whitespace-nowrap">Primary & Secondary Monitor</span>
        </Tab>

        <Button style="margin-left: 500px; height: 40px" class="mt-2">
          <router-link :to="`/inventory?id=${user_id}&api_token=${route.query.api_token}`"
            class="p-button p-button-secondary mr-4">
            <i class="pi pi-undo"></i> Back
          </router-link>
        </Button>

        <!-- <Badge :value="item_status" size="large" severity="danger" class="badge-align-left"></Badge> -->
      </TabList>

      <TabPanels>
        <!-- General Information -->
        <TabPanel value="0" as="p" class="m-0">
          <form @submit.prevent="saveGeneralInfo">
            <Fieldset legend="Acountable Person Information">
              <!-- <div class="grid md:grid-cols-2 md:gap-6 mb-4 text-right">
                <div class="relative z-0 w-full mb-5 group" v-if="form.qr_code">
                  <QrcodeVue :value="form.qr_code" />
                </div>
              </div> -->
              <div class="grid md:grid-cols-2 md:gap-6 mb-4">
                <div class="relative z-0 w-full mb-5 group mt-4">
                  <FloatLabel>
                    <InputText v-model="form.control_no" :value="form.control_no" class="w-full" readonly="true" />
                    <label>Control No</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group mt-4">
                  <Select filter v-model="form.status" :options="status_opts" optionValue="id" optionLabel="name"
                    placeholder="Current Status" class="w-full" />
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6 mb-4">
                <div class="relative z-0 w-full mb-5 group">
                  <Select filter v-model="form.selectedDivision" :options="division_opts" optionValue="id"
                    optionLabel="name" placeholder="Division" class="w-full" />
                </div>
              </div>
              <div class="grid md:grid-cols-3 md:gap-6 mb-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText id="username" v-model="form.acct_person" class="w-full" />
                    <label for="username">Accountable Person</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select filter v-model="form.sex" :options="sex_opts" optionValue="value" optionLabel="name"
                    placeholder="Sex" class="w-full" />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select filter v-model="form.selectedAcctDivision" :options="division_opts" optionValue="id"
                    optionLabel="name" placeholder="Division" class="w-full" />
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6 mb-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText id="year_acquired" @input="checkYear" v-model="form.year_acquired" class="w-full" />
                    <label for="year_acquired">Year Acquired</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText id="shelf_life" v-model="form.shelf_life" class="w-full" />
                    <label for="shelf_life">Shelf Life</label>
                  </FloatLabel>
                </div>
              </div>
            </Fieldset>
            <Fieldset legend="Actual User Information">
              <div class="grid md:grid-cols-4 md:gap-6 mb-4">
                <div class="relative z-0 w-full mb-5 group">
                  <div class="flex items-center gap-2">
                    <Checkbox v-model="sameAsAccountable" inputId="sameAsAccountable" />
                    <label for="sameAsAccountable">Same with Accountable Person?</label>
                  </div>

                  <FloatLabel>
                    <InputText id="username1" v-model="form.actual_user" class="w-full mt-8" />
                    <label for="username1" class="mt-8">Actual User</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mt-14 group">
                  <Select filter v-model="form.selectedWorkNature" :options="work_nature" optionValue="id"
                    optionLabel="name" placeholder="Nature of Works" class="w-full" />
                </div>
                <div class="relative z-0 w-full mt-14 group">
                  <Select filter v-model="form.selectedActualDivision" :options="division_opts" optionLabel="name"
                    optionValue="id" placeholder="Division" class="w-full" />
                </div>
                <div class="relative z-0 w-full mt-14 group">
                  <Select filter v-model="form.employmentType" :options="employment_opts" optionLabel="name"
                    optionValue="id" placeholder="Employment Type" class="w-full" />
                </div>
              </div>
            </Fieldset>
            <Fieldset legend="Equipment Information">
              <div class="grid md:grid-cols-4 md:gap-6 mb-4 text-right">
                <div class="relative z-0 w-full mb-5 group" v-if="form.qr_code">
                  <QrcodeVue :value="form.qr_code" />
                </div>
              </div>
              <div class="grid md:grid-cols-4 md:gap-6 mt-7">
                <div class="relative z-0 w-full group">
                  <FloatLabel>
                    <InputText id="qr_code" v-model="form.qr_code" class="w-full pr-16" />
                    <label for="qr_code">QR Code</label>
                  </FloatLabel>

                  <!-- Button inside the input field -->
                  <Button v-if="!form.qr_code" class="absolute top-1/2 right-2 transform -translate-y-1/2 px-2 py-2"
                    style="top: -21px; left: 258px" size="small"
                    @click="generateQRCode(form, 'genForm', Array.isArray(item_id) ? item_id[0] : item_id, Array.isArray(userId) ? userId[0] : userId)">
                    Generate
                  </Button>
                </div>

                <div class="relative z-0 w-full mb-5 group">
                  <Select filter v-model="form.selectedEquipmentType" :options="equipment_type" optionValue="id"
                    optionLabel="name" placeholder="Equipment Type" class="w-full" />
                </div>

                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText id="property_no" v-model="form.property_no" class="w-full" />
                    <label for="property_no">Property Number</label>
                  </FloatLabel>
                </div>

                <div class="relative z-0 w-full mb-5 group">
                  <Select filter v-model="form.selectedRangeCategory" :options="range_category" optionLabel="name"
                    optionValue="id" placeholder="Range Category" class="w-full" />
                </div>
              </div>
              <div class="grid md:grid-cols-4 md:gap-6 mb-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText id="brand" v-model="form.brand" class="w-full mt-4" />
                    <label for="brand" class="mt-4">Brand</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText id="model" v-model="form.model" class="w-full mt-4" />
                    <label for="model" class="mt-4">Model</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputNumber inputId="currency-ph" prefix="₱" id="acquisition_cost" v-model="form.acquisition_cost"
                      class="w-full mt-4" />

                    <label for="aquisition_cost" class="mt-4">Aquisition Cost</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText id="serial_no" v-model="form.serial_no" class="w-full mt-4" />
                    <label for="serial_no" class="mt-4">Serial Number</label>
                  </FloatLabel>
                </div>
              </div>
              <div class="grid md:grid-cols-1 md:gap-6 mb-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <Textarea id="remarks" v-model="form.remarks" rows="5" cols="172" style="resize: none" />
                    <label for="remarks">Remarks</label>
                  </FloatLabel>
                </div>
              </div>
            </Fieldset>

            <Button @click="transferItem('gen_info')" label="Edit/Update" type="button" icon="pi pi-star" class="mr-4"
              severity="primary" />
            <Button label="Save" type="submit" icon="pi pi-save" severity="primary" class="mr-4" />
          </form>
        </TabPanel>

        <!--Specification-->
        <TabPanel value="1" as="p" class="m-0">
          <form @submit.prevent="saveSpecsInfo">
            <div class="grid md:grid-cols-3 md:gap-6 mb-4 mt-4">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="processor" v-model="specs_form.specs_processor" class="w-full" />
                  <label for="processor">Processor</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputNumber id="hdd" v-model="specs_form.specs_hdd" class="w-full" />
                  <label for="hdd">Hard Disk Drive No.</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select filter v-model="specs_form.specs_hdd_capacity" :options="capacity_opts" optionValue="value"
                  optionLabel="name" placeholder="Capacity" class="w-full" />
              </div>
            </div>
            <div class="grid md:grid-cols-4 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <Select filter v-model="specs_form.specs_ram" :options="ram_opts" optionValue="id" optionLabel="name"
                  placeholder="RAM Type" class="w-full" />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select filter v-model="specs_form.specs_ram_capacity" :options="ram_capacity_opts" optionValue="value"
                  optionLabel="name" placeholder="RAM Capacity" class="w-full" />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputNumber id="ssd" v-model="specs_form.specs_ssd" class="w-full" />
                  <label for="ssd">Solid State Drive Type</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <Select filter v-model="specs_form.specs_ssd_capacity" :options="capacity_opts" optionValue="value"
                    optionLabel="name" placeholder="Capacity" class="w-full" />
                </FloatLabel>
              </div>
            </div>
            <Divider />
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="GPU">
                  <div class="card flex flex-wrap gap-6">
                    <div v-for="gpu in gpu_type" :key="gpu.key" class="flex items-center gap-2">
                      <RadioButton v-model="selectedGPU" :inputId="gpu.key" name="dynamdic" :value="gpu.key" />
                      <label :for="gpu.key">{{ gpu.name }}</label>
                    </div>
                    <FloatLabel>
                      <InputText id="gpu_dedic_info" v-model="specs_form.specs_gpu_dedic_info" class="w-full md:w-100"
                        :disabled="!isDedicatedSelected" />
                      <label for="gpu_dedic_info">Dedicated Information</label>
                    </FloatLabel>
                  </div>
                </Fieldset>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="Network">
                  <div class="card flex flex-wrap gap-6 mb-6">
                    <div v-for="category in network_type" :key="category.key" class="flex items-center gap-2">
                      <RadioButton v-model="selectedNetwork" :inputId="category.key" name="dynamic"
                        :value="category.key" />
                      <label :for="category.key">{{ category.name }}</label>
                    </div>
                    <label>If Wireless:</label>
                    <div class="flex items-center gap-2">
                      <RadioButton v-model="selectedWireless" :disabled="!isWirelessSelected" inputId="networkBuiltIn"
                        name="networkBuiltIn" value="1" />
                      <label for="networkBuiltIn">Built-In</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <RadioButton v-model="selectedWireless" inputId="networkDongle" name="networkDongle" value="2"
                        :disabled="!isWirelessSelected" />
                      <label for="networkDongle">With Dongle</label>
                    </div>
                  </div>
                  <!-- <div class="card flex flex-wrap gap-6 mb-6">
                    <div class="flex items-center gap-2">
                      <RadioButton
                        v-model="specs_form.specs_net"
                        inputId="networkLAN"
                        name="networkLAN"
                        value="1"
                      />
                      <label for="networkLAN">LAN</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <RadioButton
                        v-model="specs_net"
                        inputId="networkWireless"
                        name="networkWireless"
                        value="2"
                      />
                      <label for="networkWireless">Wireless</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <RadioButton
                        v-model="specs_form.specs_net"
                        inputId="networkBoth"
                        name="networkBoth"
                      />
                      <label for="networkBoth">Both</label>
                    </div>
                    <label>If Wireless:</label>
                    <div class="flex items-center gap-2">
                      <RadioButton
                        v-model="specs_form.specs_net_iswireless"
                        :disabled="!isWirelessSelected"
                        inputId="networkBuiltIn"
                        name="networkBuiltIn"
                        value="1"
                      />
                      <label for="networkBuiltIn">Built-In</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <RadioButton
                        v-model="specs_form.specs_net_iswireless"
                        inputId="networkDongle"
                        name="networkDongle"
                        value="0"
                        :disabled="!isWirelessSelected"
                      />
                      <label for="networkDongle">With Dongle</label>
                    </div>
                  </div> -->
                </Fieldset>
              </div>
            </div>

            <Button label="Save" type="submit" icon="pi pi-save" severity="primary" />
          </form>
        </TabPanel>

        <!-- Software Install -->
        <TabPanel value="2" as="p" class="m-0">
          <form @submit.prevent="saveSoftwareInfo">
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div v-for="(software, index) in software_installed" :key="software.key + '-' + index"
                class="relative z-0 w-full mb-5 group">
                <Fieldset :legend="software.title">
                  <div class="card flex flex-wrap gap-9">
                    <div v-for="option in ['perpetual', 'subscription', 'evaluation']" :key="option"
                      class="flex items-center gap-3">
                      <RadioButton v-model="selectedSoftware[software.key]"
                        :inputId="option.toLowerCase() + '-' + index" :name="software.key" :value="option.toLowerCase()"
                        @change="onRadioChange(software.key, option)" />
                      <label :for="option.toLowerCase() + '-' + index">{{ option }}</label>
                    </div>
                  </div>
                </Fieldset>
              </div>
            </div>

            <Button label="Save" type="submit" icon="pi pi-save" severity="primary" />
          </form>
        </TabPanel>

        <!-- Peripherals -->
        <TabPanel value="3" as="p" class="m-0">
          <form @submit.prevent="savePeripheralInfo">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- MONITOR 1 -->
              <Fieldset legend="Monitor 1" class="p-5 border rounded-lg shadow-sm">
                <div class="space-y-6">
                  <!-- QR Code Display -->
                  <div class="flex justify-center" v-if="peripheral_form.monitor1QrCode">
                    <QrcodeVue :value="peripheral_form.monitor1QrCode" class="w-32 h-32" />
                  </div>

                  <!-- QR Code Input -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatLabel class="w-full">
                      <InputText id="monitor1QrCode" v-model="peripheral_form.monitor1QrCode" class="w-full" />
                      <label for="monitor1QrCode">QR Code</label>
                    </FloatLabel>

                    <FloatLabel class="w-full">
                      <InputText id="monitor1BrandModel" v-model="peripheral_form.monitor1BrandModel" class="w-full" />
                      <label for="monitor1BrandModel">Brand</label>
                    </FloatLabel>
                  </div>

                  <!-- Model & Serial Number -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatLabel class="w-full">
                      <InputText id="monitor1Model" v-model="peripheral_form.monitor1Model" class="w-full" />
                      <label for="monitor1Model">Model</label>
                    </FloatLabel>

                    <FloatLabel class="w-full">
                      <InputText id="monitor1SerialNumber" v-model="peripheral_form.monitor1SerialNumber"
                        class="w-full" />
                      <label for="monitor1SerialNumber">Serial Number</label>
                    </FloatLabel>
                  </div>

                  <!-- Property Info -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatLabel class="w-full">
                      <InputText id="monitor1PropertyNumber" v-model="peripheral_form.monitor1PropertyNumber"
                        class="w-full" />
                      <label for="monitor1PropertyNumber">Property No</label>
                    </FloatLabel>

                    <FloatLabel class="w-full">
                      <InputText id="monitor1AccountPersonInPN" v-model="peripheral_form.monitor1AccountPersonInPN"
                        class="w-full" />
                      <label for="monitor1AccountPersonInPN">Accountable Person (PN)</label>
                    </FloatLabel>
                  </div>

                  <!-- User Info -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatLabel class="w-full">
                      <InputText id="monitor1ActualUser" v-model="peripheral_form.monitor1ActualUser" class="w-full" />
                      <label for="monitor1ActualUser">Actual User</label>
                    </FloatLabel>

                    <Select filter v-model="peripheral_form.mon1division1" :options="division_opts" optionValue="id"
                      optionLabel="name" placeholder="Division" class="w-full" />
                  </div>

                  <!-- Status -->
                  <div>
                    <Select filter v-model="peripheral_form.monitor1Status" :options="status_opts" optionValue="id"
                      optionLabel="name" placeholder="Current Status" class="w-full" />
                  </div>
                  
                </div>
              </Fieldset>

              <!-- MONITOR 2 -->
              <Fieldset legend="Monitor 2" class="p-5 border rounded-lg shadow-sm">
                <div class="space-y-6">
                  <!-- QR Code Display -->
                  <div class="flex justify-center" v-if="peripheral_form.monitor2QrCode">
                    <QrcodeVue :value="peripheral_form.monitor2QrCode" class="w-32 h-32" />
                  </div>

                  <!-- QR Code Input -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatLabel class="w-full">
                      <InputText id="monitor2QrCode" v-model="peripheral_form.monitor2QrCode" class="w-full" />
                      <label for="monitor2QrCode">QR Code</label>
                    </FloatLabel>

                    <FloatLabel class="w-full">
                      <InputText id="monitor2BrandModel" v-model="peripheral_form.monitor2BrandModel" class="w-full" />
                      <label for="monitor2BrandModel">Brand Model</label>
                    </FloatLabel>
                  </div>

                  <!-- Model & Serial Number -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatLabel class="w-full">
                      <InputText id="monitor2Model" v-model="peripheral_form.monitor2Model" class="w-full" />
                      <label for="monitor2Model">Model</label>
                    </FloatLabel>

                    <FloatLabel class="w-full">
                      <InputText id="monitor2SerialNumber" v-model="peripheral_form.monitor2SerialNumber"
                        class="w-full" />
                      <label for="monitor2SerialNumber">Serial Number</label>
                    </FloatLabel>
                  </div>

                  <!-- Property Info -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatLabel class="w-full">
                      <InputText id="monitor2PropertyNumber" v-model="peripheral_form.monitor2PropertyNumber"
                        class="w-full" />
                      <label for="monitor2PropertyNumber">Property No</label>
                    </FloatLabel>

                    <FloatLabel class="w-full">
                      <InputText id="monitor2AccountPersonInPN" v-model="peripheral_form.monitor2AccountPersonInPN"
                        class="w-full" />
                      <label for="monitor2AccountPersonInPN">Accountable Person (PN)</label>
                    </FloatLabel>
                  </div>

                  <!-- User Info -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatLabel class="w-full">
                      <InputText id="monitor2ActualUser" v-model="peripheral_form.monitor2ActualUser" class="w-full" />
                      <label for="monitor2ActualUser">Actual User</label>
                    </FloatLabel>

                    <Select filter v-model="peripheral_form.mon1division2" :options="division_opts" optionValue="id"
                      optionLabel="name" placeholder="Division" class="w-full" />
                  </div>

                  <!-- Status -->
                  <div>
                    <Select filter v-model="peripheral_form.monitor2Status" :options="status_opts" optionValue="id"
                      optionLabel="name" placeholder="Current Status" class="w-full" />
                  </div>
                </div>
              </Fieldset>
            </div>


            <Button @click="transferItem('peri_form')" label="Edit/Update" type="button" icon="pi pi-star" class="mr-4"
              severity="primary" />

            <Button label="Save" type="submit" icon="pi pi-save" severity="info" class="mr-4" />
            <!-- <Button label="Submit" @click="openReviewForm = true" icon="pi pi-verified" severity="primary" /> -->
          </form>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </DefaultLayout>
</template>
