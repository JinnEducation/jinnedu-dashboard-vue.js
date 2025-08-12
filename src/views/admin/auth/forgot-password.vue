<!-- Done Reviewing -->
<template>
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <auth-logo />
    <div class="d-flex flex-column flex-column-fluid flex-center p-10 w-lg-50">
      <div class="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-450px">
        <sign-up-header />
        <div class="py-20">
          <forgot-password-form />
        </div>
        <form-footer />
      </div>
    </div>
    <div
      class="d-none d-lg-flex flex-lg-row-fluid w-50 bgi-size-cover bgi-position-y-center bgi-position-x-start bgi-no-repeat"
      :style="{'background-image': `url(${background})`}" />
  </div>
</template>

<script>
import {defineComponent, onMounted} from "vue"
import background from "../../../assets/media/auth/sign-in.png"
import AuthLogo from "../../../components/admin/auth/logo.vue"
import ForgotPasswordForm from "../../../components/admin/password-forgot/form.vue"
import SignUpHeader from "../../../components/admin/sign-up/header.vue"
import FormFooter from "../../../components/admin/uis/form/footer.vue"

export default defineComponent({
  name: "forgot-password",
  components: {
    AuthLogo,
    SignUpHeader,
    ForgotPasswordForm,
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

    return {background}
  }
})
</script>
