// src/composables/useItemHistory.js
import { ref } from "vue";
import api from '../api/axiosInstance'


export function useItemHistory() {
  const itemHistory = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const loadItemHistory = async (itemId) => {
    
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/item-history/${itemId}`);
      itemHistory.value = response.data;
      console.log(response.data);
    } catch (err) {
      error.value = err.message || "Failed to load item history.";
    } finally {
      loading.value = false;
    }
  };

  return {
    itemHistory,
    loading,
    error,
    loadItemHistory,
  };
}
