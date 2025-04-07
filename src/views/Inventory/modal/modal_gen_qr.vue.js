import { ref, computed, onMounted } from 'vue';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { generateQRCodeWithLogo, formatQRCodeText } from './qrCodeUtils.js';
import { useApi } from '@/composables/useApi';
import api from '@/api/axiosInstance';
const { qr_code_temp, getQRCodeTemp, getQRData, qr_opts } = useApi();
const baseNumber = ref(1);
const quantity = ref(10);
const generating = ref(false);
const progress = ref(0);
const error = ref('');
const selectedQrCodes = ref([]); // Store selected QR code options
// Set a default logo URL
const logoUrl = ref(new URL('../../../assets/images/logo/denr_logo.png', import.meta.url).href);
const totalCodes = computed(() => quantity.value);
const generateQRCodes = async () => {
    if (selectedQrCodes.value.length === 0) {
        error.value = 'Please select at least one QR code option';
        return;
    }
    if (quantity.value <= 0) {
        error.value = 'Quantity must be greater than 0';
        return;
    }
    if (quantity.value > 1000) {
        error.value = 'Maximum quantity exceeded (limit: 1000 codes)';
        return;
    }
    if (baseNumber.value < 1 || baseNumber.value > 99) {
        error.value = 'Base number must be between 1 and 99';
        return;
    }
    error.value = '';
    generating.value = true;
    progress.value = 0;
    try {
        const zip = new JSZip();
        for (const selected of selectedQrCodes.value) {
            for (let i = 0; i < quantity.value; i++) {
                const text = formatQRCodeText(selected.name, baseNumber.value, i + 1);
                const qrCode = await generateQRCodeWithLogo(text, logoUrl.value);
                const imageData = qrCode.split(',')[1];
                zip.file(`${text}.png`, imageData, { base64: true });
                progress.value = ((i + 1) / (quantity.value * selectedQrCodes.value.length)) * 100;
            }
        }
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `QRCode.zip`);
    }
    catch (err) {
        error.value = 'Error generating QR codes';
        console.error(err);
    }
    finally {
        generating.value = false;
        progress.value = 0;
    }
};
const emit = defineEmits(['close', 'proceed']);
const props = defineProps({
    open: {
        type: Boolean,
        default: false
    }
});
const closeModal = () => {
    emit('close');
};
onMounted(() => {
    getQRCodeTemp();
    getQRData();
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
        ...{ class: "p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" },
        role: "alert",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "baseNumber",
    });
    const __VLS_0 = {}.MultiSelect;
    /** @type {[typeof __VLS_components.MultiSelect, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        display: "chip",
        modelValue: (__VLS_ctx.selectedQrCodes),
        options: (__VLS_ctx.qr_opts),
        optionLabel: "name",
        filter: true,
        placeholder: "Select QR Code",
        maxSelectedLabels: (3),
        ...{ class: "w-full" },
    }));
    const __VLS_2 = __VLS_1({
        display: "chip",
        modelValue: (__VLS_ctx.selectedQrCodes),
        options: (__VLS_ctx.qr_opts),
        optionLabel: "name",
        filter: true,
        placeholder: "Select QR Code",
        maxSelectedLabels: (3),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    if (__VLS_ctx.error) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "error" },
        });
        (__VLS_ctx.error);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.generateQRCodes) },
        disabled: (__VLS_ctx.generating),
        ...{ class: "generate-btn" },
    });
    (__VLS_ctx.generating ? 'Generating...' : 'Generate QR Codes');
    if (__VLS_ctx.generating) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "progress-bar" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "progress-fill" },
            ...{ style: ({ width: `${__VLS_ctx.progress}%` }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "progress-text" },
        });
        (Math.round(__VLS_ctx.progress));
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
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-800']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-gray-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['generate-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            $emit: emit,
            qr_opts: qr_opts,
            generating: generating,
            progress: progress,
            error: error,
            selectedQrCodes: selectedQrCodes,
            generateQRCodes: generateQRCodes,
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
