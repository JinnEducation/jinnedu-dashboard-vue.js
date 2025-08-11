<template>
  <div class="card-body text-center pt-0">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      :headers="{Authorization: `Bearer ${token}`}"
      name="attachment"
      :on-success="handleOnSuccess"
      :before-upload="handleBeforeUpload">
      <!-- Image Preview + Remove -->
      <div v-if="thumbnail && thumbnail.url" class="relative d-inline-block">
        <img :src="thumbnail.url" alt="Uploading Image" class="avatar" />
        <el-button
          type="danger"
          size="small"
          circle
          class="remove-btn"
          @click.stop.prevent="removeThumbnail(thumbnail.id)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>

      <!-- Icon Placeholder -->
      <el-icon v-else class="avatar-uploader-icon">
        <plus />
      </el-icon>
    </el-upload>

    <div class="text-muted fs-7">
      {{ label }}
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue"
import {ElMessageBox as Swal} from "element-plus"
import {Delete, Plus} from "@element-plus/icons-vue"
import axiosClient from "@/plugins/axios"
import {useI18n} from "vue-i18n"

const props = defineProps({
  modelValue: Object,
  uploadUrl: {type: String, required: true},
  deleteUrl: {type: String, required: true},
  token: {type: String, required: true},
  label: {type: String, default: ""}
})

const emit = defineEmits(["update:modelValue"])

const {t} = useI18n()

const thumbnail = ref(props.modelValue)

function handleOnSuccess(response) {
  thumbnail.value = {
    id: response.data.id,
    url: response.data.url
  }
  emit("update:modelValue", thumbnail.value)
}

function handleBeforeUpload(file) {
  // Optionally validate file type/size here
  return true
}

function removeThumbnail(id) {
  axiosClient.delete(`${props.deleteUrl}/${id}`).then(() => {
    thumbnail.value = {id: null, url: null}
    emit("update:modelValue", thumbnail.value)
    Swal({
      icon: "success",
      text: t("global.thumbnail-removed-successfully"),
      buttonsStyling: false,
      customClass: {confirmButton: "btn btn-primary"}
    })
  })
}
</script>

<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}
</style>
