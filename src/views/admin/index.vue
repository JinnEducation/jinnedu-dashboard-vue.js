<template>
  <toolbar :title="t('global.dashboard-management')" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <div class="card mb-5 mb-xl-10">
        <div v-if="isProfileReady" class="card-body pt-9 pb-0">
          <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
            <div class="me-7 mb-4">
              <div class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                <img :src="SERVER_PATH + '/' + profile.avatar" :alt="about[0]?.first_name" />
                <div
                  class="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"></div>
              </div>
            </div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div class="d-flex flex-column">
                  <div class="d-flex align-items-center mb-2">
                    <a href="#" class="text-gray-800 text-hover-primary fs-2 fw-bold me-1">
                      {{ about[0] ? about[0]?.first_name : "" }}
                      {{ about[0] ? about[0]?.last_name : "" }}
                    </a>
                    <!-- <p class="btn btn-sm btn-light-success fw-bold ms-2 fs-8 py-1 px-3 mb-0">
                      
                    </p> -->
                  </div>
                  <div class="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
                    <a
                      href="#"
                      class="d-flex align-items-center text-gray-500 text-hover-primary mb-2">
                      {{ profile ? profile.email : "" }}
                    </a>
                  </div>
                </div>
              </div>
              <!-- <div class="d-flex flex-wrap flex-stack">
                <div class="d-flex flex-column flex-grow-1 pe-8">
                  <div class="d-flex flex-wrap">
                    <div
                      class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div class="d-flex align-items-center">
                        <div class="fs-2 fw-bold">4500$</div>
                      </div>
                      <div class="fw-semibold fs-6 text-gray-500">Earnings</div>
                    </div>
                    <div
                      class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div class="d-flex align-items-center">
                        <div class="fs-2 fw-bold" data-kt-countup="true" data-kt-countup-value="75">
                          75
                        </div>
                      </div>
                      <div class="fw-semibold fs-6 text-gray-500">Projects</div>
                    </div>
                    <div
                      class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div class="d-flex align-items-center">
                        <div
                          class="fs-2 fw-bold"
                          data-kt-countup="true"
                          data-kt-countup-value="60"
                          data-kt-countup-prefix="%">
                          60%
                        </div>
                      </div>
                      <div class="fw-semibold fs-6 text-gray-500">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isProfileReady && !profile.email_verified_at"
        class="alert alert-danger d-flex align-items-start p-5 mb-5 mb-xl-7">
        <span class="svg-icon svg-icon-danger svg-icon-3x me-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <g fill="none" fill-rule="evenodd">
              <rect x="0" y="0" width="24" height="24" />
              <path
                d="M4,4 L11.6314229,2.5691082 C11.8750185,2.52343403 12.1249815,2.52343403 12.3685771,2.5691082 L20,4 L20,13.2830094 C20,16.2173861 18.4883464,18.9447835 16,20.5 L12.5299989,22.6687507 C12.2057287,22.8714196 11.7942713,22.8714196 11.4700011,22.6687507 L8,20.5 C5.51165358,18.9447835 4,16.2173861 4,13.2830094 L4,4 Z"
                fill="currentColor"
                opacity="0.5" />
              <path
                d="M10.5857864,12 L9.17157288,10.5857864 C8.78104858,10.1952621 8.78104858,9.56209717 9.17157288,9.17157288 C9.56209717,8.78104858 10.1952621,8.78104858 10.5857864,9.17157288 L12,10.5857864 L13.4142136,9.17157288 C13.8047379,8.78104858 14.4379028,8.78104858 14.8284271,9.17157288 C15.2189514,9.56209717 15.2189514,10.1952621 14.8284271,10.5857864 L13.4142136,12 L14.8284271,13.4142136 C15.2189514,13.8047379 15.2189514,14.4379028 14.8284271,14.8284271 C14.4379028,15.2189514 13.8047379,15.2189514 13.4142136,14.8284271 L12,13.4142136 L10.5857864,14.8284271 C10.1952621,15.2189514 9.56209717,15.2189514 9.17157288,14.8284271 C8.78104858,14.4379028 8.78104858,13.8047379 9.17157288,13.4142136 L10.5857864,12 Z"
                fill="currentColor" />
            </g>
          </svg>
        </span>
        <div class="d-flex flex-column justify-content-start">
          <h4 class="mb-1 text-danger">{{ t("global.email-is-not-verified-title") }}</h4>
          <span class="mb-5">
            {{ t("global.email-is-not-verified-description") }}
          </span>
          <button
            type="button"
            class="btn btn-sm btn-outline btn-outline-danger"
            style="width: max-content"
            @click="handleVerificationEmailResend">
            {{ t("global.send-email") }}
          </button>
        </div>
      </div>
      <div class="card card-xl-stretch mb-5 mb-xl-7">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-dark">{{
              t("global.account-overview-title")
            }}</span>
            <span class="text-muted mt-1 fw-semibold fs-7">{{
              t("global.account-overview-description")
            }}</span>
          </h3>
        </div>
        <div class="card-body pt-5">
          <!-- show orders in student dashboard -->
          <div v-if="userType === 1" class="d-flex align-items-center mb-5">
            <div class="symbol symbol-50px me-5">
              <span class="symbol-label bg-light-warning">
                <span class="svg-icon svg-icon-warning svg-icon-2x">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24">
                    <g fill="none" fill-rule="evenodd">
                      <rect x="0" y="0" width="24" height="24" />
                      <path
                        d="M3,10.0500091 L3,8 C3,7.44771525 3.44771525,7 4,7 L9,7 L9,9 C9,9.55228475 9.44771525,10 10,10 C10.5522847,10 11,9.55228475 11,9 L11,7 L21,7 C21.5522847,7 22,7.44771525 22,8 L22,10.0500091 C20.8588798,10.2816442 20,11.290521 20,12.5 C20,13.709479 20.8588798,14.7183558 22,14.9499909 L22,17 C22,17.5522847 21.5522847,18 21,18 L11,18 L11,16 C11,15.4477153 10.5522847,15 10,15 C9.44771525,15 9,15.4477153 9,16 L9,18 L4,18 C3.44771525,18 3,17.5522847 3,17 L3,14.9499909 C4.14112016,14.7183558 5,13.709479 5,12.5 C5,11.290521 4.14112016,10.2816442 3,10.0500091 Z M10,11 C9.44771525,11 9,11.4477153 9,12 L9,13 C9,13.5522847 9.44771525,14 10,14 C10.5522847,14 11,13.5522847 11,13 L11,12 C11,11.4477153 10.5522847,11 10,11 Z"
                        fill="currentColor"
                        transform="translate(12, 12) rotate(-45) translate(-12, -12)" />
                    </g>
                  </svg>
                </span>
              </span>
            </div>
            <div class="d-flex flex-column">
              <router-link
                to="/dashboard/orders/my-index"
                class="text-dark text-hover-warning fs-6 fw-bold">
                {{ t("global.my-orders") }}
              </router-link>
              <span class="text-muted fw-bold">
                {{ t("global.manage-your-orders-status") }}
              </span>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <div class="symbol symbol-50px me-5">
              <span class="symbol-label bg-light-success">
                <span class="svg-icon svg-icon-success svg-icon-2x">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24">
                    <g fill="none" fill-rule="evenodd">
                      <rect x="0" y="0" width="24" height="24" />
                      <path
                        d="M3,10.0500091 L3,8 C3,7.44771525 3.44771525,7 4,7 L9,7 L9,9 C9,9.55228475 9.44771525,10 10,10 C10.5522847,10 11,9.55228475 11,9 L11,7 L21,7 C21.5522847,7 22,7.44771525 22,8 L22,10.0500091 C20.8588798,10.2816442 20,11.290521 20,12.5 C20,13.709479 20.8588798,14.7183558 22,14.9499909 L22,17 C22,17.5522847 21.5522847,18 21,18 L11,18 L11,16 C11,15.4477153 10.5522847,15 10,15 C9.44771525,15 9,15.4477153 9,16 L9,18 L4,18 C3.44771525,18 3,17.5522847 3,17 L3,14.9499909 C4.14112016,14.7183558 5,13.709479 5,12.5 C5,11.290521 4.14112016,10.2816442 3,10.0500091 Z M10,11 C9.44771525,11 9,11.4477153 9,12 L9,13 C9,13.5522847 9.44771525,14 10,14 C10.5522847,14 11,13.5522847 11,13 L11,12 C11,11.4477153 10.5522847,11 10,11 Z"
                        fill="currentColor"
                        transform="translate(12, 12) rotate(-45) translate(-12, -12)" />
                    </g>
                  </svg>
                </span>
              </span>
            </div>
            <div class="d-flex flex-column">
              <router-link to="/profile" class="text-dark text-hover-success fs-6 fw-bold">
                {{ t("global.account-edit-profile-title") }}
              </router-link>
              <span class="text-muted fw-bold">{{
                t("global.account-edit-profile-description")
              }}</span>
            </div>
          </div>

          <div class="d-flex align-items-center mt-2">
            <div class="symbol symbol-50px me-5">
              <span class="symbol-label bg-light-warning">
                <span class="svg-icon svg-icon-warning svg-icon-2x">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24">
                    <g fill="none" fill-rule="evenodd">
                      <rect x="0" y="0" width="24" height="24" />
                      <path
                        d="M3,10.0500091 L3,8 C3,7.44771525 3.44771525,7 4,7 L9,7 L9,9 C9,9.55228475 9.44771525,10 10,10 C10.5522847,10 11,9.55228475 11,9 L11,7 L21,7 C21.5522847,7 22,7.44771525 22,8 L22,10.0500091 C20.8588798,10.2816442 20,11.290521 20,12.5 C20,13.709479 20.8588798,14.7183558 22,14.9499909 L22,17 C22,17.5522847 21.5522847,18 21,18 L11,18 L11,16 C11,15.4477153 10.5522847,15 10,15 C9.44771525,15 9,15.4477153 9,16 L9,18 L4,18 C3.44771525,18 3,17.5522847 3,17 L3,14.9499909 C4.14112016,14.7183558 5,13.709479 5,12.5 C5,11.290521 4.14112016,10.2816442 3,10.0500091 Z M10,11 C9.44771525,11 9,11.4477153 9,12 L9,13 C9,13.5522847 9.44771525,14 10,14 C10.5522847,14 11,13.5522847 11,13 L11,12 C11,11.4477153 10.5522847,11 10,11 Z"
                        fill="currentColor"
                        transform="translate(12, 12) rotate(-45) translate(-12, -12)" />
                    </g>
                  </svg>
                </span>
              </span>
            </div>
            <div class="d-flex flex-column">
              <router-link to="/userInfo" class="text-dark text-hover-warning fs-6 fw-bold">
                {{ t("global.show-profile-info") }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import {defineComponent, onBeforeMount, ref, computed} from "vue"
import {useI18n} from "vue-i18n"
import axiosClient from "../../plugins/axios"
import {useStore} from "vuex"

export default defineComponent({
  name: "dashboard-index",
  components: {Toolbar},
  setup() {
    const {t} = useI18n()
    const profile = ref({})
    const about = ref({})
    const loading = ref(true)
    const store = useStore()
    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type
    const financial = ref({})

    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)

    const handleVerificationEmailResend = function handleVerificationEmailResend() {
      axiosClient
        .post("/email/resend")
        .then(() => {
          Swal.fire({
            icon: "success",
            text: t("global.verification-email-sent"),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            text: t("global.errors-detected"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })
        })
    }

    onBeforeMount(() => {
      // axiosClient.get("/profile", {params: {user_id: userId}}),

      axiosClient
        .get("/profile", {params: {user_id: userInfoObject.user.id}})
        .then((response) => {
          profile.value = response.data.result
          about.value = profile.value.abouts
        })
        .finally(() => {
          loading.value = false
        })
    })

    const isProfileReady = computed(() => {
      return !loading.value && Object.keys(profile.value).length > 0
    })

    return {
      t,
      profile,
      handleVerificationEmailResend,
      userType,
      financial,
      about,
      SERVER_PATH,
      isProfileReady
    }
  }
})
</script>
