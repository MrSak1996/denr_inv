<template>
  <!-- Modal -->
  
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const progress = ref(0); // Progress bar percentage
    const isLoading = ref(false); // Controls the visibility of the modal and progress bar
    const messages = ref([
      'Loading, please wait...',
      'Processing data...',
      'Initializing data...',
      'Fetching resources...',
      'Preparing your data...',
      'Almost there, hang tight...'
    ]); // Array of dynamic messages
    const currentMessage = ref('Loading, please wait...'); // Default message

    const startProgress = () => {
      progress.value = 0;
      isLoading.value = true; // Show modal
      updateMessage(); // Set initial message
      const interval = setInterval(() => {
        if (progress.value < 90) {
          progress.value += Number((Math.random() * 10).toFixed(2)); // Simulate progress increase
          updateMessage(); // Update message periodically
        } else {
          clearInterval(interval); // Stop increasing when close to 100%
        }
      }, 500); // Adjust speed of progress increase
    };

    const completeProgress = () => {
      progress.value = 100;
      setTimeout(() => {
        isLoading.value = false; // Hide modal when complete
      }, 500);
    };

    const updateMessage = () => {
      // Change the message randomly or you can cycle through the array sequentially
      const randomIndex = Math.floor(Math.random() * messages.value.length);
      currentMessage.value = messages.value[randomIndex];
    };

    return {
      progress,
      isLoading,
      currentMessage,
      startProgress,
      completeProgress,
    };
  },
};
</script>

<style scoped>
/* Transition for smooth progress bar animation */
.progress-bar {
  transition: width 0.2s ease-in-out;
}
</style>
