import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
const chart = ref(null);
const emit = defineEmits(['close', 'proceed']);
const props = defineProps({
    open: {
        type: Boolean,
        default: false
    }
});
const closeModal = () => {
    emit('close');
};
const chartData = {
    series: [65, 34, 45, 12],
    labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown']
};
const chartOffices = {
    series: [100],
    labels: ['Division']
};
const chartDataBySex = {
    series: [
        {
            name: 'Male',
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45]
        },
        {
            name: 'Female',
            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51]
        }
    ],
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
};
const apexOptions = {
    chart: {
        type: 'donut',
        width: 380
    },
    colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
    labels: chartData.labels,
    legend: {
        show: false,
        position: 'bottom'
    },
    plotOptions: {
        pie: {
            donut: {
                size: '65%',
                background: 'transparent'
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    responsive: [
        {
            breakpoint: 640,
            options: {
                chart: {
                    width: 200
                }
            }
        }
    ]
};
const overallOffices = {
    chart: {
        type: 'donut',
        width: 380
    },
    colors: ['#8FD0EF', '#6577F3', '#8FD0EF', '#0FADCF'],
    labels: chartData.labels,
    legend: {
        show: false,
        position: 'bottom'
    },
    plotOptions: {
        pie: {
            startAngle: -90,
            endAngle: 90
        }
    },
    dataLabels: {
        enabled: false
    },
    responsive: [
        {
            breakpoint: 640,
            options: {
                chart: {
                    width: 200
                }
            }
        }
    ]
};
const apexOptions_byOffice = {
    series: [
        {
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        },
        {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
    ],
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
    },
    yaxis: {
        title: {
            text: '$ (thousands)'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return '$ ' + val + ' thousands';
            }
        }
    }
};
const series = ref([
    { name: 'Marine Sprite', data: [44, 55, 41, 37, 22, 43, 21] },
    { name: 'Striking Calf', data: [53, 32, 33, 52, 13, 43, 32] },
    { name: 'Tank Picture', data: [12, 17, 11, 9, 15, 11, 20] },
    { name: 'Bucket Slope', data: [9, 7, 5, 8, 6, 9, 4] },
    { name: 'Reborn Kid', data: [25, 12, 19, 32, 25, 24, 10] }
]);
const apexOption_Equipment = ref({
    chart: {
        type: 'bar',
        height: 200,
        width: 200,
        stacked: true
    },
    plotOptions: {
        bar: {
            horizontal: true,
            dataLabels: {
                total: {
                    enabled: true,
                    offsetX: 0,
                    style: {
                        fontSize: '13px',
                        fontWeight: 900
                    }
                }
            }
        }
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    title: {
        text: ''
    },
    xaxis: {
        categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
        labels: {
            formatter: function (val) {
                return val + 'K';
            }
        }
    },
    yaxis: {
        title: {
            text: undefined
        }
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + 'K';
            }
        }
    },
    fill: {
        opacity: 1
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
    }
});
const barchartData = {
    series: [
        {
            name: 'Sales',
            data: [44, 55, 41, 67, 22, 43, 65]
        },
        {
            name: 'Revenue',
            data: [13, 23, 20, 8, 13, 27, 15]
        }
    ],
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
};
const barChart = {
    colors: ['#3056D3', '#80CAEE'],
    chart: {
        type: 'bar',
        height: 335,
        stacked: true,
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    responsive: [
        {
            breakpoint: 1536,
            options: {
                plotOptions: {
                    bar: {
                        borderRadius: 0,
                        columnWidth: '25%'
                    }
                }
            }
        }
    ],
    plotOptions: {
        bar: {
            horizontal: false,
            borderRadius: 0,
            columnWidth: '25%',
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'last'
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        type: 'category',
        categories: chartData.labels
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontFamily: 'Satoshi',
        fontWeight: 500,
        fontSize: '14px',
        markers: {
            radius: 99
        }
    },
    fill: {
        opacity: 1
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.open) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" },
        role: "dialog",
        tabindex: "-1",
        'aria-labelledby': "dashboard-modal",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-xl w-full h-[80vh] max-w-7xl mx-4 overflow-auto" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center py-1 px-6 bg-teal-700 text-white" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-2xl font-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closeModal) },
        ...{ class: "text-gray-300 hover:text-gray-100" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-6 grid grid-cols-12 gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-span-12 grid grid-cols-4 gap-4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white-500 text-black p-4 rounded-lg shadow text-center border-2 border-teal-900 border-solid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-xl font-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-[100px] w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_0 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "mt-17" },
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.overallOffices),
        series: (__VLS_ctx.chartOffices.series),
        ref: "chart",
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "mt-17" },
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.overallOffices),
        series: (__VLS_ctx.chartOffices.series),
        ref: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {typeof __VLS_ctx.chart} */ ;
    var __VLS_4 = {};
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white-500 text-black p-4 rounded-lg shadow text-center border-2 border-teal-900 border-solid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-xl font-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-[100px] w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_6 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
        ...{ class: "mt-17" },
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.overallOffices),
        series: (__VLS_ctx.chartOffices.series),
        ref: "chart",
    }));
    const __VLS_8 = __VLS_7({
        ...{ class: "mt-17" },
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.overallOffices),
        series: (__VLS_ctx.chartOffices.series),
        ref: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    /** @type {typeof __VLS_ctx.chart} */ ;
    var __VLS_10 = {};
    var __VLS_9;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white-500 text-black p-4 rounded-lg shadow text-center border-2 border-teal-900 border-solid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-xl font-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-[100px] w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_12 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ class: "mt-17" },
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.overallOffices),
        series: (__VLS_ctx.chartOffices.series),
        ref: "chart",
    }));
    const __VLS_14 = __VLS_13({
        ...{ class: "mt-17" },
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.overallOffices),
        series: (__VLS_ctx.chartOffices.series),
        ref: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    /** @type {typeof __VLS_ctx.chart} */ ;
    var __VLS_16 = {};
    var __VLS_15;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white-500 text-black p-4 rounded-lg shadow text-center border-2 border-teal-900 border-solid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "text-xl font-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-[100px] w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_18 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
        ...{ class: "mt-17" },
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.overallOffices),
        series: (__VLS_ctx.chartOffices.series),
        ref: "chart",
    }));
    const __VLS_20 = __VLS_19({
        ...{ class: "mt-17" },
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.overallOffices),
        series: (__VLS_ctx.chartOffices.series),
        ref: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {typeof __VLS_ctx.chart} */ ;
    var __VLS_22 = {};
    var __VLS_21;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-span-3 p-2 rounded-lg shadow h-60 border-2 border-teal-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: "text-lg font-bold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_24 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.apexOptions),
        series: (__VLS_ctx.chartData.series),
        ref: "chart",
    }));
    const __VLS_26 = __VLS_25({
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.apexOptions),
        series: (__VLS_ctx.chartData.series),
        ref: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    /** @type {typeof __VLS_ctx.chart} */ ;
    var __VLS_28 = {};
    var __VLS_27;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-span-6 p-2 rounded-lg shadow h-60 border-2 border-teal-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: "text-lg font-bold" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_30 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        type: "area",
        height: "150",
        width: ('200%'),
        options: (__VLS_ctx.apexOptions_byOffice),
        series: (__VLS_ctx.chartDataBySex.series),
        ref: "chart",
    }));
    const __VLS_32 = __VLS_31({
        type: "area",
        height: "150",
        width: ('200%'),
        options: (__VLS_ctx.apexOptions_byOffice),
        series: (__VLS_ctx.chartDataBySex.series),
        ref: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    /** @type {typeof __VLS_ctx.chart} */ ;
    var __VLS_34 = {};
    var __VLS_33;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-span-3 p-4 rounded-lg shadow h-60 border-2 border-teal-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: "text-lg font-bold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_36 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.apexOptions),
        series: (__VLS_ctx.chartData.series),
        ref: "chart",
    }));
    const __VLS_38 = __VLS_37({
        type: "donut",
        width: "150",
        height: "150",
        options: (__VLS_ctx.apexOptions),
        series: (__VLS_ctx.chartData.series),
        ref: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    /** @type {typeof __VLS_ctx.chart} */ ;
    var __VLS_40 = {};
    var __VLS_39;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-span-3 p-4 rounded-lg shadow border-2 border-teal-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: "text-lg font-bold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_42 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        type: "bar",
        height: "335",
        options: (__VLS_ctx.barChart),
        series: (__VLS_ctx.barchartData.series),
        ref: "chart",
    }));
    const __VLS_44 = __VLS_43({
        type: "bar",
        height: "335",
        options: (__VLS_ctx.barChart),
        series: (__VLS_ctx.barchartData.series),
        ref: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    /** @type {typeof __VLS_ctx.chart} */ ;
    var __VLS_46 = {};
    var __VLS_45;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-span-6 p-4 rounded-lg shadow border-2 border-teal-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: "text-lg font-bold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_48 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        type: "bar",
        height: "300",
        width: ('200%'),
        options: (__VLS_ctx.apexOption_Equipment),
        series: (__VLS_ctx.series),
    }));
    const __VLS_50 = __VLS_49({
        type: "bar",
        height: "300",
        width: ('200%'),
        options: (__VLS_ctx.apexOption_Equipment),
        series: (__VLS_ctx.series),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "col-span-3 p-4 rounded-lg shadow border-2 border-teal-900" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h5, __VLS_intrinsicElements.h5)({
        ...{ class: "text-lg font-bold mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center" },
    });
    const __VLS_52 = {}.VueApexCharts;
    /** @type {[typeof __VLS_components.VueApexCharts, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        type: "bar",
        height: "335",
        options: (__VLS_ctx.barChart),
        series: (__VLS_ctx.barchartData.series),
        ref: "chart",
    }));
    const __VLS_54 = __VLS_53({
        type: "bar",
        height: "335",
        options: (__VLS_ctx.barChart),
        series: (__VLS_ctx.barchartData.series),
        ref: "chart",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    /** @type {typeof __VLS_ctx.chart} */ ;
    var __VLS_56 = {};
    var __VLS_55;
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-neutral-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-neutral-700']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[80vh]']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-7xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-12']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[100px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-17']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[100px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-17']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[100px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-17']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white-500']} */ ;
/** @type {__VLS_StyleScopedClasses['text-black']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[100px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-17']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['h-60']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-6']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['h-60']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['h-60']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-6']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal-900']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-0']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
// @ts-ignore
var __VLS_5 = __VLS_4, __VLS_11 = __VLS_10, __VLS_17 = __VLS_16, __VLS_23 = __VLS_22, __VLS_29 = __VLS_28, __VLS_35 = __VLS_34, __VLS_41 = __VLS_40, __VLS_47 = __VLS_46, __VLS_57 = __VLS_56;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VueApexCharts: VueApexCharts,
            chart: chart,
            closeModal: closeModal,
            chartData: chartData,
            chartOffices: chartOffices,
            chartDataBySex: chartDataBySex,
            apexOptions: apexOptions,
            overallOffices: overallOffices,
            apexOptions_byOffice: apexOptions_byOffice,
            series: series,
            apexOption_Equipment: apexOption_Equipment,
            barchartData: barchartData,
            barChart: barChart,
        };
    },
    emits: {},
    props: {
        open: {
            type: Boolean,
            default: false
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        open: {
            type: Boolean,
            default: false
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */
