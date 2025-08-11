<template>
  <div
    @click="toggleSidebar"
    class=" btn btn-icon btn-shadow btn-color-muted btn-active-color-primary text-xl px-6 h-40px w-40px position-relative z-index-3"
    style="z-index: 1000000 !important;"
    :style="{transform: isCollapsed ? 'rotate(90deg) !important' : 'rotate(-90deg)'}">
    <!-- :style="{transform: isCollapsed ? 'rotate(90deg) !important' : 'rotate(-90deg)'}" -->
    <!-- <span class="svg-icon svg-icon-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="none">
        <path
          d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
          fill="currentColor"
          opacity="0.5" />
        <path
          d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
          fill="currentColor" />
      </svg>
    </span> -->
    <!-- <i class="fa-regular fa-square-caret-left " style="font-size: 30px;"></i> -->
    <i class="fa-solid fa-arrows-up-to-line" style="font-size: 25px"></i>
    <!-- <i class="fa-solid fa-bars"  style="font-size: 25px"></i> -->
  </div>
</template>

<script>
import {defineComponent, ref} from "vue"

export default defineComponent({
  name: "sidebar-toggle",
  setup() {
    const isCollapsed = ref(false)

    const toggleSidebar = () => {
      const sidebar = document.querySelector(".app-sidebar")
      if (sidebar) {
        // Toggle the collapsed state
        isCollapsed.value = !isCollapsed.value

        // Add transition for smooth animation
        sidebar.style.transition = "width 0.3s ease"

        // Set width based on state
        sidebar.style.width = isCollapsed.value ? "200px" : "0"
      }
    }

    return {
      isCollapsed,
      toggleSidebar
    }
  }
})
</script>

<style scoped>
/* Remove the custom rotate-180 class as we're using Bootstrap's utility */
</style>
