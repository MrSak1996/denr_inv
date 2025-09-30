import { useAuthStore } from '@/stores/authStore';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { useForm } from '@/composables/useForm';
import { useInventory } from '@/composables/useInventory';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import router from '@/router';
import api from '@/api/axiosInstance';
import modal_review_form from './modal/modal_review_form.vue';
import modal_gen_qr from './modal/modal_gen_qr.vue';
import modal_print_qr from './modal/modal_print_qr.vue';
import modal_export_report from './modal/modal_export_report.vue';
import modal_attachments from './modal/modal_attachments.vue';
const { isLoading, currentMessage, fetchCurUser, division_opts, work_nature, equipment_type, range_category, employment_opts, startProgress, completeProgress, progress, getDivision } = useApi();
const { form, specs_form, peripheral_form } = useForm();
const { printRecord } = useInventory();
const authStore = useAuthStore();
const route = useRoute();
const customers = ref([]);
const software = ref([]);
const qr_code = ref();
const total_item = ref(0);
const serviceable_count = ref(0);
const unserviceable_count = ref(0);
const return_count = ref(0);
const outdated_count = ref(0);
const invalid_data_count = ref(0);
const filters = ref();
const loading = ref(false);
const openScanForm = ref(false);
const imageUrl = ref('');
const item_id = ref();
const isUploading = ref(false);
const image = ref(null);
const isModalOpen = ref(false);
const openQR = ref(false);
const openAttachments = ref(false);
const openReport = ref(false);
const selectQR = ref(false);
const openReviewForm = ref(false);
const uploadSuccess = ref(false);
const uploadError = ref();
const statuses = ref(['Serviceable', 'Unserviceable', 'Returned']);
const office = ref([
    'PENRO CAVITE',
    'PENRO LAGUNA',
    'PENRO BATANGAS',
    'PENRO RIZAL',
    'PENRO QUEZON',
    'CENRO Sta. Cruz',
    'CENRO Lipa City',
    'CENRO Calaca',
    'CENRO Calauag',
    'CENRO Catanauan',
    'CENRO Tayabas',
    'CENRO Real',
    'Regional Office'
]);
const userId = route.query.id;
const item = ref(0);
const user_role = ref(0);
const api_token = authStore.api_token;
const role_id = authStore.role_id;
const role_office = ref('');
const loadUserData = async () => {
    const userData = await fetchCurUser();
    user_role.value = role_id;
    // getting the user's office
    const roleMapping = {
        '1': 'PENRO CAVITE',
        '2': 'PENRO LAGUNA',
        '3': 'PENRO BATANGAS',
        '4': 'PENRO RIZAL',
        '5': 'PENRO QUEZON',
        '6': 'CENRO Sta. Cruz',
        '7': 'CENRO Lipa City',
        '8': 'CENRO Calaca',
        '9': 'CENRO Calauag',
        '10': 'CENRO Catanauan',
        '11': 'CENRO Tayabas',
        '12': 'CENRO Real',
        '13': 'Regional Office'
    };
    const roleId = role_id; // use the **fetched role_id**
    role_office.value = roleMapping[String(roleId)] || 'Unknown Office';
};
const fetchData = async (selectedRoleId) => {
    try {
        startProgress(); // Start the progress bar
        // await loadUserData()
        const response = await api.get(`/vw-gen-info?api_tokes=${api_token}&designation=${authStore.role_id}&office=${selectedRoleId}`);
        total_item.value = Number(response.data.count); // Set the count if it exists
        customers.value = response.data.data; // Process the fetched data
        loading.value = false;
        if (selectedRoleId == 0) {
            completeProgress(); // Stop the progress bar
            getCountStatus(0);
            getOutdatedEquipment(0);
        }
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        loading.value = false;
        completeProgress(); // Stop the progress bar even in case of error
    }
};
const filterByOffice = async (selectedRoleId) => {
    try {
        startProgress();
        fetchData(selectedRoleId);
        getCountStatus(selectedRoleId);
        getOutdatedEquipment(selectedRoleId);
        const api_token = authStore.api_token;
        const response = await api.get(`/vw-gen-info?api_tokes=${api_token}&designation=${authStore.role_id}&office=${selectedRoleId}`);
        loading.value = false;
        customers.value = response.data.data;
        completeProgress();
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        loading.value = false;
        completeProgress();
    }
};
const getCountStatus = async (selectedRoleId) => {
    try {
        await loadUserData();
        // ✅ Corrected: If selectedRoleId is empty, use `/getCountStatus`
        // Otherwise, use `/getCountStatusPerDivision`
        const baseUrl = `/getCountStatus${selectedRoleId ? 'PerDivision' : ''}`;
        const url = `${baseUrl}?api_token=${api_token}&designation=${role_id}&office=${selectedRoleId ?? 0}`;
        const response = await api.get(url);
        const data = response.data;
        // ✅ Safely handle response
        if (Array.isArray(data) && data.length > 0) {
            serviceable_count.value = Number(data[0]?.serviceable ?? 0);
            unserviceable_count.value = Number(data[0]?.unserviceable ?? 0);
            return_count.value = Number(data[0]?.returned ?? 0);
        }
        else {
            console.warn('No data returned from API. Setting default values.');
            serviceable_count.value = 0;
            unserviceable_count.value = 0;
            return_count.value = 0;
        }
    }
    catch (error) {
        serviceable_count.value = 0;
        unserviceable_count.value = 0;
        return_count.value = 0;
    }
};
const getOutdatedEquipment = async (selectedRoleId) => {
    try {
        // Load user data before API call
        await loadUserData();
        const baseUrl = `/getOutdatedEquipment${selectedRoleId ? 'PerDivision' : ''}`;
        const url = `${baseUrl}?api_token=${api_token}&designation=${role_id}&office=${selectedRoleId ?? 0}`;
        const response = await api.get(url);
        const data = response.data;
        // ✅ Safely handle and validate response
        outdated_count.value = Array.isArray(data) && data.length > 0
            ? Number(data[0]?.count ?? 0)
            : 0;
        if (!Array.isArray(data) || data.length === 0) {
            console.warn('No outdated equipment data returned. Setting default value.');
        }
    }
    catch (error) {
        console.error('Error fetching outdated equipment:', error);
        outdated_count.value = 0; // ✅ Default to 0 in case of error
    }
};
const getInvalidData = async () => {
    try {
        const response = await api.get(`/vw-invalid-data?api_token=${api_token}&designation=${authStore.role_id}`);
        // Check if response.data exists and has at least one item
        invalid_data_count.value = Number(response.data.count);
    }
    catch (error) {
        invalid_data_count.value = 0;
    }
};
const initFilters = () => {
    filters.value = {
        id: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        actual_division_title: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        acct_division_title: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        equipment_title: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        acct_person: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        qr_code: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        mon_qr_code1: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        mon_qr_code2: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        ups_qr_code: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        brand: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        full_specs: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        range_category: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        actual_user: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        status: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        control_no: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        roles: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        }
    };
};
initFilters();
const clearFilter = () => {
    initFilters();
};
const addMore = () => {
    router.push({
        name: 'InventoryCreate',
        query: {
            id: userId,
            item_id: null,
            api_token: api_token,
            create_new: 'true' // Convert the boolean to a string
        }
    });
};
const getSeverity = (status) => {
    switch (status) {
        case 'Serviceable':
            return 'success';
        case 'Unserviceable':
            return 'danger';
        case 'Returned':
            return 'danger';
    }
};
const viewRecord = (id) => {
    router.push({
        path: `/inventory/create/${id}`,
        query: { api_token: localStorage.getItem('api_token'), item_id: id }
    });
};
const handlePrint = (id) => {
    try {
        const url = `http://127.0.0.1:8000/api/generatePDFReport?id=${id}`;
        window.open(url);
    }
    catch (error) {
        console.error('Error generating PDF:', error);
    }
};
const simulateUpload = () => {
    isUploading.value = true;
    progress.value = 0;
    const interval = setInterval(() => {
        if (progress.value < 100) {
            progress.value += 10; // Increment progress
        }
        else {
            clearInterval(interval);
            isUploading.value = false;
            uploadSuccess.value = true; // Mark upload as successful
            setTimeout(() => closeModal(), 2000); // Auto close modal after completion
        }
    }, 500);
};
const openModal = (id) => {
    isModalOpen.value = true;
    qr_code.value = id;
};
const closeModal = () => {
    isModalOpen.value = false;
    resetForm();
};
const onFileChange = (event) => {
    const target = event.target;
    if (target?.files) {
        image.value = target.files[0];
    }
};
const triggerFileInput = () => {
    const fileInput = document.querySelector("input[type='file']");
    if (fileInput) {
        fileInput.click();
    }
};
const uploadImage = async () => {
    if (!image.value)
        return;
    const formData = new FormData();
    formData.append('image', image.value);
    formData.append('destination_folder', role_office.value);
    formData.append('qr_code', qr_code.value);
    try {
        simulateUpload();
        const response = await api.post('/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.data.status) {
            uploadSuccess.value = true;
            uploadError.value = null;
            imageUrl.value = response.data.image_url;
        }
    }
    catch (error) {
        uploadSuccess.value = false;
        uploadError.value = 'An error occurred';
    }
};
const openFile = async (id) => {
    try {
        item_id.value = id;
        openAttachments.value = true;
    }
    catch (error) {
        console.log(error);
    }
};
const resetForm = () => {
    image.value = null;
    progress.value = 0;
    isUploading.value = false;
    uploadSuccess.value = false;
    uploadError.value = '';
};
const updateFilterWithQrValue = (qrValue) => {
    filters.value['global'].value = qrValue;
};
const remarksMap = {
    perpetual: '1',
    subscription: '2',
    evaluation: '3'
};
const retrieveDataviaAPI = async (id) => {
    const item_id = id;
    item.value = item_id;
    if (item_id) {
        try {
            const response = await api.get(`/retriveDataviaAPI?id=${id}`);
            Object.assign(form, response.data[0]);
            const res = await api.get(`/retrieveSoftwareData?id=${id}`);
            software.value = res.data;
            response.data.forEach((software) => {
                const selectedOption = Object.keys(remarksMap).find((key) => remarksMap[key] === software.remarks);
            });
            const specs_res = await api.get(`/retrieveSpecsData?id=${id}`);
            Object.assign(specs_form, specs_res.data[0]);
            const peri_res = await api.get(`/retrievePeripheralsData?id=${id}`);
            Object.assign(peripheral_form, peri_res.data[0]);
        }
        catch (error) {
            console.error('Error retrieving data:', error);
        }
        openReviewForm.value = true;
    }
};
const handleKeydown = (event) => {
    if (event.key === 'F2') {
        openScanForm.value = true;
        event.preventDefault(); // Prevent default browser action (if needed)
    }
    else if (event.key === 'F3') {
        openQR.value = true;
    }
};
const disableRightClick = (event) => {
    event.preventDefault();
};
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('contextmenu', disableRightClick);
    loadUserData();
    fetchData(0);
    getCountStatus(0);
    getOutdatedEquipment(0);
    // getInvalidData()
    getDivision();
});
const pageTitle = ref('Inventory Management');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.DefaultLayout;
/** @type {[typeof __VLS_components.DefaultLayout, typeof __VLS_components.DefaultLayout, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.BreadcrumbDefault;
/** @type {[typeof __VLS_components.BreadcrumbDefault, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    pageTitle: (__VLS_ctx.pageTitle),
}));
const __VLS_7 = __VLS_6({
    pageTitle: (__VLS_ctx.pageTitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5 mb-4" },
});
const __VLS_9 = {}.DataStatsOne;
/** @type {[typeof __VLS_components.DataStatsOne, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    total_equipment: (__VLS_ctx.total_item),
    total_serviceable_count: (__VLS_ctx.serviceable_count),
    total_unserviceable_count: (__VLS_ctx.unserviceable_count),
    outdated_equipment: (__VLS_ctx.outdated_count),
    total_returned_count: (__VLS_ctx.return_count),
}));
const __VLS_11 = __VLS_10({
    total_equipment: (__VLS_ctx.total_item),
    total_serviceable_count: (__VLS_ctx.serviceable_count),
    total_unserviceable_count: (__VLS_ctx.unserviceable_count),
    outdated_equipment: (__VLS_ctx.outdated_count),
    total_returned_count: (__VLS_ctx.return_count),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
if (__VLS_ctx.openReviewForm) {
    /** @type {[typeof modal_review_form, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(modal_review_form, new modal_review_form({
        ...{ 'onClose': {} },
        genForm: (__VLS_ctx.form),
        periForm: (__VLS_ctx.peripheral_form),
        division: (__VLS_ctx.division_opts),
        wnature: (__VLS_ctx.work_nature),
        emp_type: (__VLS_ctx.employment_opts),
        category: (__VLS_ctx.range_category),
        softwareData: (__VLS_ctx.software),
        specsData: (__VLS_ctx.specs_form),
        equipment: (__VLS_ctx.equipment_type),
        open: (__VLS_ctx.openReviewForm),
        item_id: (__VLS_ctx.item),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClose': {} },
        genForm: (__VLS_ctx.form),
        periForm: (__VLS_ctx.peripheral_form),
        division: (__VLS_ctx.division_opts),
        wnature: (__VLS_ctx.work_nature),
        emp_type: (__VLS_ctx.employment_opts),
        category: (__VLS_ctx.range_category),
        softwareData: (__VLS_ctx.software),
        specsData: (__VLS_ctx.specs_form),
        equipment: (__VLS_ctx.equipment_type),
        open: (__VLS_ctx.openReviewForm),
        item_id: (__VLS_ctx.item),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openReviewForm))
                return;
            __VLS_ctx.openReviewForm = false;
        }
    };
    var __VLS_15;
}
if (__VLS_ctx.openReport) {
    /** @type {[typeof modal_export_report, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(modal_export_report, new modal_export_report({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openReport),
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openReport),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_23;
    let __VLS_24;
    let __VLS_25;
    const __VLS_26 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openReport))
                return;
            __VLS_ctx.openReport = false;
        }
    };
    var __VLS_22;
}
if (__VLS_ctx.openQR) {
    /** @type {[typeof modal_gen_qr, typeof modal_gen_qr, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(modal_gen_qr, new modal_gen_qr({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openQR),
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openQR),
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_30;
    let __VLS_31;
    let __VLS_32;
    const __VLS_33 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openQR))
                return;
            __VLS_ctx.openQR = false;
        }
    };
    var __VLS_29;
}
if (__VLS_ctx.openAttachments) {
    /** @type {[typeof modal_attachments, typeof modal_attachments, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(modal_attachments, new modal_attachments({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openAttachments),
        id: (__VLS_ctx.item_id),
    }));
    const __VLS_35 = __VLS_34({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openAttachments),
        id: (__VLS_ctx.item_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    let __VLS_37;
    let __VLS_38;
    let __VLS_39;
    const __VLS_40 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openAttachments))
                return;
            __VLS_ctx.openAttachments = false;
        }
    };
    var __VLS_36;
}
if (__VLS_ctx.selectQR) {
    /** @type {[typeof modal_print_qr, typeof modal_print_qr, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(modal_print_qr, new modal_print_qr({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.selectQR),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.selectQR),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.selectQR))
                return;
            __VLS_ctx.selectQR = false;
        }
    };
    var __VLS_43;
}
if (__VLS_ctx.imageUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.imageUrl),
        alt: "Uploaded Image",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-10 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1" },
});
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
if (__VLS_ctx.isModalOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" },
        role: "dialog",
        tabindex: "-1",
        'aria-labelledby': "progress-modal",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl w-full max-w-lg mx-4 transition-transform duration-500 transform" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-semibold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closeModal) },
        ...{ class: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-400" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-4 text-sm text-red-800 rounded-lg mb-4 bg-red-50 dark:bg-gray-800 dark:text-red-400" },
        role: "alert",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
        ...{ onSubmit: (__VLS_ctx.uploadImage) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (__VLS_ctx.triggerFileInput) },
        ...{ class: "border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400" },
    });
    if (!__VLS_ctx.image) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-gray-400" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "text-gray-700 font-medium" },
        });
        (__VLS_ctx.image.name);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onChange: (__VLS_ctx.onFileChange) },
        type: "file",
        accept: "image/*",
        ...{ class: "hidden" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        type: "submit",
        ...{ class: "mt-4 px-4 py-2 bg-teal-900 text-white rounded-md hover:bg-teal-900 w-full" },
        disabled: (!__VLS_ctx.image || __VLS_ctx.isUploading),
    });
    if (__VLS_ctx.isUploading) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mt-6" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-full bg-gray-200 rounded-full h-4" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "bg-blue-500 h-4 rounded-full transition-all duration-300" },
            ...{ style: ({ width: __VLS_ctx.progress + '%' }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-2 text-center text-sm text-gray-600" },
        });
        (__VLS_ctx.progress);
    }
    if (__VLS_ctx.uploadSuccess) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mt-4 text-green-600" },
        });
    }
    if (__VLS_ctx.uploadError) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "mt-4 text-red-600" },
        });
        (__VLS_ctx.uploadError);
    }
}
const __VLS_48 = {}.DataTable;
/** @type {[typeof __VLS_components.DataTable, typeof __VLS_components.DataTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    size: "small",
    filters: (__VLS_ctx.filters),
    value: (__VLS_ctx.customers),
    paginator: true,
    showGridlines: true,
    rows: (5),
    dataKey: "id",
    filterDisplay: "menu",
    loading: (__VLS_ctx.loading),
    globalFilterFields: ([
        'control_no',
        'file_id',
        'roles',
        'acct_person',
        'equipment_title',
        'acct_person',
        'qr_code',
        'serial_no',
        'mon_qr_code1',
        'mon_qr_code2',
        'ups_qr_code',
        'actual_division_title',
        'acct_division_title',
        'brand',
        'status'
    ]),
}));
const __VLS_50 = __VLS_49({
    size: "small",
    filters: (__VLS_ctx.filters),
    value: (__VLS_ctx.customers),
    paginator: true,
    showGridlines: true,
    rows: (5),
    dataKey: "id",
    filterDisplay: "menu",
    loading: (__VLS_ctx.loading),
    globalFilterFields: ([
        'control_no',
        'file_id',
        'roles',
        'acct_person',
        'equipment_title',
        'acct_person',
        'qr_code',
        'serial_no',
        'mon_qr_code1',
        'mon_qr_code2',
        'ups_qr_code',
        'actual_division_title',
        'acct_division_title',
        'brand',
        'status'
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_51.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-4 justify-start" },
    });
    const __VLS_52 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-add",
        label: "Add",
        outlined: true,
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-add",
        label: "Add",
        outlined: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (...[$event]) => {
            __VLS_ctx.addMore();
        }
    };
    var __VLS_55;
    const __VLS_60 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-file-export",
        label: "Export",
        outlined: true,
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-file-export",
        label: "Export",
        outlined: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openReport = true;
        }
    };
    var __VLS_63;
    const __VLS_68 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-refresh",
        label: "Refresh",
        outlined: true,
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-refresh",
        label: "Refresh",
        outlined: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_72;
    let __VLS_73;
    let __VLS_74;
    const __VLS_75 = {
        onClick: (...[$event]) => {
            __VLS_ctx.fetchData(0);
        }
    };
    var __VLS_71;
    const __VLS_76 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        severity: "danger",
        icon: "pi pi-qrcode",
        label: "Generate QR Code [F3]",
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        severity: "danger",
        icon: "pi pi-qrcode",
        label: "Generate QR Code [F3]",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_80;
    let __VLS_81;
    let __VLS_82;
    const __VLS_83 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openQR = true;
        }
    };
    var __VLS_79;
    const __VLS_84 = {}.Select;
    /** @type {[typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onUpdate:modelValue': {} },
        filter: true,
        modelValue: (__VLS_ctx.peripheral_form.mon1division2),
        options: (__VLS_ctx.division_opts),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Division",
        ...{ class: "md:w-50 pull-right" },
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onUpdate:modelValue': {} },
        filter: true,
        modelValue: (__VLS_ctx.peripheral_form.mon1division2),
        options: (__VLS_ctx.division_opts),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Division",
        ...{ class: "md:w-50 pull-right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        'onUpdate:modelValue': (__VLS_ctx.filterByOffice)
    };
    var __VLS_87;
    const __VLS_92 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        ...{ style: {} },
        severity: "info",
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        ...{ style: {} },
        severity: "info",
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.clearFilter();
        }
    };
    var __VLS_95;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ml-auto flex items-center" },
    });
    const __VLS_100 = {}.IconField;
    /** @type {[typeof __VLS_components.IconField, typeof __VLS_components.IconField, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ class: "flex items-center" },
    }));
    const __VLS_102 = __VLS_101({
        ...{ class: "flex items-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = {}.InputIcon;
    /** @type {[typeof __VLS_components.InputIcon, typeof __VLS_components.InputIcon, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
    const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
        ...{ class: "pi pi-search" },
    });
    var __VLS_107;
    const __VLS_108 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }));
    const __VLS_110 = __VLS_109({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    var __VLS_103;
}
const __VLS_112 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    field: "id",
    header: "Action",
    ...{ style: {} },
}));
const __VLS_114 = __VLS_113({
    field: "id",
    header: "Action",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_115.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card flex justify-center" },
    });
    const __VLS_116 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        icon: "pi pi-eye",
        size: "small",
        ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        icon: "pi pi-eye",
        size: "small",
        ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (...[$event]) => {
            __VLS_ctx.retrieveDataviaAPI(data.id);
        }
    };
    var __VLS_119;
    const __VLS_124 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        icon: "pi pi-file-edit",
        size: "small",
        ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        icon: "pi pi-file-edit",
        size: "small",
        ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_128;
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewRecord(data.id);
        }
    };
    var __VLS_127;
    const __VLS_132 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        'data.mon_qr_code1': true,
        'data.mon_qr_code2': true,
        'data.ups_qr_code': true,
        icon: "pi pi-cloud-upload",
        size: "small",
        ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        'data.mon_qr_code1': true,
        'data.mon_qr_code2': true,
        'data.ups_qr_code': true,
        icon: "pi pi-cloud-upload",
        size: "small",
        ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openModal(data.id);
        }
    };
    var __VLS_135;
}
var __VLS_115;
const __VLS_140 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    field: "control_no",
    header: "Equipment Type",
    ...{ style: {} },
}));
const __VLS_142 = __VLS_141({
    field: "control_no",
    header: "Equipment Type",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_143.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_144 = {}.Tag;
    /** @type {[typeof __VLS_components.Tag, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        value: (data.equipment_title),
        severity: "success",
        ...{ class: "text-center" },
    }));
    const __VLS_146 = __VLS_145({
        value: (data.equipment_title),
        severity: "success",
        ...{ class: "text-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
    (data.control_no);
}
{
    const { filter: __VLS_thisSlot } = __VLS_143.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_148 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_150 = __VLS_149({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
}
var __VLS_143;
const __VLS_152 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    field: "qr_code",
    header: "ICT Equipment QR Code",
    ...{ style: {} },
}));
const __VLS_154 = __VLS_153({
    field: "qr_code",
    header: "ICT Equipment QR Code",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_155.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (data.qr_code && data.qr_code.trim() !== '') {
        const __VLS_156 = {}.QrcodeVue;
        /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            value: (data.qr_code),
            size: (80),
            ...{ class: "text-center" },
        }));
        const __VLS_158 = __VLS_157({
            value: (data.qr_code),
            size: (80),
            ...{ class: "text-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    }
    (data.qr_code);
}
{
    const { filter: __VLS_thisSlot } = __VLS_155.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_160 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_162 = __VLS_161({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
}
var __VLS_155;
const __VLS_164 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    field: "mon_qr_code1",
    header: "Primary Monitor QR Code",
    ...{ style: {} },
}));
const __VLS_166 = __VLS_165({
    field: "mon_qr_code1",
    header: "Primary Monitor QR Code",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_167.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (data.mon_qr_code1 && data.mon_qr_code1.trim() !== '') {
        const __VLS_168 = {}.QrcodeVue;
        /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            value: (data.mon_qr_code1),
            size: (80),
            ...{ class: "text-center" },
        }));
        const __VLS_170 = __VLS_169({
            value: (data.mon_qr_code1),
            size: (80),
            ...{ class: "text-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    }
    (data.mon_qr_code1);
}
{
    const { filter: __VLS_thisSlot } = __VLS_167.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_172 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_174 = __VLS_173({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
}
var __VLS_167;
const __VLS_176 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    field: "mon_qr_code2",
    header: "Secondary Monitor QR Code",
    ...{ style: {} },
}));
const __VLS_178 = __VLS_177({
    field: "mon_qr_code2",
    header: "Secondary Monitor QR Code",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_179.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (data.mon_qr_code2 && data.mon_qr_code2.trim() !== '') {
        const __VLS_180 = {}.QrcodeVue;
        /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            value: (data.mon_qr_code2),
            size: (80),
            ...{ class: "text-center" },
        }));
        const __VLS_182 = __VLS_181({
            value: (data.mon_qr_code2),
            size: (80),
            ...{ class: "text-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    }
    (data.mon_qr_code2);
}
{
    const { filter: __VLS_thisSlot } = __VLS_179.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_184 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_186 = __VLS_185({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
}
var __VLS_179;
const __VLS_188 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    field: "ups_qr_code",
    header: "UPS QR Code",
    ...{ style: {} },
}));
const __VLS_190 = __VLS_189({
    field: "ups_qr_code",
    header: "UPS QR Code",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_191.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (data.ups_qr_code && data.ups_qr_code.trim() !== '') {
        const __VLS_192 = {}.QrcodeVue;
        /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            value: (data.ups_qr_code),
            size: (80),
            ...{ class: "text-center" },
        }));
        const __VLS_194 = __VLS_193({
            value: (data.ups_qr_code),
            size: (80),
            ...{ class: "text-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    }
    (data.ups_qr_code);
}
{
    const { filter: __VLS_thisSlot } = __VLS_191.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_196 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_198 = __VLS_197({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
}
var __VLS_191;
const __VLS_200 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    header: "Status",
    field: "status",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}));
const __VLS_202 = __VLS_201({
    header: "Status",
    field: "status",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_203.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_204 = {}.Tag;
    /** @type {[typeof __VLS_components.Tag, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        value: (data.status),
        severity: (__VLS_ctx.getSeverity(data.status)),
    }));
    const __VLS_206 = __VLS_205({
        value: (data.status),
        severity: (__VLS_ctx.getSeverity(data.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
}
{
    const { filter: __VLS_thisSlot } = __VLS_203.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_208 = {}.Select;
    /** @type {[typeof __VLS_components.Select, typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        modelValue: (filterModel.value),
        options: (__VLS_ctx.statuses),
        placeholder: "Select One",
        showClear: true,
    }));
    const __VLS_210 = __VLS_209({
        modelValue: (filterModel.value),
        options: (__VLS_ctx.statuses),
        placeholder: "Select One",
        showClear: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    __VLS_211.slots.default;
    {
        const { option: __VLS_thisSlot } = __VLS_211.slots;
        const [slotProps] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_212 = {}.Tag;
        /** @type {[typeof __VLS_components.Tag, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            value: (slotProps.option),
            severity: (__VLS_ctx.getSeverity(slotProps.option)),
        }));
        const __VLS_214 = __VLS_213({
            value: (slotProps.option),
            severity: (__VLS_ctx.getSeverity(slotProps.option)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    }
    var __VLS_211;
}
var __VLS_203;
const __VLS_216 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    field: "brand",
    header: "Brand & Model",
    ...{ style: {} },
}));
const __VLS_218 = __VLS_217({
    field: "brand",
    header: "Brand & Model",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_219.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.brand);
}
{
    const { filter: __VLS_thisSlot } = __VLS_219.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_220 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_222 = __VLS_221({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
}
var __VLS_219;
const __VLS_224 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    field: "serial_no",
    header: "Serial No.",
    ...{ style: {} },
}));
const __VLS_226 = __VLS_225({
    field: "serial_no",
    header: "Serial No.",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_227.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.serial_no);
}
{
    const { filter: __VLS_thisSlot } = __VLS_227.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_228 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_230 = __VLS_229({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
}
var __VLS_227;
const __VLS_232 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    field: "acct_person",
    header: "Accountable Person",
    ...{ style: {} },
}));
const __VLS_234 = __VLS_233({
    field: "acct_person",
    header: "Accountable Person",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_235.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.acct_person);
}
{
    const { filter: __VLS_thisSlot } = __VLS_235.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_236 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_238 = __VLS_237({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
}
var __VLS_235;
const __VLS_240 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    field: "actual_user",
    header: "Actual User",
    ...{ style: {} },
}));
const __VLS_242 = __VLS_241({
    field: "actual_user",
    header: "Actual User",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_243.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.actual_user);
}
{
    const { filter: __VLS_thisSlot } = __VLS_243.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_244 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_246 = __VLS_245({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
}
var __VLS_243;
const __VLS_248 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    field: "attachments",
    header: "Attachments",
    ...{ style: {} },
}));
const __VLS_250 = __VLS_249({
    field: "attachments",
    header: "Attachments",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_251.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (data.file_id) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_252 = {}.Button;
        /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
        // @ts-ignore
        const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
            ...{ 'onClick': {} },
            rel: "noopener noreferrer",
            ...{ class: "text-white mr-2 bg-teal-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        }));
        const __VLS_254 = __VLS_253({
            ...{ 'onClick': {} },
            rel: "noopener noreferrer",
            ...{ class: "text-white mr-2 bg-teal-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_253));
        let __VLS_256;
        let __VLS_257;
        let __VLS_258;
        const __VLS_259 = {
            onClick: (...[$event]) => {
                if (!(data.file_id))
                    return;
                __VLS_ctx.openFile(data.id);
            }
        };
        __VLS_255.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
            ...{ class: "pi pi-external-link mr-2" },
        });
        var __VLS_255;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
}
var __VLS_251;
const __VLS_260 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    field: "roles",
    header: "Registered Location",
    ...{ style: {} },
}));
const __VLS_262 = __VLS_261({
    field: "roles",
    header: "Registered Location",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_263.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.roles);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
    (data.actual_division_title);
}
{
    const { filter: __VLS_thisSlot } = __VLS_263.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_264 = {}.Select;
    /** @type {[typeof __VLS_components.Select, typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
        modelValue: (filterModel.value),
        options: (__VLS_ctx.office),
        placeholder: "Select One",
        showClear: true,
    }));
    const __VLS_266 = __VLS_265({
        modelValue: (filterModel.value),
        options: (__VLS_ctx.office),
        placeholder: "Select One",
        showClear: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    __VLS_267.slots.default;
    {
        const { option: __VLS_thisSlot } = __VLS_267.slots;
        const [slotProps] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_268 = {}.Tag;
        /** @type {[typeof __VLS_components.Tag, ]} */ ;
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
            value: (slotProps.option),
            severity: (__VLS_ctx.getSeverity(slotProps.option)),
        }));
        const __VLS_270 = __VLS_269({
            value: (slotProps.option),
            severity: (__VLS_ctx.getSeverity(slotProps.option)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    }
    var __VLS_267;
}
var __VLS_263;
const __VLS_272 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    field: "full_specs",
    header: "Specifications / Descriptions",
    ...{ style: {} },
}));
const __VLS_274 = __VLS_273({
    field: "full_specs",
    header: "Specifications / Descriptions",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_275.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_275.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "wrap-text" },
    });
    (data.full_specs);
}
{
    const { filter: __VLS_thisSlot } = __VLS_275.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_276 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_278 = __VLS_277({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
}
var __VLS_275;
const __VLS_280 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    field: "range_category",
    header: "Range Category",
    ...{ style: {} },
}));
const __VLS_282 = __VLS_281({
    field: "range_category",
    header: "Range Category",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
__VLS_283.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_283.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.range_category);
}
{
    const { filter: __VLS_thisSlot } = __VLS_283.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_284 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_286 = __VLS_285({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
}
var __VLS_283;
var __VLS_51;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:grid-cols-5']} */ ;
/** @type {__VLS_StyleScopedClasses['2xl:gap-7.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-10']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-stroke']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-default']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-strokedark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-boxdark']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:px-7.5']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:pb-1']} */ ;
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
/** @type {__VLS_StyleScopedClasses['max-w-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-neutral-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:border-blue-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-50']} */ ;
/** @type {__VLS_StyleScopedClasses['pull-right']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-search']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:focus:ring-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:focus:ring-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:focus:ring-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:focus:ring-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-external-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['wrap-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            modal_review_form: modal_review_form,
            modal_gen_qr: modal_gen_qr,
            modal_print_qr: modal_print_qr,
            modal_export_report: modal_export_report,
            modal_attachments: modal_attachments,
            isLoading: isLoading,
            currentMessage: currentMessage,
            division_opts: division_opts,
            work_nature: work_nature,
            equipment_type: equipment_type,
            range_category: range_category,
            employment_opts: employment_opts,
            progress: progress,
            form: form,
            specs_form: specs_form,
            peripheral_form: peripheral_form,
            customers: customers,
            software: software,
            total_item: total_item,
            serviceable_count: serviceable_count,
            unserviceable_count: unserviceable_count,
            return_count: return_count,
            outdated_count: outdated_count,
            filters: filters,
            loading: loading,
            imageUrl: imageUrl,
            item_id: item_id,
            isUploading: isUploading,
            image: image,
            isModalOpen: isModalOpen,
            openQR: openQR,
            openAttachments: openAttachments,
            openReport: openReport,
            selectQR: selectQR,
            openReviewForm: openReviewForm,
            uploadSuccess: uploadSuccess,
            uploadError: uploadError,
            statuses: statuses,
            office: office,
            item: item,
            fetchData: fetchData,
            filterByOffice: filterByOffice,
            clearFilter: clearFilter,
            addMore: addMore,
            getSeverity: getSeverity,
            viewRecord: viewRecord,
            openModal: openModal,
            closeModal: closeModal,
            onFileChange: onFileChange,
            triggerFileInput: triggerFileInput,
            uploadImage: uploadImage,
            openFile: openFile,
            retrieveDataviaAPI: retrieveDataviaAPI,
            pageTitle: pageTitle,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
