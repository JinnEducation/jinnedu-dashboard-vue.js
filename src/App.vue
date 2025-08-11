<template>
  <div
    v-if="loading"
    class="overlay-layer card-rounded d-flex justify-content-center align-items-center position-fixed bg-white"
    style="width: 100vw; height: 100vh; z-index: 1000">
    <div role="status" class="spinner-border text-primary">
      <span class="sr-only">Loading ...</span>
    </div>
  </div>
  
  <SessionControl />
  <SessionWarning />
  
  <router-view v-slot="{Component}">
    <component :is="Component" v-if="!loading" />
  </router-view>
</template>

<script>
import { computed, defineComponent } from "vue";
import store from "./store";
import SessionControl from "@/components/controlSession/SessionControl.vue";
import SessionWarning from "@/components/controlSession/SessionWarning.vue";

export default defineComponent({
  name: "app",
  components: {
    SessionControl,
    SessionWarning
  },
  setup() {
    const loading = computed(() => store.state.loading);
    return { loading };
  }
});
</script>