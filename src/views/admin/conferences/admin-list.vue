<!-- DONE REVIEWING: NEW -->
<template>
  <toolbar :title="t('global.admin-conferences-management')" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="card">
        <div class="nav nav-line-tabs">
          <template v-for="type in orderTypes" :key="type">
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
            <div class="d-flex align-items-center position-relative my-1" style="gap: 20px">
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
              <label for="search-admin-conferences" class="sr-only">
                {{ t("global.search-admin-conferences") }}
              </label>
              <input
                id="search-admin-conferences"
                type="text"
                name="search-conferences"
                :placeholder="t('global.search-admin-conferences')"
                data-kt-item-table-filter="search"
                class="form-control form-control-solid w-250px ps-14"
                @keyup.enter="searchDataTableBodyRows" />
              <el-form-item prop="tutorId" class="el-width mb-0">
                <el-select
                  v-model="selectedTutor"
                  :name="`group-class-tutor`"
                  :placeholder="t('global.search-by-tutor')"
                  :remote-method="tutorRemoteMethod"
                  remote-show-suffix
                  remote
                  filterable
                  clearable
                  @change="searchByTutor">
                  <el-option
                    v-for="tutor in tutors"
                    :key="tutor.id"
                    :value="tutor.id"
                    :label="tutor.name" />
                </el-select>
              </el-form-item>
              <button
                type="button"
                aria-label="clear"
                class="btn btn-icon btn-light-danger p-5"
                @click="clearSearch">
                {{ t("global.clear") }}
              </button>
            </div>
          </div>
        </div>
        <template v-if="loading">
          <div class="card-body p-0">
            <div class="card-px text-center py-20 my-10">
              <div role="status" class="spinner-border text-primary">
                <span class="visually-hidden">{{ t("global.loading") }}</span>
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
            <template v-for="type in orderTypes" :key="type">
              <div
                :id="`${type.toLowerCase().replace(/\s/g, '-')}-tab-content`"
                class="tab-pane"
                :class="{active: selectedType === type}">
                <data-table
                  v-if="selectedType === type"
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
                  <template #id="{row: conference}">
                    {{ data.indexOf(conference) + 1 }}
                  </template>
                  <template #title="{row: conference}">
                    <div class="d-flex align-items-center justify-content-start">
                      {{ conference.title }}
                    </div>
                  </template>
                  <template #ref_type="{row: conference}">
                    <span
                      class="badge fs-7 m-1"
                      :class="[
                        conference[['ref', 'type'].join('_')] === 1
                          ? 'badge-light-primary'
                          : 'badge-light-success'
                      ]">
                      {{
                        conference[["ref", "type"].join("_")] === 1
                          ? "Group Class"
                          : conference[["ref", "type"].join("_")] === 3
                          ? "Trial Lesson"
                          : conference[["ref", "type"].join("_")] === 4
                          ? "Private Lesson"
                          : conference[["ref", "type"].join("_")] === 5
                          ? "Top Up"
                          : conference[["ref", "type"].join("_")] === 6
                          ? "Refund"
                          : conference[["ref", "type"].join("_")] === 7
                          ? "Package"
                          : "Other"
                      }}
                    </span>
                  </template>
                  <template #date="{row: conference}">
                    {{ conference.date }}
                  </template>
                  <template #start_time="{row: conference}">
                    {{ conference[["start", "time"].join("_")] }}
                  </template>
                  <template #end_time="{row: conference}">
                    {{ conference[["end", "time"].join("_")] }}
                  </template>
                  <template #tutor="{row: conference}">
                    <template v-if="conference.tutor && conference.tutor.avatar">
                      <div class="symbol symbol-circle symbol-45px overflow-hidden me-3">
                        <div class="symbol-label">
                          <img
                            :src="`${SERVER_PATH}/${conference.tutor.avatar}`"
                            :alt="`${conference.tutor.name}`"
                            :title="`${conference.tutor.name}`"
                            class="w-100" />
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <template v-if="conference.tutor && conference.tutor.name">
                        <div
                          class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                          style="background: url('/src/assets/media/svg/files/blank-image.svg')"
                          :title="`${conference.tutor.name}`">
                          <div class="symbol-label fs-3 bg-light-warning text-warning">
                            {{ conference.tutor.name.charAt(0).toUpperCase() }}
                          </div>
                        </div>
                      </template>
                    </template>
                  </template>
                  <template #student="{row: conference}">
                    <template v-if="conference.ref_type === 1">
                      <template v-if="conference.students && conference.students.length > 0">
                        <template v-for="(student, index) in conference.students" :key="index">
                          <template v-if="student.avatar">
                            <div class="symbol symbol-circle symbol-45px overflow-hidden me-3">
                              <div class="symbol-label">
                                <img
                                  :src="`${SERVER_PATH}/${student.avatar}`"
                                  :alt="`${student.name}`"
                                  :title="`${student.name}`"
                                  class="w-100" />
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div
                              class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                              style="
                                background: url('/src/assets/media/svg/files/blank-image.svg');
                              ">
                              <div class="symbol-label fs-3 bg-light-warning text-warning">
                                {{ student.name.charAt(0).toUpperCase() }}
                              </div>
                            </div>
                          </template>
                        </template>
                      </template>
                      <template v-else>
                        <div>
                          {{ t("global.there-are-no-students") }}
                        </div>
                      </template>
                    </template>
                    <!-- <template v-else>
                      <template v-if="conference.students.avatar">
                        <div class="symbol symbol-circle symbol-45px overflow-hidden me-3">
                          <div class="symbol-label">
                            <img
                              :src="`${SERVER_PATH}/${conference.students.avatar}`"
                              :alt="`${conference.students.name}`"
                              :title="`${conference.students.name}`"
                              class="w-100" />
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                          style="background: url('/src/assets/media/svg/files/blank-image.svg')">
                          <div class="symbol-label fs-3 bg-light-warning text-warning">
                            {{ conference.students.name?.charAt(0).toUpperCase() }}
                          </div>
                        </div>
                      </template>
                    </template> -->
                  </template>

                  <template #status="{row: conference}">
                    {{
                      (conference.student_change_date || conference.tutor_change_date) == 1
                        ? "Postponed"
                        : "Active"
                    }}
                    <br />
                  </template>
                  <template
                    v-if="abilities.createTutorLink || abilities.destroy"
                    #actions="{row: conference}">
                    <!-- <button
                  v-show="abilities.createTutorLink"
                  type="button"
                  aria-label="Create Link"
                  class="btn btn-icon btn-light-success me-2"
                  @click="getConferenceLink(conference.id)">
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
                </button> -->
                    <button
                      v-show="abilities.destroy"
                      type="button"
                      aria-label="Delete"
                      class="btn btn-icon btn-light-danger"
                      @click="deleteItem(conference.id)">
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
  name: "admin-conferences",
  components: {Toolbar, DataTable},
  setup() {
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const route = useRoute()
    const path = computed(() => route.path)
    const abilities = ref({
      index: false,
      create: false,
      edit: false,
      destroy: false,
      show: false,
      createTutorLink: false
    })

    const orderTypes = [
      "Group Class",
      "Trial Lesson",
      "Private Lesson"
      // "Top Up",
      // "Refund",
      // "Package"
      // "Other"
    ]
    const orderTypeIndices = {
      "Group Class": 1,
      "Trial Lesson": 3,
      "Private Lesson": 4
      // "Top Up": 5,
      // "Refund": 6,
      // "Package": 7
      // "Other": -1 // Set a default value in case the selected type is not found
    }
    const selectedType = ref("Group Class") // Default selected type

    const {t} = useI18n()
    const loading = ref(false)
    const header = ref([
      {columnName: "#", columnLabel: "id", sortEnabled: false, columnWidth: 75},
      {columnName: t("global.title"), columnLabel: "title", sortEnabled: false, columnWidth: 100},
      {columnName: t("global.type"), columnLabel: "ref_type", sortEnabled: false, columnWidth: 100},
      {columnName: t("global.date"), columnLabel: "date", sortEnabled: false, columnWidth: 100},
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
      {columnName: t("global.tutor"), columnLabel: "tutor", sortEnabled: false, columnWidth: 100},
      {
        columnName: t("global.students"),
        columnLabel: "student",
        sortEnabled: false,
        columnWidth: 100
      },

      {
        columnName: t("global.status"),
        columnLabel: "status",
        sortEnabled: false,
        columnWidth: 100
      }
    ])

    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const initItems = ref([])
    const idsSelected = ref([])
    const selectedTutor = ref("")
    const selectedRefType = ref("")
    const tutors = ref([])
    const selectOptions = ref([
      {label: "Group Class", value: 1},
      {label: "Trial Lesson", value: 3},
      {label: "Private Lesson", value: 4},
      {label: "Package", value: 7}
    ])

    // get tutors
    const tutorRemoteMethod = function tutorRemoteMethod(query) {
      axiosClient.get(`/users?q=${query}&type=2`).then((response) => {
        tutors.value = response.data.result.data
      })
    }

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      // Include the selected tutor ID in the query string if it's not empty

      // const query = selectedTutor.value
      //   ? `&tutor_id=${selectedTutor.value}&ref_type=${refType}`
      //   : ""
      const type = orderTypeIndices[selectedType.value]
      const url = `/conferences/admin-index${queryString}${queryString ? "&" : "?"}&tutor_id=${
        selectedTutor.value
      }&ref_type=${type}`
      loading.value = true
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

    const handleTabChange = function handleTabChange(type) {
      // Get the corresponding index for the selected type
      // const selectedIndex = orderTypeIndices[type]
      // Call getDataTableBodyRows with the selectedIndex
      // getDataTableBodyRows(`?ref_type=${selectedIndex}`)
      // Update the selectedType
      selectedType.value = type
      getDataTableBodyRows()
    }

    const clearSearch = () => {
      getDataTableBodyRows("?ref_type=1") // Call your method to get all data
      selectedTutor.value = "" // Clear selected tutor
      selectedRefType.value = "" // Clear selected refType
    }

    const currentSearchQuery = ref("")
    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      currentSearchQuery.value = e.target.value
      getDataTableBodyRows(`?q=${currentSearchQuery.value}`)
    }

    const searchByTutor = function searchByTutor(e) {
      getDataTableBodyRows(["?", ["tutor_id", e].join("=")].join(""))
    }

    const searchByRefType = function searchByRefType(e) {
      getDataTableBodyRows(["?", ["ref_type", e].join("=")].join(""))
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
          axiosClient.delete(`/conferences/delete/${id}`).then(() => {
            getDataTableBodyRows()
          })
        }
      })
    }

    const getConferenceLink = function getConferenceLink(id) {
      axiosClient.get(`/conferences/create-tutor-link/${id}`).then((response) => {
        const link = JSON.parse(response.data.result.response)
        Swal.fire({
          icon: "success",
          html: `<textarea cols="30" rows="5" id="conference-launch-url">${
            link[["launch", "url"].join("")]
          }</textarea>`,
          showCancelButton: true,
          confirmButtonText: t("global.yes-copy"),
          cancelButtonText: t("global.go-back"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-success", cancelButton: "btn btn-success-light"}
        }).then((result) => {
          if (result.isConfirmed) {
            const conferenceLaunchURL = document.querySelector("#conference-launch-url")
            conferenceLaunchURL.select()
            conferenceLaunchURL.setSelectionRange(0, 99999)
            document.execCommand("copy")
          }
        })
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
      orderTypes,
      selectedType,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      abilities,
      currentSearchQuery,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      onSort,
      onItemsSelect,
      getConferenceLink,
      deleteItem,
      deleteFewItems,
      searchByTutor,
      searchByRefType,
      tutorRemoteMethod,
      tutors,
      clearSearch,
      selectOptions,
      selectedRefType,
      selectedTutor,
      handleTabChange
    }
  }
})
</script>
