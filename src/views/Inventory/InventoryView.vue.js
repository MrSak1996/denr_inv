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
const ict_report_data = ref([]);
const expandedRows = ref({}); // fix null assignment error
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
const userId = route.query.id;
const item = ref(0);
const user_role = ref(0);
const api_token = authStore.api_token;
const role_id = authStore.role_id;
const role_office = ref('');
// -------------------------
// Row expand/collapse handlers
// -------------------------
const onRowExpand = (event) => {
    expandedRows.value = { [event.data.id]: true };
};
const onRowCollapse = (event) => {
    expandedRows.value = {}; // use empty object instead of null
};
const expandAll = () => {
    expandedRows.value = customers.value.reduce((acc, p) => {
        acc[p.id] = true;
        return acc;
    }, {});
};
const collapseAll = () => {
    expandedRows.value = {};
};
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
        const res = await api.get(`/print_preview?api_tokes=${api_token}&designation=${authStore.role_id}&office=${selectedRoleId}`);
        total_item.value = Number(response.data.count); // Set the count if it exists
        customers.value = response.data.data; // Process the fetched data
        ict_report_data.value = res.data.data;
        loading.value = false;
        if (selectedRoleId == 0) {
            completeProgress(); // Stop the progress bar
            getCountStatus(0);
            getOutdatedEquipment(0);
            getInvalidData(0);
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
        getInvalidData(selectedRoleId);
        const api_token = authStore.api_token;
        const response = await api.get(`/vw-gen-info?api_tokes=${api_token}&designation=${authStore.role_id}&office=${selectedRoleId}`);
        loading.value = false;
        customers.value = response.data.data;
        completeProgress();
    }
    catch (error) {
        console.error('Error fetching customers:', error);
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
        outdated_count.value = Array.isArray(data) && data.length > 0 ? Number(data[0]?.count ?? 0) : 0;
        if (!Array.isArray(data) || data.length === 0) {
            console.warn('No outdated equipment data returned. Setting default value.');
        }
    }
    catch (error) {
        console.error('Error fetching outdated equipment:', error);
        outdated_count.value = 0; // ✅ Default to 0 in case of error
    }
};
const getInvalidData = async (selectedRoleId) => {
    try {
        const baseUrl = `/vw-invalid-data${selectedRoleId ? 'PerDivision' : ''}`;
        const url = `${baseUrl}?api_token=${api_token}&designation=${role_id}&office=${selectedRoleId ?? 0}`;
        const response = await api.get(url);
        const data = response.data;
        invalid_data_count.value = Number(response.data.count ?? 0);
        // const response = await api.get(
        //   `/vw-invalid-data?api_token=${api_token}&designation=${authStore.role_id}`
        // )
        // Check if response.data exists and has at least one item
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
        serial_no: {
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
            location.reload();
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
// REPORTING
const printFrame = ref(null);
const openPrintPreview = () => {
    if (!ict_report_data.value.length) {
        alert('No data available for printing.');
        return;
    }
    // -------------------------
    // Example ICT report usage
    // -------------------------
    const tableRows = ict_report_data.value
        .map((d) => `<tr>
        <td>${d.roles ?? ''}</td>
        <td>${d.equipment_title ?? ''}</td>
        <td>${d.year_acquired ?? ''}</td>
        <td>${d.shelf_life ?? ''}</td>
        <td>${d.brand ?? ''}</td>
        <td>${d.model ?? ''}</td>
        <td>${d.processor ?? ''}</td>
        <td>${d.ram_capacity ?? ''}</td>
        <td>${d.installed_gpu ?? ''}</td>
        <td>${d.range_category ?? ''}</td>
        <td>${d.os_installed ?? ''}</td>
        <td>${d.office_productivity ?? ''}</td>
        <td>${d.serial_no ?? ''}</td>
        <td>${d.property_no ?? ''}</td>
        <td>${d.acct_person ?? ''}</td>
        <td>${d.sex ?? ''}</td>
        <td>${d.employment_title ?? ''}</td>
        <td>${d.nature_work_title ?? ''}</td>
        <td>${d.actual_user ?? ''}</td>
        <td>${d.sex_2 ?? ''}</td>
        <td>${d.remarks ?? ''}</td>
        <td>${d.rict_code ?? ''}</td>
      </tr>`)
        .join('');
};
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('contextmenu', disableRightClick);
    loadUserData();
    fetchData(0);
    getCountStatus(0);
    getOutdatedEquipment(0);
    getInvalidData(0);
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
if (__VLS_ctx.openReviewForm) {
    /** @type {[typeof modal_review_form, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(modal_review_form, new modal_review_form({
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
    const __VLS_10 = __VLS_9({
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
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openReviewForm))
                return;
            __VLS_ctx.openReviewForm = false;
        }
    };
    var __VLS_11;
}
if (__VLS_ctx.openReport) {
    /** @type {[typeof modal_export_report, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(modal_export_report, new modal_export_report({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openReport),
    }));
    const __VLS_17 = __VLS_16({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openReport),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    let __VLS_19;
    let __VLS_20;
    let __VLS_21;
    const __VLS_22 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openReport))
                return;
            __VLS_ctx.openReport = false;
        }
    };
    var __VLS_18;
}
if (__VLS_ctx.openQR) {
    /** @type {[typeof modal_gen_qr, typeof modal_gen_qr, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(modal_gen_qr, new modal_gen_qr({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openQR),
    }));
    const __VLS_24 = __VLS_23({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openQR),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    let __VLS_26;
    let __VLS_27;
    let __VLS_28;
    const __VLS_29 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openQR))
                return;
            __VLS_ctx.openQR = false;
        }
    };
    var __VLS_25;
}
if (__VLS_ctx.openAttachments) {
    /** @type {[typeof modal_attachments, typeof modal_attachments, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(modal_attachments, new modal_attachments({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openAttachments),
        id: (__VLS_ctx.item_id),
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.openAttachments),
        id: (__VLS_ctx.item_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_33;
    let __VLS_34;
    let __VLS_35;
    const __VLS_36 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openAttachments))
                return;
            __VLS_ctx.openAttachments = false;
        }
    };
    var __VLS_32;
}
if (__VLS_ctx.selectQR) {
    /** @type {[typeof modal_print_qr, typeof modal_print_qr, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(modal_print_qr, new modal_print_qr({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.selectQR),
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.selectQR),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.selectQR))
                return;
            __VLS_ctx.selectQR = false;
        }
    };
    var __VLS_39;
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
const __VLS_44 = {}.DataTable;
/** @type {[typeof __VLS_components.DataTable, typeof __VLS_components.DataTable, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onRowExpand': {} },
    ...{ 'onRowCollapse': {} },
    size: "small",
    expandedRows: (__VLS_ctx.expandedRows),
    filters: (__VLS_ctx.filters),
    value: (__VLS_ctx.customers),
    paginator: true,
    stripedRows: true,
    showGridlines: true,
    rows: (10),
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
const __VLS_46 = __VLS_45({
    ...{ 'onRowExpand': {} },
    ...{ 'onRowCollapse': {} },
    size: "small",
    expandedRows: (__VLS_ctx.expandedRows),
    filters: (__VLS_ctx.filters),
    value: (__VLS_ctx.customers),
    paginator: true,
    stripedRows: true,
    showGridlines: true,
    rows: (10),
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
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onRowExpand: (__VLS_ctx.onRowExpand)
};
const __VLS_52 = {
    onRowCollapse: (__VLS_ctx.onRowCollapse)
};
__VLS_47.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_47.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-4 justify-start" },
    });
    const __VLS_53 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-add",
        label: "Add",
        outlined: true,
    }));
    const __VLS_55 = __VLS_54({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-add",
        label: "Add",
        outlined: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    let __VLS_57;
    let __VLS_58;
    let __VLS_59;
    const __VLS_60 = {
        onClick: (...[$event]) => {
            __VLS_ctx.addMore();
        }
    };
    var __VLS_56;
    const __VLS_61 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-file-export",
        label: "Export",
        outlined: true,
        ...{ style: {} },
    }));
    const __VLS_63 = __VLS_62({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-file-export",
        label: "Export",
        outlined: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    let __VLS_65;
    let __VLS_66;
    let __VLS_67;
    const __VLS_68 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openReport = true;
        }
    };
    var __VLS_64;
    const __VLS_69 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-refresh",
        label: "Refresh",
        outlined: true,
    }));
    const __VLS_71 = __VLS_70({
        ...{ 'onClick': {} },
        type: "button",
        icon: "pi pi-refresh",
        label: "Refresh",
        outlined: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    let __VLS_73;
    let __VLS_74;
    let __VLS_75;
    const __VLS_76 = {
        onClick: (...[$event]) => {
            __VLS_ctx.fetchData(0);
        }
    };
    var __VLS_72;
    const __VLS_77 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        ...{ 'onClick': {} },
        severity: "danger",
        icon: "pi pi-qrcode",
        label: "Generate QR Code [F3]",
    }));
    const __VLS_79 = __VLS_78({
        ...{ 'onClick': {} },
        severity: "danger",
        icon: "pi pi-qrcode",
        label: "Generate QR Code [F3]",
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    let __VLS_81;
    let __VLS_82;
    let __VLS_83;
    const __VLS_84 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openQR = true;
        }
    };
    var __VLS_80;
    const __VLS_85 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        ...{ 'onClick': {} },
        severity: "info",
        type: "button",
        icon: "pi pi-print",
        label: "Print Preview",
    }));
    const __VLS_87 = __VLS_86({
        ...{ 'onClick': {} },
        severity: "info",
        type: "button",
        icon: "pi pi-print",
        label: "Print Preview",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    let __VLS_89;
    let __VLS_90;
    let __VLS_91;
    const __VLS_92 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openPrintPreview();
        }
    };
    var __VLS_88;
    const __VLS_93 = {}.Select;
    /** @type {[typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        ...{ 'onUpdate:modelValue': {} },
        filter: true,
        modelValue: (__VLS_ctx.peripheral_form.mon1division2),
        options: (__VLS_ctx.division_opts),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Division",
        ...{ class: "md:w-50 pull-right" },
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onUpdate:modelValue': {} },
        filter: true,
        modelValue: (__VLS_ctx.peripheral_form.mon1division2),
        options: (__VLS_ctx.division_opts),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Division",
        ...{ class: "md:w-50 pull-right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_97;
    let __VLS_98;
    let __VLS_99;
    const __VLS_100 = {
        'onUpdate:modelValue': (__VLS_ctx.filterByOffice)
    };
    var __VLS_96;
    const __VLS_101 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        ...{ style: {} },
        severity: "info",
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        ...{ style: {} },
        severity: "info",
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_105;
    let __VLS_106;
    let __VLS_107;
    const __VLS_108 = {
        onClick: (...[$event]) => {
            __VLS_ctx.clearFilter();
        }
    };
    var __VLS_104;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ml-auto flex items-center" },
    });
    const __VLS_109 = {}.IconField;
    /** @type {[typeof __VLS_components.IconField, typeof __VLS_components.IconField, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        ...{ class: "flex items-center" },
    }));
    const __VLS_111 = __VLS_110({
        ...{ class: "flex items-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    __VLS_112.slots.default;
    const __VLS_113 = {}.InputIcon;
    /** @type {[typeof __VLS_components.InputIcon, typeof __VLS_components.InputIcon, ]} */ ;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({}));
    const __VLS_115 = __VLS_114({}, ...__VLS_functionalComponentArgsRest(__VLS_114));
    __VLS_116.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
        ...{ class: "pi pi-search" },
    });
    var __VLS_116;
    const __VLS_117 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }));
    const __VLS_119 = __VLS_118({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }, ...__VLS_functionalComponentArgsRest(__VLS_118));
    var __VLS_112;
}
const __VLS_121 = {}.Column;
/** @type {[typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    expander: true,
    ...{ style: {} },
}));
const __VLS_123 = __VLS_122({
    expander: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
const __VLS_125 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    field: "id",
    header: "Action",
}));
const __VLS_127 = __VLS_126({
    field: "id",
    header: "Action",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_128.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card flex justify-center" },
    });
    const __VLS_129 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
        ...{ 'onClick': {} },
        icon: "pi pi-eye",
        size: "small",
        ...{ class: "text-white mr-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }));
    const __VLS_131 = __VLS_130({
        ...{ 'onClick': {} },
        icon: "pi pi-eye",
        size: "small",
        ...{ class: "text-white mr-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    let __VLS_133;
    let __VLS_134;
    let __VLS_135;
    const __VLS_136 = {
        onClick: (...[$event]) => {
            __VLS_ctx.retrieveDataviaAPI(data.id);
        }
    };
    var __VLS_132;
    const __VLS_137 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
        ...{ 'onClick': {} },
        icon: "pi pi-file-edit",
        size: "small",
        ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }));
    const __VLS_139 = __VLS_138({
        ...{ 'onClick': {} },
        icon: "pi pi-file-edit",
        size: "small",
        ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    let __VLS_141;
    let __VLS_142;
    let __VLS_143;
    const __VLS_144 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewRecord(data.id);
        }
    };
    var __VLS_140;
    if (!data.file_id) {
        const __VLS_145 = {}.Button;
        /** @type {[typeof __VLS_components.Button, ]} */ ;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
            ...{ 'onClick': {} },
            icon: "pi pi-cloud-upload",
            size: "small",
            ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        }));
        const __VLS_147 = __VLS_146({
            ...{ 'onClick': {} },
            icon: "pi pi-cloud-upload",
            size: "small",
            ...{ class: "text-white mr-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        let __VLS_149;
        let __VLS_150;
        let __VLS_151;
        const __VLS_152 = {
            onClick: (...[$event]) => {
                if (!(!data.file_id))
                    return;
                __VLS_ctx.openModal(data.id);
            }
        };
        var __VLS_148;
    }
}
var __VLS_128;
const __VLS_153 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    field: "control_no",
    header: "Equipment Type",
    ...{ style: {} },
}));
const __VLS_155 = __VLS_154({
    field: "control_no",
    header: "Equipment Type",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
__VLS_156.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_156.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_157 = {}.Tag;
    /** @type {[typeof __VLS_components.Tag, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        value: (data.equipment_title),
        severity: "success",
        ...{ class: "text-center" },
    }));
    const __VLS_159 = __VLS_158({
        value: (data.equipment_title),
        severity: "success",
        ...{ class: "text-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
    (data.control_no);
}
var __VLS_156;
const __VLS_161 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    field: "attachments",
    header: "Attachments",
    ...{ style: {} },
}));
const __VLS_163 = __VLS_162({
    field: "attachments",
    header: "Attachments",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
__VLS_164.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_164.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (data.file_id) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_165 = {}.Button;
        /** @type {[typeof __VLS_components.Button, typeof __VLS_components.Button, ]} */ ;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
            ...{ 'onClick': {} },
            rel: "noopener noreferrer",
            ...{ style: {} },
            ...{ class: "text-white mr-2 border hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" },
            href: ('https://drive.google.com/file/d/' + data.file_id + '/view?usp=drive_link'),
        }));
        const __VLS_167 = __VLS_166({
            ...{ 'onClick': {} },
            rel: "noopener noreferrer",
            ...{ style: {} },
            ...{ class: "text-white mr-2 border hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" },
            href: ('https://drive.google.com/file/d/' + data.file_id + '/view?usp=drive_link'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        let __VLS_169;
        let __VLS_170;
        let __VLS_171;
        const __VLS_172 = {
            onClick: (...[$event]) => {
                if (!(data.file_id))
                    return;
                __VLS_ctx.openFile(data.id);
            }
        };
        __VLS_168.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
            ...{ class: "pi pi-external-link mr-2" },
        });
        var __VLS_168;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
}
var __VLS_164;
const __VLS_173 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
    field: "qr_code",
    header: "ICT Equipment QR Code",
    ...{ style: {} },
}));
const __VLS_175 = __VLS_174({
    field: "qr_code",
    header: "ICT Equipment QR Code",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
__VLS_176.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_176.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center items-center h-24" },
    });
    if (data.qr_code && data.qr_code.trim() !== '') {
        const __VLS_177 = {}.QrcodeVue;
        /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
        // @ts-ignore
        const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
            value: (data.qr_code),
            size: (50),
        }));
        const __VLS_179 = __VLS_178({
            value: (data.qr_code),
            size: (50),
        }, ...__VLS_functionalComponentArgsRest(__VLS_178));
    }
    (data.qr_code);
}
var __VLS_176;
const __VLS_181 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
    field: "mon_qr_code1",
    header: "Primary Monitor QR Code",
    ...{ style: {} },
}));
const __VLS_183 = __VLS_182({
    field: "mon_qr_code1",
    header: "Primary Monitor QR Code",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
__VLS_184.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_184.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center items-center h-24" },
    });
    if (data.mon_qr_code1 && data.mon_qr_code1.trim() !== '') {
        const __VLS_185 = {}.QrcodeVue;
        /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
        // @ts-ignore
        const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
            value: (data.mon_qr_code1),
            size: (50),
        }));
        const __VLS_187 = __VLS_186({
            value: (data.mon_qr_code1),
            size: (50),
        }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    }
    (data.mon_qr_code1);
}
var __VLS_184;
const __VLS_189 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
    field: "mon_qr_code2",
    header: "Secondary Monitor QR Code",
    ...{ style: {} },
}));
const __VLS_191 = __VLS_190({
    field: "mon_qr_code2",
    header: "Secondary Monitor QR Code",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
__VLS_192.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_192.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center items-center h-24" },
    });
    if (data.mon_qr_code2 && data.mon_qr_code2.trim() !== '') {
        const __VLS_193 = {}.QrcodeVue;
        /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
        // @ts-ignore
        const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
            value: (data.mon_qr_code2),
            size: (50),
        }));
        const __VLS_195 = __VLS_194({
            value: (data.mon_qr_code2),
            size: (50),
        }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    }
    (data.mon_qr_code2);
}
var __VLS_192;
const __VLS_197 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    field: "ups_qr_code",
    header: "UPS QR Code",
    ...{ style: {} },
}));
const __VLS_199 = __VLS_198({
    field: "ups_qr_code",
    header: "UPS QR Code",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
__VLS_200.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_200.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (data.ups_qr_code && data.ups_qr_code.trim() !== '') {
        const __VLS_201 = {}.QrcodeVue;
        /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
        // @ts-ignore
        const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
            value: (data.ups_qr_code),
            size: (50),
            ...{ class: "text-center" },
        }));
        const __VLS_203 = __VLS_202({
            value: (data.ups_qr_code),
            size: (50),
            ...{ class: "text-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_202));
    }
    (data.ups_qr_code);
}
var __VLS_200;
{
    const { expansion: __VLS_thisSlot } = __VLS_47.slots;
    const [slotProps] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: "font-semibold mb-2" },
    });
    const __VLS_205 = {}.DataTable;
    /** @type {[typeof __VLS_components.DataTable, typeof __VLS_components.DataTable, ]} */ ;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
        size: "small",
        showGridlines: true,
        value: ([slotProps.data]),
    }));
    const __VLS_207 = __VLS_206({
        size: "small",
        showGridlines: true,
        value: ([slotProps.data]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    __VLS_208.slots.default;
    const __VLS_209 = {}.Column;
    /** @type {[typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
        field: "brand",
        header: "Brand",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_211 = __VLS_210({
        field: "brand",
        header: "Brand",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_210));
    const __VLS_213 = {}.Column;
    /** @type {[typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
        field: "serial_no",
        header: "Serial No",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_215 = __VLS_214({
        field: "serial_no",
        header: "Serial No",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    const __VLS_217 = {}.Column;
    /** @type {[typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
        field: "property_no",
        header: "Property No",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_219 = __VLS_218({
        field: "property_no",
        header: "Property No",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_218));
    const __VLS_221 = {}.Column;
    /** @type {[typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
        field: "acct_person",
        header: "Accountable Person",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_223 = __VLS_222({
        field: "acct_person",
        header: "Accountable Person",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_222));
    const __VLS_225 = {}.Column;
    /** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
        field: "roles",
        header: "Office/Division",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_227 = __VLS_226({
        field: "roles",
        header: "Office/Division",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    __VLS_228.slots.default;
    {
        const { body: __VLS_thisSlot } = __VLS_228.slots;
        const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
        (data.roles);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
        (data.acct_person_division_id);
    }
    var __VLS_228;
    const __VLS_229 = {}.Column;
    /** @type {[typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
        field: "actual_user",
        header: "Actual User",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_231 = __VLS_230({
        field: "actual_user",
        header: "Actual User",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_230));
    const __VLS_233 = {}.Column;
    /** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
        field: "roles",
        header: "Office/Division",
        ...{ style: {} },
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_235 = __VLS_234({
        field: "roles",
        header: "Office/Division",
        ...{ style: {} },
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_234));
    __VLS_236.slots.default;
    {
        const { body: __VLS_thisSlot } = __VLS_236.slots;
        const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
        (data.roles);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
        (data.actual_user_division_id);
    }
    var __VLS_236;
    const __VLS_237 = {}.Column;
    /** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
        field: "full_specs",
        header: "Specifications / Descriptions",
        ...{ style: {} },
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_239 = __VLS_238({
        field: "full_specs",
        header: "Specifications / Descriptions",
        ...{ style: {} },
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    __VLS_240.slots.default;
    {
        const { body: __VLS_thisSlot } = __VLS_240.slots;
        const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "wrap-text" },
        });
        (data.installed_gpu);
        (data.processor);
        (data.ram_type);
    }
    var __VLS_240;
    const __VLS_241 = {}.Column;
    /** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
        field: "status",
        header: "Status",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_243 = __VLS_242({
        field: "status",
        header: "Status",
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_242));
    __VLS_244.slots.default;
    {
        const { body: __VLS_thisSlot } = __VLS_244.slots;
        const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_245 = {}.Tag;
        /** @type {[typeof __VLS_components.Tag, ]} */ ;
        // @ts-ignore
        const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
            value: (data.status),
            severity: (__VLS_ctx.getSeverity(data.status)),
        }));
        const __VLS_247 = __VLS_246({
            value: (data.status),
            severity: (__VLS_ctx.getSeverity(data.status)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_246));
    }
    var __VLS_244;
    const __VLS_249 = {}.Column;
    /** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
        field: "range_category",
        header: "Range Category",
        ...{ style: {} },
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }));
    const __VLS_251 = __VLS_250({
        field: "range_category",
        header: "Range Category",
        ...{ style: {} },
        headerStyle: ({ backgroundColor: '#f1f5f9', color: '#000', fontWeight: 'bold' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_250));
    __VLS_252.slots.default;
    {
        const { body: __VLS_thisSlot } = __VLS_252.slots;
        const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
        (data.range_category);
    }
    var __VLS_252;
    var __VLS_208;
}
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.iframe, __VLS_intrinsicElements.iframe)({
    ref: "printFrame",
    ...{ class: "hidden" },
    title: "Print Preview",
    ...{ style: {} },
});
/** @type {typeof __VLS_ctx.printFrame} */ ;
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
/** @type {__VLS_StyleScopedClasses['bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-800']} */ ;
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
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-orange-300']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-external-link']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-24']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-24']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['h-24']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['wrap-text']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
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
            expandedRows: expandedRows,
            software: software,
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
            item: item,
            onRowExpand: onRowExpand,
            onRowCollapse: onRowCollapse,
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
            printFrame: printFrame,
            openPrintPreview: openPrintPreview,
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
