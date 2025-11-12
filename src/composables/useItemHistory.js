import { ref } from "vue";
import api from '@/api/axiosInstance';

export function useItemHistory() {
  const itemHistory = ref([]);
  const loadingVal = ref(false);
  const error = ref(null);

  const loadItemHistory = async (itemId) => {
    loadingVal.value = true;
    error.value = null;

    try {
      const response = await api.get(`/item-history/${itemId}`);
      // Make sure to use response.data.data since Laravel Resource wraps it in "data"
      itemHistory.value = response.data.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || "Failed to load item history.";
      console.error("Item history error:", error.value);
    } finally {
      loadingVal.value = false;
    }
  };

  return {
    itemHistory,
    loadingVal,
    error,
    loadItemHistory
  };
}
