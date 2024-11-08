// src/composables/useForm.js
import { reactive } from 'vue'

export function useForm() {
  const form = reactive({
    control_no: '',
    qr_code: '',
    acct_person: '',
    employmentType: '',
    brand: '',
    model: '',
    property_no: '',
    serial_no: '',
    aquisition_cost: '',
    processor: '',
    division_id: '',
    acct_person_division_id: '',
    selectedDivision: '',
    selectedAcctDivision: '',
    selectedActualDivision: '',
    selectedWorkNature: '',
    selectedSection: '',
    selectedRangeCategory: '',
    selectedEquipmentType: '',
    actual_user: ''
  })

  const specs_form = reactive({
    specs_processor: '',
    specs_hdd: '',
    specs_hdd_capacity: '',
    specs_ram: '',
    specs_gpu:'',
    specs_ssd: '',
    specs_ssd_capacity:'',
    specs_gpu_isbuilt_in:'',
    specs_gpu_isdedicated:'',
    specs_gpu_dedic_info:'',
    specs_net_lan: '',
    specs_net_wireless: '',
    specs_net_both: '',
    specs_net_isbuilt_in: '',
    specs_net_with_dongle: '',
  })

  return { form,specs_form }
}
