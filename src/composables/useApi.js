// src/composables/useApi.js
import { ref } from 'vue'
import api from '../../laravel-backend/resources/js/axiosInstance.js'

export function useApi() {
  const division_opts = ref([])
  const work_nature = ref([])
  const equipment_type = ref([])
  const range_category = ref([])
  const employment_opts = ref([])
  const section_opts = ref([
    { name: 'RICT', id: 1 },
    { name: 'MES', id: 2 },
    { name: 'PPS', id: 3}
  ])

  const getControlNo = async (form) => {
    try {
      const res = await api.get('/getControlNo')
      const controlNo = res.data[0].control_no
      const paddedControlNo = String(controlNo).padStart(4, '0')
      form.control_no = `R4A-RICT-${paddedControlNo}`
    } catch (error) {
      console.error('Error fetching control number:', error)
    }
  }

  const getDivision = async () => {
    try {
      const res = await api.get('/getDivision')
      division_opts.value = res.data.map((division) => ({
        id: division.id,
        value: division.id,
        name: `${division.acronym} - ${division.division_title}`
      }))
    } catch (error) {
      console.error('Error fetching divisions:', error)
    }
  }

  const getNatureWork = async () => {
    try {
      const res = await api.get('/getNatureWork')
      work_nature.value = res.data.map((work) => ({
        id: work.id,
        name: work.nature_work_title
      }))
    } catch (error) {
      console.error('Error fetching work nature:', error)
    }
  }

  const getEquipment = async () => {
    try {
      const res = await api.get('/getEquipment')
      equipment_type.value = res.data.map((item) => ({
        id: item.id,
        name: item.equipment_title
      }))
    } catch (error) {
      console.error('Error fetching equipment types:', error)
    }
  }

  const getRangeCategory = async () => {
    try {
      const res = await api.get('/getRangeCategory')
      range_category.value = res.data.map((item) => ({
        id: item.id,
        name: item.range_title
      }))
    } catch (error) {
      console.error('Error fetching range categories:', error)
    }
  }

  const getEmploymentType = async () => {
    try {
      const res = await api.get('/getEmploymentType')
      employment_opts.value = res.data.map((item) => ({
        id: item.id,
        name: item.employment_title
      }))
    } catch (error) {
      console.error('Error fetching employment types:', error)
    }
  }
  const capacity_opts = ref([
    { name: '1 TB', value: '1 TB' },
    { name: '2 TB', value: '2 TB' },
    { name: '3 TB', value: '3 TB' },
    { name: '4 TB', value: '4 TB' },
    { name: '5 TB', value: '5 TB' },
    { name: '100 GB',value: '100 GB' },
    { name: '250 GB',value: '250 GB' },
    { name: '400 GB',value: '400 GB' },
    { name: '500 GB',value: '500 GB' }
  ])

  const ram_capacity_opts = ref([
    { name: '64 GB',value: '64 GB' },
    { name: '32 GB',value: '32 GB' },
    { name: '24 GB',value: '24 GB' },
    { name: '16 GB',value: '16 GB' },
    { name: '8 GB',value: '8 GB' },
    { name: '4 GB',value: '4 GB' },
    { name: '2 GB',value: '2 GB' },

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
    division_opts,
    section_opts,
    work_nature,
    equipment_type,
    range_category,
    employment_opts,
    capacity_opts,
    ram_opts,
    ram_capacity_opts,
    getControlNo,
    getDivision,
    getNatureWork,
    getEquipment,
    getRangeCategory,
    getEmploymentType
  }
}
