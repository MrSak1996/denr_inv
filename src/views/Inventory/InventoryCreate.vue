<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

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
import Button from 'primevue/button'
import api from '../../../laravel-backend/resources/js/axiosInstance.js'

const pageTitle = ref('ICT Equipment')

const section_opts = ref([{ name: 'RICT', code: '1' }])
const division_opts = ref([])
const work_nature = ref([])
const equipment_type = ref([])
const range_category = ref([])

const form = reactive({
  control_no: '',
  qr_code: '',
  acct_person: '',
  employmentType: '',
  brand: '',
  model: '',
  property_no: '',
  serial_no: '',
  aquisition_cost: '',
  processor: '',
  selectedDivision:'',
  selectedAcctDivision: '',
  selectedActualDivision:'',
  selectedWorkNature:'',
  selectedSection:'',
  selectedRangeCategory:'',
  selectedEquipmentType:'',
  actual_user:''
})

const getControlNo = async () => {
  try {
    const res = await api.get('/getControlNo')
    const controlNo = res.data[0].control_no
    const paddedControlNo = String(controlNo).padStart(4, '0')

    form.control_no = `R4A-RICT-${paddedControlNo}`
  } catch (error) {
    console.error('Error fetching control number:', error)
  }
}

const getDivision = async () => {
  try {
    const res = await api.get('/getDivision')
    division_opts.value = res.data.map((division) => ({
      id: division.id,
      name: `${division.acronym} - ${division.division_title}`
    }))
  } catch (error) {
    console.error('Error fetching divisions:', error)
  }
}

const getNatureWork = async () => {
  try {
    const res = await api.get('/getNatureWork')
    work_nature.value = res.data.map((work) => ({
      id: work.id,
      name: `${work.nature_work_title}`
    }))
  } catch (error) {
    console.error('Error fetching work:', error)

  }
}

const getEquipment = async () => {
  try {
    const res = await api.get('/getEquipment')
    equipment_type.value = res.data.map((item) => ({
      id: item.id,
      name: `${item.equipment_title}`
    }))
  } catch (error) {
    console.error('Error fetching work:', error)

  }
}

const getRangeCategory = async () => {
  try {
    const res = await api.get('/getRangeCategory')
    range_category.value = res.data.map((item) => ({
      id: item.code,
      name: `${item.name}`
    }))
  } catch (error) {
    console.error('Error fetching work:', error)

  }
}
const saveGeneralInfo = async () => {
      try {
        // Send POST request with form data
        const employmentTypeValue = form.employmentType[0] || '';
        const selectedDivisionValue = form.selectedDivision[0] || '';
        const selectedAcctDivisionValue = form.selectedAcctDivision[0] || '';
        const selectedActualDivisionValue = form.selectedActualDivision[0] || '';
        const selectedWorkNatureValue = form.selectedWorkNature[0] || '';
        const selectedSectionValue = form.selectedSection[0] || '';
        const selectedRangeCategoryValue = form.selectedRangeCategory[0] || '';
        const selectedEquipmentTypeValue = form.selectedEquipmentType[0] || '';''

        const response = await api.post('/post_insert_gen_info',  {
          ...form,
          employmentType: employmentTypeValue,
          selectedDivision:selectedDivisionValue,
          selectedAcctDivision: selectedAcctDivisionValue,
          selectedActualDivision:selectedActualDivisionValue,
          selectedWorkNature:selectedWorkNatureValue,
          selectedSection:selectedSectionValue,
          selectedRangeCategory:selectedRangeCategoryValue,
          selectedEquipmentType:selectedEquipmentTypeValue
        });
        console.log(form)
        // Optionally, reset the form after saving
        // Object.keys(form).forEach(key => form[key] = '');  // To reset form fields
      } catch (error) {
        console.error('Error saving form:', error);
      }
    };
onMounted(() => {
  getControlNo()
  getDivision()
  getNatureWork()
  getEquipment()
  getRangeCategory()
})
</script>
<template>
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
                  optionLabel="name"
                  placeholder="Division"
                  class="w-full"
                />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <Select
                  v-model="form.selectedSection"
                  :options="section_opts"
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
                  placeholder="Division"
                  class="w-full"
                />
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <div class="card flex flex-wrap gap-6">
                  <div class="flex items-center gap-2">
                    <Checkbox
                      inputId="employmentCasual"
                      v-model="form.employmentType"
                      value="Casual"
                    />
                    <label for="employmentCasual">Casual</label>
                  </div>

                  <div class="flex items-center gap-2">
                    <Checkbox inputId="employmentCTI" v-model="form.employmentType" value="CTI" />
                    <label for="employmentCTI">CTI</label>
                  </div>

                  <div class="flex items-center gap-2">
                    <Checkbox
                      inputId="employmentJobOrder"
                      v-model="form.employmentType"
                      value="Job Order"
                    />
                    <label for="employmentJobOrder">Job Order</label>
                  </div>
                </div>
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
              class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                  <InputText id="processor" v-model="form.processor" class="w-full" />
                  <label for="processor">Processor</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="hdd" v-model="form.acct_person" class="w-full" />
                  <label for="hdd">Hard Disk Drive No.</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="capacity" v-model="form.acct_person" class="w-full" />
                  <label for="capacity">Capacity</label>
                </FloatLabel>
              </div>
            </div>
            <div class="grid md:grid-cols-4 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="username" v-model="form.acct_person" class="w-full" />
                  <label for="username">RAM Type</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="username" v-model="form.acct_person" class="w-full" />
                  <label for="username">GPU</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="username" v-model="form.acct_person" class="w-full" />
                  <label for="username">Solid State Drive Type</label>
                </FloatLabel>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <FloatLabel>
                  <InputText id="username" v-model="form.acct_person" class="w-full" />
                  <label for="username">Capacity</label>
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
                        inputId="employmentCasual"
                        v-model="form.employmentType"
                        value="Built-In"
                      />
                      <label for="employmentCasual">Built-In</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="employmentCTI"
                        v-model="form.employmentType"
                        value="Built-In"
                      />
                      <label for="employmentCTI">Dedicated</label>
                    </div>
                    <FloatLabel>
                      <InputText id="processor" v-model="form.processor" class="w-full md:w-100" />
                      <label for="processor">Dedicated Information</label>
                    </FloatLabel>
                  </div>
                </Fieldset>
              </div>

              <div class="relative z-0 w-full mb-5 group">
                <Fieldset legend="Network">
                  <div class="card flex flex-wrap gap-6 mb-6">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="employmentCasual"
                        v-model="form.employmentType"
                        value="LAN"
                      />
                      <label for="employmentCasual">LAN</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="employmentCTI"
                        v-model="form.employmentType"
                        value="Wireless"
                      />
                      <label for="employmentCTI">Wireless</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="employmentCTI"
                        v-model="form.employmentType"
                        value="Both"
                      />
                      <label for="employmentCTI">Both</label>
                    </div>
                    <label>If Wireless:</label>
                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="employmentCTI"
                        v-model="form.employmentType"
                        value="Built-In"
                      />
                      <label for="employmentCTI">Built-In</label>
                    </div>

                    <div class="flex items-center gap-2">
                      <Checkbox
                        inputId="employmentCTI"
                        v-model="form.employmentType"
                        value="With Dongle"
                      />
                      <label for="employmentCTI">With Dongle</label>
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
