import { useSidebarStore } from '@/stores/sidebar';
import { ref } from 'vue';
const sidebarStore = useSidebarStore();
const props = defineProps(['items', 'page']);
const items = ref(props.items);
const handleItemClick = (index) => {
    const pageName = sidebarStore.selected === props.items[index].label ? '' : props.items[index].label;
    sidebarStore.selected = pageName;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
    ...{ class: "mt-4 mb-5.5 flex flex-col gap-2.5 pl-6" },
});
for (const [childItem, index] of __VLS_getVForSourceType((__VLS_ctx.items))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        to: (childItem.route),
        ...{ class: "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white" },
        ...{ class: ({
                '!text-white': childItem.label === __VLS_ctx.sidebarStore.selected
            }) },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        to: (childItem.route),
        ...{ class: "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white" },
        ...{ class: ({
                '!text-white': childItem.label === __VLS_ctx.sidebarStore.selected
            }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleItemClick(index);
        }
    };
    __VLS_3.slots.default;
    (childItem.label);
    var __VLS_3;
}
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-6']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bodydark2']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['ease-in-out']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['!text-white']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            sidebarStore: sidebarStore,
            items: items,
            handleItemClick: handleItemClick,
        };
    },
    props: ['items', 'page'],
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    props: ['items', 'page'],
});
; /* PartiallyEnd: #4569/main.vue */
