<template>
  <div>
    <toolbar :title="t('global.payment-transactions-management')" />
    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="card">
          <div class="card-header border-0 pt-6">
            <div class="card-title d-flex gap-10 flex-wrap">
              <!-- Search input -->
              <div class="d-flex flex-column align-items-start position-relative my-1">
                <label for="search-term" class="me-3 fw-bold">
                  {{ t("global.student-name") }}:
                </label>
                <input
                  id="search-term"
                  type="text"
                  name="search-labels"
                  v-model="searchTerm"
                  :placeholder="t('global.search')"
                  data-kt-label-table-filter="search"
                  class="form-control form-control-solid w-250px ps-14"
                  @input="filterBySearch" />
              </div>

              <!-- Filter by status -->
              <div class="d-flex flex-column align-items-start position-relative my-1">
                <label for="filter-payment-status" class="me-3 fw-bold">
                  {{ t("global.status") }}:
                </label>
                <select
                  id="filter-payment-status"
                  class="form-select form-select-solid w-250px"
                  @change="filterByStatus"
                  v-model="selectedStatus">
                  <option value="">{{ t("global.all") }}</option>
                  <option value="initiated">{{ t("global.initiated") }}</option>
                  <option value="created">{{ t("global.created") }}</option>
                  <option value="completed">{{ t("global.completed") }}</option>
                  <option value="canceled">{{ t("global.canceled") }}</option>
                </select>
              </div>

              <!-- Filter by channel -->
              <div class="d-flex flex-column align-items-start position-relative my-1">
                <label for="filter-payment-channel" class="me-3 fw-bold">
                  {{ t("global.channel") }}:
                </label>
                <select
                  id="filter-payment-channel"
                  class="form-select form-select-solid w-250px"
                  @change="filterByChannel"
                  v-model="selectedChannel">
                  <option value="">{{ t("global.all") }}</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">Paypal</option>
                </select>
              </div>

              <div class="card p-3 m-3 col-md-8">
                <VueDatePicker
                  v-model="date"
                  :placeholder="t('global.select-range')"
                  @update:model-value="handleDateChange"
                  range
                  multi-calendars
                  text-input
                  :cancelText="t('global.close')"
                  :selectText="t('global.select')"
                  teleport-center
                  @cleared="clearDate" />
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <template v-if="loading">
            <div class="card-body p-0">
              <div class="card-px text-center py-20 my-10">
                <div role="status" class="spinner-border text-primary">
                  <span class="visually-hidden">{{ t("global.loading") }}...</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Empty State -->
          <template v-else-if="data.length === 0">
            <div class="card-body p-0">
              <div class="card-px text-center py-20 my-10">
                <h2 class="fs-2x fw-bold mb-10">{{ t("global.welcome") }}</h2>
                <p class="text-gray-400 fs-5 fw-semibold mb-13">
                  {{ t("global.no-payment-transactions") }}
                </p>
              </div>
              <div class="text-center px-5">
                <img
                  src="@/assets/media/illustrations/welcome.png"
                  alt="Add User Illustration"
                  class="mw-100 mh-300px" />
              </div>
            </div>
          </template>

          <!-- Data Table -->
          <template v-else>
            <div class="card-body py-4">
              <data-table
                :data="data"
                :header="header"
                :checkbox-enabled="true"
                checkbox-label="id"
                :items-total="itemsTotal"
                :page-current="currentPage"
                :items-per-page="itemsPerPage"
                :items-per-page-dropdown-enabled="true"
                @on-sort="onSort"
                @on-items-select="onItemsSelect">
                <template #id="{row: label}">
                  {{ data.indexOf(label) + 1 }}
                </template>

                <template #user="{row: transaction}">
                  {{ transaction.user.name }}
                </template>

                <template #amount="{row: transaction}">
                  {{ transaction.amount }}
                </template>

                <template #payment_status="{row: transaction}">
                  <span :class="statusClass(transaction.payment_status)">
                    {{ transaction.payment_status }}
                  </span>
                </template>

                <template #payment_channel="{row: transaction}">
                  <span
                    :class="channelClass(transaction.payment_channel)"
                    class="d-flex gap-1 align-items-center w-70px justify-content-center">
                    <i
                      v-if="transaction.payment_channel == 'paypal'"
                      class="fa-brands fa-paypal text-primary"></i>
                    <i
                      v-if="transaction.payment_channel == 'stripe'"
                      class="fa-brands fa-stripe-s text-primary"></i>
                    {{ transaction.payment_channel }}
                  </span>
                </template>

                <!-- <template #action="{row: transaction}">
                  {{ transaction.action }}
                </template> -->
              </data-table>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import DataTable from "@/components/admin/data-table/index.vue"
import axiosClient from "@/plugins/axios"
import arraySort from "array-sort"
import {defineComponent, onBeforeMount, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import VueDatePicker from "@vuepic/vue-datepicker"
import {onMounted} from "vue"

export default defineComponent({
  name: "payment-transactions",
  components: {Toolbar, DataTable, VueDatePicker},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const words = ref({word: "", status: false})
    const selectedStatus = ref("")
    const selectedChannel = ref("")
    const searchTerm = ref("")
    const filterDateFrom = ref("")
    const filterDateTo = ref("")
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const idsSelected = ref([])
    const idCurrent = ref(null)

    const date = ref()

    const clearDate = () => {
      filterDateFrom.value = null
      filterDateTo.value = null
      axiosClient
        .get(`/wallet/payment/transactions`)
        .then((response) => {
          data.value = response.data.result.data
          currentPage.value = response.data.result.current_page
          itemsPerPage.value = response.data.result.per_page
        })
        .finally(() => {
          loading.value = false
        })
    }

    const handleDateChange = (selectedDates) => {
      if (selectedDates && selectedDates.length === 2) {
        filterDateFrom.value = formatDate(selectedDates[0])
        filterDateTo.value = formatDate(selectedDates[1])
        console.log(
          "filterDateFrom&To:",
          formatDate(filterDateFrom.value),
          formatDate(filterDateTo.value)
        )
        getDataTableBodyRows()
      }
    }

    const formatDate = (date) => {
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`
    }

    const header = ref([
      {columnName: "#", columnLabel: "id", sortEnabled: true, columnWidth: 75},
      {columnName: t("global.user"), columnLabel: "user", sortEnabled: true, columnWidth: 175},
      {columnName: t("global.amount"), columnLabel: "amount", sortEnabled: true, columnWidth: 175},
      {
        columnName: t("global.payment-status"),
        columnLabel: "payment_status",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.payment-channel"),
        columnLabel: "payment_channel",
        sortEnabled: true,
        columnWidth: 175
      }
      // {columnName: t("global.action"), columnLabel: "action", sortEnabled: false, columnWidth: 175}
    ])

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      const params = new URLSearchParams()

      if (searchTerm.value) {
        params.append("username", searchTerm.value)
      }

      if (selectedStatus.value) {
        params.append("payment_status", selectedStatus.value)
      }

      if (selectedChannel.value) {
        params.append("payment_channel", selectedChannel.value)
      }

      if (filterDateFrom.value) {
        console.log(filterDateFrom.value)

        params.append("from_date", filterDateFrom.value)
      }

      if (filterDateTo.value) {
        params.append("to_date", filterDateTo.value)
      }

      const queryString2 = params.toString() ? `?${params.toString()}` : ""

      axiosClient
        .get(`/wallet/payment/transactions${queryString}${queryString2}`)
        .then((response) => {
          data.value = response.data.result.data
          currentPage.value = response.data.result.current_page
          itemsPerPage.value = response.data.result.per_page
          itemsTotal.value = response.data.result.total
        })
        .finally(() => {
          loading.value = false
        })
    }

    const filterBySearch = () => getDataTableBodyRows()
    const filterByStatus = () => getDataTableBodyRows()
    const filterByChannel = () => getDataTableBodyRows()
    const filterByDate = () => getDataTableBodyRows()

    const onSort = function onSort(sort) {
      const reverse = sort.order === "ASC".toLowerCase()
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    const onItemsSelect = function onItemsSelect(itemsSelected) {
      if (itemsSelected.length === 0) idsSelected.value = []
      else idsSelected.value = [...idsSelected.value, ...itemsSelected]
    }

    const deleteForbiddenWord = function deleteForbiddenWord(id) {
      Swal.fire({
        icon: "error",
        text: t("global.ensure-delete"),
        showCancelButton: true,
        confirmButtonText: t("global.yes-delete"),
        cancelButtonText: t("global.go-back"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-danger", cancelButton: "btn btn-active-light"}
      }).then((result) => {
        if (result.isConfirmed) {
          axiosClient.delete(`/forbidden-words/${id}`).then(() => {
            getDataTableBodyRows()
          })
        }
      })
    }

    const deleteFewForbiddenWords = function deleteFewForbiddenWords() {
      idsSelected.value.forEach((item) => {
        deleteForbiddenWord(item)
      })
      idsSelected.value.length = 0
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    provide("words", words)

    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
    })

    onMounted(() => {
      const startDate = new Date().setDate(new Date().getDate() - 31)
      const endDate = new Date()
      date.value = [startDate, endDate]

      console.log(date)
      handleDateChange(date.value)
    })

    return {
      SERVER_PATH,
      t,
      loading,
      header,
      data,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      idCurrent,
      words,
      selectedStatus,
      selectedChannel,
      searchTerm,
      filterDateFrom,
      filterDateTo,
      filterByStatus,
      filterByChannel,
      filterBySearch,
      filterByDate,
      getDataTableBodyRows,
      onSort,
      onItemsSelect,
      deleteForbiddenWord,
      deleteFewForbiddenWords,
      date,
      clearDate,
      handleDateChange
    }
  },
  methods: {
    statusClass(status) {
      switch (status) {
        case "initiated":
          return "badge bg-warning text-white"
        case "created":
          return "badge bg-primary text-white"
        case "completed":
          return "badge bg-success text-white"
        case "canceled":
          return "badge bg-danger text-white"
        default:
          return "badge bg-secondary text-white"
      }
    },
    channelClass(channel) {
      switch (channel) {
        case "paypal":
          return "badge bg-info text-white"
        case "stripe":
          return "badge bg-dark text-white"
        default:
          return "badge bg-secondary"
      }
    }
  }
})
</script>
