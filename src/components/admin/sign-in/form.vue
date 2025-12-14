<template>
  <form id="kt_sign_in_form" ref="form" action="#" novalidate="false" class="form w-100"
    @submit.prevent="handleFormSubmission">
    <div class="card-body">
      <div class="text-start mb-10">
        <h1 class="text-dark mb-3 fs-3x">
          <span class="text-primary">
            {{ t("global.login") }}
          </span>
        </h1>
        <!-- <div class="d-flex flex-start py-2">
          <div class="m-0">
            <span class="text-black fw-bold fs-5 me-2">{{ t("global.sign-in-header") }}</span>
            <router-link to="/auth/sign-up" class="link-primary fw-bold fs-5">{{
              t("global.sign-up")
            }}</router-link>
          </div>
        </div> -->
        <!-- <h1 class="text-dark mb-3 fs-3x">{{ t("global.sign-in-title") }}</h1> -->
        <div class="text-black fw-semibold fs-6">{{ t("global.sign-in-description") }}</div>
      </div>
      <div class="fv-row mb-8">
        <form-input id="email" v-model:inputValue="user.email" :label="t('global.email')" type="email" name="email"
          :placeholder="t('global.email')" />
      </div>
      <div class="fv-row mb-7">
        <form-input id="password" ref="formPassword" v-model:inputValue="user.password" :label="t('global.password')"
          type="password" name="password" :placeholder="t('global.password')" />
        <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2 password-icon"
          @click="handlePasswordInputShow" @keypress="handlePasswordInputShow">
          <i class="bi bi-eye-slash fs-2"></i>
          <i class="bi bi-eye fs-2 d-none"></i>
        </span>
      </div>
      <div class="d-flex flex-column">
        <div class="d-flex justify-content-between mb-10">
          <div class="d-flex align-items-center gap-5">
            <form-actions ref="button" button-id="kt_sign_in_submit" />

            <router-link to="/auth/forgot-password" class="text-dark">
              {{ t("global.password-forgot") }}
            </router-link>
          </div>
          <div class="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold">
            <div></div>
            <label for="remember-me" class="form-check form-check-custom form-check-solid">
              <input id="remember-me" type="checkbox" name="remember-me" checked
                class="form-check-input h-20px w-20px" />
              <span class="form-check-label fw-semibold text-black">{{
                t("global.remember-me")
              }}</span>
            </label>
          </div>
        </div>
        <!-- hide in admin  -->
        <div v-if="type !== 0">
          <h1 style="font-weight: bold; margin: 20px 0px">{{ t("global.or-sign-in-with") }}</h1>
          <google-actions />
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useStore } from "vuex"
import GoogleActions from "../uis/form/google-actions.vue"
import FormActions from "../uis/form/actions.vue"

import FormInput from "../uis/form/input.vue"

export default defineComponent({
  name: "sign-in-form",

  components: { FormInput, GoogleActions, FormActions },
  props: { type: { type: String, required: false, default: null } },
  setup(props) {
    const { t } = useI18n()
    const store = useStore()
    const user = { email: null, password: null, type: props.type }
    const elements = { form: ref(null), button: ref(null), formError: ref(null) }
    const serverUrl = import.meta.env.VITE_APP_API_BASE_URL ?? "http://127.0.0.1:8000"
    let validator

    const handleFormSubmission = function handleFormSubmission() {
      validator.validate().then((status) => {
        if (status.toLowerCase() === "valid") {
          elements.button.value.button.setAttribute("data-kt-indicator", "on")
          elements.button.value.button.disable = true
          elements.button.value.button.ariaDisabled = true

          store
            .dispatch("signIn", user)
            .then((response) => {
              console.log(response)
              if (response.token) {
                window.open(
                  `${serverUrl}/bridge-login/${response.token}`,
                  "_blank"
                )
                setTimeout(() => {
                  window.location.assign(window.location.origin)
                }, 1500)
              } else {
                Swal.fire({
                  icon: "error",
                  text: "Invalid Email or Password or Email Not Found",
                  confirmButtonText: t("global.got-it"),
                  buttonsStyling: false,
                  customClass: { confirmButton: "btn btn-danger" }
                })
              }
            })
            .catch((error) => {
              // Handle errors from sign-in
              const errorMessage = "An error occurred during sign-in."

              // if (error.response && error.response.data) {
              //   if (error.response.data.message) {
              //     errorMessage = error.response.data.message
              //   } else if (error.response.data.error) {
              //     errorMessage = error.response.data.error
              //   }
              // }

              Swal.fire({
                icon: "error",
                text: errorMessage,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: { confirmButton: "btn btn-danger" }
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
            customClass: { confirmButton: "btn btn-danger" }
          })
        }
      })
    }

    const handlePasswordInputShow = function handlePasswordInputShow() {
      if (document.querySelector("#password").getAttribute("type") === "password")
        document.querySelector("#password").setAttribute("type", "text")
      else document.querySelector("#password").setAttribute("type", "password")

      document.querySelector(".bi-eye-slash").classList.toggle("d-none")
      document.querySelector(".bi-eye").classList.toggle("d-none")
    }

    const handleFormValidation = function handleFormValidation() {
      validator = FormValidation.formValidation(elements.form.value, {
        fields: {
          email: {
            validators: {
              notEmpty: { message: t("global.email-required") },
              regexp: {
                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("global.email-in-valid")
              }
            }
          },
          password: {
            validators: {
              notEmpty: {
                message: t("global.password-required")
              }
            }
          }
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger({
            event: { password: false }
          }),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row",
            eleInvalidClass: "",
            eleValidClass: ""
          })
        }
      })
    }

    onMounted(() => {
      handleFormValidation()
    })

    return {
      t,
      user,
      form: elements.form,
      button: elements.button,
      formError: elements.formError,
      validator,
      handleFormSubmission,
      handlePasswordInputShow
    }
  }
})
</script>
