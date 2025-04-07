import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        label: String,
        type: String,
        placeholder: String,
        customClasses: String,
        required: {
            type: Boolean,
            default: false
        }
    }
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: (__VLS_ctx.customClasses) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-2.5 block text-black dark:text-white" },
});
(__VLS_ctx.label);
if (__VLS_ctx.required) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-meta-1" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: (__VLS_ctx.type),
    placeholder: (__VLS_ctx.placeholder),
    ...{ class: "w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" },
});
/** @type {__VLS_StyleScopedClasses['mb-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-meta-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['border-stroke']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['font-normal']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['active:border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-default']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:bg-whiter']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-form-strokedark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:focus:border-primary']} */ ;
var __VLS_dollars;
let __VLS_self;
