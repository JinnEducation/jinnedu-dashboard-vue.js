<!-- Done Reviewing -->
<template>
  <form
    id="kt_new_password_form"
    ref="form"
    action="#"
    class="form w-100"
    @submit.prevent="handleFormSubmission">
    <div class="text-start mb-10">
      <h1 class="text-dark mb-3 fs-3x" data-kt-translate="password-reset-title">
        {{ t("global.password-new-title") }}
      </h1>
      <div class="text-gray-400 fw-semibold fs-6" data-kt-translate="password-reset-desc">
        {{ t("global.password-new-description") }}
      </div>
    </div>
    <div class="fv-row mb-10">
      <form-input
        id="email"
        v-model:inputValue="user.email"
        label="email"
        type="email"
        name="email"
        :placeholder="t('global.email')" />
    </div>
    <div ref="formPasswordMeter" data-kt-password-meter="true" class="fv-row mb-10">
      <div class="mb-1">
        <div class="position-relative mb-3">
          <form-input
            id="password"
            ref="formPassword"
            v-model:inputValue="user.password"
            label="password"
            type="password"
            name="password"
            :placeholder="t('global.password')"
            @handle-input-password="handleInputPassword" />
          <span
            data-kt-password-meter-control="visibility"
            class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2 password-icon">
            <i class="bi bi-eye-slash fs-2"></i>
            <i class="bi bi-eye fs-2 d-none"></i>
          </span>
        </div>
        <div data-kt-password-meter-control="highlight" class="d-flex align-items-center mb-3">
          <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
          <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
          <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
          <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px" />
        </div>
      </div>
      <div data-kt-translate="sign-up-hint" class="text-muted">
        {{ t("global.password-strength") }}
      </div>
    </div>
    <div class="fv-row mb-10">
      <form-input
        id="password-confirm"
        v-model:inputValue="user.passwordConfirmation"
        label="Confirm Password"
        type="password"
        name="password-confirm"
        :placeholder="t('global.password-confirm')" />
    </div>
    <form-actions ref="button" button-id="kt_new_password_submit" />
  </form>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import FormActions from "../uis/form/actions.vue"
import FormInput from "../uis/form/input.vue"

export default defineComponent({
  name: "password-new-form",
  components: {FormInput, FormActions},
  setup() {
    const {t} = useI18n()
    const router = useRouter()
    const route = useRoute()
    const {token} = route.params
    const store = useStore()
    const user = {
      email: null,
      password: null,
      passwordConfirmation: null
    }

    const elements = {
      form: ref(null),
      formPassword: ref(null),
      formPasswordMeter: ref(null),
      button: ref(null),
      formError: ref(null)
    }

    let passwordMeter
    let validator

    const validatePassword = function validatePassword() {
      return passwordMeter.getScore() === 100
    }

    const handleFormValidation = function handleFormValidation() {
      validator = FormValidation.formValidation(elements.form.value, {
        fields: {
          "password": {
            validators: {
              notEmpty: {message: t("global.password-required")},
              callback: {
                message: t("global.enter-valid-password"),
                callback(input) {
                  if (input.value.length > 0) {
                    return validatePassword()
                  }
                }
              }
            }
          },
          "password-confirm": {
            validators: {
              notEmpty: {message: t("global.password-confirm-required")},
              identical: {
                message: t("global.password-confirm-error"),
                compare() {
                  return elements.formPassword.value.input.value
                }
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger({
            event: {password: false}
          }),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row",
            eleInvalidClass: "",
            eleValidClass: ""
          })
        }
      })
    }

    const handleFormSubmission = function handleFormSubmission() {
      validator.revalidateField("password")
      validator.validate().then((status) => {
        if (status.toLowerCase() === "valid") {
          elements.button.value.button.setAttribute("data-kt-indicator", "on")
          elements.button.value.button.disable = true
          elements.button.value.button.ariaDisabled = true

          store
            .dispatch("resetPassword", {
              token,
              email: user.email,
              password: user.password,
              password_confirmation: user.passwordConfirmation
            })
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.password-reset-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              }).then((result) => {
                if (result.isConfirmed) {
                  router.push({name: "root"})
                }
              })
            })
            .catch((error) => {
              if (error.response.data.message) elements.button.value = error.response.data.message
              else elements.button.value = error.response.data.error

              Swal.fire({
                icon: "error",
                text: t("global.errors-detected"),
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            })
            .finally(() => {
              elements.button.value.button.removeAttribute("data-kt-indicator")
              elements.button.value.button.disabled = false
              elements.button.value.button.ariaDisabled = false
            })
        } else {
          Swal.fire({
            icon: "error",
            text: t("global.errors-detected"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })
        }
      })
    }

    const handleInputPassword = function handleInputPassword(value) {
      if (value.length > 0) validator.updateFieldStatus("password", "NotValidated")
    }

    onMounted(() => {
      KTPasswordMeter.createInstances("[data-kt-password-meter]")
      passwordMeter = KTPasswordMeter.getInstance(elements.formPasswordMeter.value)
      handleFormValidation()
    })

    return {
      t,
      user,
      form: elements.form,
      formPassword: elements.formPassword,
      formPasswordMeter: elements.formPasswordMeter,
      button: elements.button,
      formError: elements.formError,
      passwordMeter,
      validator,
      handleFormValidation,
      handleFormSubmission,
      handleInputPassword
    }
  }
})
</script>
