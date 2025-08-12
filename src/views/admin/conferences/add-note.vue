<!-- DONE REVIEWING: 23/06/2023 -->
<template>
  <toolbar title="Conference Add Note" />
  <add-note-modal
    ref="addNoteModal"
    :id-current="idCurrent"
    :conference-current="conferenceCurrent"
    @after-on-submit="getDataTableBodyRows" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <information-card :id-current="conference" :is-admin="abilities.adminIndex" />
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
              <label for="search-notes" class="sr-only">{{ t("global.search-notes") }}</label>
              <input
                id="search-notes"
                type="text"
                name="search-notes"
                :placeholder="t('global.search-notes')"
                data-kt-notes-table-filter="search"
                class="form-control form-control-solid w-250px ps-14"
                @keyup.enter="searchDataTableBodyRows" />
            </div>
          </div>
          <div class="card-toolbar">
            <div data-kt-note-table-toolbar="base" class="d-flex justify-content-end">
              <button type="button" class="btn btn-primary" @click="showAddModal">
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
                {{ t("global.add-button") }} {{ t("global.note") }}
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
                  {{ t("global.no-notes") }}
                </span>
              </p>
              <button type="button" class="btn btn-primary er fs-6 px-8 py-4" @click="showAddModal">
                {{ t("global.add-button") }} {{ t("global.note") }}
              </button>
            </div>
            <div class="text-center px-5">
              <img
                src="@/assets/media/illustrations/welcome.png"
                :alt="`Add Notes Illustration`"
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
              :items-per-page-dropdown-enabled="true"
              @on-sort="onSort"
              @on-items-select="onItemsSelect">
              <template #name="{row: note}">
                {{ note.note }}
              </template>
              <template #actions="{row: note}">
                <!-- <router-link
                  :to="`/server${note.path}`"
                  aria-label="Delete"
                  class="btn btn-icon btn-light-success me-2">
                  <span class="svg-icon svg-icon-success">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <path
                          d="M2,13 C2,12.5 2.5,12 3,12 C3.5,12 4,12.5 4,13 C4,13.3333333 4,15 4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 C2,15 2,13.3333333 2,13 Z"
                          fill="currentColor"
                          fill-rule="nonzero"
                          opacity="0.5" />
                        <rect
                          x="11"
                          y="1"
                          rx="1"
                          width="2"
                          height="14"
                          transform="translate(12, 8) rotate(-180) translate(-12, -8)"
                          fill="currentColor"
                          opacity="0.5" />
                        <path
                          d="M7.70710678,15.7071068 C7.31658249,16.0976311 6.68341751,16.0976311 6.29289322,15.7071068 C5.90236893,15.3165825 5.90236893,14.6834175 6.29289322,14.2928932 L11.2928932,9.29289322 C11.6689749,8.91681153 12.2736364,8.90091039 12.6689647,9.25670585 L17.6689647,13.7567059 C18.0794748,14.1261649 18.1127532,14.7584547 17.7432941,15.1689647 C17.3738351,15.5794748 16.7415453,15.6127532 16.3310353,15.2432941 L12.0362375,11.3779761 L7.70710678,15.7071068 Z"
                          transform="translate(12, 12) rotate(-180) translate(-12, -12)"
                          fill="currentColor"
                          fill-rule="nonzero" />
                      </g>
                    </svg>
                  </span>
                </router-link> -->
                <button
                  type="button"
                  aria-label="Delete"
                  class="btn btn-icon btn-light-danger"
                  @click="deleteNote(note.id)">
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
</template>

<script>
import InformationCard from "@/components/admin/dashboard/conference/information-card.vue"
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import DataTable from "@/components/admin/data-table/index.vue"
import AddNoteModal from "@/components/admin/modals/forms/add-note-modal.vue"
import axiosClient from "@/plugins/axios"
import arraySort from "array-sort"
import {defineComponent, onBeforeMount, onMounted, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute} from "vue-router"
import {showModal} from "../../../core/helpers/dom"
import getMenuAbilities from "../../../plugins/get-menu-abilities"

export default defineComponent({
  name: "add-note-list",
  components: {Toolbar, AddNoteModal, DataTable, InformationCard},
  setup() {
    const route = useRoute()
    const {t} = useI18n()
    const conference = ref(route.params.conference)
    const loading = ref(false)
    const header = ref([
      {
        columnName: t("global.file-name"),
        columnLabel: "name",
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
    const initConferences = ref([])
    const idsSelected = ref([])
    const addNoteModal = ref(null)
    const idCurrent = ref(null)
    const conferenceCurrent = ref({id: null})
    const abilities = ref({adminIndex: false})

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/conferences/my-notes/${conference.value}${queryString}`)
        .then((response) => {
          data.value = response.data.result.data
          itemsTotal.value = response.data.result.total
        })
        .finally(() => {
          loading.value = false
        })
    }

    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      getDataTableBodyRows(["?", ["q", e.target.value].join("=")].join(""))
    }

    const deleteNote = function deleteNote(id) {
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
          axiosClient.delete(`/conferences/add-note/delete/${id}`).then(() => {
            getDataTableBodyRows()
          })
        }
      })
    }

    const deleteFewNotes = function deleteFewNotes() {
      idsSelected.value.forEach((item) => {
        deleteNote(item)
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

    const showAddModal = function showAddModal() {
      idCurrent.value = conference.value
      conferenceCurrent.value = {id: conference.value}
      showModal(addNoteModal.value.addNoteModal.modal)
    }

    const showUpdateModal = function showUpdateModal(id) {
      idCurrent.value = conference.value
      axiosClient.get(`/conferences/add-note/${conference.value}/show/${id}`).then((response) => {
        conferenceCurrent.value = response.data.result
        showModal(addNoteModal.value.addNoteModal.modal)
      })
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
      getMenuAbilities("/dashboard/conferences/admin-index", abilities)
    })

    onMounted(() => {
      initConferences.value.splice(0, data.value.length, ...data.value)
    })

    return {
      t,
      conference,
      loading,
      header,
      data,
      itemsTotal,
      idsSelected,
      addNoteModal,
      idCurrent,
      conferenceCurrent,
      abilities,
      searchDataTableBodyRows,
      onSort,
      onItemsSelect,
      deleteNote,
      deleteFewNotes,
      showAddModal,
      showUpdateModal,
      getDataTableBodyRows
    }
  }
})
</script>
