import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'primevue/usetoast';
import api from '@/api/axiosInstance';
import { useApi } from '@/composables/useApi';
import Toast from 'primevue/toast';
const toast = useToast();
const { roles_opts, getUserRoles } = useApi();
const authStore = useAuthStore();
const api_token = authStore.api_token;
const role_id = authStore.role_id;
const generating = ref(false);
const error = ref('');
const selectedRoles = ref(null);
const progress = ref(0); // Added progress state
const emit = defineEmits(['close', 'proceed']);
const props = defineProps({
    open: {
        type: Boolean,
        default: false
    }
});
const exportData = async () => {
    try {
        generating.value = true;
        progress.value = 10; // Start progress
        // Simulate progress updates
        const progressInterval = setInterval(() => {
            if (progress.value < 90) {
                progress.value += 10;
            }
        }, 500);
        // Ensure selectedRoles is handled correctly
        const selectedRoleIds = Array.isArray(selectedRoles.value)
            ? selectedRoles.value.map(role => role.id).join(',') // Extract IDs if array
            : selectedRoles.value?.id || ''; // Extract ID if single object
        const response = await api.get(`https://riis.denrcalabarzon.com/api/exportSummary?export=true&role_id=${selectedRoleIds}`, {
            responseType: 'blob',
        });
        clearInterval(progressInterval);
        progress.value = 100; // Complete progress
        const contentType = response.headers['content-type'];
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'summary_report.xlsx';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
    catch (err) {
        // Handle API errors
        if (err) {
            try {
                toast.add({
                    severity: 'error',
                    summary: 'Export Failed',
                    detail: 'Error retrieving error message',
                    life: 3000,
                });
            }
            catch (jsonErr) {
                toast.add({
                    severity: 'error',
                    summary: 'Export Failed',
                    detail: 'Error retrieving error message',
                    life: 3000,
                });
            }
        }
        else {
            toast.add({
                severity: 'error',
                summary: 'Export Failed',
                detail: 'Error generating the report. Please try again.',
                life: 3000,
            });
        }
    }
    finally {
        setTimeout(() => {
            generating.value = false;
            progress.value = 0;
        }, 1000); // Reset after download
    }
};
const closeModal = () => {
    emit('close');
};
onMounted(() => {
    getUserRoles(role_id);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.Toast;
/** @type {[typeof __VLS_components.Toast, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (props.open) {
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
        ...{ class: "qr-batch-generator" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "input-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" },
        role: "alert",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    const __VLS_4 = {}.Select;
    /** @type {[typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        modelValue: (__VLS_ctx.selectedRoles),
        options: (__VLS_ctx.roles_opts),
        optionLabel: "name",
        filter: true,
        placeholder: "Select CENRO/PENRO",
        maxSelectedLabels: (3),
        ...{ class: "w-full" },
    }));
    const __VLS_6 = __VLS_5({
        modelValue: (__VLS_ctx.selectedRoles),
        options: (__VLS_ctx.roles_opts),
        optionLabel: "name",
        filter: true,
        placeholder: "Select CENRO/PENRO",
        maxSelectedLabels: (3),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    if (__VLS_ctx.error) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "error" },
        });
        (__VLS_ctx.error);
    }
    if (__VLS_ctx.generating) {
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.exportData) },
        disabled: (__VLS_ctx.generating),
        ...{ class: "generate-btn" },
    });
    (__VLS_ctx.generating ? 'Generating...' : 'Generate Report');
}
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
/** @type {__VLS_StyleScopedClasses['qr-batch-generator']} */ ;
/** @type {__VLS_StyleScopedClasses['input-section']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
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
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Toast: Toast,
            roles_opts: roles_opts,
            generating: generating,
            error: error,
            selectedRoles: selectedRoles,
            progress: progress,
            exportData: exportData,
            closeModal: closeModal,
        };
    },
    emits: {},
    props: {
        open: {
            type: Boolean,
            default: false
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        open: {
            type: Boolean,
            default: false
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */
