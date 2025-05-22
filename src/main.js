import './assets/css/satoshi.css';
import './assets/css/style.css';
import "primeicons/primeicons.css";
// import 'jsvectormap/dist/maps/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueApexCharts from 'vue3-apexcharts';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';
import App from './App.vue';
import router from './router';
import QrcodeVue from 'qrcode.vue'; // Import the QRCode component
import { DataTable } from 'primevue';
import MultiSelect from 'primevue/multiselect';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import Select from 'primevue/select';
import Checkbox from 'primevue/checkbox';
import Badge from 'primevue/badge';
import Divider from 'primevue/divider';
import Fieldset from 'primevue/fieldset';
import FloatLabel from 'primevue/floatlabel';
import InputNumber from 'primevue/inputnumber';
import Toast from 'primevue/toast';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tab from 'primevue/tab';
import RadioButton from 'primevue/radiobutton';
import Textarea from 'primevue/textarea';
import FocusTrap from 'primevue/focustrap';
import DataStatsOne from './components/DataStats/DataStatsOne.vue';
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// Global registration of the QRCode component
app.component('DataStatsOne', DataStatsOne);
app.component('QrcodeVue', QrcodeVue);
app.component('DataTable', DataTable);
app.component('BreadcrumbDefault', BreadcrumbDefault);
app.component('DefaultLayout', DefaultLayout);
app.component('Column', Column);
app.component('InputText', InputText);
app.component('Button', Button);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('Dialog', Dialog);
app.component('Tag', Tag);
app.component('Select', Select);
app.component('MultiSelect', MultiSelect);
app.component('Checkbox', Checkbox);
app.component('Badge', Badge);
app.component('Divider', Divider);
app.component('Fieldset', Fieldset);
app.component('FloatLabel', FloatLabel);
app.component('InputNumber', InputNumber);
app.component('Toast', Toast);
app.component('Tabs', Tabs);
app.component('TabList', TabList);
app.component('TabPanels', TabPanels);
app.component('TabPanel', TabPanel);
app.component('Tab', Tab);
app.component('Textarea', Textarea);
app.component('RadioButton', RadioButton);
app.directive('focustrap', FocusTrap);
app.use(pinia);
app.use(ToastService);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false || 'none',
        }
    }
});
app.use(router);
app.use(VueApexCharts);
app.mount('#app');
