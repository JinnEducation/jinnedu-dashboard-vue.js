<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div id="application-toolbar" class="app-toolbar py-3 py-lg-6" style="margin-top: 100px;">
    <div id="application-toolbar-container" class="app-container container-xxl d-flex flex-stack">
      <div class="page-title d-flex flex-column justify-content-center flex-wrap me-3">
        <h1
          class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
          {{ title }}
        </h1>
        <ul class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
          <li class="breadcrumb-item text-muted">
            <router-link to="/dashboard" class="text-muted text-hover-primary">{{
              t("global.home")
            }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "dashboard-toolbar",
  props: {
    title: {type: String, required: true},
    breadcrumbs: {type: Array, required: false, default: null}
  },
  setup() {
    const {t} = useI18n()
    return {t}
  }
})
</script>
