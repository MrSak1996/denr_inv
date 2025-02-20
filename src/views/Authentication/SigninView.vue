<script setup lang="ts">
import DefaultAuthCard from '@/components/Auths/DefaultAuthCard.vue'
import InputGroup from '@/components/Auths/InputGroup.vue'
import InputOtp from 'primevue/inputotp'
import Toast from 'primevue/toast'

import { useToast } from 'primevue/usetoast'
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInventory } from '@/composables/useInventory.ts'
const { OTPsettings } = useInventory()

import api from '../../../laravel-backend/resources/js/axiosInstance.ts'
import modal_verify from './modal/modal_verify.vue'
import Qrcode from 'qrcode.vue'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/bundle'

const pageTitle = ref('Welcome to ICT Inventory System')
const toast = useToast()
const router = useRouter()

const form = ref({
  username: '',
  password: ''
})
const errors = ref(null)
let email = ref('')
const otp = ref('')
const message = ref('')

const isModalOpen = ref(false)
const openLoginForm = ref(false)
const otp_checker = ref(false)

const onSwiper = (swiper) => {
  console.log(swiper)
}
const onSlideChange = () => {
  console.log('slide change')
}

const modules = ref([Navigation, Pagination, Scrollbar, A11y])

const loginUser = async () => {
  try {
    const response = await api.post('/login', form.value)
    if (response.data.status) {
      // If login is successful, send the OTP
      localStorage.setItem('userId', response.data.userId)
      localStorage.setItem('api_token', response.data.api_token)

      const res = await OTPsettings()
      otp_checker.value = res

      if (otp_checker.value === true) {
        isModalOpen.value = true
        email.value = response.data.email
        const userEmail = response.data.email

        if (!userEmail) {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Email not found for the provided username',
            life: 3000
          })
          return
        }

        await api.post('/send-otp', { email: userEmail })
        // Show success message and open OTP modal
        toast.add({
          severity: 'success',
          summary: 'OTP Sent',
          detail: 'Check your email for the OTP',
          life: 3000
        })
      } else {
        isModalOpen.value = false
        toDashboard()
      }
    } else {
      // Invalid login credentials
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid username or password',
        life: 3000
      })
    }
  } catch (error) {
    isModalOpen.value = false // Ensure the modal stays closed on error

    if (error.response && error.response.data) {
      // Server returned an error response
      errors.value = error.response.data.errors
    } else {
      console.log(error)
    }
  }
}

const verifyOtp = async () => {
  try {
    const response = await api.post('/verify-otp', {
      user_email: email.value,
      otp: otp.value
    })
    message.value = response.data.message
    if (response.data.status) {
      toDashboard()
    }
  } catch (error) {
    message.value = error.response?.data?.message || 'Error verifying OTP'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: message.value,
      life: 3000
    })
  }
}

const toDashboard = async () => {
  const userId = localStorage.getItem('userId')
  const api_token = localStorage.getItem('api_token')

  if (!userId || !api_token) {
    // Handle missing userId or api_token
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Unable to redirect: missing user information',
      life: 3000
    })
    return
  }

  // Display success toast and redirect after a delay
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Login successful',
    life: 3000
  })

  setTimeout(() => {
    window.location.href = '/inventory?id=' + userId + '&api_token=' + api_token
    // router.push({
    //   name: 'Inventory',
    //   query: { id: userId, api_token: api_token }
    // })
  }, 1000)
}

const openLogin = async () => {
  openLoginForm.value = true
}

const closeLogin = () => {
  openLoginForm.value = false
}

onMounted(() => {})
</script>

<template>
  <Toast />

  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog"
    aria-labelledby="reserve-control-no"
    aria-modal="true"
  >
    <div
      class="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-lg w-full max-w-2xl mx-4 lg:mx-auto transition-transform duration-300 transform scale-100"
    >
      <!-- Modal Header -->
      <div class="flex justify-between items-center py-4 px-6 border-b dark:border-neutral-700">
        <h3 id="reserve-control-no" class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Verify OTP
        </h3>
      </div>

      <!-- Modal Body -->
      <div class="flex flex-col justify-center items-center py-8 px-6">
        <p>
          To complete the verification process, please enter the 6-digit OTP we’ve sent to your
          email.
        </p>

        <InputOtp v-model="otp" integerOnly class="mb-4" :length="6" style="gap: 0">
          <template #default="{ attrs, events, index }">
            <input type="text" v-bind="attrs" v-on="events" class="custom-otp-input" />
            <div v-if="index === 3" class="px-4">
              <i class="pi pi-minus" />
            </div>
          </template>
        </InputOtp>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-150"
          @click="verifyOtp"
        >
          <span>Submit</span>
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="openLoginForm"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    role="dialog"
    aria-labelledby="reserve-control-no"
    aria-modal="true"
  >
    <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <DefaultAuthCard
        subtitle="Department of Environment and Natural Resources"
        division="Planning and Management Division"
        :title="pageTitle"
      >
        <form @submit.prevent="loginUser">
          <InputGroup
            v-model="form.username"
            label="Username"
            type="text"
            placeholder="Enter your username"
          >
            <svg
              class="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                  fill=""
                />
              </g>
            </svg>
          </InputGroup>

          <InputGroup
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Password"
          >
            <svg
              class="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                  fill=""
                />
                <path
                  d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                  fill=""
                />
              </g>
            </svg>
          </InputGroup>

          <div class="mb-5 mt-6 flex justify-between gap-4">
            <input
              type="button"
              value="Cancel"
              @click="closeLogin"
              class="w-1/2 cursor-pointer rounded-lg border border-gray-400 bg-gray-300 p-4 font-medium text-black transition hover:bg-gray-400"
            />
            <input
              type="submit"
              value="Sign In"
              class="w-1/2 cursor-pointer rounded-lg border border-teal bg-teal p-4 font-medium text-white transition hover:bg-opacity-90"
            />
          </div>

          <div class="mt-6 text-center">
            <p class="font-medium">
              DENR IV-A Regional Information and Communications Technology (RICT) © 2025 All Right
              Reserved .
            </p>
          </div>
        </form>
      </DefaultAuthCard>
      <slot></slot>
    </div>
  </div>

  <div class="flex h-screen overflow-hidden">
    <!-- ===== Content Area Start ===== -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- ===== Main Content Start ===== -->
      <main>
        <header class="fixed w-full">
          <nav class="bg-white border-gray-200 py-2.5 dark:bg-gray-900">
            <div class="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
              <a href="#" class="flex items-center">
                <img
                  src="../../assets/images/logo/denr_logo.png"
                  class="h-6 mr-3 sm:h-9"
                  alt="Landwind Logo"
                />
                <span class="self-center text-xl font-semibold whitespace-nowrap text-teal-900"
                  >ICT Inventory System</span
                >
              </a>
              <div class="flex items-center lg:order-2">
                <a
                  @click="openLogin"
                  class="text-white bg-teal-700 hover:bg-teal-900 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-teal-800"
                  >Sigin-in</a
                >
                <button
                  data-collapse-toggle="mobile-menu-2"
                  type="button"
                  class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  aria-controls="mobile-menu-2"
                  aria-expanded="false"
                >
                  <span class="sr-only">Open main menu</span>
                  <svg
                    class="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <svg
                    class="hidden w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <div
                class="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1"
                id="mobile-menu-2"
              >
                <!-- <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                  <li>
                    <a
                      href="https://calabarzon.denr.gov.ph"
                      target="_blank"
                      class="block py-2 pl-3 pr-4 text-white bg-teal-700 rounded lg:bg-transparent lg:text-teal-700 lg:p-0 dark:text-white"
                      aria-current="page"
                      >Official Website</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-teal-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >About Us</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-teal-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >Team</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-teal-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >Features</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-teal-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >Team</a
                    >
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-teal-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >Contact</a
                    >
                  </li>
                </ul> -->
              </div>
            </div>
          </nav>
        </header>

        <section class="bg-white bg-portal dark:bg-gray-900">
          <div
            class="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28"
          >
            <div class="mr-auto place-self-center lg:col-span-7">
              <h1
                class="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white"
              >
                Welcome to<br />
                ICT Inventory System Portal
              </h1>
              <p
                class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"
              >
                This portal serves as a centralized platform for accessing important environmental
                data, reports, and services provided by DENR IV-A. Designed to enhance efficiency
                and transparency, it enables users to navigate regulatory processes, monitor
                conservation efforts, and stay informed about the region's environmental programs.
                Whether you're a stakeholder, researcher, or citizen, this system streamlines access
                to essential information and resources for sustainable development.
              </p>
              <div class="space-y-4 sm:flex sm:space-y-0 sm:space-x-4"></div>
            </div>
            <!-- <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <img src="../../assets/images/feature-3.jpg" alt="hero image" />
            </div> -->
          </div>
          <div class="max-w-screen-xl px-4 pb-8 mx-auto lg:pb-16">
            <div
              class="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 sm:grid-cols-3 lg:grid-cols-6 dark:text-gray-400"
            >
              <a href="#" class="flex items-center lg:justify-center font-black">
                Regional Office
              </a>
              <a href="#" class="flex items-center lg:justify-center font-black"> PENRO CAVITE </a>
              <a href="#" class="flex items-center lg:justify-center font-black"> PENRO LAGUNA </a>
              <a href="#" class="flex items-center lg:justify-center font-black">
                PENRO BATANGAS
              </a>
              <a href="#" class="flex items-center lg:justify-center font-black"> PENRO RIZAL </a>
              <a href="#" class="flex items-center lg:justify-center font-black"> PENRO QUEZON </a>
            </div>
          </div>
        </section>

        <section class="bg-white">
          <div class="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
            <div class="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
              <div class="text-gray-500 sm:text-lg dark:text-gray-400">
                <h2
                  class="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-5xl text-teal-900"
                >
                  ICT Inventory System
                </h2>
                <p class="mb-8 font-light lg:text-xl">
                  software solution designed to manage and track an organization's information and
                  communication technology (ICT) assets. It helps in maintaining records of
                  hardware, software, and other IT resources, ensuring efficient allocation,
                  monitoring, and lifecycle management. Key features often include asset
                  registration, real-time tracking, maintenance scheduling, and reporting, enabling
                  organizations to optimize resource utilization, prevent loss, and ensure
                  compliance with IT policies.
                </p>

                <ul
                  role="list"
                  class="pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700"
                >
                  <li class="flex space-x-3">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-base font-medium leading-tight text-gray-900 dark:text-white"
                      >Asset Management</span
                    >
                  </li>
                  <li class="flex space-x-3">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-base font-medium leading-tight text-gray-900 dark:text-white"
                      >Asset Tracking</span
                    >
                  </li>
                  <li class="flex space-x-3">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-base font-medium leading-tight text-gray-900 dark:text-white"
                      >User & Role Management</span
                    >
                  </li>
                  <li class="flex space-x-3">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-base font-medium leading-tight text-gray-900 dark:text-white"
                      >Mobile & Web Access</span
                    >
                  </li>
                </ul>
                <p class="mb-8 font-light lg:text-xl">
                  Deliver great service experiences fast - without the complexity of traditional
                  ITSM solutions.
                </p>
              </div>
              <img
                class="hidden w-[900px] h-auto mb-4 rounded-lg lg:mb-0 lg:flex"
                src="@/assets/images/feature-1.png"
                alt="dashboard feature image"
              />
            </div>
          </div>
        </section>

        <section class="bg-gray-50 dark:bg-gray-800">
          <div class="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
            <div class="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
              <Qrcode
                value="https://expo.dev/accounts/itskimeng/projects/scanner/builds/86c4fce7-2d27-425e-aa07-96f800a7c35e"
                :size="500"
              />
              <div class="text-gray-500 sm:text-lg dark:text-gray-400">
                <h2
                  class="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-5xl text-teal-900"
                >
                  Scan to download the mobile application
                </h2>
                <p class="mb-8 font-light lg:text-xl">
                  Deliver great service experiences fast - without the complexity of traditional
                  ITSM solutions. Accelerate critical development work, eliminate toil, and deploy
                  changes with ease.
                </p>

                <ul
                  role="list"
                  class="pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700"
                >
                  <li class="flex space-x-3">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-base font-medium leading-tight text-gray-900 dark:text-white"
                      >Dynamic reports and dashboards</span
                    >
                  </li>
                  <li class="flex space-x-3">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-base font-medium leading-tight text-gray-900 dark:text-white"
                      >Templates for everyone</span
                    >
                  </li>
                  <li class="flex space-x-3">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-base font-medium leading-tight text-gray-900 dark:text-white"
                      >Development workflow</span
                    >
                  </li>
                  <li class="flex space-x-3">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-base font-medium leading-tight text-gray-900 dark:text-white"
                      >Limitless business automation</span
                    >
                  </li>
                  <li class="flex space-x-3">
                    <svg
                      class="flex-shrink-0 w-5 h-5 text-teal-500 dark:text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="text-base font-medium leading-tight text-gray-900 dark:text-white"
                      >Knowledge management</span
                    >
                  </li>
                </ul>
                <p class="font-light lg:text-xl">
                  Deliver great service experiences fast - without the complexity of traditional
                  ITSM solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="bg-white dark:bg-gray-800">
          <div class="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
            <h2
              class="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-5xl text-teal-900"
            >
              Regional ICT Team
            </h2>
            <div class="items-center"></div>
            <swiper
              :modules="modules"
              :slides-per-view="3"
              :space-between="50"
              navigation
              :pagination="{ clickable: true }"
              :scrollbar="{ draggable: true }"
              @swiper="onSwiper"
              @slideChange="onSlideChange"
            >
              <swiper-slide><img src="../../assets/images/team-1.png" /></swiper-slide>
              <swiper-slide><img src="../../assets/images/team-2.png" /></swiper-slide>
              <swiper-slide><img src="../../assets/images/team-3.png" /></swiper-slide>
              <swiper-slide><img src="../../assets/images/team-4.png" /></swiper-slide>
              <swiper-slide><img src="../../assets/images/team-5.png" /></swiper-slide>

              ...
            </swiper>
          </div>
        </section>
      </main>
      <!-- ===== Main Content End ===== -->
    </div>
  </div>
</template>

<style scoped>
.bg-portal {
  color: #134E4A;
  background: url('../../assets/images/bg-hero.jpg') no-repeat;
  background-position: 50% 100%;
  background-size: cover;
  height: 70vh;
}
.custom-otp-input {
  width: 48px;
  height: 48px;
  font-size: 24px;
  appearance: none;
  text-align: center;
  transition: all 0.2s;
  border-radius: 0;
  border: 1px solid var(--p-inputtext-border-color);
  background: transparent;
  outline-offset: -2px;
  outline-color: transparent;
  border-right: 0 none;
  transition: outline-color 0.3s;
  color: var(--p-inputtext-color);
}

.custom-otp-input:focus {
  outline: 2px solid var(--p-focus-ring-color);
}

.custom-otp-input:first-child,
.custom-otp-input:nth-child(5) {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.custom-otp-input:nth-child(3),
.custom-otp-input:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-right-width: 1px;
  border-right-style: solid;
  border-color: var(--p-inputtext-border-color);
}
.st0 {
  fill: #0acf83;
}

.st1 {
  fill: #a259ff;
}

.st2 {
  fill: #f24e1e;
}

.st3 {
  fill: #ff7262;
}

.st4 {
  fill: #1abcfe;
}

.background {
  padding: 6% 0;
}
.horizontal-slider {
  margin: 50px auto 0;
  width: 60%;
}
.list-wrapper {
  position: relative;
  width: 100%;
  padding-top: 15%;
}
.list {
  position: absolute;
  width: 100%;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0;
}
</style>
