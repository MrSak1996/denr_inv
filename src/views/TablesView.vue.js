import { ref } from 'vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import TableOne from '@/components/Tables/TableOne.vue';
import TableTwo from '@/components/Tables/TableTwo.vue';
import TableThree from '@/components/Tables/TableThree.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
const pageTitle = ref('Tables');
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
    ...{ class: "flex flex-col gap-10" },
});
/** @type {[typeof TableOne, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(TableOne, new TableOne({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {[typeof TableTwo, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(TableTwo, new TableTwo({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {[typeof TableThree, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(TableThree, new TableThree({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-10']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BreadcrumbDefault: BreadcrumbDefault,
            TableOne: TableOne,
            TableTwo: TableTwo,
            TableThree: TableThree,
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
