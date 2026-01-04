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
import {ref, computed} from "vue"
import axiosClient from "@/plugins/axios"
import {uploadVideo} from "@/utils/upload"
import {useI18n} from "vue-i18n"

const {t} = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(["update:modelValue"])

const progress = ref(0)
const internalPath = ref(null) // 👈 داخلي فقط

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

// رابط الفتح (صفحة show-video)
//   const openVideoUrl = computed(() => {
//     if (!internalPath.value) return props.modelValue
//     return `${import.meta.env.VITE_APP_SERVER_BASE_URL}/show-video?path=${internalPath.value}`
//   })
const openVideoUrl = computed(() => {
  const path = resolveStoragePath(props.modelValue)

  if (path) {
    return `${import.meta.env.VITE_APP_SERVER_BASE_URL}/show-video?path=${path}`
  }

  // رابط خارجي (YouTube / غيره)
  return props.modelValue
})

// رفع الفيديو
const handleVideoChange = async (file) => {
  if (!file?.raw) return

  progress.value = 0

  const res = await uploadVideo(file.raw, (p) => {
    progress.value = p
  })

  // نخزن الاثنين داخليًا
  emit("update:modelValue", res.data.media_url)
  internalPath.value = res.data.path
}

// حذف الفيديو (فعلي)
const removeVideo = async () => {
  const path = resolveStoragePath(props.modelValue)

  // فقط لو الملف من storage
  if (path) {
    await axiosClient.delete("/admin/upload/video", {
      data: {path}
    })
  }

  internalPath.value = null
  emit("update:modelValue", null)
  progress.value = 0
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
