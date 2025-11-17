import { useSidebarStore } from '@/stores/sidebar';
import { useRoute } from 'vue-router';
import SidebarDropdown from './SidebarDropdown.vue';
const sidebarStore = useSidebarStore();
const props = defineProps(['item', 'index']);
const currentPage = useRoute().name;
const handleItemClick = () => {
    const pageName = sidebarStore.selected === props.item.label ? '' : props.item.label;
    sidebarStore.selected = pageName;
    if (props.item.children) {
        return props.item.children.some((child) => sidebarStore.selected === child.label);
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    to: (__VLS_ctx.item.route),
    ...{ class: "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4" },
    ...{ class: ({
            'bg-graydark dark:bg-meta-4': __VLS_ctx.sidebarStore.selected === __VLS_ctx.item.label
        }) },
    title: (__VLS_ctx.sidebarStore.isSidebarCollapsed ? __VLS_ctx.item.label : ''),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    to: (__VLS_ctx.item.route),
    ...{ class: "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4" },
    ...{ class: ({
            'bg-graydark dark:bg-meta-4': __VLS_ctx.sidebarStore.selected === __VLS_ctx.item.label
        }) },
    title: (__VLS_ctx.sidebarStore.isSidebarCollapsed ? __VLS_ctx.item.label : ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.handleItemClick)
};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.item.icon) }, null, null);
const __VLS_8 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    name: "fade",
}));
const __VLS_10 = __VLS_9({
    name: "fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
if (!__VLS_ctx.sidebarStore.isSidebarCollapsed) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.item.label);
}
var __VLS_11;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "translate transform overflow-hidden" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.sidebarStore.selected === __VLS_ctx.item.label) }, null, null);
if (__VLS_ctx.item.children) {
    /** @type {[typeof SidebarDropdown, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(SidebarDropdown, new SidebarDropdown({
        items: (__VLS_ctx.item.children),
        currentPage: (__VLS_ctx.currentPage),
        page: (__VLS_ctx.item.label),
    }));
    const __VLS_13 = __VLS_12({
        items: (__VLS_ctx.item.children),
        currentPage: (__VLS_ctx.currentPage),
        page: (__VLS_ctx.item.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
}
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bodydark1']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-graydark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-meta-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-graydark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-meta-4']} */ ;
/** @type {__VLS_StyleScopedClasses['translate']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SidebarDropdown: SidebarDropdown,
            sidebarStore: sidebarStore,
            currentPage: currentPage,
            handleItemClick: handleItemClick,
        };
    },
    props: ['item', 'index'],
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: ['item', 'index'],
});
; /* PartiallyEnd: #4569/main.vue */
