<template>
  <toolbar :title="t('global.tutor-finance')" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
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
              <label for="search-tutor-finance" class="sr-only">
                {{ t("global.search-tutor-finance") }}
              </label>
              <input
                id="search-tutor-finance"
                type="text"
                name="search-finance"
                :placeholder="t('global.search-tutor-finance')"
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
                <span>
                  {{ t("global.no-finance-records") }}
                </span>
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
              :page-current="currentPage"
              :items-total="itemsTotal"
              :items-per-page="itemsPerPage"
              :items-per-page-dropdown-enabled="true"
              @on-sort="onSort">
              <template #name="{row: item}">
                <div class="d-flex align-items-center justify-content-start">
                  {{ getItemName(item) }}
                </div>
              </template>

              <template #total="{row: item}">
                {{ formatCurrency(item.total) }}
              </template>

              <template #percentage="{row: item}">
                {{ item.percentage }}%
              </template>

              <template #fee="{row: item}">
                {{ formatCurrency(item.fee) }}
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
import axios from "@/plugins/axios"
import arraySort from "array-sort"
import {defineComponent, ref, onBeforeMount} from "vue"
import {useI18n} from "vue-i18n"
import {useStore} from "vuex"

export default defineComponent({
  name: "tutor-finance",
  components: {Toolbar, DataTable},
  setup() {
    const {t} = useI18n()
    const store = useStore()
    const loading = ref(false)
    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const initItems = ref([])

    const header = ref([
      {columnName: t("global.name"), columnLabel: "name", sortEnabled: true, columnWidth: 200},
      {columnName: t("global.total"), columnLabel: "total", sortEnabled: true, columnWidth: 150},
      {columnName: t("global.percentage"), columnLabel: "percentage", sortEnabled: true, columnWidth: 150},
      {columnName: t("global.fee"), columnLabel: "fee", sortEnabled: true, columnWidth: 150}
    ])

    const getItemName = (item) => {
      if (item.ref_type === 1) {
        return item.group_class_name || t("global.group-class")
      } else if (item.ref_type === 4) {
        return t("global.private-lesson")
      }
      return t("global.unknown")
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat(store.state.language, {
        style: "currency",
        currency: "USD"
      }).format(value)
    }

    const getDataTableBodyRows = function(queryString = "") {
      loading.value = true
      axios.get(`/tutor-finance/my-index${queryString}`)
        .then((response) => {
          data.value = response.data.result.data
          itemsTotal.value = response.data.result.total
          currentPage.value = response.data.result.current_page
          itemsPerPage.value = response.data.result.per_page
        })
        .catch((error) => {
          console.error("Error fetching finance data:", error)
          store.dispatch("showToast", {
            type: "error",
            message: t("global.failed-to-load-finance-data")
          })
        })
        .finally(() => {
          loading.value = false
        })
    }

    const searchDataTableBodyRows = function(e) {
      getDataTableBodyRows(`?q=${e.target.value}`)
    }

    const onSort = function(sort) {
      const reverse = sort.order === "ASC".toLowerCase()
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    onBeforeMount(() => {
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
      getItemName,
      formatCurrency,
      searchDataTableBodyRows,
      onSort
    }
  }
})
</script>