<script setup lang="ts">
import { ref, watch } from 'vue'
import backgroundImage from '../../assets/images/bar-chart.gif'
import outdatedImage from '../../assets/images/task-management.gif'
import invalidImage from '../../assets/images/file.gif'
import serviceableImage from '../../assets/images/interface.gif';
import userviceableImage from '../../assets/images/error.gif';

const props = defineProps({
  total_equipment: {
    type: Number,
    required: true
  },
  total_serviceable_count: {
    type: Number,
    required: true
  },
  total_unserviceable_count: {
    type: Number,
    required: true
  },
  outdated_equipment: {
    type: Number,
    required: true
  },
  invalid_data: {
    type: Number,
    required: true
  }
})
const total = ref(0)
const serviceableCount = ref(0)
const unserviceableCount = ref(0)
const outdatedCount = ref(0)
const invalidCount = ref(0)

// Watchers to update the reactive variables when props change
watch(
  () => ({
    total: props.total_equipment,
    serviceable: props.total_serviceable_count,
    unserviceable: props.total_unserviceable_count,
    outdated: props.outdated_equipment,
    invalid: props.invalid_data
  }),
  (newValues) => {
    total.value = newValues.total
    serviceableCount.value = newValues.serviceable
    unserviceableCount.value = newValues.unserviceable
    outdatedCount.value = newValues.outdated
    invalidCount.value = newValues.invalid
  }
)

const cardItems = ref([
  {
    icon: `<svg
          class="fill-primary dark:fill-white"
          width="22"
          height="16"
          viewBox="0 0 576 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
    <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l176 0-10.7 32L160 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-69.3 0L336 416l176 0c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0zM512 64l0 224L64 288 64 64l448 0z"/></svg>

          `,
    title: 'Total ICT Equipment',
    total: total,
    growthRate: 0.43,
    bgImage: backgroundImage
  },
  {
    icon: `<svg
            class="fill-primary dark:fill-white"
            width="20"
            height="22"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
          `,
    title: 'Serviceable',
    total: serviceableCount,
    growthRate: 4.35,
    bgImage: serviceableImage
  },
  {
    icon: `<svg
            class="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
          `,
    title: 'Unserviceable',
    total: unserviceableCount,
    growthRate: 2.59,
    bgImage: userviceableImage
  },
  {
    icon: `<svg
            class="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          <path d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4l54.1 0 109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109 0-54.1c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>
          </svg>`,
    title: 'Outdated Equipment',
    total: outdatedCount,
    growthRate: -0.95,
    bgImage: outdatedImage
  },
  {
    icon: `<svg
            class="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          <path d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4l54.1 0 109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109 0-54.1c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>
          </svg>`,
    title: 'Invalid Data',
    total: invalidCount,
    growthRate: -0.95,
    bgImage: invalidImage
  }
])
</script>

<template>
  <!-- Card Item Start -->
  <div
  v-for="(item, index) in cardItems"
  :key="index"
  class="relative rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden"
>
  <div class="mt-4 flex items-center justify-between relative">
    <!-- Text Content -->
    <div class="z-10">
      <h1 class="text-title-md font-bold text-black dark:text-white">
        {{ item.total }}
      </h1>
      <span class="text-sm font-medium">{{ item.title }}</span>
    </div>

    <!-- Growth Rate Indicator -->
    <span
      class="flex items-center gap-1 text-sm font-medium"
      :class="{ 'text-meta-3': item.growthRate > 0, 'text-meta-5': item.growthRate < 0 }"
    ></span>
  </div>

  <!-- Background Image -->
  <img
    :src="item.bgImage"
    alt="Card Background"
    class="absolute right-2 top-1/2 transform -translate-y-1/2 w-24 h-28 object-contain"
  />
</div>


  <!-- Card Item End -->
</template>
