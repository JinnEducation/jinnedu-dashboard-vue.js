<template>
    <div class="video-uploader">
  
      <!-- ================== PREVIEW MODE ================== -->
      <div v-if="modelValue" class="video-preview">
        <div class="fw-bold mb-2">
          {{ t("global.selected_file") }}
        </div>
  
        <a
        v-if="modelValue"
        :href="`${baseURL}/show-video?path=${getVideoPath(modelValue)}`"
        target="_blank"
        class="btn btn-sm btn-light-primary me-2"
        >
        <i class="bi bi-play-circle me-1"></i>
        {{ t("global.open_video") }}
        </a>

        <button
          type="button"
          class="btn btn-sm btn-light-danger"
          @click="removeVideo"
        >
          <i class="bi bi-trash me-1"></i>
          {{ t("global.remove") }}
        </button>
      </div>
  
      <!-- ================== UPLOAD MODE ================== -->
      <el-upload
        v-else
        class="w-100"
        drag
        :show-file-list="false"
        :auto-upload="false"
        accept="video/*"
        :on-change="handleVideoChange"
      >
        <div class="text-center">
          <i class="bi bi-cloud-upload fs-2x text-primary"></i>
  
          <div class="el-upload__text mt-3">
            {{ t("global.drop_video_here_or_click") }}
          </div>
  
          <div class="text-muted fs-7 mt-1">
            MP4 / MOV / MKV / WEBM — max 500MB
          </div>
        </div>
      </el-upload>
  
      <!-- Progress -->
      <el-progress
        v-if="progress > 0 && !modelValue"
        :percentage="progress"
        :status="progress === 100 ? 'success' : 'active'"
        class="mt-3"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue"
  import { uploadVideo } from "@/utils/upload"
  import { useI18n } from "vue-i18n"
  const baseURL = import.meta.env.VITE_APP_SERVER_BASE_URL

  
  const { t } = useI18n()
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: null,
    },
    path: String,
  })

  
  const emit = defineEmits(["update:modelValue"])


  const progress = ref(0)
  
  const handleVideoChange = async (file) => {
    if (!file?.raw) return
  
    progress.value = 0
  
    const res = await uploadVideo(file.raw, (p) => {
      progress.value = p
    })
  
    emit("uploaded", {
        url: res.data.media_url,
        path: res.data.path,
    })
  }
  
  const removeVideo = async () => {
  if (props.path) {
    await axiosClient.delete("/admin/upload/video", {
      data: { path: props.path }
    })
  }

  emit("update:modelValue", null)
  emit("update:path", null)
  progress.value = 0
}

  const getVideoPath = (url) => {
  const idx = url.indexOf('/storage/')
  return idx !== -1 ? url.substring(idx + 9) : null
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
  