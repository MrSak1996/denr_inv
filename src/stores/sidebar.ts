import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isSidebarOpen = ref(true)
  const isSidebarCollapsed = ref(false)
  const manuallyLocked = ref(false) // ✅ renamed for clarity
  const selected = ref('')
  const page = ref('')



  // Toggle mobile sidebar (burger button)
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
    manuallyLocked.value = true
  }

  // Toggle collapse for desktop
  function toggleCollapse() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
    manuallyLocked.value = true
    console.log('Collapsed:', isSidebarCollapsed.value)
  }

  // Automatically close (e.g., click outside) — only if not manually locked
  function closeSidebar() {
    if (!manuallyLocked.value) {
      isSidebarOpen.value = false
      isSidebarCollapsed.value = false
      console.log('Auto-closed sidebar')
    } else {
      console.log('Ignored auto-close (locked by user)')
    }
  }

  // Reset lock if you want sidebar to respond to outside clicks again
  function unlockSidebar() {
    manuallyLocked.value = false
  }

  return {
    selected,
    page,
    isSidebarOpen,
    isSidebarCollapsed,
    manuallyLocked,
    toggleSidebar,
    toggleCollapse,
    closeSidebar,
    unlockSidebar,
  }
})
