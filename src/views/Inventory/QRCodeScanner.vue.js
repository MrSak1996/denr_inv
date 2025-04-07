import { ref, onMounted } from 'vue';
import { QrcodeStream } from 'vue3-qrcode-reader';
// Reactive variables
const qrVal = ref('');
const error = ref('');
const showScanConfirmation = ref(false);
const scannedResults = ref([]);
const paused = ref(false);
// Emit to parent
const emit = defineEmits(['qr-scanned']);
// Function to handle QR code decoding
const handleDecode = (result) => {
    qrVal.value = result;
    scannedResults.value.push(result); // Store decoded QR codes
    emit('qr-scanned', result); // Emit to parent
    console.log('Scanned QR Codes:', scannedResults.value);
};
// Camera event handlers
const onCameraOn = () => {
    paused.value = false;
    showScanConfirmation.value = false;
};
const onCameraOff = () => {
    paused.value = true;
    showScanConfirmation.value = true;
};
// Function to draw an outline around detected QR code
const drawOutline = (decodeData, context) => {
    const points = [];
    for (const k in decodeData) {
        if (['topLeftCorner', 'topRightCorner', 'bottomRightCorner', 'bottomLeftCorner'].includes(k)) {
            points.push(decodeData[k]);
        }
    }
    context.lineWidth = 5;
    context.strokeStyle = 'green';
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.forEach(({ x, y }) => context.lineTo(x, y));
    context.closePath();
    context.stroke();
};
// Request camera access explicitly
const requestCameraPermission = async () => {
    try {
        // Prompt the user for camera access
        await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" }, // Use "user" for front camera and "environment" for back camera
            },
        });
        console.log('Camera access granted.');
    }
    catch (err) {
        // If permission is denied, display an error
        error.value = 'Camera access denied. Please allow camera access in your browser settings.';
        console.error('Error accessing camera:', err);
    }
};
// Lifecycle hook
onMounted(() => {
    requestCameraPermission();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['scanned-results']} */ ;
/** @type {__VLS_StyleScopedClasses['scanned-results']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scanner-container" },
});
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-message" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "scanner" },
    });
    const __VLS_0 = {}.QrcodeStream;
    /** @type {[typeof __VLS_components.QrcodeStream, typeof __VLS_components.qrcodeStream, typeof __VLS_components.QrcodeStream, typeof __VLS_components.qrcodeStream, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onCameraOn': {} },
        ...{ 'onCameraOff': {} },
        ...{ 'onDecode': {} },
        track: (__VLS_ctx.drawOutline),
        paused: (__VLS_ctx.paused),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onCameraOn': {} },
        ...{ 'onCameraOff': {} },
        ...{ 'onDecode': {} },
        track: (__VLS_ctx.drawOutline),
        paused: (__VLS_ctx.paused),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onCameraOn: (__VLS_ctx.onCameraOn)
    };
    const __VLS_8 = {
        onCameraOff: (__VLS_ctx.onCameraOff)
    };
    const __VLS_9 = {
        onDecode: (__VLS_ctx.handleDecode)
    };
    __VLS_3.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "scan-confirmation" },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showScanConfirmation) }, null, null);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: "../../assets/images/logo/denr_logo.png",
        alt: "Checkmark",
        width: "128",
    });
    var __VLS_3;
    if (__VLS_ctx.scannedResults.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "scanned-results" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
        for (const [code, index] of __VLS_getVForSourceType((__VLS_ctx.scannedResults))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                key: (index),
            });
            (code);
        }
    }
}
/** @type {__VLS_StyleScopedClasses['scanner-container']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['scanner']} */ ;
/** @type {__VLS_StyleScopedClasses['scan-confirmation']} */ ;
/** @type {__VLS_StyleScopedClasses['scanned-results']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $emit: emit,
            QrcodeStream: QrcodeStream,
            error: error,
            showScanConfirmation: showScanConfirmation,
            scannedResults: scannedResults,
            paused: paused,
            handleDecode: handleDecode,
            onCameraOn: onCameraOn,
            onCameraOff: onCameraOff,
            drawOutline: drawOutline,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            $emit: emit,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
