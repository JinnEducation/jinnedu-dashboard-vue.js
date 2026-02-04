<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div id="application-sidebar-logo" class="app-sidebar-logo d-flex align-items-center">
    <a :href="`${baseUrl}`" class="w-100 h-100 d-flex align-items-center justify-content-center">
      <img
        src="../../../../assets/media/logos/logo.png"
        alt="Default Sidebar Logo"
        class="h-100 app-sidebar-logo-default theme-light-show" />
      <img
        src="../../../../assets/media/logos/logo.png"
        alt="Dark Sidebar Logo"
        class="h-100 app-sidebar-logo-default theme-dark-show" />
      <img
        src="../../../../assets/media/logos/logo.png"
        alt="Small Sidebar Logo"
        class="w-100 app-sidebar-logo-minimize" />
    </a>
    <sidebar-toggle />
  </div>
</template>

<script>
import {defineComponent} from "vue"
import SidebarToggle from "./toggle.vue"

export default defineComponent({
  name: "sidebar-logo",
  components: {SidebarToggle},
  setup() {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL
    return {baseUrl}
  }
})
</script>
