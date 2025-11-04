<template>
  <toolbar :title="id ? `${t('global.edit')} ${t('global.cateqblog')}` : `${t('global.add')} ${t('global.cateqblog')}`
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
        <el-form ref="form" :model="data" :rules="rules" class="form d-flex flex-column flex-lg-row">
          <!-- Sidebar -->
          <div class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
            <!-- sort_order -->
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.sort_order") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="sort_order">
                  <el-input v-model.number="data.sort_order" type="number" name="sort-order"
                    :placeholder="t('global.sort_order')" min="0" />
                </el-form-item>
              </div>
            </div>
            <!-- is_active -->
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.status") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="is_active">
                  <el-select v-model="data.is_active" name="is-active-select" :placeholder="t('global.select-status')"
                    :filterable="true" :clearable="true">
                    <el-option :value="1" :label="t('global.active')" />
                    <el-option :value="0" :label="t('global.inactive')" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <languages-tabs v-slot="slot">
              <div class="card-body pt-0">
                <!-- name -->
                <div class="mb-10 fv-row">
                  <label for="cateqblog-name" class="required form-label">
                    {{ t("global.cateqblog-name") }}
                  </label>
                  <el-form-item :prop="`name.${slot.language.id}`">
                    <el-input id="cateqblog-name" v-model="data.name[slot.language.id]" type="text"
                      name="cateqblog-name" :placeholder="t('global.cateqblog-name')" />
                  </el-form-item>
                </div>

                <!-- Slug -->
                <div class="mb-10 fv-row">
                  <label for="cateqblog-slug" class="required form-label">
                    {{ t("global.slug") }}
                  </label>
                  <el-form-item :prop="`slug.${slot.language.id}`">
                    <el-input id="cateqblog-slug" v-model="data.slug[slot.language.id]" type="text"
                      name="cateqblog-slug" :placeholder="t('global.slug')" />
                  </el-form-item>
                </div>
              </div>
            </languages-tabs>

            <!-- Action Buttons -->
            <div class="d-flex justify-content-end">
              <router-link id="cancel" to="/dashboard/cateqblog/index" class="btn btn-light me-5">
                {{ t("global.cancel") }}
              </router-link>
              <button id="submit" ref="button" type="submit" class="btn btn-primary" @click.prevent="submit">
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
import { ElMessage as Message } from "element-plus"
import { defineComponent, onBeforeMount, onMounted, ref, watch, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"
import axiosClient from "../../../plugins/axios"
import ClassicEditor from "../../../ckeditor"
import { Plus, Delete } from "@element-plus/icons-vue"

export default defineComponent({
  name: "cateqblog-add-edit",
  components: {
    Toolbar,
    LanguagesTabs,
    Plus,
    Delete
  },
  setup() {
    // Get necessary data from router/route/store
    const API_PATH = ref(import.meta.env.VITE_APP_API_BASE_URL)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { t } = useI18n()
    const { languages } = store.state
    const { id } = route.params
    const token = computed(() => store.state.user.token)
    const imageUploading = ref(false)
    const { userInfo } = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userId = userInfoObject.user.id

    // Define form necessary data
    const loading = ref(false)
    const form = ref(null)
    const button = ref(null)
    const statusValues = ref([])
    const categories = ref([])
    const editors = []
    const mediaId = ref(null)

    // Define data schema to be submitted
    const data = ref({
      is_active: 1,
      sort_order: 0,
      user_id: userId,
      name: {},
      slug: {},
    })

    const rules = ref({
      is_active: [
        {
          required: true,
          trigger: "change",
          message: t("global.is_active-required")
        }
      ],
      sort_order: [
        {
          required: true,
          trigger: "change",
          message: t("global.sort_order-required")
        }
      ],
      name: {},
      slug: {}
    })

    // Create validation rules for each language
    languages.forEach((languageItem) => {
      const { id: langId, name } = languageItem
      rules.value.name[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(`global.name-in-${name.charAt(0).toUpperCase() + name.slice(1)}-required`)
        }
      ]
      rules.value.slug[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(`global.slug-in-${name.charAt(0).toUpperCase() + name.slice(1)}-required`)
        }
      ]
    })
    // راقب العنوان لكل لغة وحدث الـ slug لكل لغة بناءً على العنوان الخاص بها (فقط عند الإنشاء)
    const isEditMode = ref(false)

    watch(
      () => ({ ...data.value.name }),
      (names) => {
        // لا تقم بتحديث الـ slug تلقائياً في وضع التعديل
        if (isEditMode.value) return

        if (!data.value.slug || typeof data.value.slug !== "object") {
          data.value.slug = {}
        }
        Object.entries(names || {}).forEach(([langId, nameVal]) => {
          data.value.slug[langId] = (nameVal || "")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
        })
      },
      { deep: true }
    )

    const handleUploadStart = () => {
      imageUploading.value = true
    }

    const handleUploadProgress = () => {
      imageUploading.value = true
    }

    const handleBeforeUpload = (file) => {
      const allowedMimeTypes = ["image/jpeg", "image/png"]

      if (!allowedMimeTypes.includes(file.type)) {
        Message.error(t("errors.image-must-be-in-jpg-or-png-format."))
        return false
      }

      // Validate file size (5MB max)
      const maxSize = 5
      if (file.size / 1024 / 1024 > maxSize) {
        Message.error(t("errors.file-size-must-not-exceed-5-mb"))
        return false
      }

      return true
    }

    // When upload thumbnail successfully
    const handleOnSuccess = (response) => {
      mediaId.value = response.result.id
      data.value.image = `${response.result.path}`
      Swal.fire({
        icon: "success",
        text: t("global.thumbnail-added-successfully"),
        buttonsStyling: false,
        customClass: { confirmButton: "btn btn-primary" }
      })
      imageUploading.value = false
    }

    const removeThumbnail = function removeThumbnail() {
      if (mediaId.value) {
        imageUploading.value = true
        axiosClient
          .delete(`/medias/delete/${mediaId.value}`)
          .then(() => {
            data.value.image = null
            mediaId.value = null
            Swal.fire({
              icon: "success",
              text: t("global.thumbnail-removed-successfully"),
              buttonsStyling: false,
              customClass: { confirmButton: "btn btn-primary" }
            })
            imageUploading.value = false
          })
          .catch(() => {
            imageUploading.value = false
          })
      } else {
        data.value.image = null
      }
    }

    const initializeCKEditor = (editorData) => {
      ClassicEditor.create(editorData?.editor)
        .then((editor) => {
          editors.push({ id: editorData?.editorId, key: editorData?.editorKey, editor })
        })
        .catch(() => {
          // Error initializing editor
        })
    }

    // Get value from editors and add it to editors array
    const setEditorsRefs = function setEditorsRefs(editor) {
      if (editor) {
        const editorId = editor?.getAttribute("data-language-id")
        const editorKey = editor?.getAttribute("data-key")
        initializeCKEditor({ editor, editorId, editorKey })
      }
    }

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disable = true
      button.value.ariaDisabled = true

      form.value.validate((valid, errors) => {
        if (valid) {
          // Get editor data for each language
          editors.forEach((editor) => {
            data.value.description[editor.id] = editor.editor.getData()
          })

          // Prepare payload
          const payload = {
            is_active: data.value.is_active,
            sort_order: data.value.sort_order,
            user_id: data.value.user_id,
            name: data.value.name || "",
            slug: data.value.slug || "",
            langs: languages
          }

          const apiUrl = id ? `/cateqblog/${id}` : `/cateqblog`
          const apiMethod = id ? "put" : "post"

          axiosClient[apiMethod](apiUrl, payload)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: id
                  ? t("global.cateqblog-updated-successfully")
                  : t("global.cateqblog-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: { confirmButton: "btn btn-primary" }
              })
              router.push({ name: "private-artical-list" })
            })
            .catch((error) => {
              const errorMsg = error.response?.data?.message || t("global.errors-detected")
              Swal.fire({
                icon: "error",
                text: errorMsg,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: { confirmButton: "btn btn-danger" }
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
            customClass: { confirmButton: "btn btn-danger" }
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
      loading.value = true
      if (id) {
        isEditMode.value = true
        axiosClient
          .get(`/cateqblog/${id}`)
          .then((response) => {
            const result = response.data || response.data.result
            // Set main fields
            data.value.is_active = result.is_active
            data.value.sort_order = result.sort_order
            data.value.user_id = result.user_id || result.relations?.user?.id || userId
            // Set language fields - the API returns title, slug, description as objects with language IDs as keys
            if (result.name && typeof result.name === "object") {
              data.value.name = { ...result.name }
            }

            if (result.slug && typeof result.slug === "object") {
              data.value.slug = { ...result.slug }
            }
            loading.value = false
            if (form.value) form.value.clearValidate()
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: t("global.error-loading-cateqblog"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: { confirmButton: "btn btn-danger" }
            })
            loading.value = false
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
      categories,
      setEditorsRefs,
      handleOnSuccess,
      handleBeforeUpload,
      submit,
      token,
      removeThumbnail,
      handleUploadStart,
      handleUploadProgress,
      imageUploading
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
  height: 280px;
}

.dp__outer_menu_wrap {
  width: 775px;
}
</style>

<style>
.selected-date {
  background-color: yellow;
  /* Change this to your desired color */
}

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
  top: -40px;
}
</style>
