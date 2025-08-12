<!-- DONE REVIEWING: NEW -->
<template>
  <toolbar :title="t('global.my-orders-management')" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <span class="svg-icon svg-icon-1 position-absolute ms-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none">
                  <rect
                    x="17"
                    y="15"
                    rx="1"
                    width="8"
                    height="2"
                    transform="rotate(45 17 15)"
                    fill="currentColor"
                    opacity="0.5" />
                  <path
                    d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                    fill="currentColor" />
                </svg>
              </span>
              <label for="search-orders" class="sr-only">
                {{ t("global.search-my-orders") }}
                </label>
              <input
                id="search-orders"
                type="text"
                name="search-orders"
                :placeholder="t('global.search-my-orders')"
                data-kt-item-table-filter="search"
                class="form-control form-control-solid w-250px ps-14"
                @keyup.enter="searchDataTableBodyRows" />
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
                  {{ t("global.no-orders") }}
                </span>
              </p>
            </div>
            <div class="text-center px-5"></div>
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
              :query-string="currentSearchQuery"
              @on-sort="onSort"
              @on-items-select="onItemsSelect">
              <template #type="{row: order}">
                <span
                  class="badge fs-7 m-1"
                  :class="[
                    order[['ref', 'type'].join('_')] === 1
                      ? 'badge-light-primary'
                      : 'badge-light-success'
                  ]">
                  {{
                    order[["ref", "type"].join("_")] === 1
                      ? t("global.group-class")
                      : order[["ref", "type"].join("_")] === 3
                      ? t("global.trial-lesson")
                      : order[["ref", "type"].join("_")] === 4
                      ? t("global.private-lesson")
                      : order[["ref", "type"].join("_")] === 7
                      ? t("global.package")
                      : t("global.other")
                  }}
                </span>
              </template>
              <template #status="{row: order}">
                <span
                  class="badge fs-7 m-1"
                  :class="[
                    order.status === 0
                      ? 'badge-light-warning'
                      : order.status === 1
                      ? 'badge-light-primary'
                      : order.status === 2
                      ? 'badge-light-danger'
                      : ''
                  ]">
                  {{ order.status == 1 ? t("global.approved") : order.status == 2 ? 
                  t("global.failed") : t("global.waiting") }}
                </span>
              </template>
              <template #price="{row: order}">
                <div class="d-flex align-items-center justify-content-start">
                  {{ order.price }}
                </div>
              </template>

              <template #actions="{row: order}">
                <button
                  v-show="abilities.destroy"
                  type="button"
                  aria-label="Delete"
                  class="btn btn-icon btn-light-danger"
                  @click="deleteItem(order.id)">
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

                <!--                <button-->
                <!--                  v-if="!order.meet_url && !order.is_end"-->
                <!--                  type="button"-->
                <!--                  aria-label="Create Link"-->
                <!--                  class="btn btn-icon btn-light-success me-2"-->
                <!--                  @click="getConferenceLink(order.id)">-->
                <!--                  <span class="svg-icon svg-icon-primary">-->
                <!--                    <svg-->
                <!--                      v-if="loadingMeetUrl === order.id"-->
                <!--                      id="L9"-->
                <!--                      version="1.1"-->
                <!--                      xmlns="http://www.w3.org/2000/svg"-->
                <!--                      xmlns:xlink="http://www.w3.org/1999/xlink"-->
                <!--                      x="0px"-->
                <!--                      y="0px"-->
                <!--                      viewBox="0 0 100 100"-->
                <!--                      enable-background="new 0 0 0 0"-->
                <!--                      xml:space="preserve"-->
                <!--                      style="width: 4rem; height: 4rem">-->
                <!--                      <path-->
                <!--                        fill="#fff"-->
                <!--                        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">-->
                <!--                        <animateTransform-->
                <!--                          attributeName="transform"-->
                <!--                          attributeType="XML"-->
                <!--                          type="rotate"-->
                <!--                          dur="1s"-->
                <!--                          from="0 50 50"-->
                <!--                          to="360 50 50"-->
                <!--                          repeatCount="indefinite" />-->
                <!--                      </path>-->
                <!--                    </svg>-->
                <!--                    <svg-->
                <!--                      v-else-->
                <!--                      xmlns="http://www.w3.org/2000/svg"-->
                <!--                      viewBox="0 0 24 24"-->
                <!--                      style="width: 1.5rem; height: 1.5rem">-->
                <!--                      <rect x="2" y="6" rx="2" width="13" height="12" fill="currentColor" />-->
                <!--                      <path-->
                <!--                        d="M22,8.4142119 L22,15.5857848 C22,16.1380695 21.5522847,16.5857848 21,16.5857848 C20.7347833,16.5857848 20.4804293,16.4804278 20.2928929,16.2928912 L16.7071064,12.7071013 C16.3165823,12.3165768 16.3165826,11.6834118 16.7071071,11.2928877 L20.2928936,7.70710477 C20.683418,7.31658067 21.316583,7.31658098 21.7071071,7.70710546 C21.8946433,7.89464181 22,8.14899558 22,8.4142119 Z"-->
                <!--                        fill="currentColor"-->
                <!--                        opacity="0.5" />-->
                <!--                    </svg>-->
                <!--                  </span>-->
                <!--                </button>-->
                <!--                <a-->
                <!--                  v-if="order.meet_url && !order.is_end"-->
                <!--                  :href="order.meet_url"-->
                <!--                  aria-label="Create Link"-->
                <!--                  target="_blank"-->
                <!--                  class="btn btn-icon btn-light-primary me-2">-->
                <!--                  <span class="svg-icon svg-icon-primary">-->
                <!--                    <svg-->
                <!--                      xmlns="http://www.w3.org/2000/svg"-->
                <!--                      viewBox="0 0 24 24"-->
                <!--                      style="width: 1.5rem; height: 1.5rem">-->
                <!--                      <rect x="2" y="6" rx="2" width="13" height="12" fill="currentColor" />-->
                <!--                      <path-->
                <!--                        d="M22,8.4142119 L22,15.5857848 C22,16.1380695 21.5522847,16.5857848 21,16.5857848 C20.7347833,16.5857848 20.4804293,16.4804278 20.2928929,16.2928912 L16.7071064,12.7071013 C16.3165823,12.3165768 16.3165826,11.6834118 16.7071071,11.2928877 L20.2928936,7.70710477 C20.683418,7.31658067 21.316583,7.31658098 21.7071071,7.70710546 C21.8946433,7.89464181 22,8.14899558 22,8.4142119 Z"-->
                <!--                        fill="currentColor"-->
                <!--                        opacity="0.5" />-->
                <!--                    </svg>-->
                <!--                  </span>-->
                <!--                </a>-->

                <!--                <button-->
                <!--                  v-show="order"-->
                <!--                  type="button"-->
                <!--                  class="btn btn-icon btn-light-success me-2"-->
                <!--                  @click.prevent="openMeeting(order.id)">-->
                <!--                  <span class="svg-icon svg-icon-primary">-->
                <!--                    <svg-->
                <!--                      xmlns="http://www.w3.org/2000/svg"-->
                <!--                      viewBox="0 0 24 24"-->
                <!--                      style="width: 1.5rem; height: 1.5rem">-->
                <!--                      <rect x="2" y="6" rx="2" width="13" height="12" fill="currentColor" />-->
                <!--                      <path-->
                <!--                        d="M22,8.4142119 L22,15.5857848 C22,16.1380695 21.5522847,16.5857848 21,16.5857848 C20.7347833,16.5857848 20.4804293,16.4804278 20.2928929,16.2928912 L16.7071064,12.7071013 C16.3165823,12.3165768 16.3165826,11.6834118 16.7071071,11.2928877 L20.2928936,7.70710477 C20.683418,7.31658067 21.316583,7.31658098 21.7071071,7.70710546 C21.8946433,7.89464181 22,8.14899558 22,8.4142119 Z"-->
                <!--                        fill="currentColor"-->
                <!--                        opacity="0.5" />-->
                <!--                    </svg>-->
                <!--                  </span>-->
                <!--                </button>-->
              </template>
            </data-table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import DataTable from "@/components/admin/data-table/index.vue"
import axiosClient from "@/plugins/axios"
import getMenuAbilities from "@/plugins/get-menu-abilities"
import arraySort from "array-sort"
import {computed, defineComponent, onBeforeMount, onMounted, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute} from "vue-router"

export default defineComponent({
  name: "my-orders",
  components: {Toolbar, DataTable},
  setup() {
    const route = useRoute()
    const loadingMeetUrl = ref(null)

    const path = computed(() => route.path)
    const abilities = ref({
      edit: false,
      create: false,
      index: false,
      show: false,
      destroy: false,
      createStudentLink: false,
      createTutorLink: false
    })

    const {t} = useI18n()
    const loading = ref(false)
    const header = ref([
      {columnName: t("global.type"), columnLabel: "type", sortEnabled: true, columnWidth: 150},
      {columnName: t("global.status"), columnLabel: "status", sortEnabled: true, columnWidth: 150},
      {columnName: t("global.price"), columnLabel: "price", sortEnabled: true, columnWidth: 150},
      // {columnName: t("global.user"), columnLabel: "user", sortEnabled: true, columnWidth: 150},
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 150
      }
    ])

    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const initItems = ref([])
    const idsSelected = ref([])
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)

    const openMeeting = function openMeeting(id) {
      axiosClient.get(`/conferences/create-tutor-link/${id}`).then((response) => {
        // eslint-disable-next-line no-console
      })
    }

    const getConferenceLink = function getConferenceLink(id) {
      loadingMeetUrl.value = id
      axiosClient.get(`/conferences/create-student-link/${id}`).then((response) => {
        if (!response.data.success) {
          Swal.fire(response.data.message, "", "info")
          loadingMeetUrl.value = null
        } else {
          window.open(response.data.result.meet_url, "_blank")
          // eslint-disable-next-line no-use-before-define
          getDataTableBodyRows()
        }
        loadingMeetUrl.value = null
      })
    }

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/orders/my-index${queryString}`)
        .then((response) => {
          data.value = response.data.result.data
          itemsTotal.value = response.data.result.total
          currentPage.value = response.data.result.current_page
          itemsPerPage.value = response.data.result.per_page
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

    const deleteItem = function deleteItem(id) {
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
          axiosClient.delete(`/orders/delete/${id}`).then(() => {
            getDataTableBodyRows()
          })
        }
      })
    }

    const deleteFewItems = function deleteFewItems() {
      idsSelected.value.forEach((item) => {
        deleteItem(item)
      })

      idsSelected.value.length = 0
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
      getMenuAbilities(path.value, abilities)
    })

    onMounted(() => {
      initItems.value.splice(0, data.value.length, ...data.value)
    })

    return {
      SERVER_PATH,
      t,
      loading,
      header,
      data,
      abilities,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      currentSearchQuery,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      onSort,
      onItemsSelect,
      deleteItem,
      deleteFewItems,
      openMeeting,
      loadingMeetUrl,
      getConferenceLink
    }
  }
})
</script>
