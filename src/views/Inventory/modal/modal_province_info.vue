<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
const chart = ref(null)

const emit = defineEmits(['close', 'proceed'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const closeModal = () => {
  emit('close')
}
const chartData = {
  series: [65, 34, 45, 12],
  labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown']
}

const chartDataBySex = {
  series: [
    {
      name: 'Product One',
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45]
    },

    {
      name: 'Product Two',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51]
    }
  ],
  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
}

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
}

const apexOptions_bySex = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left'
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1
    },

    toolbar: {
      show: false
    }
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300
        }
      }
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350
        }
      }
    }
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight'
  },

  labels: {
    show: false,
    position: 'top'
  },
  grid: {
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5
    }
  },
  xaxis: {
    type: 'category',
    categories: chartData.labels,
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px'
      }
    },
    min: 0,
    max: 100
  }
}

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
        return '$ ' + val + ' thousands'
      }
    }
  }
}

const apexOptions_byYear = ref({
  chart: {
    height: 150,
    type: 'radialBar'
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,
      hollow: {
        margin: 5,
        size: '30%',
        background: 'transparent',
        image: undefined
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          show: false
        }
      },
      barLabels: {
        enabled: true,
        useSeriesColors: true,
        offsetX: -8,
        fontSize: '16px',
        formatter: (seriesName, opts) => {
          return seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex]
        }
      }
    }
  },
  colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
  labels: chartData.labels,
  legend: {
    show: true,
    position: 'right', // Adjust the position as needed (e.g., 'top', 'right', 'bottom', 'left')
    markers: {
      width: 12,
      height: 12,
      radius: 12
    },
    itemMargin: {
      horizontal: 10,
      vertical: 5
    }
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          show: false
        }
      }
    }
  ]
})

const series = ref([
  { name: 'Marine Sprite', data: [44, 55, 41, 37, 22, 43, 21] },
  { name: 'Striking Calf', data: [53, 32, 33, 52, 13, 43, 32] },
  { name: 'Tank Picture', data: [12, 17, 11, 9, 15, 11, 20] },
  { name: 'Bucket Slope', data: [9, 7, 5, 8, 6, 9, 4] },
  { name: 'Reborn Kid', data: [25, 12, 19, 32, 25, 24, 10] }
])
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
        return val + 'K'
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
        return val + 'K'
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
})

const apexOption_semiDounut = ref({
  chart: {
    type: 'donut'
  },
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: 10
    }
  },
  grid: {
    padding: {
      bottom: -100
    }
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ]
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog"
    tabindex="-1"
    aria-labelledby="dashboard-modal"
  >
    <div
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-xl w-full h-[80vh] max-w-7xl mx-4 overflow-auto"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center py-1 px-6 bg-teal-700 text-white">
        <h3 class="text-2xl font-bold">Dashboard Preview</h3>
        <button @click="closeModal" class="text-gray-300 hover:text-gray-100">✖</button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 grid grid-cols-12 gap-4">
        <!-- Top Statistics -->
        <div class="col-span-12 grid grid-cols-4 gap-4">
          <div class="bg-teal-700 text-white p-4 rounded-lg shadow text-center">
            <h4 class="text-xl font-bold">Overall Offices</h4>
            <p class="text-4xl font-extrabold">--</p>
          </div>
          <div class="bg-teal-700 text-white p-4 rounded-lg shadow text-center">
            <h4 class="text-xl font-bold">Total Actual Users</h4>
            <p class="text-4xl font-extrabold">--</p>
          </div>
          <div class="bg-teal-700 text-white p-4 rounded-lg shadow text-center">
            <h4 class="text-xl font-bold">Accountable Users</h4>
            <p class="text-4xl font-extrabold">--</p>
          </div>
          <div class="bg-teal-700 text-white p-4 rounded-lg shadow text-center">
            <h4 class="text-xl font-bold">Offices</h4>
            <p class="text-4xl font-extrabold">--</p>
          </div>
        </div>

        <!-- Left Donut Charts -->
        <div class="col-span-3 p-2 rounded-lg shadow h-60">
          <h5 class="text-lg font-bold mb-2">Type of ICT Equipment</h5>
          <div class="h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center">
            <VueApexCharts
              type="donut"
              width="150"
              height="150"
              :options="apexOptions"
              :series="chartData.series"
              ref="chart"
            />
          </div>
        </div>
        <div class="col-span-6 p-2 rounded-lg shadow h-60">
          <h5 class="text-lg font-bold">Type of ICT Equipment by Sex</h5>
          <div class="h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center">
            <VueApexCharts
              type="area"
              height="150"
              :width="'200%'"
              :options="apexOptions_byOffice"
              :series="chartDataBySex.series"
              ref="chart"
            />
          </div>
        </div>
        <div class="col-span-3 p-4 rounded-lg shadow h-60">
          <h5 class="text-lg font-bold mb-2">Year Acquired</h5>
          <div class="h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center">
            <VueApexCharts
              type="donut"
              width="150"
              height="150"
              :options="apexOptions"
              :series="chartData.series"
              ref="chart"
            />
          </div>
        </div>

        <!-- Right Section -->

        <div class="col-span-3 p-4 rounded-lg shadow">
          <h5 class="text-lg font-bold mb-2">Equipment by Year Acquired</h5>
          <div class="h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center">
            <VueApexCharts
              type="radialBar"
              :height="apexOptions_byYear.chart.height"
              :options="apexOptions"
              :series="chartData.series"
            />
          </div>
        </div>
        <div class="col-span-6 p-4 rounded-lg shadow">
          <h5 class="text-lg font-bold mb-2">Equipment by Office</h5>
          <div class="h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center">
            <VueApexCharts
              type="bar"
              height="300"
              :width="'200%'"
              :options="apexOption_Equipment"
              :series="series"
            />
          </div>
        </div>
        <div class="col-span-3 p-4 rounded-lg shadow">
          <h5 class="text-lg font-bold mb-2">Equipment by Year Acquired</h5>
          <div class="h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center">
            <VueApexCharts
              type="radialBar"
              :height="apexOptions_byYear.chart.height"
              :options="apexOptions"
              :series="chartData.series"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
