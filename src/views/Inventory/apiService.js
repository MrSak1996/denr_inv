import api from '../../../laravel-backend/resources/js/axiosInstance.ts'

export const fetchCurUser = async (apiToken) => {
  try {
    const response = await api.get(`/getUsers?api_token=${apiToken}`)
    return response.data
  } catch (error) {
    console.error('Error fetching current user:', error.message)
    throw error
  }
}



export const fetchData = async (apiToken) => {
  try {
    const response = await api.get(`/getInventoryData?api_token=${apiToken}`)
    return response.data
  } catch (error) {
    console.error('Error fetching inventory data:', error)
    throw error
  }
}

export const getCountStatus = async (apiToken) => {
  try {
    const response = await api.get(`/getCountStatus?api_token=${apiToken}`)
    return response.data
  } catch (error) {
    console.error('Error fetching status counts:', error)
    throw error
  }
}

export const getOutdatedEquipment = async (apiToken) => {
  try {
    const response = await api.get(`/getOutdatedEquipment?api_token=${apiToken}`)
    return response.data
  } catch (error) {
    console.error('Error fetching outdated equipment:', error)
    throw error
  }
}

export const exportData = async () => {
  try {
    const response = await api.get('http://localhost:8000/api/export?export=true', {
      responseType: 'blob',
    })
    return response
  } catch (error) {
    console.error('Error exporting data:', error.message)
    throw error
  }
}
