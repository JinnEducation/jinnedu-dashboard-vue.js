<template>
  <div class="card mb-7">
    <div class="card-header">
      <div class="card-title">
        <h3>{{ t("global.intro_session") }}</h3>
      </div>
    </div>

    <div class="card-body">
      <!-- Add -->
      <div v-if="!introSession" class="text-center py-6">
        <el-button type="primary" @click="$emit('create')">
          + {{ t("global.add_intro_session") }}
        </el-button>
      </div>

      <!-- Edit -->
      <div v-else class="border rounded p-4">
        <!-- Basic Info -->
        <div class="row mb-4">
          <div class="col-md-6">
            <languages-tabs instance-id="intro-session-title" v-slot="slot">
              <div :key="`intro-title-wrapper-${slot.language.id}`" class="card-body pt-0 p-0">
                <div class="mb-10 fv-row">
                  <label class="required form-label">{{ t("global.title") }}</label>
                  <el-input
                    :key="`intro-title-${slot.language.id}`"
                    v-model="introSession.title[slot.language.id]" />
                </div>
              </div>
            </languages-tabs>
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t("global.type") }}</label>
            <el-input value="Intro Session" disabled />
          </div>

          <div class="col-md-3">
            <label class="form-label">{{ t("global.duration") }}</label>
            <el-input
              type="number"
              v-model="introSession.duration_seconds"
              :placeholder="t('global.optional')" />
          </div>
        </div>

        <!-- Free / Paid -->
        <div class="mb-4">
          <el-checkbox v-model="introSession.is_free_preview">
            {{ t("global.free_preview") }}
          </el-checkbox>
        </div>

        <!-- Content Source -->
        <div class="mb-4">
          <label class="form-label">{{ t("global.content_source") }}</label>
          <el-radio-group v-model="introSession.content_source">
            <el-radio label="zoom">Zoom</el-radio>
            <el-radio label="upload">Upload Video</el-radio>
            <el-radio label="url">Video URL</el-radio>
          </el-radio-group>
        </div>

        <!-- Zoom -->
        <div v-if="introSession.content_source === 'zoom'" class="mb-4">
          <!-- <label class="form-label">{{ t("global.zoom_schedule") }}</label>
          <el-date-picker
            v-model="introSession.zoom_start_at"
            type="datetime"
            class="w-100"
            :placeholder="t('global.select_date')" /> -->
          <!-- Code -->
          <div class="fv-row">
            <label for="zoom_start_at" class="required form-label">
              {{ t("global.zoom_schedule") }}
            </label>
            <el-form-item prop="zoom_start_at">
              <el-date-picker
                id="zoom_start_at"
                v-model="introSession.zoom_start_at"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm"
                name="zoom_start_at"
                class="w-100"
                :placeholder="t('global.select_date')"
                :disabled="zoomChecking"
                @blur="checkZoomAvailability"
                @change="checkZoomAvailability">
                <template #suffix>
                  <el-icon v-if="zoomChecking" class="is-loading">
                    <Loading />
                  </el-icon>
                </template>
              </el-date-picker>
            </el-form-item>
          </div>
        </div>

        <!-- Upload (structure only) -->
        <div v-if="introSession.content_source === 'upload'" class="mb-4">
          <video-uploader v-model="introSession.external_video_url" />
        </div>

        <!-- URL -->
        <div v-if="introSession.content_source === 'url'" class="mb-4">
          <el-input v-model="introSession.external_video_url" placeholder="https://..." />
        </div>

        <!-- Actions -->
        <div class="d-flex justify-content-between mt-5">
          <el-button type="danger" plain @click="$emit('delete')">
            {{ t("global.delete") }}
          </el-button>

          <el-button type="primary" @click="$emit('save', introSession)">
            {{ t("global.save") }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
import {defineComponent, reactive, watch, ref} from "vue"
import {useI18n} from "vue-i18n"
import LanguagesTabs from "@/components/admin/languages-tabs.vue"
import VideoUploader from "@/components/admin/VideoUploader.vue"
import {Loading} from "@element-plus/icons-vue"
import Swal from "sweetalert2"
import axiosClient from "@/plugins/axios"

export default defineComponent({
  name: "intro-session-editor",
  components: {
    VideoUploader,
    LanguagesTabs,
    Loading
  },
  props: {
    introSession: {
      type: Object,
      default: null
    }
  },
  emits: ["create", "save", "delete"],
  setup(props) {
    const loading = ref(false)
    const zoomChecking = ref(false)
    const zoomAvailable = ref(true)
    const introSession = ref(props.introSession) || null

    const {t} = useI18n()

    const checkZoomAvailability = async () => {
      if (!introSession?.value?.zoom_start_at || !introSession?.value?.instructor_id) return

      try {
        zoomChecking.value = true

        const res = await axiosClient.post("/admin/zoom/check-availability", {
          instructor_id: introSession?.value?.instructor_id,
          start_at: introSession?.value?.zoom_start_at
        })

        zoomAvailable.value = !!res.data.available

        if (!zoomAvailable.value) {
          Swal.fire({
            icon: "error",
            text: t("global.instructor_not_available"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })
          introSession.zoom_start_at = null
        }
        if (zoomAvailable.value) {
          Swal.fire({
            icon: "success",
            text: t("global.instructor_available"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          text: t("global.error_checking_zoom"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      } finally {
        zoomChecking.value = false
      }
    }

    return {
      t,
      loading,
      zoomChecking,
      zoomAvailable,
      checkZoomAvailability
    }
  }
})
</script>
