<template>
  <toolbar
    :title="
      id ? `${t('global.edit')} ${t('global.slider')}` : `${t('global.add')} ${t('global.slider')}`
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
                      <img :src="data.image" alt="Slider Image" class="avatar-image" />
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

            <!-- Button URL -->
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.button-url") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="btn_url">
                  <el-input
                    v-model="data.btn_url"
                    type="text"
                    name="btn-url"
                    placeholder="https://example.com" />
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
                  <label for="slider-title" class="required form-label">
                    {{ t("global.title") }}
                  </label>
                  <el-form-item :prop="`title.${slot.language.id}`">
                    <el-input
                      id="slider-title"
                      v-model="data.title[slot.language.id]"
                      type="text"
                      name="slider-title"
                      :placeholder="t('global.title')" />
                  </el-form-item>
                </div>
                <!-- Sub Title -->
                <div class="fv-row">
                  <label for="sub-title" class="required form-label">
                    {{ t("global.sub-title") }}
                  </label>
                  <el-form-item :prop="`sub_title.${slot.language.id}`">
                    <el-input
                      id="sub-title"
                      v-model="data.sub_title[slot.language.id]"
                      type="text"
                      name="sub-title"
                      :placeholder="t('global.sub-title')" />
                  </el-form-item>
                </div>
                <!-- Button Name -->
                <div class="mb-10 fv-row">
                  <label for="btn-name" class="required form-label">
                    {{ t("global.button-name") }}
                  </label>
                  <el-form-item :prop="`btn_name.${slot.language.id}`">
                    <el-input
                      id="btn-name"
                      v-model="data.btn_name[slot.language.id]"
                      type="text"
                      name="btn-name"
                      :placeholder="t('global.button-name')" />
                  </el-form-item>
                </div>


              </div>
            </languages-tabs>

            <!-- Action Buttons -->
            <div class="d-flex justify-content-end">
              <router-link id="cancel" to="/dashboard/slider/index" class="btn btn-light me-5">
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
import {defineComponent, onBeforeMount, onMounted, ref, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"
import {Plus, Delete} from "@element-plus/icons-vue"

export default defineComponent({
  name: "slider-add-edit",
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

    // Define form necessary data
    const loading = ref(false)
    const form = ref(null)
    const button = ref(null)
    const mediaId = ref(null)

    // Define data schema to be submitted
    const data = ref({
      image: null,
      btn_url: "",
      title: {},
      sub_title: {},
      btn_name: {}
    })

    const rules = ref({
      btn_url: [
        {
          required: true,
          trigger: "change",
          message: t("global.button-url-required")
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
      sub_title: {},
      btn_name: {}
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
      rules.value.btn_name[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(`global.button-name-in-${name.charAt(0).toUpperCase() + name.slice(1)}-required`)
        }
      ]
      rules.value.sub_title[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(
            `global.sub-title-in-${name.charAt(0).toUpperCase() + name.slice(1)}-required`
          )
        }
      ]
    })

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

    // CKEditor removed - not needed for slider

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disable = true
      button.value.ariaDisabled = true

      form.value.validate((valid, errors) => {
        if (valid) {
          // Prepare payload
          const payload = {
            image: data.value.image,
            btn_url: data.value.btn_url,
            title: data.value.title || "",
            sub_title: data.value.sub_title || "",
            btn_name: data.value.btn_name || "",
            langs: languages
          }

          const apiUrl = id ? `/slider/${id}` : `/slider`
          const apiMethod = id ? "put" : "post"

          axiosClient[apiMethod](apiUrl, payload)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: id
                  ? t("global.slider-updated-successfully")
                  : t("global.slider-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              router.push({name: "slider-list"})
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

      // When there is an ID, get slider data and populate form
      if (id) {
        axiosClient
          .get(`/slider/${id}`)
          .then((response) => {
            const result = response.data.data || response.data.result || response.data
            // Set main fields
            data.value.image = result.image
            data.value.btn_url = result.btn_url

            // Set language fields - the API returns title, sub_title, btn_name as objects with language IDs as keys
            if (result.title && typeof result.title === "object") {
              data.value.title = {...result.title}
            }

            if (result.sub_title && typeof result.sub_title === "object") {
              data.value.sub_title = {...result.sub_title}
            }

            if (result.btn_name && typeof result.btn_name === "object") {
              data.value.btn_name = {...result.btn_name}
            }

            loading.value = false
            if (form.value) form.value.clearValidate()
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: t("global.error-loading-slider"),
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
    return {
      id,
      API_PATH,
      t,
      loading,
      form,
      rules,
      button,
      data,
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
