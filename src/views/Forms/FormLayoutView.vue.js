import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultCard from '@/components/Forms/DefaultCard.vue';
import InputGroup from '@/components/Forms/InputGroup.vue';
import SelectGroupTwo from '@/components/Forms/SelectGroup/SelectGroupTwo.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { ref } from 'vue';
const pageTitle = ref('Form Laddyout');
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
    ...{ class: "grid grid-cols-1 gap-9 sm:grid-cols-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-9" },
});
/** @type {[typeof DefaultCard, typeof DefaultCard, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(DefaultCard, new DefaultCard({
    cardTitle: "Contact Form",
}));
const __VLS_8 = __VLS_7({
    cardTitle: "Contact Form",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    action: "#",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-4.5 flex flex-col gap-6 xl:flex-row" },
});
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "First name",
    type: "text",
    placeholder: "Enter your first name",
    customClasses: "w-full xl:w-1/2",
}));
const __VLS_11 = __VLS_10({
    label: "First name",
    type: "text",
    placeholder: "Enter your first name",
    customClasses: "w-full xl:w-1/2",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "Last name",
    type: "text",
    placeholder: "Enter your last name",
    customClasses: "w-full xl:w-1/2",
}));
const __VLS_14 = __VLS_13({
    label: "Last name",
    type: "text",
    placeholder: "Enter your last name",
    customClasses: "w-full xl:w-1/2",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    customClasses: "mb-4.5",
    required: true,
}));
const __VLS_17 = __VLS_16({
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    customClasses: "mb-4.5",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "Subject",
    type: "text",
    placeholder: "Enter your subject",
    customClasses: "mb-4.5",
}));
const __VLS_20 = __VLS_19({
    label: "Subject",
    type: "text",
    placeholder: "Enter your subject",
    customClasses: "mb-4.5",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {[typeof SelectGroupTwo, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(SelectGroupTwo, new SelectGroupTwo({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mb-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-2.5 block text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    rows: "6",
    placeholder: "Type your message",
    ...{ class: "w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" },
});
var __VLS_9;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-9" },
});
/** @type {[typeof DefaultCard, typeof DefaultCard, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(DefaultCard, new DefaultCard({
    cardTitle: "Sign In Form",
}));
const __VLS_26 = __VLS_25({
    cardTitle: "Sign In Form",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    action: "#",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6.5" },
});
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    customClasses: "mb-4.5",
}));
const __VLS_29 = __VLS_28({
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    customClasses: "mb-4.5",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
}));
const __VLS_32 = __VLS_31({
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-5 mb-5.5 flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "formCheckbox",
    ...{ class: "flex cursor-pointer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative pt-0.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "checkbox",
    id: "formCheckbox",
    ...{ class: "taskCheckbox sr-only" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-form-strokedark dark:bg-form-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-white opacity-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "fill-current" },
    width: "10",
    height: "7",
    viewBox: "0 0 10 7",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'fill-rule': "evenodd",
    'clip-rule': "evenodd",
    d: "M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z",
    fill: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_34 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    to: "/#",
    ...{ class: "text-sm text-primary hover:underline" },
}));
const __VLS_36 = __VLS_35({
    to: "/#",
    ...{ class: "text-sm text-primary hover:underline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_37.slots.default;
var __VLS_37;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" },
});
var __VLS_27;
/** @type {[typeof DefaultCard, typeof DefaultCard, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(DefaultCard, new DefaultCard({
    cardTitle: "Sign Up Form",
}));
const __VLS_39 = __VLS_38({
    cardTitle: "Sign Up Form",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    action: "#",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-6.5" },
});
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "Name",
    type: "text",
    placeholder: "Enter full name",
    customClasses: "mb-4.5",
}));
const __VLS_42 = __VLS_41({
    label: "Name",
    type: "text",
    placeholder: "Enter full name",
    customClasses: "mb-4.5",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
    customClasses: "mb-4.5",
}));
const __VLS_45 = __VLS_44({
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
    customClasses: "mb-4.5",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    customClasses: "mb-4.5",
}));
const __VLS_48 = __VLS_47({
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    customClasses: "mb-4.5",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
/** @type {[typeof InputGroup, ]} */ ;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent(InputGroup, new InputGroup({
    label: "Re-type Password",
    type: "password",
    placeholder: "Re-enter",
    customClasses: "mb-5.5",
}));
const __VLS_51 = __VLS_50({
    label: "Re-type Password",
    type: "password",
    placeholder: "Re-enter",
    customClasses: "mb-5.5",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ class: "flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" },
});
var __VLS_40;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-9']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-9']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
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
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-9']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['taskCheckbox']} */ ;
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
/** @type {__VLS_StyleScopedClasses['box']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-stroke']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-form-strokedark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-0']} */ ;
/** @type {__VLS_StyleScopedClasses['fill-current']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-opacity-90']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-opacity-90']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BreadcrumbDefault: BreadcrumbDefault,
            DefaultCard: DefaultCard,
            InputGroup: InputGroup,
            SelectGroupTwo: SelectGroupTwo,
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
