import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import CheckboxFive from '@/components/Forms/Checkboxes/CheckboxFive.vue';
import CheckboxFour from '@/components/Forms/Checkboxes/CheckboxFour.vue';
import CheckboxOne from '@/components/Forms/Checkboxes/CheckboxOne.vue';
import CheckboxThree from '@/components/Forms/Checkboxes/CheckboxThree.vue';
import CheckboxTwo from '@/components/Forms/Checkboxes/CheckboxTwo.vue';
import DatePickerOne from '@/components/Forms/DatePicker/DatePickerOne.vue';
import DatePickerTwo from '@/components/Forms/DatePicker/DatePickerTwo.vue';
import DefaultCard from '@/components/Forms/DefaultCard.vue';
import SwitchFour from '@/components/Forms/Switchers/SwitchFour.vue';
import SwitchOne from '@/components/Forms/Switchers/SwitchOne.vue';
import SwitchThree from '@/components/Forms/Switchers/SwitchThree.vue';
import SwitchTwo from '@/components/Forms/Switchers/SwitchTwo.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { ref } from 'vue';
import MultiSelect from '@/components/Forms/MultiSelect.vue';
import SelectGroupOne from '@/components/Forms/SelectGroup/SelectGroupOne.vue';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
const pageTitle = ref('Form Elements');
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
    cardTitle: "Input Fields",
}));
const __VLS_8 = __VLS_7({
    cardTitle: "Input Fields",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-5.5 p-6.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-3 block text-sm font-medium text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "text",
    placeholder: "Default Input",
    ...{ class: "w-full rounded-lg border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" },
});
const __VLS_10 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({}));
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_13.slots.default;
const __VLS_14 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    id: "username",
}));
const __VLS_16 = __VLS_15({
    id: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "username",
});
var __VLS_13;
const __VLS_18 = {}.DataStatsOne;
/** @type {[typeof __VLS_components.DataStatsOne, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-3 block text-sm font-medium text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "text",
    placeholder: "Active Input",
    ...{ class: "w-full rounded-lg border-[1.5px] text-black border-primary bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:bg-form-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-3 block text-sm font-medium text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "text",
    placeholder: "Disabled label",
    disabled: true,
    ...{ class: "w-full rounded-lg border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-black" },
});
var __VLS_9;
/** @type {[typeof DefaultCard, typeof DefaultCard, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(DefaultCard, new DefaultCard({
    cardTitle: "Toggle switch input",
}));
const __VLS_23 = __VLS_22({
    cardTitle: "Toggle switch input",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_24.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-5.5 p-6.5" },
});
/** @type {[typeof SwitchOne, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(SwitchOne, new SwitchOne({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
/** @type {[typeof SwitchTwo, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(SwitchTwo, new SwitchTwo({}));
const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
/** @type {[typeof SwitchThree, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(SwitchThree, new SwitchThree({}));
const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
/** @type {[typeof SwitchFour, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(SwitchFour, new SwitchFour({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
var __VLS_24;
/** @type {[typeof DefaultCard, typeof DefaultCard, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(DefaultCard, new DefaultCard({
    cardTitle: "Time and date",
}));
const __VLS_38 = __VLS_37({
    cardTitle: "Time and date",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-5.5 p-6.5" },
});
/** @type {[typeof DatePickerOne, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(DatePickerOne, new DatePickerOne({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
/** @type {[typeof DatePickerTwo, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(DatePickerTwo, new DatePickerTwo({}));
const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
var __VLS_39;
/** @type {[typeof DefaultCard, typeof DefaultCard, ]} */ ;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent(DefaultCard, new DefaultCard({
    cardTitle: "File upload",
}));
const __VLS_47 = __VLS_46({
    cardTitle: "File upload",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
__VLS_48.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-5.5 p-6.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-3 block text-sm font-medium text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "file",
    ...{ class: "w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-3 block text-sm font-medium text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "file",
    ...{ class: "w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-normal focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white" },
});
var __VLS_48;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-9" },
});
/** @type {[typeof DefaultCard, typeof DefaultCard, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(DefaultCard, new DefaultCard({
    cardTitle: "Textarea Fields",
}));
const __VLS_50 = __VLS_49({
    cardTitle: "Textarea Fields",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-5.5 p-6.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-3 block text-sm font-medium text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    rows: "6",
    placeholder: "Default textarea",
    ...{ class: "w-full rounded-lg border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-3 block text-sm font-medium text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    rows: "6",
    placeholder: "Active textarea",
    ...{ class: "w-full rounded-lg border-[1.5px] text-black border-primary bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:bg-form-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "mb-3 block text-sm font-medium text-black dark:text-white" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
    rows: "6",
    disabled: true,
    placeholder: "Disabled textarea",
    ...{ class: "w-full rounded-lg border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-black" },
});
var __VLS_51;
/** @type {[typeof DefaultCard, typeof DefaultCard, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(DefaultCard, new DefaultCard({
    cardTitle: "Checkbox and radio",
}));
const __VLS_53 = __VLS_52({
    cardTitle: "Checkbox and radio",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-5.5 p-6.5" },
});
/** @type {[typeof CheckboxOne, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(CheckboxOne, new CheckboxOne({}));
const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
/** @type {[typeof CheckboxTwo, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(CheckboxTwo, new CheckboxTwo({}));
const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
/** @type {[typeof CheckboxThree, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(CheckboxThree, new CheckboxThree({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
/** @type {[typeof CheckboxFour, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(CheckboxFour, new CheckboxFour({}));
const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
/** @type {[typeof CheckboxFive, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(CheckboxFive, new CheckboxFive({}));
const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
var __VLS_54;
/** @type {[typeof DefaultCard, typeof DefaultCard, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(DefaultCard, new DefaultCard({
    cardTitle: "Select input",
}));
const __VLS_71 = __VLS_70({
    cardTitle: "Select input",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-5.5 p-6.5" },
});
/** @type {[typeof SelectGroupOne, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(SelectGroupOne, new SelectGroupOne({}));
const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
/** @type {[typeof MultiSelect, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(MultiSelect, new MultiSelect({}));
const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
var __VLS_72;
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-9']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-9']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5.5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
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
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
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
/** @type {__VLS_StyleScopedClasses['dark:bg-form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
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
/** @type {__VLS_StyleScopedClasses['dark:disabled:bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5.5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5.5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5.5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['border-stroke']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['file:mr-5']} */ ;
/** @type {__VLS_StyleScopedClasses['file:border-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['file:cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['file:border-0']} */ ;
/** @type {__VLS_StyleScopedClasses['file:border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['file:border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['file:border-stroke']} */ ;
/** @type {__VLS_StyleScopedClasses['file:bg-whiter']} */ ;
/** @type {__VLS_StyleScopedClasses['file:py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['file:px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['file:hover:bg-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['file:hover:bg-opacity-10']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['active:border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-default']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:bg-whiter']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-form-strokedark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:file:border-form-strokedark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:file:bg-white/30']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:file:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:focus:border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-stroke']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['file:mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['file:rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['file:border-[0.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['file:border-stroke']} */ ;
/** @type {__VLS_StyleScopedClasses['file:bg-[#EEEEEE]']} */ ;
/** @type {__VLS_StyleScopedClasses['file:py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['file:px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['file:text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['file:font-normal']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['file:focus:border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['active:border-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-default']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:bg-whiter']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-form-strokedark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:file:border-strokedark']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:file:bg-white/30']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:file:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-9']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5.5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
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
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[1.5px]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
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
/** @type {__VLS_StyleScopedClasses['dark:bg-form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
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
/** @type {__VLS_StyleScopedClasses['dark:disabled:bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5.5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-5.5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6.5']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BreadcrumbDefault: BreadcrumbDefault,
            CheckboxFive: CheckboxFive,
            CheckboxFour: CheckboxFour,
            CheckboxOne: CheckboxOne,
            CheckboxThree: CheckboxThree,
            CheckboxTwo: CheckboxTwo,
            DatePickerOne: DatePickerOne,
            DatePickerTwo: DatePickerTwo,
            DefaultCard: DefaultCard,
            SwitchFour: SwitchFour,
            SwitchOne: SwitchOne,
            SwitchThree: SwitchThree,
            SwitchTwo: SwitchTwo,
            DefaultLayout: DefaultLayout,
            MultiSelect: MultiSelect,
            SelectGroupOne: SelectGroupOne,
            FloatLabel: FloatLabel,
            InputText: InputText,
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
