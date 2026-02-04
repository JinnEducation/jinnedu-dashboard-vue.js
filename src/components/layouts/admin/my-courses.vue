<!-- Done Reviewing: 30/01/2023 -->
<template>
  <div id="kt_app_page" class="app-page flex-column flex-column-fluid">
    <WebsiteHeader />
    <div id="application-wrapper" class="app-wrapper flex-column flex-row-fluid" :style="{ marginTop: headerHeight + 'px' }">
      <div id="application-main" class="app-main flex-column flex-row-fluid">
        <div class="d-flex flex-column flex-column-fluid">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue"
import DashboardHeader from "../../admin/my-courses/header/index.vue"
import DashboardWrapper from "../../admin/my-courses/wrapper.vue"
import WebsiteHeader from "../../admin/websiteHeader.vue"

export default defineComponent({
  name: "dashboard-layout",
  components: {
    DashboardHeader,
    WebsiteHeader,
    DashboardWrapper
  },
  setup() {
    const headerHeight = ref(0)
    onMounted(() => {
      document.body.classList.remove("app-blank")
      document.body.classList.add("app-default")
      KTUtil.onDOMContentLoaded(() => {
        KTComponents.init()
        KTThemeMode.init()
        KTThemeModeUser.init()
        KTAppSidebar.init()
        KTMenu.init()
      })
      const header = document.querySelector('.main-header-content')
      if (header) {
        headerHeight.value = header.offsetHeight
      }
    })
    return {
      headerHeight
    }
  }
})
</script>
<style scoped>
#application-wrapper{
  margin-right: 0;
  margin-left: 0;
}
</style>