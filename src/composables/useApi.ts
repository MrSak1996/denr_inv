// src/composables/useApi.js
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

import api from '@/api/axiosInstance'
interface Option {
  id: number
  name: string
}
interface WorkNature {
  id: number
  nature_work_title: string
}

interface Equipment {
  id: number
  equipment_title: string
}

interface RangeCategory {
  id: number
  range_title: string
}

interface Employment {
  id: number
  employment_title: string
}

interface Role {
  id: number
  roles: string
}

// Define the general option type used in UI components
interface Option {
  id: number
  name: string
}
export function useApi() {
  const authStore = useAuthStore()
  
  const division_opts = ref<Option[]>([])
  const qr_opts = ref<Option[]>([])

  const designation = ref<string | null>(null)
  const qr_code_temp = ref<string | null>(null)
  const user_role = ref<number | null>(null)
  const progress = ref<number>(0)
  const isLoading = ref<boolean>(false)

  const work_nature = ref<Option[]>([])
  const equipment_type = ref<Option[]>([])
  const range_category = ref<Option[]>([])
  const employment_opts = ref<Option[]>([])
  const roles_opts = ref<{ id: number; name: string }[]>([])

  const currentMessage = ref<string>('Loading, please wait...')
  const messages = ref<string[]>([
    'Loading, please wait...',
    'Processing data...',
    'Initializing data...',
    'Fetching resources...',
    'Preparing your data...',
    'Almost there, hang tight...'
  ])

  const fetchCurUser = async () => {
    // Retrieve the API token from localStorage
    const api_token = localStorage.getItem('api_token')

    // Check if the token exists
    if (!api_token) {
      console.error('API token not found. Please log in.')
      return
    }

    try {
      // Make the API call to fetch the current user
      const response = await api.get(`/getUsers?api_token=${api_token}`, {
        headers: {
          Authorization: `Bearer ${api_token}`,
          'Content-Type': 'application/json'
        }
      })

      // Check if the response status is valid
      if (response.status === 200 && response.data) {
        designation.value = response.data.data[0].roles
        return response.data
      } else {
        console.error('Failed to fetch current user: Invalid response')
      }
    } catch (error) {
      // Handle any errors
      console.error('Error fetching current user:')
    }
  }
  const getQRCodeTemp = async () => {
    const user = await fetchCurUser()
    user_role.value = user.data[0].role_id

    try {
      const { data, status } = await api.get(`/getQRCodeTemp?user_role=${user_role.value}`)

      if (status === 200 && data?.length) {
        qr_code_temp.value = data[0].code
      } else {
        console.error('QR Code data not found.')
      }
    } catch (error) {
      console.error('Error fetching QR Code:')
    }
  }
  const getControlNo = async (form: { control_no: string }, userId: number) => {
    try {
      const res = await api.get(`/getControlNo?id=${userId}`)
      const controlNo = res.data.control_no
      const paddedControlNo = String(controlNo).padStart(4, '0')
      form.control_no = paddedControlNo
    } catch (error) {
      console.error(error)
    }
  }
  const getQRData = async () => {
    try {
      const res = await api.get('/getQRData', { params: { role: authStore.role_id } })
      qr_opts.value = res.data.map((item: { qr_code: string }) => ({
        id: item.qr_code,
        value: item.qr_code,
        name: `${item.qr_code}`
      }))
    } catch (error) {
      console.error('Error fetching QR code:', error)
    }
  }

  const getDivision = async () => {
    try {
      const res = await api.get('/getDivision', { params: { role: authStore.role_id } })
      division_opts.value = res.data.map(
        (division: { id: number; acronym: string; division_title: string }) => ({
          id: division.id,
          value: division.id,
          name: `${division.acronym} - ${division.division_title}`
        })
      )

    } catch (error) {
      console.error('Error fetching divisions:', error)
    }
  }
  const getNatureWork = async (): Promise<void> => {
    try {
      const res = await api.get<WorkNature[]>('/getNatureWork')
      work_nature.value = res.data.map((work) => ({
        id: work.id,
        name: work.nature_work_title
      }))
    } catch (error) {
      console.error('Error fetching work nature:', error)
    }
  }

  const getEquipment = async (): Promise<void> => {
    try {
      const res = await api.get<Equipment[]>('/getEquipment')
      equipment_type.value = res.data.map((item) => ({
        id: item.id,
        name: item.equipment_title
      }))
    } catch (error) {
      console.error('Error fetching equipment types:', error)
    }
  }

  const getRangeCategory = async (): Promise<void> => {
    try {
      const res = await api.get<RangeCategory[]>('/getRangeCategory')
      range_category.value = res.data.map((item) => ({
        id: item.id,
        name: item.range_title
      }))
    } catch (error) {
      console.error('Error fetching range categories:', error)
    }
  }

  const getEmploymentType = async (): Promise<void> => {
    try {
      const res = await api.get<Employment[]>('/getEmploymentType')
      employment_opts.value = res.data.map((item) => ({
        id: item.id,
        value:item.id,
        name: item.employment_title
      }))

    } catch (error) {
      console.error('Error fetching employment types:', error)
    }
  }

  const getUserRoles = async (role_id: number): Promise<void> => {
    try {
      const res = await api.get<Role[]>('/getUserRoles')

      if (role_id === 13) {
        roles_opts.value = res.data.map((item) => ({
          id: item.id,
          name: item.roles
        }))
        return
      }

      const roleMapping: Record<number, string> = {
        1: 'PENRO CAVITE',
        2: 'PENRO LAGUNA',
        3: 'PENRO BATANGAS',
        4: 'PENRO RIZAL',
        5: 'PENRO QUEZON',
        6: 'CENRO Sta. Cruz',
        7: 'CENRO Lipa City',
        8: 'CENRO Calaca',
        9: 'CENRO Calauag',
        10: 'CENRO Catanauan',
        11: 'CENRO Tayabas',
        12: 'CENRO Real',
        13: 'Regional Office'
      }

        roles_opts.value = [{ id: role_id, name: roleMapping[role_id] || 'Unknown Role' }]
    } catch (error) {
      console.error('Error fetching user role:', error)
    }
  }

  const startProgress = () => {
    progress.value = 0
    isLoading.value = true
    updateMessage()
    const interval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += Number((Math.random() * 10).toFixed(2)) // Simulate progress increase
        updateMessage()
      } else {
        clearInterval(interval)
      }
    }, 500)
  }

  const completeProgress = () => {
    progress.value = 100
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }

  const updateMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.value.length)
    currentMessage.value = messages.value[randomIndex]
  }
  const predefinedSoftware = ref([
    { label: 'Operating System', key: 'operating_system' },
    { label: 'Microsoft Office', key: 'ms_office' },
    { label: 'Adobe PDF', key: 'adobe_pdf' },
    { label: 'ARCGIS', key: 'arcgis' },
    { label: 'Adobe Photoshop', key: 'adobe_photoshop' }
  ])
  const province_opts = ref([
    { name: 'Cavite', id: 21 },
    { name: 'Laguna', id: 34 },
    { name: 'Rizal', id: 58 },
    { name: 'Batangas', id: 10 },
    { name: 'Quezon', id: 56 }
  ])
  const status_opts = ref([
    { name: 'Serviceable', id: 1 },
    { name: 'Unserviceable', id: 2 },
    { name: 'Returned', id: 3 }
  ])
  const section_opts = ref([
    { name: 'RICT', id: 1 },
    { name: 'MES', id: 2 },
    { name: 'PPS', id: 3 }
  ])
  const sex_opts = ref([
    { name: 'Male', value: 'Male' },
    { name: 'Female', value: 'Female' }
  ])
  const capacity_opts = ref([
    { name: '1 TB', value: '1 TB' },
    { name: '2 TB', value: '2 TB' },
    { name: '3 TB', value: '3 TB' },
    { name: '4 TB', value: '4 TB' },
    { name: '5 TB', value: '5 TB' },
    { name: '100 GB', value: '100 GB' },
    { name: '128 GB', value: '128 GB' },
    { name: '250 GB', value: '250 GB' },
    { name: '400 GB', value: '400 GB' },
    { name: '512 GB', value: '512 GB' }
  ])
  const ram_capacity_opts = ref([
    { name: '2 GB', value: '2 GB' },
    { name: '4 GB', value: '4 GB' },
    { name: '8 GB', value: '8 GB' },
    { name: '16 GB', value: '16 GB' },
    { name: '24 GB', value: '24 GB' },
    { name: '32 GB', value: '32 GB' },
    { name: '64 GB', value: '64 GB' }
  ])

  const ram_opts = ref([
    { name: 'Static RAM', id: '1' },
    { name: 'Dynamic RAM', id: '2' },
    { name: 'Synchronous Dynamic RAM (SDRAM)', id: '3' },
    { name: 'Single Data Rate Synchronous Dynamic RAM', id: '4' },
    { name: 'DDR2', id: '5' },
    { name: 'DDR3', id: '6' },
    { name: 'DDR4', id: '7' },
    { name: 'GDDR', id: '8' },
    { name: 'SDRAM', id: '9' },
    { name: 'GDDR2', id: '10' },
    { name: 'GDDR3', id: '11' },
    { name: 'GDDR4', id: '12' },
    { name: 'GDDR5', id: '13' },
    { name: 'Flash Memory', id: '14' }
  ])

  return {
    sex_opts,
    qr_opts,
    province_opts,
    roles_opts,
    status_opts,
    division_opts,
    section_opts,
    work_nature,
    equipment_type,
    range_category,
    employment_opts,
    capacity_opts,
    ram_opts,
    qr_code_temp,
    ram_capacity_opts,
    predefinedSoftware,
    isLoading,
    messages,
    currentMessage,
    progress,
    getQRData,
    startProgress,
    completeProgress,
    fetchCurUser,
    getQRCodeTemp,
    getControlNo,
    getDivision,
    getNatureWork,
    getEquipment,
    getRangeCategory,
    getEmploymentType,
    getUserRoles
  }
}
