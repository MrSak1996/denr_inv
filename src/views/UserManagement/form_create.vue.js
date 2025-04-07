import { ref, onMounted, watch } from 'vue';
import { useForm } from '@/composables/useForm';
import { useApi } from '@/composables/useApi';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import Fieldset from 'primevue/fieldset';
import Select from 'primevue/select';
import api from '@/api/axiosInstance';
const { um_create_form } = useForm();
const authStore = useAuthStore();
const { province_opts, division_opts, employment_opts, getDivision, getEmploymentType, getUserRoles, roles_opts } = useApi();
let city_mun_opts = ref([]);
const errors = ref({});
const geo_code = ref('');
watch(() => um_create_form.city_mun, (newCityMun) => {
    const selectedMunicipality = city_mun_opts.value.find((item) => item.id === newCityMun);
    if (selectedMunicipality) {
        um_create_form.geo_code = selectedMunicipality.code;
    }
    else {
        um_create_form.geo_code = '';
    }
});
watch(() => um_create_form.province, async (newProvince) => {
    // Check if newProvince has a value
    if (newProvince) {
        try {
            // Fetch cities for the selected province
            const response = await api.get(`/provinces/${newProvince}/cities`);
            // Check if response data is valid and is an array
            if (response.data && Array.isArray(response.data)) {
                // Map the response data to the expected format
                city_mun_opts.value = response.data.map((item) => ({
                    id: item.mun_code,
                    name: item.mun_name,
                    code: item.geo_code
                }));
                // Update the form with the province and associated cities
                um_create_form.province = newProvince;
                um_create_form.city_mun = city_mun_opts.value.map((item) => item.id).join(', ');
            }
            else {
                // Handle unexpected response structure
                console.error('Unexpected response structure:', response);
                city_mun_opts.value = [];
            }
        }
        catch (error) {
            // Log the error if the API call fails
            console.error('Error fetching cities:', error);
            city_mun_opts.value = [];
        }
    }
    else {
        // If no province is selected, reset city options
        city_mun_opts.value = [];
    }
});
onMounted(() => {
    getDivision(), getEmploymentType(), authStore.role_id !== null && getUserRoles(authStore.role_id);
});
// Page title
const pageTitle = ref('Create User Account');
const selectedCategory = ref('Production');
const inventory_roles = ref([
    { name: 'Inventory Section - Viewing of ICT Equipment', key: 'A' },
    { name: 'Inventory Section - Creating of ICT Equipment', key: 'A' },
    { name: 'Inventory Section - Editing ICT Equipment Details', key: 'A' },
    { name: 'Inventory Section - Deleting ICT Equipment', key: 'A' },
    { name: 'Inventory Section - Generating Inventory Reports', key: 'A' },
    { name: 'Inventory Section - Approving Inventory Transactions', key: 'A' }
]);
const usermanagement_roles = ref([
    { name: 'User Management Section - Manage Accounts', key: 'A' },
    { name: 'User Management Section - Viewing User Activity Logs', key: 'A' },
    { name: 'User Management Section - Creating New Users', key: 'A' },
    { name: 'User Management Section - Editing User Profiles', key: 'A' },
    { name: 'User Management Section - Disabling/Enabling User Accounts', key: 'A' },
    { name: 'User Management Section - Assigning User Roles', key: 'A' },
    { name: 'User Management Section - Resetting User Passwords', key: 'A' }
]);
const sex_opts = ref([
    { name: 'Male', id: 1 },
    { name: 'Female', id: 2 },
    { name: 'Others', id: 3 }
]);
const toast = useToast();
const post_save_userCred = async () => {
    try {
        errors.value = {};
        const requestData = { ...um_create_form };
        const response = await api.post('/post_save_userCred', requestData);
        if (!response) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No response from server!',
                life: 3000
            });
        }
        else {
            setTimeout(() => {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Data saved successfully!',
                    life: 3000
                });
                const id = response.data.id;
                router.push({
                    name: 'Account List',
                    params: { id },
                    query: { api_token: localStorage.getItem('api_token') }
                });
            }, 2000);
        }
    }
    catch (error) {
        console.error('Error saving form:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save data. Please try again later.',
            life: 5000
        });
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.Toast;
/** @type {[typeof __VLS_components.Toast, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {[typeof DefaultLayout, typeof DefaultLayout, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(DefaultLayout, new DefaultLayout({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
/** @type {[typeof BreadcrumbDefault, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(BreadcrumbDefault, new BreadcrumbDefault({
    pageTitle: (__VLS_ctx.pageTitle),
}));
const __VLS_8 = __VLS_7({
    pageTitle: (__VLS_ctx.pageTitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-12 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.post_save_userCred) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-white p-4 rounded-lg shadow-md" },
});
const __VLS_10 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    legend: "User Details",
}));
const __VLS_12 = __VLS_11({
    legend: "User Details",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
__VLS_13.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_14 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({}));
const __VLS_16 = __VLS_15({}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
const __VLS_18 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({
    modelValue: (__VLS_ctx.um_create_form.region),
    value: (__VLS_ctx.um_create_form.region),
    ...{ class: "w-full" },
}));
const __VLS_20 = __VLS_19({
    modelValue: (__VLS_ctx.um_create_form.region),
    value: (__VLS_ctx.um_create_form.region),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_17;
const __VLS_22 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({}));
const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
const __VLS_26 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    hidden: true,
    modelValue: (__VLS_ctx.um_create_form.geo_code),
    value: (__VLS_ctx.um_create_form.geo_code),
    ...{ class: "w-full" },
}));
const __VLS_28 = __VLS_27({
    hidden: true,
    modelValue: (__VLS_ctx.um_create_form.geo_code),
    value: (__VLS_ctx.um_create_form.geo_code),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
var __VLS_25;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_30 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({}));
const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
const __VLS_34 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.um_create_form.first_name),
    value: (__VLS_ctx.um_create_form.first_name),
    ...{ class: "w-full" },
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.um_create_form.first_name),
    value: (__VLS_ctx.um_create_form.first_name),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_33;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_38 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.province),
    options: (__VLS_ctx.province_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Province",
    ...{ class: "w-full" },
}));
const __VLS_40 = __VLS_39({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.province),
    options: (__VLS_ctx.province_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Province",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_42 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({}));
const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
__VLS_45.slots.default;
const __VLS_46 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    modelValue: (__VLS_ctx.um_create_form.middle_name),
    value: (__VLS_ctx.um_create_form.middle_name),
    ...{ class: "w-full" },
}));
const __VLS_48 = __VLS_47({
    modelValue: (__VLS_ctx.um_create_form.middle_name),
    value: (__VLS_ctx.um_create_form.middle_name),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_45;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_50 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.city_mun),
    options: (__VLS_ctx.city_mun_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "City/Municipalities",
    ...{ class: "w-full" },
}));
const __VLS_52 = __VLS_51({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.city_mun),
    options: (__VLS_ctx.city_mun_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "City/Municipalities",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_54 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
__VLS_57.slots.default;
const __VLS_58 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.um_create_form.last_name),
    value: (__VLS_ctx.um_create_form.last_name),
    ...{ class: "w-full" },
}));
const __VLS_60 = __VLS_59({
    modelValue: (__VLS_ctx.um_create_form.last_name),
    value: (__VLS_ctx.um_create_form.last_name),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_57;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_62 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.division),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}));
const __VLS_64 = __VLS_63({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.division),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_66 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.employment_status),
    options: (__VLS_ctx.employment_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Employment Type",
    ...{ class: "w-full" },
}));
const __VLS_68 = __VLS_67({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.employment_status),
    options: (__VLS_ctx.employment_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Employment Type",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-4 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_70 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({}));
const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
const __VLS_74 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    modelValue: (__VLS_ctx.um_create_form.position),
    value: (__VLS_ctx.um_create_form.position),
    ...{ class: "w-full" },
}));
const __VLS_76 = __VLS_75({
    modelValue: (__VLS_ctx.um_create_form.position),
    value: (__VLS_ctx.um_create_form.position),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_73;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_78 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({}));
const __VLS_80 = __VLS_79({}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
const __VLS_82 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    modelValue: (__VLS_ctx.um_create_form.email),
    value: (__VLS_ctx.um_create_form.email),
    ...{ class: "w-full" },
}));
const __VLS_84 = __VLS_83({
    modelValue: (__VLS_ctx.um_create_form.email),
    value: (__VLS_ctx.um_create_form.email),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_81;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_86 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({}));
const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
const __VLS_90 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    modelValue: (__VLS_ctx.um_create_form.contact_details),
    value: (__VLS_ctx.um_create_form.contact_details),
    ...{ class: "w-full" },
}));
const __VLS_92 = __VLS_91({
    modelValue: (__VLS_ctx.um_create_form.contact_details),
    value: (__VLS_ctx.um_create_form.contact_details),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_89;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_94 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.sex),
    options: (__VLS_ctx.sex_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Gender",
    ...{ class: "w-full" },
}));
const __VLS_96 = __VLS_95({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.sex),
    options: (__VLS_ctx.sex_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Gender",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-1 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_98 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({}));
const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
__VLS_101.slots.default;
const __VLS_102 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    modelValue: (__VLS_ctx.um_create_form.complete_address),
    value: (__VLS_ctx.um_create_form.complete_address),
    ...{ class: "w-full" },
}));
const __VLS_104 = __VLS_103({
    modelValue: (__VLS_ctx.um_create_form.complete_address),
    value: (__VLS_ctx.um_create_form.complete_address),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_101;
var __VLS_13;
const __VLS_106 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    legend: "User Credentials",
}));
const __VLS_108 = __VLS_107({
    legend: "User Credentials",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
__VLS_109.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-3 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_110 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({}));
const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
__VLS_113.slots.default;
const __VLS_114 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    modelValue: (__VLS_ctx.um_create_form.username),
    value: (__VLS_ctx.um_create_form.username),
    ...{ class: "w-full" },
}));
const __VLS_116 = __VLS_115({
    modelValue: (__VLS_ctx.um_create_form.username),
    value: (__VLS_ctx.um_create_form.username),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_113;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_118 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({}));
const __VLS_120 = __VLS_119({}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
const __VLS_122 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    modelValue: (__VLS_ctx.um_create_form.password),
    value: (__VLS_ctx.um_create_form.password),
    ...{ class: "w-full" },
}));
const __VLS_124 = __VLS_123({
    modelValue: (__VLS_ctx.um_create_form.password),
    value: (__VLS_ctx.um_create_form.password),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_121;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_126 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.roles),
    options: (__VLS_ctx.roles_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "User Role",
    ...{ class: "w-full" },
}));
const __VLS_128 = __VLS_127({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.roles),
    options: (__VLS_ctx.roles_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "User Role",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
var __VLS_109;
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "submit",
    ...{ class: "block mt-4 w-full cursor-pointer rounded-lg border border-teal bg-teal p-4 font-medium text-white text-center transition hover:bg-opacity-90" },
    value: "Save",
});
var __VLS_6;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-12']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-1']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-teal']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-opacity-90']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BreadcrumbDefault: BreadcrumbDefault,
            DefaultLayout: DefaultLayout,
            FloatLabel: FloatLabel,
            InputText: InputText,
            Toast: Toast,
            Fieldset: Fieldset,
            Select: Select,
            um_create_form: um_create_form,
            province_opts: province_opts,
            division_opts: division_opts,
            employment_opts: employment_opts,
            roles_opts: roles_opts,
            city_mun_opts: city_mun_opts,
            pageTitle: pageTitle,
            sex_opts: sex_opts,
            post_save_userCred: post_save_userCred,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
