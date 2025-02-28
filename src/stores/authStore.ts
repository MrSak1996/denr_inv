import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userId = ref(null)
  const api_token = ref(null)

  const setUser = (id, token) => {
    userId.value = id
    api_token.value = token
  }

  const logout = () => {
    userId.value = null
    api_token.value = null
  }

  return { userId, api_token, setUser, logout }
}, {
  persist: true 
})
