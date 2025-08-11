<template>
  <div class="d-flex flex-column flex-center flex-column-fluid">
    <div class="d-flex flex-column flex-center text-center p-10">
      <div class="card card-flush w-lg-650px py-5">
        <div class="card-body py-15 py-lg-20">
          <div class="mb-14">
            <router-link :to="{name: 'index'}">
              <img alt="Logo" src="../../../assets/media/logos/logo.png" class="h-80px" />
            </router-link>
          </div>
          <h1 class="fw-bolder text-gray-900 mb-5">
            {{
              verified
                ? "Your email has been verified successfully!"
                : "Please, verify your email using this button"
            }}
          </h1>
          <div class="fs-6 mb-8 mx-auto text-gray-700" style="max-width: 30rem">
            {{
              verified
                ? "Congratulations, now it is time to go back to your dashboard and start managing your profile partials"
                : "In order to be able to discover you dashboard partials, you need to verify your email first using this button"
            }}
          </div>
          <button v-if="verified" type="button" class="btn btn-primary" @click="handleGoHome">
            Go Home
          </button>
          <button
            v-else
            ref="formButtonSubmit"
            type="button"
            class="btn btn-lg btn-primary"
            @click="handleVerifyEmail">
            <span class="indicator-label">
              Verify Email
              <span class="d-inline-block svg-icon svg-icon-1x ms-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <polygon points="0 0 24 0 24 24 0 24" />
                    <path
                      d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z"
                      fill="currentColor"
                      fill-rule="nonzero" />
                    <path
                      d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z"
                      fill="currentColor"
                      fill-rule="nonzero"
                      opacity="0.5"
                      transform="translate(9, 11) rotate(-270) translate(-9, -11)" />
                  </g>
                </svg>
              </span>
            </span>
            <span class="indicator-progress">
              Please wait ...
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>
          <div class="mb-0">
            <img
              src="../../../assets/media/auth/email-verify.png"
              class="mw-100 mh-300px theme-light-show"
              alt="" />
            <img
              src="../../../assets/media/auth/email-verify-dark.png"
              class="mw-100 mh-300px theme-dark-show"
              alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"

export default defineComponent({
  name: "email-verify",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const {id, token} = route.params
    const {expires, signature} = route.query
    const verified = ref(false)
    const error = ref(false)
    const formButtonSubmit = ref(null)

    const handleVerifyEmail = function handleVerifyEmail() {
      formButtonSubmit.value.setAttribute("data-kt-indicator", "on")
      formButtonSubmit.value.disable = true
      formButtonSubmit.value.ariaDisabled = true
      axiosClient
        .get(
          [
            `email/verify/${id}/${token}`,
            `${[["expires", expires].join("="), ["signature", signature].join("=")].join("&")}`
          ].join("?")
        )
        .then(() => {
          verified.value = true
        })
        .catch(() => {
          error.value = true
        })
    }

    const handleGoHome = function handleGoHome() {
      axiosClient
        .get("/profile")
        .then((response) => {
          store.commit("SET_USER", {
            token: store.state.user.token,
            user: response.data.user
          })
        })
        .finally(() => {
          router.push({name: "index"})
        })
    }

    return {verified, error, handleVerifyEmail, handleGoHome, formButtonSubmit}
  }
})
</script>
