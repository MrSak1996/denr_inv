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

import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Fieldset from 'primevue/fieldset'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import Tag from 'primevue/tag'

import api from '../../../laravel-backend/resources/js/axiosInstance.js'

const { um_create_form } = useForm()
const { province_opts, division_opts, employment_opts, getDivision, getEmploymentType,getUserRoles,roles_opts} = useApi()

let city_mun_opts = ref([])
const errors = ref({})

watch(
  () => um_create_form.province,
  async (newProvince) => {
    if (newProvince) {
      try {
        const response = await api.get(`/provinces/${newProvince}/cities`)
        if (response.data && Array.isArray(response.data)) {
          city_mun_opts.value = response.data.map((item) => ({
            id: item.mun_code,
            name: item.mun_name
          }))
          um_create_form.province = newProvince
          um_create_form.city_mun = city_mun_opts.value
        } else {
          console.error('Unexpected response structure:', response)
          city_mun_opts.value = []
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
      }
    } else {
      city_mun_opts.value = []
    }
  }
)
onMounted(() => {
  getDivision(),
  getEmploymentType(),
  getUserRoles()
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
    const requestData = {
      ...um_create_form
    }

    const response = await api.post('/post_save_userCred', requestData)
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
    }, 2000)
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.message
      console.error('Validation errors:', errors.value)
    } else {
      console.error('Error saving form:', error)
    }
  }
}
</script>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <div class="grid grid-cols-12 mb-4">
      <!-- Buttons Column (Equivalent to Bootstrap col-lg-3) -->
      

      <!-- DataTable Column (Equivalent to Bootstrap col-lg-9) -->
      <div class="col-span-12">
        <form @submit.prevent="post_save_userCred">
          <div class="bg-white p-4 rounded-lg shadow-md">
            <Fieldset legend="User Details">
              <div class="grid md:grid-cols-2 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.region" :value="um_create_form.region" class="w-full" />
                    <label>Region</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.first_name" :value="um_create_form.first_name" class="w-full" />
                    <label>First Name</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select v-model="um_create_form.province" :options="province_opts" optionValue="id" optionLabel="name"
                    placeholder="Province" class="w-full" />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.middle_name" :value="um_create_form.middle_name"
                      class="w-full" />
                    <label>Middle Name</label>
                  </FloatLabel>
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <Select v-model="um_create_form.city_mun" :options="city_mun_opts" optionValue="id" optionLabel="name"
                    placeholder="City/Municipalities" class="w-full" />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.last_name" :value="um_create_form.last_name" class="w-full" />
                    <label>Last Name</label>
                  </FloatLabel>
                </div>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <Select v-model="um_create_form.division" :options="division_opts" optionValue="id" optionLabel="name"
                    placeholder="Division" class="w-full" />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select v-model="um_create_form.employment_status" :options="employment_opts" optionLabel="name"
                    optionValue="id" placeholder="Employment Type" class="w-full" />
                </div>
              </div>
              <div class="grid md:grid-cols-4 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.position" :value="um_create_form.position" class="w-full" />
                    <label>Position</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.email" :value="um_create_form.email" class="w-full" />
                    <label>Email Address</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.contact_details" :value="um_create_form.contact_details"
                      class="w-full" />
                    <label>Contact Details</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select v-model="um_create_form.sex" :options="sex_opts" optionValue="id" optionLabel="name"
                    placeholder="Gender" class="w-full" />
                </div>
              </div>

              <div class="grid md:grid-cols-1 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.complete_address" :value="um_create_form.complete_address"
                      class="w-full" />
                    <label>Complete Address</label>
                  </FloatLabel>
                </div>
              </div>
            </Fieldset>
            <Fieldset legend="User Credentials">
              <div class="grid md:grid-cols-3 md:gap-6 mb-4 mt-4">
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.username" :value="um_create_form.username" class="w-full" />
                    <label>Username</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <FloatLabel>
                    <InputText v-model="um_create_form.password" :value="um_create_form.password" class="w-full" />
                    <label>Password</label>
                  </FloatLabel>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                  <Select v-model="um_create_form.roles" :options="roles_opts" optionValue="id"
                    optionLabel="name" placeholder="User Role" class="w-full" />
                </div>
              </div>
            </Fieldset>
            <Fieldset legend="Roles & Assignment">
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
            </Fieldset>
            <button type="button" @click="post_save_userCred()"
              class="block mt-4 w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white text-center transition hover:bg-opacity-90">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </DefaultLayout>
</template>
