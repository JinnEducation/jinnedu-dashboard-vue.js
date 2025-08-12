<!-- Done Reviewing -->
<template>
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <auth-logo />
    <div class="d-flex flex-column flex-column-fluid flex-center p-10 w-lg-50">
      <div class="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-450px">
        <sign-up-header />
        <div class="py-20">
          <new-password-form />
        </div>
        <form-footer />
      </div>
    </div>
    <div
      class="d-none d-lg-flex flex-lg-row-fluid w-50 bgi-size-cover bgi-position-y-center bgi-position-x-start bgi-no-repeat"
      style="background-image: url(../../../../src/assets/media/auth/background.png)" />
  </div>
</template>

<script>
import {defineComponent, onMounted} from "vue"
import NewPasswordForm from "../../../components/admin/new-password/form.vue"
import SignUpHeader from "../../../components/admin/sign-up/header.vue"
import FormFooter from "../../../components/admin/uis/form/footer.vue"
import AuthLogo from "../../../components/admin/auth/logo.vue"

export default defineComponent({
  name: "forgot-password",
  components: {
    AuthLogo,
    SignUpHeader,
    NewPasswordForm,
    FormFooter
  },
  setup() {
    onMounted(() => {
      KTUtil.onDOMContentLoaded(() => {
        KTComponents.init()
        KTThemeMode.init()
        KTThemeModeUser.init()
      })
    })
  }
})
</script>
