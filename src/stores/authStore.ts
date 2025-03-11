import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userId = ref(null)
  const api_token = ref(null)
  const role_id = ref(null)
  const division_id = ref(null)
  const client = ref(null)

  const setUser = (id, token,roles,division,name) => {
    userId.value = id
    role_id.value = roles
    api_token.value = token
    division_id.value = division
    client.value = name
  }

  const logout = () => {
    userId.value = null
    api_token.value = null
  }

  return { userId, api_token,role_id,division_id,client, setUser, logout }
}, {
  persist: true 
})
