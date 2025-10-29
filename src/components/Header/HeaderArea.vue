<script setup>
import { useSidebarStore } from '@/stores/sidebar' // ✅ adjust path if file name differs
const sidebarStore = useSidebarStore()
const toggleSidebar = () => sidebarStore.toggleSidebar()
const toggleCollapse = () => sidebarStore.toggleCollapse()

import DarkModeSwitcher from './DarkModeSwitcher.vue'
import DropdownMessage from './DropdownMessage.vue'
import DropdownNotification from './DropdownNotification.vue'
import DropdownUser from './DropdownUser.vue'

// Single function to handle both actions
const handleSidebarToggle = () => {
  if (sidebarStore.isSidebarCollapsed) {
    sidebarStore.isSidebarCollapsed = true
    console.log("a");
  } else {
    sidebarStore.toggleCollapse() // collapse sidebar
  }
}

</script>

<template>
  <header class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
    <div class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <!-- Hamburger Toggle BTN -->
        <button
          class="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          @click="sidebarStore.toggleSidebar()">
          <span class="relative block h-5.5 w-5.5 cursor-pointer">
            <span class="block absolute right-0 h-full w-full">
              <span
                class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white"
                :class="{ '!w-full delay-300': !sidebarStore.isSidebarOpen }"></span>
              <span
                class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white"
                :class="{ '!w-full delay-400': !sidebarStore.isSidebarOpen }"></span>
              <span
                class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white"
                :class="{ '!w-full delay-500': !sidebarStore.isSidebarOpen }"></span>
            </span>
            <span class="block absolute right-0 h-full w-full rotate-45">
              <span
                class="absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white"
                :class="{ '!h-0 delay-[0]': !sidebarStore.isSidebarOpen }"></span>
              <span
                class="delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white"
                :class="{ '!h-0 delay-200': !sidebarStore.isSidebarOpen }"></span>
            </span>
          </span>
        </button>
      </div>
      <div class="hidden sm:block">
        <div class="relative">
          <!-- Collapse Sidebar Button -->
          <!-- Collapse Sidebar Button -->
          <button v-if="!sidebarStore.isSidebarCollapsed"
            class="hidden lg:block rounded-md border border-gray-300 p-2 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-boxdark"
            @click="handleSidebarToggle">
            <!-- Collapse icon (←) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Show this only when collapsed -->
          <button v-else
          :hidden="true"
            class="hidden lg:block rounded-md border border-gray-300 p-2 hover:bg-gray-100 dark:border-strokedark dark:hover:bg-boxdark"
            @click="handleSidebarToggle">
            <!-- Expand icon (→) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>



        </div>
      </div>

      <div class="flex items-center gap-3 2xsm:gap-7">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <li>
            <!-- Dark Mode Toggler -->
            <!-- Dark Mode Toggler -->
          </li>

          <!-- Notification Menu Area -->
          <DropdownNotification />
          <!-- Notification Menu Area -->

          <!-- Chat Notification Area -->
          <DropdownMessage />
          <!-- Chat Notification Area -->
        </ul>

        <!-- User Area -->
        <DropdownUser />
        <!-- User Area -->
      </div>
    </div>
  </header>
</template>
