<template>
  <div>
    <toolbar :title="t('global.update-profile')" />

    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="card">
          <template v-if="loading">
            <div class="card-body p-0">
              <div class="card-px text-center py-20 my-10">
                <div role="status" class="spinner-border text-primary">
                  <span class="visually-hidden">{{ t("global.loading") }}...</span>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="card-body py-4">
              <div class="pb-10 pb-lg-12">
                <h2 class="fw-bold text-dark">{{ t("global.account-information-title") }}</h2>
                <div class="text-muted fw-semibold fs-6">
                  {{ t("global.account-information-description") }}
                </div>
              </div>
              <div class="fv-row mb-7">
                <label for="user-avatar" class="d-block fw-semibold fs-6 mb-5">{{
                  t("global.avatar")
                }}</label>
                <div
                  data-kt-image-input="true"
                  class="image-input image-input-outline image-input-placeholder image-input-empty">
                  <div
                    class="image-input-wrapper w-125px h-125px"
                    :style="{
                      'background-image': data.avatar ? `url(${data.avatar})` : 'none'
                    }"></div>
                  <label
                    aria-label="Change Avatar"
                    data-bs-toggle="tooltip"
                    data-bs-original-title="Change Avatar"
                    data-kt-image-input-action="change"
                    data-kt-initialized="1"
                    class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow">
                    <i class="bi bi-pencil-fill fs-7"></i>
                    <input
                      id="user-avatar"
                      type="file"
                      name="avatar"
                      accept=".png, .jpg, .jpeg"
                      @change="handleFileInputChange($event)" />
                    <input type="hidden" name="avatar-remove" value="1" />
                  </label>
                  <span
                    aria-label="Cancel Avatar"
                    data-bs-toggle="tooltip"
                    data-bs-original-title="Cancel Avatar"
                    data-kt-image-input-action="cancel"
                    data-kt-initialized="1"
                    class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow">
                    <i class="bi bi-x fs-2"></i>
                  </span>
                  <span
                    aria-label="Remove Avatar"
                    data-bs-toggle="tooltip"
                    data-bs-original-title="Remove Avatar"
                    data-kt-image-input-action="remove"
                    data-kt-initialized="1"
                    class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow">
                    <i class="bi bi-x fs-2"></i>
                  </span>
                </div>
                <div class="form-text">{{ t("global.avatar-description") }}</div>
              </div>
              <div class="row fv-row mb-7">
                <div class="col-xl-6">
                  <form-input
                    id="first-name"
                    v-model:inputValue="data.firstName"
                    :label="t('global.first-name')"
                    type="text"
                    name="first-name"
                    :placeholder="t('global.first-name')" />
                </div>
                <div class="col-xl-6">
                  <form-input
                    id="last-name"
                    v-model:inputValue="data.lastName"
                    :label="t('global.last-name')"
                    type="text"
                    name="last-name"
                    :placeholder="t('global.last-name')" />
                </div>
              </div>
              <div class="row fv-row mb-10">
                <div class="col-xl-6">
                  <form-input
                    id="email"
                    v-model:inputValue="data.email"
                    :label="t('global.email')"
                    type="email"
                    name="email"
                    :placeholder="t('global.email')" />
                </div>
                <div class="col-xl-6">
                  <form-input
                    id="phone"
                    v-model:inputValue="data.phone"
                    :label="t('global.phone-number')"
                    type="text"
                    name="phone"
                    :placeholder="t('global.phone-number')" />
                </div>
              </div>

              <div class="row fv-row mb-10">
                <div class="col-xl-6">
                  <form-input
                    id="date-of-birth"
                    v-model:inputValue="data.dateOfBirth"
                    :label="t('global.date-of-birth')"
                    :sr-only="false"
                    type="date"
                    name="date-of-birth"
                    :placeholder="t('global.date-of-birth')" />
                </div>
              </div>
              <button
                ref="formButtonSubmit"
                type="submit"
                data-kt-stepper-action="submit"
                class="btn btn-lg btn-primary"
                @click="updateProfile()">
                <span class="indicator-label">
                  {{ t("global.submit") }}
                  <span class="d-inline-block svg-icon svg-icon-1x icon-rotate-rtl ms-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24">
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
                  {{ t("global.wait-please") }}
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import axiosClient from "@/plugins/axios"
import FormInput from "../../components/admin/uis/form/input.vue"
import {defineComponent, onBeforeMount, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRouter} from "vue-router"

export default defineComponent({
  name: "update-profile",
  components: {Toolbar, FormInput},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const avatarSelected = ref(false)
    const router = useRouter()
    const baseUrl = import.meta.env.VITE_APP_BASE_URL

    const data = ref({
      id: null,
      avatar: null,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      dateOfBirth: null
    })

    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)

    const handleFileInputChange = function handleFileInputChange(event) {
      // eslint-disable-next-line
      avatarSelected.value = event.target.files[0]
      const reader = new FileReader()
      // reader.readAsBinaryString(avatarSelected.value)
      reader.readAsDataURL(avatarSelected.value)
      reader.onload = (renderEvent) => {
        data.value.avatar = renderEvent.target.result
      }
    }
    const fetchProfileData = async () => {
      try {
        loading.value = true
        const profileResponse = await axiosClient.get("/profile")
        const user = profileResponse.data.result

        data.value.id = user.id
        if (user.abouts && user.abouts.length > 0) {
          data.value.firstName = user.abouts[0].first_name
          data.value.lastName = user.abouts[0].last_name
          data.value.phone = user.abouts[0].phone
          data.value.dateOfBirth = user.abouts[0].date_of_birth
        }
        data.value.avatar = user.avatar
          ? `${baseUrl}/server/${user.avatar}`
          : `${baseUrl}/server/static/default_avatar.webp`
        data.value.email = user.email
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        loading.value = false
      }
    }

    const updateProfile = function updateProfile() {
      const formData = new FormData()
      formData.append("avatar", avatarSelected.value ? avatarSelected.value : "")
      formData.append("first_name", data.value.firstName)
      formData.append("last_name", data.value.lastName)
      formData.append("phone", data.value.phone)
      formData.append("date_of_birth", data.value.dateOfBirth)
      formData.append("email", data.value.email.toLowerCase())

      axiosClient
        .post("/update-profile", formData)
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            // Request was successful
            if (response.data.success === true) {
              Swal.fire({
                icon: "success",
                text: response.data.message,
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              router.push({name: "index"})
            } else {
              Swal.fire({
                icon: "error",
                text: response.data.message,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            }
          } else {
            // Request was unsuccessful
            Swal.fire({
              icon: "error",
              text: t("errors.an-error-occurred-while-updating"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
          }
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.message) {
            const errorMessage = error.response.data.message
            if (errorMessage === "The email has already been taken.") {
              Swal.fire({
                icon: "error",
                text: errorMessage,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            } else {
              Swal.fire({
                icon: "error",
                text: "An error occurred while updating the profile.",
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            }
          } else {
            // eslint-disable-next-line no-console
            Swal.fire({
              icon: "error",
              text: t("errors.an-error-occurred-while-updating-profile"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
          }
        })
    }

    onBeforeMount(() => {
      data.value = []
      loading.value = false
      fetchProfileData()
    })

    onMounted(() => {})

    return {
      SERVER_PATH,
      t,
      loading,
      data,
      fetchProfileData,
      updateProfile,
      handleFileInputChange,
      baseUrl
    }
  }
})
</script>
