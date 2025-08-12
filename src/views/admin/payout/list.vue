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
                      <div class="d-flex flex-wrap">
                        <div
                          class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                          <div class="d-flex align-items-center">
                            <div class="fs-2 fw-bold">{{ tutorInfo.balance }}</div>
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
                              data-kt-countup="true"
                              data-kt-countup-value="75">
                              {{ tutorInfo.withdraw_amount }}
                            </div>
                          </div>
                          <div class="fw-semibold fs-6 text-gray-500">
                            {{ t("global.withdraw-amount") }}
                          </div>
                        </div>
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

                <template #transfer="{row: payout}">
                  <button
                    v-if="payout.method === 'paypal'"
                    type="button"
                    aria-label="Update"
                    class="btn btn-light-primary me-2 p-2"
                    @click="transferModal(payout.id)">
                    {{ t("global.transfer") }}
                  </button>
                </template>

                <template #paypal_status="{row: payout}">
                  <span v-if="payout.method === 'paypal'">{{ payout.paypal_status }}</span>
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
                    v-if="userType === 0"
                    type="button"
                    aria-label="Update"
                    class="btn btn-light-success me-2 p-2"
                    @click="openUpdateModal(payout.id)">
                    {{ t("global.update") }}
                  </button>
                </template>
              </data-table>

              <div
                id="payoutTransferModal"
                class="modal fade"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 id="exampleModalLabel" class="modal-title">
                        {{ t("global.payout-transfer") }}
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div v-if="idCurrent !== null">
                        <template
                          v-if="data.find((payout) => payout.id === idCurrent).method === 'paypal'">
                          <p>
                            {{ t("global.are-you-sure-to-transfer") }}
                            {{ data.find((payout) => payout.id === idCurrent).amount }}
                            {{ t("global.to-this-tutor-paypal-account") }}:
                            {{ data.find((payout) => payout.id === idCurrent).paypal_account }} ?
                          </p>
                        </template>
                        <button
                          type="button"
                          aria-label="Update"
                          class="btn btn-light-success me-2 p-2"
                          @click="
                            transferPayout(data.find((payout) => payout.id === idCurrent).id)
                          ">
                          {{ t("global.transfer") }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="payoutModal"
                class="modal fade"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 id="exampleModalLabel" class="modal-title">
                        {{ t("global.payout-details") }}
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <!-- Display detailed payout information here -->
                      <div v-if="idCurrent !== null">
                        <h4>
                          Tutor Name :
                          {{ data.find((payout) => payout.id === idCurrent).tutor.name }}
                        </h4>
                        <p>{{ t("global.amount") }} : {{ data.find((payout) => payout.id === idCurrent).amount }}</p>
                        <p>
                          {{ t("global.status") }}:
                          {{
                            data.find((payout) => payout.id === idCurrent).status === "R"
                              ? t("global.review")
                              : data.find((payout) => payout.id === idCurrent).status === "P"
                              ? t("global.paid")
                              : t("global.need-to-review")
                          }}
                        </p>
                        <p>{{ t("global.method") }} : {{ data.find((payout) => payout.id === idCurrent).method }}</p>

                        <template
                          v-if="data.find((payout) => payout.id === idCurrent).method === 'paypal'">
                          <p>
                            {{ t("global.paypal-account") }}:
                            {{ data.find((payout) => payout.id === idCurrent).paypal_account }}
                          </p>
                        </template>
                        <template v-else>
                          <p>
                            {{ t("global.bank-name") }}:
                            {{ data.find((payout) => payout.id === idCurrent).bank_name }}
                          </p>
                          <p>
                            {{ t("global.account-number") }}:
                            {{ data.find((payout) => payout.id === idCurrent).account_no }}
                          </p>
                        </template>

                        <p>{{ t("global.notes") }} : {{ data.find((payout) => payout.id === idCurrent).notes }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                id="updateModal"
                class="modal fade"
                tabindex="-1"
                aria-labelledby="updateModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <!-- Modal Header, Title, Close Button -->
                    <div class="modal-header">
                      <h5 id="updateModalLabel" class="modal-title">
                        {{ t("global.update-payout") }}
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
                    </div>
                    <!-- Modal Body -->
                    <div class="modal-body">
                      <form @submit.prevent="handleUpdate">
                        <!-- Update Form Fields -->
                        <div class="mb-3">
                          <label for="updateStatus" class="form-label">
                            {{ t("global.update-status") }}
                          </label>
                          <select id="updateStatus" v-model="updateStatus" class="form-select">
                            <option value="R">{{ t("global.review") }}</option>
                            <option value="P">{{ t("global.paid") }}</option>
                          </select>
                        </div>
                        <div class="mb-3">
                          <label for="updateNotes" class="form-label">
                            {{ t("global.update-notes") }}
                          </label>
                          <textarea
                            id="updateNotes"
                            v-model="updateNotes"
                            class="form-control"></textarea>
                        </div>
                        <!-- Update Button -->
                        <button type="submit" class="btn btn-primary">
                          {{ t("global.update") }}
                        </button>
                      </form>
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
import {defineComponent, onBeforeMount, onMounted, provide, ref, watchEffect} from "vue"
import {useI18n} from "vue-i18n"
import {useRouter} from "vue-router"
import {useStore} from "vuex"

export default defineComponent({
  name: "payout-list",
  components: {Toolbar, DataTable},

  setup() {
    const {t} = useI18n()
    const data = ref([])
    const loading = ref(false)
    const router = useRouter()
    const store = useStore()
    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type
    const header = ref([
      {
        columnName: t("global.tutor-name"),
        columnLabel: "tutor",
        sortEnabled: true,
        columnWidth: 175
      },
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
        columnName: t("global.paypal-status"),
        columnLabel: "paypal_status",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.transfer"),
        columnLabel: "transfer",
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

    const updateAmount = ref("")
    const updateStatus = ref("")
    const updateNotes = ref("")

    const tutorInfo = ref(null)

    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
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
              tutorInfo.value = tutorResponses.data
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
          // Set the values based on the selected payout
          updateStatus.value = selectedPayout.status
          updateNotes.value = selectedPayout.note
        }
      }
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

    onMounted(() => {})

    const openModal = (id) => {
      // Set the idCurrent to the selected payout id
      idCurrent.value = id

      // Open the Bootstrap modal using jQuery or other methods
      $("#payoutModal").modal("show")
    }

    const transferPayout = (id) => {
      const payoutToTransfer = data.value.find((payout) => payout.id === id)

      if (payoutToTransfer) {
        axiosClient
          .post(`/payouts/${id}/transfer`)
          .then((response) => {
            // Handle success

            if (response.data.success) {
              Swal.fire({
                icon: "success",
                text: response.data.message,
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
              getDataTableBodyRows()
            }

            if (response.data["msg-code"] === "222") {
              Swal.fire({
                icon: "error",
                text: response.data.message,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            } else if (response.data["msg-code"] === "223") {
              Swal.fire({
                icon: "error",
                text: response.data.message,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            } else if (response.data["msg-code"] === "224") {
              Swal.fire({
                icon: "error",
                text: response.data.message,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            }
          })
          .catch((error) => {
            console.error(error)
            // Handle error
          })
      } else {
        console.error("Payout not found")
      }
    }

    const transferModal = (id) => {
      idCurrent.value = id
      $("#payoutTransferModal").modal("show")
    }

    const openUpdateModal = (id) => {
      idCurrent.value = id
      $("#updateModal").modal("show")
    }

    const handleUpdate = () => {
      // Implement your update logic here
      if (idCurrent.value !== null) {
        // For example, update the amount for the current payout
        const updatedPayout = {
          id: idCurrent.value,
          // amount: updateAmount.value,
          status: updateStatus.value,
          notes: updateNotes.value
        }

        // Make an API call to update the payout
        axiosClient
          .post(`/payouts/update/${idCurrent.value}`, updatedPayout)
          .then((response) => {
            // Handle success, e.g., show a success message
            // Swal.fire("Success", "Payout updated successfully", "success");
            // Close the update modal
            $("#updateModal").modal("hide")
            getDataTableBodyRows()
          })
          .catch((error) => {
            // Handle error, e.g., show an error message
            Swal.fire("Error", "Failed to update payout", "error")
          })
      }
    }

    const statusLabel = (status) => {
      switch (status) {
        case "R":
          return t("global.review")
        case "P":
          return t("global.paid")
        default:
          return t("global.need-to-review")
      }
    }

    return {
      SERVER_PATH,
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
      updateAmount,
      updateStatus,
      updateNotes,
      router,
      openModal,
      transferModal,
      openUpdateModal,
      handleUpdate,
      userType,
      tutorInfo,
      transferPayout
    }
  }
})
</script>
