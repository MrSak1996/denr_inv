import { ref, computed, onMounted } from 'vue';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { generateQRCodeWithLogo, formatQRCodeText } from './qrCodeUtils.js';
import { useApi } from '@/composables/useApi';
import img from '@/assets/images/prev.jpg';
import api from '@/api/axiosInstance';
const files = ref([]);
const getGoogleFile = async () => {
    try {
        const response = await api.get(`/getGoogleFile?id=${props.id}`); // Corrected template string syntax
        files.value = response.data; // Assuming response is an array of objects like [{ url: 'image1.jpg' }, { url: 'image2.jpg' }]
    }
    catch (err) {
        console.error('Error fetching files:', err);
    }
};
const emit = defineEmits(['close', 'proceed']);
const props = defineProps({
    id: {
        type: Number
    },
    open: {
        type: Boolean,
        default: false
    }
});
const closeModal = () => {
    emit('close');
};
onMounted(() => {
    getGoogleFile();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.open) {
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
        ...{ class: "grid grid-cols-2 md:grid-cols-3 gap-4" },
    });
    for (const [file, index] of __VLS_getVForSourceType((__VLS_ctx.files))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            ...{ class: "h-auto max-w-full rounded-lg" },
            src: (__VLS_ctx.img),
            alt: "Gallery Image",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.a, __VLS_intrinsicElements.a)({
            href: (`https://drive.google.com/file/d/` + file.file_id + `/view?usp=drive_link`),
            target: "_blank",
            ...{ class: "inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            ...{ class: "rtl:rotate-180 w-15 h-3.5" },
            'aria-hidden': "true",
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 14 10",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
            stroke: "currentColor",
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            d: "M1 5h12m0 0L9 1m4 4L9 9",
        });
    }
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
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-4']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-blue-300']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-blue-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:focus:ring-blue-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rtl:rotate-180']} */ ;
/** @type {__VLS_StyleScopedClasses['w-15']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            $emit: emit,
            img: img,
            files: files,
            closeModal: closeModal,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            $emit: emit,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
