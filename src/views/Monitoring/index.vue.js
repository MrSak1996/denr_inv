import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useApi } from '@/composables/useApi';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import api from '@/api/axiosInstance';
import { useAuthStore } from '@/stores/authStore';
import modal_excel_fileuploader from './modal/modal_excel_fileuploader.vue';
const authStore = useAuthStore();
const { fetchCurUser, roles_opts, getUserRoles } = useApi();
const route = useRoute();
const toast = useToast();
const userId = route.query.id;
const api_token = route.query.api_token;
const imported_data = ref([]);
const filters = ref();
const loading = ref(false);
const progress = ref(0);
const isLoading = ref(false);
const openFileUploader = ref(false);
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
const fetchImportedData = async () => {
    try {
        startProgress();
        const response = await api.get(`/file-summary`);
        loading.value = false;
        imported_data.value = response.data.data;
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
const openModal = async () => {
    openFileUploader.value = true;
};
const formatMessage = (message) => {
    if (!message)
        return '';
    // Preserve emojis and timestamps; replace newlines with <br>
    return message.replace(/\n/g, '<br>');
};
const formatDetails = (details) => {
    if (!details)
        return '';
    try {
        const parsed = typeof details === 'string' ? JSON.parse(details) : details;
        return JSON.stringify(parsed, null, 2);
    }
    catch {
        return details;
    }
};
initFilters();
onMounted(() => {
    loadUserData();
    getUserRoles(authStore.role_id);
    fetchImportedData();
});
// Page title
const pageTitle = ref('Data Monitoring');
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
if (__VLS_ctx.openFileUploader) {
    /** @type {[typeof modal_excel_fileuploader, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(modal_excel_fileuploader, new modal_excel_fileuploader({
        ...{ 'onClose': {} },
        ...{ 'onUploaded': {} },
        open: (__VLS_ctx.openFileUploader),
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClose': {} },
        ...{ 'onUploaded': {} },
        open: (__VLS_ctx.openFileUploader),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_15;
    let __VLS_16;
    let __VLS_17;
    const __VLS_18 = {
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.openFileUploader))
                return;
            __VLS_ctx.openFileUploader = false;
        }
    };
    const __VLS_19 = {
        onUploaded: (...[$event]) => {
            if (!(__VLS_ctx.openFileUploader))
                return;
            __VLS_ctx.fetchImportedData();
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
const __VLS_20 = {}.DataTable;
/** @type {[typeof __VLS_components.DataTable, typeof __VLS_components.DataTable, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    size: "small",
    value: (__VLS_ctx.imported_data),
    paginator: true,
    showGridlines: true,
    rows: (10),
    dataKey: "filename",
    loading: (__VLS_ctx.loading),
    globalFilterFields: (['filename', 'created_at', 'uploaded_by']),
}));
const __VLS_22 = __VLS_21({
    size: "small",
    value: (__VLS_ctx.imported_data),
    paginator: true,
    showGridlines: true,
    rows: (10),
    dataKey: "filename",
    loading: (__VLS_ctx.loading),
    globalFilterFields: (['filename', 'created_at', 'uploaded_by']),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_23.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-4 justify-start" },
    });
    const __VLS_24 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5" },
        icon: "pi pi-filter-slash",
        label: "Clear",
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5" },
        icon: "pi pi-filter-slash",
        label: "Clear",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onClick: (__VLS_ctx.clearFilter)
    };
    var __VLS_27;
    const __VLS_32 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5" },
        icon: "pi pi-file-export",
        label: "Import Report",
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5" },
        icon: "pi pi-file-export",
        label: "Import Report",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_36;
    let __VLS_37;
    let __VLS_38;
    const __VLS_39 = {
        onClick: (__VLS_ctx.openModal)
    };
    var __VLS_35;
}
const __VLS_40 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    field: "filename",
    header: "File Name",
    ...{ style: {} },
}));
const __VLS_42 = __VLS_41({
    field: "filename",
    header: "File Name",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_43.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-semibold" },
    });
    (data.filename);
}
var __VLS_43;
const __VLS_44 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    field: "message",
    header: "Message",
    ...{ style: {} },
}));
const __VLS_46 = __VLS_45({
    field: "message",
    header: "Message",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_47.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded-md border overflow-y-auto  max-w-[600px] max-h-32 leading-relaxed" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.formatMessage(data.message)) }, null, null);
}
var __VLS_47;
const __VLS_48 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    field: "details",
    header: "Details",
    ...{ style: {} },
}));
const __VLS_50 = __VLS_49({
    field: "details",
    header: "Details",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_51.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-gray-50 text-xs p-2 rounded-md border overflow-y-auto max-h-32 max-w-[250px] whitespace-pre-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({});
    (__VLS_ctx.formatDetails(data.details));
}
var __VLS_51;
const __VLS_52 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    field: "created_at",
    header: "Date Imported",
    ...{ style: {} },
}));
const __VLS_54 = __VLS_53({
    field: "created_at",
    header: "Date Imported",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_55.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (new Date(data.created_at).toLocaleString());
}
var __VLS_55;
const __VLS_56 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    field: "uploaded_by",
    header: "Uploaded By",
    ...{ style: {} },
}));
const __VLS_58 = __VLS_57({
    field: "uploaded_by",
    header: "Uploaded By",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_59.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.uploaded_by);
}
var __VLS_59;
var __VLS_23;
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
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-start']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-green-800']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-pre-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[600px]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-50']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-32']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-[250px]']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-pre-wrap']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            modal_excel_fileuploader: modal_excel_fileuploader,
            imported_data: imported_data,
            loading: loading,
            openFileUploader: openFileUploader,
            fetchImportedData: fetchImportedData,
            clearFilter: clearFilter,
            openModal: openModal,
            formatMessage: formatMessage,
            formatDetails: formatDetails,
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
