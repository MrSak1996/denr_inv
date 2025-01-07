<template>
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-labelledby="reserve-control-no"
      aria-modal="true"
    >
      <div
        class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-lg w-full max-w-2xl mx-4 lg:mx-auto transition-transform duration-300 transform scale-100"
      >
        <!-- Modal Header -->
        <div class="flex justify-between items-center py-4 px-6 border-b dark:border-neutral-700">
          <QRCodeScanner @qr-scanned="updateQrValue" readonly />
        </div>
  
        <!-- Modal Body -->
        <div class="flex flex-col justify-center items-center py-2 px-2">
          <Button @click="closeModal" severity="info" label="Close" icon="pi pi-undo" class="mt-2" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, defineComponent } from 'vue'
  import QRCodeScanner from '../QRCodeScanner.vue'
  
  export default defineComponent({
    name: 'ModalReserved',
    components: { QRCodeScanner },
    props: {
      controlNo: {
        type: String,
        required: true
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      filters: {
        type: Object,
        required: true // Expecting the filters object from the parent
      }
    },
    emits: ['close', 'qr-scanned'],
    setup(props, { emit }) {
      const qrValue = ref('') // Declare and initialize the reactive variable
  
      function updateQrValue(value) {
        qrValue.value = value // Update with the new value
        props.filters.global.value = value // Update the filter in the parent
        emit('qr-scanned', value) // Emit the QR value to parent component
      }
  
      const closeModal = () => {
        emit('close')
      }
  
      return {
        closeModal,
        updateQrValue
      }
    }
  })
  </script>
  