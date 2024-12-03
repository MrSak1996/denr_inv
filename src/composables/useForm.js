// src/composables/useForm.js
import { reactive } from 'vue'

export function useForm() {
  //INVENTORY MANAGEMENT
  const form = reactive({
    control_no: '',
    qr_code: '',
    acct_person: '',
    sex:'',
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
    actual_user: '',
    remarks:'',
    year_acquired:'',
    shelf_life:'',
    status:''
  })

  const specs_form = reactive({
    specs_processor: '',
    specs_ram_capacity:'',
    specs_hdd: 0,
    specs_hdd_capacity: '',
    specs_ram: '',
    specs_gpu:'',
    specs_ssd: 0,
    specs_ssd_capacity:'',
    specs_gpu_dedic_info:'',
    // specs_net: null,
    // specs_net_iswireless: '',
  })

  const software_form = reactive({
    operating_system: '',
    ms_office: '',
    arcgis: '',
    adobe_pdf:'',
    adobe_photoshop: '',
    autocad: ''
  })

  const peripheral_form = reactive({
    monitor1QrCode: "",
    monitor1BrandModel: '',
    monitor1Model: '',
    monitor1SerialNumber: '',
    monitor1PropertyNumber: '',
    monitor1AccountPersonInPN: '',
    monitor1ActualUser: '',
    monitor1Status:'',
    monitor2QrCode: '',
    monitor2BrandModel: '',
    monitor2Model: '',
    monitor2SerialNumber: '',
    monitor2PropertyNumber: '',
    monitor2AccountPersonInPN: '',
    monitor2ActualUser: '',
    monitor2Status:'',
    ups_qr_code: '',
    ups_brand: '',
    ups_model: '',
    ups_serial_no: '',
    ups_property_no: '',
    ups_accountPersonInPN: '',
    ups_qr_acctual_user: '',
    ups_status:'',

  })

  //USER MANAGEMENT
  const um_create_form = reactive({
    region:'REGION IV-A (CALABARZON)',
    roles:'',
    province:'',
    city_mun:'',
    first_name: '',
    middle_name: '',
    last_name:'',
    complete_address:'',
    employment_status:'',
    designation:'',
    sex:'',
    division:'',
    position:'',
    email:'',
    contact_details:'',
    // role:'',
    // assign_module:'',
    username:'',
    password:'',


  })
  return { form,specs_form,software_form,peripheral_form,um_create_form}
}
