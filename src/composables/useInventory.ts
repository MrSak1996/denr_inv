import api from '../../laravel-backend/resources/js/axiosInstance.js'

export const useInventory = () => {
  // Function to open the PDF report
  const printRecord = async (id: string) => {
    try {
      const url = `http://127.0.0.1:8000/api/generatePDFReport?id=${id}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Function to check the item_status
  const checkItemStatus = async (itemId: string): Promise<boolean> => {
    try {
      const response = await api.get('/checkItemStatus', {
        params: { itemId }
      });

      // Assuming the API response has a field `exists` that returns true/false
      return response.data[0].status_title || false;
    } catch (error) {
      console.error('Error checking item status:', error);
      return false;
    }
  };

  return { 
    printRecord, 
    checkItemStatus 
  };
};
