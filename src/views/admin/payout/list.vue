<template>
  <div>
    <toolbar :title="t('global.payout-management')" />

    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="card">
          <div v-if="userType === 2" class="card mb-5 mb-xl-10">
            <div class="card-body pt-9 pb-0">
              <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
                <div class="flex-grow-1">
                  <div class="d-flex flex-wrap flex-stack">
                    <div class="d-flex flex-column flex-grow-1 pe-8">
                      <div class="d-flex flex-wrap align-items-start justify-content-between gap-3">
                        <div class="d-flex flex-wrap">
                        <div
                          class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div class="d-flex align-items-center">
                            <div class="fs-2 fw-bold">{{ tutorInfo?.balance }}</div>
                          </div>
                          <div class="fw-semibold fs-6 text-gray-500">
                            {{ t("global.balance") }}
                          </div>
                        </div>
                        <div
                          class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div class="d-flex align-items-center">
                            <div
                              class="fs-2 fw-bold"
                              data-kt-countup="false"
                              :data-kt-countup-value="tutorInfo?.withdraw_amount">
                              {{ tutorInfo?.withdraw_amount }}
                            </div>
                          </div>
                          <div class="fw-semibold fs-6 text-gray-500">
                            {{ t("global.withdraw-amount") }}
                          </div>
                        </div>
                        <div
                          class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div class="d-flex align-items-center">
                            <div class="fs-2 fw-bold">
                              {{ tutorInfo?.pending_balance || 0 }}
                            </div>
                          </div>
                          <div class="fw-semibold fs-6 text-gray-500">
                            {{ t("global.pending-balance") }}
                          </div>
                        </div>
                        <div
                          class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div class="d-flex align-items-center">
                            <div class="fs-2 fw-bold">
                              {{ tutorInfo?.requested_balance || 0 }}
                            </div>
                          </div>
                          <div class="fw-semibold fs-6 text-gray-500">
                            {{ t("global.requested-balance") }}
                          </div>
                        </div>
                        </div>
                        <router-link
                          :to="{name: 'accounting-balance-report', params: {id: userInfoObject.user.id}}"
                          class="btn btn-light-primary btn-sm mt-2">
                          {{ t("global.balance-report") }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <div class="d-flex align-items-center position-relative my-1">
                <span class="svg-icon svg-icon-1 position-absolute ms-6"> </span>
                <label for="search-payout" class="sr-only">
                  {{ t("global.search-payout") }}
                </label>
                <input
                  id="search-payout"
                  type="text"
                  name="search-payout"
                  :placeholder="t('global.search-payout')"
                  data-kt-word-table-filter="search"
                  class="form-control form-control-solid w-250px ps-14"
                  @keyup.enter="searchDataTableBodyRows" />
              </div>
            </div>
            <div class="card-toolbar">
              <div data-kt-word-table-toolbar="base" class="d-flex justify-content-end">
                <!-- <router-link id="cancel" to="/dashboard/payout/create" class="btn btn-primary me-5">
                  Add Payout
                </router-link> -->
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
                  <span>
                    {{ t("global.no-payouts") }}
                  </span>
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
                :query-string="currentSearchQuery"
                @on-sort="onSort"
                @on-items-select="onItemsSelect">
                <template #tutor="{row: payout}">
                  {{ payout.tutor.name }}
                </template>
                <template #amount="{row: payout}">
                  {{ payout.amount }}
                </template>
                <template #status="{row: payout}">
                  <span>{{ statusLabel(payout.status) }}</span>
                </template>

                <template #created_at="{row: payout}">
                  <span>{{ formatDate(payout.created_at) }}</span>
                </template>

                <template #payout_status="{row: payout}">
                  <span>{{ payoutStatusLabel(payout.payout_status) }}</span>
                </template>

                <template #actions="{row: payout}">
                  <button
                    type="button"
                    aria-label="Update"
                    class="btn btn-light-info me-2 p-2"
                    @click="openModal(payout.id)">
                    {{ t("global.show-details") }}
                  </button>
                  <button
                    v-if="userType === 0 && payout.status === 'P' && payout.payout_status !== 'transferred'"
                    type="button"
                    class="btn btn-light-success p-2"
                    @click="markPayoutTransferred(payout.id)">
                    {{ t("global.mark-as-transferred") }}
                  </button>
                </template>
              </data-table>

              <div
                id="payoutModal"
                class="modal fade"
                tabindex="-1"
                aria-labelledby="payoutModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered payout-details-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 id="payoutModalLabel" class="modal-title">
                        {{ t("global.payout-details") }}
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    </div>
                    <div v-if="currentPayout" class="modal-body">
                      <div class="row g-3 border-bottom pb-4 mb-4">
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.tutor-name") }}</strong>
                            <div class="fs-6 mt-1">{{ currentPayout.tutor?.name || "-" }}</div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.amount") }}</strong>
                            <div class="fs-6 mt-1 text-success">
                              {{ currentPayout.amount || "-" }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.status") }}</strong>
                            <div class="fs-6 mt-1">{{ statusLabel(currentPayout.status) }}</div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.payout-status") }}</strong>
                            <div class="fs-6 mt-1">
                              {{ payoutStatusLabel(currentPayout.payout_status) }}
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.method") }}</strong>
                            <div class="fs-6 mt-1">{{ currentPayout.method || "-" }}</div>
                          </div>
                        </div>
                      </div>

                      <div class="row g-3 mb-4">
                        <div v-if="currentPayout.method === 'paypal'" class="col-12">
                          <div class="details-box">
                            <strong>{{ t("global.paypal-account") }}</strong>
                            <div class="fs-6 mt-1">{{ currentPayout.paypal_account || "-" }}</div>
                          </div>
                        </div>
                        <template v-else>
                          <div class="col-md-6">
                            <div class="details-box">
                              <strong>{{ t("global.bank-name") }}</strong>
                              <div class="fs-6 mt-1">{{ currentPayout.bank_name || "-" }}</div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="details-box">
                              <strong>{{ t("global.name") }}</strong>
                              <div class="fs-6 mt-1">
                                {{
                                  currentPayout.bank_account_name ||
                                  currentPayout.account_name ||
                                  "-"
                                }}
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="details-box">
                              <strong>{{ t("global.country") }}</strong>
                              <div class="fs-6 mt-1">{{ currentPayout.country || "-" }}</div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="details-box">
                              <strong>{{ t("global.iban") }}</strong>
                              <div class="fs-6 mt-1">{{ currentPayout.iban || "-" }}</div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="details-box">
                              <strong>{{ t("global.swift-code") }}</strong>
                              <div class="fs-6 mt-1">{{ currentPayout.swift_code || "-" }}</div>
                            </div>
                          </div>
                        </template>
                        <div class="col-12">
                          <div class="details-box">
                            <strong>{{ t("global.notes") }}</strong>
                            <div class="fs-6 mt-1">
                              {{ currentPayout.note || currentPayout.notes || "-" }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <form
                        v-if="userType === 0"
                        class="border-top pt-4"
                        @submit.prevent="handleUpdate">
                        <h6 class="fw-bold mb-3">{{ t("global.update-payout") }}</h6>
                        <div class="mb-3">
                          <label for="updateStatus" class="form-label">
                            {{ t("global.update-status") }}
                          </label>
                          <select id="updateStatus" v-model="updateStatus" class="form-select">
                            <option value="R">{{ t("global.review") }}</option>
                            <option value="P">{{ t("global.paid") }}</option>
                          </select>
                        </div>
                        <div class="mb-4">
                          <label for="updateNotes" class="form-label">
                            {{ t("global.update-notes") }}
                          </label>
                          <textarea
                            id="updateNotes"
                            v-model="updateNotes"
                            class="form-control"
                            rows="3"></textarea>
                        </div>
                        <div class="d-flex flex-wrap gap-2 justify-content-end">
                          <button type="submit" class="btn btn-primary">
                            {{ t("global.update") }}
                          </button>
                          <button
                            v-if="canApproveCurrent"
                            type="button"
                            class="btn btn-success"
                            @click="approvePayout">
                            {{ t("global.approve") }}
                          </button>
                          <button
                            v-if="canTransferCurrent"
                            type="button"
                            class="btn btn-light-success"
                            @click="markPayoutTransferred(idCurrent)">
                            {{ t("global.mark-as-transferred") }}
                          </button>
                        </div>
                      </form>
                    </div>
                    <div v-else class="modal-body text-center text-muted py-8">
                      {{ t("global.no-payouts") }}
                    </div>
                  </div>
                </div>
              </div>
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
import {computed, defineComponent, onBeforeMount, provide, ref, watchEffect} from "vue"
import {useI18n} from "vue-i18n"
import {useStore} from "vuex"

export default defineComponent({
  name: "payout-list",
  components: {Toolbar, DataTable},

  setup() {
    const {t} = useI18n()
    const data = ref([])
    const loading = ref(false)
    const store = useStore()
    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type
    const header = ref([
      {
        columnName: t("global.amount"),
        columnLabel: "amount",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.status"),
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.payout-status"),
        columnLabel: "payout_status",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.payout-date"),
        columnLabel: "created_at",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 175
      }
    ])

    if (userType === 0) {
      header.value.unshift({
        columnName: t("global.tutor-name"),
        columnLabel: "tutor",
        sortEnabled: true,
        columnWidth: 175
      })
    }

    const updateStatus = ref("")
    const updateNotes = ref("")

    const tutorInfo = ref(null)

    const itemsTotal = ref(0)
    const idsSelected = ref([])
    const currentPage = ref(1)
    const lastPage = ref(1)
    const itemsPerPage = ref(0)
    const idCurrent = ref(null)
    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true

      axiosClient
        .get(`/payouts${queryString}`)
        .then((response) => {
          data.value = response.data.result.data
          itemsTotal.value = response.data.result.total
          currentPage.value = response.data.result.current_page
          lastPage.value = response.data.result.last_page
          itemsPerPage.value = response.data.result.per_page

          axiosClient
            .get("/tutor-statistics/tutor-info", {
              params: {user_id: userInfoObject.user.id}
            })
            .then((tutorResponses) => {
              tutorInfo.value = tutorResponses.data?.result || tutorResponses.data
            })
        })
        .catch((error) => {
          // Handle error here
          console.error(error)
        })
        .finally(() => {
          loading.value = false
        })
    }

    watchEffect(() => {
      if (idCurrent.value !== null) {
        const selectedPayout = data.value.find((payout) => payout.id === idCurrent.value)

        if (selectedPayout) {
          updateStatus.value = selectedPayout.status
          updateNotes.value = selectedPayout.note || selectedPayout.notes || ""
        }
      }
    })

    const currentPayout = computed(() => {
      if (idCurrent.value === null) return null
      return data.value.find((payout) => payout.id === idCurrent.value) || null
    })

    const canApproveCurrent = computed(() => {
      return userType === 0 && currentPayout.value && currentPayout.value.status !== "P"
    })

    const canTransferCurrent = computed(() => {
      return (
        userType === 0 &&
        currentPayout.value &&
        currentPayout.value.status === "P" &&
        currentPayout.value.payout_status !== "transferred"
      )
    })

    const currentSearchQuery = ref("")
    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      currentSearchQuery.value = e.target.value
      getDataTableBodyRows(`?q=${currentSearchQuery.value}`)
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)

    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows() // Make sure it's called in the correct context
    })

    const openModal = (id) => {
      idCurrent.value = id
      $("#payoutModal").modal("show")
    }

    const handleUpdate = () => {
      if (idCurrent.value !== null) {
        const updatedPayout = {
          id: idCurrent.value,
          status: updateStatus.value,
          note: updateNotes.value,
          notes: updateNotes.value
        }

        axiosClient
          .post(`/payouts/update/${idCurrent.value}`, updatedPayout)
          .then(() => {
            getDataTableBodyRows()
            $("#payoutModal").modal("hide")
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: t("global.errors-detected"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
          })
      }
    }

    const approvePayout = () => {
      if (!canApproveCurrent.value) return

      axiosClient
        .post(`/payouts/${idCurrent.value}/approve`)
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: resolveApiMessage(response.data.message),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
          getDataTableBodyRows()
          $("#payoutModal").modal("hide")
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            text: t("global.errors-detected"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })
        })
    }

    const markPayoutTransferred = (id) => {
      if (!id) return

      axiosClient
        .post(`/payouts/${id}/payout-status`, {payout_status: "transferred"})
        .then((response) => {
          Swal.fire({
            icon: "success",
            text: resolveApiMessage(response.data.message),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
          getDataTableBodyRows()
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            text: t("global.errors-detected"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })
        })
    }

    const statusLabel = (status) => {
      switch (status) {
        case "R":
          return t("global.under-review")
        case "P":
          return t("global.approved")
        default:
          return t("global.under-review")
      }
    }

    const payoutStatusLabel = (payoutStatus) => {
      return payoutStatus === "transferred"
        ? t("global.transferred")
        : t("global.in-transfer")
    }

    const resolveApiMessage = (message) => {
      if (!message) return t("global.thank-you")
      const translationKey = `global.${message}`
      const translated = t(translationKey)
      return translated !== translationKey ? translated : t("global.thank-you")
    }

    const formatDate = (value) => {
      if (!value) return "-"
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      return date.toLocaleDateString("en-GB")
    }

    return {
      statusLabel,
      t,
      loading,
      header,
      data,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      idCurrent,
      currentSearchQuery,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      updateStatus,
      updateNotes,
      openModal,
      handleUpdate,
      approvePayout,
      markPayoutTransferred,
      currentPayout,
      canApproveCurrent,
      canTransferCurrent,
      payoutStatusLabel,
      resolveApiMessage,
      formatDate,
      userType,
      tutorInfo,
      userInfoObject
    }
  }
})
</script>

<style scoped>
.payout-details-dialog {
  max-width: 720px;
}

.details-box {
  padding: 0.7rem 0.85rem;
  background: #f8fafc;
  border: 1px solid #e7edf3;
  border-radius: 0.65rem;
  min-height: 62px;
}

.details-box strong {
  color: #3f4254;
}
</style>
