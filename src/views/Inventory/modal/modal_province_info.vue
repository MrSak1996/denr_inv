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

const chartOffices = {
  series: [100],
  labels: ['Division']
}

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
      formatter: function (val: string | number) {
        return '$ ' + val + ' thousands'
      }
    }
  }
}

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
      formatter: function (val: string | number) {
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
      formatter: function (val: string | number) {
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
}
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
}
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
          <div class="bg-white-500 text-black p-4 rounded-lg shadow text-center border-2 border-teal-900 border-solid">
            <h4 class="text-xl font-bold">Overall Offices</h4>
            <div class="h-[100px] w-full bg-gray-0 rounded-lg flex items-center justify-center">
              <VueApexCharts
              class="mt-17"
                type="donut"
                width="150"
                height="150"
                :options="overallOffices"
                :series="chartOffices.series"
                ref="chart"
              />
            </div>
          </div>
          <div class="bg-white-500 text-black p-4 rounded-lg shadow text-center border-2 border-teal-900 border-solid">
            <h4 class="text-xl font-bold">Total Actual Users</h4>
            <div class="h-[100px] w-full bg-gray-0 rounded-lg flex items-center justify-center">
              <VueApexCharts
              class="mt-17"
                type="donut"
                width="150"
                height="150"
                :options="overallOffices"
                :series="chartOffices.series"
                ref="chart"
              />
            </div>
          </div>
          <div class="bg-white-500 text-black p-4 rounded-lg shadow text-center border-2 border-teal-900 border-solid">
            <h4 class="text-xl font-bold">Accountable Users</h4>
            <div class="h-[100px] w-full bg-gray-0 rounded-lg flex items-center justify-center">
              <VueApexCharts
              class="mt-17"
                type="donut"
                width="150"
                height="150"
                :options="overallOffices"
                :series="chartOffices.series"
                ref="chart"
              />
            </div>
          </div>
          <div class="bg-white-500 text-black p-4 rounded-lg shadow text-center border-2 border-teal-900 border-solid">
            <h4 class="text-xl font-bold">Offices</h4>
            <div class="h-[100px] w-full bg-gray-0 rounded-lg flex items-center justify-center">
              <VueApexCharts
              class="mt-17"
                type="donut"
                width="150"
                height="150"
                :options="overallOffices"
                :series="chartOffices.series"
                ref="chart"
              />
            </div>
          </div>
        </div>

        <!-- Left Donut Charts -->
        <div class="col-span-3 p-2 rounded-lg shadow h-60 border-2 border-teal-900">
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
        <div class="col-span-6 p-2 rounded-lg shadow h-60 border-2 border-teal-900">
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
        <div class="col-span-3 p-4 rounded-lg shadow h-60 border-2 border-teal-900">
          <h5 class="text-lg font-bold mb-2">Equipment by Office</h5>
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

        <div class="col-span-3 p-4 rounded-lg shadow border-2 border-teal-900">
          <h5 class="text-lg font-bold mb-2">Equipment by Year Acquired</h5>
          <div class="h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center">
            <VueApexCharts
              type="bar"
              height="335"
              :options="barChart"
              :series="barchartData.series"
              ref="chart"
            />
          </div>
        </div>
        <div class="col-span-6 p-4 rounded-lg shadow border-2 border-teal-900">
          <h5 class="text-lg font-bold mb-2">Count of Equipment per Division</h5>
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
        <div class="col-span-3 p-4 rounded-lg shadow border-2 border-teal-900">
          <h5 class="text-lg font-bold mb-2">Equipment by Year Acquired</h5>
          <div class="h-auto w-full bg-gray-0 rounded-lg flex items-center justify-center">
            <VueApexCharts
              type="bar"
              height="335"
              :options="barChart"
              :series="barchartData.series"
              ref="chart"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
