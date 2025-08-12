<template>
  <toolbar :title="t('global.tutor-conferences-management')" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="card">
        <div class="nav nav-line-tabs">
          <template v-for="type in userTypes" :key="type">
            <li class="nav-item">
              <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
              <a
                class="nav-link p-3"
                :class="{active: selectedType === type}"
                @click="handleTabChange(type)">
                {{ type }}
              </a>
            </li>
          </template>
        </div>
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
              <label for="search-tutor-conferences" class="sr-only">
                {{ t("global.search-tutor-conferences") }}
              </label>
              <input
                id="search-tutor-conferences"
                type="text"
                name="search-conferences"
                :placeholder="t('global.search-tutor-conferences')"
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
                  {{ t("global.no-conferences") }}
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
              :header="selectedType === 'Postponed' ? postponedHeader : header"
              :checkbox-enabled="true"
              :page-current="currentPage"
              checkbox-label="id"
              :items-total="itemsTotal"
              :items-per-page="itemsPerPage"
              :items-per-page-dropdown-enabled="true"
              @on-sort="onSort"
              @on-items-select="onItemsSelect">
              <template #title="{row: conference}">
                <div class="d-flex align-items-center justify-content-start">
                  {{ conference.title }}
                </div>
              </template>

              <template v-if="selectedType !== 'Postponed'" #ref_type="{row: conference}">
                <span
                  class="badge fs-7 m-1"
                  :class="[
                    conference[['ref', 'type'].join('_')] === 1
                      ? 'badge-light-primary'
                      : 'badge-light-success'
                  ]">
                  {{
                    conference[["ref", "type"].join("_")] == 1
                      ? t("global.group-classes")
                      : t("global.our-courses")
                  }}
                </span>
              </template>

              <template #date="{row: conference}">
                {{ conference.date }}
              </template>

              <template v-if="selectedType !== 'Postponed'" #start_time="{row: conference}">
                {{ conference[["start", "time"].join("_")] }}
              </template>

              <template v-if="selectedType !== 'Postponed'" #end_time="{row: conference}">
                {{ conference[["end", "time"].join("_")] }}
              </template>

              <template #student="{row: conference}">
                <template v-if="conference.student && conference.student.avatar">
                  <div class="symbol symbol-circle symbol-45px overflow-hidden me-3">
                    <div class="symbol-label">
                      <img
                        :src="`${SERVER_PATH}/${conference.student.avatar}`"
                        :alt="`${conference.student.name}`"
                        class="w-100" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div
                    class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                    style="background: url('/src/assets/media/svg/files/blank-image.svg')">
                    <div class="symbol-label fs-3 bg-light-warning text-warning">
                      <template v-if="conference.student && conference.student.name">
                        {{ conference.student.name.charAt(0).toUpperCase() }}
                      </template>
                    </div>
                  </div>
                </template>
              </template>

              <template v-if="selectedType === 'Postponed'" #old_start_date="{row: conference}">
                {{ conference.old_start_date || t("global.not-available") }}
              </template>

              <template #actions="{row: conference}">
                <button
                  v-if="!conference.meet_url && !conference.is_end"
                  type="button"
                  aria-label="Create Link"
                  class="btn btn-icon btn-light-success me-2 publictooltip"
                  @click="getConferenceLink(conference.id)">
                  <span class="svg-icon svg-icon-primary">
                    <svg
                      v-if="loadingMeetUrl === conference.id"
                      id="L9"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 100 100"
                      enable-background="new 0 0 0 0"
                      xml:space="preserve"
                      style="width: 4rem; height: 4rem">
                      <path
                        fill="#fff"
                        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          dur="1s"
                          from="0 50 50"
                          to="360 50 50"
                          repeatCount="indefinite" />
                      </path>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style="width: 1.5rem; height: 1.5rem">
                      <rect x="2" y="6" rx="2" width="13" height="12" fill="currentColor" />
                      <path
                        d="M22,8.4142119 L22,15.5857848 C22,16.1380695 21.5522847,16.5857848 21,16.5857848 C20.7347833,16.5857848 20.4804293,16.4804278 20.2928929,16.2928912 L16.7071064,12.7071013 C16.3165823,12.3165768 16.3165826,11.6834118 16.7071071,11.2928877 L20.2928936,7.70710477 C20.683418,7.31658067 21.316583,7.31658098 21.7071071,7.70710546 C21.8946433,7.89464181 22,8.14899558 22,8.4142119 Z"
                        fill="currentColor"
                        opacity="0.5" />
                    </svg>
                  </span>
                <span class="publictooltiptext">{{ t("global.create_meeting") }}</span>
                </button>
                <a
                  v-if="conference.meet_url && !conference.is_end"
                  :href="conference.meet_url"
                  aria-label="Create Link"
                  target="_blank"
                  class="btn btn-icon btn-light-primary me-2">
                  <span class="svg-icon svg-icon-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style="width: 1.5rem; height: 1.5rem">
                      <rect x="2" y="6" rx="2" width="13" height="12" fill="currentColor" />
                      <path
                        d="M22,8.4142119 L22,15.5857848 C22,16.1380695 21.5522847,16.5857848 21,16.5857848 C20.7347833,16.5857848 20.4804293,16.4804278 20.2928929,16.2928912 L16.7071064,12.7071013 C16.3165823,12.3165768 16.3165826,11.6834118 16.7071071,11.2928877 L20.2928936,7.70710477 C20.683418,7.31658067 21.316583,7.31658098 21.7071071,7.70710546 C21.8946433,7.89464181 22,8.14899558 22,8.4142119 Z"
                        fill="currentColor"
                        opacity="0.5" />
                    </svg>
                  </span>
                </a>
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
import arraySort from "array-sort"
import {defineComponent, onBeforeMount, onMounted, provide, ref} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "tutor-conferences-detials",
  components: {Toolbar, DataTable},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const loadingMeetUrl = ref(null)

    // Regular header for Completed/Complaints tabs
    const header = ref([
      {columnName: t("global.title"), columnLabel: "title", sortEnabled: false, columnWidth: 200},
      {columnName: t("global.type"), columnLabel: "ref_type", sortEnabled: false, columnWidth: 150},
      {columnName: t("global.date"), columnLabel: "date", sortEnabled: false, columnWidth: 150},
      {
        columnName: t("global.start-time"),
        columnLabel: "start_time",
        sortEnabled: false,
        columnWidth: 150
      },
      {
        columnName: t("global.end-time"),
        columnLabel: "end_time",
        sortEnabled: false,
        columnWidth: 150
      },
      {
        columnName: t("global.student"),
        columnLabel: "student",
        sortEnabled: false,
        columnWidth: 150
      },
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 150
      }
    ])

    // Special header for Postponed tab
    const postponedHeader = ref([
      {columnName: t("global.title"), columnLabel: "title", sortEnabled: false, columnWidth: 200},
      {
        columnName: t("global.original-date"),
        columnLabel: "old_start_date",
        sortEnabled: false,
        columnWidth: 200
      },
      {
        columnName: t("global.new-date"),
        columnLabel: "date",
        sortEnabled: false,
        columnWidth: 200
      },
      {
        columnName: t("global.student"),
        columnLabel: "student",
        sortEnabled: false,
        columnWidth: 150
      },
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 150
      }
    ])

    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const initItems = ref([])
    const idsSelected = ref([])
    const userTypes = ["Completed", "Complaints", "Postponed"]
    const selectedType = ref("Completed")

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      const endpointMap = {
        Completed: "get-completed-conference",
        Complaints: "get-complaints-conference",
        Postponed: "get-postponed-conference"
      }

      const endpoint = endpointMap[selectedType.value]
      const url = `/tutor-statistics/${endpoint}`

      axiosClient
        .get(url)
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

    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      getDataTableBodyRows(`?${["q", e.target.value].join("=")}`)
    }

    const handleTabChange = function handleTabChange(type) {
      selectedType.value = type
      getDataTableBodyRows()
    }

    const onSort = function onSort(sort) {
      const reverse = sort.order === "ASC".toLowerCase()
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    const onItemsSelect = function onItemsSelect(itemsSelected) {
      if (itemsSelected.length === 0) idsSelected.value = []
      else idsSelected.value = [...idsSelected.value, ...itemsSelected]
    }

    const getConferenceLink = function getConferenceLink(id) {
      loadingMeetUrl.value = id
      axiosClient.get(`/conferences/create-tutor-link/${id}`).then((response) => {
        if (!response.data.success) {
          Swal.fire(response.data.message, "", "info")
          loadingMeetUrl.value = null
        } else if (response.data.result.response.status === "error") {
          Swal.fire(response.data.message, "", "info")
          loadingMeetUrl.value = null
        } else {
          window.open(response.data.result.start_url, "_blank")
          getDataTableBodyRows()
        }
        loadingMeetUrl.value = null
      })
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
    })

    onMounted(() => {
      initItems.value.splice(0, data.value.length, ...data.value)
    })

    return {
      SERVER_PATH,
      t,
      loading,
      header,
      postponedHeader,
      data,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      userTypes,
      selectedType,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      handleTabChange,
      onSort,
      onItemsSelect,
      getConferenceLink,
      loadingMeetUrl
    }
  }
})
</script>
