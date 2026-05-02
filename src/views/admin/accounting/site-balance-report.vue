<template>
  <div>
    <toolbar :title="t('global.site-balance-report')" />

    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="row g-4 mb-6">
          <div v-for="card in statCards" :key="card.label" class="col-12 col-sm-6 col-xl-3">
            <div class="report-metric-card h-100">
              <div class="fs-2 fw-bold text-gray-900">{{ money(card.value) }}</div>
              <div class="fw-semibold fs-7 text-gray-500">{{ card.label }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header border-0 pt-6">
            <div class="card-title d-flex flex-wrap gap-3 w-100">
              <div class="d-flex flex-column my-1">
                <label for="search-student-transactions" class="fw-semibold mb-1">
                  {{ t("global.search") }}
                </label>
                <input
                  id="search-student-transactions"
                  v-model="currentSearchQuery"
                  type="text"
                  :placeholder="t('global.search-students')"
                  class="form-control form-control-solid w-250px"
                  @keyup.enter="getDataTableBodyRows" />
              </div>

              <div class="d-flex flex-column my-1">
                <label for="transaction-type-filter" class="fw-semibold mb-1">
                  {{ t("global.type") }}
                </label>
                <select
                  id="transaction-type-filter"
                  v-model="selectedTransactionType"
                  class="form-select form-select-solid w-225px"
                  @change="getDataTableBodyRows">
                  <option value="">{{ t("global.all") }}</option>
                  <option value="wallet_topup">{{ transactionTypeLabel("wallet_topup") }}</option>
                  <option value="group_class_purchase">
                    {{ transactionTypeLabel("group_class_purchase") }}
                  </option>
                  <option value="private_lesson_purchase">
                    {{ transactionTypeLabel("private_lesson_purchase") }}
                  </option>
                  <option value="course_purchase">{{ transactionTypeLabel("course_purchase") }}</option>
                  <option value="wallet_package_purchase">
                    {{ transactionTypeLabel("wallet_package_purchase") }}
                  </option>
                </select>
              </div>

              <div class="d-flex flex-column my-1">
                <label for="transaction-status-filter" class="fw-semibold mb-1">
                  {{ t("global.status") }}
                </label>
                <select
                  id="transaction-status-filter"
                  v-model="selectedStatus"
                  class="form-select form-select-solid w-175px"
                  @change="getDataTableBodyRows">
                  <option value="">{{ t("global.all") }}</option>
                  <option value="pending">{{ statusLabel("pending") }}</option>
                  <option value="completed">{{ statusLabel("completed") }}</option>
                  <option value="failed">{{ statusLabel("failed") }}</option>
                  <option value="canceled">{{ statusLabel("canceled") }}</option>
                </select>
              </div>

              <div class="d-flex flex-column my-1">
                <label for="from-date-filter" class="fw-semibold mb-1">
                  {{ t("global.from-date") }}
                </label>
                <input
                  id="from-date-filter"
                  v-model="fromDate"
                  type="date"
                  class="form-control form-control-solid w-175px"
                  @change="getDataTableBodyRows" />
              </div>

              <div class="d-flex flex-column my-1">
                <label for="to-date-filter" class="fw-semibold mb-1">
                  {{ t("global.to-date") }}
                </label>
                <input
                  id="to-date-filter"
                  v-model="toDate"
                  type="date"
                  class="form-control form-control-solid w-175px"
                  @change="getDataTableBodyRows" />
              </div>

              <div class="d-flex align-items-end my-1">
                <button type="button" class="btn btn-light-primary" @click="getDataTableBodyRows">
                  {{ t("global.refresh") }}
                </button>
              </div>
            </div>
          </div>

          <template v-if="loading">
            <div class="card-body p-0">
              <div class="card-px text-center py-20 my-10">
                <div role="status" class="spinner-border text-primary">
                  <span class="visually-hidden">{{ t("global.loading") }}...</span>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="data.length === 0">
            <div class="card-body p-0">
              <div class="card-px text-center py-20 my-10">
                <h2 class="fs-2x fw-bold mb-10">{{ t("global.welcome") }}</h2>
                <p class="text-gray-400 fs-5 fw-semibold mb-13">
                  {{ t("global.no-student-accounting-transactions") }}
                </p>
              </div>
              <div class="text-center px-5">
                <img
                  src="@/assets/media/illustrations/welcome.png"
                  alt="No data"
                  class="mw-100 mh-300px" />
              </div>
            </div>
          </template>

          <template v-else>
            <div class="card-body py-4">
              <data-table
                :data="data"
                :header="header"
                :checkbox-enabled="false"
                checkbox-label="id"
                :items-total="itemsTotal"
                :page-current="currentPage"
                :items-per-page="itemsPerPage"
                :items-per-page-dropdown-enabled="true"
                @on-sort="onSort">
                <template #created_at="{row: transaction}">
                  {{ formatDateTime(transaction.created_at) }}
                </template>

                <template #student="{row: transaction}">
                  <div class="fw-semibold text-gray-900">
                    {{ transaction.student?.full_name || transaction.student?.name || "-" }}
                  </div>
                  <div class="text-gray-500 fs-8">{{ transaction.student?.email || "-" }}</div>
                </template>

                <template #amount="{row: transaction}">
                  <span :class="transaction.type === 'credit' ? 'text-success' : 'text-danger'">
                    {{ transaction.type === "credit" ? "+" : "-" }}{{ money(transaction.amount) }}
                  </span>
                </template>

                <template #display_transaction_type="{row: transaction}">
                  {{ transactionTypeLabel(transaction.display_transaction_type) }}
                </template>

                <template #display_payment_gateway="{row: transaction}">
                  {{ paymentGatewayLabel(transaction.display_payment_gateway) }}
                </template>

                <template #display_status="{row: transaction}">
                  <span :class="statusClass(transaction.display_status)">
                    {{ statusLabel(transaction.display_status) }}
                  </span>
                </template>

                <template #order_id="{row: transaction}">
                  {{ transaction.order_id || "-" }}
                </template>
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
import {computed, defineComponent, onBeforeMount, provide, ref} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "site-balance-report",
  components: {Toolbar, DataTable},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const data = ref([])
    const stats = ref({})
    const itemsTotal = ref(0)
    const currentPage = ref(1)
    const itemsPerPage = ref(0)
    const currentSearchQuery = ref("")
    const selectedTransactionType = ref("")
    const selectedStatus = ref("")
    const fromDate = ref("")
    const toDate = ref("")

    const header = ref([
      {columnName: t("global.date"), columnLabel: "created_at", sortEnabled: true, columnWidth: 170},
      {columnName: t("global.student"), columnLabel: "student", sortEnabled: true, columnWidth: 220},
      {columnName: t("global.amount"), columnLabel: "amount", sortEnabled: true, columnWidth: 140},
      {columnName: t("global.type"), columnLabel: "display_transaction_type", sortEnabled: true, columnWidth: 190},
      {columnName: t("global.payment-gateway"), columnLabel: "display_payment_gateway", sortEnabled: true, columnWidth: 160},
      {columnName: t("global.status"), columnLabel: "display_status", sortEnabled: true, columnWidth: 130},
      {columnName: t("global.order"), columnLabel: "order_id", sortEnabled: true, columnWidth: 110}
    ])

    const statCards = computed(() => [
      {label: t("global.total-completed-amount"), value: stats.value.total_completed_amount},
      {label: t("global.last-month-income"), value: stats.value.last_month_completed_amount},
      {label: t("global.wallet-topups"), value: stats.value.wallet_topups_amount},
      {label: t("global.site-purchases"), value: stats.value.purchases_amount}
    ])

    const money = (value) => `${Number(value || 0).toFixed(2)} $`

    const formatDateTime = (value) => {
      if (!value) return "-"
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      return date.toLocaleString("en-GB")
    }

    const transactionTypeLabel = (type) => {
      const labels = {
        wallet_topup: t("global.wallet-topup"),
        group_class_purchase: t("global.group-class-purchase"),
        private_lesson_purchase: t("global.private-lesson-purchase"),
        course_purchase: t("global.course-purchase"),
        wallet_package_purchase: t("global.wallet-package-purchase"),
        order_payment: t("global.order-payment"),
        manual_adjustment: t("global.manual-adjustment"),
        legacy_credit: t("global.legacy-credit"),
        legacy_debit: t("global.legacy-debit")
      }
      return labels[type] || type || "-"
    }

    const paymentGatewayLabel = (gateway) => {
      if (!gateway || gateway === "-") return "-"
      if (gateway === "my-wallet") return t("global.my-wallet")
      if (gateway === "local-test") return t("global.local-test")
      if (gateway === "manual") return t("global.manual")
      return gateway
    }

    const statusLabel = (status) => {
      const labels = {
        pending: t("global.pending"),
        completed: t("global.completed"),
        failed: t("global.failed"),
        canceled: t("global.canceled")
      }
      return labels[status] || status || "-"
    }

    const statusClass = (status) => {
      const classes = {
        pending: "badge badge-light-warning",
        completed: "badge badge-light-success",
        failed: "badge badge-light-danger",
        canceled: "badge badge-light-secondary"
      }
      return classes[status] || "badge badge-light"
    }

    const getDataTableBodyRows = async (queryString = "") => {
      loading.value = true
      try {
        const params = {}
        if (currentSearchQuery.value) params.q = currentSearchQuery.value
        if (selectedTransactionType.value) params.transaction_type = selectedTransactionType.value
        if (selectedStatus.value) params.status = selectedStatus.value
        if (fromDate.value) params.from_date = fromDate.value
        if (toDate.value) params.to_date = toDate.value

        const response = await axiosClient.get(
          `/reports/student-accounting-transactions${queryString}`,
          {params}
        )
        data.value = response?.data?.result?.data || []
        stats.value = response?.data?.stats || {}
        itemsTotal.value = response?.data?.result?.total || 0
        currentPage.value = response?.data?.result?.current_page || 1
        itemsPerPage.value = response?.data?.result?.per_page || 0
      } catch {
        Swal.fire({
          icon: "error",
          text: t("global.errors-detected"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      } finally {
        loading.value = false
      }
    }

    const onSort = (sort) => {
      const reverse = sort.order === "asc"
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)

    onBeforeMount(() => {
      getDataTableBodyRows()
    })

    return {
      t,
      loading,
      data,
      stats,
      statCards,
      header,
      itemsTotal,
      currentPage,
      itemsPerPage,
      currentSearchQuery,
      selectedTransactionType,
      selectedStatus,
      fromDate,
      toDate,
      money,
      formatDateTime,
      transactionTypeLabel,
      paymentGatewayLabel,
      statusLabel,
      statusClass,
      getDataTableBodyRows,
      onSort
    }
  }
})
</script>

<style scoped>
.report-metric-card {
  padding: 1rem;
  border: 1px dashed #cfd8e3;
  border-radius: 0.75rem;
  background: #fff;
}
</style>
