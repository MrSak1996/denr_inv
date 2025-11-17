<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import { useRoute } from 'vue-router'
import SidebarDropdown from './SidebarDropdown.vue'

const sidebarStore = useSidebarStore()

const props = defineProps(['item', 'index'])
const currentPage = useRoute().name

interface SidebarItem {
  label: string
}

const handleItemClick = () => {
  const pageName =
    sidebarStore.selected === props.item.label ? '' : props.item.label

  sidebarStore.selected = pageName

  if (props.item.children) {
    return props.item.children.some(
      (child: SidebarItem) => sidebarStore.selected === child.label
    )
  }
}
</script>

<template>
  <li>
    <router-link
      :to="item.route"
      class="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4"
      @click.prevent="handleItemClick"
      :class="{
        'bg-graydark dark:bg-meta-4': sidebarStore.selected === item.label
      }"
      :title="sidebarStore.isSidebarCollapsed ? item.label : ''"
    >
      <span v-html="item.icon"></span>

      <transition name="fade">
        <span v-if="!sidebarStore.isSidebarCollapsed">{{ item.label }}</span>
      </transition>
    </router-link>

    <!-- Dropdown -->
    <div class="translate transform overflow-hidden"
        v-show="sidebarStore.selected === item.label">
      <SidebarDropdown
        v-if="item.children"
        :items="item.children"
        :currentPage="currentPage"
        :page="item.label"
      />
    </div>
  </li>
</template>
