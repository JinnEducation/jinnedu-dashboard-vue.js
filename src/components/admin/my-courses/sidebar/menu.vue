<template>
  <div class="app-sidebar-menu flex-column-fluid">
    <div id="application-sidebar-menu-wrapper" data-kt-scroll="true" data-kt-scroll-wrappers="#application-sidebar-menu"
      data-kt-scroll-dependencies="#application-sidebar-logo, #application-sidebar-footer"
      data-kt-scroll-activate="true" data-kt-scroll-height="700px" data-kt-scroll-offset="100px"
      data-kt-scroll-save-state="true" class="app-sidebar-wrapper hover-scroll-overlay-y my-5">
      <div id="#application-sidebar-menu" data-kt-menu="true" data-kt-menu-expand="true" style="margin: 75px 0px"
        class="menu menu-column menu-rounded menu-sub-indention px-3 pb-16">
        <sidebar-menu-item v-for="element in filteredNavigation" :key="element.title" :title="element.title"
          :icon="element.icon" :children="element.children" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onBeforeMount } from "vue"
import SidebarMenuItem from "./menu-item.vue"
import { useStore } from "vuex"

export default defineComponent({
  name: "sidebar-menu",
  components: { SidebarMenuItem },
  setup() {
    const store = useStore()
    const { userInfo } = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type

    const filteredTitles = [
      "global.tutor-conferences",
      "global.student-conferences",
      "global.my-orders"
    ]

    const filterItems = (items) => {
      return items?.filter((item) => {
        const shouldFilter = userType === 0 && filteredTitles.includes(item.title)
        if (shouldFilter) return false // Exclude if the parent item should be filtered
        if (item.children) {
          item.children = filterItems(item.children) // Recursively filter children
          return item.children.length > 0 // Include parent item only if it has remaining children
        }
        return true // Include if it's not to be filtered and has no children
      })
    }

    const filterNavigation = () => {
      const originalNavigation = store.state.navigation
      return filterItems(originalNavigation)
    }

    const filteredNavigation = computed(() => {
      return filterNavigation()
    })

    onBeforeMount(() => store.dispatch("getAPINavigation"))

    return { filteredNavigation }
  }
})
</script>

<!-- data-kt-scroll-height="auto" -->
