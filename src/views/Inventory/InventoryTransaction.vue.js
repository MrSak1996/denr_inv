import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import api from '@/api/axiosInstance';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
const { fetchCurUser } = useApi();
const route = useRoute();
const userId = route.query.id;
const api_token = route.query.api_token;
const trans_logs = ref([]);
const filters = ref();
const loading = ref(false);
const progress = ref(0);
const isLoading = ref(false);
const isModalOpen = ref(false);
const currentMessage = ref('Loading, please wait...');
const authStore = useAuthStore();
const messages = ref([
    'Loading, please wait...',
    'Processing data...',
    'Initializing data...',
    'Fetching resources...',
    'Preparing your data...',
    'Almost there, hang tight...'
]);
const user_role = ref(0);
const designation = ref('');
const loadUserData = async () => {
    const userData = await fetchCurUser();
    user_role.value = userData.data[0].role_id;
    designation.value = userData.data[0].roles;
};
const startProgress = () => {
    progress.value = 0;
    isLoading.value = true;
    updateMessage();
    const interval = setInterval(() => {
        if (progress.value < 90) {
            progress.value += Number((Math.random() * 10).toFixed(2)); // Simulate progress increase
            updateMessage();
        }
        else {
            clearInterval(interval);
        }
    }, 500);
};
const completeProgress = () => {
    progress.value = 100;
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
};
const updateMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.value.length);
    currentMessage.value = messages.value[randomIndex];
};
const fetchTransaction = async () => {
    try {
        startProgress(); // Start the progress bar
        const api_token = localStorage.getItem('api_token');
        const userData = await fetchCurUser();
        const response = await api.get(`/fetchTransaction?api_token=${api_token}&designation=${authStore.role_id}`);
        loading.value = false;
        trans_logs.value = response.data.data; // Process the fetched data
        completeProgress(); // Stop the progress bar
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        loading.value = false;
        completeProgress(); // Stop the progress bar even in case of error
    }
};
const initFilters = () => {
    filters.value = {
        id: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        transaction_type: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        qr_code: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        quantity: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        previous_quantity: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        current_quantity: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        destination_location: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        accountable_user: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        transaction_date: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        remarks: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        updated_by: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        }
    };
};
const clearFilter = () => {
    initFilters();
};
const getSeverity = (status) => {
    switch (status) {
        case 'Serviceable':
            return 'success';
        case 'Unserviceable':
            return 'danger';
    }
};
const viewRecord = (id) => {
    router.push({
        path: `/inventory/create/${id}`,
        query: { api_token: localStorage.getItem('api_token') }
    });
};
const resetForm = () => {
    // Add logic to reset form fields here
    console.log('Form reset logic goes here');
};
const closeModal = () => {
    isModalOpen.value = false;
    resetForm();
};
const updateFilterWithQrValue = (qrValue) => {
    filters.value['global'].value = qrValue;
};
initFilters();
onMounted(() => {
    loadUserData();
    fetchTransaction();
});
// Page title
const pageTitle = ref('ICT Equipment Transaction Logs');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
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
const __VLS_9 = {}.DataTable;
/** @type {[typeof __VLS_components.DataTable, typeof __VLS_components.DataTable, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    size: "small",
    filters: (__VLS_ctx.filters),
    value: (__VLS_ctx.trans_logs),
    paginator: true,
    showGridlines: true,
    rows: (10),
    dataKey: "id",
    filterDisplay: "menu",
    loading: (__VLS_ctx.loading),
    globalFilterFields: ([
        'transaction_type',
        'qr_code',
        'quantity',
        'equipment_title',
        'accountable_user',
        'destination_location',
        'transaction_date',
        'remarks',
        'updated_by'
    ]),
}));
const __VLS_11 = __VLS_10({
    size: "small",
    filters: (__VLS_ctx.filters),
    value: (__VLS_ctx.trans_logs),
    paginator: true,
    showGridlines: true,
    rows: (10),
    dataKey: "id",
    filterDisplay: "menu",
    loading: (__VLS_ctx.loading),
    globalFilterFields: ([
        'transaction_type',
        'qr_code',
        'quantity',
        'equipment_title',
        'accountable_user',
        'destination_location',
        'transaction_date',
        'remarks',
        'updated_by'
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
__VLS_12.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_12.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-4 justify-start" },
    });
    const __VLS_13 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_17;
    let __VLS_18;
    let __VLS_19;
    const __VLS_20 = {
        onClick: (...[$event]) => {
            __VLS_ctx.clearFilter();
        }
    };
    var __VLS_16;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ml-auto flex items-center" },
    });
    const __VLS_21 = {}.IconField;
    /** @type {[typeof __VLS_components.IconField, typeof __VLS_components.IconField, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        ...{ class: "flex items-center" },
    }));
    const __VLS_23 = __VLS_22({
        ...{ class: "flex items-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    const __VLS_25 = {}.InputIcon;
    /** @type {[typeof __VLS_components.InputIcon, typeof __VLS_components.InputIcon, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
        ...{ class: "pi pi-search" },
    });
    var __VLS_28;
    const __VLS_29 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }));
    const __VLS_31 = __VLS_30({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    var __VLS_24;
}
const __VLS_33 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    field: "transaction_type",
    header: "Transaction Type",
    ...{ style: {} },
}));
const __VLS_35 = __VLS_34({
    field: "transaction_type",
    header: "Transaction Type",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_36.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-center items-center" },
    });
    const __VLS_37 = {}.Tag;
    /** @type {[typeof __VLS_components.Tag, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        value: (data.transaction_type),
        severity: "success",
        ...{ class: "text-center" },
    }));
    const __VLS_39 = __VLS_38({
        value: (data.transaction_type),
        severity: "success",
        ...{ class: "text-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
}
{
    const { filter: __VLS_thisSlot } = __VLS_36.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_41 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by transaction",
    }));
    const __VLS_43 = __VLS_42({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by transaction",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
}
var __VLS_36;
const __VLS_45 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
    field: "qr_code",
    header: "QR Code",
    ...{ style: {} },
}));
const __VLS_47 = __VLS_46({
    field: "qr_code",
    header: "QR Code",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_48.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (data.qr_code && data.qr_code.trim() !== '') {
        const __VLS_49 = {}.QrcodeVue;
        /** @type {[typeof __VLS_components.QrcodeVue, ]} */ ;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
            value: (data.qr_code),
            size: (80),
            ...{ class: "text-center" },
        }));
        const __VLS_51 = __VLS_50({
            value: (data.qr_code),
            size: (80),
            ...{ class: "text-center" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    }
    (data.qr_code);
}
{
    const { filter: __VLS_thisSlot } = __VLS_48.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_53 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_55 = __VLS_54({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
}
var __VLS_48;
const __VLS_57 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
    field: "source_location",
    header: "Source Location",
    ...{ style: {} },
}));
const __VLS_59 = __VLS_58({
    field: "source_location",
    header: "Source Location",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_60.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_60.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.source_location);
}
{
    const { filter: __VLS_thisSlot } = __VLS_60.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_61 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by source location",
    }));
    const __VLS_63 = __VLS_62({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by source location",
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
}
var __VLS_60;
const __VLS_65 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    field: "destination_location",
    header: "Destination Location",
    ...{ style: {} },
}));
const __VLS_67 = __VLS_66({
    field: "destination_location",
    header: "Destination Location",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_68.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.destination_location);
}
{
    const { filter: __VLS_thisSlot } = __VLS_68.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_69 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by destination",
    }));
    const __VLS_71 = __VLS_70({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by destination",
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
}
var __VLS_68;
const __VLS_73 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    field: "accountable_user",
    header: "Accountable User",
    ...{ style: {} },
}));
const __VLS_75 = __VLS_74({
    field: "accountable_user",
    header: "Accountable User",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_76.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.accountable_user);
}
{
    const { filter: __VLS_thisSlot } = __VLS_76.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_77 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by destination",
    }));
    const __VLS_79 = __VLS_78({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by destination",
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
}
var __VLS_76;
const __VLS_81 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    field: "transaction_date",
    header: "Transaction Date",
    ...{ style: {} },
}));
const __VLS_83 = __VLS_82({
    field: "transaction_date",
    header: "Transaction Date",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_84.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.transaction_date);
}
{
    const { filter: __VLS_thisSlot } = __VLS_84.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_85 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_87 = __VLS_86({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
}
var __VLS_84;
const __VLS_89 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    field: "remarks",
    header: "Remarks",
    ...{ style: {} },
}));
const __VLS_91 = __VLS_90({
    field: "remarks",
    header: "Remarks",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_92.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.remarks);
}
{
    const { filter: __VLS_thisSlot } = __VLS_92.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_93 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by remarks",
    }));
    const __VLS_95 = __VLS_94({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by remarks",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
}
var __VLS_92;
const __VLS_97 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    field: "updated_by",
    header: "Updated By",
    ...{ style: {} },
}));
const __VLS_99 = __VLS_98({
    field: "updated_by",
    header: "Updated By",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
__VLS_100.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_100.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.updated_by);
}
{
    const { filter: __VLS_thisSlot } = __VLS_100.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_101 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_103 = __VLS_102({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
}
var __VLS_100;
var __VLS_12;
var __VLS_3;
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
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
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
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-search']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            trans_logs: trans_logs,
            filters: filters,
            loading: loading,
            progress: progress,
            isLoading: isLoading,
            currentMessage: currentMessage,
            clearFilter: clearFilter,
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
