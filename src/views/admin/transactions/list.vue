<template>
  <div>
    <toolbar :title="t('global.transactions-management')" />
    <add-transaction-modal
      ref="addTransactionModal"
      :id-current="idCurrent"
      @after-on-submit="getDataTableBodyRows" />
    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="card">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <div class="d-flex align-items-center position-relative my-1">
                <span class="svg-icon svg-icon-1 position-absolute ms-6"> </span>
                <label for="search-transactions" class="sr-only">
                  {{ t("global.search-transactions") }}
                </label>
                <input
                  id="search-transactions"
                  type="text"
                  name="search-transactions"
                  :placeholder="t('global.search-transactions')"
                  data-kt-word-table-filter="search"
                  class="form-control form-control-solid w-250px ps-14"
                  @keyup.enter="searchDataTableBodyRows" />
              </div>
            </div>
            <div class="card-toolbar">
              <div data-kt-word-table-toolbar="base" class="d-flex justify-content-end">
                <button type="button" class="btn btn-primary" @click="showAddModal">
                  <span class="svg-icon svg-icon-2"> </span>
                  {{ t("global.add-button") }} {{ t("global.transactions") }}
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
                  <span>
                    {{ t("global.no-transactions") }}
                  </span>
                </p>
                <button
                  type="button"
                  class="btn btn-primary er fs-6 px-8 py-4"
                  @click="showAddModal">
                  {{ t("global.add-button") }} {{ t("global.transaction") }}
                </button>
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
                :checkbox-enabled="true"
                checkbox-label="id"
                :items-total="itemsTotal"
                :page-current="currentPage"
                :items-per-page="itemsPerPage"
                :items-per-page-dropdown-enabled="true"
                @on-sort="onSort"
                @on-items-select="onItemsSelect">
                <template #user="{row: transaction}">
                  {{ transaction.user.name }}
                </template>
                <template #amount="{row: transaction}">
                  {{ transaction.amount }}
                </template>
                <template #type="{row: transaction}">
                  <span :class="transaction.type === 'credit' ? 'text-green' : 'text-red'">
                    <i
                      :class="
                        transaction.type === 'credit' ? 'arrow-up-icon' : 'arrow-down-icon'
                      "></i>
                    {{ transaction.type }}
                  </span>
                </template>

                <template #actions="{row: transaction}">
                  <button
                    type="button"
                    aria-label="Update"
                    class="btn btn-icon btn-light-success me-2"
                    @click="showUpdateModal(transaction.id)">
                    <span class="svg-icon svg-icon-success">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        style="width: 1.5rem; height: 1.5rem">
                        <path
                          d="M3,16 L5,16 C5.55228475,16 6,15.5522847 6,15 C6,14.4477153 5.55228475,14 5,14 L3,14 L3,12 L5,12 C5.55228475,12 6,11.5522847 6,11 C6,10.4477153 5.55228475,10 5,10 L3,10 L3,8 L5,8 C5.55228475,8 6,7.55228475 6,7 C6,6.44771525 5.55228475,6 5,6 L3,6 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 C10.5522847,3 11,3.44771525 11,4 L11,19 C11,19.5522847 10.5522847,20 10,20 L4,20 C3.44771525,20 3,19.5522847 3,19 L3,16 Z"
                          fill="currentColor"
                          opacity="0.5" />
                        <path
                          d="M16,3 L19,3 C20.1045695,3 21,3.8954305 21,5 L21,15.2485298 C21,15.7329761 20.8241635,16.200956 20.5051534,16.565539 L17.8762883,19.5699562 C17.6944473,19.7777745 17.378566,19.7988332 17.1707477,19.6169922 C17.1540423,19.602375 17.1383289,19.5866616 17.1237117,19.5699562 L14.4948466,16.565539 C14.1758365,16.200956 14,15.7329761 14,15.2485298 L14,5 C14,3.8954305 14.8954305,3 16,3 Z"
                          fill="currentColor" />
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Delete"
                    class="btn btn-icon btn-light-danger"
                    @click="deleteForbiddenWord(transaction.id)">
                    <span class="svg-icon svg-icon-danger">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        style="width: 1.5rem; height: 1.5rem">
                        <path
                          d="M6,8 L18,8 L17.106535,19.6150447 C17.04642,20.3965405 16.3947578,21 15.6109533,21 L8.38904671,21 C7.60524225,21 6.95358004,20.3965405 6.89346498,19.6150447 L6,8 Z M8,10 L8.45438229,14.0894406 L15.5517885,14.0339036 L16,10 L8,10 Z"
                          fill="currentColor"
                          fill-rule="nonzero" />
                        <path
                          d="M14,4.5 L14,3.5 C14,3.22385763 13.7761424,3 13.5,3 L10.5,3 C10.2238576,3 10,3.22385763 10,3.5 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z"
                          fill="currentColor"
                          opacity="0.5" />
                      </svg>
                    </span>
                  </button>
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
import AddTransactionModal from "@/views/admin/transactions/add-transaction-modal.vue"
import axiosClient from "@/plugins/axios"
import arraySort from "array-sort"
import {defineComponent, onBeforeMount, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import {showModal} from "@/core/helpers/dom"

export default defineComponent({
  name: "forbidden-words",
  components: {Toolbar, AddTransactionModal, DataTable},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const words = ref({word: "", status: false}) // Define the words ref here
    const header = ref([
      {
        columnName: t("global.user"),
        columnLabel: "user",
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
        columnName: t("global.type"),
        columnLabel: "type",
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

    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const idsSelected = ref([])
    const addTransactionModal = ref(null)
    const idCurrent = ref(null)

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/wallet/get-transactions${queryString}`)
        .then((response) => {
          data.value = response.data.result.data
          currentPage.value = response.data.result.current_page
          itemsPerPage.value = response.data.result.per_page
          //         itemsTotal.value = response.data.result.total;
        })
        .finally(() => {
          loading.value = false
        })
    }

    const currentSearchQuery = ref("")
    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      currentSearchQuery.value = e.target.value
      getDataTableBodyRows(`?q=${currentSearchQuery.value}`)
    }


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

    const showAddModal = function showAddModal() {
      idCurrent.value = null
      showModal(addTransactionModal.value.addTransactionModal.modal)
    }

    const showUpdateModal = function showUpdateModal(id) {
      idCurrent.value = id
      showModal(addTransactionModal.value.addTransactionModal.modal)
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    provide("words", words) // Provide the words ref

    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
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
      addTransactionModal,
      idCurrent,
      words,
      currentSearchQuery,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      onSort,
      onItemsSelect,
      // updateForbiddenWord,
      deleteForbiddenWord,
      deleteFewForbiddenWords,
      showAddModal,
      showUpdateModal
    }
  }
})
</script>

<style>
.text-green {
  color: rgb(68, 220, 68);
}

.text-red {
  color: red;
}

.arrow-up-icon::before {
  content: "⬆️"; /* Or use a specific icon font class */
}

.arrow-down-icon::before {
  content: "⬇️";
}
</style>