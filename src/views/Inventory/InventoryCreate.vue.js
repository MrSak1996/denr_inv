import { onMounted, ref, computed, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useApi } from '@/composables/useApi';
import { useForm } from '@/composables/useForm';
import api from '@/api/axiosInstance';
import modal_software from './modal/modal_software.vue';
import modal_transfer_item from './modal/modal_transfer_item.vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import Modal_msoffice from './modal/modal_msoffice.vue';
import { useInventory } from '@/composables/useInventory';
const { checkItemStatus } = useInventory();
// Page title and modal state
const pageTitle = ref('ICT Equipment');
// Toast, router, route, and store instances
const toast = useToast();
const router = useRouter();
const route = useRoute();
const store = useStore();
const isModalOpen = ref(!route.params.id);
const form_option = ref();
// Forms and API options
const { form, specs_form, software_form, peripheral_form } = useForm();
const { sex_opts, status_opts, division_opts, section_opts, work_nature, equipment_type, range_category, employment_opts, capacity_opts, ram_opts, ram_capacity_opts, getControlNo, getDivision, getNatureWork, getEquipment, getRangeCategory, getRamTypes, getEmploymentType, isLoading, currentMessage, startProgress, completeProgress, progress } = useApi();
const sameAsAccountable = ref(false);
const isButtonDisabled = ref(false);
const errors = ref({});
let selectedNetwork = ref(null);
let selectedGPU = ref(null);
let selectedWireless = ref(null);
const selectedSoftware = ref({});
let software = ref([]);
const item_status = ref('');
const isVisible = ref(false);
const openReviewForm = ref(false);
const isMicrosoftOffice = ref(false);
const modalData = ref('');
const role_id = ref(0);
const isDedicatedSelected = computed(() => selectedGPU.value === '2');
const isWirelessSelected = computed(() => selectedNetwork.value === '2');
const image = ref(null);
const uploadSuccess = ref(false);
const uploadError = ref(null);
const userId = !route.query.id ? localStorage.getItem('userId') : route.query.id;
const item_id = ref(null);
const api_token = route.query.api_token;
const openTransferModal = ref(false);
const loading = ref(false);
const showForm = ref(false);
const softwareName = ref('');
const softwareCategory = ref('');
const user_id = route.params.id ? route.params.id : route.query.id;
// Reactive references
const serialNo = ref('PS-2025-09-146');
const propertyNo = ref('');
const duplicates = ref([]);
const records = ref([]);
const message = ref('');
// Functions
const checkUrlAndDisableButton = () => {
    const url = window.location.href;
    const regex = /\/create\/\d+/;
    isButtonDisabled.value = regex.test(url);
};
const btnBack = () => {
    router.push({ path: '/inventory' });
};
// Retrieve data from store after saving
const retrieveData = async () => {
    const savedData = store.state.formData;
    if (savedData) {
        Object.assign(form, savedData);
    }
};
// Check year and update shelf life
const checkYear = () => {
    const yearValue = form.year_acquired;
    if (yearValue === 'N/A' || yearValue === 'n/a') {
        form.shelf_life = 'N/A';
    }
    else {
        const year = parseInt(yearValue, 10);
        form.shelf_life = !isNaN(year) ? (year <= 2017 ? 'Beyond 5 years' : 'Within 5 years') : '';
    }
};
const network_type = ref([
    { name: 'LAN', key: '1' },
    { name: 'Wireless', key: '2' },
    { name: 'Both', key: '3' }
]);
const gpu_type = ref([
    { name: 'Built-in', key: '1' },
    { name: 'Dedicated', key: '2' }
]);
const software_installed = ref([
    { title: 'Operating System', key: 'operating_system' },
    { title: 'Microsoft Office', key: 'ms_office' },
    { title: 'ARCGIS', key: 'arcgis' },
    { title: 'Adobe PDF', key: 'adobe_pdf' },
    { title: 'Adobe Photoshop', key: 'adobe_photoshop' },
    { title: 'Autocad', key: 'autocad' }
]);
const remarksMap = {
    perpetual: '1',
    subscription: '2',
    evaluation: '3'
};
const reverseRemarksMap = Object.fromEntries(Object.entries(remarksMap).map(([key, val]) => [val, key]));
const onRadioChange = (key, option) => {
    modalData.value = `${key}: ${option}`;
    if (key == 'operating_system') {
        isVisible.value = true; // Show the modal
    }
    else if (key == 'ms_office') {
        isMicrosoftOffice.value = true;
    }
};
const transferItem = async (form_val) => {
    openTransferModal.value = true;
    form_option.value = form_val; // Corrected assignment
};
// GENERAL INFORMATION
const saveGeneralInfo = async () => {
    try {
        errors.value = {};
        const propertyNo = form.property_no || '';
        const serialNo = form.serial_no || '';
        // ✅ Check for duplicates first
        if (checkDuplicates(propertyNo, serialNo)) {
            return;
        }
        const requestData = {
            ...form,
            registered_loc: role_id.value,
            id: userId
        };
        const response = await api.post('/post_insert_gen_info', requestData);
        setTimeout(() => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data saved successfully!',
                life: 3000
            });
            const id = response.data.id;
            router.push({
                name: 'InventoryEdit',
                params: { id: id },
                query: {
                    item_id: route.query.item_id,
                    api_token: localStorage.getItem('api_token')
                }
            });
            // location.reload()
        }, 1000);
    }
    catch (error) {
        console.log(error);
    }
};
//SPECS
const saveSpecsInfo = async () => {
    try {
        errors.value = {};
        // ✅ Extract from route params instead of query
        const controlId = route.params.id || route.query.item_id || null;
        const requestData = {
            ...specs_form,
            control_id: controlId,
            specs_net: selectedNetwork.value,
            specs_gpu: selectedGPU.value,
            specs_net_iswireless: selectedWireless.value
        };
        const response = await api.post('/post_insert_specs_info', requestData);
        setTimeout(() => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data saved successfully!',
                life: 3000
            });
            const id = response.data.id;
            // router.push({ name: 'Inventory', params: { id }, query: { api_token: localStorage.getItem('api_token') } })
        }, 1000);
    }
    catch (error) {
        console.log(error);
    }
};
//SOFTWARE INSTALLED
const saveSoftwareInfo = async () => {
    try {
        errors.value = {};
        const controlId = route.params.id || route.query.item_id || null;
        // Prepare the request data by combining form data with selected software options
        const requestData = {
            selectedSoftware: Object.fromEntries(Object.entries(selectedSoftware.value).map(([key, value]) => [
                key,
                remarksMap[value] || null
            ])),
            control_id: controlId,
            softwareNameVal: form.softwareName,
            softwareCategoryVal: form.softwareCategory
        };
        // Make the API call
        const response = await api.post('/post_insert_software', requestData);
        // Notify the user and redirect after successful save
        setTimeout(() => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data saved successfully!',
                life: 3000
            });
            // Redirect to the edit page with the new ID
            const id = response.data.id;
            // router.push({
            //   name: 'Inventory',
            //   params: { id },
            //   query: { api_token: localStorage.getItem('api_token') }
            // })
        }, 1000);
    }
    catch (error) {
        console.log(error);
    }
};
//PERIPHERALS
const savePeripheralInfo = async () => {
    try {
        errors.value = {};
        const controlId = route.params.id || route.query.item_id || null;
        const requestData = {
            ...peripheral_form,
            monitor1Model: peripheral_form.monitor1Model,
            control_id: controlId,
            id: userId
        };
        const response = await api.post('/post_insert_peripheral', requestData);
        setTimeout(() => {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Data saved successfully!',
                life: 3000
            });
            const id = response.data.id;
            // router.push({
            //   name: 'Inventory',
            //   params: { id },
            //   query: { item_id: route.query.item_id, api_token: localStorage.getItem('api_token') }
            // })
        }, 1000);
    }
    catch (error) {
        console.log(error);
    }
};
// RETRIEVE DATA USING DATABASE
const retrieveDataviaAPI = async () => {
    const id = route.params.id;
    if (id) {
        try {
            startProgress();
            const response = await api.get(`/retriveDataviaAPI?id=${id}`);
            Object.assign(form, response.data[0]);
            loading.value = false;
            completeProgress();
        }
        catch (error) {
            console.error('Error retrieving data:', error);
        }
    }
};
const retrieveSpecsData = async () => {
    const id = route.params.id;
    if (!id) {
        console.warn('⚠️ No ID found in route params.');
        return;
    }
    try {
        const response = await api.get(`/retrieveSpecsData?id=${id}`);
        // ✅ Check if response and data exist
        const data = response.data && Array.isArray(response.data) ? response.data[0] : null;
        if (data) {
            selectedNetwork.value = String(data.specs_net || '');
            selectedGPU.value = String(data.specs_gpu || '');
            selectedWireless.value = String(data.specs_net_iswireless || '');
            Object.assign(specs_form, data);
        }
        else {
            // Optional: clear existing form values
            Object.assign(specs_form, {
                specs_net: '',
                specs_gpu: '',
                specs_net_iswireless: ''
            });
        }
    }
    catch (error) {
        console.error('❌ Error retrieving data:', error);
    }
};
const retrieveSoftwareData = async () => {
    const id = route.query.item_id;
    if (id) {
        try {
            const response = await api.get(`/retrieveSoftwareData?id=${id}`);
            software.value = response.data;
            console.log(software.value);
            response.data.forEach((item) => {
                // Convert numeric remark -> radio option string
                const option = reverseRemarksMap[item.remarks];
                if (option) {
                    selectedSoftware.value[item.software] = option;
                }
            });
        }
        catch (error) {
            console.error('Error retrieving data:', error);
        }
    }
};
const retrievePeripheralsData = async () => {
    const id = route.query.item_id;
    if (id) {
        try {
            const response = await api.get(`/retrievePeripheralsData?id=${id}`);
            Object.assign(peripheral_form, response.data[0]);
        }
        catch (error) {
            console.error('Error retrieving data:', error);
        }
    }
};
const generateQRCode = async (form, tab_form, item_id, userId) => {
    item_id = Array.isArray(route.query?.gen_id)
        ? route.query.gen_id[0]
        : route.query?.gen_id ??
            (Array.isArray(route.query?.item_id) ? route.query.item_id[0] : route.query?.item_id);
    try {
        if (tab_form === 'genForm') {
            await saveGeneralInfo();
            try {
                const res = await api.get(`/generateQRCode?id=${userId}&item_id=${item_id}&control_no=${form.control_no}&tab_form=${tab_form}`);
                let controlNo = res.data?.control_no || '0';
                form.qr_code = String(controlNo).padStart(4, '0');
            }
            catch (error) {
                console.error('Error fetching QR Code:', error);
            }
        }
        else if (tab_form === 'p1Form') {
            if (!item_id) {
                console.error('item_id is undefined or null before API call', item_id);
                return;
            }
            await savePeripheralInfo();
            try {
                const res = await api.get(`/generateQRCode?id=${userId}&item_id=${item_id}&tab_form=${tab_form}` // Fixed typo
                );
                let controlNo = res.data?.control_no || '0';
                peripheral_form.monitor1QrCode = String(controlNo).padStart(4, '0');
                retrievePeripheralsData();
            }
            catch (error) {
                console.error('Error fetching QR Code:', error);
            }
        }
        else if (tab_form === 'p2Form') {
            if (!item_id) {
                console.error('item_id is undefined or null before API call', item_id);
                return;
            }
            await savePeripheralInfo();
            try {
                const res = await api.get(`/generateQRCode?id=${userId}&item_id=${item_id}&tab_form=${tab_form}` // Fixed typo
                );
                let controlNo = res.data?.control_no || '0';
                peripheral_form.monitor2QrCode = String(controlNo).padStart(4, '0');
                retrievePeripheralsData();
            }
            catch (error) {
                console.error('Error fetching QR Code:', error);
            }
        }
        else if (tab_form === 'upsForm') {
            if (!item_id) {
                console.error('item_id is undefined or null before API call', item_id);
                return;
            }
            await savePeripheralInfo();
            try {
                const res = await api.get(`/generateQRCode?id=${userId}&item_id=${item_id}&tab_form=${tab_form}` // Fixed typo
                );
                let controlNo = res.data?.control_no || '0';
                peripheral_form.ups_qr_code = String(controlNo).padStart(4, '0');
                retrievePeripheralsData();
            }
            catch (error) {
                console.error('Error fetching QR Code:', error);
            }
        }
        else {
            throw new Error('Invalid tab_form provided');
        }
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'QR code generated and data saved successfully!',
            life: 3000
        });
        // Retrieve peripherals data if applicable
        retrievePeripheralsData();
    }
    catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to generate QR code. Please try again.',
            life: 3000
        });
    }
};
const status_checker = async () => {
    try {
        const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
        const res = await checkItemStatus(id);
        item_status.value = res;
    }
    catch (error) {
        console.log(error);
    }
};
const closeModal = () => {
    isVisible.value = false;
    isMicrosoftOffice.value = false; // Close the modal by setting isLoading to false
};
const fetchLatestID = async () => {
    try {
        const response = await api.get(`/fetchLatestID`);
        updateIdInURL(response.data.id);
    }
    catch (error) {
        console.log(error);
    }
};
const updateIdInURL = (newId) => {
    if (route.query.option == 'scan') {
        return null;
    }
    else {
        router.replace({
            query: {
                ...route.query, // Keep existing query params
                gen_id: newId // Change only the 'id' param
            }
        });
    }
};
const formattedCost = computed(() => {
    let num = form.acquisition_cost;
    return num
        ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(num))
        : '₱0.00';
});
watch(sameAsAccountable, (newVal) => {
    if (newVal) {
        form.actual_user = form.acct_person;
        form.selectedActualDivision = form.selectedAcctDivision;
    }
    else {
        form.actual_user = '';
        form.selectedActualDivision = '';
    }
});
const isComputerType = computed(() => {
    const selected = equipment_type.value.find((e) => e.id === Number(form.selectedEquipmentType))?.id;
    return selected === 1 || selected === 2;
});
const toggleForm = () => {
    showForm.value = !showForm.value;
};
// Fetch existing serials and property numbers
const fetchSerialPropertyData = async () => {
    try {
        const response = await api.get('/getSerialProno');
        records.value = response.data.data; // ✅ Access the array inside "data"
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
};
// Check for duplicates across full dataset
const checkDuplicates = (propertyNo, serialNo) => {
    if (!records.value || records.value.length === 0) {
        console.warn('⚠ No data loaded yet.');
        return false;
    }
    // ✅ Trim + lowercase input values safely
    const property = propertyNo?.trim().toLowerCase() || '';
    const serial = serialNo?.trim().toLowerCase() || '';
    // ✅ Ignore check if either property or serial is empty
    if (!property || !serial) {
        console.warn('⚠ Skipping duplicate check because Property No or Serial No is empty.');
        return false;
    }
    // ✅ Normalize dataset
    const data = records.value.map(item => ({
        property_no: item.property_no?.trim().toLowerCase() || '',
        serial_no: item.serial_no?.trim().toLowerCase() || ''
    }));
    // ✅ Check if both property_no and serial_no combination already exists
    const isDuplicate = data.some(item => item.property_no === property && item.serial_no === serial);
    if (isDuplicate) {
        toast.add({
            severity: 'error',
            summary: 'Duplicate Found',
            detail: `⚠️ The combination of Property No: "${propertyNo}" and Serial No: "${serialNo}" already exists.`,
            life: 5000
        });
        return true;
    }
    // (Optional) You can remove this toast if you only want to show when duplicate found
    toast.add({
        severity: 'success',
        summary: 'No Duplicates',
        detail: '✅ No duplicates found in the dataset.',
        life: 3000
    });
    return false;
};
onMounted(() => {
    const id = route.params.id;
    if (!id) {
        getControlNo(form, userId ? Number(userId) : 0);
        setTimeout(() => {
            // toast.add({
            //   severity: 'success',
            //   summary: 'Success',
            //   detail: 'Control Number saved successfully!',
            //   life: 3000
            // })
            // window.location.href =
            //   '/inventory/create/' + id + '?api_token=' + localStorage.getItem('api_token')
        }, 1000);
    }
    retrieveDataviaAPI(), retrieveSpecsData(), retrieveSoftwareData(), retrievePeripheralsData();
    fetchSerialPropertyData();
    // fetchLatestID()
    status_checker();
    getDivision();
    getNatureWork();
    getEquipment();
    getRangeCategory();
    getEmploymentType();
    getRamTypes();
    // retrieveData() wag muna ilagay
    checkUrlAndDisableButton();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Toast;
/** @type {[typeof __VLS_components.Toast, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_4 = {}.DefaultLayout;
/** @type {[typeof __VLS_components.DefaultLayout, typeof __VLS_components.DefaultLayout, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
/** @type {[typeof BreadcrumbDefault, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(BreadcrumbDefault, new BreadcrumbDefault({
    pageTitle: (__VLS_ctx.pageTitle),
}));
const __VLS_9 = __VLS_8({
    pageTitle: (__VLS_ctx.pageTitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
if (__VLS_ctx.isVisible) {
    /** @type {[typeof modal_software, ]} */ ;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent(modal_software, new modal_software({
        ...{ 'onClose': {} },
        isLoading: (__VLS_ctx.isVisible),
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onClose': {} },
        isLoading: (__VLS_ctx.isVisible),
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_14;
    let __VLS_15;
    let __VLS_16;
    const __VLS_17 = {
        onClose: (__VLS_ctx.closeModal)
    };
    var __VLS_13;
}
if (__VLS_ctx.openTransferModal) {
    /** @type {[typeof modal_transfer_item, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(modal_transfer_item, new modal_transfer_item({
        ...{ 'onClose': {} },
        form: (__VLS_ctx.form_option),
        openModal: (__VLS_ctx.openTransferModal),
        gen_info_id: (__VLS_ctx.route.params.id),
        division: (__VLS_ctx.division_opts),
        status: (__VLS_ctx.status_opts),
        userID: (__VLS_ctx.userId),
        inventory_id: (__VLS_ctx.form.selectedEquipmentType ?? 0),
        acct_person: (__VLS_ctx.form.acct_person),
        actual_user: (__VLS_ctx.form.actual_user),
        monitor1AccountPersonInPN: (__VLS_ctx.peripheral_form.monitor1AccountPersonInPN),
        monitor1ActualUser: (__VLS_ctx.peripheral_form.monitor1ActualUser),
        monitor1QrCode: (__VLS_ctx.peripheral_form.monitor1QrCode),
        monitor1Model: (__VLS_ctx.peripheral_form.monitor1Model),
        monitor1BrandModel: (__VLS_ctx.peripheral_form.monitor1BrandModel),
        form_option: (__VLS_ctx.form_option),
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClose': {} },
        form: (__VLS_ctx.form_option),
        openModal: (__VLS_ctx.openTransferModal),
        gen_info_id: (__VLS_ctx.route.params.id),
        division: (__VLS_ctx.division_opts),
        status: (__VLS_ctx.status_opts),
        userID: (__VLS_ctx.userId),
        inventory_id: (__VLS_ctx.form.selectedEquipmentType ?? 0),
        acct_person: (__VLS_ctx.form.acct_person),
        actual_user: (__VLS_ctx.form.actual_user),
        monitor1AccountPersonInPN: (__VLS_ctx.peripheral_form.monitor1AccountPersonInPN),
        monitor1ActualUser: (__VLS_ctx.peripheral_form.monitor1ActualUser),
        monitor1QrCode: (__VLS_ctx.peripheral_form.monitor1QrCode),
        monitor1Model: (__VLS_ctx.peripheral_form.monitor1Model),
        monitor1BrandModel: (__VLS_ctx.peripheral_form.monitor1BrandModel),
        form_option: (__VLS_ctx.form_option),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_21;
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openTransferModal))
                return;
            __VLS_ctx.openTransferModal = false;
        }
    };
    var __VLS_20;
}
if (__VLS_ctx.isMicrosoftOffice) {
    /** @type {[typeof Modal_msoffice, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(Modal_msoffice, new Modal_msoffice({
        ...{ 'onClose': {} },
        isLoading: (__VLS_ctx.isMicrosoftOffice),
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onClose': {} },
        isLoading: (__VLS_ctx.isMicrosoftOffice),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onClose: (__VLS_ctx.closeModal)
    };
    var __VLS_27;
}
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" },
        role: "dialog",
        tabindex: "-1",
        'aria-labelledby': "progress-modal",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl w-full max-w-4xl mx-4 lg:mx-auto transition-transform duration-500 transform" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "modal-content flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-semibold" },
    });
    (__VLS_ctx.currentMessage);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col justify-center items-center gap-x-2 py-6 px-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "w-full bg-gray-200 rounded-full h-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-teal-500 h-4 rounded-full transition-all" },
        ...{ style: ({ width: __VLS_ctx.progress + '%' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-2 text-gray-700 dark:text-gray-300" },
    });
    (__VLS_ctx.progress);
}
const __VLS_32 = {}.Tabs;
/** @type {[typeof __VLS_components.Tabs, typeof __VLS_components.Tabs, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    value: "0",
}));
const __VLS_34 = __VLS_33({
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.TabList;
/** @type {[typeof __VLS_components.TabList, typeof __VLS_components.TabList, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.Tab;
/** @type {[typeof __VLS_components.Tab, typeof __VLS_components.Tab, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    value: "0",
    as: "div",
    ...{ class: "flex items-center gap-2" },
}));
const __VLS_42 = __VLS_41({
    value: "0",
    as: "div",
    ...{ class: "flex items-center gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
    ...{ class: "pi pi-info-circle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-bold whitespace-nowrap" },
});
var __VLS_43;
const __VLS_44 = {}.Tab;
/** @type {[typeof __VLS_components.Tab, typeof __VLS_components.Tab, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    value: "1",
    as: "div",
    ...{ class: "flex items-center gap-2" },
    disabled: (!__VLS_ctx.isComputerType),
}));
const __VLS_46 = __VLS_45({
    value: "1",
    as: "div",
    ...{ class: "flex items-center gap-2" },
    disabled: (!__VLS_ctx.isComputerType),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
    ...{ class: "pi pi-folder" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-bold whitespace-nowrap" },
});
var __VLS_47;
const __VLS_48 = {}.Tab;
/** @type {[typeof __VLS_components.Tab, typeof __VLS_components.Tab, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    value: "2",
    as: "div",
    ...{ class: "flex items-center gap-2" },
    disabled: (!__VLS_ctx.isComputerType),
}));
const __VLS_50 = __VLS_49({
    value: "2",
    as: "div",
    ...{ class: "flex items-center gap-2" },
    disabled: (!__VLS_ctx.isComputerType),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
    ...{ class: "pi pi-code" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-bold whitespace-nowrap" },
});
var __VLS_51;
const __VLS_52 = {}.Tab;
/** @type {[typeof __VLS_components.Tab, typeof __VLS_components.Tab, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    value: "3",
    as: "div",
    ...{ class: "flex items-center gap-2" },
}));
const __VLS_54 = __VLS_53({
    value: "3",
    as: "div",
    ...{ class: "flex items-center gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
    ...{ class: "pi pi-desktop" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-bold whitespace-nowrap" },
});
var __VLS_55;
const __VLS_56 = {}.Button;
/** @type {[typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onClick': {} },
    label: "Check Duplicates",
    type: "submit",
    icon: "pi pi-verified",
    ...{ style: {} },
    severity: "primary",
    ...{ class: "mr-4 mb-4 btn-xs" },
}));
const __VLS_58 = __VLS_57({
    ...{ 'onClick': {} },
    label: "Check Duplicates",
    type: "submit",
    icon: "pi pi-verified",
    ...{ style: {} },
    severity: "primary",
    ...{ class: "mr-4 mb-4 btn-xs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onClick: (...[$event]) => {
        __VLS_ctx.checkDuplicates(__VLS_ctx.form.property_no, __VLS_ctx.form.serial_no);
    }
};
var __VLS_59;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-between items-center mt-2" },
});
var __VLS_39;
const __VLS_64 = {}.TabPanels;
/** @type {[typeof __VLS_components.TabPanels, typeof __VLS_components.TabPanels, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.TabPanel;
/** @type {[typeof __VLS_components.TabPanel, typeof __VLS_components.TabPanel, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    value: "0",
    as: "p",
    ...{ class: "m-0" },
}));
const __VLS_70 = __VLS_69({
    value: "0",
    as: "p",
    ...{ class: "m-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.saveGeneralInfo) },
});
const __VLS_72 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    legend: "Acountable Person Information",
    toggleable: (true),
}));
const __VLS_74 = __VLS_73({
    legend: "Acountable Person Information",
    toggleable: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group mt-4" },
});
const __VLS_76 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    modelValue: (__VLS_ctx.form.control_no),
    value: (__VLS_ctx.form.control_no),
    ...{ class: "w-full" },
    readonly: "true",
}));
const __VLS_82 = __VLS_81({
    modelValue: (__VLS_ctx.form.control_no),
    value: (__VLS_ctx.form.control_no),
    ...{ class: "w-full" },
    readonly: "true",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_79;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group mt-4" },
});
const __VLS_84 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    filter: true,
    modelValue: (__VLS_ctx.form.status),
    options: (__VLS_ctx.status_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Current Status",
    ...{ class: "w-full" },
}));
const __VLS_86 = __VLS_85({
    filter: true,
    modelValue: (__VLS_ctx.form.status),
    options: (__VLS_ctx.status_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Current Status",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-5 md:gap-6 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_88 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    id: "username",
    modelValue: (__VLS_ctx.form.acct_person),
    ...{ class: "w-full" },
}));
const __VLS_94 = __VLS_93({
    id: "username",
    modelValue: (__VLS_ctx.form.acct_person),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "username",
});
var __VLS_91;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_96 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({}));
const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedAcctWorkNature),
    options: (__VLS_ctx.work_nature),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Nature of Works",
    ...{ class: "w-full" },
}));
const __VLS_102 = __VLS_101({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedAcctWorkNature),
    options: (__VLS_ctx.work_nature),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Nature of Works",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
var __VLS_99;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_104 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    filter: true,
    modelValue: (__VLS_ctx.form.acct_sex),
    options: (__VLS_ctx.sex_opts),
    optionValue: "value",
    optionLabel: "name",
    placeholder: "Sex",
    ...{ class: "w-full" },
}));
const __VLS_106 = __VLS_105({
    filter: true,
    modelValue: (__VLS_ctx.form.acct_sex),
    options: (__VLS_ctx.sex_opts),
    optionValue: "value",
    optionLabel: "name",
    placeholder: "Sex",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_108 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    filter: true,
    modelValue: (__VLS_ctx.form.acct_employmentType),
    options: (__VLS_ctx.employment_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Employment Type",
    ...{ class: "w-full" },
}));
const __VLS_110 = __VLS_109({
    filter: true,
    modelValue: (__VLS_ctx.form.acct_employmentType),
    options: (__VLS_ctx.employment_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Employment Type",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_112 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedAcctDivision),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}));
const __VLS_114 = __VLS_113({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedAcctDivision),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_116 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({}));
const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ 'onInput': {} },
    id: "year_acquired",
    modelValue: (__VLS_ctx.form.year_acquired),
    ...{ class: "w-full" },
}));
const __VLS_122 = __VLS_121({
    ...{ 'onInput': {} },
    id: "year_acquired",
    modelValue: (__VLS_ctx.form.year_acquired),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_124;
let __VLS_125;
let __VLS_126;
const __VLS_127 = {
    onInput: (__VLS_ctx.checkYear)
};
var __VLS_123;
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "year_acquired",
});
var __VLS_119;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_128 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    id: "shelf_life",
    modelValue: (__VLS_ctx.form.shelf_life),
    ...{ class: "w-full" },
}));
const __VLS_134 = __VLS_133({
    id: "shelf_life",
    modelValue: (__VLS_ctx.form.shelf_life),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "shelf_life",
});
var __VLS_131;
var __VLS_75;
const __VLS_136 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    legend: "Actual User Information",
    toggleable: (true),
}));
const __VLS_138 = __VLS_137({
    legend: "Actual User Information",
    toggleable: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-5 md:gap-6 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_140 = {}.Checkbox;
/** @type {[typeof __VLS_components.Checkbox, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.sameAsAccountable),
    inputId: "sameAsAccountable",
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.sameAsAccountable),
    inputId: "sameAsAccountable",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "sameAsAccountable",
});
const __VLS_144 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    id: "username1",
    modelValue: (__VLS_ctx.form.actual_user),
    ...{ class: "w-full mt-8" },
}));
const __VLS_150 = __VLS_149({
    id: "username1",
    modelValue: (__VLS_ctx.form.actual_user),
    ...{ class: "w-full mt-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "username1",
    ...{ class: "mt-8" },
});
var __VLS_147;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mt-14 group" },
});
const __VLS_152 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedActualWorkNature),
    options: (__VLS_ctx.work_nature),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Nature of Works",
    ...{ class: "w-full" },
}));
const __VLS_154 = __VLS_153({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedActualWorkNature),
    options: (__VLS_ctx.work_nature),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Nature of Works",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mt-14 group" },
});
const __VLS_156 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    filter: true,
    modelValue: (__VLS_ctx.form.actual_sex),
    options: (__VLS_ctx.sex_opts),
    optionValue: "value",
    optionLabel: "name",
    placeholder: "Sex",
    ...{ class: "w-full" },
}));
const __VLS_158 = __VLS_157({
    filter: true,
    modelValue: (__VLS_ctx.form.actual_sex),
    options: (__VLS_ctx.sex_opts),
    optionValue: "value",
    optionLabel: "name",
    placeholder: "Sex",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mt-14 group" },
});
const __VLS_160 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    filter: true,
    modelValue: (__VLS_ctx.form.actual_employmentType),
    options: (__VLS_ctx.employment_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Employment Type",
    ...{ class: "w-full" },
}));
const __VLS_162 = __VLS_161({
    filter: true,
    modelValue: (__VLS_ctx.form.actual_employmentType),
    options: (__VLS_ctx.employment_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Employment Type",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mt-14 group" },
});
const __VLS_164 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedActualDivision),
    options: (__VLS_ctx.division_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Division",
    ...{ class: "w-full" },
}));
const __VLS_166 = __VLS_165({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedActualDivision),
    options: (__VLS_ctx.division_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Division",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
var __VLS_139;
const __VLS_168 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    legend: "Equipment Information",
    toggleable: (true),
}));
const __VLS_170 = __VLS_169({
    legend: "Equipment Information",
    toggleable: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-4 md:gap-6 mb-4 text-right" },
});
if (__VLS_ctx.form.qr_code) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative z-0 w-full mb-5 group" },
    });
    const __VLS_172 = {}.QrcodeVue;
    /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        value: (__VLS_ctx.form.qr_code),
    }));
    const __VLS_174 = __VLS_173({
        value: (__VLS_ctx.form.qr_code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-4 md:gap-6 mt-7" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full group" },
});
const __VLS_176 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    id: "qr_code",
    modelValue: (__VLS_ctx.form.qr_code),
    ...{ class: "w-full pr-16" },
}));
const __VLS_182 = __VLS_181({
    id: "qr_code",
    modelValue: (__VLS_ctx.form.qr_code),
    ...{ class: "w-full pr-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "qr_code",
});
var __VLS_179;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_184 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedEquipmentType),
    options: (__VLS_ctx.equipment_type),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Equipment Type",
    ...{ class: "w-full" },
}));
const __VLS_186 = __VLS_185({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedEquipmentType),
    options: (__VLS_ctx.equipment_type),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Equipment Type",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_188 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({}));
const __VLS_190 = __VLS_189({}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    id: "property_no",
    modelValue: (__VLS_ctx.form.property_no),
    ...{ class: "w-full" },
}));
const __VLS_194 = __VLS_193({
    id: "property_no",
    modelValue: (__VLS_ctx.form.property_no),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "property_no",
});
var __VLS_191;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_196 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedRangeCategory),
    options: (__VLS_ctx.range_category),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Range Category",
    ...{ class: "w-full" },
}));
const __VLS_198 = __VLS_197({
    filter: true,
    modelValue: (__VLS_ctx.form.selectedRangeCategory),
    options: (__VLS_ctx.range_category),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Range Category",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-4 md:gap-6 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_200 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({}));
const __VLS_202 = __VLS_201({}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    id: "brand",
    modelValue: (__VLS_ctx.form.brand),
    ...{ class: "w-full mt-4" },
}));
const __VLS_206 = __VLS_205({
    id: "brand",
    modelValue: (__VLS_ctx.form.brand),
    ...{ class: "w-full mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "brand",
    ...{ class: "mt-4" },
});
var __VLS_203;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_208 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({}));
const __VLS_210 = __VLS_209({}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    id: "model",
    modelValue: (__VLS_ctx.form.model),
    ...{ class: "w-full mt-4" },
}));
const __VLS_214 = __VLS_213({
    id: "model",
    modelValue: (__VLS_ctx.form.model),
    ...{ class: "w-full mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "model",
    ...{ class: "mt-4" },
});
var __VLS_211;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_216 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({}));
const __VLS_218 = __VLS_217({}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.InputNumber;
/** @type {[typeof __VLS_components.InputNumber, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    inputId: "currency-ph",
    prefix: "₱",
    id: "acquisition_cost",
    modelValue: (__VLS_ctx.form.acquisition_cost),
    ...{ class: "w-full mt-4" },
}));
const __VLS_222 = __VLS_221({
    inputId: "currency-ph",
    prefix: "₱",
    id: "acquisition_cost",
    modelValue: (__VLS_ctx.form.acquisition_cost),
    ...{ class: "w-full mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "aquisition_cost",
    ...{ class: "mt-4" },
});
var __VLS_219;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_224 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({}));
const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    id: "serial_no",
    modelValue: (__VLS_ctx.form.serial_no),
    ...{ class: "w-full mt-4" },
}));
const __VLS_230 = __VLS_229({
    id: "serial_no",
    modelValue: (__VLS_ctx.form.serial_no),
    ...{ class: "w-full mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "serial_no",
    ...{ class: "mt-4" },
});
var __VLS_227;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-1 md:gap-6 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_232 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({}));
const __VLS_234 = __VLS_233({}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.Textarea;
/** @type {[typeof __VLS_components.Textarea, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    id: "remarks",
    modelValue: (__VLS_ctx.form.remarks),
    rows: "5",
    cols: "172",
    ...{ style: {} },
}));
const __VLS_238 = __VLS_237({
    id: "remarks",
    modelValue: (__VLS_ctx.form.remarks),
    rows: "5",
    cols: "172",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "remarks",
});
var __VLS_235;
var __VLS_171;
const __VLS_240 = {}.Button;
/** @type {[typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    label: "Save",
    type: "submit",
    icon: "pi pi-save",
    severity: "primary",
    ...{ class: "mr-4 mt-4" },
}));
const __VLS_242 = __VLS_241({
    label: "Save",
    type: "submit",
    icon: "pi pi-save",
    severity: "primary",
    ...{ class: "mr-4 mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
var __VLS_71;
const __VLS_244 = {}.TabPanel;
/** @type {[typeof __VLS_components.TabPanel, typeof __VLS_components.TabPanel, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    value: "1",
    as: "p",
    ...{ class: "m-0" },
}));
const __VLS_246 = __VLS_245({
    value: "1",
    as: "p",
    ...{ class: "m-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.saveSpecsInfo) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-3 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_248 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({}));
const __VLS_250 = __VLS_249({}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
const __VLS_252 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    id: "processor",
    modelValue: (__VLS_ctx.specs_form.specs_processor),
    ...{ class: "w-full" },
}));
const __VLS_254 = __VLS_253({
    id: "processor",
    modelValue: (__VLS_ctx.specs_form.specs_processor),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "processor",
});
var __VLS_251;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_256 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({}));
const __VLS_258 = __VLS_257({}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
const __VLS_260 = {}.InputNumber;
/** @type {[typeof __VLS_components.InputNumber, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    id: "hdd",
    modelValue: (__VLS_ctx.specs_form.specs_hdd),
    ...{ class: "w-full" },
}));
const __VLS_262 = __VLS_261({
    id: "hdd",
    modelValue: (__VLS_ctx.specs_form.specs_hdd),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "hdd",
});
var __VLS_259;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_264 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    filter: true,
    modelValue: (__VLS_ctx.specs_form.specs_hdd_capacity),
    options: (__VLS_ctx.capacity_opts),
    optionValue: "value",
    optionLabel: "name",
    placeholder: "Capacity",
    ...{ class: "w-full" },
}));
const __VLS_266 = __VLS_265({
    filter: true,
    modelValue: (__VLS_ctx.specs_form.specs_hdd_capacity),
    options: (__VLS_ctx.capacity_opts),
    optionValue: "value",
    optionLabel: "name",
    placeholder: "Capacity",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-4 md:gap-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_268 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    filter: true,
    modelValue: (__VLS_ctx.specs_form.specs_ram),
    options: (__VLS_ctx.ram_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "RAM Type",
    ...{ class: "w-full" },
}));
const __VLS_270 = __VLS_269({
    filter: true,
    modelValue: (__VLS_ctx.specs_form.specs_ram),
    options: (__VLS_ctx.ram_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "RAM Type",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_272 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({}));
const __VLS_274 = __VLS_273({}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_275.slots.default;
const __VLS_276 = {}.InputNumber;
/** @type {[typeof __VLS_components.InputNumber, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    id: "ssd",
    modelValue: (__VLS_ctx.specs_form.specs_ssd),
    ...{ class: "w-full" },
}));
const __VLS_278 = __VLS_277({
    id: "ssd",
    modelValue: (__VLS_ctx.specs_form.specs_ssd),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "ssd",
});
var __VLS_275;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_280 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({}));
const __VLS_282 = __VLS_281({}, ...__VLS_functionalComponentArgsRest(__VLS_281));
__VLS_283.slots.default;
const __VLS_284 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    filter: true,
    modelValue: (__VLS_ctx.specs_form.specs_ssd_capacity),
    options: (__VLS_ctx.capacity_opts),
    optionValue: "value",
    optionLabel: "name",
    placeholder: "Capacity",
    ...{ class: "w-full" },
}));
const __VLS_286 = __VLS_285({
    filter: true,
    modelValue: (__VLS_ctx.specs_form.specs_ssd_capacity),
    options: (__VLS_ctx.capacity_opts),
    optionValue: "value",
    optionLabel: "name",
    placeholder: "Capacity",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
var __VLS_283;
const __VLS_288 = {}.Divider;
/** @type {[typeof __VLS_components.Divider, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({}));
const __VLS_290 = __VLS_289({}, ...__VLS_functionalComponentArgsRest(__VLS_289));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_292 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    legend: "GPU",
}));
const __VLS_294 = __VLS_293({
    legend: "GPU",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
__VLS_295.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card flex flex-wrap gap-6" },
});
for (const [gpu] of __VLS_getVForSourceType((__VLS_ctx.gpu_type))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (gpu.key),
        ...{ class: "flex items-center gap-2" },
    });
    const __VLS_296 = {}.RadioButton;
    /** @type {[typeof __VLS_components.RadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
        modelValue: (__VLS_ctx.selectedGPU),
        inputId: (gpu.key),
        name: "dynamdic",
        value: (gpu.key),
    }));
    const __VLS_298 = __VLS_297({
        modelValue: (__VLS_ctx.selectedGPU),
        inputId: (gpu.key),
        name: "dynamdic",
        value: (gpu.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: (gpu.key),
    });
    (gpu.name);
}
const __VLS_300 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({}));
const __VLS_302 = __VLS_301({}, ...__VLS_functionalComponentArgsRest(__VLS_301));
__VLS_303.slots.default;
const __VLS_304 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    id: "gpu_dedic_info",
    modelValue: (__VLS_ctx.specs_form.specs_gpu_dedic_info),
    ...{ class: "w-full md:w-100" },
    disabled: (!__VLS_ctx.isDedicatedSelected),
}));
const __VLS_306 = __VLS_305({
    id: "gpu_dedic_info",
    modelValue: (__VLS_ctx.specs_form.specs_gpu_dedic_info),
    ...{ class: "w-full md:w-100" },
    disabled: (!__VLS_ctx.isDedicatedSelected),
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "gpu_dedic_info",
});
var __VLS_303;
var __VLS_295;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_308 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    legend: "Network",
}));
const __VLS_310 = __VLS_309({
    legend: "Network",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card flex flex-wrap gap-6 mb-6" },
});
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.network_type))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (category.key),
        ...{ class: "flex items-center gap-2" },
    });
    const __VLS_312 = {}.RadioButton;
    /** @type {[typeof __VLS_components.RadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
        modelValue: (__VLS_ctx.selectedNetwork),
        inputId: (category.key),
        name: "dynamic",
        value: (category.key),
    }));
    const __VLS_314 = __VLS_313({
        modelValue: (__VLS_ctx.selectedNetwork),
        inputId: (category.key),
        name: "dynamic",
        value: (category.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: (category.key),
    });
    (category.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_316 = {}.RadioButton;
/** @type {[typeof __VLS_components.RadioButton, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    modelValue: (__VLS_ctx.selectedWireless),
    disabled: (!__VLS_ctx.isWirelessSelected),
    inputId: "networkBuiltIn",
    name: "networkBuiltIn",
    value: "1",
}));
const __VLS_318 = __VLS_317({
    modelValue: (__VLS_ctx.selectedWireless),
    disabled: (!__VLS_ctx.isWirelessSelected),
    inputId: "networkBuiltIn",
    name: "networkBuiltIn",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "networkBuiltIn",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_320 = {}.RadioButton;
/** @type {[typeof __VLS_components.RadioButton, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    modelValue: (__VLS_ctx.selectedWireless),
    inputId: "networkDongle",
    name: "networkDongle",
    value: "2",
    disabled: (!__VLS_ctx.isWirelessSelected),
}));
const __VLS_322 = __VLS_321({
    modelValue: (__VLS_ctx.selectedWireless),
    inputId: "networkDongle",
    name: "networkDongle",
    value: "2",
    disabled: (!__VLS_ctx.isWirelessSelected),
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "networkDongle",
});
var __VLS_311;
const __VLS_324 = {}.Button;
/** @type {[typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    label: "Save",
    type: "submit",
    icon: "pi pi-save",
    severity: "primary",
}));
const __VLS_326 = __VLS_325({
    label: "Save",
    type: "submit",
    icon: "pi pi-save",
    severity: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
var __VLS_247;
const __VLS_328 = {}.TabPanel;
/** @type {[typeof __VLS_components.TabPanel, typeof __VLS_components.TabPanel, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
    value: "2",
    as: "p",
    ...{ class: "m-0" },
}));
const __VLS_330 = __VLS_329({
    value: "2",
    as: "p",
    ...{ class: "m-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
__VLS_331.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.saveSoftwareInfo) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4" },
});
for (const [software, index] of __VLS_getVForSourceType((__VLS_ctx.software_installed))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (software.key + '-' + index),
        ...{ class: "relative z-0 w-full mb-5 group" },
    });
    const __VLS_332 = {}.Fieldset;
    /** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        legend: (software.title),
    }));
    const __VLS_334 = __VLS_333({
        legend: (software.title),
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    __VLS_335.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card flex flex-wrap gap-9" },
    });
    for (const [option] of __VLS_getVForSourceType((['perpetual', 'subscription', 'evaluation']))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (option),
            ...{ class: "flex items-center gap-3" },
        });
        const __VLS_336 = {}.RadioButton;
        /** @type {[typeof __VLS_components.RadioButton, ]} */ ;
        // @ts-ignore
        const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.selectedSoftware[software.key]),
            inputId: (option.toLowerCase() + '-' + index),
            name: (software.key),
            value: (option.toLowerCase()),
        }));
        const __VLS_338 = __VLS_337({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.selectedSoftware[software.key]),
            inputId: (option.toLowerCase() + '-' + index),
            name: (software.key),
            value: (option.toLowerCase()),
        }, ...__VLS_functionalComponentArgsRest(__VLS_337));
        let __VLS_340;
        let __VLS_341;
        let __VLS_342;
        const __VLS_343 = {
            onChange: (...[$event]) => {
                __VLS_ctx.onRadioChange(software.key, option);
            }
        };
        var __VLS_339;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: (option.toLowerCase() + '-' + index),
        });
        (option);
    }
    var __VLS_335;
}
if (__VLS_ctx.showForm || __VLS_ctx.form.softwareName) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-4 bg-gray-50 p-4 rounded-lg border" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "font-semibold mb-2 text-gray-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
        value: (__VLS_ctx.form.softwareName),
        placeholder: "Enter software name or details...",
        ...{ class: "w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none" },
        rows: "2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ class: "block text-sm font-medium text-gray-700 mb-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
        value: (__VLS_ctx.form.softwareCategory),
        ...{ class: "w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "System Utility",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "Office Suite",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "Design Software",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "Development Tool",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "Security Software",
    });
}
const __VLS_344 = {}.Button;
/** @type {[typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    label: "Save",
    type: "submit",
    icon: "pi pi-save",
    severity: "primary",
}));
const __VLS_346 = __VLS_345({
    label: "Save",
    type: "submit",
    icon: "pi pi-save",
    severity: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
const __VLS_348 = {}.Button;
/** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
    ...{ 'onClick': {} },
    ...{ class: "bg-blue-700 hover:bg-blue-800 border-blue-700 text-white px-4 py-2 rounded ml-3" },
    ...{ style: {} },
}));
const __VLS_350 = __VLS_349({
    ...{ 'onClick': {} },
    ...{ class: "bg-blue-700 hover:bg-blue-800 border-blue-700 text-white px-4 py-2 rounded ml-3" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
let __VLS_352;
let __VLS_353;
let __VLS_354;
const __VLS_355 = {
    onClick: (__VLS_ctx.toggleForm)
};
__VLS_351.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "pi pi-plus mr-2" },
});
(__VLS_ctx.showForm ? 'Cancel' : 'Add more software');
var __VLS_351;
var __VLS_331;
const __VLS_356 = {}.TabPanel;
/** @type {[typeof __VLS_components.TabPanel, typeof __VLS_components.TabPanel, ]} */ ;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
    value: "3",
    as: "p",
    ...{ class: "m-0" },
}));
const __VLS_358 = __VLS_357({
    value: "3",
    as: "p",
    ...{ class: "m-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_357));
__VLS_359.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.savePeripheralInfo) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
});
const __VLS_360 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
    legend: "Monitor 1",
    ...{ class: "p-5 border rounded-lg shadow-sm" },
}));
const __VLS_362 = __VLS_361({
    legend: "Monitor 1",
    ...{ class: "p-5 border rounded-lg shadow-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_361));
__VLS_363.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
if (__VLS_ctx.peripheral_form.monitor1QrCode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center" },
    });
    const __VLS_364 = {}.QrcodeVue;
    /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
    // @ts-ignore
    const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
        value: (__VLS_ctx.peripheral_form.monitor1QrCode),
        ...{ class: "w-32 h-32" },
    }));
    const __VLS_366 = __VLS_365({
        value: (__VLS_ctx.peripheral_form.monitor1QrCode),
        ...{ class: "w-32 h-32" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_365));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
});
const __VLS_368 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
    ...{ class: "w-full" },
}));
const __VLS_370 = __VLS_369({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_369));
__VLS_371.slots.default;
const __VLS_372 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
    id: "monitor1QrCode",
    modelValue: (__VLS_ctx.peripheral_form.monitor1QrCode),
    ...{ class: "w-full" },
}));
const __VLS_374 = __VLS_373({
    id: "monitor1QrCode",
    modelValue: (__VLS_ctx.peripheral_form.monitor1QrCode),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_373));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor1QrCode",
});
var __VLS_371;
const __VLS_376 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
    ...{ class: "w-full" },
}));
const __VLS_378 = __VLS_377({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_377));
__VLS_379.slots.default;
const __VLS_380 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
    id: "monitor1BrandModel",
    modelValue: (__VLS_ctx.peripheral_form.monitor1BrandModel),
    ...{ class: "w-full" },
}));
const __VLS_382 = __VLS_381({
    id: "monitor1BrandModel",
    modelValue: (__VLS_ctx.peripheral_form.monitor1BrandModel),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_381));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor1BrandModel",
});
var __VLS_379;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
});
const __VLS_384 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
    ...{ class: "w-full" },
}));
const __VLS_386 = __VLS_385({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_385));
__VLS_387.slots.default;
const __VLS_388 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
    id: "monitor1Model",
    modelValue: (__VLS_ctx.peripheral_form.monitor1Model),
    ...{ class: "w-full" },
}));
const __VLS_390 = __VLS_389({
    id: "monitor1Model",
    modelValue: (__VLS_ctx.peripheral_form.monitor1Model),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_389));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor1Model",
});
var __VLS_387;
const __VLS_392 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
    ...{ class: "w-full" },
}));
const __VLS_394 = __VLS_393({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_393));
__VLS_395.slots.default;
const __VLS_396 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
    id: "monitor1SerialNumber",
    modelValue: (__VLS_ctx.peripheral_form.monitor1SerialNumber),
    ...{ class: "w-full" },
}));
const __VLS_398 = __VLS_397({
    id: "monitor1SerialNumber",
    modelValue: (__VLS_ctx.peripheral_form.monitor1SerialNumber),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_397));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor1SerialNumber",
});
var __VLS_395;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
});
const __VLS_400 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
    ...{ class: "w-full" },
}));
const __VLS_402 = __VLS_401({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
__VLS_403.slots.default;
const __VLS_404 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
    id: "monitor1PropertyNumber",
    modelValue: (__VLS_ctx.peripheral_form.monitor1PropertyNumber),
    ...{ class: "w-full" },
}));
const __VLS_406 = __VLS_405({
    id: "monitor1PropertyNumber",
    modelValue: (__VLS_ctx.peripheral_form.monitor1PropertyNumber),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_405));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor1PropertyNumber",
});
var __VLS_403;
const __VLS_408 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
    ...{ class: "w-full" },
}));
const __VLS_410 = __VLS_409({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_409));
__VLS_411.slots.default;
const __VLS_412 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
    id: "monitor1AccountPersonInPN",
    modelValue: (__VLS_ctx.peripheral_form.monitor1AccountPersonInPN),
    ...{ class: "w-full" },
}));
const __VLS_414 = __VLS_413({
    id: "monitor1AccountPersonInPN",
    modelValue: (__VLS_ctx.peripheral_form.monitor1AccountPersonInPN),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_413));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor1AccountPersonInPN",
});
var __VLS_411;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
});
const __VLS_416 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({
    ...{ class: "w-full" },
}));
const __VLS_418 = __VLS_417({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_417));
__VLS_419.slots.default;
const __VLS_420 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
    id: "monitor1ActualUser",
    modelValue: (__VLS_ctx.peripheral_form.monitor1ActualUser),
    ...{ class: "w-full" },
}));
const __VLS_422 = __VLS_421({
    id: "monitor1ActualUser",
    modelValue: (__VLS_ctx.peripheral_form.monitor1ActualUser),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_421));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor1ActualUser",
});
var __VLS_419;
const __VLS_424 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({
    filter: true,
    modelValue: (__VLS_ctx.peripheral_form.mon1division1),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}));
const __VLS_426 = __VLS_425({
    filter: true,
    modelValue: (__VLS_ctx.peripheral_form.mon1division1),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_425));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_428 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
    filter: true,
    modelValue: (__VLS_ctx.peripheral_form.monitor1Status),
    options: (__VLS_ctx.status_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Current Status",
    ...{ class: "w-full" },
}));
const __VLS_430 = __VLS_429({
    filter: true,
    modelValue: (__VLS_ctx.peripheral_form.monitor1Status),
    options: (__VLS_ctx.status_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Current Status",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_429));
var __VLS_363;
const __VLS_432 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({
    legend: "Monitor 2",
    ...{ class: "p-5 border rounded-lg shadow-sm" },
}));
const __VLS_434 = __VLS_433({
    legend: "Monitor 2",
    ...{ class: "p-5 border rounded-lg shadow-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_433));
__VLS_435.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
if (__VLS_ctx.peripheral_form.monitor2QrCode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center" },
    });
    const __VLS_436 = {}.QrcodeVue;
    /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
    // @ts-ignore
    const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
        value: (__VLS_ctx.peripheral_form.monitor2QrCode),
        ...{ class: "w-32 h-32" },
    }));
    const __VLS_438 = __VLS_437({
        value: (__VLS_ctx.peripheral_form.monitor2QrCode),
        ...{ class: "w-32 h-32" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_437));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
});
const __VLS_440 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
    ...{ class: "w-full" },
}));
const __VLS_442 = __VLS_441({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_441));
__VLS_443.slots.default;
const __VLS_444 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
    id: "monitor2QrCode",
    modelValue: (__VLS_ctx.peripheral_form.monitor2QrCode),
    ...{ class: "w-full" },
}));
const __VLS_446 = __VLS_445({
    id: "monitor2QrCode",
    modelValue: (__VLS_ctx.peripheral_form.monitor2QrCode),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_445));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor2QrCode",
});
var __VLS_443;
const __VLS_448 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
    ...{ class: "w-full" },
}));
const __VLS_450 = __VLS_449({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_449));
__VLS_451.slots.default;
const __VLS_452 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
    id: "monitor2BrandModel",
    modelValue: (__VLS_ctx.peripheral_form.monitor2BrandModel),
    ...{ class: "w-full" },
}));
const __VLS_454 = __VLS_453({
    id: "monitor2BrandModel",
    modelValue: (__VLS_ctx.peripheral_form.monitor2BrandModel),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_453));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor2BrandModel",
});
var __VLS_451;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
});
const __VLS_456 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
    ...{ class: "w-full" },
}));
const __VLS_458 = __VLS_457({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_457));
__VLS_459.slots.default;
const __VLS_460 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
    id: "monitor2Model",
    modelValue: (__VLS_ctx.peripheral_form.monitor2Model),
    ...{ class: "w-full" },
}));
const __VLS_462 = __VLS_461({
    id: "monitor2Model",
    modelValue: (__VLS_ctx.peripheral_form.monitor2Model),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_461));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor2Model",
});
var __VLS_459;
const __VLS_464 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({
    ...{ class: "w-full" },
}));
const __VLS_466 = __VLS_465({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_465));
__VLS_467.slots.default;
const __VLS_468 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
    id: "monitor2SerialNumber",
    modelValue: (__VLS_ctx.peripheral_form.monitor2SerialNumber),
    ...{ class: "w-full" },
}));
const __VLS_470 = __VLS_469({
    id: "monitor2SerialNumber",
    modelValue: (__VLS_ctx.peripheral_form.monitor2SerialNumber),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_469));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor2SerialNumber",
});
var __VLS_467;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
});
const __VLS_472 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
    ...{ class: "w-full" },
}));
const __VLS_474 = __VLS_473({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_473));
__VLS_475.slots.default;
const __VLS_476 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
    id: "monitor2PropertyNumber",
    modelValue: (__VLS_ctx.peripheral_form.monitor2PropertyNumber),
    ...{ class: "w-full" },
}));
const __VLS_478 = __VLS_477({
    id: "monitor2PropertyNumber",
    modelValue: (__VLS_ctx.peripheral_form.monitor2PropertyNumber),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_477));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor2PropertyNumber",
});
var __VLS_475;
const __VLS_480 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
    ...{ class: "w-full" },
}));
const __VLS_482 = __VLS_481({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_481));
__VLS_483.slots.default;
const __VLS_484 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
    id: "monitor2AccountPersonInPN",
    modelValue: (__VLS_ctx.peripheral_form.monitor2AccountPersonInPN),
    ...{ class: "w-full" },
}));
const __VLS_486 = __VLS_485({
    id: "monitor2AccountPersonInPN",
    modelValue: (__VLS_ctx.peripheral_form.monitor2AccountPersonInPN),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_485));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor2AccountPersonInPN",
});
var __VLS_483;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
});
const __VLS_488 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({
    ...{ class: "w-full" },
}));
const __VLS_490 = __VLS_489({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_489));
__VLS_491.slots.default;
const __VLS_492 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
    id: "monitor2ActualUser",
    modelValue: (__VLS_ctx.peripheral_form.monitor2ActualUser),
    ...{ class: "w-full" },
}));
const __VLS_494 = __VLS_493({
    id: "monitor2ActualUser",
    modelValue: (__VLS_ctx.peripheral_form.monitor2ActualUser),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_493));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "monitor2ActualUser",
});
var __VLS_491;
const __VLS_496 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({
    filter: true,
    modelValue: (__VLS_ctx.peripheral_form.mon1division2),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}));
const __VLS_498 = __VLS_497({
    filter: true,
    modelValue: (__VLS_ctx.peripheral_form.mon1division2),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_497));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
const __VLS_500 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({
    filter: true,
    modelValue: (__VLS_ctx.peripheral_form.monitor2Status),
    options: (__VLS_ctx.status_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Current Status",
    ...{ class: "w-full" },
}));
const __VLS_502 = __VLS_501({
    filter: true,
    modelValue: (__VLS_ctx.peripheral_form.monitor2Status),
    options: (__VLS_ctx.status_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Current Status",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_501));
var __VLS_435;
const __VLS_504 = {}.Button;
/** @type {[typeof __VLS_components.Button, ]} */ ;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent(__VLS_504, new __VLS_504({
    label: "Save",
    type: "submit",
    icon: "pi pi-save",
    severity: "info",
    ...{ class: "mr-4" },
}));
const __VLS_506 = __VLS_505({
    label: "Save",
    type: "submit",
    icon: "pi pi-save",
    severity: "info",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_505));
var __VLS_359;
var __VLS_67;
var __VLS_35;
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-neutral-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-neutral-700']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-neutral-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-info-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-folder']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-code']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-desktop']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-5']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-14']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-14']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-14']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-14']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-7']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['pr-16']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-9']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-plus']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-32']} */ ;
/** @type {__VLS_StyleScopedClasses['h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            modal_software: modal_software,
            modal_transfer_item: modal_transfer_item,
            BreadcrumbDefault: BreadcrumbDefault,
            Modal_msoffice: Modal_msoffice,
            pageTitle: pageTitle,
            route: route,
            form_option: form_option,
            form: form,
            specs_form: specs_form,
            peripheral_form: peripheral_form,
            sex_opts: sex_opts,
            status_opts: status_opts,
            division_opts: division_opts,
            work_nature: work_nature,
            equipment_type: equipment_type,
            range_category: range_category,
            employment_opts: employment_opts,
            capacity_opts: capacity_opts,
            ram_opts: ram_opts,
            isLoading: isLoading,
            currentMessage: currentMessage,
            progress: progress,
            sameAsAccountable: sameAsAccountable,
            selectedNetwork: selectedNetwork,
            selectedGPU: selectedGPU,
            selectedWireless: selectedWireless,
            selectedSoftware: selectedSoftware,
            isVisible: isVisible,
            isMicrosoftOffice: isMicrosoftOffice,
            isDedicatedSelected: isDedicatedSelected,
            isWirelessSelected: isWirelessSelected,
            userId: userId,
            openTransferModal: openTransferModal,
            showForm: showForm,
            checkYear: checkYear,
            network_type: network_type,
            gpu_type: gpu_type,
            software_installed: software_installed,
            onRadioChange: onRadioChange,
            saveGeneralInfo: saveGeneralInfo,
            saveSpecsInfo: saveSpecsInfo,
            saveSoftwareInfo: saveSoftwareInfo,
            savePeripheralInfo: savePeripheralInfo,
            closeModal: closeModal,
            isComputerType: isComputerType,
            toggleForm: toggleForm,
            checkDuplicates: checkDuplicates,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
