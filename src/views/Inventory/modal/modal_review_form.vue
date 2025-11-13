<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useInventory } from '@/composables/useInventory'
import { useToast } from 'primevue/usetoast'
import { useRouter, useRoute } from 'vue-router'
import { useItemHistory } from '@/composables/useItemHistory'
import { useAuthStore } from '@/stores/authStore'
import api from '@/api/axiosInstance'

// =============================
// 🔧 Composables
// =============================
const { itemHistory, loadingVal, error, loadItemHistory } = useItemHistory()
const { printRecord } = useInventory()
const { predefinedSoftware, ram_opts, division_opts, getDivision, getRamTypes } = useApi()

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// =============================
// 🎯 Emits
// =============================
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'proceed'): void
}>()

// =============================
// 📘 Interfaces
// =============================
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

// =============================
// 🧩 Props
// =============================
const props = defineProps<{
  open: boolean
  genForm: Record<string, any>
  periForm: PeriForm
  division: Array<{ id: number; name: string }>
  wnature: Array<{ id: number; name: string }>
  emp_type: Array<{ id: number; name: string }>
  category: Array<{ id: number; name: string }>
  softwareData: Array<{ software: string; remarks: string }>
  specsData: SpecsData
  equipment: Array<{ id: number; name: string }>
  item_id: number
}>()

// =============================
// 💼 Local State
// =============================
const modalOpen = ref(false)

const form = ref({
  item_id: props.item_id ?? '',
  date_transferred: '',
  prev_acct_user_office: '',
  prev_actual_user_office: '',
  new_actual_owner: '',
  new_acct_owner: '',
  new_acct_user_office: '',
  new_actual_user_office: '',
  remarks: '',
  recorded_by: authStore.userId ?? null
})

// =============================
// 🧠 Computed
// =============================
const empType = {
  1: 'Consultant',
  2: 'CIT',
  3: 'Contract of Service/Job Order',
  4: 'Permanent',
  5: 'PS Contractual'
} as const

const employmentTypeLabel = computed(() =>
  empType[props.genForm.employmentType as keyof typeof empType] ?? 'Unknown Role'
)

const remarksMap: Record<string, string> = {
  '1': 'Needs Review',
  '2': 'Approved',
  '3': 'Rejected'
}

const networkTypeMap: Record<string, string> = {
  '1': 'LAN',
  '2': 'Wireless',
  '3': 'Both'
}

const createSelector = <T extends keyof typeof props>(sourceProp: T, targetKey: string) =>
  computed(() => {
    const source = props[sourceProp]
    if (Array.isArray(source)) {
      const selected = source.find(
        (item: { id: number; name: string }) => item.id === props.genForm[targetKey]
      )
      return selected?.name ?? '~'
    }
    return '~'
  })

const selectedDivisionName = createSelector('division', 'selectedDivision')
const selectedWorkNature = createSelector('wnature', 'selectedWorkNature')
const selectedEmpType = createSelector('emp_type', 'employmentType')
const selectedEquipmentType = createSelector('equipment', 'selectedEquipmentType')
const selectedRangeCategory = createSelector('category', 'selectedRangeCategory')

// =============================
// 🔍 Utility Functions
// =============================
const getRemarks = (key: string): string => {
  const software = props.softwareData.find(item => item.software === key)
  return software ? (remarksMap[software.remarks] ?? '') : ''
}

const getRamName = (id?: string | null): string => {
  if (!id) return 'Unknown RAM'
  const ram = ram_opts.value.find(opt => String(opt.id) === String(id))
  return ram?.name ?? 'Unknown RAM'
}

const getNetworkType = (key?: string | null): string =>
  key ? (networkTypeMap[key] ?? 'Unknown') : 'Unknown'

// =============================
// 🧾 Modal Actions
// =============================
const closeModal = () => emit('close')
const closeTransferModal = () => (modalOpen.value = false)
const openTransferItem = () => (modalOpen.value = true)

// =============================
// 💾 Save Transfer
// =============================
const saveTransfer = async () => {
  // if (!form.value.new_owner) {
  //   toast.add({ severity: 'warn', summary: 'Missing Field', detail: 'Please fill in the required fields.', life: 3000 })
  //   return
  // }

  try {
    const payload = {
      ...form.value,
      prev_acct_owner: props.genForm.acct_person,
      prev_actual_owner: props.genForm.actual_user,
    }

    await api.post('/ict-transfers', payload)
    toast.add({ severity: 'success', summary: 'Success', detail: 'Transfer recorded successfully!', life: 3000 })
    closeTransferModal()
  } catch (err) {
    console.error('Error saving transfer:', err)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save transfer record.', life: 3000 })
  }
}

// =============================
// 🚀 Lifecycle
// =============================
onMounted(() => {
  loadItemHistory(props.item_id || Number(route.params.id))
  getRamTypes()
  getDivision()
  const today = new Date().toISOString().split('T')[0]
  form.value.date_transferred = today
})
</script>


<style>
.p-button {
  background: rgb(15 118 110) !important;
  border: 1px solid rgb(15 118 110) !important;
  color: #fff !important;
}
</style>
<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="dialog"
    tabindex="-1" aria-labelledby="progress-modal">

    <!-- ================= TRANSFERING ITEM =================-->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeTransferModal()">
      <div style="max-width: 50rem;"
        class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-md rounded-xl w-full max-w-lg mx-4">
        <!-- Header -->
        <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Transfer Actual User ICT Equipment</h3>
          <button @click="closeTransferModal()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400">
            ✖
          </button>

        </div>

        <!-- Body -->
        <div class="p-4 space-y-4" style="height: 500px; overflow: auto;">

          <div class="grid md:grid-cols-2 md:gap-6 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Item ID</label>
              <input type="text" v-model="form.item_id"
                class="w-full mt-1 p-2 border rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-600"
                readonly />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date Transferred
              </label>
              <input type="date" v-model="form.date_transferred" value="form.date_transferred" readonly
                class="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-100 dark:bg-neutral-900 dark:border-neutral-600 cursor-not-allowed" />
            </div>

          </div>
          <Fieldset legend="Accountable User" :toggleable="true">
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Previous Accountable
                  User</label>
                <input type="text" v-model="genForm.acct_person"
                  class="w-full mt-1 p-2 border rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-600"
                  placeholder="e.g. John Doe" />
              </div>
              <div class=" w-full  group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Previous Office</label>
                <Select filter v-model="form.prev_acct_user_office" :options="division_opts" optionLabel="name"
                  optionValue="id" placeholder="Division" class="w-full mt-1 h-[37px]" />
              </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Accountable Owner</label>
                <input type="text" v-model="form.new_acct_owner"
                  class="w-full mt-1 p-2 border rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-600"
                  placeholder="e.g. Jane Smith" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Office</label>

                <Select filter v-model="form.new_acct_user_office" :options="division_opts" optionValue="id"
                  optionLabel="name" placeholder="Division" class="w-full mt-1 h-[37px]" />
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Actual User" :toggleable="true">
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Previous User</label>
                <input type="text" v-model="genForm.actual_user"
                  class="w-full mt-1 p-2 border rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-600"
                  placeholder="e.g. John Doe" />
              </div>
              <div class=" w-full  group">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Previous Office</label>
                <Select filter v-model="form.prev_actual_user_office" :options="division_opts" optionLabel="name"
                  optionValue="id" placeholder="Division" class="w-full mt-1 h-[37px]" />
              </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6 mb-4">

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Owner</label>
                <input type="text" v-model="form.new_actual_owner"
                  class="w-full mt-1 p-2 border rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-600"
                  placeholder="e.g. Jane Smith" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Office</label>

                <Select filter v-model="form.new_actual_user_office" :options="division_opts" optionValue="id"
                  optionLabel="name" placeholder="Division" class="w-full mt-1 h-[37px]" />
              </div>
            </div>
          </Fieldset>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks</label>
            <textarea v-model="form.remarks" rows="3"
              class="w-full mt-1 p-2 border rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-600"
              placeholder="Enter remarks..."></textarea>
          </div>


        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 py-3 px-4 border-t dark:border-neutral-700">
          <button @click="closeTransferModal"
            class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700">
            Cancel
          </button>
          <button @click="saveTransfer"
            class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            Save Transfer
          </button>
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-lg w-130 h-[80vh] max-w-2xl mx-4 lg:mx-auto transition-transform duration-300 transform scale-100">
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
          <table class="table-auto w-full border border-gray-300 mt-4" style="font-size:small;">
            <thead>
              <tr>
                <th colspan="7" class="px-3 py-2 text-left text-sm font-bold bg-blue-900 text-white">
                  ITEM HISTORY LOGS
                  <Button @click="openTransferItem()" type="button" label="Transfer Item" icon="pi pi-undo" size="small"
                    style="margin-left: 56%;" />

                </th>
              </tr>
              <tr class="bg-gray-200 text-gray-800 text-sm font-semibold">
                <th class="px-2 py-1 border text-left">Date Transferred</th>
                <th class="px-2 py-1 border text-left">Prev Accountable</th>
                <th class="px-2 py-1 border text-left">New Accountable</th>
                <th class="px-2 py-1 border text-left">Prev User</th>
                <th class="px-2 py-1 border text-left">New User</th>
                <th class="px-2 py-1 border text-left">Remarks</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-300">
              <tr v-for="(log, index) in itemHistory" :key="log.id">
                <td>
                  <Tag severity="info" :value="log.date_transferred" class="ml-2" />
                </td>
                <td>
                  <div>{{ log.prev_acct_owner }}</div>
                  <div class="font-bold">{{ log.prev_acct_user_office }}</div>
                </td>
                <td>
                  <div>{{ log.new_acct_owner }}</div>
                  <div class="font-bold">{{ log.new_acct_user_office }}</div>
                </td>


                <td>
                  <div>{{ log.prev_actual_owner }}</div>
                  <div class="font-bold">{{ log.prev_actual_user_office }}</div>
                </td>
                <td>
                  <div>{{ log.new_actual_owner }}</div>
                  <div class="font-bold">{{ log.new_actual_user_office }}</div>
                </td>
                <td>{{ log.remarks }}</td>
              </tr>


              <tr v-if="!loadingVal && itemHistory.length === 0">
                <td colspan="5" class="px-2 py-2 text-center text-gray-500">
                  No history records found.
                </td>
              </tr>

              <tr v-if="loadingVal">
                <td colspan="5" class="px-2 py-2 text-center text-gray-500">
                  Loading...
                </td>
              </tr>

              <tr v-if="error">
                <td colspan="5" class="px-2 py-2 text-center text-red-500">
                  {{ error }}
                </td>
              </tr>
            </tbody>

          </table>


          <table class="table-auto w-full border border-gray-300 mt-4">
            <thead class="bg-gray-200">
              <tr>
                <th colspan="4" class="px-2 py-1 text-left text-sm font-bold"
                  style="background-color: #F44336;color:#fff">

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
                <th colspan="4" class="px-2 py-1 text-left text-sm font-bold"
                  style="background-color: #2196F3;color:#fff">
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
                  {{ specsData.specs_gpu == 1 ? 'Built-In' : 'Dedicated ' + (specsData.specs_gpu_dedic_info ||
                    'Unknown') }}

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
                <th class="px-2 py-1 text-left text-sm font-bold" style="background-color: #4CAF50; color: #fff;"
                  colspan="4">
                  MAJOR SOFTWARE INSTALLED
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(row, index) in predefinedSoftware.slice(0, predefinedSoftware.length / 2)" :key="index">
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
                <th class="px-2 py-1 text-left text-sm font-bold" style="background-color: #FFEB3B;color:#000;"
                  colspan="4">
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
