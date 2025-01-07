<script setup>
import { ref, onMounted } from 'vue'
import { QrcodeStream } from 'vue3-qrcode-reader'

// Reactive variables
const qrVal = ref('')
const error = ref('')
const showScanConfirmation = ref(false)
const scannedResults = ref([])
const paused = ref(false)

// Emit to parent
const emit = defineEmits(['qr-scanned'])

// Function to handle QR code decoding
const handleDecode = (result) => {
  qrVal.value = result
  scannedResults.value.push(result) // Store decoded QR codes
  emit('qr-scanned', result) // Emit to parent
  console.log('Scanned QR Codes:', scannedResults.value)
}

// Camera event handlers
const onCameraOn = () => {
  paused.value = false
  showScanConfirmation.value = false
}

const onCameraOff = () => {
  paused.value = true
  showScanConfirmation.value = true
}

// Function to draw an outline around detected QR code
const drawOutline = (decodeData, context) => {
  const points = []
  for (const k in decodeData) {
    if (['topLeftCorner', 'topRightCorner', 'bottomRightCorner', 'bottomLeftCorner'].includes(k)) {
      points.push(decodeData[k])
    }
  }
  context.lineWidth = 5
  context.strokeStyle = 'green'
  context.beginPath()
  context.moveTo(points[0].x, points[0].y)
  points.forEach(({ x, y }) => context.lineTo(x, y))
  context.closePath()
  context.stroke()
}

// Request camera access explicitly
const requestCameraPermission = async () => {
  try {
    // Prompt the user for camera access
    await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { ideal: "environment" }, // Use "user" for front camera and "environment" for back camera
          },
    })
    console.log('Camera access granted.')
  } catch (err) {
    // If permission is denied, display an error
    error.value = 'Camera access denied. Please allow camera access in your browser settings.'
    console.error('Error accessing camera:', err)
  }
}

// Lifecycle hook
onMounted(() => {
  requestCameraPermission()
})
</script>

<template>
  <div class="scanner-container">
    <!-- Show error message if camera access is denied -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <p>Please enable camera access in your browser settings.</p>
    </div>

    <div v-else class="scanner">

      <!-- QR Code Scanner -->
      <qrcode-stream
        @camera-on="onCameraOn"
        @camera-off="onCameraOff"
        @decode="handleDecode"
        :track="drawOutline"
        :paused="paused"
      >
        <div v-show="showScanConfirmation" class="scan-confirmation">
          <img src="../../assets/images/logo/denr_logo.png" alt="Checkmark" width="128" />
        </div>
      </qrcode-stream>

      <!-- Display the list of scanned QR codes -->
      <div v-if="scannedResults.length" class="scanned-results">
        <ul>
          <li v-for="(code, index) in scannedResults" :key="index">{{ code }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.decode-result {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.scanned-results {
  margin-top: 1rem;
}

.scanned-results ul {
  list-style: none;
  padding: 0;
}

.scanned-results li {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.scan-confirmation {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 20px;
}
</style>
