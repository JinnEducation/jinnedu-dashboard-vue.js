<!-- Done Reviewing: 30/01/2023 -->
<template>
  <router-view />
</template>

<script>
import {defineComponent, onMounted} from "vue"

export default defineComponent({
  name: "auth-layout",
  setup() {
    onMounted(() => {
      document.body.classList.remove("app-default")
      document.body.classList.add("app-blank")
    })
  }
})
</script>
