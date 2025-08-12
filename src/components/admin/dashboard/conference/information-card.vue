<template>
  <div class="card mb-6 mb-xl-9">
    <div class="card-body pt-9 pb-0">
      <div class="d-flex flex-wrap flex-sm-nowrap mb-6">
        <div
          class="d-flex flex-center flex-shrink-0 bg-light rounded w-100px h-100px w-lg-150px h-lg-150px me-7 mb-4 overflow-hidden">
          <img v-if="avatar" :src="`${SERVER_BASE_URL}/${image}`" :alt="tutor" class="w-100" />
          <span
            class="w-100 h-100 d-flex justify-content-center align-items-center symbol-label bg-light-warning text-warning fs-1 fw-bold">
            {{ tutor ? tutor.charAt(0).toUpperCase() : "" }}
          </span>
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
            <div class="d-flex flex-column">
              <div class="d-flex align-items-center mb-1">
                <span style="font-size: 16px">{{ t("global.tutor-name") }} : </span>
                <a
                  :href="`https://jinntest.jinnedu.com/tutors/${tutorSlug}`"
                  class="text-gray-800 text-hover-primary fs-2 fw-bold me-3">
                  {{ tutor }}
                </a>
              </div>
              <div>
                <span style="font-size: 16px">{{ t("global.group-class") }} : </span>
                <span class="text-gray-800 fs-2 fw-bold me-3">{{ title }}</span>
              </div>
              <div class="d-flex flex-wrap fw-semibold mb-4 fs-5 text-gray-400">
                {{ titleSub }}
              </div>
            </div>
          </div>
          <div class="d-flex flex-wrap justify-content-start">
            <div class="d-flex flex-wrap">
              <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6">
                <div class="d-flex align-items-center">
                  <div class="fs-4 fw-bold">{{ date }}</div>
                </div>
                <div class="fw-semibold fs-6 text-gray-400">
                  {{ t("global.from") }} {{ timeStart }} {{ t("global.to") }} {{ timeEnd }}
                </div>
              </div>
              <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6">
                <div class="d-flex align-items-center">
                  <div v-if="files !== 0" class="text-success me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24" />
                        <rect
                          x="11"
                          y="5"
                          rx="1"
                          width="2"
                          height="14"
                          fill="currentColor"
                          opacity="0.25" />
                        <path
                          d="M6.70710678,12.7071068 C6.31658249,13.0976311 5.68341751,13.0976311 5.29289322,12.7071068 C4.90236893,12.3165825 4.90236893,11.6834175 5.29289322,11.2928932 L11.2928932,5.29289322 C11.6714722,4.91431428 12.2810586,4.90106866 12.6757246,5.26284586 L18.6757246,10.7628459 C19.0828436,11.1360383 19.1103465,11.7686056 18.7371541,12.1757246 C18.3639617,12.5828436 17.7313944,12.6103465 17.3242754,12.2371541 L12.0300757,7.38413782 L6.70710678,12.7071068 Z"
                          fill="currentColor"
                          fill-rule="nonzero" />
                      </g>
                    </svg>
                  </div>
                  <div v-else class="text-danger me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24" />
                        <rect
                          x="11"
                          y="5"
                          rx="1"
                          width="2"
                          height="14"
                          fill="currentColor"
                          opacity="0.25" />
                        <path
                          d="M6.70710678,18.7071068 C6.31658249,19.0976311 5.68341751,19.0976311 5.29289322,18.7071068 C4.90236893,18.3165825 4.90236893,17.6834175 5.29289322,17.2928932 L11.2928932,11.2928932 C11.6714722,10.9143143 12.2810586,10.9010687 12.6757246,11.2628459 L18.6757246,16.7628459 C19.0828436,17.1360383 19.1103465,17.7686056 18.7371541,18.1757246 C18.3639617,18.5828436 17.7313944,18.6103465 17.3242754,18.2371541 L12.0300757,13.3841378 L6.70710678,18.7071068 Z"
                          fill="currentColor"
                          fill-rule="nonzero"
                          transform="translate(12, 15) scale(1, -1) translate(-12, -15)" />
                      </g>
                    </svg>
                  </div>
                  <div
                    data-kt-countup="true"
                    :data-kt-countup-value="files"
                    data-kt-initialized="0"
                    class="fs-4 fw-bold counted">
                    {{ files }}
                  </div>
                </div>
                <div class="fw-semibold fs-6 text-gray-400">{{ t("global.files") }}</div>
              </div>
              <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6">
                <div class="d-flex align-items-center">
                  <div v-if="notes !== 0" class="text-success me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24" />
                        <rect
                          x="11"
                          y="5"
                          rx="1"
                          width="2"
                          height="14"
                          fill="currentColor"
                          opacity="0.25" />
                        <path
                          d="M6.70710678,12.7071068 C6.31658249,13.0976311 5.68341751,13.0976311 5.29289322,12.7071068 C4.90236893,12.3165825 4.90236893,11.6834175 5.29289322,11.2928932 L11.2928932,5.29289322 C11.6714722,4.91431428 12.2810586,4.90106866 12.6757246,5.26284586 L18.6757246,10.7628459 C19.0828436,11.1360383 19.1103465,11.7686056 18.7371541,12.1757246 C18.3639617,12.5828436 17.7313944,12.6103465 17.3242754,12.2371541 L12.0300757,7.38413782 L6.70710678,12.7071068 Z"
                          fill="currentColor"
                          fill-rule="nonzero" />
                      </g>
                    </svg>
                  </div>
                  <div v-else class="text-danger me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24" />
                        <rect
                          x="11"
                          y="5"
                          rx="1"
                          width="2"
                          height="14"
                          fill="currentColor"
                          opacity="0.25" />
                        <path
                          d="M6.70710678,18.7071068 C6.31658249,19.0976311 5.68341751,19.0976311 5.29289322,18.7071068 C4.90236893,18.3165825 4.90236893,17.6834175 5.29289322,17.2928932 L11.2928932,11.2928932 C11.6714722,10.9143143 12.2810586,10.9010687 12.6757246,11.2628459 L18.6757246,16.7628459 C19.0828436,17.1360383 19.1103465,17.7686056 18.7371541,18.1757246 C18.3639617,18.5828436 17.7313944,18.6103465 17.3242754,18.2371541 L12.0300757,13.3841378 L6.70710678,18.7071068 Z"
                          fill="currentColor"
                          fill-rule="nonzero"
                          transform="translate(12, 15) scale(1, -1) translate(-12, -15)" />
                      </g>
                    </svg>
                  </div>
                  <div
                    data-kt-countup="true"
                    :data-kt-countup-value="notes"
                    data-kt-initialized="0"
                    class="fs-4 fw-bold counted">
                    {{ notes }}
                  </div>
                </div>
                <div class="fw-semibold fs-6 text-gray-400">{{ t("global.notes") }}</div>
              </div>
            </div>
            <div class="symbol-group symbol-hover mb-3">
              <div
                data-bs-toggle="tooltip"
                :data-bs-original-title="avatarTitle"
                data-kt-initialized="1"
                class="symbol symbol-35px symbol-circle">
                <img v-if="avatar" :src="`${SERVER_BASE_URL}/${avatar}`" :alt="avatarTitle" />
                <span v-else class="symbol-label bg-warning text-inverse-warning fw-bold">
                  {{ avatarTitle ? avatarTitle.charAt(0).toUpperCase() : "" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="separator"></div>
      <ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
        <li class="nav-item">
          <router-link
            v-if="!isAdmin"
            :to="`/dashboard/conferences/${idCurrent}/notes`"
            :class="routeNameCurrent === 'add-note-conferences' ? 'active' : ''"
            class="nav-link text-active-primary py-5 me-6">
            {{ t("global.notes") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="!isAdmin"
            :to="`/dashboard/conferences/${idCurrent}/reviews`"
            :class="routeNameCurrent === 'add-review-conferences' ? 'active' : ''"
            class="nav-link text-active-primary py-5 me-6">
            {{ t("global.reviews") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="`/dashboard/conferences/${idCurrent}/complaints`"
            :class="
              routeNameCurrent === 'add-complaint-conferences' ||
              routeNameCurrent === 'view-complaint-conferences'
                ? 'active'
                : ''
            "
            class="nav-link text-active-primary py-5 me-6">
            {{ t("global.complaints") }}
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="!isAdmin"
            :to="`/dashboard/conferences/${idCurrent}/files`"
            :class="routeNameCurrent === 'upload-file-conferences' ? 'active' : ''"
            class="nav-link text-active-primary py-5 me-6">
            {{ t("global.files") }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, onBeforeMount, onBeforeUpdate, ref, toRef} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute} from "vue-router"
import axiosClient from "../../../../plugins/axios"

export default defineComponent({
  name: "conference-information-card",
  props: {
    idCurrent: {type: String, required: true},
    isAdmin: {type: Boolean, required: false, default: false}
  },
  setup(props) {
    // Environment Variables
    const SERVER_BASE_URL = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)

    // Composable Variables
    const route = useRoute()
    const {t} = useI18n()

    // Reactive Variables
    const routeNameCurrent = computed(() => route.name)
    const id = toRef(props, "idCurrent")

    // Data Variables
    const tutorId = ref(null)
    const image = ref(null)
    const avatar = ref(null)
    const avatarTitle = ref(null)
    const title = ref(null)
    const titleSub = ref(null)
    const tutor = ref(null)
    const tutorSlug = ref(null)
    const notes = ref(0)
    const files = ref(0)
    const date = ref(null)
    const timeStart = ref(null)
    const timeEnd = ref(null)

    // Fetching/Filling Data
    const getConferenceInfo = function getConferenceInfo() {
      axiosClient
        .get(`/conferences/${props.isAdmin ? "admin-card" : "student-card"}/${id.value}`)
        .then((response) => {
          tutorId.value = response.data.result?.tutor?.id
          image.value = response.data.result?.tutor?.avatar
          avatar.value = response.data.result?.students[0].avatar
          avatarTitle.value = response.data.result?.students[0].name
          title.value = response.data.result?.title
          tutor.value = response.data.result?.tutor?.name
          tutorSlug.value = response.data.result?.tutor?.slug
          notes.value = response.data.result?.notes
          files.value = response.data.result?.files
          date.value = response.data.result?.date
          timeStart.value = response.data.result?.start_time
          timeEnd.value = response.data.result?.end_time

          // if (response.data.result.ref_type === 1 || response.data.result.ref_type === 2)
          //   titleSub.value = response.data.result.details.langs[0].title
          // else titleSub.value = "Private Class"
        })
    }

    onBeforeMount(() => {
      getConferenceInfo()
    })

    onBeforeUpdate(() => {
      getConferenceInfo()
    })

    return {
      SERVER_BASE_URL,
      t,
      routeNameCurrent,
      id,
      tutorId,
      image,
      avatar,
      avatarTitle,
      title,
      titleSub,
      tutor,
      tutorSlug,
      notes,
      files,
      date,
      timeStart,
      timeEnd,
      getConferenceInfo
    }
  }
})
</script>
