import { ref } from 'vue'
import api from '@/api/axiosInstance';

export const image = ref(null)
export const uploadSuccess = ref(false)
export const uploadError = ref('')

export const onFileChange = (event) => {
  image.value = event.target.files[0]
}

export const uploadImage = async () => {
  if (!image.value) return

  const formData = new FormData()
  formData.append('image', image.value)

  try {
    const response = await api.post('/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    uploadSuccess.value = response.data.status
    uploadError.value = null
  } catch (error) {
    uploadSuccess.value = false
    uploadError.value = error.response?.data?.message || 'An error occurred.'
  }
}

export const resetForm = () => {
  image.value = null
  uploadSuccess.value = false
  uploadError.value = ''
}
