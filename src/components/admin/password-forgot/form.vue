<template>
  <form ref="form" class="form w-100" @submit.prevent="handleFormSubmit">
    <div class="text-start mb-10">
      <h1 class="text-dark mb-3 fs-3x">
        {{ t("global.password-forgot-title") }}
      </h1>
      <div class="text-gray-400 fw-semibold fs-6">
        {{ t("global.password-forgot-description") }}
      </div>
    </div>
    <div class="fv-row mb-8">
      <form-input
        id="email"
        v-model:inputValue="user.email"
        :label="t('global.email')"
        type="email"
        name="email"
        :placeholder="t('global.email')" />
    </div>
    <div class="d-flex flex-stack">
      <div class="m-0">
        <button ref="button" type="submit" class="btn btn-primary me-2">
          <span class="indicator-label">{{ t("global.submit") }}</span>
          <span class="indicator-progress">
            {{ t("global.wait-please") }}
            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
          </span>
        </button>
        <router-link to="/auth/sign-in" class="btn btn-lg btn-light-primary fw-bold">
          {{ t("global.cancel") }}
        </router-link>
      </div>
    </div>
  </form>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRouter} from "vue-router"
import {useStore} from "vuex"
import {createSwal} from "../../../core/helpers/swal"
import FormInput from "../uis/form/input.vue"

export default defineComponent({
  name: "forgot-password-form",
  components: {FormInput},
  setup() {
    const {t} = useI18n()
    const router = useRouter()
    const store = useStore()
    const user = {email: null}
    const elements = {form: ref(null), button: ref(null), error: ref(null)}
    let validator

    const handleFormSubmit = function handleFormSubmit() {
      validator.validate().then((status) => {
        if (status.toLowerCase() === "valid") {
          elements.button.value.setAttribute("data-kt-indicator", "on")
          elements.button.value.disable = true
          elements.button.value.ariaDisabled = true

          store
            .dispatch("passwordForgot", user)
            .then(() => {
              createSwal("global.email-sent").then((result) => {
                if (result.isConfirmed) {
                  router.push({name: "root"})
                }
              })
            })
            .catch((error) => {
              if (error.response.data.message) elements.error.value = error.response.data.message
              else elements.error.value = error.response.data.error

              Swal.fire({
                icon: "error",
                text: elements.error.value,
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            })
            .finally(() => {
              elements.button.value.removeAttribute("data-kt-indicator")
              elements.button.value.disabled = false
              elements.button.value.ariaDisabled = false
            })
        } else {
          Swal.fire({
            icon: "error",
            text: t("global.errors-detected"),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })
        }
      })
    }

    onMounted(() => {
      validator = FormValidation.formValidation(elements.form.value, {
        fields: {
          email: {
            validators: {
              notEmpty: {message: t("global.email-required")},
              regexp: {
                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("global.email-in-valid")
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row",
            eleInvalidClass: null,
            eleValidClass: null
          })
        }
      })
    })

    return {
      t,
      user,
      form: elements.form,
      button: elements.button,
      error: elements.error,
      validator,
      handleFormSubmit
    }
  }
})
</script>
