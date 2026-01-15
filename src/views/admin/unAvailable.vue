<template>
  <div>
    <toolbar :title="t('global.page-in-progress')" />

    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="card">
            <div class="card-body py-4 d-flex flex-column align-items-center justify-center">
              <!-- Icon -->
              <div
                class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <i class="fas fa-tools text-3xl text-gray-500" style="font-size: 88px;"></i>
              </div>

              <!-- Title -->
              <h1 class="mb-2 text-xl font-semibold text-gray-800">
                <!-- الصفحة قيد العمل -->
                {{ t("global.page-in-progress") }}
              </h1>

              <!-- Description -->
              <p class="text-sm text-gray-500">
                <!-- هذه الصفحة غير متوفرة حاليًا، نعمل على تجهيزها. -->
                <!-- This page is currently unavailable, we are working on preparing it. -->
                {{ t("global.page-is-currently-unavailable") }}
              </p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue"
import {useI18n} from "vue-i18n"
import Toolbar from "@/components/admin/dashboard/toolbar.vue"

export default defineComponent({
  name: "un-available",
  components: {Toolbar},
  setup() {
    const {t} = useI18n()

    return {
      t
    }
  }
})
</script>
