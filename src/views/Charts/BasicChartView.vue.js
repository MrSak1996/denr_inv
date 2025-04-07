import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import ChartOne from '@/components/Charts/ChartOne.vue';
import ChartThree from '@/components/Charts/ChartThree.vue';
import ChartTwo from '@/components/Charts/ChartTwo.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { ref } from 'vue';
const pageTitle = ref('Basic Chart');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
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
    ...{ class: "grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5" },
});
/** @type {[typeof ChartOne, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(ChartOne, new ChartOne({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {[typeof ChartTwo, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(ChartTwo, new ChartTwo({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {[typeof ChartThree, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(ChartThree, new ChartThree({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['2xl:gap-7.5']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BreadcrumbDefault: BreadcrumbDefault,
            ChartOne: ChartOne,
            ChartThree: ChartThree,
            ChartTwo: ChartTwo,
            DefaultLayout: DefaultLayout,
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
