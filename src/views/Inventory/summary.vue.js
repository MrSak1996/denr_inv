import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import api from '@/api/axiosInstance';
import { useAuthStore } from '@/stores/authStore';
import modal_export_summary_report from './modal/modal_export_summary_report.vue';
const authStore = useAuthStore();
const { fetchCurUser, roles_opts, getUserRoles } = useApi();
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
const selectedRole = ref(null);
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
const user_id = ref('');
const loadUserData = async () => {
    const userData = await fetchCurUser();
    user_role.value = userData.data[0].role_id;
    designation.value = userData.data[0].roles;
    user_id.value = userData.data[0].id;
    summary(Number(user_id.value));
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
const summary = async (selectedRoleId) => {
    try {
        startProgress();
        const api_token = authStore.api_token;
        const response = await api.get(`/getSummaryData?id=${user_id.value}&role_id=${selectedRoleId}&api_token=${api_token}`);
        loading.value = false;
        trans_logs.value = response.data.data;
        completeProgress();
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        loading.value = false;
        completeProgress();
    }
};
const initFilters = () => {
    filters.value = {
        id: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        equipment_title: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        year_202: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        year_2023: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        year_2022: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        below_2021: {
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
watch(() => selectedRole, async (newRoleId) => {
    if (newRoleId) {
        summary(Number(user_id.value));
    }
});
initFilters();
onMounted(() => {
    loadUserData();
    getUserRoles(authStore.role_id);
});
// Page title
const pageTitle = ref('TOTAL NUMBER OF FUNCTIONING UNITS BY YEAR ACQUIRED');
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
if (__VLS_ctx.isModalOpen) {
    /** @type {[typeof modal_export_summary_report, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(modal_export_summary_report, new modal_export_summary_report({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.isModalOpen),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.isModalOpen),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.isModalOpen))
                return;
            __VLS_ctx.isModalOpen = false;
        }
    };
    var __VLS_11;
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
const __VLS_16 = {}.DataTable;
/** @type {[typeof __VLS_components.DataTable, typeof __VLS_components.DataTable, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
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
        'equipment_title',
        'year_2024',
        'year_2023',
        'year_2023',
        'below_2021'
    ]),
}));
const __VLS_18 = __VLS_17({
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
        'equipment_title',
        'year_2024',
        'year_2023',
        'year_2023',
        'below_2021'
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_19.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-4 justify-start" },
    });
    const __VLS_20 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onClick: (...[$event]) => {
            __VLS_ctx.clearFilter();
        }
    };
    var __VLS_23;
    const __VLS_28 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-file-export",
        label: "Export Report",
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-file-export",
        label: "Export Report",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (...[$event]) => {
            __VLS_ctx.isModalOpen = true;
        }
    };
    var __VLS_31;
    const __VLS_36 = {}.Select;
    /** @type {[typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onUpdate:modelValue': {} },
        filter: true,
        modelValue: (__VLS_ctx.selectedRole),
        options: (__VLS_ctx.roles_opts),
        optionLabel: "name",
        optionValue: "id",
        placeholder: "Division",
        ...{ class: "w-50" },
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onUpdate:modelValue': {} },
        filter: true,
        modelValue: (__VLS_ctx.selectedRole),
        options: (__VLS_ctx.roles_opts),
        optionLabel: "name",
        optionValue: "id",
        placeholder: "Division",
        ...{ class: "w-50" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        'onUpdate:modelValue': (__VLS_ctx.summary)
    };
    var __VLS_39;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ml-auto flex items-center" },
    });
    const __VLS_44 = {}.IconField;
    /** @type {[typeof __VLS_components.IconField, typeof __VLS_components.IconField, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ class: "flex items-center" },
    }));
    const __VLS_46 = __VLS_45({
        ...{ class: "flex items-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    const __VLS_48 = {}.InputIcon;
    /** @type {[typeof __VLS_components.InputIcon, typeof __VLS_components.InputIcon, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
    const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
        ...{ class: "pi pi-search" },
    });
    var __VLS_51;
    const __VLS_52 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }));
    const __VLS_54 = __VLS_53({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    var __VLS_47;
}
const __VLS_56 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    field: "equipment_title",
    header: "Equipment Type",
    ...{ style: {} },
}));
const __VLS_58 = __VLS_57({
    field: "equipment_title",
    header: "Equipment Type",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_59.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.equipment_title);
}
var __VLS_59;
const __VLS_60 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    header: "2025",
    field: "year_2025",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}));
const __VLS_62 = __VLS_61({
    header: "2025",
    field: "year_2025",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_63.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.year_2025);
}
var __VLS_63;
const __VLS_64 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    header: "2024",
    field: "year_2024",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}));
const __VLS_66 = __VLS_65({
    header: "2024",
    field: "year_2024",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_67.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.year_2024);
}
var __VLS_67;
const __VLS_68 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    field: "year_2023",
    header: "2023",
    ...{ style: {} },
}));
const __VLS_70 = __VLS_69({
    field: "year_2023",
    header: "2023",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_71.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.year_2023);
}
var __VLS_71;
const __VLS_72 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    field: "year_2022",
    header: "2022",
    ...{ style: {} },
}));
const __VLS_74 = __VLS_73({
    field: "year_2022",
    header: "2022",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_75.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.year_2022);
}
var __VLS_75;
const __VLS_76 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    field: "below_2021",
    header: "2021 Below",
    ...{ style: {} },
}));
const __VLS_78 = __VLS_77({
    field: "below_2021",
    header: "2021 Below",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_79.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.below_2021);
}
var __VLS_79;
var __VLS_19;
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
/** @type {__VLS_StyleScopedClasses['w-50']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pi']} */ ;
/** @type {__VLS_StyleScopedClasses['pi-search']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            modal_export_summary_report: modal_export_summary_report,
            roles_opts: roles_opts,
            trans_logs: trans_logs,
            filters: filters,
            loading: loading,
            progress: progress,
            isLoading: isLoading,
            isModalOpen: isModalOpen,
            currentMessage: currentMessage,
            selectedRole: selectedRole,
            summary: summary,
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
