<script setup lang="ts">
import { ref, defineProps,watch } from 'vue'

import modal_gen_qr from './modal/modal_gen_qr.vue'
import modal_province_info from './modal/modal_province_info.vue'
import Button from 'primevue/button'
import MeterGroup from 'primevue/metergroup'
import Card from 'primevue/card'
const openQR = ref(false)
const openProInfo = ref(false)
const total = ref(0);
const serviceableCount = ref(0);
const unserviceableCount = ref(0);
const outdatedCount = ref(0);

const props = defineProps({
  role_id: {
    type: Number
  },
  office: {
    type: String
  },
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
  }
})

watch(() => props.total_equipment, (newValue) => {
  total.value = newValue;
});

watch(() => props.total_serviceable_count, (newValue) => {
  serviceableCount.value = newValue;
});

watch(() => props.total_unserviceable_count, (newValue) => {
  unserviceableCount.value = newValue;
});

watch(() => props.outdated_equipment, (newValue) => {
  outdatedCount.value = newValue;
});

const value = ref([
  {
    label: 'Total Equipment',
    color1: '#34d399',
    color2: '#fbbf24',
    value: total,
    icon: 'pi pi-table'
  },
  {
    label: 'Total Serviceable Equipment',
    color1: '#fbbf24',
    color2: '#60a5fa',
    value: serviceableCount,
    icon: 'pi pi-inbox'
  },
  {
    label: 'Total Unserviceable Equipment',
    color1: '#60a5fa',
    color2: '#c084fc',
    value: unserviceableCount,
    icon: 'pi pi-image'
  },
  {
    label: 'Total Outdated Equipment',
    color1: '#60a5fa',
    color2: '#c084fc',
    value: outdatedCount,
    icon: 'pi pi-image'
  }
])

</script>
<template>
  <modal_gen_qr v-if="openQR" :open="openQR" @close="openQR = false"></modal_gen_qr>
  <modal_province_info v-if="openProInfo" :open="openProInfo" @close="openProInfo = false"></modal_province_info>

  <div class="bg-gray-100">
    <!-- Panel Card -->
    <div class="bg-white rounded-lg shadow-lg border border-gray-200">
      <!-- Header -->
      <div class="bg-teal-700 text-white rounded-t-lg px-6 py-2 flex items-center justify-between">
        <!-- Title -->
        <h3 class="text-xl font-bold">DASHBOARD ({{ office }})</h3>

        <!-- Button -->
        <Button severity="danger" label="Generate QR Code" @click="openQR = true" />
      </div>
      <!-- Body -->
      <div class="grid grid-cols-4 gap-4 p-6">
        <!-- Left Side Panel -->
        <div class="flex flex-col gap-4 col-span-1">
          <!-- PENRO RIZAL Panel -->

          <div class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white" >
            <i class="pi pi-map-marker" style="font-size: 30px"></i>
            <div class="text-left">
              <h3 class="text-lg font-bold">CENRO Sta. Cruz</h3>
              <p class="text-sm">Manage Data</p>
            </div>
            <button @click="openProInfo = true" class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100">
              Open
            </button>
          </div>

          <div
            class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
          >
            <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
            <div class="text-left">
              <h3 class="text-lg font-bold">CENRO Lipa City</h3>
              <p class="text-sm">Manage Data</p>
            </div>
            <button class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100">
              Open
            </button>
          </div>
          <div
            class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
          >
            <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
            <div class="text-left">
              <h3 class="text-lg font-bold">CENRO Calaca</h3>
              <p class="text-sm">Manage Data</p>
            </div>
            <button class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100">
              Open
            </button>
          </div>
          <div
            class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
          >
            <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
            <div class="text-left">
              <h3 class="text-lg font-bold">CENRO Calauag</h3>
              <p class="text-sm">Manage Data</p>
            </div>
            <button class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100">
              Open
            </button>
          </div>
          <div
            class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
          >
            <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
            <div class="text-left">
              <h3 class="text-lg font-bold">CENRO Catanauan</h3>
              <p class="text-sm">Manage Data</p>
            </div>
            <button class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100">
              Open
            </button>
          </div>
          <div
            class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
          >
            <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
            <div class="text-left">
              <h3 class="text-lg font-bold">CENRO Tayabas</h3>
              <p class="text-sm">Manage Data</p>
            </div>
            <button class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100">
              Open
            </button>
          </div>
          <div
            class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
          >
            <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
            <div class="text-left">
              <h3 class="text-lg font-bold">CENRO Real</h3>
              <p class="text-sm">Manage Data</p>
            </div>
            <button class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100">
              Open
            </button>
          </div>
          <!-- Add more left-side panels here if needed -->
        </div>

        <!-- Map and Statistics Section -->
        <div class="grid grid-cols-3 gap-4 col-span-3">
          <!-- Map Section -->
          <div class="col-span-2">
            <!-- Added PENRO CAVITE title -->
            <div class="text-center mb-2">
              <h2 class="text-2xl font-bold text-teal-700">STATISTICAL DATA</h2>
            </div>
            <div class="card">
              <MeterGroup :value="value" labelPosition="start">
                <template #label="{ value }">
                  <div class="flex flex-wrap gap-4">
                    <template v-for="val of value">
                      <Card class="flex-1 border border-surface shadow-none">
                        <template #content>
                          <div class="flex justify-between gap-4 w-50">
                            <div class="flex flex-col gap-1">
                              <span class="text-surface-500 dark:text-surface-400 text-sm">
                                {{ val.label }}
                              </span>
                              <span class="font-bold text-lg">{{ val.value }}</span>
                            </div>
                            <span
                              class="ml-auto w-8 h-8 rounded-full inline-flex justify-center items-center text-center"
                              :style="{ backgroundColor: `${val.color1}`, color: '#ffffff' }"
                            >
                              <i :class="val.icon" />
                            </span>
                          </div>
                        </template>
                      </Card>
                    </template>
                  </div>
                </template>
                <template #meter="slotProps">
                  <span
                    :class="slotProps.class"
                    :style="{
                      background: `linear-gradient(to right, ${slotProps.value.color1}, ${slotProps.value.color2})`,
                      width: slotProps.size
                    }"
                  />
                </template>
                <template #start="{ totalPercent }">
                  <div class="flex justify-between relative"></div>
                </template>
              </MeterGroup>
            </div>
            <!-- <div class="calabarzon-map" style="width: 381px; margin-bottom: -119px; margin: auto">
              <img v-if="role_id === 1" src="../../assets/images/map/cavite.png" />
              <img v-if="role_id === 2" src="../../assets/images/map/laguna.png" />
              <img v-if="role_id === 3" src="../../assets/images/map/batangas.png" />
              <img v-if="role_id === 4" src="../../assets/images/map/rizal.png" />
              <img v-if="role_id === 5" src="../../assets/images/map/quezon.png" />
            </div> -->
          </div>

          <!-- Statistics Section -->
          <div class="flex flex-col gap-4">
            <div
              class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
            >
              <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
              <div class="text-left">
                <h3 class="text-lg font-bold">PENRO Cavite</h3>
                <p class="text-sm">Manage Data</p>
              </div>
              <button
                class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100"
              >
                Open
              </button>
            </div>
            <div
              class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
            >
              <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
              <div class="text-left">
                <h3 class="text-lg font-bold">PENRO Laguna</h3>
                <p class="text-sm">Manage Data</p>
              </div>
              <button
                class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100"
              >
                Open
              </button>
            </div>
            <div
              class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
            >
              <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
              <div class="text-left">
                <h3 class="text-lg font-bold">PENRO Batangas</h3>
                <p class="text-sm">Manage Data</p>
              </div>
              <button
                class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100"
              >
                Open
              </button>
            </div>
            <div
              class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
            >
              <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
              <div class="text-left">
                <h3 class="text-lg font-bold">PENRO Rizal</h3>
                <p class="text-sm">Manage Data</p>
              </div>
              <button
                class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100"
              >
                Open
              </button>
            </div>
            <div
              class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
            >
              <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
              <div class="text-left">
                <h3 class="text-lg font-bold">PENRO Quezon</h3>
                <p class="text-sm">Manage Data</p>
              </div>
              <button
                class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100"
              >
                Open
              </button>
            </div>
            <div
              class="bg-teal-700 flex items-center justify-between gap-4 rounded-lg shadow p-2 border border-teal-500 text-white"
            >
              <i class="pi pi-map-marker text-2xl" style="font-size: 30px"></i>
              <div class="text-left">
                <h3 class="text-lg font-bold">Regional Office</h3>
                <p class="text-sm">Manage Data</p>
              </div>
              <button
                class="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-100"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
