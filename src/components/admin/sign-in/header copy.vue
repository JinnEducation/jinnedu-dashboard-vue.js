<!-- DONE REVIEWING: 25/06/2023 -->
<template>
  <div class="d-flex flex-stack py-2">
    <div class="me-2"></div>
    <div class="m-0">
      <span class="text-gray-400 fw-bold fs-5 me-2">{{ t("global.sign-in-header") }}</span>
      <router-link to="/auth/sign-up" class="link-primary fw-bold fs-5">{{
        t("global.sign-up")
      }}</router-link>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import {defineComponent} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "sign-in-header",
  setup() {
    const {t} = useI18n()
    return {t}
  }
})
</script>
