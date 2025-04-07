import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userId = ref<number | null>(null)
  const api_token = ref<string | null>(null)
  const role_id = ref<number>(0)
  const division_id = ref<number | null>(null)
  const client = ref<string | null>(null)

  const setUser = (id: number, token: string, roles: number, division: number, name: string) => {
    userId.value = id
    role_id.value = roles
    api_token.value = token
    division_id.value = division
    client.value = name
  }

  const logout = () => {
    userId.value = null
    api_token.value = null
    role_id.value = 0
    division_id.value = null
    client.value = null
  }

  return { userId, api_token, role_id, division_id, client, setUser, logout }
}, {
  persist: true
})
