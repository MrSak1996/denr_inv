import { ref, onMounted } from 'vue';
import router from '@/router';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Fieldset from 'primevue/fieldset';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import api from '@/api/axiosInstance';
const users = ref([]);
const filters = ref();
const loading = ref(false);
const progress = ref(0);
const user_id = ref(0);
const isLoading = ref(false);
const isModalOpen = ref(false);
const currentMessage = ref('Loading, please wait...');
const selectedCategory = ref('Production');
const messages = ref([
    'Loading, please wait...',
    'Processing data...',
    'Initializing data...',
    'Fetching resources...',
    'Preparing your data...',
    'Almost there, hang tight...'
]);
const usermanagement_roles = ref([
    { name: 'User Management Section - Manage Accounts', key: 'A' },
    { name: 'User Management Section - Viewing User Activity Logs', key: 'A' },
    { name: 'User Management Section - Creating New Users', key: 'A' },
    { name: 'User Management Section - Editing User Profiles', key: 'A' },
    { name: 'User Management Section - Disabling/Enabling User Accounts', key: 'A' },
    { name: 'User Management Section - Assigning User Roles', key: 'A' },
    { name: 'User Management Section - Resetting User Passwords', key: 'A' }
]);
// Start progress bar animation
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
// Complete progress bar animation
const completeProgress = () => {
    progress.value = 100;
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
};
// Random message for progress updates
const updateMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.value.length);
    currentMessage.value = messages.value[randomIndex];
};
// Fetch customer data from the API
const fetchData = async () => {
    try {
        startProgress(); // Start the progress bar
        const response = await api.get(`/getUsers`);
        users.value = response.data.data; // Process the fetched data
        loading.value = false;
        completeProgress(); // Stop the progress bar
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        loading.value = false;
        completeProgress(); // Stop the progress bar even in case of error
    }
};
// Initialize filter values
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        roles: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        name: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        division_title: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        position: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        username: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        email: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        },
        mobile_no: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
        }
    };
};
initFilters();
// Clear all filters
const clearFilter = () => {
    initFilters();
};
const editAccount = (id) => {
    router.push({ name: 'EditAccount', params: { id } });
};
//Assigning roles
const openModal = (id) => {
    isModalOpen.value = true;
    user_id.value = id;
};
const closeModal = () => {
    isModalOpen.value = false;
};
onMounted(() => {
    fetchData();
});
// Page title
const pageTitle = ref('User Management');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
/** @type {[typeof DefaultLayout, typeof DefaultLayout, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DefaultLayout, new DefaultLayout({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
__VLS_2.slots.default;
/** @type {[typeof BreadcrumbDefault, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(BreadcrumbDefault, new BreadcrumbDefault({
    pageTitle: (__VLS_ctx.pageTitle),
}));
const __VLS_5 = __VLS_4({
    pageTitle: (__VLS_ctx.pageTitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-12 gap-6 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-12 md:col-span-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-white p-4 rounded-lg shadow-md" },
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
    const __VLS_7 = {}.Fieldset;
    /** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
        legend: "Roles & Assignment",
    }));
    const __VLS_9 = __VLS_8({
        legend: "Roles & Assignment",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_10.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid md:grid-cols-1 md:gap-6 mb-4 mt-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card flex justify-left" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col gap-4" },
    });
    for (const [category] of __VLS_getVForSourceType((__VLS_ctx.usermanagement_roles))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (category.key),
            ...{ class: "flex items-center gap-2" },
        });
        const __VLS_11 = {}.Checkbox;
        /** @type {[typeof __VLS_components.Checkbox, ]} */ ;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
            modelValue: (__VLS_ctx.selectedCategory),
            inputId: (category.key),
            name: "dynamic",
            value: (category.name),
        }));
        const __VLS_13 = __VLS_12({
            modelValue: (__VLS_ctx.selectedCategory),
            inputId: (category.key),
            name: "dynamic",
            value: (category.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            for: (category.key),
        });
        (category.name);
    }
    var __VLS_10;
}
const __VLS_15 = {}.DataTable;
/** @type {[typeof __VLS_components.DataTable, typeof __VLS_components.DataTable, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    size: "small",
    filters: (__VLS_ctx.filters),
    value: (__VLS_ctx.users),
    paginator: true,
    showGridlines: true,
    rows: (10),
    dataKey: "id",
    filterDisplay: "menu",
    loading: (__VLS_ctx.loading),
    globalFilterFields: ([
        'id',
        'roles',
        'name',
        'diviison_title',
        'position',
        'username',
        'email',
        'mobile_no'
    ]),
}));
const __VLS_17 = __VLS_16({
    size: "small",
    filters: (__VLS_ctx.filters),
    value: (__VLS_ctx.users),
    paginator: true,
    showGridlines: true,
    rows: (10),
    dataKey: "id",
    filterDisplay: "menu",
    loading: (__VLS_ctx.loading),
    globalFilterFields: ([
        'id',
        'roles',
        'name',
        'diviison_title',
        'position',
        'username',
        'email',
        'mobile_no'
    ]),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_18.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-4 justify-start" },
    });
    const __VLS_19 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        ...{ class: "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        type: "button",
        icon: "pi pi-filter-slash",
        label: "Clear",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_23;
    let __VLS_24;
    let __VLS_25;
    const __VLS_26 = {
        onClick: (...[$event]) => {
            __VLS_ctx.clearFilter();
        }
    };
    var __VLS_22;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ml-auto flex items-center" },
    });
    const __VLS_27 = {}.IconField;
    /** @type {[typeof __VLS_components.IconField, typeof __VLS_components.IconField, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
        ...{ class: "flex items-center" },
    }));
    const __VLS_29 = __VLS_28({
        ...{ class: "flex items-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    __VLS_30.slots.default;
    const __VLS_31 = {}.InputIcon;
    /** @type {[typeof __VLS_components.InputIcon, typeof __VLS_components.InputIcon, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
    const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_34.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i)({
        ...{ class: "pi pi-search" },
    });
    var __VLS_34;
    const __VLS_35 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }));
    const __VLS_37 = __VLS_36({
        modelValue: (__VLS_ctx.filters['global'].value),
        placeholder: "Keyword Search",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    var __VLS_30;
}
const __VLS_39 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    field: "id",
    header: "Action",
    ...{ style: {} },
}));
const __VLS_41 = __VLS_40({
    field: "id",
    header: "Action",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_42.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card flex justify-center" },
    });
    const __VLS_43 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        ...{ 'onClick': {} },
        icon: "pi pi-file-edit",
        size: "small",
        ...{ class: "text-white mr-2 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-blue-800" },
        severity: "info",
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onClick': {} },
        icon: "pi pi-file-edit",
        size: "small",
        ...{ class: "text-white mr-2 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-blue-800" },
        severity: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_47;
    let __VLS_48;
    let __VLS_49;
    const __VLS_50 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editAccount(data.id);
        }
    };
    var __VLS_46;
}
var __VLS_42;
const __VLS_51 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    field: "roles",
    header: "Designation",
    ...{ style: {} },
}));
const __VLS_53 = __VLS_52({
    field: "roles",
    header: "Designation",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_54.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.roles);
}
{
    const { filter: __VLS_thisSlot } = __VLS_54.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_55 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_57 = __VLS_56({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
}
var __VLS_54;
const __VLS_59 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    field: "name",
    header: "Employee Name",
    ...{ style: {} },
}));
const __VLS_61 = __VLS_60({
    field: "name",
    header: "Employee Name",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_62.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.first_name);
    (data.last_name);
}
{
    const { filter: __VLS_thisSlot } = __VLS_62.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_63 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_65 = __VLS_64({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
}
var __VLS_62;
const __VLS_67 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    field: "division_title",
    header: "Division",
    ...{ style: {} },
}));
const __VLS_69 = __VLS_68({
    field: "division_title",
    header: "Division",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_70.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.division_title);
}
{
    const { filter: __VLS_thisSlot } = __VLS_70.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_71 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_73 = __VLS_72({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
}
var __VLS_70;
const __VLS_75 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    field: "position",
    header: "Position",
    ...{ style: {} },
}));
const __VLS_77 = __VLS_76({
    field: "position",
    header: "Position",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_78.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.position);
}
{
    const { filter: __VLS_thisSlot } = __VLS_78.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_79 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_81 = __VLS_80({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
}
var __VLS_78;
const __VLS_83 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    field: "username",
    header: "Username",
    ...{ style: {} },
}));
const __VLS_85 = __VLS_84({
    field: "username",
    header: "Username",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_86.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.username);
}
{
    const { filter: __VLS_thisSlot } = __VLS_86.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_87 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_89 = __VLS_88({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
}
var __VLS_86;
const __VLS_91 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    field: "email",
    header: "Active Email",
    ...{ style: {} },
}));
const __VLS_93 = __VLS_92({
    field: "email",
    header: "Active Email",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_94.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.email);
}
{
    const { filter: __VLS_thisSlot } = __VLS_94.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_95 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_97 = __VLS_96({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
}
var __VLS_94;
const __VLS_99 = {}.Column;
/** @type {[typeof __VLS_components.Column, typeof __VLS_components.Column, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    field: "mobile_no",
    header: "Contact Details",
    ...{ style: {} },
}));
const __VLS_101 = __VLS_100({
    field: "mobile_no",
    header: "Contact Details",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
{
    const { body: __VLS_thisSlot } = __VLS_102.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    (data.mobile_no);
}
{
    const { filter: __VLS_thisSlot } = __VLS_102.slots;
    const [{ filterModel }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_103 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }));
    const __VLS_105 = __VLS_104({
        modelValue: (filterModel.value),
        type: "text",
        placeholder: "Search by name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
}
var __VLS_102;
var __VLS_18;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-12']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
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
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
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
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-primary-800']} */ ;
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
/** @type {__VLS_StyleScopedClasses['dark:bg-primary-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-primary-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:focus:ring-blue-800']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BreadcrumbDefault: BreadcrumbDefault,
            DefaultLayout: DefaultLayout,
            DataTable: DataTable,
            Column: Column,
            InputText: InputText,
            Button: Button,
            Checkbox: Checkbox,
            IconField: IconField,
            InputIcon: InputIcon,
            Fieldset: Fieldset,
            users: users,
            filters: filters,
            loading: loading,
            progress: progress,
            isLoading: isLoading,
            isModalOpen: isModalOpen,
            currentMessage: currentMessage,
            selectedCategory: selectedCategory,
            usermanagement_roles: usermanagement_roles,
            clearFilter: clearFilter,
            editAccount: editAccount,
            closeModal: closeModal,
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
