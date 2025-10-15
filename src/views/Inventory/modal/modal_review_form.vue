<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { useInventory } from '@/composables/useInventory'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/axiosInstance'

const { printRecord } = useInventory()
const { predefinedSoftware } = useApi()

const route = useRoute()
const toast = useToast()
const router = useRouter()

const emit = defineEmits(['close', 'proceed'])

interface SpecsData {
  specs_processor: string
  specs_ram: string
  specs_gpu: number
  specs_gpu_dedic_info: string
  specs_ram_capacity: string
  specs_hdd: number | null
  specs_ssd: number | null
  specs_hdd_capacity: string | null
  specs_ssd_capacity: string | null
  specs_net: string | null
  specs_net_iswireless: string | null
}

interface PeriForm {
  monitor1BrandModel: string
  monitor1SerialNumber: string
  monitor1QrCode: string
  monitor1PropertyNumber: string
  monitor1AccountPersonInPN: string
  monitor1ActualUser: string
  monitor2BrandModel: string
  monitor2SerialNumber: string
  monitor2QrCode: string
  monitor2PropertyNumber: string
  monitor2AccountPersonInPN: string
  monitor2ActualUser: string
  ups_accountPersonInPN: string
  ups_qr_code: string
  ups_property_no: string
  ups_serial_no: string
}

const props = defineProps<{
  open: boolean
  genForm: Record<string, any>
  periForm: PeriForm
  division: Array<any>
  wnature: Array<any>
  emp_type: Array<any>
  category: Array<any>
  softwareData: Array<{ software: string; remarks: string }>
  specsData: SpecsData
  equipment: Array<any>
  item_id: number
}>()

const empType = {
  1: 'Consultant',
  2: 'CIT',
  3: 'Contract of Service/Job Order',
  4: 'Permanent',
  5: 'PS Contractual'
}

const employmentTypeLabel = computed(() => {
  return empType[props.genForm.employmentType as keyof typeof empType] ?? 'Unknown Role'
})

const remarksMap: Record<string, string> = {
  '1': 'Needs Review',
  '2': 'Approved',
  '3': 'Rejected'
}

const createSelector = (sourceProp: string, targetKey: string) => {
  return computed(() => {
    const source = props[sourceProp as keyof typeof props];
    if (Array.isArray(source)) {
      const selected = source.find(
        (item: { id: any; name: string }) => item.id === props.genForm[targetKey]
      );
      return selected ? selected.name : '~';
    }
    return '~';
  });
};

const selectedDivisionName = createSelector('division', 'selectedDivision')
const selectedWorkNature = createSelector('wnature', 'selectedWorkNature')
const selectedEmpType = createSelector('emp_type', 'employmentType')
const selectedEquipmentType = createSelector('equipment', 'selectedEquipmentType')
const selectedRangeCategory = createSelector('category', 'selectedRangeCategory')

const getRemarks = (key: string): string => {
  const software = props.softwareData.find((item) => item.software === key)
  return software?.remarks ? remarksMap[software.remarks] || '' : ''
}

const closeModal = () => {
  emit('close')
}

const handlePrint = () => {
  const idToPrint = props.item_id ? props.item_id : route.params.id
  printRecord(Number(idToPrint))
}
const submitFinalReview = async () => {
  try {
    const item_id = props.item_id ? props.item_id : route.params.id;
    const requestData = { id: item_id };

    const response = await api.post('/post_final_review', requestData);

    setTimeout(() => {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully!', life: 3000 });
      router.push({ name: 'Inventory', params: { id: response.data.id }, query: { api_token: localStorage.getItem('api_token') } });
    }, 1000);
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save data.', life: 3000 });
    console.error('Validation errors:', error);
  }
};

const networkTypeMap: Record<string, string> = {
  '1': 'LAN',
  '2': 'Wireless',
  '3': 'Both'
}

const ram_opts = ref([
  { name: 'Static RAM', id: '1' },
  { name: 'Dynamic RAM', id: '2' },
  { name: 'Synchronous Dynamic RAM (SDRAM)', id: '3' },
  { name: 'Single Data Rate Synchronous Dynamic RAM', id: '4' },
  { name: 'DDR2', id: '5' },
  { name: 'DDR3', id: '6' },
  { name: 'DDR4', id: '7' },
  { name: 'GDDR', id: '8' },
  { name: 'SDRAM', id: '9' },
  { name: 'GDDR2', id: '10' },
  { name: 'GDDR3', id: '11' },
  { name: 'GDDR4', id: '12' },
  { name: 'GDDR5', id: '13' },
  { name: 'Flash Memory', id: '14' }
])

const getRamName = (id: string | null | undefined): string => {
  if (!id) return 'Unknown RAM'
  const ram = ram_opts.value.find((option) => option.id === id.toString())
  return ram ? ram.name : 'Unknown RAM'
}

const getNetworkType = (key: string | null | undefined): string => {
  return key ? networkTypeMap[key] || 'Unknown' : 'Unknown'
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
          ICT Equipment Information
        </h3>
        <button @click="closeModal" class="text-gray-300 hover:text-gray-100">✖</button>
      </div>

      <!-- Modal Body -->
      <div class="flex flex-col justify-center items-center py-2 px-2 h-[70vh]">
        <div class="relative overflow-x-auto">
          <table class="table-auto w-full border border-gray-300 mt-4">
            <thead class="bg-gray-200">
              <tr>
                <th colspan="4" class="px-2 py-1 text-left text-sm font-bold" style="background-color: #F44336;color:#fff">

                  GENERAL INFORMATION
                  <span class="float-right text-xs font-normal"></span>
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
                <td class="px-2 py-1 text-sm text-gray-600">{{ employmentTypeLabel }}</td>
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
                <td class="px-2 py-1 text-sm text-gray-600">{{ genForm.equipment_title }}</td>
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

          <table class="table-auto w-full border border-gray-300 mt-4">
            <thead class="bg-gray-200">
              <tr>
                <th colspan="4" class="px-2 py-1 text-left text-sm font-bold" style="background-color: #2196F3;color:#fff">
                  SPECIFICATION
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Processor:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ specsData.specs_processor }}</td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">RAM Type:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ getRamName(specsData.specs_ram) }}
                </td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">GPU:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ specsData.specs_gpu == 1 ? 'Built-In' : 'Dedicated ' + (specsData.specs_gpu_dedic_info || 'Unknown') }}

                </td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">RAM Capacity:</td>
                <td class="px-2 py-1 text-sm text-gray-600">{{ specsData.specs_ram_capacity }}</td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">No. of HDD:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{
                    specsData.specs_hdd == null || specsData.specs_hdd == 0
                      ? '~'
                      : specsData.specs_hdd
                  }}
                </td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">No. of SSD:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ specsData.specs_ssd == null ? '~' : specsData.specs_ssd }}
                </td>
              </tr>
              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">HDD Capacity:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ specsData.specs_hdd_capacity == null ? '~' : specsData.specs_hdd_capacity }}
                </td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">SSD Capacity:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ specsData.specs_ssd_capacity == null ? '~' : specsData.specs_ssd_capacity }}
                </td>
              </tr>

              <tr>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">Network:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{ getNetworkType(specsData.specs_net) }}
                </td>
                <td class="px-2 py-1 text-sm font-medium text-gray-700">If Wireless:</td>
                <td class="px-2 py-1 text-sm text-gray-600">
                  {{
                    specsData.specs_net_iswireless == null ? '~' : specsData.specs_net_iswireless
                  }}
                </td>
              </tr>
            </tbody>
          </table>

          <table class="table-auto w-full border border-gray-200 mt-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-2 py-1 text-left text-sm font-bold" style="background-color: #4CAF50; color: #fff;" colspan="4">
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
                <th class="px-2 py-1 text-left text-sm font-bold" style="background-color: #FFEB3B;color:#000;" colspan="4">
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
            <thead class="bg-gray-500">
              <tr>
                <th class="px-2 py-1 text-left text-sm font-bold" style="color:#fff;" colspan="4">UPS</th>
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
         
          <!-- <Button @click="submitFinalReview" severity="info" label="Submit" icon="pi pi-save" class="mt-4" /> -->
        </div>
      </div>
    </div>
  </div>
</template>
