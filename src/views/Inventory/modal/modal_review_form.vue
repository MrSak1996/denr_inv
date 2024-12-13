<script setup lang="ts">
import { computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useInventory } from '@/composables/useInventory.ts'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from 'vue-router'
import api from '../../../../laravel-backend/resources/js/axiosInstance.js'

const { printRecord } = useInventory()
const { predefinedSoftware } = useApi()
const route = useRoute()
const toast = useToast()
const router = useRouter()

// Define emitted events
const emit = defineEmits(['close', 'proceed'])

// Define props
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  genForm: {
    type: Object,
    required: true
  },
  periForm: {
    type: Object,
    required: true
  },
  division: {
    type: Array,
    required: true
  },
  wnature: {
    type: Array,
    required: true
  },
  emp_type: {
    type: Array,
    required: true
  },
  equipment: {
    type: Array,
    required: true
  },
  category: {
    type: Array,
    required: true
  },
  softwareData: {
    type: Array,
    required: true
  }
})

// Remarks mapping
const remarksMap = {
  '1': 'Perpetual',
  '2': 'Subscription',
  '3': 'Evaluation'
}

// Generic computed property factory
const createSelector = (sourceProp, targetKey) => {
  return computed(() => {
    const selected = props[sourceProp].find((item) => item.id === props.genForm[targetKey])
    return selected ? selected.name : '~'
  })
}

// Computed properties
const selectedDivisionName = createSelector('division', 'selectedDivision')
const selectedWorkNature = createSelector('wnature', 'selectedWorkNature')
const selectedEmpType = createSelector('emp_type', 'employmentType')
const selectedEquipmentType = createSelector('equipment', 'selectedEquipmentType')
const selectedRangeCategory = createSelector('category', 'selectedRangeCategory')

// Get remarks for a specific software
const getRemarks = (key) => {
  const software = props.softwareData.find((item) => item.software === key)
  return software ? remarksMap[software.remarks] || '' : ''
}

// Close modal
const closeModal = () => {
  emit('close')
}

const handlePrint = () => {
  printRecord(route.params.id) // Example ID
}

const submitFinalReview = async () =>{

  try {

    const requestData = {
      id: route.params.id
    }
    // Make the API call
    const response = await api.post('/post_final_review', requestData)

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
        name: 'Inventory',
        params: { id },
        query: { api_token: localStorage.getItem('api_token') }
      })
    }, 1000)
  } catch (error) {
      console.error('Validation errors:',error)
  }
}

</script>
<style>
.p-button {
  background: rgb(15 118 110) !important;
  border: 1px solid rgb(15 118 110) !important;
  color: #fff !important;
}
</style>
<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog"
    tabindex="-1"
    aria-labelledby="progress-modal"
  >
    <div
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-lg w-130 h-[80vh] max-w-2xl mx-4 lg:mx-auto transition-transform duration-300 transform scale-100"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center py-4 px-6 border-b dark:border-neutral-700">
        <h3 id="reserve-control-no" class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Review and Confirmation
        </h3>
        <button @click="closeModal" class="text-gray-300 hover:text-gray-100">✖</button>
      </div>

      <!-- Modal Body -->
      <div class="flex flex-col justify-center items-center py-2 px-2 h-[70vh]">
        <div class="relative overflow-x-auto">
          <table class="table-auto w-full border border-gray-300 mt-4">
            <thead class="bg-gray-200">
              <tr>
                <th colspan="4" class="px-2 py-1 text-left text-sm font-bold text-gray-700">
                  GENERAL INFORMATION
                  <span class="float-right text-xs font-normal text-gray-500"
                    >RICT Inventory Form v.1 2023</span
                  >
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Division:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ selectedDivisionName }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Section:</td>
                <td class="px-2 py-1 text-sm text-gray-600"></td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Accountable Person:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ genForm.acct_person }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Division:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ selectedDivisionName }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Actual User:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ genForm.actual_user }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Employment Type:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ selectedEmpType }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Nature of Work</td>
                <td colspan="3" class="px-2 py-1 text-sm text-gray-600">
                  {{ selectedWorkNature }}
                </td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">QR Code</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ genForm.qr_code }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Property No.</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ genForm.property_no }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Equipment Type</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ selectedEquipmentType }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Range Category</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ selectedRangeCategory }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Year Acquired</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ genForm.year_acquired }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Acquisition Cost</td>
                <td class="px-2 py-1 text-sm text-gray-600">Php. {{ genForm.acquisition_cost }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Brand</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ genForm.brand }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Model</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ genForm.model }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">S/N</td>
                <td colspan="3" class="px-2 py-1 text-sm text-gray-600">{{ genForm.serial_no }}</td>
              </tr>
            </tbody>
          </table>

          <table class="table-auto w-full border border-gray-200 mt-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-2 py-1 text-left text-sm font-bold text-gray-700" colspan="4">
                  MAJOR SOFTWARE INSTALLED
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(row, index) in predefinedSoftware.slice(0, predefinedSoftware.length / 2)"
                :key="index"
              >
                <td class="px-2 py-1 text-sm font-medium text-gray-700">{{ row.label }}:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ getRemarks(row.key) }}
                </td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">
                  {{ predefinedSoftware[index + predefinedSoftware.length / 2]?.label }}:
                </td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ getRemarks(predefinedSoftware[index + predefinedSoftware.length / 2]?.key) }}
                </td>
              </tr>

              <!-- Add more rows as needed -->
            </tbody>
          </table>

          <table class="table-auto w-full border border-gray-200 mt-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-2 py-1 text-left text-sm font-bold text-gray-700" colspan="4">
                  MONITOR & UPS
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">
                  Monitor 1 Brand & Model:
                </td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.monitor1BrandModel }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Monitor 1 S/N:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.monitor1SerialNumber }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">QR Code:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.monitor1QrCode }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Bundle | Property No.:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ periForm.monitor1PropertyNumber }}
                </td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Accountable Person:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ periForm.monitor1AccountPersonInPN }}
                </td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Actual User:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.monitor1ActualUser }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">
                  Monitor 2 Brand & Model:
                </td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.monitor2BrandModel }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Monitor 2 S/N:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.monitor2SerialNumber }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">QR Code:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.monitor2QrCode }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Bundle | Property No.:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ periForm.monitor2PropertyNumber }}
                </td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Accountable Person:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ periForm.monitor2AccountPersonInPN }}
                </td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Actual User:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.monitor2ActualUser }}</td>
              </tr>
            </tbody>
          </table>

          <table class="table-auto w-full border border-gray-200 mt-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-2 py-1 text-left text-sm font-bold text-gray-700" colspan="4">UPS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Accountable Person:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ periForm.ups_accountPersonInPN }}
                </td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">QR Code:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.ups_qr_code }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Property No:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.ups_property_no }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Serial No</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ periForm.ups_serial_no }}</td>
              </tr>

              <!-- Add more rows as needed -->
            </tbody>
          </table>
        </div>
        <div class="flex justify-end items-center w-full">
          <Button
            @click="handlePrint()"
            severity="teal"
            label="Print"
            icon="pi pi-file-export"
            class="mt-4 mr-4"
          />
          <Button @click = "submitFinalReview" severity="info" label="Submit" icon="pi pi-save" class="mt-4" />
        </div>
      </div>
    </div>
  </div>
</template>
