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
import Checkbox from 'primevue/checkbox'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Tag from 'primevue/tag'

import Fieldset from 'primevue/fieldset'

import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import api from '../../../laravel-backend/resources/js/axiosInstance.ts'

const users = ref([])
const filters = ref()
const loading = ref(false)
const progress = ref(0)
const user_id = ref(0)
const isLoading = ref(false)
const isModalOpen = ref(false)
const currentMessage = ref('Loading, please wait...')
const selectedCategory = ref('Production')

const messages = ref([
  'Loading, please wait...',
  'Processing data...',
  'Initializing data...',
  'Fetching resources...',
  'Preparing your data...',
  'Almost there, hang tight...'
])
const usermanagement_roles = ref([
  { name: 'User Management Section - Manage Accounts', key: 'A' },
  { name: 'User Management Section - Viewing User Activity Logs', key: 'A' },
  { name: 'User Management Section - Creating New Users', key: 'A' },
  { name: 'User Management Section - Editing User Profiles', key: 'A' },
  { name: 'User Management Section - Disabling/Enabling User Accounts', key: 'A' },
  { name: 'User Management Section - Assigning User Roles', key: 'A' },
  { name: 'User Management Section - Resetting User Passwords', key: 'A' }
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
    const response = await api.get(`/getUsers`)
    users.value = response.data.data // Process the fetched data
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
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    roles: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    name: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    division_title: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    position: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    username: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    email: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    mobile_no: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  }
}

initFilters()

// Clear all filters
const clearFilter = () => {
  initFilters()
}


const editAccount = (id) => {
  router.push({name: 'EditAccount',params:{id}});
}

//Assigning roles

const openModal = (id: number) => {
  isModalOpen.value = true
  user_id.value = id
}
const closeModal = () => {
  isModalOpen.value = false
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
      <!-- DataTable Column (Equivalent to Bootstrap col-lg-9) -->
      <div class="col-span-12 md:col-span-12">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <!-- progress bar -->
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
          <!-- assign roles -->
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
                <h3 class="text-lg font-semibold">Roles & Permision</h3>
                <button
                  @click="closeModal"
                  class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
                >
                  ✖
                </button>
              </div>

              <!-- Modal Body -->
              <div class="p-4">
                <Fieldset legend="Roles & Assignment">
                  <div class="grid md:grid-cols-1 md:gap-6 mb-4 mt-4">
                    <div class="card">
                      <div class="card flex justify-left">
                              <div class="flex flex-col gap-4">
                                <div
                                  v-for="category in usermanagement_roles"
                                  :key="category.key"
                                  class="flex items-center gap-2"
                                >
                                  <Checkbox
                                    v-model="selectedCategory"
                                    :inputId="category.key"
                                    name="dynamic"
                                    :value="category.name"
                                  />
                                  <p :for="category.key"> {{ category.name }}</p>
                                </div>
                              </div>
                            </div>
                    </div>
                  </div>
                </Fieldset>
              </div>
            </div>
          </div>
          <DataTable
            size="small"
            v-model:filters="filters"
            :value="users"
            paginator
            showGridlines
            :rows="10"
            dataKey="id"
            filterDisplay="menu"
            :loading="loading"
            :globalFilterFields="[
              'id',
              'roles',
              'name',
              'diviison_title',
              'position',
              'username',
              'email',
              'mobile_no'
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
            <Column field="id" header="Action" style="width: 1rem;">
              <template #body="{ data }">
                <div class="card flex justify-center">
                  <Button
                  @click="editAccount(data.id)"
                    icon="pi pi-file-edit"
                    size="small"
                    class="text-white mr-2 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-blue-800"
                    severity="info"
                  />
                
                  <!-- <Button
                    @click="openModal(data.id)"
                    icon="pi pi-cog"
                    size="small"
                    class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-blue-800"
                    severity="info"
                  /> -->
                </div>
              </template>
             
            </Column>
            <Column field="roles" header="Designation" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.roles }}
                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>

            <Column field="name" header="Employee Name" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.first_name}} {{ data.last_name }}

                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>

            <Column field="division_title" header="Division" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.division_title }}

                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
            <Column field="position" header="Position" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.position }}

                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
            <Column field="username" header="Username" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.username }}

                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
            <Column field="email" header="Active Email" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.email }}
                <!-- Ensure this field exists in the data object -->
              </template>
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
              </template>
            </Column>
            <Column field="mobile_no" header="Contact Details" style="min-width: 5rem">
              <template #body="{ data }">
                {{ data.mobile_no }}
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
