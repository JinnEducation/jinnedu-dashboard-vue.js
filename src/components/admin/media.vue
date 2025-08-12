<!-- DONE REVIEWING: 26/06/2023 -->
<template>
  <div class="card card-flush py-4">
    <div class="card-header">
      <div class="card-title">
        <h2>{{ t(`global.${title}`) }}</h2>
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="fv-row mb-2">
        <el-upload
          v-model:file-list="list"
          :action="action"
          :name="name"
          :headers="{Authorization: `Bearer ${token}`}"
          :show-file-list="false"
          multiple
          drag>
          <el-icon class="fs-5x mb-4 text-gray-300">
            <document-add />
          </el-icon>
          <div class="fs-5 fw-medium text-gray-700 mb-1">{{ t("global.media-heading") }}</div>
          <div class="fs-7 fw-normal text-gray-500">{{ t("global.media-sub-heading") }}</div>
          <template #tip>
            <div class="text-muted fs-7 mt-2">{{ t(`global.${note}`) }}</div>
          </template>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import {DocumentAdd} from "@element-plus/icons-vue"
import {defineComponent, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useStore} from "vuex"

export default defineComponent({
  name: "add-media",
  components: {DocumentAdd},
  props: {
    title: {
      type: String,
      required: false,
      default: "media"
    },
    action: {
      type: String,
      required: false,
      default: `${import.meta.env.VITE_APP_API_BASE_URL}/medias/create`
    },
    name: {type: String, required: false, default: "attachment"},
    note: {type: String, required: false, default: "media-headline-default"}
  },
  setup(_, {expose}) {
    const {t} = useI18n()
    const store = useStore()
    const {token} = store.state.user
    const list = ref([])
    expose({list})
    return {t, token, list}
  }
})
</script>
