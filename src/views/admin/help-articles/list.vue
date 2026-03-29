<template>
  <toolbar :title="t('global.help-center')" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <div class="card">
        <div class="nav nav-line-tabs px-6 pt-4">
          <li class="nav-item">
            <a
              class="nav-link px-4 py-3"
              :class="{active: selectedAudience === 'student'}"
              @click="handleTabChange('student')">
              {{ t("global.student") }}
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link px-4 py-3"
              :class="{active: selectedAudience === 'tutor'}"
              @click="handleTabChange('tutor')">
              {{ t("global.tutor") }}
            </a>
          </li>
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
              <label for="search-help-articles" class="sr-only">{{ t("global.search") }}</label>
              <input
                id="search-help-articles"
                type="text"
                name="search-help-articles"
                :placeholder="t('global.search')"
                data-kt-content-table-filter="search"
                class="form-control form-control-solid w-250px ps-14"
                @keyup.enter="searchDataTableBodyRows" />
            </div>
          </div>
          <div class="card-toolbar">
            <div data-kt-content-table-toolbar="base" class="d-flex justify-content-end">
              <template v-if="abilities.create">
                <router-link :to="`/dashboard/help-articles/create`" class="btn btn-primary">
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
                  {{ t("global.add-button") }} {{ t("global.help") }}
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
                <span>{{ t("global.no-data") }}</span>
              </p>
              <template v-if="abilities.create">
                <router-link
                  :to="`/dashboard/help-articles/create`"
                  class="btn btn-primary er fs-6 px-8 py-4">
                  {{ t("global.add-button") }} {{ t("global.help") }}
                </router-link>
              </template>
            </div>
            <div class="text-center px-5">
              <img
                src="@/assets/media/illustrations/welcome.png"
                :alt="`Add Help Articles Illustration`"
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
              <template #id="{row: item}">
                {{ data.indexOf(item) + 1 }}
              </template>

              <template #title="{row: item}">
                <div>
                  <div class="fw-bold">{{ getTranslatedValue(item.title) || "-" }}</div>
                  <div class="text-muted small truncate-lines">
                    {{ stripHtml(getTranslatedValue(item.description)) || "-" }}
                  </div>
                </div>
              </template>

              <template #slug="{row: item}">
                <span class="text-muted">{{ item.slug || "-" }}</span>
              </template>

              <template #icon="{row: item}">
                <img
                  v-if="item.icon"
                  :src="resolveIcon(item.icon)"
                  alt="icon"
                  class="help-icon-preview" />
                <span v-else-if="item.icon_svg" class="badge badge-light-info">SVG</span>
                <span v-else>-</span>
              </template>

              <template #rating="{row: item}">
                <span class="badge badge-light-warning">
                  {{ formatRating(item.average_rating) }} ({{ item.ratings_count || 0 }})
                </span>
              </template>

              <template #status="{row: item}">
                <span v-if="item.status === 'published'" class="text-success">{{
                  t("global.published")
                }}</span>
                <span v-else-if="item.status === 'draft'" class="text-muted">{{
                  t("global.draft")
                }}</span>
                <span v-else class="text-muted">{{ t("global.archived") }}</span>
              </template>

              <template v-if="abilities.edit || abilities.destroy" #actions="{row: item}">
                <router-link
                  v-if="abilities.edit"
                  :to="`/dashboard/help-articles/update/${item.id}`"
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
                  @click="deleteHelpArticle(item.id)">
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
import {computed, defineComponent, onBeforeMount, onMounted, provide, ref, watch} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import Swal from "sweetalert2"

export default defineComponent({
  name: "help-articles-list",
  components: {Toolbar, DataTable},
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const languages = computed(() => store.state.languages)
    const languageId = ref(null)
    const lang = languages.value.find((element) => element.shortname === store.state.language)
    languageId.value = lang ? lang.id : null

    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type
    const {t} = useI18n()
    const ratingLabel = t("global.rate") === "global.rate" ? "Rating" : t("global.rate")
    const loading = ref(false)
    const selectedAudience = ref("student")

    const header = ref([
      {columnName: "#", columnLabel: "id", sortEnabled: true, columnWidth: 60},
      {columnName: t("global.title"), columnLabel: "title", sortEnabled: true, columnWidth: 300},
      {columnName: t("global.slug"), columnLabel: "slug", sortEnabled: true, columnWidth: 180},
      {columnName: t("global.icon"), columnLabel: "icon", sortEnabled: false, columnWidth: 90},
      {columnName: ratingLabel, columnLabel: "rating", sortEnabled: true, columnWidth: 130},
      {columnName: t("global.status"), columnLabel: "status", sortEnabled: true, columnWidth: 120},
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
    const abilities = ref({
      index: false,
      create: false,
      edit: false,
      destroy: false,
      show: false,
      registerTutor: false,
      unRegisterTutor: false
    })

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      const audienceQuery = `audience=${selectedAudience.value}`
      const finalQueryString = queryString
        ? `${queryString}${queryString.includes("?") ? "&" : "?"}${audienceQuery}`
        : `?${audienceQuery}`

      axiosClient
        .get(`/help-articles${finalQueryString}`)
        .then((response) => {
          data.value = response.data.data || []
          itemsTotal.value = response.data.meta?.total || 0
          currentPage.value = response.data.meta?.current_page || 1
          itemsPerPage.value = response.data.meta?.per_pages || response.data.meta?.per_page || 10
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

    const handleTabChange = function handleTabChange(audience) {
      if (selectedAudience.value === audience) return
      selectedAudience.value = audience
      router.replace({name: "help-articles-list", params: {audience}})
      getDataTableBodyRows(currentSearchQuery.value ? `?q=${currentSearchQuery.value}` : "")
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

    const getTranslatedValue = (valueObject) => {
      if (!valueObject || typeof valueObject !== "object") return valueObject
      if (languageId.value && valueObject[languageId.value]) return valueObject[languageId.value]
      const firstKey = Object.keys(valueObject)[0]
      return firstKey ? valueObject[firstKey] : ""
    }

    const stripHtml = (value) => {
      if (!value) return ""
      return String(value)
        .replace(/<[^>]*>/g, "")
        .trim()
    }

    const resolveIcon = (icon) => {
      if (!icon) return ""
      if (String(icon).startsWith("http")) return icon
      const base = import.meta.env.VITE_APP_Public_URL || "https://learning.jinnedu.com/public"
      return `${base}/storage/${icon}`
    }

    const formatRating = (rating) => {
      const value = Number(rating || 0)
      return Number.isFinite(value) ? value.toFixed(1) : "0.0"
    }

    const deleteHelpArticle = (id) => {
      Swal.fire({
        icon: "error",
        text: t("global.ensure-delete"),
        showCancelButton: true,
        confirmButtonText: t("global.yes-delete"),
        cancelButtonText: t("global.go-back"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-danger", cancelButton: "btn btn-active-light"}
      }).then((result) => {
        if (result.isConfirmed || result.value) {
          axiosClient.delete(`/help-articles/${id}`).then(() => {
            Swal.fire({
              icon: "success",
              text: t("global.course-deleted-successfully"),
              confirmButtonText: t("global.thank-you"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-primary"}
            })
            getDataTableBodyRows(currentSearchQuery.value ? `?q=${currentSearchQuery.value}` : "")
          })
        }
      })
    }

    watch(
      () => route.params.audience,
      (newAudience) => {
        const routeAudience = newAudience === "tutor" ? "tutor" : "student"
        if (!newAudience) {
          router.replace({name: "help-articles-list", params: {audience: routeAudience}})
          return
        }
        selectedAudience.value = routeAudience
        getDataTableBodyRows(currentSearchQuery.value ? `?q=${currentSearchQuery.value}` : "")
      },
      {immediate: true}
    )

    provide("getDataTableBodyRows", getDataTableBodyRows)
    onBeforeMount(() => {
      data.value = []
      loading.value = false
    })

    onMounted(() => {
      initItems.value.splice(0, data.value.length, ...data.value)
    })

    return {
      t,
      loading,
      header,
      data,
      selectedAudience,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      abilities,
      currentSearchQuery,
      searchDataTableBodyRows,
      onSort,
      onItemsSelect,
      deleteHelpArticle,
      getTranslatedValue,
      stripHtml,
      resolveIcon,
      formatRating,
      handleTabChange
    }
  }
})
</script>

<style scoped>
.truncate-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.help-icon-preview {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
