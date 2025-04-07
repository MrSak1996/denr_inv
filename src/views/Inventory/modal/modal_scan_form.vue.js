import { ref, defineComponent } from 'vue';
import QRCodeScanner from '../QRCodeScanner.vue';
export default defineComponent({
    name: 'ModalReserved',
    components: { QRCodeScanner },
    props: {
        controlNo: {
            type: String,
            required: true
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        filters: {
            type: Object,
            required: true // Expecting the filters object from the parent
        }
    },
    emits: ['close', 'qr-scanned'],
    setup(props, { emit }) {
        const qrValue = ref(''); // Declare and initialize the reactive variable
        function updateQrValue(value) {
            qrValue.value = value; // Update with the new value
            props.filters.global.value = value; // Update the filter in the parent
            emit('qr-scanned', value); // Emit the QR value to parent component
        }
        const closeModal = () => {
            emit('close');
        };
        return {
            closeModal,
            updateQrValue
        };
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = { QRCodeScanner };
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
    const __VLS_0 = {}.QRCodeScanner;
    /** @type {[typeof __VLS_components.QRCodeScanner, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onQrScanned': {} },
        readonly: true,
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onQrScanned': {} },
        readonly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onQrScanned: (__VLS_ctx.updateQrValue)
    };
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex flex-col justify-center items-center py-2 px-2" },
    });
    const __VLS_8 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        severity: "info",
        label: "Close",
        icon: "pi pi-undo",
        ...{ class: "mt-2" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        severity: "info",
        label: "Close",
        icon: "pi pi-undo",
        ...{ class: "mt-2" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClick: (__VLS_ctx.closeModal)
    };
    var __VLS_11;
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
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
var __VLS_dollars;
let __VLS_self;
