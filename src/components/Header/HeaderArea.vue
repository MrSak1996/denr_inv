<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import DarkModeSwitcher from './DarkModeSwitcher.vue'
import DropdownMessage from './DropdownMessage.vue'
import DropdownNotification from './DropdownNotification.vue'
import DropdownUser from './DropdownUser.vue'

const sidebarStore = useSidebarStore()

// ✅ This function toggles collapse and logs output
const handleSidebarToggle = () => {
  sidebarStore.toggleCollapse()
}
</script>

<template>
  <header
    class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
  >
    <div
      class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11"
    >
      <!-- Left area (mobile burger) -->
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <button
          class="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          @click="sidebarStore.toggleSidebar"
        >
          ☰
        </button>
      </div>

      <!-- Collapse / Expand button -->
      <div class="hidden sm:block">
        <button
          v-if="!sidebarStore.isSidebarCollapsed"
          class="hidden lg:block rounded-md border border-gray-300 p-2 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-boxdark"
          @click="handleSidebarToggle"
        >
          <!-- Collapse icon (←) -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          v-else
          class="hidden lg:block rounded-md border border-gray-300 p-2 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-boxdark"
          @click="handleSidebarToggle"
        >
          <!-- Expand icon (→) -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Right area -->
      <div class="flex items-center gap-3 2xsm:gap-7">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <DropdownNotification />
          <DropdownMessage />
        </ul>
        <DropdownUser />
      </div>
    </div>
  </header>
</template>
