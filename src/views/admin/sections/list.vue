<!-- DONE REVIEWING: NEW -->
<template>
  <toolbar :title="t(`global.${section}`)" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
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
              <label for="search-sections" class="sr-only">{{ t("global.search-sections") }}</label>
              <input
                id="search-sections"
                type="text"
                name="search-sections"
                :placeholder="t('global.search') + ' ' + t(`global.${section}`)"
                data-kt-section-table-filter="search"
                class="form-control form-control-solid w-250px ps-14"
                @keyup.enter="searchDataTableBodyRows" />
            </div>
          </div>
          <div class="card-toolbar">
            <div data-kt-section-table-toolbar="base" class="d-flex justify-content-end">
              <router-link :to="`/dashboard/sections/${section}/add`" class="btn btn-primary">
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
                {{ t("global.add-button") }} {{ t(`global.${section}`) }}
              </router-link>
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
                  {{ t("global.no-sections") }}
                </span>
              </p>
              <router-link
                :to="`/dashboard/sections/${section}/add`"
                class="btn btn-primary er fs-6 px-8 py-4">
                {{ t("global.add-button") }} {{ t(`global.${section}`) }}
              </router-link>
            </div>
            <div class="text-center px-5">
              <img
                src="@/assets/media/illustrations/welcome.png"
                :alt="`Add ${section} Illustration`"
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
              :query-string="currentSearchQuery"
              @on-sort="onSort"
              @on-items-select="onItemsSelect">
              <template #name="{row: sectionRow}">
                {{ sectionRow.name }}
                {{ section === "categories" ? `(${sectionRow.type})` : "" }}
              </template>
              <template #title="{row: sectionRow}">
                {{
                  sectionRow.langs.find((lang) => Number(lang.language_id) === Number(languageId))
                    ?.title
                }}
              </template>
              <template #actions="{row: sectionRow}">
                <router-link
                  :to="`/dashboard/sections/${section}/update/${sectionRow.id}`"
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
                <button
                  type="button"
                  aria-label="Delete"
                  class="btn btn-icon btn-light-danger deletetooltip"
                  @click="deleteSection(sectionRow.id)">
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
                  <span class="deletetooltiptext">{{ t("global.delete") }}</span>
                </button>
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
import {defineComponent, onBeforeMount, onMounted, provide, ref, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useStore} from "vuex"
import {onBeforeRouteUpdate, useRoute} from "vue-router"

export default defineComponent({
  name: "sections-list",
  components: {Toolbar, DataTable},
  setup() {
    const route = useRoute()
    const {t} = useI18n()
    const section = ref(route.params.section)
    const loading = ref(false)
    const store = useStore()
    const languages = computed(() => store.state.languages)
    const languageId = ref(null)
    const lang = languages.value.find((element) => element.shortname === store.state.language)
    languageId.value = lang ? lang.id : null

    const header = ref([
      {
        columnName: t("global.name"),
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.title"),
        columnLabel: "title",
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

    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const initSections = ref([])
    const idsSelected = ref([])

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/${section.value}${queryString}`)
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

    const deleteSection = function deleteSection(id) {
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
          axiosClient.delete(`/${section.value}/delete/${id}`).then(() => {
            Swal.fire({
              icon: "success",
              text: t("global.section-delete-successfully"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-primary"}
            })
            getDataTableBodyRows()
          })
        }
      })
    }

    const deleteFewSections = function deleteFewSections() {
      idsSelected.value.forEach((item) => {
        deleteSection(item)
      })

      idsSelected.value.length = 0
    }

    const onSort = function onSort(sort) {
      const reverse = sort.order === "ASC".toLowerCase()
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    const onItemsSelect = function onItemsSelect(itemsSelected) {
      if (itemsSelected.length === 0) idsSelected.value = []
      else idsSelected.value = [...idsSelected.value, ...itemsSelected]
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    onBeforeRouteUpdate(async (to) => {
      section.value = to.params.section
      header.value = [
        {
          columnName: t(`global.${section.value}-name`),
          columnLabel: "name",
          sortEnabled: true,
          columnWidth: 175
        },
        {
          columnName: t(`global.${section.value}-title`),
          columnLabel: "title",
          sortEnabled: true,
          columnWidth: 175
        },
        {
          columnName: t("global.actions"),
          columnLabel: "actions",
          sortEnabled: false,
          columnWidth: 175
        }
      ]

      data.value = []
      loading.value = false
      getDataTableBodyRows()
    })

    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
    })

    onMounted(() => {
      initSections.value.splice(0, data.value.length, ...data.value)
    })

    return {
      t,
      section,
      loading,
      header,
      data,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      currentSearchQuery,
      searchDataTableBodyRows,
      onSort,
      onItemsSelect,
      deleteSection,
      deleteFewSections,
      languageId
    }
  }
})
</script>
