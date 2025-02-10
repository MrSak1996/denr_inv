import api from '../../laravel-backend/resources/js/axiosInstance.ts'

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

  const OTPsettings = async () => {
    try {
      const response = await api.get(`/getOTPStatus`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // Function to check the item_status
  const checkItemStatus = async (itemId: string): Promise<string> => {
    try {
      const response = await api.get('/checkItemStatus', {
        params: { itemId },
      });
  
      // Check if the response contains data and a status_title
      return response.data[0]?.status_title || "DRAFT";
    } catch (error) {
      console.error('Error checking item status:', error);
      return "DRAFT";
    }
  };
  

  return { 
    printRecord, 
    checkItemStatus,
    OTPsettings
  };
};
