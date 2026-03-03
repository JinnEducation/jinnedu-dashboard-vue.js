<template>
  <toolbar :title="t('global.conference-add-video')" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <div class="card card-flush py-4">
        <div class="card-header">
          <div class="card-title">
            <h2>{{ t("global.conference-add-video") }}</h2>
          </div>
        </div>

        <div class="card-body pt-0">
          <template v-if="loading">
            <div class="text-center py-20">
              <div role="status" class="spinner-border text-primary">
                <span class="visually-hidden">{{ t("global.loading") }}</span>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="mb-6">
              <label for="recording-media-url" class="form-label">{{
                t("global.promo_video_url")
              }}</label>
              <el-input
                id="recording-media-url"
                v-model="mediaUrlInput"
                :placeholder="t('global.optional')" />
            </div>

            <div class="separator separator-dashed my-6"></div>

            <div class="mb-4 text-start">
              <span class="form-label">{{ t("global.or_upload_video") }}</span>
            </div>

            <conference-recording-video-uploader v-model="mediaUrl" @remove="handleRemoveVideo" />

            <div class="d-flex flex-wrap gap-3 mt-6">
              <button
                ref="saveButton"
                type="button"
                class="btn btn-primary"
                :disabled="!mediaUrl"
                @click="saveRecording">
                <span class="indicator-label">{{ t("global.save") }}</span>
                <span class="indicator-progress">
                  {{ t("global.please-wait") }}
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>

              <a
                v-if="mediaUrl"
                :href="openVideoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-light-primary">
                <i class="bi bi-play-circle me-1"></i>
                {{ t("global.open_video") }}
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import ConferenceRecordingVideoUploader from "@/components/admin/ConferenceRecordingVideoUploader.vue"
import axiosClient from "@/plugins/axios"
import {defineComponent, onBeforeMount, ref, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute} from "vue-router"
import Swal from "sweetalert2"

const SOURCE_UPLOAD = "upload"
const SOURCE_URL = "url"

export default defineComponent({
  name: "upload-video-conferences",
  components: {Toolbar, ConferenceRecordingVideoUploader},
  setup() {
    const route = useRoute()
    const {t} = useI18n()
    const conferenceId = ref(route.params.conference)
    const loading = ref(false)
    const mediaUrl = ref(null)
    const recordingId = ref(null)
    const saveButton = ref(null)
    const resolveStoragePath = (url) => {
      if (!url) return null

      try {
        const u = new URL(url)

        // لازم يكون من نفس السيرفر
        if (!u.origin.startsWith(import.meta.env.VITE_APP_SERVER_BASE_URL)) {
          return null
        }

        // لازم يحتوي /storage/
        const idx = u.pathname.indexOf("/storage/")
        if (idx === -1) return null

        return u.pathname.substring(idx + 9) // بعد /storage/
      } catch (e) {
        return null
      }
    }

    const openVideoUrl = computed(() => {
      const path = resolveStoragePath(mediaUrl.value)
      if (path) {
        return `${import.meta.env.VITE_APP_SERVER_BASE_URL}/show-video?path=${path}`
      }
      return mediaUrl.value
    })

    const mediaUrlInput = computed({
      get() {
        const url = mediaUrl.value
        if (!url) return ""
        if (url.includes("/storage/")) return ""
        return url
      },
      set(val) {
        mediaUrl.value = val || null
      }
    })

    const getSourceType = () => {
      const url = mediaUrl.value
      if (!url) return null
      if (url.includes("/storage/")) return SOURCE_UPLOAD
      return SOURCE_URL
    }

    const loadRecording = () => {
      loading.value = true
      axiosClient
        .get(`/conference-recordings/by-conference/${conferenceId.value}`)
        .then((response) => {
          const data =
            response.data ?? response.data?.result?.data ?? response.data?.result ?? []
          const list = Array.isArray(data) ? data : data?.data ?? []
          const first = list[0]
          if (first) {
            mediaUrl.value = first.media_url ?? null
            recordingId.value = first.id ?? null
          } else {
            mediaUrl.value = null
            recordingId.value = null
          }
        })
        .catch(() => {
          mediaUrl.value = null
          recordingId.value = null
        })
        .finally(() => {
          loading.value = false
        })
    }

    const saveRecording = async () => {
      const sourceType = getSourceType()
      if (!mediaUrl.value || !sourceType) return

      saveButton.value?.setAttribute("data-kt-indicator", "on")

      try {
        await axiosClient.post("/conference-recordings/create", {
          conference_id: Number(conferenceId.value),
          source_type: sourceType,
          media_url: mediaUrl.value
        })

        Swal.fire({
          icon: "success",
          text: t("global.saved-successfully"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-primary"}
        })

        loadRecording()
      } catch (e) {
        Swal.fire({
          icon: "error",
          text: t("global.error-saving"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      } finally {
        saveButton.value?.removeAttribute("data-kt-indicator")
      }
    }

    const handleRemoveVideo = () => {
      if (recordingId.value) {
        Swal.fire({
          icon: "warning",
          text: t("global.ensure-delete"),
          showCancelButton: true,
          confirmButtonText: t("global.yes-delete"),
          cancelButtonText: t("global.go-back"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger", cancelButton: "btn btn-active-light"}
        }).then((result) => {
          if (result.isConfirmed) {
            axiosClient.delete(`/conference-recordings/delete/${recordingId.value}`).then(() => {
              mediaUrl.value = null
              recordingId.value = null
              Swal.fire({
                icon: "success",
                text: t("global.deleted-successfully"),
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
            })
          }
        })
      } else {
        mediaUrl.value = null
        recordingId.value = null
      }
    }

    onBeforeMount(() => {
      loadRecording()
    })

    return {
      t,
      loading,
      mediaUrl,
      mediaUrlInput,
      openVideoUrl,
      saveButton,
      saveRecording,
      handleRemoveVideo
    }
  }
})
</script>
