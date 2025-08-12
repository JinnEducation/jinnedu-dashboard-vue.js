<template>
  <toolbar :title="t('global.accounting-management')" />

  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex justify-content-between gap-5">
              <div class="d-flex align-items-center position-relative my-1">
                <span class="svg-icon svg-icon-1 position-absolute ms-6">
                  <!-- Your SVG icon here -->
                </span>
                <label for="search-users" class="sr-only">
                  {{ t("global.search-tutors") }}
                </label>
                <input
                  id="search-users"
                  type="text"
                  name="search-users"
                  :placeholder="t('global.search-tutors')"
                  data-kt-user-table-filter="search"
                  class="form-control form-control-solid w-250px ps-14"
                  @keyup.enter="searchDataTableBodyRows" />
              </div>
              <!-- Select box for user type selection -->
              <div class="d-flex align-items-center position-relative my-1">
                <select v-model="selectedType" class="form-select" @change="getDataTableBodyRows()">
                  <option v-for="(type, index) in userTypes" :key="type" :value="type">
                    {{ t(`global.${type.toLowerCase()}`) }}
                  </option>
                </select>
              </div>
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
                <span>{{ t("global.no-users") }}</span>
              </p>
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
            <data-table
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
              <template #id="{row: user}">{{ data.indexOf(user) + 1 }}</template>
              <template #name="{row: user}">
                <div class="d-flex align-items-center justify-content-start">
                  <template v-if="user.avatar">
                    <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
                      <div class="symbol-label">
                        <img
                          :src="SERVER_PATH + '/' + user.avatar"
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
              <template #email="{row: user}">{{ user.email }}</template>
              <template #balance="{row: user}">{{ user.balance }}</template>
              <template #groupClassesCount="{row: user}">{{ user.group_class_count }}</template>
              <template #privateLessonCount="{row: user}">{{ user.private_lesson_count }}</template>
              <template #actions="{row: user}">
                <button
                  type="button"
                  class="btn btn-light-primary p-3 me-2"
                  @click="gotoUserInformation(user.id)">
                  {{ t("global.tutor-information") }}
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
import {defineComponent, onBeforeMount, onMounted, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRouter} from "vue-router"

export default defineComponent({
  name: "users-list",
  components: {Toolbar, DataTable},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const header = ref([
      {columnName: "#", columnLabel: "id", sortEnabled: true, columnWidth: 75},
      {columnName: t("global.name"), columnLabel: "name", sortEnabled: true, columnWidth: 150},
      {columnName: t("global.email"), columnLabel: "email", sortEnabled: true, columnWidth: 175},
      {
        columnName: t("global.balance"),
        columnLabel: "balance",
        sortEnabled: true,
        columnWidth: 150
      },
      {
        columnName: t("global.group_classes_count"),
        columnLabel: "groupClassesCount",
        sortEnabled: true,
        columnWidth: 150
      },
      {
        columnName: t("global.private_lesson_count"),
        columnLabel: "privateLessonCount",
        sortEnabled: true,
        columnWidth: 150
      },
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 175
      }
    ])

    const router = useRouter()
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const initUsers = ref([])
    const idsSelected = ref([])

    // Map for user types
    const userTypes = ["Admin", "Student", "Tutor"]
    const userTypeIndices = {
      Admin: 0,
      Student: 1,
      Tutor: 2
    }

    const selectedType = ref("Admin") // Default type selection

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true

      // Send userType based on selectedType using the indices
      const url = `/tutor-statistics/get-tutors${queryString}${queryString ? "&" : "?"}user_type=${userTypeIndices[selectedType.value]}`

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

    const onSort = function onSort(sort) {
      const reverse = sort.order === "ASC".toLowerCase()
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    const onItemsSelect = function onItemsSelect(itemsSelected) {
      idsSelected.value = itemsSelected.length === 0 ? [] : [...idsSelected.value, ...itemsSelected]
    }

    const gotoUserInformation = (userId) => {
      router.push({name: "userInformation", params: {id: userId}})
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
      selectedType,
      userTypes,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      onSort,
      onItemsSelect,
      gotoUserInformation
    }
  }
})
</script>
