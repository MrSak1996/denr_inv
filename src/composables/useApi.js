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
    { name: 'RICT', id: '1' },
    { name: 'MES', id: '2' },
    { name: 'PPS', id: '3' },
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

  return {
    division_opts,
    section_opts,
    work_nature,
    equipment_type,
    range_category,
    employment_opts,
    getControlNo,
    getDivision,
    getNatureWork,
    getEquipment,
    getRangeCategory,
    getEmploymentType
  }
}
