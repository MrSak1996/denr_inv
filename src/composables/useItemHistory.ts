import { ref } from "vue";
import api from '@/api/axiosInstance';

export function useItemHistory() {
  const itemHistory = ref<any[]>([]);
  const loadingVal = ref(false);
  const error = ref<string | null>(null);

  const loadItemHistory = async (itemId: number | string) => {
    loadingVal.value = true;
    error.value = null;

    try {
      const response = await api.get(`/item-history/${itemId}`);
      itemHistory.value = response.data.data;
    } catch (err: unknown) {
      const e = err as any; // cast to any so TS won’t error
      error.value =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to load item history.";

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
