<template>
  <div>
    <toolbar :title="t('global.balance-report')" />

    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="card mb-5 mb-xl-10 report-hero-card">
          <div class="card-body p-5 p-lg-7">
            <div class="row g-5 align-items-stretch">
              <div class="col-12 col-xl-5">
                <div class="report-profile-card h-100">
                  <div
                    v-if="profileAvatar"
                    class="report-avatar symbol symbol-90px symbol-circle overflow-hidden border border-gray-300 flex-shrink-0">
                    <img :src="profileAvatar" :alt="profileName" class="w-100 h-100" />
                  </div>
                  <div
                    v-else
                    class="report-avatar symbol symbol-90px symbol-circle bg-light-warning text-warning border border-gray-300 flex-shrink-0">
                    <span class="fw-bold fs-2">{{ profileName.charAt(0).toUpperCase() }}</span>
                  </div>

                  <div class="min-w-0">
                    <div class="fs-3 fw-bold text-gray-900 mb-2 text-break">{{ profileName }}</div>
                    <div class="text-gray-600 fs-6 mb-2 text-break">{{ profileEmail }}</div>
                    <div class="d-flex flex-column gap-1">
                      <div class="text-gray-500 fs-7 text-break">
                        <span class="fw-semibold text-gray-700">{{ t("global.phone") }}:</span>
                        {{ profilePhone }}
                      </div>
                      <div class="text-gray-500 fs-7 text-break">
                        <span class="fw-semibold text-gray-700">{{ t("global.country") }}:</span>
                        {{ profileCountry }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-xl-7">
                <div class="row g-3">
                  <div class="col-12 col-sm-6">
                    <div class="report-metric-card">
                      <div class="fs-2 fw-bold text-gray-900">{{ tutorInfo.balance || 0 }}</div>
                      <div class="fw-semibold fs-7 text-gray-500">{{ t("global.balance") }}</div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="report-metric-card">
                      <div class="fs-2 fw-bold text-gray-900">{{ tutorInfo.pending_balance || 0 }}</div>
                      <div class="fw-semibold fs-7 text-gray-500">{{ t("global.pending-balance") }}</div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="report-metric-card">
                      <div class="fs-2 fw-bold text-gray-900">{{ tutorInfo.requested_balance || 0 }}</div>
                      <div class="fw-semibold fs-7 text-gray-500">{{ t("global.requested-balance") }}</div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="report-metric-card">
                      <div class="fs-2 fw-bold text-gray-900">{{ tutorInfo.withdraw_amount || 0 }}</div>
                      <div class="fw-semibold fs-7 text-gray-500">{{ t("global.withdraw-amount") }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header border-0 pt-6">
            <div class="card-title d-flex flex-wrap gap-3 w-100">
              <div class="d-flex align-items-center position-relative my-1">
                <label for="search-balance-report" class="sr-only">
                  {{ t("global.search-tutor-finances") }}
                </label>
                <input
                  id="search-balance-report"
                  type="text"
                  name="search-balance-report"
                  :placeholder="t('global.search-tutor-finances')"
                  class="form-control form-control-solid w-250px"
                  @keyup.enter="searchDataTableBodyRows" />
              </div>

              <div class="d-flex align-items-center my-1">
                <label for="finance-type-filter" class="sr-only">
                  {{ t("global.type") }}
                </label>
                <select
                  id="finance-type-filter"
                  v-model="selectedRefType"
                  class="form-select form-select-solid w-200px"
                  @change="onFilterChange">
                  <option value="">{{ t("global.all") }}</option>
                  <option value="1">{{ t("global.group-classes") }}</option>
                  <option value="4">{{ t("global.private-classes") }}</option>
                  <option value="2">{{ t("global.courses") }}</option>
                </select>
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
                  <span>{{ t("global.no-tutor-finances") }}</span>
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
                <template #ref_type="{row: tutorFinance}">
                  {{ financeTypeLabel(tutorFinance.ref_type) }}
                </template>

                <template #name="{row: tutorFinance}">
                  {{ financeReferenceName(tutorFinance) }}
                </template>

                <template #total="{row: tutorFinance}">
                  {{ money(tutorFinance.total) }}
                </template>

                <template #percentage="{row: tutorFinance}">
                  {{ tutorFinance.percentage }}%
                </template>

                <template #fee="{row: tutorFinance}">
                  {{ money(tutorFinance.fee) }}
                </template>

                <template #class_date="{row: tutorFinance}">
                  {{ formatDateTime(tutorFinance.class_date || tutorFinance.created_at) }}
                </template>

                <template #status="{row: tutorFinance}">
                  <span>{{ statusLabel(tutorFinance.status) }}</span>
                </template>

                <template #actions="{row: tutorFinance}">
                  <button
                    type="button"
                    aria-label="Show Details"
                    class="btn btn-light-info me-2 p-2"
                    @click="openModal(tutorFinance.id)">
                    {{ t("global.show-details") }}
                  </button>
                </template>
              </data-table>

              <div id="financeDetailsModal" class="modal fade" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered payout-details-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">{{ t("global.tutor-finance-details") }}</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div v-if="currentFinance" class="modal-body">
                      <div class="row g-3 border-bottom pb-4 mb-4">
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.ref_type") }}</strong>
                            <div class="fs-6 mt-1">{{ financeTypeLabel(currentFinance.ref_type) }}</div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.name") }}</strong>
                            <div class="fs-6 mt-1">{{ financeReferenceName(currentFinance) }}</div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.status") }}</strong>
                            <div class="fs-6 mt-1">{{ statusLabel(currentFinance.status) }}</div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.total") }}</strong>
                            <div class="fs-6 mt-1">{{ money(currentFinance.total) }}</div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.percentage") }}</strong>
                            <div class="fs-6 mt-1">{{ currentFinance.percentage }}%</div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.amount") }}</strong>
                            <div class="fs-6 mt-1 text-success">{{ money(currentFinance.fee) }}</div>
                          </div>
                        </div>
                        <div class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.date") }}</strong>
                            <div class="fs-6 mt-1">
                              {{ formatDateTime(currentFinance.class_date || currentFinance.created_at) }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row g-3">
                        <div
                          v-if="currentFinance.date?.start_date_time"
                          class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.start_date_time") }}</strong>
                            <div class="fs-6 mt-1">
                              {{ formatDateTime(currentFinance.date?.start_date_time) }}
                            </div>
                          </div>
                        </div>

                        <div
                          v-if="currentFinance.date?.end_date_time"
                          class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.end_date_time") }}</strong>
                            <div class="fs-6 mt-1">
                              {{ formatDateTime(currentFinance.date?.end_date_time) }}
                            </div>
                          </div>
                        </div>

                        <div
                          v-if="currentFinance.group_class?.classes"
                          class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.classes") }}</strong>
                            <div class="fs-6 mt-1">{{ currentFinance.group_class?.classes }}</div>
                          </div>
                        </div>

                        <div
                          v-if="currentFinance.group_class?.total_classes_length"
                          class="col-md-6 col-lg-4">
                          <div class="details-box">
                            <strong>{{ t("global.total_classes") }}</strong>
                            <div class="fs-6 mt-1">
                              {{ currentFinance.group_class?.total_classes_length }}
                            </div>
                          </div>
                        </div>

                        <div class="col-12" v-if="currentFinance.note">
                          <div class="details-box">
                            <strong>{{ t("global.notes") }}</strong>
                            <div class="fs-6 mt-1">{{ currentFinance.note }}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-else class="modal-body text-center text-muted py-8">
                      {{ t("global.no-tutor-finances") }}
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
import arraySort from "array-sort"
import {computed, defineComponent, onBeforeMount, ref, watch} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"

export default defineComponent({
  name: "balance-report",
  components: {Toolbar, DataTable},
  setup() {
    const {t} = useI18n()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const loading = ref(false)
    const data = ref([])
    const tutorInfo = ref({})
    const profile = ref(null)

    const itemsTotal = ref(0)
    const currentPage = ref(1)
    const itemsPerPage = ref(0)
    const idCurrent = ref(null)

    const selectedRefType = ref("")
    const currentSearchQuery = ref("")

    const effectiveTutorId = ref(null)

    const parsedUserInfo = (() => {
      try {
        return JSON.parse(store.state.userInfo || "{}")
      } catch {
        return {}
      }
    })()

    const currentUserId = Number(parsedUserInfo?.user?.id || 0)
    const userType = Number(parsedUserInfo?.user?.type)
    const requestedTutorId = computed(() => Number(route.params.id || 0))

    const header = ref([
      {
        columnName: t("global.type"),
        columnLabel: "ref_type",
        sortEnabled: true,
        columnWidth: 140
      },
      {
        columnName: t("global.name"),
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 220
      },
      {
        columnName: t("global.total"),
        columnLabel: "total",
        sortEnabled: true,
        columnWidth: 140
      },
      {
        columnName: t("global.percentage"),
        columnLabel: "percentage",
        sortEnabled: true,
        columnWidth: 120
      },
      {
        columnName: t("global.amount"),
        columnLabel: "fee",
        sortEnabled: true,
        columnWidth: 140
      },
      {
        columnName: t("global.date"),
        columnLabel: "class_date",
        sortEnabled: true,
        columnWidth: 160
      },
      {
        columnName: t("global.status"),
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 120
      },
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 150
      }
    ])

    const about = computed(() => profile.value?.abouts?.[0] || null)

    const profileName = computed(() => {
      if (profile.value?.full_name) return profile.value.full_name
      const firstName = about.value?.first_name || ""
      const lastName = about.value?.last_name || ""
      const full = `${firstName} ${lastName}`.trim()
      return full || profile.value?.name || "-"
    })

    const profileEmail = computed(() => profile.value?.email || "-")
    const profilePhone = computed(() => about.value?.phone || about.value?.contact_number || "-")
    const profileCountry = computed(() => about.value?.country?.name || "-")
    const profileAvatar = computed(() => {
      const avatar = profile.value?.avatar
      if (!avatar) return ""
      if (avatar.startsWith("http")) return avatar

      const serverPath = import.meta.env.VITE_APP_SERVER_BASE_URL || ""
      if (avatar.startsWith("/storage/")) {
        return `${serverPath}${avatar.replace(/^\//, "")}`
      }

      return `${serverPath}storage/${avatar}`
    })

    const currentFinance = computed(() => {
      if (idCurrent.value === null) return null
      return data.value.find((item) => item.id === idCurrent.value) || null
    })

    const money = (value) => `${Number(value || 0)} $`

    const formatDateTime = (value) => {
      if (!value) return "-"
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      return date.toLocaleString("en-GB")
    }

    const financeTypeLabel = (refType) => {
      switch (Number(refType)) {
        case 1:
          return t("global.group-classes")
        case 2:
          return t("global.courses")
        case 4:
          return t("global.private-classes")
        default:
          return "-"
      }
    }

    const financeReferenceName = (item) => {
      if (Number(item?.ref_type) === 1) {
        return item?.group_class?.name || t("global.group-classes")
      }
      if (Number(item?.ref_type) === 2) {
        return item?.course?.name || item?.course?.title || t("global.courses")
      }
      if (Number(item?.ref_type) === 4) {
        return item?.date?.start_date_time
          ? `${t("global.private-classes")} - ${formatDateTime(item.date.start_date_time)}`
          : t("global.private-classes")
      }
      return "-"
    }

    const statusLabel = (status) => {
      switch (status) {
        case "pending":
          return t("global.review")
        case "transferred":
          return t("global.paid")
        case "rejected":
          return t("global.rejected")
        default:
          return t("global.need-to-review")
      }
    }

    const showError = () => {
      Swal.fire({
        icon: "error",
        text: t("global.errors-detected"),
        confirmButtonText: t("global.got-it"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-danger"}
      })
    }

    const resolveAccess = async () => {
      if (userType === 1 || !currentUserId) {
        router.push({name: "index"})
        return false
      }

      if (userType === 2) {
        effectiveTutorId.value = currentUserId
        if (requestedTutorId.value !== currentUserId) {
          router.replace({
            name: "accounting-balance-report",
            params: {id: currentUserId}
          })
        }
      } else if (userType === 0) {
        if (!requestedTutorId.value) {
          router.push({name: "index"})
          return false
        }
        effectiveTutorId.value = requestedTutorId.value
      } else {
        router.push({name: "index"})
        return false
      }

      try {
        const response = await axiosClient.get("/profile", {
          params: {user_id: effectiveTutorId.value}
        })
        const targetProfile = response?.data?.result
        if (!targetProfile || Number(targetProfile.type) !== 2) {
          router.push({name: "index"})
          return false
        }

        profile.value = targetProfile
      } catch {
        router.push({name: "index"})
        return false
      }

      return true
    }

    const fetchTutorInfo = async () => {
      const response = await axiosClient.get("/tutor-statistics/tutor-info", {
        params: {user_id: effectiveTutorId.value}
      })
      tutorInfo.value = response?.data || {}
    }

    const getDataTableBodyRows = async () => {
      loading.value = true
      try {
        const params = {
          tutor_id: effectiveTutorId.value
        }

        if (selectedRefType.value) {
          params.ref_type = selectedRefType.value
        }

        if (currentSearchQuery.value) {
          params.q = currentSearchQuery.value
        }

        const response = await axiosClient.get("/tutor-finance", {params})
        data.value = response?.data?.result?.data || []
        itemsTotal.value = response?.data?.result?.total || 0
        currentPage.value = response?.data?.result?.current_page || 1
        itemsPerPage.value = response?.data?.result?.per_page || 0
      } catch {
        showError()
      } finally {
        loading.value = false
      }
    }

    const initializePage = async () => {
      const canProceed = await resolveAccess()
      if (!canProceed) return

      try {
        await Promise.all([fetchTutorInfo(), getDataTableBodyRows()])
      } catch {
        showError()
      }
    }

    const onFilterChange = () => {
      getDataTableBodyRows()
    }

    const searchDataTableBodyRows = (e) => {
      currentSearchQuery.value = e.target.value
      getDataTableBodyRows()
    }

    const onSort = (sort) => {
      const reverse = sort.order === "asc"
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    const openModal = (id) => {
      idCurrent.value = id
      $("#financeDetailsModal").modal("show")
    }

    watch(
      () => route.params.id,
      () => {
        if (userType === 0) {
          initializePage()
        }
      }
    )

    onBeforeMount(() => {
      initializePage()
    })

    return {
      t,
      loading,
      data,
      header,
      itemsTotal,
      currentPage,
      itemsPerPage,
      selectedRefType,
      currentSearchQuery,
      tutorInfo,
      profileName,
      profileEmail,
      profilePhone,
      profileCountry,
      profileAvatar,
      currentFinance,
      money,
      financeTypeLabel,
      financeReferenceName,
      statusLabel,
      formatDateTime,
      searchDataTableBodyRows,
      onFilterChange,
      onSort,
      openModal
    }
  }
})
</script>

<style scoped>
.payout-details-dialog {
  max-width: 780px;
}

.report-hero-card {
  overflow: hidden;
}

.report-profile-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e7edf3;
  border-radius: 0.75rem;
  background: #f8fafc;
}

.report-avatar {
  width: 90px;
  height: 90px;
}

.report-avatar img {
  object-fit: cover;
}

.report-metric-card {
  height: 100%;
  padding: 0.9rem 1rem;
  border: 1px dashed #cfd8e3;
  border-radius: 0.75rem;
  background: #fff;
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

@media (max-width: 576px) {
  .report-profile-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
