import ChartOne from '@/components/Charts/ChartOne.vue';
import ChartThree from '@/components/Charts/ChartThree.vue';
import ChartTwo from '@/components/Charts/ChartTwo.vue';
import ChatCard from '@/components/ChatCard.vue';
import MapOne from '@/components/Maps/MapOne.vue';
import TableOne from '@/components/Tables/TableOne.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { ref } from 'vue';
const message = ref('');
// onMounted(async () => {
//   try {
//     const response = await api.get('/showData')
//     message.value = response.data.message
//   } catch (error) {
//   }
// })
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
    ...{ class: "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5" },
});
/** @type {[typeof ChartOne, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(ChartOne, new ChartOne({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
/** @type {[typeof ChartTwo, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(ChartTwo, new ChartTwo({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {[typeof ChartThree, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(ChartThree, new ChartThree({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {[typeof MapOne, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(MapOne, new MapOne({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-12 xl:col-span-8" },
});
/** @type {[typeof TableOne, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(TableOne, new TableOne({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
/** @type {[typeof ChatCard, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(ChatCard, new ChatCard({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['2xl:gap-7.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['2xl:mt-7.5']} */ ;
/** @type {__VLS_StyleScopedClasses['2xl:gap-7.5']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-12']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:col-span-8']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChartOne: ChartOne,
            ChartThree: ChartThree,
            ChartTwo: ChartTwo,
            ChatCard: ChatCard,
            MapOne: MapOne,
            TableOne: TableOne,
            DefaultLayout: DefaultLayout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
