<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useApi } from '@/composables/useApi'
import { useForm } from '@/composables/useForm'

import Toast from 'primevue/toast'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import FloatLabel from 'primevue/floatlabel'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import Badge from 'primevue/badge'
import Divider from 'primevue/divider'
import Fieldset from 'primevue/fieldset'
import InputText from 'primevue/inputtext'
import api from '../../../laravel-backend/resources/js/axiosInstance.js'

const pageTitle = ref('ICT Equipment')

const toast = useToast()
const router = useRouter()
const store = useStore()
const route = useRoute()

const { form, specs_form } = useForm()
const {
  division_opts,
  section_opts,
  work_nature,
  equipment_type,
  range_category,
  employment_opts,
  getControlNo,
  getDivision,
  getNatureWork,
  getEquipment,
  getRangeCategory,
  getEmploymentType
} = useApi()

// Additional setup
const isButtonDisabled = ref(false)
const errors = ref({})

// DISABLE BUTTON AFTER SAVING
const checkUrlAndDisableButton = () => {
  const url = window.location.href
  const regex = /\/create\/\d+/
  isButtonDisabled.value = regex.test(url)
}

// RETRIEVE DATA USING STORE AFTER SAVING
const retrieveData = async () => {
  const savedData = store.state.formData
  if (savedData) {
    Object.assign(form, savedData)
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

// GENERAL INFORMATION
const saveGeneralInfo = async () => {
  try {
    errors.value = {}
    const extractId = (item) => item?.id || null
    const requestData = {
      ...form,
      employmentType: extractId(form.employmentType),
      selectedDivision: extractId(form.selectedDivision),
      selectedAcctDivision: extractId(form.selectedAcctDivision),
      selectedActualDivision: extractId(form.selectedActualDivision),
      selectedWorkNature: extractId(form.selectedWorkNature),
      selectedSection: extractId(form.selectedSection),
      selectedRangeCategory: extractId(form.selectedRangeCategory),
      selectedEquipmentType: extractId(form.selectedEquipmentType)
    }

    const response = await api.post('/post_insert_gen_info', requestData)

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


onMounted(() => {
  getControlNo(form)
  getDivision()
  getNatureWork()
  getEquipment()
  getRangeCategory()
  getEmploymentType()
  retrieveData()
  checkUrlAndDisableButton()
  retrieveDataviaAPI()
})
</script>

<template>
  <Toast />

  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

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
            <Badge value="2" />
          </div>
        </Tab>
        <Tab value="3" as="div" class="flex items-center gap-2">
          <i class="pi pi-desktop" />
          <span class="font-bold whitespace-nowrap">Monitor</span>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0" as="p" class="m-0">
          <form @submit.prevent="saveGeneralInfo">
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
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="username" v-model="form.acct_person" class="w-full" />
                  <label for="username">Accountable Person</label>
                </FloatLabel>
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
                  <InputText id="qr_code" v-model="form.qr_code" class="w-full" />
                  <label for="qr_code">QR Code</label>
                </FloatLabel>
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
            <button
              type="submit"
              :disabled="isButtonDisabled"
              :class="{
                'text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800':
                  !isButtonDisabled,
                'text-white bg-gray-400 hover:bg-gray-800 focus:ring-4 focus:outline-none dark:bg-gray-600 dark:hover:bg-gray-700 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center':
                  isButtonDisabled
              }"
            >
              Save as Draft
            </button>
          </form>
        </TabPanel>

        <TabPanel value="1" as="p" class="m-0">
          <form>
            <div class="grid md:grid-cols-3 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="processor" v-model="specs_form.specs_processor" class="w-full" />
                  <label for="processor">Processor</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="hdd" v-model="specs_form.specs_hdd" class="w-full" />
                  <label for="hdd">Hard Disk Drive No.</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="capacity" v-model="specs_form.specs_hdd_capacity" class="w-full" />
                  <label for="capacity">Capacity</label>
                </FloatLabel>
              </div>
            </div>
            <div class="grid md:grid-cols-4 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="ram" v-model="specs_form.specs_ram" class="w-full" />
                  <label for="ram">RAM Type</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="gpu" v-model="specs_form.specs_gpu" class="w-full" />
                  <label for="gpu">GPU</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="ssd" v-model="specs_form.specs_ssd" class="w-full" />
                  <label for="ssd">Solid State Drive Type</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText
                    id="ssd_capacity"
                    v-model="specs_form.specs_ssd_capacity"
                    class="w-full"
                  />
                  <label for="ssd_capacity">Capacity</label>
                </FloatLabel>
              </div>
            </div>
            <Divider />
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="GPU">
                  <div class="card flex flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="gpuBuiltIn"
                        v-model="specs_form.specs_gpu_isbuilt_in"
                        value="Built-In"
                      />
                      <label for="gpuBuiltIn">Built-In</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="gpuDedicated"
                        v-model="specs_form.specs_gpu_isdedicated"
                        value="Dedicated"
                      />
                      <label for="gpuDedicated">Dedicated</label>
                    </div>
                    <FloatLabel>
                      <InputText
                        id="gpu_dedic_info"
                        v-model="specs_form.specs_gpu_dedic_info"
                        class="w-full md:w-100"
                      />
                      <label for="gpu_dedic_info">Dedicated Information</label>
                    </FloatLabel>
                  </div>
                </Fieldset>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="Network">
                  <div class="card flex flex-wrap gap-6 mb-6">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="networkLAN"
                        v-model="specs_form.specs_net_lan"
                        value="LAN"
                      />
                      <label for="networkLAN">LAN</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="networkWireless"
                        v-model="specs_form.specs_net_wireless"
                        value="Wireless"
                      />
                      <label for="networkWireless">Wireless</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="networkBoth"
                        v-model="specs_form.specs_net_both"
                        value="Both"
                      />
                      <label for="networkBoth">Both</label>
                    </div>
                    <label>If Wireless:</label>
                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="networkBuiltIn"
                        v-model="specs_form.specs_net_isbuilt_in"
                        value="Built-In"
                      />
                      <label for="networkBuiltIn">Built-In</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="networkDongle"
                        v-model="specs_form.specs_net_with_dongle"
                        value="With Dongle"
                      />
                      <label for="networkDongle">With Dongle</label>
                    </div>
                  </div>
                </Fieldset>
              </div>
            </div>

            <button
              type="submit"
              class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save as Draft
            </button>
          </form>
        </TabPanel>

        <TabPanel value="2" as="p" class="m-0">
          <form>
            <div class="grid md:grid-cols-4 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <div
                  class="flex items-center mb-2 ps-4 p-3.5 border border-gray-200 rounded dark:border-gray-700"
                >
                  <label for="operating_system">Operating System</label>
                </div>
                <div
                  class="flex items-center mb-2 ps-4 p-3.5 border border-gray-200 rounded dark:border-gray-700"
                >
                  <label for="operating_system">Microsoft Office</label>
                </div>
                <div
                  class="flex items-center mb-2 ps-4 p-3.5 border border-gray-200 rounded dark:border-gray-700"
                >
                  <label for="operating_system">ARCGIS</label>
                </div>
                <div
                  class="flex items-center mb-2 ps-4 p-3.5 border border-gray-200 rounded dark:border-gray-700"
                >
                  <label for="operating_system">Adobe PDF</label>
                </div>
                <div
                  class="flex items-center mb-2 ps-4 p-3.5 border border-gray-200 rounded dark:border-gray-700"
                >
                  <label for="operating_system">Adobe Photoshop</label>
                </div>
                <div
                  class="flex items-center mb-2 ps-4 p-3.5 border border-gray-200 rounded dark:border-gray-700"
                >
                  <label for="operating_system">Autocad</label>
                </div>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Perpetual</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Perpetual</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Perpetual</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Perpetual</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Perpetual</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Perpetual</label
                  >
                </div>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Subscription</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Subscription</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Subscription</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Subscription</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Subscription</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Subscription</label
                  >
                </div>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Evaluation Copy</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Evaluation Copy</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Evaluation Copy</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Evaluation Copy</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Evaluation Copy</label
                  >
                </div>
                <div
                  class="flex items-center mb-2 ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    value=""
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Evaluation Copy</label
                  >
                </div>
              </div>
            </div>

            <button
              type="submit"
              class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save as Draft
            </button>
          </form>
        </TabPanel>

        <TabPanel value="3" as="p" class="m-0">
          <form>
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="Monitor 1">
                  <div class="card flex mb-7 mt-7 flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">QR Code</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Brand Model</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Serial Number</label>
                      </FloatLabel>
                    </div>
                  </div>
                  <div class="card flex flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Property No</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Accountable Person as seen in PN</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Actual User</label>
                      </FloatLabel>
                    </div>
                  </div>
                </Fieldset>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="Monitor 2">
                  <div class="card flex mb-7 mt-7 flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">QR Code</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Brand Model</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Serial Number</label>
                      </FloatLabel>
                    </div>
                  </div>
                  <div class="card flex flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Property No</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Accountable Person as seen in PN</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Actual User</label>
                      </FloatLabel>
                    </div>
                  </div>
                </Fieldset>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="UPS">
                  <div class="card flex mb-7 mt-7 flex-wrap gap-6">
                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">QR Code</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="form.processor"
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
                          v-model="form.processor"
                          class="w-full lg:w-900"
                        />
                        <label for="processor">Property Number</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText
                          id="processor"
                          v-model="form.processor"
                          class="w-full md:w-100"
                        />
                        <label for="processor">Accountable Person as seen in PN:</label>
                      </FloatLabel>
                    </div>

                    <div class="flex items-center gap-2">
                      <FloatLabel>
                        <InputText id="processor" v-model="form.processor" class="w-full" />
                        <label for="processor">Actual User</label>
                      </FloatLabel>
                    </div>
                  </div>
                </Fieldset>
              </div>
            </div>

            <button
              type="submit"
              class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save as Draft
            </button>
          </form>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </DefaultLayout>
</template>
