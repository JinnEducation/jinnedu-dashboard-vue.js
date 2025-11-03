<template>
  <toolbar
    :title="
      id ? `${t('global.edit')} ${t('global.blog')}` : `${t('global.add')} ${t('global.blog')}`
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
          <!-- Sidebar -->
          <div class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
            <!-- Thumbnail -->
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.thumbnail") }}</h2>
                </div>
              </div>
              <div class="card-body text-center pt-0">
                <div v-if="imageUploading" class="upload-loading-overlay">
                  <el-icon class="is-loading">
                    <div class="card-body p-0">
                      <div class="card-px text-center py-20 my-10">
                        <div role="status" class="spinner-border text-primary">
                          <span class="visually-hidden">{{ t("global.loading") }}</span>
                        </div>
                      </div>
                    </div>
                  </el-icon>
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
                    <div v-if="data.image" class="relative d-inline-block">
                      <img :src="data.image" alt="Blog Image" class="avatar-image" />
                      <el-button
                        type="danger"
                        size="small"
                        circle
                        class="remove-btn"
                        @click.stop.prevent="removeThumbnail">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                    <el-icon v-else class="avatar-uploader-icon">
                      <plus />
                    </el-icon>
                  </el-upload>
                </div>
                <div class="fs-7 text-danger">
                  {{ t("global.image-validation") }}
                </div>
              </div>
            </div>

            <!-- status -->
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
                    name="status-select"
                    :placeholder="t('global.select-status')"
                    :filterable="true"
                    :clearable="true">
                    <template v-if="statusValues.length > 0">
                      <el-option
                        v-for="item in statusValues"
                        :key="item"
                        :value="item"
                        :label="item" />
                    </template>
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <!-- Category -->
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.category") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="categ_blog_id">
                  <el-select
                    id="category-select"
                    v-model="data.categ_blog_id"
                    name="category-select"
                    :placeholder="t('global.select-category')"
                    :filterable="true"
                    :clearable="true">
                    <template v-if="categories.length > 0">
                      <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name" />
                    </template>
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <!-- date -->
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.date") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item label="Date" prop="date">
                  <el-date-picker
                    v-model="data.date"
                    type="date"
                    placeholder="Select publish date"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    style="width: 100%" />
                </el-form-item>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <languages-tabs v-slot="slot">
              <div class="card-body pt-0">
                <!-- Title -->
                <div class="mb-10 fv-row">
                  <label for="blog-title" class="required form-label">
                    {{ t("global.blog-title") }}
                  </label>
                  <el-form-item :prop="`title.${slot.language.id}`">
                    <el-input
                      id="blog-title"
                      v-model="data.title[slot.language.id]"
                      type="text"
                      name="blog-title"
                      :placeholder="t('global.blog-title')" />
                  </el-form-item>
                </div>

                <!-- Slug -->
                <div class="mb-10 fv-row">
                  <label for="blog-slug" class="required form-label">
                    {{ t("global.slug") }}
                  </label>
                  <el-form-item :prop="`slug.${slot.language.id}`">
                    <el-input
                      id="blog-slug"
                      v-model="data.slug[slot.language.id]"
                      type="text"
                      name="blog-slug"
                      :placeholder="t('global.slug')" />
                  </el-form-item>
                </div>

                <!-- Description -->
                <div class="fv-row">
                  <label for="blog-description" class="required form-label">
                    {{ t("global.description") }}
                  </label>
                  <div
                    :id="`blog-${slot.language.name}-description`"
                    :ref="setEditorsRefs"
                    :data-language-id="slot.language.id"
                    data-key="description"></div>
                </div>
              </div>
            </languages-tabs>

            <!-- Action Buttons -->
            <div class="d-flex justify-content-end">
              <router-link id="cancel" to="/dashboard/blog/index" class="btn btn-light me-5">
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
import {defineComponent, onBeforeMount, onMounted, ref, watch, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"
import ClassicEditor from "../../../ckeditor"
import {Plus, Delete} from "@element-plus/icons-vue"

export default defineComponent({
  name: "blog-add-edit",
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
    const {t} = useI18n()
    const {languages} = store.state
    const {id} = route.params
    const token = computed(() => store.state.user.token)
    const imageUploading = ref(false)
    const {userInfo} = store.state
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
      categ_blog_id: null,
      image: null,
      date: null,
      status: "draft",
      user_id: userId,
      title: {},
      slug: {},
      description: {}
    })

    const rules = ref({
      categ_blog_id: [
        {
          required: true,
          trigger: "change",
          message: t("global.category-required")
        }
      ],
      image: [
        {
          required: !id,
          trigger: "change",
          message: t("global.image-required")
        }
      ],
      title: {},
      slug: {},
      description: {}
    })

    // Create validation rules for each language
    languages.forEach((languageItem) => {
      const {id: langId, name} = languageItem
      rules.value.title[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(`global.title-in-${name.charAt(0).toUpperCase() + name.slice(1)}-required`)
        }
      ]
      rules.value.slug[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(`global.slug-in-${name.charAt(0).toUpperCase() + name.slice(1)}-required`)
        }
      ]
      rules.value.description[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(
            `global.description-in-${name.charAt(0).toUpperCase() + name.slice(1)}-required`
          )
        }
      ]
    })
    // راقب العنوان لكل لغة وحدث الـ slug لكل لغة بناءً على العنوان الخاص بها (فقط عند الإنشاء)
    const isEditMode = ref(false)

    watch(
      () => ({...data.value.title}),
      (titles) => {
        // لا تقم بتحديث الـ slug تلقائياً في وضع التعديل
        if (isEditMode.value) return

        if (!data.value.slug || typeof data.value.slug !== "object") {
          data.value.slug = {}
        }
        Object.entries(titles || {}).forEach(([langId, titleVal]) => {
          data.value.slug[langId] = (titleVal || "")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
        })
      },
      {deep: true}
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
        customClass: {confirmButton: "btn btn-primary"}
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
              customClass: {confirmButton: "btn btn-primary"}
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
          editors.push({id: editorData?.editorId, key: editorData?.editorKey, editor})
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
        initializeCKEditor({editor, editorId, editorKey})
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
            categ_blog_id: data.value.categ_blog_id,
            image: data.value.image,
            date: data.value.date,
            status: data.value.status,
            user_id: data.value.user_id,
            title: data.value.title || "",
            slug: data.value.slug || "",
            description: data.value.description || "",
            langs: languages
          }

          const apiUrl = id ? `/blog/${id}` : `/blog`
          const apiMethod = id ? "put" : "post"

          axiosClient[apiMethod](apiUrl, payload)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: id
                  ? t("global.blog-updated-successfully")
                  : t("global.blog-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              router.push({name: "private-artical-list"})
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
      loading.value = true

      // Fetch categories
      const categoriesPromise = axiosClient
        .get(`/cateqblog`)
        .then((response) => {
          categories.value = response.data.data || response.data.result?.data || []
        })
        .catch(() => {
          categories.value = []
        })

      Promise.resolve(categoriesPromise).then(() => {
        // When there is an ID, get blog data and populate form
        if (id) {
          isEditMode.value = true
          axiosClient
            .get(`/blog/${id}`)
            .then((response) => {
              const result = response.data || response.data.result
              // Set main fields
              data.value.categ_blog_id = result.categ_blog_id || result.relations?.categ_blog_id?.id
              data.value.image = result.image
              data.value.status = result.status
              data.value.date = result.date
              data.value.user_id = result.user_id || result.relations?.user?.id || userId

              // Set language fields - the API returns title, slug, description as objects with language IDs as keys
              if (result.title && typeof result.title === "object") {
                data.value.title = {...result.title}
              }

              if (result.slug && typeof result.slug === "object") {
                data.value.slug = {...result.slug}
              }

              // Set editor data when editors are ready
              if (result.description && typeof result.description === "object") {
                setTimeout(() => {
                  Object.entries(result.description).forEach(([langId, descriptionContent]) => {
                    editors.forEach((editor) => {
                      if (Number(editor.id) === Number(langId)) {
                        editor.editor.setData(descriptionContent || "")
                      }
                    })
                  })
                }, 500)
              }

              loading.value = false
              if (form.value) form.value.clearValidate()
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                text: t("global.error-loading-blog"),
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
              loading.value = false
            })
        } else {
          loading.value = false
        }
      })

      statusValues.value = ["draft", "published", "archived"]
    })
    return {
      id,
      API_PATH,
      t,
      loading,
      form,
      rules,
      button,
      statusValues,
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
  background-color: yellow; /* Change this to your desired color */
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
