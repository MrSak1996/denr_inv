<script setup>
import { ref, computed, onMounted } from 'vue'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { generateQRCodeWithLogo, formatQRCodeText } from './qrCodeUtils.js'
import { useApi } from '@/composables/useApi'
import api from '../../../../laravel-backend/resources/js/axiosInstance.ts'

const { qr_code_temp, getQRCodeTemp, getQRData, qr_opts } = useApi()
const baseNumber = ref(1)
const quantity = ref(10)
const generating = ref(false)
const progress = ref(0)
const error = ref('')
const selectedQrCodes = ref([]) // Store selected QR code options

// Set a default logo URL
const logoUrl = ref(new URL('../../../assets/images/logo/denr_logo.png', import.meta.url).href)

const totalCodes = computed(() => quantity.value)

const generateQRCodes = async () => {
  if (selectedQrCodes.value.length === 0) {
    error.value = 'Please select at least one QR code option'
    return
  }

  if (quantity.value <= 0) {
    error.value = 'Quantity must be greater than 0'
    return
  }

  if (quantity.value > 1000) {
    error.value = 'Maximum quantity exceeded (limit: 1000 codes)'
    return
  }

  if (baseNumber.value < 1 || baseNumber.value > 99) {
    error.value = 'Base number must be between 1 and 99'
    return
  }

  error.value = ''
  generating.value = true
  progress.value = 0

  try {
    const zip = new JSZip()

    for (const selected of selectedQrCodes.value) {
      for (let i = 0; i < quantity.value; i++) {
        const text = formatQRCodeText(selected.name, baseNumber.value, i + 1)
        const qrCode = await generateQRCodeWithLogo(text, logoUrl.value)

        const imageData = qrCode.split(',')[1]
        zip.file(`${text}.png`, imageData, { base64: true })

        progress.value = ((i + 1) / (quantity.value * selectedQrCodes.value.length)) * 100
      }
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `QRCode.zip`)
  } catch (err) {
    error.value = 'Error generating QR codes'
    console.error(err)
  } finally {
    generating.value = false
    progress.value = 0
  }
}

const emit = defineEmits(['close', 'proceed'])

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const closeModal = () => {
  emit('close')
}

onMounted(() => {
  getQRCodeTemp()
  getQRData()
})
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
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl w-full max-w-lg mx-4 transition-transform duration-500 transform"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
        <h3 class="text-lg font-semibold">Generate QR Code</h3>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
        >
          ✖
        </button>
      </div>

      <div class="qr-batch-generator">
        <div class="input-section">
          <div
            class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            Please select at least one option from the dropdown to generate its respective QR code.
            Available options: <strong>4AICT0001, 4AICT0002, 4AICT0003</strong>.
          </div>
          <label for="baseNumber">List of QR Code Generated:</label>
          <MultiSelect
            display="chip"
            v-model="selectedQrCodes"
            :options="qr_opts"
            optionLabel="name"
            filter
            placeholder="Select Cities"
            :maxSelectedLabels="3"
            class="w-full"
          />
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <!-- <div class="preview">
          <p>Will generate {{ totalCodes }} QR codes</p>
          <p>
            Format: {{ qr_code_temp }}0001 to {{ qr_code_temp
            }}{{ String(baseNumber).padStart(2, '0') }}{{ String(quantity).padStart(3, '0') }}
          </p>
        </div> -->

        <div class="actions">
          <button @click="generateQRCodes" :disabled="generating" class="generate-btn">
            {{ generating ? 'Generating...' : 'Generate QR Codes' }}
          </button>
        </div>

        <div v-if="generating" class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          <span class="progress-text">{{ Math.round(progress) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-batch-generator {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.number-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #2c3e50;
}

input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.logo-preview {
  text-align: center;
  margin-top: 1rem;
}

.logo-img {
  width: 100px;
  height: auto;
  margin-top: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.error {
  color: #dc3545;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
}

.generate-btn {
  background-color: #0f766e;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

.generate-btn:hover:not(:disabled) {
  background-color: #3aa876;
}

.generate-btn:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}

.progress-bar {
  margin-top: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  height: 20px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  background-color: #42b883;
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
