<template>
  <toolbar
    :title="
      id ? `${t('global.edit')} ${t('global.help')}` : `${t('global.add')} ${t('global.help')}`
    " />
  <div class="app-content flex-column-fluid mb-10">
    <div class="app-container container-xxl">
      <template v-if="loading">
        <div class="card-body p-0">
          <div class="card-px text-center py-20 my-10">
            <div role="status" class="spinner-border text-primary">
              <span class="visually-hidden">{{ t("global.loading") }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-show="!loading">
        <el-form
          ref="form"
          :model="data"
          :rules="rules"
          class="form d-flex flex-column flex-lg-row">
          <div class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.icon") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <ul class="nav nav-line-tabs nav-line-tabs-2x fs-7 mb-5">
                  <li class="nav-item">
                    <a
                      class="nav-link px-3 py-2"
                      :class="{active: iconType === 'upload'}"
                      @click="onIconTypeChange('upload')">
                      {{ t("global.thumbnail") }}
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link px-3 py-2"
                      :class="{active: iconType === 'url'}"
                      @click="onIconTypeChange('url')"
                      >URL</a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link px-3 py-2"
                      :class="{active: iconType === 'svg'}"
                      @click="onIconTypeChange('svg')"
                      >SVG</a
                    >
                  </li>
                </ul>

                <template v-if="iconType === 'upload'">
                  <div class="text-center">
                    <div v-if="iconUploading" class="upload-loading-overlay">
                      <div role="status" class="spinner-border text-primary">
                        <span class="visually-hidden">{{ t("global.loading") }}</span>
                      </div>
                    </div>
                    <div v-else>
                      <el-upload
                        class="avatar-uploader"
                        :action="`${API_PATH}/medias/create`"
                        :show-file-list="false"
                        :headers="{Authorization: `Bearer ${token}`}"
                        name="attachment"
                        :on-start="handleUploadStart"
                        :on-progress="handleUploadProgress"
                        :on-success="handleOnSuccess"
                        :before-upload="handleBeforeUpload">
                        <div v-if="data.icon" class="relative d-inline-block">
                          <img
                            v-if="iconPreview"
                            :src="iconPreview"
                            alt="Help Icon"
                            class="avatar-image" />
                          <div v-else class="icon-fallback">{{ t("global.icon") }}</div>
                          <el-button
                            type="danger"
                            size="small"
                            circle
                            class="remove-btn"
                            @click.stop.prevent="removeIcon">
                            <el-icon><Delete /></el-icon>
                          </el-button>
                        </div>
                        <el-icon v-else class="avatar-uploader-icon">
                          <Plus />
                        </el-icon>
                      </el-upload>
                    </div>
                  </div>
                </template>

                <template v-else-if="iconType === 'url'">
                  <el-form-item prop="icon">
                    <el-input
                      v-model="data.icon"
                      type="text"
                      placeholder="https://example.com/icon.png" />
                  </el-form-item>
                  <div v-if="data.icon" class="mt-4 text-center">
                    <img
                      v-if="iconPreview"
                      :src="iconPreview"
                      alt="Help Icon"
                      class="avatar-image" />
                  </div>
                </template>

                <template v-else>
                  <el-form-item prop="icon_svg">
                    <el-input
                      v-model="data.icon_svg"
                      type="textarea"
                      :rows="6"
                      placeholder="<svg>...</svg>" />
                  </el-form-item>
                </template>
              </div>
            </div>

            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.type") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="audience">
                  <el-select
                    v-model="data.audience"
                    :placeholder="t('global.type')"
                    :filterable="true"
                    :clearable="false">
                    <el-option value="student" :label="t('global.student')" />
                    <el-option value="tutor" :label="t('global.tutor')" />
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.status") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="status">
                  <el-select
                    v-model="data.status"
                    :placeholder="t('global.select-status')"
                    :filterable="true"
                    :clearable="true">
                    <template v-if="statusValues.length > 0">
                      <el-option
                        v-for="item in statusValues"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label" />
                    </template>
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.slug") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="slug">
                  <el-input v-model="data.slug" type="text" :placeholder="t('global.slug')" />
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <languages-tabs v-slot="slot">
              <div class="card-body pt-0">
                <div class="mb-10 fv-row">
                  <label for="help-title" class="required form-label">{{
                    t("global.title")
                  }}</label>
                  <el-form-item :prop="`title.${slot.language.id}`">
                    <el-input
                      id="help-title"
                      v-model="data.title[slot.language.id]"
                      type="text"
                      :placeholder="t('global.title')" />
                  </el-form-item>
                </div>

                <div class="fv-row">
                  <label
                    :for="`help-description-${slot.language.id}`"
                    class="required form-label"
                    >{{ t("global.description") }}</label
                  >
                  <div
                    :id="`help-description-${slot.language.id}`"
                    :ref="setEditorsRefs"
                    :data-language-id="slot.language.id"
                    data-key="description" />
                </div>
              </div>
            </languages-tabs>

            <div class="d-flex justify-content-end">
              <router-link
                id="cancel"
                :to="`/dashboard/help-articles/index/${data.audience || 'student'}`"
                class="btn btn-light me-5">
                {{ t("global.cancel") }}
              </router-link>
              <button
                id="submit"
                ref="button"
                type="submit"
                class="btn btn-primary"
                @click.prevent="submit">
                <span class="indicator-label">{{ t("global.save-changes") }}</span>
                <span class="indicator-progress">
                  {{ t("global.please-wait") }}...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import LanguagesTabs from "@/components/admin/languages-tabs.vue"
import {ElMessage as Message} from "element-plus"
import {computed, defineComponent, onBeforeMount, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "@/plugins/axios"
import ClassicEditor from "@/ckeditor"
import {Plus, Delete} from "@element-plus/icons-vue"

export default defineComponent({
  name: "help-articles-add-edit",
  components: {
    Toolbar,
    LanguagesTabs,
    Plus,
    Delete
  },
  setup() {
    const API_PATH = ref(import.meta.env.VITE_APP_API_BASE_URL)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const {t} = useI18n()
    const {languages, userInfo} = store.state
    const {id} = route.params
    const token = computed(() => store.state.user.token)
    const STORAGE_BASE =
      import.meta.env.VITE_APP_Public_URL || "https://learning.jinnedu.com/public"
    const iconUploading = ref(false)
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type

    const loading = ref(false)
    const form = ref(null)
    const button = ref(null)
    const statusValues = ref([])
    const iconType = ref("upload")
    const editors = []
    const mediaId = ref(null)

    const data = ref({
      audience: "student",
      slug: "",
      icon: "",
      icon_svg: "",
      status: "draft",
      title: {},
      description: {}
    })

    const iconPreview = computed(() => {
      if (!data.value.icon) return ""
      if (data.value.icon.startsWith("http")) return data.value.icon
      return `${STORAGE_BASE}/storage/${data.value.icon}`
    })

    const rules = ref({
      audience: [
        {
          required: true,
          trigger: "change",
          message: t("global.type-required")
        }
      ],
      slug: [
        {
          required: true,
          trigger: "blur",
          message: t("global.slug-required")
        }
      ],
      status: [
        {
          required: true,
          trigger: "change",
          message: t("global.status-required")
        }
      ],
      title: {},
      description: {}
    })

    languages.forEach((languageItem) => {
      const {id: langId, name} = languageItem
      const normalName = name.toLowerCase()

      rules.value.title[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(`global.title-in-${normalName}-required`)
        }
      ]

      rules.value.description[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(`global.description-in-${normalName}-required`)
        }
      ]
    })

    const handleUploadStart = () => {
      iconUploading.value = true
    }

    const handleUploadProgress = () => {
      iconUploading.value = true
    }

    const handleBeforeUpload = (file) => {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"]
      if (!allowedMimeTypes.includes(file.type)) {
        Message.error(t("errors.image-must-be-in-jpg-or-png-format."))
        return false
      }

      const maxSize = 5
      if (file.size / 1024 / 1024 > maxSize) {
        Message.error(t("errors.file-size-must-not-exceed-5-mb"))
        return false
      }

      return true
    }

    const handleOnSuccess = (response) => {
      mediaId.value = response.result.id
      data.value.icon = `${response.result.path}`
      iconUploading.value = false

      Swal.fire({
        icon: "success",
        text: t("global.thumbnail-added-successfully"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-primary"}
      })
    }

    const removeIcon = function removeIcon() {
      if (iconType.value === "svg") {
        data.value.icon_svg = ""
        return
      }

      if (mediaId.value) {
        iconUploading.value = true
        axiosClient
          .delete(`/medias/delete/${mediaId.value}`)
          .then(() => {
            data.value.icon = ""
            mediaId.value = null
            Swal.fire({
              icon: "success",
              text: t("global.thumbnail-removed-successfully"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-primary"}
            })
          })
          .finally(() => {
            iconUploading.value = false
          })
      } else {
        data.value.icon = ""
      }
    }

    const onIconTypeChange = (type) => {
      iconType.value = type
    }

    const initializeCKEditor = (editorData) => {
      ClassicEditor.create(editorData?.editor)
        .then((editor) => {
          editors.push({id: editorData?.editorId, key: editorData?.editorKey, editor})
        })
        .catch(() => {
          // editor init error
        })
    }

    const setEditorsRefs = function setEditorsRefs(editor) {
      if (editor) {
        const editorId = editor?.getAttribute("data-language-id")
        const editorKey = editor?.getAttribute("data-key")
        initializeCKEditor({editor, editorId, editorKey})
      }
    }

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disabled = true
      button.value.ariaDisabled = true

      form.value.validate((valid, errors) => {
        if (valid) {
          editors.forEach((editor) => {
            data.value.description[editor.id] = editor.editor.getData()
          })

          const payload = {
            audience: data.value.audience,
            slug: data.value.slug,
            icon: iconType.value === "svg" ? null : data.value.icon || null,
            icon_svg: iconType.value === "svg" ? data.value.icon_svg || null : null,
            status: data.value.status,
            title: data.value.title || {},
            description: data.value.description || {},
            langs: languages
          }

          const apiUrl = id ? `/help-articles/${id}` : `/help-articles`
          const apiMethod = id ? "put" : "post"

          axiosClient[apiMethod](apiUrl, payload)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: id
                  ? t("global.data-updated-successfully")
                  : t("global.data-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              router.push({
                name: "help-articles-list",
                params: {audience: data.value.audience || "student"}
              })
            })
            .catch((error) => {
              const errorMsg = error.response?.data?.message || t("global.errors-detected")
              Swal.fire({
                icon: "error",
                text: errorMsg,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            })
            .finally(() => {
              button.value.removeAttribute("data-kt-indicator")
              button.value.disabled = false
              button.value.ariaDisabled = false
            })
        } else {
          const errorMessages = Object.values(errors)
            .flat()
            .map((error) => error.message)

          Swal.fire({
            icon: "error",
            title: t("global.errors-detected"),
            html: errorMessages.join("<br>"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })

          button.value.removeAttribute("data-kt-indicator")
          button.value.disabled = false
          button.value.ariaDisabled = false
        }
      })
    }

    onBeforeMount(() => {
      if (id) loading.value = true
    })

    onMounted(() => {
      statusValues.value =
        userType === 2
          ? [
              {
                value: "draft",
                label: t("global.draft")
              }
            ]
          : [
              {
                value: "draft",
                label: t("global.draft")
              },
              {
                value: "published",
                label: t("global.published")
              },
              {
                value: "archived",
                label: t("global.archived")
              }
            ]

      if (id) {
        loading.value = true
        axiosClient
          .get(`/help-articles/${id}`)
          .then((response) => {
            const result = response.data.data || response.data.result || response.data

            data.value.audience = result.audience || "student"
            data.value.slug = result.slug || ""
            data.value.icon = result.icon || ""
            data.value.icon_svg = result.icon_svg || ""
            data.value.status = result.status || "draft"

            if (data.value.icon_svg) iconType.value = "svg"
            else if (data.value.icon) iconType.value = "url"

            if (result.title && typeof result.title === "object")
              data.value.title = {...result.title}

            if (result.description && typeof result.description === "object") {
              setTimeout(() => {
                Object.entries(result.description).forEach(([langId, content]) => {
                  editors.forEach((editor) => {
                    if (Number(editor.id) === Number(langId)) {
                      editor.editor.setData(content || "")
                    }
                  })
                })
              }, 600)
            }

            loading.value = false
            if (form.value) form.value.clearValidate()
          })
          .catch(() => {
            loading.value = false
            Swal.fire({
              icon: "error",
              text: t("global.errors-detected"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
          })
      } else {
        loading.value = false
      }
    })

    return {
      id,
      API_PATH,
      t,
      loading,
      form,
      rules,
      button,
      data,
      statusValues,
      iconType,
      token,
      iconUploading,
      iconPreview,
      setEditorsRefs,
      handleOnSuccess,
      handleBeforeUpload,
      handleUploadStart,
      handleUploadProgress,
      removeIcon,
      onIconTypeChange,
      submit
    }
  }
})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: block;
}

.avatar-uploader .avatar-image {
  height: 180px;
  width: 180px;
  border-radius: 12px;
  object-fit: cover;
}

.icon-fallback {
  width: 180px;
  height: 180px;
  border-radius: 12px;
  border: 1px dashed #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style>
.avatar-uploader .el-upload {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 0.0625rem dashed var(--el-border-color);
  border-radius: 0.25rem;
  transition: var(--el-transition-duration-fast);
  cursor: pointer;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 2rem;
  color: var(--el-border-color);
  width: 100%;
  height: 100%;
  text-align: center;
}

.upload-loading-overlay {
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
}

.remove-btn {
  position: relative;
  top: -30px;
}
</style>
