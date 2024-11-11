import { createStore } from 'vuex'

const store = createStore({
  state: {
    formData: {
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
      selectedDivision: '',
      selectedAcctDivision: '',
      selectedActualDivision: '',
      selectedWorkNature: '',
      selectedSection: '',
      selectedRangeCategory: '',
      selectedEquipmentType: '',
      actual_user: ''
    }
  },
  mutations: {
    setFormData(state, formData) {
      state.formData = formData
    }
  },
  actions: {
    saveFormData({ commit }, formData) {
      commit('setFormData', formData)
    }
  }
})

export default store
