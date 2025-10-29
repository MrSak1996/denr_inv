import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useSidebarStore = defineStore('sidebar', () => {
    const isSidebarOpen = ref(true);
    const isSidebarCollapsed = ref(false);
    const selected = useStorage('selected', ref('eCommerce'));
    const page = useStorage('page', ref('Dashboard'));
    function toggleSidebar() {
        isSidebarOpen.value = !isSidebarOpen.value;
    }
        function toggleCollapse() {
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
    }
    
    return { isSidebarOpen,isSidebarCollapsed,toggleCollapse, toggleSidebar, selected, page };
});
