<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div class="overlay-layer card-rounded bg-dark bg-opacity-5">
    <div role="status" class="spinner-border text-primary">
      <span>Loading ...</span>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue"

export default defineComponent({name: "data-table-loading"})
</script>
