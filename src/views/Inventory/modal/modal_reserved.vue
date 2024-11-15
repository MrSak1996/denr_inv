<!-- modal_reserved.vue -->
<template>
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-labelledby="reserve-control-no"
      aria-modal="true"
    >
      <div
        class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-lg w-full max-w-2xl mx-4 lg:mx-auto transition-transform duration-300 transform scale-100"
      >
        <!-- Modal Header -->
        <div class="flex justify-between items-center py-4 px-6 border-b dark:border-neutral-700">
          <h3 id="reserve-control-no" class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Reserve Control Number
          </h3>
          
        </div>
        
        <!-- Modal Body -->
        <div class="flex flex-col justify-center items-center py-8 px-6">
          <p class="text-gray-700 dark:text-gray-300 mb-4 text-center">
            Please confirm if you would like to reserve this Control Number:
          </p>
          <h1 class="text-4xl font-bold text-blue-600 mb-8">{{ controlNo }}</h1>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-150"
            @click="proceed"
          >
            <i class="pi pi-save"></i>
            <span>Proceed</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  
  export default defineComponent({
    props: {
      controlNo: {
        type: String,
        required: true
      },
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    emits: ["close", "proceed"],
    setup(props, { emit }) {
      const closeModal = () => {
        emit("close");
      };
  
      const proceed = () => {
        emit("proceed", props.controlNo);
      };
  
      return {
        closeModal,
        proceed
      };
    }
  });
  </script>
  