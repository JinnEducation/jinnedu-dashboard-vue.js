<!-- DONE REVIEWING: 23/06/2023 -->
<template>
  <toolbar :title="t('global.discount-code-management')" />
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
              <label for="search-discount-code" class="sr-only">{{
                t("global.search-discount-code")
              }}</label>
              <input
                id="search-discount-code"
                type="text"
                name="search-discount-code"
                :placeholder="t('global.search-discount-code')"
                data-kt-content-table-filter="search"
                class="form-control form-control-solid w-250px ps-14"
                @keyup.enter="searchDataTableBodyRows" />
            </div>
          </div>
          <div class="card-toolbar">
            <div data-kt-content-table-toolbar="base" class="d-flex justify-content-end">
              <template v-if="abilities.create">
                <router-link :to="`/dashboard/discount_codes/create`" class="btn btn-primary">
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
                  {{ t("global.add-button") }} {{ t("global.discount-code") }}
                </router-link>
              </template>
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
                  {{ t("global.no-discount-code") }}
                </span>
              </p>
              <template v-if="abilities.create">
                <router-link
                  :to="`/dashboard/discount_codes/create`"
                  class="btn btn-primary er fs-6 px-8 py-4">
                  {{ t("global.add-button") }} {{ t("global.discount-code") }}
                </router-link>
              </template>
            </div>
            <div class="text-center px-5">
              <img
                src="@/assets/media/illustrations/welcome.png"
                :alt="`Add Our blog Illustration`"
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
              <!-- رقم تسلسلي -->
              <template #id="{row: item}">
                {{ data.indexOf(item) + 1 }}
              </template>

              <!-- الكود -->
              <template #code="{row: item}">
                <div class="fw-bold text-primary">
                  {{ item.code }}
                </div>
              </template>

              <!-- النسبة -->
              <template #percentage="{row: item}">
                <span class="badge badge-light-primary fs-7 px-3 py-2">
                  {{ item.percentage }}%
                </span>
              </template>

              <!-- تاريخ البداية -->
              <template #starts_at="{row: item}">
                <span class="small text-muted">
                  📅 {{ item.starts_at ? formatDateTime(item.starts_at) : "-" }}
                </span>
              </template>

              <!-- تاريخ النهاية -->
              <template #ends_at="{row: item}">
                <span class="small text-muted">
                  📅 {{ item.ends_at ? formatDateTime(item.ends_at) : "-" }}
                </span>
              </template>

              <!-- الحالة -->
              <template #is_active="{row: item}">
                <span v-if="item.is_active" class="badge badge-success">Active</span>
                <span v-else class="badge badge-danger">Inactive</span>
              </template>

              <!-- الأزرار -->
              <template v-if="abilities.edit || abilities.destroy" #actions="{row: item}">
                <router-link
                  v-if="abilities.edit"
                  :to="`/dashboard/discount_codes/update/${item.id}`"
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
                  v-if="abilities.destroy"
                  type="button"
                  aria-label="Delete"
                  class="btn btn-icon btn-light-danger deletetooltip"
                  @click="deleteDiscountCode(item.id)">
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
import getMenuAbilities from "@/plugins/get-menu-abilities"
import arraySort from "array-sort"
import {computed, defineComponent, onBeforeMount, onMounted, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute} from "vue-router"
import {useStore} from "vuex"
import Swal from "sweetalert2"

export default defineComponent({
  name: "discount-codes-list",
  components: {Toolbar, DataTable},
  setup() {
    const route = useRoute()
    const path = computed(() => route.path)
    const store = useStore()

    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type
    const {t} = useI18n()
    const loading = ref(false)

    // Format datetime helper
    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return "-"
      const date = new Date(dateTimeString)
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })
    }

    const header = ref([
      {
        columnName: "#",
        columnLabel: "id",
        sortEnabled: true,
        columnWidth: 60
      },
      {
        columnName: t("global.code"),
        columnLabel: "code",
        sortEnabled: true,
        columnWidth: 150
      },
      {
        columnName: t("global.percentage"),
        columnLabel: "percentage",
        sortEnabled: true,
        columnWidth: 120
      },
      {
        columnName: t("global.starts-at"),
        columnLabel: "starts_at",
        sortEnabled: true,
        columnWidth: 180
      },
      {
        columnName: t("global.ends-at"),
        columnLabel: "ends_at",
        sortEnabled: true,
        columnWidth: 180
      },
      {
        columnName: t("global.status"),
        columnLabel: "is_active",
        sortEnabled: true,
        columnWidth: 100
      },
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
    const initOurblog = ref([])
    const idsSelected = ref([])
    const abilities = ref({
      index: false,
      create: false,
      edit: false,
      destroy: false,
      show: false,
      registerTutor: false,
      unRegisterTutor: false
      // index: true,
      // create: true,
      // edit: true,
      // destroy: true,
      // show: true,
      // registerTutor: true,
      // unRegisterTutor: true
    })

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/discount_codes${queryString}`)
        .then((response) => {
          data.value = response.data.data
          itemsTotal.value = response.data.meta.total
          currentPage.value = response.data.meta.current_page
          itemsPerPage.value = response.data.meta.per_pages
        })
        .finally(() => {
          loading.value = false
        })
      if (userType === 2 || userType === 0) {
        abilities.value.index = true
        abilities.value.create = true
        abilities.value.edit = true
        abilities.value.destroy = true
      }
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

    const deleteDiscountCode = (id) => {
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
          axiosClient.delete(`/discount_codes/${id}`).then(() => {
            Swal.fire({
              icon: "success",
              text: t("global.discount-code-deleted-successfully"),
              confirmButtonText: t("global.thank-you"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-primary"}
            })
            getDataTableBodyRows()
          })
        }
      })
    }

    const deleteFewDiscountCodes = function deleteFewDiscountCodes() {
      idsSelected.value.forEach((item) => {
        deleteDiscountCode(item)
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
      initOurblog.value.splice(0, data.value.length, ...data.value)
    })

    return {
      t,
      loading,
      header,
      data,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      abilities,
      currentSearchQuery,
      searchDataTableBodyRows,
      onSort,
      onItemsSelect,
      deleteDiscountCode,
      deleteFewDiscountCodes,
      formatDateTime
    }
  }
})
</script>

<style scoped>
.truncate-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* 🔢 عدد الأسطر اللي بدك تظهرها */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
