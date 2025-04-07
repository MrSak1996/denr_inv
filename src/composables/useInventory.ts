import api from '@/api/axiosInstance';
import { ref } from 'vue'

export const useInventory = () => {
  // Function to open the PDF report
  const printRecord = async (id: number) => {
    try {
      const url =`https://riis.denrcalabarzon.com/api/generatePDFReport?id=${id}`;
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
  const predefinedRoles = ref([
    { label: "PENRO Cavite", id:1 },
    { label: "PENRO Laguna", id: 2},
    { label: "PENRO Batangas", id:3 },
    { label: "PENRO Rizal", id: 4},
    { label: "PENRO Quezon", id: 5},
    { label: "CENRO Sta. Cruz", id: 6},
    { label: "CENRO Lipa City", id: 7},
    { label: "CENRO Calaca", id: 8},
    { label: "CENRO Calauag", id:9},
    { label: "CENRO Catanauan", id:10 },
    { label: "CENRO Tayabas", id:11 },
    { label: "CENRO Real", id: 12},
    { label: "Regional Office", id:13 }
  ]);
  

  return { 
    printRecord, 
    checkItemStatus,
    OTPsettings,
    predefinedRoles
  };
};
