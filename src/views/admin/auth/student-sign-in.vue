<!-- DONE REVIEWING: NEW -->
<template>
  <div>
    <div
      class="d-flex flex-column position-lg-fixed top-0 bottom-0 w-lg-350px w-xl-500px scroll-y bgi-size-cover bgi-position-center"
      :style="{'background-image': `url('${background}')`}">
      <div class="d-flex flex-column flex-center py-10 py-lg-20 mt-lg-20">
        <router-link to="/">
          <img alt="Logo" src="../../../assets/media/logos/logo.png" class="h-80px rounded" />
        </router-link>
        <div class="mt-10" style="padding: 20px 90px">
          <h1 style="font-size: 50px; color: white; font-weight: bold">
            {{ t("global.start-learning") }}
          </h1>
          <h1 style="font-size: 50px; color: red; font-weight: bold">
            {{ t("global.with-jin-edu") }}
          </h1>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column flex-lg-row flex-column-fluid">
      <auth-logo />
      <!-- <div class="d-flex flex-column flex-lg-row flex-column-fluid sign-in-form-container"> -->
      <div class="d-flex flex-column flex-center p-10 w-lg-100">
        <div class="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-450px">
          <!-- <sign-in-header /> -->
          <div class="py-10 ms-lg-20">
            <sign-in-form :type="1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted} from "vue"
import background from "../../../assets/media/auth/sign-up.png"
import AuthLogo from "../../../components/admin/auth/logo.vue"
import SignInForm from "../../../components/admin/sign-in/form.vue"
import FormFooter from "../../../components/admin/uis/form/footer.vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "sign-in",
  components: {
    AuthLogo,
    SignInForm,
    FormFooter
  },

  setup() {
    const {t} = useI18n()

    onMounted(() => {
      KTUtil.onDOMContentLoaded(() => {
        KTComponents.init()
        KTThemeMode.init()
        KTThemeModeUser.init()
      })
    })

    return {background, t}
  }
})
</script>
