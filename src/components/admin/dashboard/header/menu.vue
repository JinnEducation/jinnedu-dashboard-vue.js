<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div
    data-kt-drawer="true"
    data-kt-drawer-name="app-header-menu"
    data-kt-drawer-toggle="#kt_app_header_menu_toggle"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-width="250px"
    data-kt-drawer-direction="end"
    data-kt-drawer-overlay="true"
    data-kt-swapper="true"
    data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
    data-kt-swapper-parent="{default: '#application-body', lg: '#application-header-wrapper'}"
    class="app-header-menu app-header-mobile-drawer align-items-stretch"></div>
</template>

<script>
import {defineComponent} from "vue"

export default defineComponent({name: "header-menu"})
</script>
