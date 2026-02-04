<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div id="application-wrapper" class="app-wrapper flex-column flex-row-fluid">
    <sidebar />
    <div id="application-main" class="app-main flex-column flex-row-fluid">
      <div class="d-flex flex-column flex-column-fluid">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue"
import Sidebar from "./sidebar/index.vue"

export default defineComponent({name: "my-courses-wrapper", components: {Sidebar}})

// export default defineComponent({name: "my-courses-wrapper"})
</script>

<style scoped>
/* #application-wrapper{
  margin-right: 0;
  margin-left: 0;
} */
</style>