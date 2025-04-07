<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import api from '@/api/axiosInstance';
import { useRouter, useRoute } from 'vue-router'
import { useForm } from '@/composables/useForm'
import { useToast } from 'primevue/usetoast'
const route = useRoute()
const emit = defineEmits(['close', 'proceed'])

const props = defineProps({
  openModal: Boolean,
  division: Array,
  status: Array,
  userID: String,
  inventory_id: Number,
  gen_info_id: String,
  acct_person: String,
  actual_user: String,
  monitor1QrCode: String,
  monitor1BrandModel:String,
  monitor1Model:String,
  form_option:String,
  monitor1AccountPersonInPN:String,
  monitor1ActualUser:String
})

const { form, peripheral_form } = useForm()
const toast = useToast()
const isLoading = ref(false)
const item_id = route.params.id
const id = props.userID
const inventory_id = props.inventory_id
const control_id = props.gen_info_id
const brand_model = `${props.monitor1BrandModel} ${props.monitor1Model}`;
const option = props.form_option;
peripheral_form.monitor1AccountPersonInPN =props.monitor1AccountPersonInPN
peripheral_form.monitor1ActualUser = props.monitor1ActualUser
form.acct_person = props.acct_person
form.actual_user = props.actual_user

peripheral_form.monitor1QrCode = props.monitor1QrCode

const equipment_title = ref("")

const save_transfer = async (user_id, inventory_id, control_id) => {
//   if(option == 'gen_info'){
//     console.log(form.status)
//   // if (!form.source_div || !form.target_div || !form.acct_person || !form.status) {
//     toast.add({
//       severity: 'warn',
//       summary: 'Validation Error',
//       detail: 'All fields are required.',
//       life: 3000
//     })
//     return
//   // }
// }

  isLoading.value = true

  try {
    const acct_user = (option === 'gen_info') ? form.acct_person : peripheral_form.monitor1ActualUser;
    const item_id = (option === 'gen_info') ? inventory_id: 0;
    const response = await api.post('/transfer', {
      id: user_id,
      gen_info_id: control_id,
      item_id: item_id,
      source_div: form.source_div,
      target_div: form.target_div,
      acct_person: acct_user,
      actual_user: form.actual_user,
      status: form.status,
      remarks: form.remarks || '',
      option:option
    })

    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Transfer saved successfully!',
        life: 3000
      })
      emit('proceed') // Refresh parent component data
      emit('close') // Close modal
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'API Error',
      detail: 'Failed to save transfer. Try again.',
      life: 3000
    })
    console.log(error)
  } finally {
    // isLoading.value = false
  }
}

const get_equipment = async (inventory_id) => {
  try {
    const response = await api.get(`/get_equipment?item_id=${inventory_id}`)
    equipment_title.value = response.data[0].equipment_title
  } catch (error) {
    console.error('Error retrieving data:', error)
  }
}

const closeModal = () => {
  emit('close')
}

onMounted(() => {
  if(option === 'gen_info')
  {
    get_equipment(inventory_id)
  }
})
</script>

<template>
  <div v-if="openModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="dialog"
    tabindex="-1" aria-labelledby="progress-modal">
    <div
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-xl w-full max-w-md mx-4 p-6 transition-all duration-300 transform scale-95">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-4 border-b dark:border-neutral-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Trasferring of Item</h3>
        <button @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none">
          ✖
        </button>
      </div>

      <!-- Modal Body -->
      <div class="mt-6">
        <div class="relative z-0 w-full mb-5">
          <div v-if="form_option === 'gen_info'" class="relative z-0 w-full mb-5 group">
            <FloatLabel>
              <InputText id="username" v-model="equipment_title" class="w-full mb-3" disabled="" />
              <label for="username">Equipment Type</label>
            </FloatLabel>
          </div>
          <div v-if="form_option === 'peri_form'" class="relative z-0 w-full mb-5 group">
            <FloatLabel>
              <InputText id="username" v-model="peripheral_form.monitor1QrCode" class="w-full mb-3" disabled="" />
              <label for="username">Monitor 1 QR Code</label>
            </FloatLabel>
          </div>
          <div v-if="form_option === 'peri_form'" class="relative z-0 w-full mb-5 group">
            <div class="flex space-x-4">
              <FloatLabel>
                <InputText id="monitor1" v-model="peripheral_form.monitor1AccountPersonInPN" class="w-50 mb-3" disabled=""/>
                <label for="monitor1">Accountable Person as seen in PN</label>
              </FloatLabel>
              <FloatLabel>
                <InputText id="monitor2" v-model="brand_model" class="w-46 mb-3" disabled="" />
                <label for="monitor2">Brand & Model</label>
              </FloatLabel>
            </div>
            
          </div>
          <div v-if="form_option === 'peri_form'" class="relative z-0 w-full mb-5">
            <FloatLabel>
              <InputText id="processor" v-model="peripheral_form.monitor1ActualUser" class="w-full md:w-100 mb-3" />
              <label for="processor">Monitor Actual User</label>
            </FloatLabel>
          </div>

          

          <div v-if="form_option === 'gen_info'">
            <div class="relative z-0 w-full mb-5">
              <FloatLabel>
                <InputText id="processor" v-model="form.acct_person" class="w-full md:w-100 mb-3" />
                <label for="processor">Accountable Person</label>
              </FloatLabel>
            </div>
            <div class="relative z-0 w-full mb-5">
              <FloatLabel>
                <InputText id="processor" v-model="form.actual_user" class="w-full md:w-100" />
                <label for="processor">Accountable User</label>
              </FloatLabel>
            </div>
            
          </div>
        <div  class="relative z-0 w-full mb-5">
          <Select filter v-model="form.source_div" :options="props.division" optionValue="id" optionLabel="name"
              placeholder="Source Division" class="w-full block" />
            </div>
        </div>

        <div  class="relative z-0 w-full mb-5">
          <Select filter v-model="form.target_div" :options="props.division" optionValue="id" optionLabel="name"
            placeholder="Target Destination" class="w-full block" />
        </div>

        <div class="relative z-0 w-full mb-5 group">
          <Select filter v-model="form.status" :options="props.status" optionValue="id" optionLabel="name"
            placeholder="Current Status" class="w-full" />
        </div>
        <div class="relative z-0 w-full mb-5">
          <FloatLabel>
            <Textarea id="over_label" v-model="form.remarks" rows="5" cols="49" style="resize: none" />
            <label for="over_label">Remarks</label>
          </FloatLabel>
        </div>

        <Button icon="pi pi-save" label="Save"
          class="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-150"
          @click="save_transfer(id, inventory_id, control_id)" />
      </div>
    </div>
  </div>
</template>
