<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useForm } from '@/composables/useForm'
import { useApi } from '@/composables/useApi'
import { useToast } from 'primevue/usetoast'

import router from '@/router'

import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'

import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Fieldset from 'primevue/fieldset'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import Tag from 'primevue/tag'

import api from '../../../laravel-backend/resources/js/axiosInstance.ts'

const { um_create_form } = useForm()
const {
  province_opts,
  division_opts,
  employment_opts,
  getDivision,
  getEmploymentType,
  getUserRoles,
  roles_opts
} = useApi()

let city_mun_opts = ref([])
const errors = ref({})
const geo_code = ref('')
watch(
  () => um_create_form.city_mun,
  (newCityMun) => {
    const selectedMunicipality = city_mun_opts.value.find((item) => item.id === newCityMun)
    if (selectedMunicipality) {
      um_create_form.geo_code = selectedMunicipality.code
    } else {
      um_create_form.geo_code = ''
    }
  }
)
watch(
  () => um_create_form.province,
  async (newProvince) => {
    // Check if newProvince has a value
    if (newProvince) {
      try {
        // Fetch cities for the selected province
        const response = await api.get(`/provinces/${newProvince}/cities`)

        // Check if response data is valid and is an array
        if (response.data && Array.isArray(response.data)) {
          // Map the response data to the expected format
          city_mun_opts.value = response.data.map((item) => ({
            id: item.mun_code,
            name: item.mun_name,
            code: item.geo_code
          }))

          // Update the form with the province and associated cities
          um_create_form.province = newProvince
          um_create_form.city_mun = city_mun_opts.value
        } else {
          // Handle unexpected response structure
          console.error('Unexpected response structure:', response)
          city_mun_opts.value = []
        }
      } catch (error) {
        // Log the error if the API call fails
        console.error('Error fetching cities:', error)
        city_mun_opts.value = []
      }
    } else {
      // If no province is selected, reset city options
      city_mun_opts.value = []
    }
  }
)

onMounted(() => {
  getDivision(), getEmploymentType(), getUserRoles()
})
// Page title
const pageTitle = ref('Create User Account')
const selectedCategory = ref('Production')

const inventory_roles = ref([
  { name: 'Inventory Section - Viewing of ICT Equipment', key: 'A' },
  { name: 'Inventory Section - Creating of ICT Equipment', key: 'A' },
  { name: 'Inventory Section - Editing ICT Equipment Details', key: 'A' },
  { name: 'Inventory Section - Deleting ICT Equipment', key: 'A' },
  { name: 'Inventory Section - Generating Inventory Reports', key: 'A' },
  { name: 'Inventory Section - Approving Inventory Transactions', key: 'A' }
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

const sex_opts = ref([
  { name: 'Male', id: 1 },
  { name: 'Female', id: 2 },
  { name: 'Others', id: 3 }
])

const toast = useToast()

const post_save_userCred = async () => {
  try {
    errors.value = {}
    const requestData = { ...um_create_form }

    const response = await api.post('/post_save_userCred', requestData)

    if (!response) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No response from server!',
        life: 3000
      })
    } else {
      setTimeout(() => {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data saved successfully!',
          life: 3000
        })

        const id = response.data.id
        router.push({
          name: 'Account List',
          params: { id },
          query: { api_token: localStorage.getItem('api_token') }
        })
      }, 2000)
    }
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
      const errorMessages = Object.values(errors.value).flat().join(' ')
      toast.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: errorMessages,
        life: 5000
      })
    } else {
      console.error('Error saving form:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save data. Please try again later.',
        life: 5000
      })
    }
  }
}
</script>

<template>
  <Toast />
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <div class="grid grid-cols-12 mb-4">
      <div class="col-span-12">
        <form @submit.prevent="post_save_userCred">
          <div class="bg-white p-4 rounded-lg shadow-md">
            <Fieldset legend="User Details">
              <div class="grid md:grid-cols-2 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.region"
                      :value="um_create_form.region"
                      class="w-full"
                    />
                    <label>Region</label>
                  </FloatLabel>
                  <FloatLabel>
                    <InputText
                      hidden
                      v-model="um_create_form.geo_code"
                      :value="um_create_form.geo_code"
                      class="w-full"
                    />
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.first_name"
                      :value="um_create_form.first_name"
                      class="w-full"
                    />
                    <label>First Name</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select
                    v-model="um_create_form.province"
                    :options="province_opts"
                    optionValue="id"
                    optionLabel="name"
                    placeholder="Province"
                    class="w-full"
                  />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.middle_name"
                      :value="um_create_form.middle_name"
                      class="w-full"
                    />
                    <label>Middle Name</label>
                  </FloatLabel>
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <Select
                    v-model="um_create_form.city_mun"
                    :options="city_mun_opts"
                    optionValue="id"
                    optionLabel="name"
                    placeholder="City/Municipalities"
                    class="w-full"
                  />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.last_name"
                      :value="um_create_form.last_name"
                      class="w-full"
                    />
                    <label>Last Name</label>
                  </FloatLabel>
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <Select
                    v-model="um_create_form.division"
                    :options="division_opts"
                    optionValue="id"
                    optionLabel="name"
                    placeholder="Division"
                    class="w-full"
                  />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select
                    v-model="um_create_form.employment_status"
                    :options="employment_opts"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Employment Type"
                    class="w-full"
                  />
                </div>
              </div>
              <div class="grid md:grid-cols-4 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.position"
                      :value="um_create_form.position"
                      class="w-full"
                    />
                    <label>Position</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.email"
                      :value="um_create_form.email"
                      class="w-full"
                    />
                    <label>Email Address</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.contact_details"
                      :value="um_create_form.contact_details"
                      class="w-full"
                    />
                    <label>Contact Details</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select
                    v-model="um_create_form.sex"
                    :options="sex_opts"
                    optionValue="id"
                    optionLabel="name"
                    placeholder="Gender"
                    class="w-full"
                  />
                </div>
              </div>

              <div class="grid md:grid-cols-1 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.complete_address"
                      :value="um_create_form.complete_address"
                      class="w-full"
                    />
                    <label>Complete Address</label>
                  </FloatLabel>
                </div>
              </div>
            </Fieldset>
            <Fieldset legend="User Credentials">
              <div class="grid md:grid-cols-3 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.username"
                      :value="um_create_form.username"
                      class="w-full"
                    />
                    <label>Username</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText
                      v-model="um_create_form.password"
                      :value="um_create_form.password"
                      class="w-full"
                    />
                    <label>Password</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select
                    v-model="um_create_form.roles"
                    :options="roles_opts"
                    optionValue="id"
                    optionLabel="name"
                    placeholder="User Role"
                    class="w-full"
                  />
                </div>
              </div>
            </Fieldset>
            <!-- <Fieldset legend="Roles & Assignment">
              <div class="grid md:grid-cols-1 md:gap-6 mb-4 mt-4">
                <div class="card">
                  <Accordion value="0">
                    <AccordionPanel value="0">
                      <AccordionHeader>Inventory</AccordionHeader>
                      <AccordionContent>
                        <div class="card flex justify-left">
                          <div class="flex flex-col gap-4">
                            <div v-for="category in inventory_roles" :key="category.key"
                              class="flex items-center gap-2">
                              <Checkbox v-model="selectedCategory" :inputId="category.key" name="dynamic"
                                :value="category.name" />
                              <Tag severity="info" :for="category.key"> {{ category.name }}</Tag>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="1">
                      <AccordionHeader>User Management</AccordionHeader>
                      <AccordionContent>
                        <div class="card flex justify-left">
                          <div class="flex flex-col gap-4">
                            <div v-for="category in usermanagement_roles" :key="category.key"
                              class="flex items-center gap-2">
                              <RadioButton v-model="selectedCategory" :inputId="category.key" name="dynamic"
                                :value="category.name" />
                              <Tag severity="primary" :for="category.key"> {{ category.name }}</Tag>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionPanel>
                    
                  </Accordion>
                </div>
              </div>
            </Fieldset> -->
            <input
              type="submit"
              class="block mt-4 w-full cursor-pointer rounded-lg border border-teal bg-teal p-4 font-medium text-white text-center transition hover:bg-opacity-90"
              value="Save"
            />
            
          </div>
        </form>
      </div>
    </div>
  </DefaultLayout>
</template>
