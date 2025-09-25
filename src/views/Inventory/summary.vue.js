import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useApi } from '@/composables/useApi';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import api from '@/api/axiosInstance';
import { useAuthStore } from '@/stores/authStore';
import modal_export_summary_report from './modal/modal_export_summary_report.vue';
const authStore = useAuthStore();
const { fetchCurUser, roles_opts, getUserRoles } = useApi();
const route = useRoute();
const toast = useToast();
const userId = route.query.id;
const api_token = route.query.api_token;
const trans_logs = ref([]);
const filters = ref();
const loading = ref(false);
const progress = ref(0);
const isLoading = ref(false);
const isModalOpen = ref(false);
const currentMessage = ref('Loading, please wait...');
const selectedRole = ref(null); // Selected role from dropdown
const messages = ref([
    'Loading, please wait...',
    'Processing data...',
    'Initializing data...',
    'Fetching resources...',
    'Preparing your data...',
    'Almost there, hang tight...'
]);
const generating = ref(false);
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
const exportData = async () => {
    if (!selectedRole.value) {
        toast.add({
            severity: "warn",
            summary: "Missing Selection",
            detail: "Please select a division before exporting.",
            life: 3000,
        });
        return;
    }
    try {
        generating.value = true;
        progress.value = 10;
        // Simulate progress updates
        const progressInterval = setInterval(() => {
            if (progress.value < 90) {
                progress.value += 10;
            }
        }, 500);
        const response = await api.get(`https://riis.denrcalabarzon.com/api/exportSummary?export=true&role_id=${selectedRole.value}`, {
            responseType: "blob",
        });
        clearInterval(progressInterval);
        progress.value = 100;
        // Download the file
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "summary_report.xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
    catch (err) {
        toast.add({
            severity: "error",
            summary: "Export Failed",
            detail: "Error generating the report. Please try again.",
            life: 3000,
        });
    }
    finally {
        setTimeout(() => {
            generating.value = false;
            progress.value = 0;
        }, 1000);
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
const __VLS_8 = {}.BreadcrumbDefault;
/** @type {[typeof __VLS_components.BreadcrumbDefault, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    pageTitle: (__VLS_ctx.pageTitle),
}));
const __VLS_10 = __VLS_9({
    pageTitle: (__VLS_ctx.pageTitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
if (__VLS_ctx.isModalOpen) {
    /** @type {[typeof modal_export_summary_report, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(modal_export_summary_report, new modal_export_summary_report({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.isModalOpen),
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClose': {} },
        open: (__VLS_ctx.isModalOpen),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_15;
    let __VLS_16;
    let __VLS_17;
    const __VLS_18 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.isModalOpen))
                return;
            __VLS_ctx.isModalOpen = false;
        }
    };
    var __VLS_14;
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
const __VLS_19 = {}.DataTable;
/** @type {[typeof __VLS_components.DataTable, typeof __VLS_components.DataTable, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
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
const __VLS_21 = __VLS_20({
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
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_22.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-4 justify-start" },
    });
    const __VLS_23 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_27;
    let __VLS_28;
    let __VLS_29;
    const __VLS_30 = {
        onClick: (...[$event]) => {
            __VLS_ctx.clearFilter();
        }
    };
    var __VLS_26;
    const __VLS_31 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-file-export",
        label: "Export Report",
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-file-export",
        label: "Export Report",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_35;
    let __VLS_36;
    let __VLS_37;
    const __VLS_38 = {
        onClick: (...[$event]) => {
            __VLS_ctx.exportData();
        }
    };
    var __VLS_34;
    const __VLS_39 = {}.Select;
    /** @type {[typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        ...{ 'onUpdate:modelValue': {} },
        filter: true,
        modelValue: (__VLS_ctx.selectedRole),
        options: (__VLS_ctx.roles_opts),
        optionLabel: "name",
        optionValue: "id",
        placeholder: "Division",
        ...{ class: "w-50" },
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onUpdate:modelValue': {} },
        filter: true,
        modelValue: (__VLS_ctx.selectedRole),
        options: (__VLS_ctx.roles_opts),
        optionLabel: "name",
        optionValue: "id",
        placeholder: "Division",
        ...{ class: "w-50" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_43;
    let __VLS_44;
    let __VLS_45;
    const __VLS_46 = {
        'onUpdate:modelValue': (__VLS_ctx.summary)
    };
    var __VLS_42;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ml-auto flex items-center" },
    });
    const __VLS_47 = {}.IconField;
    /** @type {[typeof __VLS_components.IconField, typeof __VLS_components.IconField, ]} */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        ...{ class: "flex items-center" },
    }));
    const __VLS_49 = __VLS_48({
        ...{ class: "flex items-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    __VLS_50.slots.default;
    const __VLS_51 = {}.InputIcon;
    /** @type {[typeof __VLS_components.InputIcon, typeof __VLS_components.InputIcon, ]} */ ;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({}));
    const __VLS_53 = __VLS_52({}, ...__VLS_functionalComponentArgsRest(__VLS_52));
    __VLS_54.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
        ...{ class: "pi pi-search" },
    });
    var __VLS_54;
    const __VLS_55 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }));
    const __VLS_57 = __VLS_56({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    var __VLS_50;
}
const __VLS_59 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    field: "equipment_title",
    header: "Equipment Type",
    ...{ style: {} },
}));
const __VLS_61 = __VLS_60({
    field: "equipment_title",
    header: "Equipment Type",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_62.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.equipment_title);
}
var __VLS_62;
const __VLS_63 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    header: "2025",
    field: "year_2025",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}));
const __VLS_65 = __VLS_64({
    header: "2025",
    field: "year_2025",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_66.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.year_2025);
}
var __VLS_66;
const __VLS_67 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    header: "2024",
    field: "year_2024",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}));
const __VLS_69 = __VLS_68({
    header: "2024",
    field: "year_2024",
    filterMenuStyle: ({ width: '14rem' }),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_70.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.year_2024);
}
var __VLS_70;
const __VLS_71 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    field: "year_2023",
    header: "2023",
    ...{ style: {} },
}));
const __VLS_73 = __VLS_72({
    field: "year_2023",
    header: "2023",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_74.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.year_2023);
}
var __VLS_74;
const __VLS_75 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    field: "year_2022",
    header: "2022",
    ...{ style: {} },
}));
const __VLS_77 = __VLS_76({
    field: "year_2022",
    header: "2022",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_78.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.year_2022);
}
var __VLS_78;
const __VLS_79 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    field: "below_2021",
    header: "2021 Below",
    ...{ style: {} },
}));
const __VLS_81 = __VLS_80({
    field: "below_2021",
    header: "2021 Below",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_82.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_82.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.below_2021);
}
var __VLS_82;
var __VLS_22;
var __VLS_7;
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
            exportData: exportData,
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
