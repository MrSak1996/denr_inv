<style>
.p-dialog-mask {
  background: rgba(0, 0, 0, 0.7); /* Adjust the overlay color and opacity */
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Dialog from 'primevue/dialog'
import SpeedDial from 'primevue/speeddial'
import MultiSelect from '@/components/Forms/MultiSelect.vue'
import Select from 'primevue/select'
import Slider from 'primevue/slider'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import DatePicker from 'primevue/datepicker'
import Checkbox from 'primevue/checkbox'
import InputNumber from 'primevue/inputnumber'
import ColumnGroup from 'primevue/columngroup' // optional
import Row from 'primevue/row'

import { CustomerService } from '@/service/CustomerService'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api'
import router from '@/router'

import api from '../../../laravel-backend/resources/js/axiosInstance.js'

const customers = ref()
const filters = ref()
const visible = ref(false)

const representatives = ref([
  { name: 'Amy Elsner', image: 'amyelsner.png' },
  { name: 'Anna Fali', image: 'annafali.png' },
  { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
  { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
  { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
  { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
  { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
  { name: 'Onyama Limba', image: 'onyamalimba.png' },
  { name: 'Stephen Shaw', image: 'stephenshaw.png' },
  { name: 'XuXue Feng', image: 'xuxuefeng.png' }
])
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'])
const loading = ref(true)

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    const response = await api.get(`/getInventoryData`)
    customers.value = getCustomers(response.data) // Use the getCustomers function to process the data
    loading.value = false // Set loading to false once data is fetched
  } catch (error) {
    console.error('Error fetching customers:', error)
    loading.value = false // Set loading to false even if there's an error
  }
}

const initFilters = () => {
  filters.value = {
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    control_no: { value: null, matchMode: FilterMatchMode.CONTAINS },
    actual_division_title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    equipment_title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    acct_person: { value: null, matchMode: FilterMatchMode.CONTAINS },
    qr_code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    brand: { value: null, matchMode: FilterMatchMode.CONTAINS },
    full_specs: { value: null, matchMode: FilterMatchMode.CONTAINS },
    range_category: { value: null, matchMode: FilterMatchMode.CONTAINS },
    actual_user: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
  // filters.value = {
  //   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //   name: {
  //     operator: FilterOperator.AND,
  //     constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  //   },
  //   'country.name': {
  //     operator: FilterOperator.AND,
  //     constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
  //   },
  //   representative: { value: null, matchMode: FilterMatchMode.IN },
  //   date: {
  //     operator: FilterOperator.AND,
  //     constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
  //   },
  //   balance: {
  //     operator: FilterOperator.AND,
  //     constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
  //   },
  //   status: {
  //     operator: FilterOperator.OR,
  //     constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
  //   },
  //   activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
  //   verified: { value: null, matchMode: FilterMatchMode.EQUALS }
  // }
}

initFilters()

const formatDate = (value) => {
  return value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
const clearFilter = () => {
  initFilters()
}
const addMore = () => {
  router.push({ path: '/inventory/create' })
}
const getCustomers = (data) => {
  return [...(data || [])].map((d) => {
    d.date = new Date(d.date)

    return d
  })
}
const getSeverity = (status) => {
  switch (status) {
    case 'unqualified':
      return 'danger'

    case 'qualified':
      return 'success'

    case 'new':
      return 'info'

    case 'negotiation':
      return 'warn'

    case 'renewal':
      return null
  }
}

const viewRecord = (id) =>{
  router.push({
    path: `/inventory/create/${id}`,
    query: { api_token: localStorage.getItem('api_token') }
  });
}

const pageTitle = ref('Inventory Management')
</script>
<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />

    <div class="flex flex-col gap-10">
      <div
        class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      >
        <!-- <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">Top Channels</h4> -->

        <DataTable
          size="small"
          v-model:filters="filters"
          :value="customers"
          paginator
          showGridlines
          :rows="10"
          dataKey="id"
          filterDisplay="menu"
          :loading="loading"
          :globalFilterFields="[
            'control_no',
            'actual_division',
            'equipment_title',
            'acct_person',
            'qr_code'
          ]"
        >
          <template #header>
            <div class="flex items-center gap-4 justify-start">
              <Button
              class='text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                type="button"
                icon="pi pi-filter-slash"
                label="Clear"
                @click="clearFilter()"
              />
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Add"
                outlined
                @click="addMore()"
              />

              <!-- Additional space between buttons and search field -->
              <div class="ml-auto flex items-center">
                <IconField class="flex items-center">
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
              </div>
            </div>
          </template>
          <template #empty> No customers found. </template>
          <template #loading> Loading customers data. Please wait. </template>
          <Column field="id" header="Action" style="min-width: 14rem">
            <template #body="{ data }">
              <Button label="View" @click="viewRecord(data.id)" icon="pi pi-eye" size="small" severity="info" />
              <Button
                label="Download"
                icon="pi pi-download"
                size="small"
                class='ml-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                severity="success"
              />
              <div class="card flex justify-center">
              <Dialog
                v-model:visible="visible"
                modal
                header="Header"
                :style="{ width: '50rem' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
                :modal-options="{ style: { opacity: '0.8' } }"

              >
                <p class="mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </p>
                <p class="mb-8">
                  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                  voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                  magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                  qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
                  numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                  voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
                  suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
                  iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
                  consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                </p>
                <p class="mb-8">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                  praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
                  excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
                  officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                  rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
                  eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere
                  possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
                  quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et
                  voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic
                  tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias
                  consequatur aut perferendis doloribus asperiores repellat.
                </p>
                <p class="mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </p>
                <p class="mb-8">
                  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                  voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                  magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                  qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non
                  numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                  voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
                  suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
                  iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
                  consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                </p>
                <p>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                  praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
                  excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
                  officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                  rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
                  eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere
                  possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
                  quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et
                  voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic
                  tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias
                  consequatur aut perferendis doloribus asperiores repellat.
                </p>
              </Dialog>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="control_no" header="Control No" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.control_no }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="qr_code" header="QR Code" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.qr_code }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="actual_division_title" header="Office/Division" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.actual_division_title }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="equipment_title" header="Type of ICT Equipment" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.equipment_title }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="brand" header="Brand & Model" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.brand }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="full_specs" header="Specifications / Descriptions" style="min-width: 1rem">
            <template #body="{ data }">
              {{ data.full_specs }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="range_category" header="Range Category" style="min-width: 1rem">
            <template #body="{ data }">
              {{ data.range_category }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="acct_person" header="Accountable Person" style="min-width: 1rem">
            <template #body="{ data }">
              {{ data.acct_person }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>
          <Column field="actual_user" header="Actual User" style="min-width: 1rem">
            <template #body="{ data }">
              {{ data.actual_user }}
              <!-- Ensure this field exists in the data object -->
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
            </template>
          </Column>

          <!-- <Column
            header="TYPE OF ICT EQUIPMENT"
            filterField="date"
            dataType="date"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              {{ formatDate(data.date) }}
            </template>
            <template #filter="{ filterModel }">
              <DatePicker
                v-model="filterModel.value"
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
              />
            </template>
          </Column>
          <Column
            header="YEAR ACQUIRED"
            filterField="balance"
            dataType="numeric"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              {{ formatCurrency(data.balance) }}
            </template>
            <template #filter="{ filterModel }">
              <InputNumber
                v-model="filterModel.value"
                mode="currency"
                currency="USD"
                locale="en-US"
              />
            </template>
          </Column>
          <Column
            header="SHELF LIFE"
            field="status"
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getSeverity(data.status)" />
            </template>
            <template #filter="{ filterModel }">
              <Select
                v-model="filterModel.value"
                :options="statuses"
                placeholder="Select One"
                showClear
              >
                <template #option="slotProps">
                  <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                </template>
              </Select>
            </template>
          </Column>
          <Column
            field="activity"
            header="BRAND"
            :showFilterMatchModes="false"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <ProgressBar
                :value="data.activity"
                :showValue="false"
                style="height: 6px"
              ></ProgressBar>
            </template>
            <template #filter="{ filterModel }">
              <Slider v-model="filterModel.value" range class="m-4"></Slider>
              <div class="flex items-center justify-between px-2">
                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
              </div>
            </template>
          </Column>
          <Column
            field="verified"
            header="SPECIFICATION/DESCRIPTION"
            dataType="boolean"
            bodyClass="text-center"
            style="min-width: 8rem"
          >
            <template #body="{ data }">
              <i
                class="pi"
                :class="{
                  'pi-check-circle text-green-500 ': data.verified,
                  'pi-times-circle text-red-500': !data.verified
                }"
              ></i>
            </template>
            <template #filter="{ filterModel }">
              <label for="verified-filter" class="font-bold"> Verified </label>
              <Checkbox
                v-model="filterModel.value"
                :indeterminate="filterModel.value === null"
                binary
                inputId="verified-filter"
              />
            </template>
          </Column>
          <Column
            field="verified"
            header="RANGE CATEGORY"
            dataType="boolean"
            bodyClass="text-center"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              <i
                class="pi"
                :class="{
                  'pi-check-circle text-green-500 ': data.verified,
                  'pi-times-circle text-red-500': !data.verified
                }"
              ></i>
            </template>
            <template #filter="{ filterModel }">
              <label for="verified-filter" class="font-bold"> Verified </label>
              <Checkbox
                v-model="filterModel.value"
                :indeterminate="filterModel.value === null"
                binary
                inputId="verified-filter"
              />
            </template>
          </Column>
          <Column
            field="verified"
            header="RANGE CATEGORY"
            dataType="boolean"
            bodyClass="text-center"
            style="min-width: 10rem"
          >
          </Column>
          <Column header="Accountable Person" filterField="country.name" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img
                  alt="flag"
                  src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                  :class="`flag flag-${data.acct_person}`"
                  style="width: 24px"
                />
                <span>{{ data.country.name }}</span>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
            </template>
            <template #filterclear="{ filterCallback }">
              <Button
                type="button"
                icon="pi pi-times"
                @click="filterCallback()"
                severity="secondary"
              ></Button>
            </template>
            <template #filterapply="{ filterCallback }">
              <Button
                type="button"
                icon="pi pi-check"
                @click="filterCallback()"
                severity="success"
              ></Button>
            </template>
            <template #filterfooter>
              <div class="px-4 pt-0 pb-4 text-center">Customized Buttons</div>
            </template>
          </Column>
          <Column
            header="Office/Division"
            filterField="representative"
            :showFilterMatchModes="false"
            :filterMenuStyle="{ width: '14rem' }"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <img
                  :alt="data.representative.name"
                  :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`"
                  style="width: 32px"
                />
                <span>{{ data.representative.name }}</span>
              </div>
            </template>
            <template #filter="{ filterModel }">
              <MultiSelect
                v-model="filterModel.value"
                :options="representatives"
                optionLabel="name"
                placeholder="Any"
              >
                <template #option="slotProps">
                  <div class="flex items-center gap-2">
                    <img
                      :alt="slotProps.option.name"
                      :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`"
                      style="width: 32px"
                    />
                    <span>{{ slotProps.option.name }}</span>
                  </div>
                </template>
              </MultiSelect>
            </template>
          </Column> -->
        </DataTable>
      </div>
    </div>
  </DefaultLayout>
</template>
