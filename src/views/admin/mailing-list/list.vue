<template>
  <div>
    <toolbar :title="t('global.mailing-list-management')" />
    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="card">
          <div class="card-header border-0 pt-6">
            <div class="card-title">
              <div class="d-flex align-items-center position-relative my-1">
                <span class="svg-icon svg-icon-1 position-absolute ms-6"> </span>
                <label for="search-words" class="sr-only">
                  {{ t("global.search-mailing-list") }}
                </label>
                <input
                  id="search-words"
                  type="text"
                  name="search-words"
                  :placeholder="t('global.search-mailing-list')"
                  data-kt-word-table-filter="search"
                  class="form-control form-control-solid w-250px ps-14"
                  @keyup.enter="searchDataTableBodyRows" />
              </div>
            </div>
          </div>
          <template v-if="loading">
            <div class="card-body p-0">
              <div class="card-px text-center py-20 my-10">
                <div role="status" class="spinner-border text-primary">
                  <span class="visually-hidden">{{ t("global.loading") }} ...</span>
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
                    {{ t("global.no-mailing-list") }}
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
                :checkbox-enabled="true"
                checkbox-label="id"
                :items-total="itemsTotal"
                :page-current="currentPage"
                :items-per-page="itemsPerPage"
                :items-per-page-dropdown-enabled="true"
                @on-sort="onSort"
                @on-items-select="onItemsSelect">
                <template #email="{row: mailingItem}">
                  {{ mailingItem.email }}
                </template>
                <template #actions="{row: mailingItem}">
                  <button
                    type="button"
                    aria-label="Delete"
                    class="btn btn-icon btn-light-danger"
                    @click="deleteMailingItem(mailingItem.id)">
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
import AddForbiddenWordModal from "@/components/admin/modals/forms/add-forbidden-word-modal.vue"
import axiosClient from "@/plugins/axios"
import arraySort from "array-sort"
import {defineComponent, onBeforeMount, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import {showModal} from "@/core/helpers/dom"

export default defineComponent({
  name: "forbidden-words",
  components: {Toolbar, AddForbiddenWordModal, DataTable},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const words = ref({word: "", status: false}) // Define the words ref here
    const header = ref([
      {
        columnName: t("global.email"),
        columnLabel: "email",
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
    const idCurrent = ref(null)

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/mailing-list${queryString}`)
        .then((response) => {
          data.value = response.data.data
          currentPage.value = response.data.current_page
          itemsPerPage.value = response.data.per_page
        })
        .finally(() => {
          loading.value = false
        })
    }

    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      getDataTableBodyRows(`?${["q", e.target.value].join("=")}`)
    }

    const onSort = function onSort(sort) {
      const reverse = sort.order === "ASC".toLowerCase()
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    const onItemsSelect = function onItemsSelect(itemsSelected) {
      if (itemsSelected.length === 0) idsSelected.value = []
      else idsSelected.value = [...idsSelected.value, ...itemsSelected]
    }

    const deleteMailingItem = function deleteMailingItem(id) {
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
          axiosClient.delete(`/mailing-list/${id}`).then(() => {
            getDataTableBodyRows()
          })
        }
      })
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
      idCurrent,
      words,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      onSort,
      onItemsSelect,
      deleteMailingItem,
    }
  }
})
</script>
