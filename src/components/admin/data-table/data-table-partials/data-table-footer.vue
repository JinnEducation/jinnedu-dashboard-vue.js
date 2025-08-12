<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div class="row">
    <data-table-items-per-page-select
      v-model:itemsPerPage="dataTableItemsPerPage"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
      :page-current="dataTablePageCurrent" />
    <data-table-pagination
      v-if="dataTablePageTotal > 1"
      :items-total="itemsTotal"
      :items-per-page="itemsPerPage"
      :page-total="dataTablePageTotal"
      :page-current="dataTablePageCurrent"
      :query-string="queryString"
      @on-page-change="onPageChange" />
  </div>
</template>

<script>
import {computed, defineComponent, inject, onMounted, ref, watch} from "vue"
import createQueryString from "../../../../core/helpers/query-string"
import DataTableItemsPerPageSelect from "./data-table-content/data-table-items-per-page-select.vue"
import DataTablePagination from "./data-table-content/data-table-pagination.vue"

export default defineComponent({
  name: "data-table-footer",
  components: {DataTableItemsPerPageSelect, DataTablePagination},
  props: {
    itemsTotal: {type: Number, required: false, default: 10},
    itemsPerPage: {type: Number, required: false, default: 10},
    itemsPerPageDropdownEnabled: {type: Boolean, required: false, default: true},
    pageCurrent: {type: Number, required: false, default: 1},
    queryString: {type: String, required: false, default: ""}
  },
  emits: ["update:itemsPerPage", "on-page-change"],
  setup(props, {emit}) {
    const getDataTableBodyRows = inject("getDataTableBodyRows")
    const dataTableItemsPerPageInput = ref(props.itemsPerPage)
    const dataTablePageCurrent = ref(props.pageCurrent)

    // Reset pagination (set current page = 1)
    // .. when total items changes
    // watch(
    //   () => props.itemsTotal,
    //   () => {
    //     dataTablePageCurrent.value = 1
    //   }
    // )

    // Fetch data when items per page value changes
    // .. using new query string
    watch(
      () => dataTableItemsPerPageInput.value,
      () => {
        dataTablePageCurrent.value = 1
        const queryString = createQueryString(
          dataTablePageCurrent.value,
          dataTableItemsPerPageInput.value
        )

        getDataTableBodyRows(queryString)
      }
    )

    const dataTableItemsPerPage = computed({
      get() {
        return props.itemsPerPage
      },
      set(value) {
        dataTableItemsPerPageInput.value = value
        emit("update:itemsPerPage", value)
      }
    })

    const dataTablePageTotal = computed(() => {
      return Math.ceil(props.itemsTotal / dataTableItemsPerPage.value)
    })

    const onPageChange = function onPageChange(pageChanged) {
      dataTablePageCurrent.value = pageChanged
      emit("on-page-change", dataTablePageCurrent.value, props.queryString)
    }

    onMounted(() => {
      dataTableItemsPerPageInput.value = props.itemsPerPage
    })

    return {
      dataTablePageTotal,
      dataTableItemsPerPage,
      dataTablePageCurrent,
      onPageChange
    }
  }
})
</script>
