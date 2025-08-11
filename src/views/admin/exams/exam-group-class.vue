<template>
  <toolbar :title="t('global.exams-management')" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <!-- Search Bar -->
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
              <label for="search-exams" class="sr-only">{{ t("global.search-exams") }}</label>
              <input
                id="search-exams"
                type="text"
                name="search-exams"
                :placeholder="t('global.search-exams')"
                class="form-control form-control-solid w-250px ps-14"
                @keyup.enter="searchDataTableBodyRows" />
            </div>
          </div>

          <!-- Toolbar Buttons -->
          <div class="card-toolbar">
            <div class="d-flex justify-content-end">
              <router-link :to="`/dashboard/exams/create`" class="btn btn-primary">
                <span class="svg-icon svg-icon-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none">
                    <rect
                      x="11"
                      y="20"
                      rx="1"
                      width="16"
                      height="2"
                      transform="rotate(-90 11 20)"
                      fill="currentColor"
                      opacity="0.5" />
                    <rect x="4" y="11" rx="1" width="16" height="2" fill="currentColor" />
                  </svg>
                </span>
                {{ t("global.add-button") }} {{ t("global.exams") }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- Data Table Content -->
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
          <!-- No Exams Message -->
          <div class="card-body p-0">
            <div class="card-px text-center py-20 my-10">
              <h2 class="fs-2x fw-bold mb-10">{{ t("global.welcome") }}</h2>
              <p class="text-gray-400 fs-5 fw-semibold mb-13">{{ t("global.no-exams") }}</p>
              <router-link
                v-show="abilities.create"
                :to="`/dashboard/exams/create`"
                class="btn btn-primary er fs-6 px-8 py-4">
                {{ t("global.add-button") }} {{ t("global.exams") }}
              </router-link>
            </div>
            <div class="text-center px-5">
              <img
                src="@/assets/media/illustrations/welcome.png"
                :alt="`Add Exams Illustration`"
                class="mw-100 mh-300px" />
            </div>
          </div>
        </template>

        <template v-else>
          <!-- Data Table -->
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
              <template #title="{row: groupClass}">
                <!-- {{ exam.langs.find((element) => element.language_id === 1)?.title }} -->
                {{ groupClass.name }}
              </template>
              <template #actions="{row: groupClass}">
                <router-link
                  :to="`/dashboard/exams/index/${groupClass.id}`"
                  aria-label="Update"
                  class="btn btn-icon btn-light-success edittooltip me-2">
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
                  <span class="edittooltiptext">{{ t("global.edit") }}</span>
                </router-link>
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
import {computed, onBeforeMount, defineComponent, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute} from "vue-router"

export default defineComponent({
  name: "contents-list",
  components: {Toolbar, DataTable},
  setup() {
    const route = useRoute()
    const abilities = ref({index: false, create: false, edit: false, destroy: false, show: false})
    const {t} = useI18n()
    const loading = ref(false)
    const header = ref([
      {columnName: t("global.title"), columnLabel: "title", sortEnabled: true, columnWidth: 175},
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 175
      }
    ])
    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)

    // Fetches exams data
    const getDataTableBodyRows = (queryString = "") => {
      loading.value = true
      axiosClient
        .get(`/exams/group-class${queryString}`)
        .then((response) => {
          const {result} = response.data
          data.value = result.data
          itemsTotal.value = result.total
          currentPage.value = result.current_page
          itemsPerPage.value = result.per_page
        })
        .finally(() => (loading.value = false))
    }

    const currentSearchQuery = ref("")
    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      currentSearchQuery.value = e.target.value
      getDataTableBodyRows(`?q=${currentSearchQuery.value}`)
    }

    // Handles sorting of data
    const onSort = (sort) => {
      const reverse = sort.order === "ASC" ? 1 : -1
      data.value.sort((a, b) => (a[sort.column] > b[sort.column] ? 1 : -1) * reverse)
    }

    // Delete an exam by ID
    const deleteExam = (id) => {
      axiosClient.delete(`/exams/${id}`).then(() => getDataTableBodyRows())
    }

    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
    })

    return {
      t,
      route,
      abilities,
      loading,
      header,
      data,
      itemsTotal,
      currentPage,
      itemsPerPage,
      currentSearchQuery,
      searchDataTableBodyRows,
      onSort,
      deleteExam
    }
  }
})
</script>
