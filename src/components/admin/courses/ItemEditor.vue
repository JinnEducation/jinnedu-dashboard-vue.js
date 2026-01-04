<template>
  <div class="border rounded p-4 mb-4">
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div class="fw-bold">
        {{ item.title?.[activeLang] || item.title?.ar || t("global.item") }}
      </div>

      <!-- Move controls (ديناميكية) -->
      <div class="d-flex gap-2">
        <el-button v-if="showMoveUp" size="small" @click="$emit('move', {direction: 'up'})">
          ▲
        </el-button>

        <el-button v-if="showMoveDown" size="small" @click="$emit('move', {direction: 'down'})">
          ▼
        </el-button>
      </div>
    </div>

    <!-- Item fields (languages tabs للعنوان والوصف فقط) -->
    <languages-tabs :instance-id="`item-${item.id || 'new'}-${index}`" v-slot="slot">
      <div :key="`item-${item.id || 'new'}-wrapper-${slot.language.id}`" class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">{{ t("global.title") }}</label>
          <el-input
            :key="`item-${item.id || 'new'}-title-${slot.language.id}`"
            v-model="item.title[slot.language.id]" />
        </div>

        <div class="col-md-6">
          <label class="form-label">{{ t("global.description") }}</label>
          <el-input
            :key="`item-${item.id || 'new'}-desc-${slot.language.id}`"
            type="textarea"
            :rows="2"
            v-model="item.description[slot.language.id]" />
        </div>
      </div>
    </languages-tabs>

    <div class="row mb-3">
      <div class="col-md-3">
        <label class="form-label">{{ t("global.type") }}</label>
        <el-select v-model="item.type" class="w-100">
          <el-option value="lesson_video" label="Lesson Video" />
          <el-option value="workshop_recording" label="Workshop (Recorded)" />
          <el-option value="workshop_live" label="Workshop (Live - Zoom)" />
        </el-select>
      </div>

      <div class="col-md-3">
        <label class="form-label">{{ t("global.duration") }}</label>
        <el-input
          type="number"
          v-model="item.duration_seconds"
          :placeholder="t('global.optional')" />
      </div>

      <div class="col-md-3 d-flex align-items-end">
        <el-checkbox v-model="item.is_free_preview">
          {{ t("global.free_preview") }}
        </el-checkbox>
      </div>
    </div>

    <!-- Content source (هيكلية فقط - upload/zoom skeleton) -->
    <div class="mb-3">
      <label class="form-label">{{ t("global.content_source") }}</label>
      <el-radio-group v-model="item.content_source">
        <el-radio label="upload">Upload</el-radio>
        <el-radio label="url">URL</el-radio>
        <el-radio label="zoom" :disabled="item.type !== 'workshop_live'">Zoom</el-radio>
      </el-radio-group>
    </div>

    <div v-if="item.content_source === 'zoom'" class="mb-3">
      <div class="fv-row">
        <label for="zoom_start_at" class="required form-label">
          {{ t("global.zoom_schedule") }}
        </label>
        <el-form-item prop="zoom_start_at">
          <el-date-picker
            id="zoom_start_at"
            v-model="item.zoom_start_at"
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

    <div v-if="item.content_source === 'url'" class="mb-3">
      <el-input v-model="item.external_video_url" placeholder="https://..." />
    </div>

    <div v-if="item.content_source === 'upload'" class="mb-3">
      <video-uploader v-model="item.external_video_url" />
    </div>

    <div class="d-flex justify-content-end gap-2 mt-4">
      <el-button type="danger" plain size="small" @click="$emit('delete', item)">
        {{ t("global.delete") }}
      </el-button>
      <el-button type="primary" size="small" @click="$emit('save', item)">
        {{ t("global.save") }}
      </el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
import {defineComponent, ref} from "vue"
import {useI18n} from "vue-i18n"
import LanguagesTabs from "@/components/admin/languages-tabs.vue"
import VideoUploader from "@/components/admin/VideoUploader.vue"
import {Loading} from "@element-plus/icons-vue"
import Swal from "sweetalert2"
import axiosClient from "@/plugins/axios"

export default defineComponent({
  name: "item-editor",
  components: {
    VideoUploader,
    LanguagesTabs,
    Loading
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    sectionId: {
      type: Number,
      required: true
    },
    activeLang: {
      type: String,
      required: true
    },
    showMoveUp: {
      type: Boolean,
      default: false
    },
    showMoveDown: {
      type: Boolean,
      default: false
    }
  },
  emits: ["save", "delete", "move"],
  setup(props) {
    const {t} = useI18n()

    const loading = ref(false)
    const zoomChecking = ref(false)
    const zoomAvailable = ref(true)
    const item = ref(props.item) || null

    const checkZoomAvailability = async () => {
      if (!item?.value?.zoom_start_at || !item?.value?.instructor_id) return

      try {
        zoomChecking.value = true

        const res = await axiosClient.post("/admin/zoom/check-availability", {
          instructor_id: item?.value?.instructor_id,
          start_at: item?.value?.zoom_start_at
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
          item.zoom_start_at = null
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
