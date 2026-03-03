<template>
  <div class="video-uploader">
    <!-- PREVIEW -->
    <div v-if="modelValue" class="video-preview">
      <div class="fw-bold mb-2">
        {{ t("global.selected_file") }}
      </div>

      <a :href="openVideoUrl" target="_blank" class="btn btn-sm btn-light-primary me-2">
        <i class="bi bi-play-circle me-1"></i>
        {{ t("global.open_video") }}
      </a>

      <button type="button" class="btn btn-sm btn-light-danger" @click="removeVideo">
        <i class="bi bi-trash me-1"></i>
        {{ t("global.remove") }}
      </button>
    </div>

    <!-- UPLOAD -->
    <el-upload
      v-else
      class="w-100"
      drag
      :show-file-list="false"
      :auto-upload="false"
      accept="video/*"
      :on-change="handleVideoChange">
      <div class="text-center">
        <i class="bi bi-cloud-upload fs-2x text-primary"></i>
        <div class="el-upload__text mt-3">
          {{ t("global.drop_video_here_or_click") }}
        </div>
        <div class="text-muted fs-7 mt-1">MP4 / MOV / MKV / WEBM</div>
      </div>
    </el-upload>

    <el-progress
      v-if="progress > 0 && !modelValue"
      :percentage="progress"
      :status="progress === 100 ? 'success' : 'active'"
      class="mt-3" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { uploadConferenceRecordingVideo } from "@/utils/upload"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(["update:modelValue", "remove"])

const progress = ref(0)

const resolveStoragePath = (url) => {
  if (!url) return null

  try {
    const u = new URL(url)

    if (!u.origin.startsWith(import.meta.env.VITE_APP_SERVER_BASE_URL)) {
      return null
    }

    const idx = u.pathname.indexOf("/storage/")
    if (idx === -1) return null

    return u.pathname.substring(idx + 9)
  } catch (e) {
    return null
  }
}

const openVideoUrl = computed(() => {
  const path = resolveStoragePath(props.modelValue)

  if (path) {
    return `${import.meta.env.VITE_APP_SERVER_BASE_URL}/show-video?path=${path}`
  }

  return props.modelValue
})

const handleVideoChange = async (file) => {
  if (!file?.raw) return

  progress.value = 0

  const res = await uploadConferenceRecordingVideo(file.raw, (p) => {
    progress.value = p
  })

  const mediaUrl = res.data?.media_url ?? res.data?.result?.media_url ?? res.data
  emit("update:modelValue", mediaUrl)
}

const removeVideo = () => {
  progress.value = 0
  emit("remove")
}
</script>

<style scoped>
.video-uploader :deep(.el-upload-dragger) {
  padding: 30px;
  border-radius: 8px;
}

.video-preview {
  border: 1px dashed #dcdfe6;
  padding: 16px;
  border-radius: 8px;
}
</style>
