<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useApi } from '@/composables/useApi'
import { useForm } from '@/composables/useForm'

import api from '../../../laravel-backend/resources/js/axiosInstance.js'
import modal_reserved from './modal/modal_reserved.vue'
import modal_software from './modal/modal_software.vue'
import modal_msoffice from './modal/modal_msoffice.vue'
import modal_review_form from './modal/modal_review_form.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

import Modal_msoffice from './modal/modal_msoffice.vue'

// Page title and modal state
const pageTitle = ref('ICT Equipment')

// Toast, router, route, and store instances
const toast = useToast()
const router = useRouter()
const route = useRoute()
const store = useStore()
const isModalOpen = ref(!route.params.id)

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
  getEmploymentType
} = useApi()

const isButtonDisabled = ref(false)
const errors = ref({})
let selectedNetwork = ref(null)
let selectedGPU = ref(null)
let selectedWireless = ref(null)
const selectedSoftware = ref({})
const isVisible = ref(false)
const openReviewForm = ref(true)
const isMicrosoftOffice = ref(false)
const modalData = ref('')
const role_id = ref(0)
const isDedicatedSelected = computed(() => selectedGPU.value === '2')
const isWirelessSelected = computed(() => selectedNetwork.value === '2')
const image = ref(null)
const uploadSuccess = ref(false)
const uploadError = ref(null)
const userId = !route.query.id ? localStorage.getItem('userId') : route.query.id
const item_id = route.params.id // Access the route parameter 'id'
const api_token = route.query.api_token
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

// Upload image

// Map remarks values to the corresponding options
const remarksMap = {
  perpetual: '1',
  subscription: '2',
  evaluation: '3'
}
//Open modal
const onRadioChange = (key, option) => {
  modalData.value = `${key}: ${option}`
  if (key == 'operating_system') {
    isVisible.value = true // Show the modal
  } else if (key == 'ms_office') {
    isMicrosoftOffice.value = true
    console.log(key)
  }
}

// GENERAL INFORMATION
const saveGeneralInfo = async () => {
  try {
    errors.value = {}
    const extractId = (item) => item?.id || null
    const requestData = {
      ...form,
      registered_loc: role_id.value,
      id: userId
      // employmentType: extractId(form.employmentType),
      // selectedDivisiondd: extractId(form.selectedDivision),
      // selectedAcctDivision: extractId(form.selectedAcctDivision),
      // selectedActualDivision: extractId(form.selectedActualDivision),
      // selectedWorkNature: extractId(form.selectedWorkNature),
      // selectedSection: extractId(form.selectedSection),
      // selectedRangeCategory: extractId(form.selectedRangeCategory),
      // selectedEquipmentType: extractId(form.selectedEquipmentType)
    }

    const response = await api.post('/post_insert_gen_info', requestData)
    // console.log(requestData)
    store.dispatch('saveFormData', form)

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
        params: { id },
        query: { api_token: localStorage.getItem('api_token') }
      })
      location.reload()
      window.location.href =
        '/inventory/create/' + id + '?api_token=' + localStorage.getItem('api_token')
    }, 1000)
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.message
      console.error('Validation errors:', errors.value)
    } else {
      console.error('Error saving form:', error)
    }
  }
}

//SPECS
const saveSpecsInfo = async () => {
  try {
    errors.value = {}
    const extractId = (item) => item?.id || null

    const id = route.params.id
    const requestData = {
      ...specs_form,
      control_id: id,
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
      router.push({
        name: 'InventoryEdit',
        params: { id },
        query: { api_token: localStorage.getItem('api_token') }
      })
    }, 1000)
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.message
      console.error('Validation errors:', errors.value)
    } else {
      console.error('Error saving form:', error)
    }
  }
}

//SOFTWARE INSTALLED
const saveSoftwareInfo = async () => {
  try {
    errors.value = {}

    // Prepare the request data by combining form data with selected software options
    const requestData = {
      selectedSoftware: Object.fromEntries(
        Object.entries(selectedSoftware.value).map(([key, value]) => [
          key,
          remarksMap[value] || null
        ])
      ),
      control_id: route.params.id
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
      router.push({
        name: 'InventoryEdit',
        params: { id },
        query: { api_token: localStorage.getItem('api_token') }
      })
    }, 1000)
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.message
      console.error('Validation errors:', errors.value)
    } else {
      console.error('Error saving form:', error)
    }
  }
}

//PERIPHERALS
const savePeripheralInfo = async () => {
  try {
    errors.value = {}

    const id = route.params.id
    const requestData = {
      ...peripheral_form,
      control_id: id
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
      router.push({
        name: 'InventoryEdit',
        params: { id },
        query: { api_token: localStorage.getItem('api_token') }
      })
    }, 1000)
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.message
      console.error('Validation errors:', errors.value)
    } else {
      console.error('Error saving form:', error)
    }
  }
}
// RETRIEVE DATA USING DATABASE
const retrieveDataviaAPI = async () => {
  const id = route.params.id
  if (id) {
    try {
      const response = await api.get(`/retriveDataviaAPI?id=${id}`)
      Object.assign(form, response.data[0])
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
    } catch (error) {}
  }
}

const retrieveSoftwareData = async () => {
  const id = route.params.id
  if (id) {
    try {
      const response = await api.get(`/retrieveSoftwareData?id=${id}`)

      response.data.forEach((software) => {
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
  const id = route.params.id
  if (id) {
    try {
      const response = await api.get(`/retrievePeripheralsData?id=${id}`)
      Object.assign(peripheral_form, response.data[0])
    } catch (error) {
      console.error('Error retrieving data:', error)
    }
  }
}

const generateQRCode = async (form, tab_form, item_id, userId) => {
  try {
    switch (tab_form) {
      case 'genForm':
        saveGeneralInfo()
        break
      case 'p1Form':
        savePeripheralInfo()
        break
      case 'p2Form':
        savePeripheralInfo()
        break
      case 'upsForm':
        savePeripheralInfo()
        break
      default:
        break
    }

    const res = await api.get(
      '/generateQRCode?id=' + userId + '&item_id=' + item_id + '&tab_form=' + tab_form
    )
    const controlNo = res.data.control_no
    const paddedControlNo = String(controlNo).padStart(4, '0')
    form.qr_code = paddedControlNo
    // setTimeout(() => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data saved successfully!',
        life: 3000
      })

      retrievePeripheralsData()
    // }, 3000)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getControlNo(form, userId)
  getDivision()
  getNatureWork()
  getEquipment()
  getRangeCategory()
  getEmploymentType()
  retrieveData()
  checkUrlAndDisableButton()
  retrieveDataviaAPI(), retrieveSpecsData(), retrieveSoftwareData(), retrievePeripheralsData()
})
</script>
<style>
.upload-form {
  max-width: 400px;
  margin: 2rem auto;
}
.badge-align-left{
  margin-left: 42%;
  margin-top:10px;
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
    <modal_software v-if="isVisible" :isLoading="isVisible" @close="isModalOpen = false" />
    <modal_review_form v-if="openReviewForm" :genForm="form" :open="openReviewForm" @close="openReviewForm = false" />
    
    <Modal_msoffice
      v-if="isMicrosoftOffice"
      :isLoading="isMicrosoftOffice"
      @close="isModalOpen = false"
    />

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
        <Tab v-slot="slotProps" value="2" asChild>
          <div
            :class="['flex items-center gap-2', slotProps.class]"
            @click="slotProps.onClick"
            v-bind="slotProps.a11yAttrs"
          >
            <i class="pi pi-code" />
            <span class="font-bold whitespace-nowrap">Major Software Installed</span>
            <!-- <Badge value="2" /> -->
          </div>
        </Tab>
        <Tab value="3" as="div" class="flex items-center gap-2">
          <i class="pi pi-desktop" />
          <span class="font-bold whitespace-nowrap">Monitor & UPS</span>
        </Tab>
        <Badge value="Draft" size="large" severity="info" class="badge-align-left"></Badge>
      </TabList>

      <TabPanels>
        <!-- General Information -->
        <TabPanel value="0" as="p" class="m-0">
          <form @submit.prevent="saveGeneralInfo">
            <div class="grid md:grid-cols-2 md:gap-6 mb-4 text-right">
              <div class="relative z-0 w-full mb-5 group" v-if="form.qr_code">
                <QrcodeVue :value="form.qr_code" />
              </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText
                    v-model="form.control_no"
                    :value="form.control_no"
                    class="w-full"
                    readonly="true"
                  />
                  <label>Control No</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.status"
                  :options="status_opts"
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Current Status"
                  class="w-full"
                />
              </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.selectedDivision"
                  :options="division_opts"
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Division"
                  class="w-full"
                />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.selectedSection"
                  :options="section_opts"
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Section"
                  class="w-full"
                />
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
                <Select
                  v-model="form.sex"
                  :options="sex_opts"
                  optionValue="value"
                  optionLabel="name"
                  placeholder="Sex"
                  class="w-full"
                />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.selectedAcctDivision"
                  :options="division_opts"
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Division"
                  class="w-full"
                />
              </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText
                    id="year_acquired"
                    @input="checkYear"
                    v-model="form.year_acquired"
                    class="w-full"
                  />
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
            <div class="grid md:grid-cols-4 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="username1" v-model="form.actual_user" class="w-full" />
                  <label for="username1">Actual User</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.selectedWorkNature"
                  :options="work_nature"
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Nature of Works"
                  class="w-full"
                />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.selectedActualDivision"
                  :options="division_opts"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Division"
                  class="w-full"
                />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.employmentType"
                  :options="employment_opts"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Employment Type"
                  class="w-full"
                />
              </div>
            </div>
            <div class="grid md:grid-cols-4 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="qr_code" v-model="form.qr_code" class="w-full pr-16" />
                  <label for="qr_code">QR Code</label>
                </FloatLabel>
                <!-- Button inside the input field -->
                <Button
                  v-if="!form.qr_code"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 px-2 py-2"
                  style="top: -21px; left: 258px"
                  size="small"
                  @click="generateQRCode(form, 'genForm', item_id, userId)"
                >
                  Generate
                </Button>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.selectedEquipmentType"
                  :options="equipment_type"
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Equipment Type"
                  class="w-full"
                />
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="property_no" v-model="form.property_no" class="w-full" />
                  <label for="property_no">Property Number</label>
                </FloatLabel>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.selectedRangeCategory"
                  :options="range_category"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Range Category"
                  class="w-full"
                />
              </div>
            </div>
            <div class="grid md:grid-cols-4 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="brand" v-model="form.brand" class="w-full" />
                  <label for="brand">Brand</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="model" v-model="form.model" class="w-full" />
                  <label for="model">Model</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="aquisition_cost" v-model="form.aquisition_cost" class="w-full" />
                  <label for="aquisition_cost">Aquisition Cost</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="serial_no" v-model="form.serial_no" class="w-full" />
                  <label for="serial_no">Serial Number</label>
                </FloatLabel>
              </div>
            </div>
            <div class="grid md:grid-cols-1 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <Textarea id="remarks" v-model="form.remarks" rows="5" cols="189" />
                  <label for="remarks">Remarks</label>
                </FloatLabel>
              </div>
            </div>
            <Button
              label="Back"
              icon="pi pi-undo"
              class="mr-4"
              severity="primary"
              @click="btnBack()"
            />

            <Button label="Save as Draft" type="submit" icon="pi pi-save" severity="primary" />
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
                <Select
                  v-model="specs_form.specs_hdd_capacity"
                  :options="capacity_opts"
                  optionValue="value"
                  optionLabel="name"
                  placeholder="Capacity"
                  class="w-full"
                />
              </div>
            </div>
            <div class="grid md:grid-cols-4 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="specs_form.specs_ram"
                  :options="ram_opts"
                  optionValue="id"
                  optionLabel="name"
                  placeholder="RAM Type"
                  class="w-full"
                />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="specs_form.specs_ram_capacity"
                  :options="ram_capacity_opts"
                  optionValue="value"
                  optionLabel="name"
                  placeholder="RAM Capacity"
                  class="w-full"
                />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputNumber id="ssd" v-model="specs_form.specs_ssd" class="w-full" />
                  <label for="ssd">Solid State Drive Type</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <Select
                    v-model="specs_form.specs_ssd_capacity"
                    :options="capacity_opts"
                    optionValue="value"
                    optionLabel="name"
                    placeholder="Capacity"
                    class="w-full"
                  />
                </FloatLabel>
              </div>
            </div>
            <Divider />
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="GPU">
                  <div class="card flex flex-wrap gap-6">
                    <div v-for="gpu in gpu_type" :key="gpu.key" class="flex items-center gap-2">
                      <RadioButton
                        v-model="selectedGPU"
                        :inputId="gpu.key"
                        name="dynamdic"
                        :value="gpu.key"
                      />
                      <label :for="gpu.key">{{ gpu.name }}</label>
                    </div>
                    <FloatLabel>
                      <InputText
                        id="gpu_dedic_info"
                        v-model="specs_form.specs_gpu_dedic_info"
                        class="w-full md:w-100"
                        :disabled="!isDedicatedSelected"
                      />
                      <label for="gpu_dedic_info">Dedicated Information</label>
                    </FloatLabel>
                  </div>
                </Fieldset>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="Network">
                  <div class="card flex flex-wrap gap-6 mb-6">
                    <div
                      v-for="category in network_type"
                      :key="category.key"
                      class="flex items-center gap-2"
                    >
                      <RadioButton
                        v-model="selectedNetwork"
                        :inputId="category.key"
                        name="dynamic"
                        :value="category.key"
                      />
                      <label :for="category.key">{{ category.name }}</label>
                    </div>
                    <label>If Wireless:</label>
                    <div class="flex items-center gap-2">
                      <RadioButton
                        v-model="selectedWireless"
                        :disabled="!isWirelessSelected"
                        inputId="networkBuiltIn"
                        name="networkBuiltIn"
                        value="1"
                      />
                      <label for="networkBuiltIn">Built-In</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <RadioButton
                        v-model="selectedWireless"
                        inputId="networkDongle"
                        name="networkDongle"
                        value="2"
                        :disabled="!isWirelessSelected"
                      />
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

            <Button
              label="Back"
              icon="pi pi-undo"
              class="mr-4"
              severity="primary"
              @click="btnBack()"
            />

            <Button label="Save as Draft" type="submit" icon="pi pi-save" severity="primary" />
          </form>
        </TabPanel>

        <!-- Software Install -->
        <TabPanel value="2" as="p" class="m-0">
          <form @submit.prevent="saveSoftwareInfo">
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div
                v-for="(software, index) in software_installed"
                :key="software.key + '-' + index"
                class="relative z-0 w-full mb-5 group"
              >
                <Fieldset :legend="software.title">
                  <div class="card flex flex-wrap gap-9">
                    <div
                      v-for="option in ['perpetual', 'subscription', 'evaluation']"
                      :key="option"
                      class="flex items-center gap-3"
                    >
                      <RadioButton
                        v-model="selectedSoftware[software.key]"
                        :inputId="option.toLowerCase() + '-' + index"
                        :name="software.key"
                        :value="option.toLowerCase()"
                        @change="onRadioChange(software.key, option)"
                      />
                      <label :for="option.toLowerCase() + '-' + index">{{ option }}</label>
                    </div>
                  </div>
                </Fieldset>
              </div>
            </div>

            <Button
              label="Back"
              icon="pi pi-undo"
              class="mr-4"
              severity="primary"
              @click="btnBack()"
            />

            <Button label="Save as Draft" type="submit" icon="pi pi-save" severity="primary" />
          </form>
        </TabPanel>

        <!-- Peripherals -->
        <TabPanel value="3" as="p" class="m-0">
          <form @submit.prevent="savePeripheralInfo">
            <div class="grid md:grid-cols-3 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="Monitor 1">
                  <div class="flex items-center gap-2" v-if="peripheral_form.monitor1QrCode">
                    <QrcodeVue :value="peripheral_form.monitor1QrCode" />
                  </div>
                  <div class="card flex mb-7 mt-7 flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="qr_code"
                          v-model="peripheral_form.monitor1QrCode"
                          class="w-full md:w-100"
                        />
                        <label for="qr_code">QR Code</label>
                      </FloatLabel>
                      <Button
                        v-if="!peripheral_form.monitor1QrCode"
                        style="top: -0.5px; left: -88px"
                        size="small"
                        @click="generateQRCode(peripheral_form, 'p1Form', item_id, userId)"
                      >
                        Generate
                      </Button>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor1BrandModel"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Brand</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor1Model"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Model</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor1SerialNumber"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Serial Number</label>
                      </FloatLabel>
                    </div>
                  </div>
                  <div class="card flex flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor1PropertyNumber"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Property No</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor1AccountPersonInPN"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Accountable Person as seen in PN</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor1ActualUser"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Actual User</label>
                      </FloatLabel>
                    </div>
                    <div class="flex items-center gap-2" v-if="peripheral_form.monitor1QrCode">
                      <Select
                        v-model="peripheral_form.monitor1Status"
                        :options="status_opts"
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Current Status"
                        class="w-full md:w-100"
                      />
                    </div>
                  </div>
                </Fieldset>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="Monitor 2">
                  <div class="flex items-center gap-2" v-if="peripheral_form.monitor2QrCode">
                    <QrcodeVue :value="peripheral_form.monitor2QrCode" />
                  </div>
                  <div class="card flex mb-7 mt-7 flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor2QrCode"
                          class="w-full md:w-80"
                        />
                        <label for="processor">QR Code</label>
                      </FloatLabel>
                      <Button
                        v-if="!peripheral_form.monitor2QrCode"
                        style="top: -0.5px; left: -88px"
                        size="small"
                        @click="generateQRCode(peripheral_form, 'p2Form', item_id, userId)"
                      >
                        Generate
                      </Button>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor2BrandModel"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Brand Model</label>
                      </FloatLabel>
                    </div>
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor2Model"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Model</label>
                      </FloatLabel>
                    </div>
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor2SerialNumber"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Serial Number</label>
                      </FloatLabel>
                    </div>
                  </div>
                  <div class="card flex flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor2PropertyNumber"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Property No</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor2AccountPersonInPN"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Accountable Person as seen in PN</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.monitor2ActualUser"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Actual User</label>
                      </FloatLabel>
                    </div>
                    <div class="flex items-center gap-2" v-if="peripheral_form.monitor2QrCode">
                      <Select
                        v-model="peripheral_form.monitor2Status"
                        :options="status_opts"
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Current Status"
                        class="w-full md:w-100"
                      />
                    </div>
                  </div>
                </Fieldset>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="UPS">
                  <div class="flex items-center gap-2" v-if="peripheral_form.ups_qr_code">
                    <QrcodeVue :value="peripheral_form.ups_qr_code" />
                  </div>
                  <div class="flex items-center gap-2 mt-7 mb-7">
                    <FloatLabel>
                      <InputText
                        id="processor"
                        v-model="peripheral_form.ups_qr_code"
                        class="w-full md:w-80"
                      />
                      <label for="processor">QR Code</label>
                    </FloatLabel>
                    <Button
                      v-if="!peripheral_form.ups_qr_code"
                      style="top: -0.5px; left: -88px"
                      size="small"
                      @click="generateQRCode(peripheral_form, 'upsForm', item_id, userId)"
                    >
                      Generate
                    </Button>
                  </div>
                  <div class="card flex mb-7 mt-3 flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.ups_brand"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Brand</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.ups_model"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Model</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.ups_serial_no"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Serial Number</label>
                      </FloatLabel>
                    </div>
                  </div>
                  <div class="card flex flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.ups_property_no"
                          class="w-full lg:w-100"
                        />
                        <label for="processor">Property Number</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.ups_accountPersonInPN"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Accountable Person as seen in PN:</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="peripheral_form.ups_qr_acctual_user"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Actual User</label>
                      </FloatLabel>
                    </div>
                    <div class="relative z-0 w-full mb-5 group" v-if="peripheral_form.ups_qr_code">
                      <Select
                        v-model="peripheral_form.ups_status"
                        :options="status_opts"
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Current Status"
                        class="w-full md:w-100"
                      />
                    </div>
                  </div>
                </Fieldset>
              </div>
            </div>

            <Button
              label="Back"
              icon="pi pi-undo"
              class="mr-4"
              severity="primary"
              @click="btnBack()"
            />

            <Button label="Submit" type="submit" icon="pi pi-save" severity="primary" />
          </form>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </DefaultLayout>
</template>
