import jsVectorMap from 'jsvectormap';
import '@/assets/js/us-aea-en';
import { onMounted } from 'vue';
onMounted(() => {
    new jsVectorMap({
        map: 'us_aea_en',
        selector: '#mapOne',
        zoomButtons: true,
        regionStyle: {
            initial: {
                fill: '#C8D0D8'
            },
            hover: {
                fillOpacity: 1,
                fill: '#3056D3'
            }
        },
        regionLabelStyle: {
            initial: {
                fontFamily: 'Satoshi',
                fontWeight: 'semibold',
                fill: '#fff'
            },
            hover: {
                cursor: 'pointer'
            }
        },
        labels: {
            regions: {
                render(code) {
                    return code.split('-')[1];
                }
            }
        }
    });
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-12 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
    ...{ class: "mb-2 text-xl font-bold text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "mapOne",
    ...{ class: "mapOne map-btn !h-90" },
});
/** @type {__VLS_StyleScopedClasses['col-span-12']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-stroke']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['py-6']} */ ;
/** @type {__VLS_StyleScopedClasses['px-7.5']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-default']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-strokedark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-boxdark']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:col-span-7']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['mapOne']} */ ;
/** @type {__VLS_StyleScopedClasses['map-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['!h-90']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
