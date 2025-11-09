<!-- DONE REVIEWING: 24/06/2023 -->
<template>
  <toolbar :title="t('global.users-management')" />

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
              <label for="search-users" class="sr-only">
                {{ t("global.search-users") }}
              </label>
              <input
                id="search-users"
                type="text"
                name="search-users"
                :placeholder="t('global.search-users')"
                data-kt-user-table-filter="search"
                class="form-control form-control-solid w-250px ps-14"
                @keyup.enter="searchDataTableBodyRows" />
            </div>
          </div>
          <div class="card-toolbar">
            <div data-kt-user-table-toolbar="base" class="d-flex justify-content-end">
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
                {{ t("global.add-button") }} {{ t("global.user") }}
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
                  {{ t("global.no-users") }}
                </span>
              </p>
              <button type="button" class="btn btn-primary er fs-6 px-8 py-4" @click="showAddModal">
                {{ t("global.add-button") }} {{ t("global.user") }}
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
            <template v-for="type in userTypes" :key="type">
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
                  :items-per-page-dropdown-enabled="true"
                  :page-current="currentPage"
                  :items-per-page="itemsPerPage"
                  @on-sort="onSort"
                  @on-items-select="onItemsSelect">
                  <template #id="{row: user}">
                    {{ data.indexOf(user) + 1 }}
                  </template>
                  <template #name="{row: user}">
                    <div class="d-flex align-items-center justify-content-start">
                      <template v-if="user.avatar !== '' && user.avatar !== null">
                        <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
                          <div class="symbol-label">
                            <img
                              :src="SERVER_PATH + 'storage/' + user.avatar"
                              :alt="`${user.name}`"
                              class="w-100" />
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                          style="background: url('/src/assets/media/svg/files/blank-image.svg')">
                          <div class="symbol-label fs-3 bg-light-warning text-warning">
                            {{ user.name.charAt(0).toUpperCase() }}
                          </div>
                        </div>
                      </template>
                      {{ user.name }}
                    </div>
                  </template>
                  <template #email="{row: user}">
                    {{ user.email }}
                  </template>
                  <template #roles="{row: user}">
                    <template v-for="(role, index) in user.roles" :key="index">
                      <template v-if="role.checked">
                        <span
                          class="badge fs-7 m-1"
                          :class="[
                            role.name === 'super-administrator'
                              ? 'badge-light-danger'
                              : role.name === 'administrator'
                              ? 'badge-light-primary'
                              : role.name === 'tutor'
                              ? 'badge-light-success'
                              : role.name === 'student'
                              ? 'badge-light-info'
                              : ''
                          ]">
                          {{ t(`global.${role.title}`) }}
                        </span>
                      </template>
                    </template>
                  </template>
                  <template #email-verification="{row: user}">
                    {{ user.email_verified_at ? t("verified") : t("not-verified") }}
                  </template>
                  <template #actions="{row: user}">
                    <button
                      type="button"
                      class="btn btn-icon btn-light-info p-3 me-2 userchattooltip user-chat-btn"
                      @click="gotoUserChat(user.id)">
                      <svg
                        class="user-chat-svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12 3C6.48 3 2 6.58 2 11C2 13.54 3.3 15.79 5.42 17.2C5.29 18.03 4.93 19.37 3.9 20.21C3.67 20.4 3.57 20.73 3.66 21.03C3.75 21.34 4.03 21.55 4.35 21.55C5.98 21.55 7.33 20.77 8.2 20.06C9.43 20.34 10.69 20.5 12 20.5C17.52 20.5 22 16.92 22 12C22 7.08 17.52 3 12 3ZM6 10.5C6 9.67 6.67 9 7.5 9C8.33 9 9 9.67 9 10.5C9 11.33 8.33 12 7.5 12C6.67 12 6 11.33 6 10.5ZM10.5 10.5C10.5 9.67 11.17 9 12 9C12.83 9 13.5 9.67 13.5 10.5C13.5 11.33 12.83 12 12 12C11.17 12 10.5 11.33 10.5 10.5ZM16.5 10.5C16.5 9.67 17.17 9 18 9C18.83 9 19.5 9.67 19.5 10.5C19.5 11.33 18.83 12 18 12C17.17 12 16.5 11.33 16.5 10.5Z" />
                      </svg>
                      <span class="userchattooltiptext">{{ t("global.user-chats") }}</span>
                    </button>
                    <button
                      v-if="user.type !== 0 && userPermissionsInUserModule.includes('index')"
                      type="button"
                      class="btn btn-light-primary p-3 me-2"
                      @click="
                        user.type === 2
                          ? gotoTutorInformation(user.id)
                          : gotoStudentInformation(user.id)
                      ">
                      {{
                        user.type === 2
                          ? t("global.tutor-information")
                          : t("global.student-information")
                      }}
                    </button>
                    <button
                      v-if="userPermissionsInUserModule.includes('index')"
                      type="button"
                      aria-label="Chat"
                      class="btn btn-icon btn-light-warning me-2 chattooltip chat-btn"
                      @click="chat(user.id)">
                      <svg
                        class="w-6 h-6 dark:text-white chat-svg"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          fill-rule="evenodd"
                          d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                          clip-rule="evenodd" />
                      </svg>
                      <span class="chattooltiptext">{{ t("global.chat") }}</span>
                    </button>
                    <button
                      v-if="userPermissionsInUserModule.includes('edit')"
                      type="button"
                      aria-label="Update"
                      class="btn btn-icon btn-light-success edittooltip me-2"
                      @click="showUpdateModal(user.id)">
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
                    </button>
                    <button
                      v-if="userPermissionsInUserModule.includes('destroy')"
                      type="button"
                      aria-label="Delete"
                      class="btn btn-icon btn-light-danger deletetooltip"
                      @click="deleteUser(user.id)">
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
        </template>
      </div>
    </div>
  </div>

  <add-user-modal
    ref="addUserModal"
    :id-current="idCurrent"
    :user-current="userCurrent"
    :selected-type="selectedType"
    @on-after-submit="getDataTableBodyRows" />
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import DataTable from "@/components/admin/data-table/index.vue"
import AddUserModal from "@/views/admin/users/add-user-modal.vue"
import axiosClient from "@/plugins/axios"
import arraySort from "array-sort"
import {defineComponent, onBeforeMount, onMounted, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import {showModal} from "../../../core/helpers/dom"
import {useRouter} from "vue-router"
import {useStore} from "vuex"

export default defineComponent({
  name: "users-list",
  components: {Toolbar, AddUserModal, DataTable},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const header = ref([
      {columnName: "#", columnLabel: "id", sortEnabled: true, columnWidth: 75},
      {columnName: t("global.name"), columnLabel: "name", sortEnabled: true, columnWidth: 230},
      {columnName: t("global.email"), columnLabel: "email", sortEnabled: true, columnWidth: 175},
      {columnName: t("global.role"), columnLabel: "roles", sortEnabled: true, columnWidth: 175},
      {
        columnName: t("global.email-verification"),
        columnLabel: "email-verification",
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

    const store = useStore()
    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userData = userInfoObject.user

    const getPermissionChildrenNamesByName = (permissionName) => {
      // Use a Set to avoid duplicate child names
      const permissionWithCheckedChildren = new Set()

      userData.roles.forEach((role) => {
        const matchingPermission = role.permissions.find(
          (permission) => permission.name === permissionName
        )

        if (matchingPermission) {
          // Add the names of children with 'checked' set to true to the Set
          matchingPermission.childrens?.forEach((child) => {
            if (child.checked === true) {
              permissionWithCheckedChildren.add(child.name)
            }
          })
        }
      })

      // Convert Set back to an array before returning
      return Array.from(permissionWithCheckedChildren)
    }

    const permissionName = "users"
    const userPermissionsInUserModule = getPermissionChildrenNamesByName(permissionName)

    const router = useRouter()

    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const initUsers = ref([])
    const idsSelected = ref([])
    const addUserModal = ref(null)
    const idCurrent = ref(null)
    const userCurrent = ref({
      avatar: null,
      name: null,
      email: null,
      roles: null
    })
    const userTypes = ["Admin", "Student", "Tutor"]
    const userTypeIndices = {
      Admin: 0,
      Student: 1,
      Tutor: 2
    }

    const selectedType = ref("Admin") // Default selected type

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      const type = userTypeIndices[selectedType.value]
      const url = `/users${queryString}${queryString ? "&" : "?"}type=${type}`
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
      // Get the corresponding index for the selected type
      // const selectedIndex = userTypeIndices[type]
      // Call getDataTableBodyRows with the selectedIndex
      // getDataTableBodyRows(`?type=${selectedIndex}`)
      // Update the selectedType
      selectedType.value = type
      // selectedType.value = selectedIndex // Update selectedType with the index
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

    const deleteUser = function deleteUser(id) {
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
          axiosClient.delete(`/users/delete/${id}`).then(() => {
            getDataTableBodyRows()
          })
        }
      })
    }

    const deleteFewUsers = function deleteFewUsers() {
      idsSelected.value.forEach((item) => {
        deleteUser(item)
      })

      idsSelected.value.length = 0
    }

    const showAddModal = function showAddModal() {
      idCurrent.value = null
      axiosClient.get(`/roles`).then((response) => {
        userCurrent.value = {
          avatar: null,
          name: null,
          email: null,
          roles: response.data.result.data
        }

        document.getElementById("add-user-modal-avatar").style.backgroundImage =
          "url('/src/assets/media/svg/files/blank-image.svg')"
        showModal(addUserModal.value.addUserModal.modal)
      })
    }

    const showUpdateModal = function showUpdateModal(id) {
      idCurrent.value = id
      axiosClient.get(`/users/show/${id}`).then((response) => {
        userCurrent.value = response.data.result
        if (userCurrent.value.avatar !== "" && userCurrent.value.avatar !== null)
          document.getElementById("add-user-modal-avatar").style.backgroundImage = `url('${
            import.meta.env.VITE_APP_SERVER_BASE_URL
          }/${userCurrent.value.avatar}')`
        else
          document.getElementById("add-user-modal-avatar").style.backgroundImage =
            "url('/src/assets/media/svg/files/blank-image.svg')"

        showModal(addUserModal.value.addUserModal.modal)
      })
    }

    const chat = function chat(id) {
      // Construct the URL with the provided ID
      const url = `${import.meta.env.VITE_APP_BASE_URL}/me/dashboard/chats/private-chat?id=${id}`

      // Navigate to the URL
      window.location.href = url
    }

    const gotoTutorInformation = (userId) => {
      // Navigate to the tutorInformation route with the user ID as a parameter
      router.push({name: "tutorInformation", params: {id: userId}})
    }

    const gotoStudentInformation = (userId) => {
      // Navigate to the studentInformation route with the user ID as a parameter
      router.push({name: "studentInformation", params: {id: userId}})
    }

    const gotoUserChat = (userId) => {
      // Navigate to the userInformation route with the user ID as a parameter
      router.push({name: "admin-chat", params: {id: userId}})
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
    })

    onMounted(() => {
      initUsers.value.splice(0, data.value.length, ...data.value)
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
      addUserModal,
      idCurrent,
      userCurrent,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      onSort,
      onItemsSelect,
      deleteUser,
      deleteFewUsers,
      showAddModal,
      showUpdateModal,
      chat,
      gotoTutorInformation,
      gotoStudentInformation,
      gotoUserChat,
      userTypes,
      selectedType,
      handleTabChange,
      userPermissionsInUserModule
    }
  }
})
</script>

<style></style>
