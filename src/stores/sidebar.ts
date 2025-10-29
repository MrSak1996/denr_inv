import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isSidebarOpen = ref(true)
  const isSidebarCollapsed = ref(false) // 👈 add this

  const selected = useStorage('selected', ref('eCommerce'))
  const page = useStorage('page', ref('Dashboard'))

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

    function toggleCollapse() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value // 👈 add this
  }


  return { isSidebarOpen,isSidebarCollapsed,toggleCollapse, toggleSidebar, selected, page }
})

// export const useSidebarStore = defineStore('sidebar', () => {
//   const isSidebarOpen = ref(true)
//   const isSidebarCollapsed = ref(false) // 👈 add this

//   const toggleSidebar = () => {
//     isSidebarOpen.value = !isSidebarOpen.value
//   }

//   const toggleCollapse = () => {
//   }

//   return { isSidebarOpen, isSidebarCollapsed, toggleSidebar, toggleCollapse }
// })