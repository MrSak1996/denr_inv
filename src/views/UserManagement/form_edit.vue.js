import { ref, onMounted, watch } from 'vue';
import { useForm } from '@/composables/useForm';
import { useApi } from '@/composables/useApi';
import { useToast } from 'primevue/usetoast';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Fieldset from 'primevue/fieldset';
import Select from 'primevue/select';
import api from '@/api/axiosInstance';
const { um_create_form } = useForm();
const { province_opts, division_opts, employment_opts, getDivision, getEmploymentType, getUserRoles, roles_opts } = useApi();
const authStore = useAuthStore();
let city_mun_opts = ref([]);
const errors = ref({});
const route = useRoute();
onMounted(() => {
    getDivision(),
        getEmploymentType(),
        getUserRoles(authStore.role_id),
        fetchUserData();
});
// Page title
const pageTitle = ref('Create User Account');
const sex_opts = ref([
    { name: 'Male', id: 1 },
    { name: 'Female', id: 2 },
    { name: 'Others', id: 3 }
]);
const toast = useToast();
const post_update_user = async () => {
    try {
        errors.value = {};
        const requestData = {
            ...um_create_form
        };
        const response = await api.post('/post_update_user', requestData);
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
            location.reload();
        }, 2000);
    }
    catch (error) {
        console.log(error);
    }
};
const fetchUserData = async () => {
    const id = route.params.id;
    if (id) {
        try {
            const response = await api.get(`/getUsers?id=${id}`);
            Object.assign(um_create_form, response.data.data[0]);
        }
        catch (error) {
            console.error('Error retrieving data:', error);
        }
    }
};
watch(() => um_create_form.city_mun_c, (newCityMun) => {
    const selectedMunicipality = city_mun_opts.value.find((item) => item.id === newCityMun);
    if (selectedMunicipality) {
        um_create_form.geo_code = selectedMunicipality.code;
    }
    else {
        um_create_form.geo_code = '';
    }
});
watch(() => um_create_form.province_c, async (newProvince) => {
    if (newProvince) {
        try {
            // Fetch cities/municipalities based on the selected province
            const response = await api.get(`/provinces/${newProvince}/cities`);
            if (response.data && Array.isArray(response.data)) {
                // Update the city/municipality options
                city_mun_opts.value = response.data.map((item) => ({
                    id: item.mun_code,
                    name: item.mun_name,
                    code: item.geo_code
                }));
                // Automatically select the first city/municipality if none is selected
                if (!city_mun_opts.value.some(city => city.id === um_create_form.city_mun_c)) {
                    um_create_form.city_mun_c = city_mun_opts.value[0]?.id || null; // Set to the first item or null
                }
            }
            else {
                console.error('Unexpected response structure:', response);
                city_mun_opts.value = [];
                um_create_form.city_mun_c = null; // Clear municipality if no cities are found
            }
        }
        catch (error) {
            console.error('Error fetching cities:', error);
            city_mun_opts.value = [];
            um_create_form.city_mun_c = null; // Clear municipality on error
        }
    }
    else {
        city_mun_opts.value = [];
        um_create_form.city_mun_c = null; // Clear municipality when no province is selected
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof DefaultLayout, typeof DefaultLayout, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DefaultLayout, new DefaultLayout({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
__VLS_2.slots.default;
/** @type {[typeof BreadcrumbDefault, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(BreadcrumbDefault, new BreadcrumbDefault({
    pageTitle: (__VLS_ctx.pageTitle),
}));
const __VLS_5 = __VLS_4({
    pageTitle: (__VLS_ctx.pageTitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid grid-cols-12 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "col-span-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bg-white p-4 rounded-lg shadow-md" },
});
const __VLS_7 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    legend: "User Details",
}));
const __VLS_9 = __VLS_8({
    legend: "User Details",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
__VLS_10.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_11 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({}));
const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_14.slots.default;
const __VLS_15 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    modelValue: (__VLS_ctx.um_create_form.region),
    value: (__VLS_ctx.um_create_form.region),
    ...{ class: "w-full" },
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.um_create_form.region),
    value: (__VLS_ctx.um_create_form.region),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_14;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_19 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
const __VLS_23 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.um_create_form.first_name),
    value: (__VLS_ctx.um_create_form.first_name),
    ...{ class: "w-full" },
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.um_create_form.first_name),
    value: (__VLS_ctx.um_create_form.first_name),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_22;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_27 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.province_c),
    options: (__VLS_ctx.province_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Province",
    ...{ class: "w-full" },
}));
const __VLS_29 = __VLS_28({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.province_c),
    options: (__VLS_ctx.province_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Province",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_31 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
const __VLS_35 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    modelValue: (__VLS_ctx.um_create_form.middle_name),
    value: (__VLS_ctx.um_create_form.middle_name),
    ...{ class: "w-full" },
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.um_create_form.middle_name),
    value: (__VLS_ctx.um_create_form.middle_name),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_34;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_39 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.city_mun_c),
    options: (__VLS_ctx.city_mun_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "City/Municipalities",
    ...{ class: "w-full" },
}));
const __VLS_41 = __VLS_40({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.city_mun_c),
    options: (__VLS_ctx.city_mun_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "City/Municipalities",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_43 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({}));
const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
const __VLS_47 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    modelValue: (__VLS_ctx.um_create_form.last_name),
    value: (__VLS_ctx.um_create_form.last_name),
    ...{ class: "w-full" },
}));
const __VLS_49 = __VLS_48({
    modelValue: (__VLS_ctx.um_create_form.last_name),
    value: (__VLS_ctx.um_create_form.last_name),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_46;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-2 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_51 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.division_id),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}));
const __VLS_53 = __VLS_52({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.division_id),
    options: (__VLS_ctx.division_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Division",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_55 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.employment_status),
    options: (__VLS_ctx.employment_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Employment Type",
    ...{ class: "w-full" },
}));
const __VLS_57 = __VLS_56({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.employment_status),
    options: (__VLS_ctx.employment_opts),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Employment Type",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-4 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_59 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({}));
const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
const __VLS_63 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    modelValue: (__VLS_ctx.um_create_form.position),
    value: (__VLS_ctx.um_create_form.position),
    ...{ class: "w-full" },
}));
const __VLS_65 = __VLS_64({
    modelValue: (__VLS_ctx.um_create_form.position),
    value: (__VLS_ctx.um_create_form.position),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_62;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_67 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({}));
const __VLS_69 = __VLS_68({}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
const __VLS_71 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    modelValue: (__VLS_ctx.um_create_form.email),
    value: (__VLS_ctx.um_create_form.email),
    ...{ class: "w-full" },
}));
const __VLS_73 = __VLS_72({
    modelValue: (__VLS_ctx.um_create_form.email),
    value: (__VLS_ctx.um_create_form.email),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_70;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_75 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({}));
const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
const __VLS_79 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    modelValue: (__VLS_ctx.um_create_form.mobile_no),
    value: (__VLS_ctx.um_create_form.mobile_no),
    ...{ class: "w-full" },
}));
const __VLS_81 = __VLS_80({
    modelValue: (__VLS_ctx.um_create_form.mobile_no),
    value: (__VLS_ctx.um_create_form.mobile_no),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_78;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_83 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.sex),
    options: (__VLS_ctx.sex_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Gender",
    ...{ class: "w-full" },
}));
const __VLS_85 = __VLS_84({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.sex),
    options: (__VLS_ctx.sex_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "Gender",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-1 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_87 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({}));
const __VLS_89 = __VLS_88({}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
const __VLS_91 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    modelValue: (__VLS_ctx.um_create_form.complete_address),
    value: (__VLS_ctx.um_create_form.complete_address),
    ...{ class: "w-full" },
}));
const __VLS_93 = __VLS_92({
    modelValue: (__VLS_ctx.um_create_form.complete_address),
    value: (__VLS_ctx.um_create_form.complete_address),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_90;
var __VLS_10;
const __VLS_95 = {}.Fieldset;
/** @type {[typeof __VLS_components.Fieldset, typeof __VLS_components.Fieldset, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    legend: "User Credentials",
}));
const __VLS_97 = __VLS_96({
    legend: "User Credentials",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
__VLS_98.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid md:grid-cols-3 md:gap-6 mb-4 mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_99 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({}));
const __VLS_101 = __VLS_100({}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
const __VLS_103 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    modelValue: (__VLS_ctx.um_create_form.username),
    value: (__VLS_ctx.um_create_form.username),
    ...{ class: "w-full" },
}));
const __VLS_105 = __VLS_104({
    modelValue: (__VLS_ctx.um_create_form.username),
    value: (__VLS_ctx.um_create_form.username),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_102;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_107 = {}.FloatLabel;
/** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({}));
const __VLS_109 = __VLS_108({}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_110.slots.default;
const __VLS_111 = {}.InputText;
/** @type {[typeof __VLS_components.InputText, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    modelValue: (__VLS_ctx.um_create_form.password),
    value: (__VLS_ctx.um_create_form.password),
    ...{ class: "w-full" },
}));
const __VLS_113 = __VLS_112({
    modelValue: (__VLS_ctx.um_create_form.password),
    value: (__VLS_ctx.um_create_form.password),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
var __VLS_110;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative z-0 w-full mb-5 group" },
});
const __VLS_115 = {}.Select;
/** @type {[typeof __VLS_components.Select, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.role_id),
    options: (__VLS_ctx.roles_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "User Role",
    ...{ class: "w-full" },
}));
const __VLS_117 = __VLS_116({
    filter: true,
    modelValue: (__VLS_ctx.um_create_form.role_id),
    options: (__VLS_ctx.roles_opts),
    optionValue: "id",
    optionLabel: "name",
    placeholder: "User Role",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
var __VLS_98;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.post_update_user();
        } },
    type: "button",
    ...{ class: "block mt-4 w-full  cursor-pointer rounded-lg border border-teal bg-teal p-4 font-medium text-white text-center transition hover:bg-opacity-90" },
});
var __VLS_2;
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
            post_update_user: post_update_user,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
