import './assets/css/satoshi.css'
import './assets/css/style.css'
import "primeicons/primeicons.css";

import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Lara from '@primevue/themes/lara';

import App from './App.vue'
import router from './router'
import store from './store'  // Ensure the store is imported

const app = createApp(App)

app.use(createPinia())
app.use(ToastService)
app.use(PrimeVue, {
    theme: {
        preset: Lara
    }
});
app.use(store)
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
