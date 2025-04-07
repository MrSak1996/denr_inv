import { useSidebarStore } from '@/stores/sidebar';
import { useRoute } from 'vue-router';
import SidebarDropdown from './SidebarDropdown.vue';
const sidebarStore = useSidebarStore();
const props = defineProps(['item', 'index']);
const currentPage = useRoute().name;
const handleItemClick = () => {
    const pageName = sidebarStore.page === props.item.label ? '' : props.item.label;
    sidebarStore.page = pageName;
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
            'bg-graydark dark:bg-meta-4': __VLS_ctx.sidebarStore.page === __VLS_ctx.item.label
        }) },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    to: (__VLS_ctx.item.route),
    ...{ class: "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4" },
    ...{ class: ({
            'bg-graydark dark:bg-meta-4': __VLS_ctx.sidebarStore.page === __VLS_ctx.item.label
        }) },
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
(__VLS_ctx.item.label);
if (__VLS_ctx.item.children) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "absolute right-4 top-1/2 -translate-y-1/2 fill-current" },
        ...{ class: ({ 'rotate-180': __VLS_ctx.sidebarStore.page === __VLS_ctx.item.label }) },
        width: "20",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'fill-rule': "evenodd",
        'clip-rule': "evenodd",
        d: "M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z",
        fill: "",
    });
}
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "translate transform overflow-hidden" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.sidebarStore.page === __VLS_ctx.item.label) }, null, null);
if (__VLS_ctx.item.children) {
    /** @type {[typeof SidebarDropdown, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(SidebarDropdown, new SidebarDropdown({
        items: (__VLS_ctx.item.children),
        currentPage: (__VLS_ctx.currentPage),
        page: (__VLS_ctx.item.label),
    }));
    const __VLS_9 = __VLS_8({
        items: (__VLS_ctx.item.children),
        currentPage: (__VLS_ctx.currentPage),
        page: (__VLS_ctx.item.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
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
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['-translate-y-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-current']} */ ;
/** @type {__VLS_StyleScopedClasses['rotate-180']} */ ;
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
