<!-- DONE REVIEWING: 24/06/2023 -->
<template>
  <toolbar :title="t('global.conference-add-complaint')" />
  <add-complaint-modal
    ref="addComplaintModal"
    :id-current="idCurrent"
    :conference-current="conferenceCurrent"
    @after-on-submit="getDataTableBodyRows" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <information-card :id-current="conference" :is-admin="abilities.adminIndex" />
      <template v-if="loading">
        <div class="card-body p-0">
          <div class="card-px text-center py-20 my-10">
            <div role="status" class="spinner-border text-primary">
              <span class="visually-hidden"> {{ t("global.loading") }}</span>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="card">
        <div class="card-body">
          <div class="d-flex flex-column flex-xl-row p-7">
            <div class="flex-lg-row-fluid me-xl-15 mb-20 mb-xl-0">
              <div class="mb-0">
                <div class="d-flex align-items-center mb-12">
                  <span class="svg-icon svg-icon-warning svg-icon-4x me-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24" />
                        <path
                          d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z"
                          fill="currentColor"
                          fill-rule="nonzero"
                          opacity="0.3" />
                        <rect x="6" y="11" rx="1" width="9" height="2" fill="currentColor" />
                        <rect x="6" y="15" rx="1" width="5" height="2" fill="currentColor" />
                      </g>
                    </svg>
                  </span>
                  <div class="d-flex flex-column">
                    <h1 class="text-gray-800 fw-semibold">
                      {{ complaint.subject }}
                    </h1>
                    <div class="">
                      <span class="fw-semibold text-muted me-6">
                        {{ t("global.email") }}:
                        <a
                          :href="`mailto:${complaint.user?.email}`"
                          class="text-muted text-hover-primary">
                          {{ complaint.user?.email }}
                        </a>
                      </span>
                      <span class="fw-semibold text-muted me-6">
                        {{ t("global.by") }}:
                        <button
                          type="button"
                          class="btn btn-light-primary p-3 me-2"
                          @click="gotoUserInformation(complaint.user?.id)">
                          {{ complaint.user?.name }}
                        </button>
                        <!-- <a href="#" class="text-muted text-hover-primary">
                          {{ complaint.user?.name }}
                        </a> -->
                      </span>
                      <span class="fw-semibold text-muted">
                        {{ t("global.created-at") }}:
                        <span class="fw-bold text-gray-600 me-1">{{ complaint.created_at }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="mb-15">
                  <div class="mb-15 fs-5 fw-normal text-gray-800">
                    <div class="mb-3 fs-5">{{ t("global.hello") }},</div>
                    <div class="mb-5">
                      {{ complaint.note }}
                    </div>
                    <div class="mb-10">
                      {{ t("global.thank-you") }},
                      {{ complaint.user?.name }}
                    </div>
                    <div
                      v-if="complaint.path !== null"
                      class="notice d-flex bg-light-primary rounded border-primary border border-dashed p-6">
                      <span
                        class="d-flex justify-content-center align-items-center svg-icon svg-icon-primary svg-icon-2x me-5">
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
                              y="2"
                              rx="1"
                              width="2"
                              height="14"
                              fill="currentColor"
                              opacity="0.5" />
                            <path
                              d="M12.0362375,3.37797611 L7.70710678,7.70710678 C7.31658249,8.09763107 6.68341751,8.09763107 6.29289322,7.70710678 C5.90236893,7.31658249 5.90236893,6.68341751 6.29289322,6.29289322 L11.2928932,1.29289322 C11.6689749,0.916811528 12.2736364,0.900910387 12.6689647,1.25670585 L17.6689647,5.75670585 C18.0794748,6.12616487 18.1127532,6.75845471 17.7432941,7.16896473 C17.3738351,7.57947475 16.7415453,7.61275317 16.3310353,7.24329415 L12.0362375,3.37797611 Z"
                              fill="currentColor"
                              fill-rule="nonzero" />
                          </g>
                        </svg>
                      </span>
                      <div class="d-flex flex-stack flex-grow-1">
                        <div class="d-flex flex-column justify-content-center">
                          <a
                            class="fs-5 fw-bold text-dark text-hover-primary mb-2"
                            :href="`${SERVER_PATH}/${complaint.path}`">
                            {{ complaint.file }}
                          </a>
                          <div class="d-flex gap-2">
                            <span class="text-muted fs-6 fw-semibold lh-1">
                              {{ complaint.size }} {{ t("global.mb") }}
                            </span>
                            <span class="text-muted fs-6 fw-semibold lh-1">/</span>
                            <span class="text-muted fs-6 fw-semibold lh-1">
                              {{ complaint.type?.toUpperCase() }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-15">
                    <div v-for="reply in complaint.replies" :key="reply.id" class="mb-9">
                      <div class="card card-bordered w-100">
                        <div class="card-body">
                          <div class="w-100 d-flex flex-stack mb-8">
                            <div class="d-flex align-items-center f">
                              <div class="symbol symbol-50px me-5">
                                <img
                                  v-if="reply.user?.avatar"
                                  :alt="reply.user?.name.charAt(0).toUpperCase()"
                                  :src="`${SERVER_PATH}/${reply.user.avatar}`" />
                                <div
                                  v-else
                                  class="d-flex justify-content-center align-items-center symbol-label bg-light-warning text-warning fs-1 fw-bold">
                                  {{ reply.user?.name.charAt(0).toUpperCase() }}
                                </div>
                              </div>
                              <div
                                class="d-flex flex-column fw-semibold fs-5 text-gray-600 text-dark">
                                <div class="d-flex align-items-center">
                                  <a
                                    href="#"
                                    class="text-gray-800 fw-bold text-hover-primary fs-5 me-3">
                                    {{ reply.user?.name }}
                                  </a>
                                </div>
                                <span class="text-muted fw-semibold fs-6">
                                  {{ reply.created_at }}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p class="fw-normal fs-5 text-gray-700 mb-10">
                            {{ reply.note }}
                          </p>
                          <div
                            v-if="reply.path !== null"
                            class="notice d-flex bg-light-info rounded border-info border border-dashed p-6">
                            <span
                              class="d-flex justify-content-center align-items-center svg-icon svg-icon-info svg-icon-2x me-5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g fill="none" fill-rule="evenodd">
                                  <rect x="0" y="0" width="24" height="24"></rect>
                                  <path
                                    d="M2,13 C2,12.5 2.5,12 3,12 C3.5,12 4,12.5 4,13 C4,13.3333333 4,15 4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 C2,15 2,13.3333333 2,13 Z"
                                    fill="currentColor"
                                    fill-rule="nonzero"
                                    opacity="0.5"></path>
                                  <rect
                                    x="11"
                                    y="2"
                                    rx="1"
                                    width="2"
                                    height="14"
                                    fill="currentColor"
                                    opacity="0.5"></rect>
                                  <path
                                    d="M12.0362375,3.37797611 L7.70710678,7.70710678 C7.31658249,8.09763107 6.68341751,8.09763107 6.29289322,7.70710678 C5.90236893,7.31658249 5.90236893,6.68341751 6.29289322,6.29289322 L11.2928932,1.29289322 C11.6689749,0.916811528 12.2736364,0.900910387 12.6689647,1.25670585 L17.6689647,5.75670585 C18.0794748,6.12616487 18.1127532,6.75845471 17.7432941,7.16896473 C17.3738351,7.57947475 16.7415453,7.61275317 16.3310353,7.24329415 L12.0362375,3.37797611 Z"
                                    fill="currentColor"
                                    fill-rule="nonzero"></path>
                                </g>
                              </svg>
                            </span>
                            <div class="d-flex flex-stack flex-grow-1">
                              <div class="d-flex flex-column justify-content-center">
                                <a
                                  class="fs-5 fw-bold text-dark text-hover-primary mb-2"
                                  :href="`${SERVER_PATH}/${reply.path}`">
                                  {{ reply.file }}
                                </a>
                                <div class="d-flex gap-2">
                                  <span class="text-muted fs-6 fw-semibold lh-1">
                                    {{ reply.size }} {{ t("global.mb") }}
                                  </span>
                                  <span class="text-muted fs-6 fw-semibold lh-1">/</span>
                                  <span class="text-muted fs-6 fw-semibold lh-1">
                                    {{ reply.type.toUpperCase() }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-md-6 fv-row mb-5">
                      <label for="view-complaint-attachment-input" class="fs-6 fw-semibold mb-2">
                        {{ t("global.attachment") }}
                      </label>
                      <input
                        id="view-complaint-attachment-input"
                        type="file"
                        class="form-control form-control-solid"
                        @change="handleFileInputChange($event)" />
                    </div>
                    <div v-if="abilities.adminIndex" class="col-12 col-md-6 fv-row mb-5">
                      <label
                        for="view-complaint-status-input"
                        class="required fs-6 fw-semibold mb-2">
                        {{ t("global.status") }}
                      </label>
                      <select
                        id="view-complaint-status-input"
                        v-model="conferenceStatus"
                        class="form-select form-select-solid">
                        <option value="1" selected>{{ t("global.opened") }}</option>
                        <option value="2">{{ t("global.pending") }}</option>
                        <option value="3">{{ t("global.resolved") }}</option>
                        <option value="4">{{ t("global.closed") }}</option>
                        <option value="5">{{ t("global.accepted") }}</option>
                        <option value="6">{{ t("global.rejected") }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="mb-0">
                    <label
                      for="view-complaint-message-textarea"
                      class="required fs-6 fw-semibold mb-2">
                      {{ t("global.message") }}
                    </label>
                    <textarea
                      id="view-complaint-message-textarea"
                      v-model="conferenceMessage"
                      rows="6"
                      :placeholder="t('global.what-problems-you-have')"
                      class="form-control form-control-solid placeholder-gray-600 fw-bold fs-4 ps-9 pt-7"></textarea>
                    <button
                      type="button"
                      class="btn btn-primary mt-n20 mb-20 position-relative float-end me-7"
                      @click="submit">
                      {{ t("global.submit") }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InformationCard from "@/components/admin/dashboard/conference/information-card.vue"
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import AddComplaintModal from "@/components/admin/modals/forms/add-complaint-modal.vue"
import axiosClient from "@/plugins/axios"
import arraySort from "array-sort"
import {defineComponent, onBeforeMount, onMounted, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {showModal} from "../../../core/helpers/dom"
import getMenuAbilities from "../../../plugins/get-menu-abilities"

export default defineComponent({
  name: "view-complaint",
  components: {Toolbar, AddComplaintModal, InformationCard},
  setup() {
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const route = useRoute()
    const {t} = useI18n()
    const conference = ref(route.params.conference)
    const complaintId = ref(route.params.complaintId)
    const loading = ref(false)
    const router = useRouter()
    const header = ref([
      {
        columnName: t("global.subject"),
        columnLabel: "subject",
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
    const addComplaintModal = ref(null)
    const idCurrent = ref(null)
    const conferenceCurrent = ref({id: null})
    const conferenceFileSelected = ref("")
    const conferenceStatus = ref(null)
    const conferenceMessage = ref(null)
    const abilities = ref({adminIndex: false})

    const handleFileInputChange = function handleFileInputChange(e) {
      // eslint-disable-next-line
      conferenceFileSelected.value = e.target.files[0]
      const reader = new FileReader()
      reader.readAsBinaryString(conferenceFileSelected.value)
    }

    const gotoUserInformation = (userId) => {
      // Navigate to the userInformation route with the user ID as a parameter
      router.push({name: "studentInformation", params: {id: userId}})
    }

    const complaint = ref({})
    const getDataComplaint = function getDataComplaint() {
      loading.value = true
      axiosClient
        .get(
          abilities.value.adminIndex
            ? `/complaints/show/${complaintId.value}`
            : `/conferences/view-complaint/${conference.value}/${complaintId.value}`
        )
        .then((response) => {
          complaint.value = response.data.result
        })
        .finally(() => {
          loading.value = false
        })
    }

    const submit = function submit() {
      const formData = new FormData()
      formData.append("note", conferenceMessage.value ?? "")
      formData.append("file", conferenceFileSelected.value)
      if (abilities.value.adminIndex) formData.append("status", conferenceStatus.value)
      else formData.append("status", 1)
      if (abilities.value.adminIndex) formData.append("reply_id", complaintId.value)

      const submitInner = function submitInner() {
        loading.value = true
        axiosClient
          .post(
            abilities.value.adminIndex
              ? `/complaints/reply`
              : `/conferences/reply-complaint/${conference.value}/${complaintId.value}`,
            formData
          )
          .then((response) => {
            if (response.data.success) {
              getDataComplaint()
              Swal.fire({
                icon: "success",
                text: t("global.constant-added-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
            } else {
              let errorMessage = ""
              switch (response.data["msg-code"]) {
                case "333":
                  errorMessage = t("errors.note-is-empty")
                  break
                default:
                  errorMessage = t("global.unknown-error")
                  break
              }

              Swal.fire({
                icon: "error",
                text: errorMessage,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            }
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: t("global.errors-detected"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
          })
          .finally(() => {
            loading.value = false
          })
      }

      if (abilities.value.adminIndex && conferenceStatus.value !== null) submitInner()
      else if (conferenceMessage.value !== null) submitInner()
      else {
        Swal.fire({
          icon: "error",
          text: `Complaint ${abilities.value.adminIndex ? "status and" : ""} message ${
            abilities.value.adminIndex ? "are" : "is"
          } required.`,
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })

        return false
      }
    }

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/conferences/my-complaints/${conference.value}${queryString}`)
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

    const deleteComplaint = function deleteComplaint(id) {
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
          axiosClient.delete(`/conferences/add-complaint/delete/${id}`).then(() => {
            getDataTableBodyRows()
          })
        }
      })
    }

    const deleteFewComplaints = function deleteFewComplaints() {
      idsSelected.value.forEach((item) => {
        deleteComplaint(item)
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
      showModal(addComplaintModal.value.addComplaintModal.modal)
    }

    const showUpdateModal = function showUpdateModal(id) {
      idCurrent.value = conference.value
      axiosClient
        .get(`/conferences/add-complaint/${conference.value}/show/${id}`)
        .then((response) => {
          conferenceCurrent.value = response.data.result
          showModal(addComplaintModal.value.addComplaintModal.modal)
        })
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
      const menuAbilitiesPromise = getMenuAbilities("/dashboard/conferences/admin-index", abilities)
      Promise.all([menuAbilitiesPromise]).then(() => {
        getDataComplaint()
      })
    })

    onMounted(() => {
      initConferences.value.splice(0, data.value.length, ...data.value)
    })

    return {
      SERVER_PATH,
      t,
      conference,
      gotoUserInformation,
      complaintId,
      complaint,
      loading,
      header,
      data,
      conferenceStatus,
      conferenceMessage,
      itemsTotal,
      idsSelected,
      addComplaintModal,
      idCurrent,
      conferenceCurrent,
      conferenceFileSelected,
      abilities,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      submit,
      handleFileInputChange,
      getDataComplaint,
      onSort,
      onItemsSelect,
      deleteComplaint,
      deleteFewComplaints,
      showAddModal,
      showUpdateModal
    }
  }
})
</script>
