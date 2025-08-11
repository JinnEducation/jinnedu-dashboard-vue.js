<template>
  <div>
    <toolbar :title="t('global.contact-us-management')" />
    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="card">
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
                    {{ t("global.no-contact-us") }}
                  </span>
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
                :page-current="currentPage"
                :items-per-page="itemsPerPage"
                :items-per-page-dropdown-enabled="true"
                @on-sort="onSort"
                @on-items-select="onItemsSelect">
                <template #name="{row: contact}">
                  {{ contact.f_name }} {{ contact.l_name }}
                </template>
                <template #email="{row: contact}">
                  {{ contact.email }}
                </template>
                <template #phone="{row: contact}">
                  {{ contact.mobile }}
                </template>
                <template #message="{row: contact}">
                  <button
                    type="button"
                    aria-label="Register"
                    class="btn btn-light-primary p-3 me-2"
                    @click="openModal(contact)">
                    {{ t("global.details") }}
                  </button>
                </template>
              </data-table>

              <template v-if="selectedContact">
                <div class="modal-overlay">
                  <div class="modal">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <!-- Modal header -->
                        <div class="modal-header">
                          <h5 class="modal-title">{{ t("global.contact-details") }}</h5>
                          <button
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            @click="closeModal"></button>
                        </div>
                        <!-- Modal body -->
                        <div class="modal-body">
                          <p>
                            <strong>{{ t("global.name") }}:</strong> {{ selectedContact.f_name }}
                            {{ selectedContact.l_name }}
                          </p>
                          <p>
                            <strong>{{ t("global.email") }}:</strong> {{ selectedContact.email }}
                          </p>
                          <p>
                            <strong>{{ t("global.phone") }}:</strong> {{ selectedContact.mobile }}
                          </p>
                          <p>
                            <strong>{{ t("global.message") }}:</strong>
                            {{ selectedContact.message }}
                          </p>
                        </div>
                        <!-- Modal footer -->
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" @click="closeModal">
                            {{ t("global.close") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import DataTable from "@/components/admin/data-table/index.vue"
import axiosClient from "@/plugins/axios"
import arraySort from "array-sort"
import {defineComponent, onBeforeMount, provide, ref} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "contact-us",
  components: {Toolbar, DataTable},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const selectedContact = ref(null)

    const header = ref([
      {
        columnName: t("global.name"),
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.email"),
        columnLabel: "email",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.phone"),
        columnLabel: "phone",
        sortEnabled: false,
        columnWidth: 175
      },
      {
        columnName: t("global.message"),
        columnLabel: "message",
        sortEnabled: false,
        columnWidth: 175
      }
    ])

    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const idsSelected = ref([])

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/contact-us${queryString}`)
        .then((response) => {
          data.value = response.data.result.data
          currentPage.value = response.data.result.current_page
          itemsPerPage.value = response.data.result.per_page
          itemsTotal.value = response.data.result.total
        })
        .finally(() => {
          loading.value = false
        })
    }

    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      getDataTableBodyRows(`?${["q", e.target.value].join("=")}`)
    }

    const openModal = function openModal(contact) {
      selectedContact.value = contact
    }

    const closeModal = function closeModal() {
      selectedContact.value = null
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

    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
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
      searchDataTableBodyRows,
      getDataTableBodyRows,
      onSort,
      onItemsSelect,
      selectedContact,
      openModal,
      closeModal
    }
  }
})
</script>
<style scoped>
/* Your existing scoped styles */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 500px;
  height: 450px;
  display: flex;
  left: 450px;
}

.modal-content {
  padding: 20px;
  width: 500px;
  height: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.modal-title {
  margin: 0;
}

.modal-body {
  padding-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
