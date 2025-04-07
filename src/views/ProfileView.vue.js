import { ref } from 'vue';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import ProfileCard from '@/components/ProfileCard.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
const pageTitle = ref('Profile');
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mx-auto max-w-242.5" },
});
/** @type {[typeof BreadcrumbDefault, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(BreadcrumbDefault, new BreadcrumbDefault({
    pageTitle: (__VLS_ctx.pageTitle),
}));
const __VLS_5 = __VLS_4({
    pageTitle: (__VLS_ctx.pageTitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
/** @type {[typeof ProfileCard, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(ProfileCard, new ProfileCard({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-242.5']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BreadcrumbDefault: BreadcrumbDefault,
            ProfileCard: ProfileCard,
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
