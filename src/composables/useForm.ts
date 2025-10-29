import { reactive } from 'vue';

interface Form {
  control_no: string;
  qr_code: string;
  acct_person: string;
  sex: string;
  employmentType: string;
  brand: string;
  model: string;
  property_no: string;
  serial_no: string;
  acquisition_cost: number; 
  processor: string;
  division_id: string;
  acct_person_division_id: string;
  selectedDivision: string;
  selectedAcctDivision: string;
  selectedActualDivision: string;
  selectedWorkNature: string;
  selectedSection: string;
  selectedRangeCategory: string;
  selectedEquipmentType: string;
  actual_user: string;
  remarks: string;
  year_acquired: string;
  shelf_life: string;
  status: string;
  source_div: string;
  target_div: string;
  softwareName: string;
  softwareCategory: string;

  
}

interface SpecsForm {
  specs_processor: string;
  specs_ram_capacity: string;
  specs_hdd: number;
  specs_hdd_capacity: string;
  specs_ram: string;
  specs_gpu: number;
  specs_ssd: number;
  specs_ssd_capacity: string;
  specs_gpu_dedic_info: string;
  specs_net: string | null;
  specs_net_iswireless: string;
}

interface SoftwareForm {
  operating_system: string;
  ms_office: string;
  arcgis: string;
  adobe_pdf: string;
  adobe_photoshop: string;
  autocad: string;
}

interface PeripheralForm {
  monitor1QrCode: string;
  monitor1BrandModel: string;
  monitor1Model: string;
  monitor1SerialNumber: string;
  monitor1PropertyNumber: string;
  monitor1AccountPersonInPN: string;
  monitor1ActualUser: string;
  monitor1Status: string;
  monitor2QrCode: string;
  monitor2BrandModel: string;
  monitor2Model: string;
  monitor2SerialNumber: string;
  monitor2PropertyNumber: string;
  monitor2AccountPersonInPN: string;
  monitor2ActualUser: string;
  monitor2Status: string;
  ups_qr_code: string;
  ups_brand: string;
  ups_model: string;
  ups_serial_no: string;
  ups_property_no: string;
  ups_accountPersonInPN: string;
  ups_qr_acctual_user: string;
  ups_status: string;
  mon1division1: string;
  mon1division2: string;
  division_id: string;
}

interface UmCreateForm {
  region: string;
  roles: string;
  role_id: string;
  geo_code: string;
  province: string;
  province_c: string;
  city_mun: string;
  city_mun_c: string | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  complete_address: string;
  employment_status_id: string;
  designation: string;
  sex: string;
  mobile_no: string;
  division: string;
  division_id: string;
  position: string;
  email: string;
  contact_details: string;
  username: string;
  password: string;
}

export function useForm() {
  const form = reactive<Form>({
    control_no: '',
    qr_code: '',
    acct_person: '',
    sex: '',
    employmentType: '',
    brand: '',
    model: '',
    property_no: '',
    serial_no: '',
    acquisition_cost:0,
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
    remarks: '',
    year_acquired: '',
    shelf_life: '',
    status: '',
    source_div: '',
    target_div: '',
    softwareCategory: '',
    softwareName: ''
  });

  const specs_form = reactive<SpecsForm>({
    specs_processor: '',
    specs_ram_capacity: '',
    specs_hdd: 0,
    specs_hdd_capacity: '',
    specs_ram: '',
    specs_gpu: 0, // Ensure this is a number
    specs_ssd: 0,
    specs_ssd_capacity: '',
    specs_gpu_dedic_info: '',
    specs_net: null,
    specs_net_iswireless: '',
  });

  const software_form = reactive<SoftwareForm>({
    operating_system: '',
    ms_office: '',
    arcgis: '',
    adobe_pdf: '',
    adobe_photoshop: '',
    autocad: '',
  });

  const peripheral_form = reactive<PeripheralForm>({
    monitor1QrCode: '',
    monitor1BrandModel: '',
    monitor1Model: '',
    monitor1SerialNumber: '',
    monitor1PropertyNumber: '',
    monitor1AccountPersonInPN: '',
    monitor1ActualUser: '',
    monitor1Status: '',
    monitor2QrCode: '',
    monitor2BrandModel: '',
    monitor2Model: '',
    monitor2SerialNumber: '',
    monitor2PropertyNumber: '',
    monitor2AccountPersonInPN: '',
    monitor2ActualUser: '',
    monitor2Status: '',
    ups_qr_code: '',
    ups_brand: '',
    ups_model: '',
    ups_serial_no: '',
    ups_property_no: '',
    ups_accountPersonInPN: '',
    ups_qr_acctual_user: '',
    ups_status: '',
    mon1division1: '',
    mon1division2: '',
    division_id: '',
  });

  const um_create_form = reactive<UmCreateForm>({
    region: 'REGION IV-A (CALABARZON)',
    roles: '',
    role_id: '',
    geo_code: '',
    province: '',
    province_c: '',
    city_mun: '',
    city_mun_c: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    complete_address: '',
    employment_status_id: '',
    designation: '',
    sex: '',
    mobile_no: '',
    division: '',
    division_id: '',
    position: '',
    email: '',
    contact_details: '',
    username: '',
    password: '',
  });

  return { form, specs_form, software_form, peripheral_form, um_create_form };
}