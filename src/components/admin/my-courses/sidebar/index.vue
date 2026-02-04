<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <!-- <div
    data-kt-drawer="true"
    data-kt-drawer-name="app-sidebar"
    data-kt-drawer-toggle="#application-sidebar-mobile-toggle"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-width="225px"
    data-kt-drawer-direction="start"
    data-kt-drawer-overlay="true"
    class="app-sidebar flex-column">
    <sidebar-logo />
    <sidebar-menu />
  </div> -->
  <sidebar-toggle v-if="isMobile" />
  <div class="app-sidebar flex-column pt-20 mt-16">
    <!-- <sidebar-logo /> -->
    <sidebar-menu />
  </div>
</template>

<script>
import {defineComponent, ref, onMounted} from "vue"
import SidebarLogo from "./logo.vue"
import SidebarToggle from "./toggle.vue"
import SidebarMenu from "./menu.vue"

export default defineComponent({
  name: "dashboard-sidebar",
  components: {SidebarLogo, SidebarMenu, SidebarToggle},
  setup() {
    const isMobile = ref(false)

    const checkScreen = () => {
      isMobile.value = window.innerWidth < 992
    }

    onMounted(() => {
      checkScreen()
      window.addEventListener("resize", checkScreen)
    })

    return {
      isMobile
    }
  }
})
</script>
