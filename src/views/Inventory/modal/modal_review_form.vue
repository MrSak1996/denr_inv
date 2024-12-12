<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['close', 'proceed'])
const props = defineProps({
    open: {
        type: Boolean,
        default: false
    },
    genForm: {
        type: Array,
    }
});
console.log(props.genForm);
const closeModal = () => {
  emit('close')
}
</script>
<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog"
    tabindex="-1"
    aria-labelledby="progress-modal"
  >
    <div
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-lg w-130 h-[80vh]  max-w-2xl mx-4 lg:mx-auto transition-transform duration-300 transform scale-100"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center py-4 px-6 border-b dark:border-neutral-700">
        <h3 id="reserve-control-no" class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Review and Confirmation
        </h3>
        <button @click="closeModal" class="text-gray-300 hover:text-gray-100">✖</button>
      </div>

      <!-- Modal Body -->
      <div class="flex flex-col justify-center items-center py-2 px-2 h-[70vh] ">
        <div class="relative overflow-x-auto ">
          <table class="table-auto w-full border border-gray-300 mt-4">
            <thead class="bg-gray-200">
              <tr>
                <th colspan="4" class="px-4 py-2 text-left text-sm font-bold text-gray-700">
                  GENERAL INFORMATION
                  <span class="float-right text-xs font-normal text-gray-500"
                    >RICT Inventory Form v.1 2023</span
                  >
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Division</td>
                <td class="px-4 py-2 text-sm text-gray-600">Regional Executive Director</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Section</td>
                <td class="px-4 py-2 text-sm text-gray-600"></td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Accountable Person</td>
                <td class="px-4 py-2 text-sm text-gray-600">{{ genForm.acct_person }}</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Division</td>
                <td class="px-4 py-2 text-sm text-gray-600">Regional Executive Director</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Actual User</td>
                <td class="px-4 py-2 text-sm text-gray-600">{{ genForm.actual_user }}</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700"></td>
                <td class="px-4 py-2 text-sm text-gray-600">
                  <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox" disabled />
                    <span class="ml-2 text-sm text-gray-600">Casual</span>
                  </label>

                  <label class="inline-flex items-center ml-4">
                    <input type="checkbox" class="form-checkbox" checked disabled />
                    <span class="ml-2 text-sm text-gray-600">CTI</span>
                  </label>
                  <label class="inline-flex items-center ml-4">
                    <input type="checkbox" class="form-checkbox" disabled />
                    <span class="ml-2 text-sm text-gray-600">JO</span>
                  </label>
                </td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Nature of Work</td>
                <td colspan="3" class="px-4 py-2 text-sm text-gray-600">
                  <label class="inline-flex items-center ml-4">
                    <input type="checkbox" class="form-checkbox" checked />
                    <span class="ml-2 text-sm text-gray-600">Admin Works/Clerical</span> </label
                  ><br />
                  <label class="inline-flex items-center ml-4">
                    <input type="checkbox" class="form-checkbox" disabled />
                    <span class="ml-2 text-sm text-gray-600">Technical/IS Operator</span> </label
                  ><br />
                  <label class="inline-flex items-center ml-4">
                    <input type="checkbox" class="form-checkbox" disabled />
                    <span class="ml-2 text-sm text-gray-600">GIS/Graphics/SysDev</span>
                  </label>
                </td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">QR Code</td>
                <td class="px-4 py-2 text-sm text-gray-600">{{ genForm.qr_code }}</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Property No.</td>
                <td class="px-4 py-2 text-sm text-gray-600">null</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Equipment Type</td>
                <td class="px-4 py-2 text-sm text-gray-600">Desktop Computers</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Range Category</td>
                <td class="px-4 py-2 text-sm text-gray-600">Entry Level</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Year Acquired</td>
                <td class="px-4 py-2 text-sm text-gray-600">{{ genForm.year_acquired }}</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Acquisition Cost</td>
                <td class="px-4 py-2 text-sm text-gray-600"></td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Brand</td>
                <td class="px-4 py-2 text-sm text-gray-600">{{ genForm.brand }}</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Model</td>
                <td class="px-4 py-2 text-sm text-gray-600">{{ genForm.model }}</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">S/N</td>
                <td colspan="3" class="px-4 py-2 text-sm text-gray-600">{{ genForm.serial_no }}</td>
              </tr>
            </tbody>
          </table>

          <table class="table-auto w-full border border-gray-200 mt-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-bold text-gray-700" colspan="4">
                  MAJOR SOFTWARE INSTALLED
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Operating System</td>
                <td class="px-4 py-2 text-sm text-gray-600">Perpetual</td>
                <td class="px-4 py-2 text-sm text-gray-600">Subscription</td>
                <td class="px-4 py-2 text-sm text-gray-600">Evaluation Copy</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Microsoft Office</td>
                <td class="px-4 py-2 text-sm text-gray-600">Perpetual</td>
                <td class="px-4 py-2 text-sm text-gray-600">Subscription</td>
                <td class="px-4 py-2 text-sm text-gray-600">Evaluation Copy</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Adobe PDF</td>
                <td class="px-4 py-2 text-sm text-gray-600">Perpetual</td>
                <td class="px-4 py-2 text-sm text-gray-600">Subscription</td>
                <td class="px-4 py-2 text-sm text-gray-600">Evaluation Copy</td>
              </tr>
              <!-- Add more rows as needed -->
            </tbody>
          </table>

          <table class="table-auto w-full border border-gray-200 mt-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-bold text-gray-700" colspan="4">
                  MONITOR & UPS
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Monitor 1 Brand & Model</td>
                <td class="px-4 py-2 text-sm text-gray-600">null</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Monitor 1 S/N</td>
                <td class="px-4 py-2 text-sm text-gray-600">null</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">QR Code</td>
                <td class="px-4 py-2 text-sm text-gray-600">4APLAGICT-00008</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Bundle | Property No.</td>
                <td class="px-4 py-2 text-sm text-gray-600">null</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Accountable Person</td>
                <td class="px-4 py-2 text-sm text-gray-600">As Seen in PN: null</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">AU</td>
                <td class="px-4 py-2 text-sm text-gray-600">null</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Monitor 2 Brand & Model</td>
                <td class="px-4 py-2 text-sm text-gray-600">null</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Monitor 2 S/N</td>
                <td class="px-4 py-2 text-sm text-gray-600">null</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">QR Code</td>
                <td class="px-4 py-2 text-sm text-gray-600">4APLAGICT-00009</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Bundle | Property No.</td>
                <td class="px-4 py-2 text-sm text-gray-600">null</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Accountable Person</td>
                <td class="px-4 py-2 text-sm text-gray-600">As Seen in PN: null</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">AU</td>
                <td class="px-4 py-2 text-sm text-gray-600">null</td>
              </tr>
            </tbody>
          </table>

          <table class="table-auto w-full border border-gray-200 mt-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-bold text-gray-700" colspan="4">UPS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Accountable Person</td>
                <td class="px-4 py-2 text-sm text-gray-600">Mark Kim Sacluti</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">QR Code</td>
                <td class="px-4 py-2 text-sm text-gray-600">4APLWD2024</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Property No</td>
                <td class="px-4 py-2 text-sm text-gray-600">SEF6565W</td>
                <td class="px-4 py-2 text-sm font-medium text-gray-700">Serial No</td>
                <td class="px-4 py-2 text-sm text-gray-600">SEF6565W</td>
              </tr>

              <!-- Add more rows as needed -->
            </tbody>
          </table>
         
        </div>
        <div class="flex justify-right items-right">
            <Button severity="danger" label="Back" @click="closeModal" class=" mr-4" />
            <Button severity="teal" label="Print" class=" mr-4" />
            <Button severity="info" label="Submit" class=" mr-4" />
          </div>
        <!-- Display controlNo for debugging -->
      </div>
    </div>
  </div>
</template>
