import router from '@/router';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
// Reactive variables
const searchValue = ref('');
const debounceTimer = ref(null);
// Props and Emits
const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['close']);
const route = useRoute();
const api_token = route.query.api_token;
// Close Modal
const closeModal = () => {
    emit('close');
};
// Watch for changes in the search input and debounce navigation
watch(searchValue, (newValue) => {
    if (newValue) {
        // Clear any existing debounce timer
        if (debounceTimer.value)
            clearTimeout(debounceTimer.value);
        // Set a new debounce timer
        debounceTimer.value = setTimeout(() => {
            // const targetUrl = `http://10.201.12.184:8080/inventory/create/${newValue}?api_token=${api_token}`
            router.push({
                path: `/inventory/create/${newValue}&item_id=${newValue}`,
                query: { api_token: api_token, option: "scan" }
            });
        }, 1000); // Delay of 1 second
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" },
        role: "dialog",
        'aria-labelledby': "reserve-control-no",
        'aria-modal': "true",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-lg w-full max-w-2xl mx-4 lg:mx-auto transition-transform duration-300 transform scale-100" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center py-4 px-6 border-b dark:border-neutral-700" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vFocustrap)(null, { ...__VLS_directiveBindingRestFields, }, null, null);
    const __VLS_0 = {}.InputText;
    /** @type {[typeof __VLS_components.InputText, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        autofocus: true,
        ...{ class: "w-full" },
        modelValue: (__VLS_ctx.searchValue),
        placeholder: "Scan QR Code",
    }));
    const __VLS_2 = __VLS_1({
        autofocus: true,
        ...{ class: "w-full" },
        modelValue: (__VLS_ctx.searchValue),
        placeholder: "Scan QR Code",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col justify-center items-center py-2 px-2" },
    });
    const __VLS_4 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ 'onClick': {} },
        severity: "info",
        label: "Close",
        icon: "pi pi-undo",
        ...{ class: "mt-2" },
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        severity: "info",
        label: "Close",
        icon: "pi pi-undo",
        ...{ class: "mt-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.closeModal)
    };
    var __VLS_7;
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
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['lg:mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['scale-100']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-neutral-700']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            searchValue: searchValue,
            closeModal: closeModal,
        };
    },
    emits: {},
    props: {
        isLoading: {
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
        isLoading: {
            type: Boolean,
            default: false
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */
