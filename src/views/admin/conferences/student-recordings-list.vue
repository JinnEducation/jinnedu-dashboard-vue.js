<template>
  <toolbar :title="t('global.student-recordings')" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <span class="svg-icon svg-icon-1 position-absolute ms-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <rect x="17" y="15" rx="1" width="8" height="2" transform="rotate(45 17 15)"
                    fill="currentColor" opacity="0.5" />
                  <path
                    d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                    fill="currentColor" />
                </svg>
              </span>
              <label for="search-student-recordings" class="sr-only">
                {{ t("global.search-student-conferences") }}
              </label>
              <input
                id="search-student-recordings"
                type="text"
                name="search-recordings"
                :placeholder="t('global.search-student-conferences')"
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
                <span>{{ t("global.no-recordings") }}</span>
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
              :checkbox-enabled="false"
              :items-total="itemsTotal"
              :page-current="currentPage"
              :items-per-page="itemsPerPage"
              :items-per-page-dropdown-enabled="true"
              @on-sort="onSort">
              <template #title="{ row: conference }">
                <div v-if="conference.ref_type === 1">
                  <a class="text-danger" :href="`${baseUrl}/group-class/${conference.group_class?.slug}`">
                    {{ conference.title }}
                  </a>
                </div>
                <div v-else class="d-flex align-items-center justify-content-start">
                  <a class="text-danger" :href="`${baseUrl}/tutors/${conference.tutor?.slug}`">
                    {{ conference.title }}
                  </a>
                </div>
              </template>
              <template #ref_type="{ row: conference }">
                <span
                  class="badge fs-7 m-1"
                  :class="[
                    conference[['ref', 'type'].join('_')] === 1
                      ? 'badge-light-primary'
                      : conference[['ref', 'type'].join('_')] === 2
                        ? 'badge-light-success'
                        : 'badge-light-warning'
                  ]">
                  {{
                    conference[['ref', 'type'].join('_')] === 1
                      ? 'Group Class'
                      : conference[['ref', 'type'].join('_')] === 2
                        ? 'Our Courses'
                        : 'Trial Lesson'
                  }}
                </span>
              </template>
              <template #date="{ row: conference }">
                {{ conference.date }}
              </template>
              <template #start_time="{ row: conference }">
                {{ conference[['start', 'time'].join('_')] }}
              </template>
              <template #end_time="{ row: conference }">
                {{ conference[['end', 'time'].join('_')] }}
              </template>
              <template #tutor="{ row: conference }">
                <template v-if="conference.tutor && conference.tutor?.avatar">
                  <div class="symbol symbol-circle symbol-45px overflow-hidden me-3">
                    <div class="symbol-label">
                      <img
                        :src="`${SERVER_PATH}/storage/${conference.tutor?.avatar}`"
                        :alt="`${conference.tutor?.name}`"
                        class="w-100" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <template v-if="conference.tutor && conference.tutor?.name">
                    <div
                      class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                      style="background: url('/src/assets/media/svg/files/blank-image.svg')"
                      :title="`${conference.tutor?.name}`">
                      <div class="symbol-label fs-3 bg-light-warning text-warning">
                        {{ conference.tutor?.name?.charAt(0)?.toUpperCase() || '' }}
                      </div>
                    </div>
                  </template>
                </template>
              </template>
              <template #actions="{ row: conference }">
                <a
                  v-if="getRecordingMediaUrl(conference.recordings)"
                  :href="getOpenVideoUrl(getRecordingMediaUrl(conference.recordings))"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-light-primary">
                  <i class="bi bi-play-circle me-1"></i>
                  {{ t("global.open_video") }}
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
import {getOpenVideoUrl} from "@/composables/useRecordingVideoUrl"
import arraySort from "array-sort"
import {defineComponent, onBeforeMount, ref} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "student-recordings-list",
  components: {Toolbar, DataTable},
  setup() {
    const {t} = useI18n()
    const baseUrl = import.meta.env.VITE_APP_BASE_URL
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const loading = ref(false)
    const header = ref([
      {
        columnName: t("global.conference_title"),
        columnLabel: "title",
        sortEnabled: false,
        columnWidth: 195
      },
      {columnName: t("global.type"), columnLabel: "ref_type", sortEnabled: false, columnWidth: 135},
      {columnName: t("global.date"), columnLabel: "date", sortEnabled: false, columnWidth: 135},
      {
        columnName: t("global.start-time"),
        columnLabel: "start_time",
        sortEnabled: false,
        columnWidth: 100
      },
      {
        columnName: t("global.end-time"),
        columnLabel: "end_time",
        sortEnabled: false,
        columnWidth: 100
      },
      {columnName: t("global.tutor"), columnLabel: "tutor", sortEnabled: false, columnWidth: 135},
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

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/conference-recordings/conferences-with-recording${queryString}`)
        .then((response) => {
          const result = response.data?.result ?? response.data
          data.value = result?.data ?? result ?? []
          itemsTotal.value = result?.total ?? data.value.length
          currentPage.value = result?.current_page ?? 1
          itemsPerPage.value = result?.per_page ?? 10
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

    const getRecordingMediaUrl = (recordings) => {
      if (!recordings) return null
      const first = Array.isArray(recordings) ? recordings[0] : recordings
      return first?.media_url ?? null
    }

    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
    })

    return {
      t,
      loading,
      header,
      data,
      itemsTotal,
      currentPage,
      itemsPerPage,
      baseUrl,
      SERVER_PATH,
      getOpenVideoUrl,
      getRecordingMediaUrl,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      onSort
    }
  }
})
</script>
