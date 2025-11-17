import { ref } from 'vue';
import axios from 'axios';
import api from '@/api/axiosInstance';
const handleFileChange = (e) => {
    selectedFile.value = e.target.files[0];
};
const handleDrop = (e) => {
    selectedFile.value = e.dataTransfer.files[0];
};
const uploadFile = async () => {
    if (!selectedFile.value)
        return;
    const formData = new FormData();
    formData.append('excel_file', selectedFile.value);
    formData.append('filename', selectedFile.value.name);
    isUploading.value = true;
    progress.value = 0;
    message.value = '';
    try {
        const { data } = await api.post('/upload-excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (e) => {
                if (e.lengthComputable) {
                    progress.value = Math.round((e.loaded * 100) / e.total);
                }
            },
        });
        message.value = data.message || 'File uploaded successfully!';
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File uploaded successfully!',
            life: 3000
        });
        emit('uploaded');
        emit('close');
    }
    catch (error) {
        console.error(error);
        message.value = error.response?.data?.message || 'Upload failed. Please try again.';
    }
    finally {
        isUploading.value = false;
        selectedFile.value = null;
        progress.value = 100;
        if (fileInput.value)
            fileInput.value.value = '';
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
