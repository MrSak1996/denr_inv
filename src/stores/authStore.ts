import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userId = ref(null)
  const api_token = ref(null)
  const role_id = ref(null)

  const setUser = (id, token,roles) => {
    userId.value = id
    role_id.value = roles
    api_token.value = token
  }

  const logout = () => {
    userId.value = null
    api_token.value = null
  }

  return { userId, api_token,role_id, setUser, logout }
}, {
  persist: true 
})
