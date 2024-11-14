import './assets/css/satoshi.css'
import './assets/css/style.css'
import "primeicons/primeicons.css";
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura';
import App from './App.vue'
import router from './router'
import store from './store'  // Ensure the store is imported
import QrcodeVue from 'qrcode.vue'  // Import the QRCode component

const app = createApp(App)

// Global registration of the QRCode component
app.component('QrcodeVue', QrcodeVue)

app.use(createPinia())
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
        darkModeSelector: false || 'none',
    }
}
})
app.use(store)
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
