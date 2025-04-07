import { ref, defineEmits, defineProps, onMounted } from 'vue';
import api from '@/api/axiosInstance';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from '@/composables/useForm';
import { useToast } from 'primevue/usetoast';
const route = useRoute();
const emit = defineEmits(['close', 'proceed']);
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
    monitor1BrandModel: String,
    monitor1Model: String,
    form_option: String,
    monitor1AccountPersonInPN: String,
    monitor1ActualUser: String
});
const { form, peripheral_form } = useForm();
const toast = useToast();
const isLoading = ref(false);
const item_id = route.params.id;
const id = props.userID;
const inventory_id = props.inventory_id;
const control_id = props.gen_info_id;
const brand_model = `${props.monitor1BrandModel} ${props.monitor1Model}`;
const option = props.form_option;
peripheral_form.monitor1AccountPersonInPN = props.monitor1AccountPersonInPN;
peripheral_form.monitor1ActualUser = props.monitor1ActualUser;
form.acct_person = props.acct_person;
form.actual_user = props.actual_user;
peripheral_form.monitor1QrCode = props.monitor1QrCode;
const equipment_title = ref("");
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
    isLoading.value = true;
    try {
        const acct_user = (option === 'gen_info') ? form.acct_person : peripheral_form.monitor1ActualUser;
        const item_id = (option === 'gen_info') ? inventory_id : 0;
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
            option: option
        });
        if (response.data.success) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Transfer saved successfully!',
                life: 3000
            });
            emit('proceed'); // Refresh parent component data
            emit('close'); // Close modal
        }
        else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
        }
    }
    catch (error) {
        toast.add({
            severity: 'error',
            summary: 'API Error',
            detail: 'Failed to save transfer. Try again.',
            life: 3000
        });
        console.log(error);
    }
    finally {
        // isLoading.value = false
    }
};
const get_equipment = async (inventory_id) => {
    try {
        const response = await api.get(`/get_equipment?item_id=${inventory_id}`);
        equipment_title.value = response.data[0].equipment_title;
    }
    catch (error) {
        console.error('Error retrieving data:', error);
    }
};
const closeModal = () => {
    emit('close');
};
onMounted(() => {
    if (option === 'gen_info') {
        get_equipment(inventory_id);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.openModal) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" },
        role: "dialog",
        tabindex: "-1",
        'aria-labelledby': "progress-modal",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-xl w-full max-w-md mx-4 p-6 transition-all duration-300 transform scale-95" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex justify-between items-center pb-4 border-b dark:border-neutral-700" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "text-lg font-semibold text-gray-900 dark:text-white" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closeModal) },
        ...{ class: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative z-0 w-full mb-5" },
    });
    if (__VLS_ctx.form_option === 'gen_info') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "relative z-0 w-full mb-5 group" },
        });
        const __VLS_0 = {}.FloatLabel;
        /** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
        const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
        __VLS_3.slots.default;
        const __VLS_4 = {}.InputText;
        /** @type {[typeof __VLS_components.InputText, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            id: "username",
            modelValue: (__VLS_ctx.equipment_title),
            ...{ class: "w-full mb-3" },
            disabled: "",
        }));
        const __VLS_6 = __VLS_5({
            id: "username",
            modelValue: (__VLS_ctx.equipment_title),
            ...{ class: "w-full mb-3" },
            disabled: "",
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "username",
        });
        var __VLS_3;
    }
    if (__VLS_ctx.form_option === 'peri_form') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "relative z-0 w-full mb-5 group" },
        });
        const __VLS_8 = {}.FloatLabel;
        /** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
        const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        const __VLS_12 = {}.InputText;
        /** @type {[typeof __VLS_components.InputText, ]} */ ;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
            id: "username",
            modelValue: (__VLS_ctx.peripheral_form.monitor1QrCode),
            ...{ class: "w-full mb-3" },
            disabled: "",
        }));
        const __VLS_14 = __VLS_13({
            id: "username",
            modelValue: (__VLS_ctx.peripheral_form.monitor1QrCode),
            ...{ class: "w-full mb-3" },
            disabled: "",
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "username",
        });
        var __VLS_11;
    }
    if (__VLS_ctx.form_option === 'peri_form') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "relative z-0 w-full mb-5 group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex space-x-4" },
        });
        const __VLS_16 = {}.FloatLabel;
        /** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
        const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_19.slots.default;
        const __VLS_20 = {}.InputText;
        /** @type {[typeof __VLS_components.InputText, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            id: "monitor1",
            modelValue: (__VLS_ctx.peripheral_form.monitor1AccountPersonInPN),
            ...{ class: "w-50 mb-3" },
            disabled: "",
        }));
        const __VLS_22 = __VLS_21({
            id: "monitor1",
            modelValue: (__VLS_ctx.peripheral_form.monitor1AccountPersonInPN),
            ...{ class: "w-50 mb-3" },
            disabled: "",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "monitor1",
        });
        var __VLS_19;
        const __VLS_24 = {}.FloatLabel;
        /** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
        const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
        __VLS_27.slots.default;
        const __VLS_28 = {}.InputText;
        /** @type {[typeof __VLS_components.InputText, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            id: "monitor2",
            modelValue: (__VLS_ctx.brand_model),
            ...{ class: "w-46 mb-3" },
            disabled: "",
        }));
        const __VLS_30 = __VLS_29({
            id: "monitor2",
            modelValue: (__VLS_ctx.brand_model),
            ...{ class: "w-46 mb-3" },
            disabled: "",
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "monitor2",
        });
        var __VLS_27;
    }
    if (__VLS_ctx.form_option === 'peri_form') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "relative z-0 w-full mb-5" },
        });
        const __VLS_32 = {}.FloatLabel;
        /** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
        const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
        __VLS_35.slots.default;
        const __VLS_36 = {}.InputText;
        /** @type {[typeof __VLS_components.InputText, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            id: "processor",
            modelValue: (__VLS_ctx.peripheral_form.monitor1ActualUser),
            ...{ class: "w-full md:w-100 mb-3" },
        }));
        const __VLS_38 = __VLS_37({
            id: "processor",
            modelValue: (__VLS_ctx.peripheral_form.monitor1ActualUser),
            ...{ class: "w-full md:w-100 mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "processor",
        });
        var __VLS_35;
    }
    if (__VLS_ctx.form_option === 'gen_info') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "relative z-0 w-full mb-5" },
        });
        const __VLS_40 = {}.FloatLabel;
        /** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
        const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
        __VLS_43.slots.default;
        const __VLS_44 = {}.InputText;
        /** @type {[typeof __VLS_components.InputText, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            id: "processor",
            modelValue: (__VLS_ctx.form.acct_person),
            ...{ class: "w-full md:w-100 mb-3" },
        }));
        const __VLS_46 = __VLS_45({
            id: "processor",
            modelValue: (__VLS_ctx.form.acct_person),
            ...{ class: "w-full md:w-100 mb-3" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "processor",
        });
        var __VLS_43;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "relative z-0 w-full mb-5" },
        });
        const __VLS_48 = {}.FloatLabel;
        /** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
        const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
        __VLS_51.slots.default;
        const __VLS_52 = {}.InputText;
        /** @type {[typeof __VLS_components.InputText, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            id: "processor",
            modelValue: (__VLS_ctx.form.actual_user),
            ...{ class: "w-full md:w-100" },
        }));
        const __VLS_54 = __VLS_53({
            id: "processor",
            modelValue: (__VLS_ctx.form.actual_user),
            ...{ class: "w-full md:w-100" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            for: "processor",
        });
        var __VLS_51;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative z-0 w-full mb-5" },
    });
    const __VLS_56 = {}.Select;
    /** @type {[typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        filter: true,
        modelValue: (__VLS_ctx.form.source_div),
        options: (props.division),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Source Division",
        ...{ class: "w-full block" },
    }));
    const __VLS_58 = __VLS_57({
        filter: true,
        modelValue: (__VLS_ctx.form.source_div),
        options: (props.division),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Source Division",
        ...{ class: "w-full block" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative z-0 w-full mb-5" },
    });
    const __VLS_60 = {}.Select;
    /** @type {[typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        filter: true,
        modelValue: (__VLS_ctx.form.target_div),
        options: (props.division),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Target Destination",
        ...{ class: "w-full block" },
    }));
    const __VLS_62 = __VLS_61({
        filter: true,
        modelValue: (__VLS_ctx.form.target_div),
        options: (props.division),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Target Destination",
        ...{ class: "w-full block" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative z-0 w-full mb-5 group" },
    });
    const __VLS_64 = {}.Select;
    /** @type {[typeof __VLS_components.Select, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        filter: true,
        modelValue: (__VLS_ctx.form.status),
        options: (props.status),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Current Status",
        ...{ class: "w-full" },
    }));
    const __VLS_66 = __VLS_65({
        filter: true,
        modelValue: (__VLS_ctx.form.status),
        options: (props.status),
        optionValue: "id",
        optionLabel: "name",
        placeholder: "Current Status",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "relative z-0 w-full mb-5" },
    });
    const __VLS_68 = {}.FloatLabel;
    /** @type {[typeof __VLS_components.FloatLabel, typeof __VLS_components.FloatLabel, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
    const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.Textarea;
    /** @type {[typeof __VLS_components.Textarea, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        id: "over_label",
        modelValue: (__VLS_ctx.form.remarks),
        rows: "5",
        cols: "49",
        ...{ style: {} },
    }));
    const __VLS_74 = __VLS_73({
        id: "over_label",
        modelValue: (__VLS_ctx.form.remarks),
        rows: "5",
        cols: "49",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: "over_label",
    });
    var __VLS_71;
    const __VLS_76 = {}.Button;
    /** @type {[typeof __VLS_components.Button, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        icon: "pi pi-save",
        label: "Save",
        ...{ class: "w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-150" },
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        icon: "pi pi-save",
        label: "Save",
        ...{ class: "w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-150" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_80;
    let __VLS_81;
    let __VLS_82;
    const __VLS_83 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.openModal))
                return;
            __VLS_ctx.save_transfer(__VLS_ctx.id, __VLS_ctx.inventory_id, __VLS_ctx.control_id);
        }
    };
    var __VLS_79;
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-neutral-800']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-neutral-700']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['transform']} */ ;
/** @type {__VLS_StyleScopedClasses['scale-95']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-neutral-700']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-50']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['w-46']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-100']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-0']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
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
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-teal-700']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-teal-800']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-150']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            $emit: emit,
            form: form,
            peripheral_form: peripheral_form,
            id: id,
            inventory_id: inventory_id,
            control_id: control_id,
            brand_model: brand_model,
            equipment_title: equipment_title,
            save_transfer: save_transfer,
            closeModal: closeModal,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            $props: __VLS_makeOptional(props),
            ...props,
            $emit: emit,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
