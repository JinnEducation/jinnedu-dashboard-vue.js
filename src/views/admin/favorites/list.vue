<!-- DONE REVIEWING: 24/06/2023 -->
<template>
  <toolbar :title="t('global.favorites-management')" />

  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="card">
        <div class="nav nav-line-tabs">
          <template v-for="tab in favoriteTabs" :key="tab.key">
            <li class="nav-item">
              <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
              <a
                class="nav-link p-3"
                :class="{active: selectedType === tab.key}"
                @click="handleTabChange(tab.key)">
                {{ tab.label }}
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
              <label for="search-favorites" class="sr-only">
                {{ t("global.search-favorites") }}
              </label>
              <input
                id="search-favorites"
                v-model="searchQuery"
                type="text"
                name="search-favorites"
                :placeholder="t('global.search-favorites')"
                data-kt-user-table-filter="search"
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
                <span>{{ t("global.no-favorites") }}</span>
              </p>
            </div>
            <div class="text-center px-5">
              <img
                src="@/assets/media/illustrations/welcome.png"
                alt="No favorites"
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
              :page-current="currentPage"
              :items-per-page="itemsPerPage"
              :query-string="searchQuery"
              @on-sort="onSort">
              <template #id="{row: favorite}">
                {{ data.indexOf(favorite) + 1 }}
              </template>

              <template #name="{row: favorite}">
                <div class="favorite-name-cell">
                  <img
                    v-if="favorite.displayAvatar"
                    :src="favorite.displayAvatar"
                    :alt="favorite.displayName"
                    class="favorite-avatar" />
                  <span>{{ favorite.displayName }}</span>
                </div>
              </template>

              <template #meta="{row: favorite}">
                <span class="favorite-muted-cell">{{ favorite.displayMeta }}</span>
              </template>

              <template #details="{row: favorite}">
                <span class="favorite-muted-cell">{{ favorite.displayDetails }}</span>
              </template>

              <template #created_at="{row: favorite}">
                <span class="favorite-muted-cell">{{ favorite.displayCreatedAt }}</span>
              </template>

              <template #actions="{row: favorite}">
                <button
                  type="button"
                  aria-label="Delete"
                  class="btn btn-icon btn-light-danger deletetooltip"
                  @click="deleteFavorite(favorite.id)">
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
import {computed, defineComponent, onBeforeMount, provide, ref} from "vue"
import {useI18n} from "vue-i18n"

const favoriteTabs = [
  {key: "Tutors", type: 1, label: "Tutors"},
  {key: "Courses", type: 2, label: "Courses"},
  {key: "Group_classes", type: 3, label: "Group classes"}
]

export default defineComponent({
  name: "favorites-list",
  components: {Toolbar, DataTable},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const selectedType = ref("Tutors")
    const searchQuery = ref("")

    const selectedTab = computed(() => {
      return favoriteTabs.find((tab) => tab.key === selectedType.value) || favoriteTabs[0]
    })

    const metaColumnLabel = computed(() => {
      if (selectedTab.value.type === 1) return t("global.country")
      if (selectedTab.value.type === 2) return "Instructor"
      return "Tutor"
    })

    const detailsColumnLabel = computed(() => {
      if (selectedTab.value.type === 1) return t("global.phone")
      return t("global.price")
    })

    const header = computed(() => [
      {columnName: "#", columnLabel: "id", sortEnabled: true, columnWidth: 60},
      {columnName: t("global.name"), columnLabel: "name", sortEnabled: true, columnWidth: 300},
      {
        columnName: metaColumnLabel.value,
        columnLabel: "meta",
        sortEnabled: false,
        columnWidth: 170
      },
      {
        columnName: detailsColumnLabel.value,
        columnLabel: "details",
        sortEnabled: false,
        columnWidth: 160
      },
      {
        columnName: t("global.created-at"),
        columnLabel: "created_at",
        sortEnabled: true,
        columnWidth: 170
      },
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 120
      }
    ])

    const withFallback = (value, fallback = "-") => value || fallback

    const formatSimpleDate = (value) => {
      if (!value) return "-"
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return "-"
      return date.toLocaleDateString()
    }

    const toAssetUrl = (value) => {
      if (!value) return ""
      if (String(value).startsWith("http")) return value
      return `${import.meta.env.VITE_APP_Public_URL}/storage/${value}`
    }

    const mapTutorFavorite = (item) => {
      const tutor = item?.tutor || {}

      return {
        ...item,
        displayAvatar: toAssetUrl(tutor.avatar),
        displayName: withFallback(tutor.full_name || tutor.name),
        displayMeta: withFallback(tutor?.profile?.country),
        displayDetails: withFallback(tutor.phone),
        displayCreatedAt: formatSimpleDate(item.created_at)
      }
    }

    const mapCourseFavorite = (item) => {
      const course = item?.course || {}
      const title = course?.langs?.[0]?.title || (course.id ? `Course #${course.id}` : "-")
      const pricing =
        course?.final_price !== null && course?.final_price !== undefined
          ? `${course.final_price}`
          : course?.is_free
          ? "Free"
          : withFallback(course?.price)

      return {
        ...item,
        displayAvatar: toAssetUrl(course?.course_image_full || course?.course_image),
        displayName: withFallback(title),
        displayMeta: withFallback(
          course?.instructor_id ? `Instructor #${course.instructor_id}` : "-"
        ),
        displayDetails: pricing,
        displayCreatedAt: formatSimpleDate(item.created_at)
      }
    }

    const mapGroupClassFavorite = (item) => {
      const groupClass = item?.group_class || {}
      const name =
        groupClass?.name ||
        groupClass?.langs?.[0]?.title ||
        (groupClass?.id ? `Class #${groupClass.id}` : "-")

      return {
        ...item,
        displayAvatar: toAssetUrl(groupClass?.image_info?.path || groupClass?.image),
        displayName: withFallback(name),
        displayMeta: withFallback(groupClass?.tutor_id ? `Tutor #${groupClass.tutor_id}` : "-"),
        displayDetails: withFallback(groupClass?.price),
        displayCreatedAt: formatSimpleDate(item.created_at)
      }
    }

    const mapFavoriteByType = (item) => {
      if (selectedTab.value.type === 1) return mapTutorFavorite(item)
      if (selectedTab.value.type === 2) return mapCourseFavorite(item)
      return mapGroupClassFavorite(item)
    }

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true

      const hasQuery = Boolean(queryString)
      const safeQueryString = hasQuery ? queryString : ""
      const typeQuery = `${hasQuery ? "&" : "?"}type=${selectedTab.value.type}`
      const url = `/favorites${safeQueryString}${typeQuery}`

      axiosClient
        .get(url)
        .then((response) => {
          const result = response?.data?.result || {}
          const rawData = Array.isArray(result?.data) ? result.data : []

          data.value = rawData.map(mapFavoriteByType)
          itemsTotal.value = result?.total || 0
          currentPage.value = result?.current_page || 1
          itemsPerPage.value = result?.per_page || 10
        })
        .finally(() => {
          loading.value = false
        })
    }

    const searchDataTableBodyRows = function searchDataTableBodyRows() {
      const query = `?q=${encodeURIComponent(searchQuery.value || "")}`
      getDataTableBodyRows(query)
    }

    const handleTabChange = function handleTabChange(type) {
      selectedType.value = type
      searchQuery.value = ""
      getDataTableBodyRows()
    }

    const onSort = function onSort(sort) {
      const reverse = sort.order === "ASC".toLowerCase()
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    const deleteFavorite = function deleteFavorite(id) {
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
          axiosClient.delete(`/favorites/delete/${id}`).then(() => {
            getDataTableBodyRows()
          })
        }
      })
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)

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
      searchQuery,
      searchDataTableBodyRows,
      onSort,
      deleteFavorite,
      favoriteTabs,
      selectedType,
      handleTabChange
    }
  }
})
</script>

<style scoped>
.favorite-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.favorite-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.favorite-muted-cell {
  color: #4b5563;
}
</style>
