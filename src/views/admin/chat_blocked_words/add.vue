<template>
  <toolbar
    :title="
      id
        ? `${t('global.edit')} ${t('global.chat-blocked-word')}`
        : `${t('global.add')} ${t('global.chat-blocked-word')}`
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
        <el-form ref="form" :model="data" :rules="rules" class="form">
          <!-- Main Content -->
          <div class="card card-flush">
            <div class="card-body pt-10">
              <div class="fv-row row">
                <!-- Word -->
                <div class="col-12 col-md-6">
                  <label for="blocked-word" class="required form-label">
                    {{ t("global.word") }}
                  </label>
                  <el-form-item prop="word">
                    <el-input
                      id="blocked-word"
                      v-model="data.word"
                      type="text"
                      name="blocked-word"
                      :placeholder="t('global.enter-word')"
                      :disabled="wordChecking"
                      maxlength="255">
                      <template #suffix>
                        <el-icon v-if="wordChecking" class="is-loading">
                          <Loading />
                        </el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
              <!-- Is Active -->
              <div class="fv-row">
                <label for="blocked-word-is-active" class="form-label">
                  {{ t("global.status") }}
                </label>
                <el-form-item prop="is_active">
                  <el-switch
                    id="blocked-word-is-active"
                    v-model="data.is_active"
                    :active-text="t('global.active')"
                    :inactive-text="t('global.in-active')" />
                </el-form-item>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex justify-content-end">
                <router-link
                  id="cancel"
                  to="/dashboard/chat_blocked_words/index"
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
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import {defineComponent, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import axiosClient from "../../../plugins/axios"
import Swal from "sweetalert2"
import {Loading} from "@element-plus/icons-vue"

export default defineComponent({
  name: "chat-blocked-word-add-edit",
  components: {
    Toolbar,
    Loading
  },
  setup() {
    // Get necessary data from router/route/store
    const router = useRouter()
    const route = useRoute()
    const {t} = useI18n()
    const {id} = route.params

    // Define form necessary data
    const loading = ref(false)
    const form = ref(null)
    const button = ref(null)
    const wordChecking = ref(false)
    const originalWord = ref(null) // Store original word when editing

    // Define data schema to be submitted
    const data = ref({
      word: "",
      is_active: true
    })

    // Check if word exists in API
    const checkWordExists = async (word) => {
      if (!word || word.trim() === "") {
        return false
      }

      const trimmedWord = word.trim()

      // Skip check if editing and word hasn't changed
      if (
        id &&
        originalWord.value &&
        trimmedWord.toLowerCase() === originalWord.value.toLowerCase()
      ) {
        return false
      }

      try {
        wordChecking.value = true
        const response = await axiosClient.post("/chat-blocked-words/check-word", {
          word: trimmedWord,
          exclude_id: id || null // Exclude current ID when editing
        })
        wordChecking.value = false

        // API should return { exists: true/false } or { available: true/false }
        return response.data?.exists === true || response.data?.available === false
      } catch (error) {
        wordChecking.value = false
        // If 404 or word doesn't exist, it's available
        if (error.response?.status === 404) {
          return false
        }
        // If other error, assume word exists to be safe
        return true
      }
    }

    // Validation rules
    const validateWord = async (rule, value, callback) => {
      if (!value || value.trim() === "") {
        callback()
        return
      }

      const wordExists = await checkWordExists(value.trim())
      if (wordExists) {
        callback(new Error(t("global.word-already-exists")))
      } else {
        callback()
      }
    }

    const rules = ref({
      word: [
        {
          required: true,
          trigger: "blur",
          message: t("global.word-required")
        },
        {
          validator: validateWord,
          trigger: "blur"
        }
      ]
    })

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disabled = true
      button.value.ariaDisabled = true

      form.value.validate((valid, errors) => {
        if (valid) {
          // Prepare payload
          const payload = {
            word: data.value.word.trim(),
            is_active: data.value.is_active
          }

          const apiUrl = id ? `/chat-blocked-words/${id}` : `/chat-blocked-words`
          const apiMethod = id ? "put" : "post"

          axiosClient[apiMethod](apiUrl, payload)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: id
                  ? t("global.chat-blocked-word-updated-successfully")
                  : t("global.chat-blocked-word-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              router.push({name: "chat_blocked_words-list"})
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

    onMounted(() => {
      loading.value = true

      // When there is an ID, get blocked word data and populate form
      if (id) {
        axiosClient
          .get(`/chat-blocked-words/${id}`)
          .then((response) => {
            const result = response.data || response.data.result || response.data.data
            // Set fields
            data.value.word = result.word || ""
            originalWord.value = result.word || "" // Store original word
            data.value.is_active = result.is_active !== undefined ? result.is_active : true

            loading.value = false
            if (form.value) form.value.clearValidate()
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: t("global.error-loading-chat-blocked-word"),
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
      t,
      loading,
      form,
      rules,
      button,
      data,
      submit,
      wordChecking
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

.swal2-popup {
  display: flex;
  flex-direction: column;
}
</style>
