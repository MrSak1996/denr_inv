<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { generateQRCodeWithLogo, formatQRCodeText } from './qrCodeUtils.js'

const baseNumber = ref(1)
const quantity = ref(10)
const logoUrl = ref('')
const generating = ref(false)
const progress = ref(0)
const error = ref('')

const totalCodes = computed(() => quantity.value)

const handleLogoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      logoUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const generateQRCodes = async () => {
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

    for (let i = 0; i < quantity.value; i++) {
      const text = formatQRCodeText(baseNumber.value, i + 1)
      const qrCode = await generateQRCodeWithLogo(text, logoUrl.value)

      const imageData = qrCode.split(',')[1]
      zip.file(`${text}.png`, imageData, { base64: true })

      progress.value = ((i + 1) / quantity.value) * 100
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `4AICT-${String(baseNumber.value).padStart(2, '0')}-batch.zip`)
  } catch (err) {
    error.value = 'Error generating QR codes'
    console.error(err)
  } finally {
    generating.value = false
    progress.value = 0
  }
}

// Define props
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
        <h3 class="text-lg font-semibold">Gerate QR Code</h3>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400"
        >
          ✖
        </button>
      </div>

      <div class="qr-batch-generator">
        <div class="input-section">
          <div class="number-inputs">
            <div class="input-group">
              <label for="baseNumber">Base Number (01-99)</label>
              <input
                id="baseNumber"
                type="number"
                v-model.number="baseNumber"
                min="1"
                max="99"
                :disabled="generating"
              />
            </div>
            <div class="input-group">
              <label for="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                v-model.number="quantity"
                min="1"
                :disabled="generating"
              />
            </div>
          </div>

          <div class="logo-input">
            <label for="logo" class="logo-label">Custom Logo (optional)</label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              @change="handleLogoChange"
              class="logo-file-input"
              :disabled="generating"
            />
          </div>
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <div class="preview">
          <p>Will generate {{ totalCodes }} QR codes</p>
          <p>
            Format: 4AICT-{{ String(baseNumber).padStart(2, '0') }}-001 to 4AICT-{{
              String(baseNumber).padStart(2, '0')
            }}-{{ String(quantity).padStart(3, '0') }}
          </p>
        </div>

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

.logo-input {
  margin-top: 1rem;
}

.logo-file-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
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
  background-color: #42b883;
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
