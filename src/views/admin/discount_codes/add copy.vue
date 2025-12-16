<template>
  <toolbar :title="id
    ? `${t('global.edit')} ${t('global.discount-code')}`
    : `${t('global.add')} ${t('global.discount-code')}`
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
            <div class="card-body pt-0">
              <div class="fv-row row">
                <div class="col-12 col-md-4">
                  <label for="group-class-minimum-size" class="required form-label">
                    {{ t("global.minimum-students-size") }}
                  </label>
                  <el-form-item prop="minimumSize" class="el-width">
                    <el-input-number id="group-class-minimum-size" v-model="data.minimumSize" type="number" :min="2" />
                  </el-form-item>
                </div>
                <div class="col-12 col-md-4">
                  <label for="group-class-classes-number" class="required form-label">
                    {{ t("global.classes-number") }}
                  </label>
                  <el-form-item prop="classesNumber" class="el-width">
                    <el-input-number id="group-class-classes-number" v-model="data.classesNumber" type="number"
                      :min="3" />
                  </el-form-item>
                </div>
              </div>
              <!-- Code -->
              <div class="mb-10 fv-row">
                <label for="discount-code" class="required form-label">
                  {{ t("global.code") }}
                </label>
                <el-form-item prop="code">
                  <el-input id="discount-code" v-model="data.code" type="text" name="discount-code"
                    :placeholder="t('global.enter-code')" :disabled="codeChecking" maxlength="255">
                    <template #suffix>
                      <el-icon v-if="codeChecking" class="is-loading">
                        <Loading />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </div>

              <!-- Percentage -->
              <div class="mb-10 fv-row">
                <label for="discount-percentage" class="required form-label">
                  {{ t("global.percentage") }} (1-100)
                </label>
                <el-form-item prop="percentage">
                  <el-input-number id="discount-percentage" v-model="data.percentage" :min="1" :max="100" :precision="0"
                    :placeholder="t('global.enter-percentage')" style="width: 100%" />
                </el-form-item>
              </div>

              <!-- Start Date & Time -->
              <div class="mb-10 fv-row">
                <label for="discount-starts-at" class="form-label">
                  {{ t("global.starts-at") }}
                </label>
                <el-form-item prop="starts_at">
                  <el-date-picker id="discount-starts-at" v-model="data.starts_at" type="datetime"
                    :placeholder="t('global.select-start-date-time')" format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </el-form-item>
              </div>

              <!-- End Date & Time -->
              <div class="mb-10 fv-row">
                <label for="discount-ends-at" class="form-label">
                  {{ t("global.ends-at") }}
                </label>
                <el-form-item prop="ends_at">
                  <el-date-picker id="discount-ends-at" v-model="data.ends_at" type="datetime"
                    :placeholder="t('global.select-end-date-time')" format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </el-form-item>
              </div>

              <!-- Is Active -->
              <div class="mb-10 fv-row">
                <label for="discount-is-active" class="form-label">
                  {{ t("global.status") }}
                </label>
                <el-form-item prop="is_active">
                  <el-switch id="discount-is-active" v-model="data.is_active" :active-text="t('global.active')"
                    :inactive-text="t('global.inactive')" />
                </el-form-item>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex justify-content-end">
                <router-link id="cancel" to="/dashboard/discount_codes/index" class="btn btn-light me-5">
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
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import { defineComponent, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import axiosClient from "../../../plugins/axios"
import Swal from "sweetalert2"
import { Loading } from "@element-plus/icons-vue"

export default defineComponent({
  name: "discount-code-add-edit",
  components: {
    Toolbar,
    Loading
  },
  setup() {
    // Get necessary data from router/route/store
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()
    const { id } = route.params

    // Define form necessary data
    const loading = ref(false)
    const form = ref(null)
    const button = ref(null)
    const codeChecking = ref(false)
    const originalCode = ref(null) // Store original code when editing

    // Define data schema to be submitted
    const data = ref({
      code: "",
      percentage: null,
      starts_at: null,
      ends_at: null,
      is_active: true
    })

    // Check if code exists in API
    const checkCodeExists = async (code) => {
      if (!code || code.trim() === "") {
        return false
      }

      const trimmedCode = code.trim()

      // Skip check if editing and code hasn't changed
      if (id && originalCode.value && trimmedCode === originalCode.value) {
        return false
      }

      try {
        codeChecking.value = true
        const response = await axiosClient.post("/discount_codes/check-code", {
          code: trimmedCode,
          exclude_id: id || null // Exclude current ID when editing
        })
        codeChecking.value = false
        // return false

        // API should return { exists: true/false } or { available: true/false }
        return response.data?.exists === true || response.data?.available === false
      } catch (error) {
        codeChecking.value = false
        // If 404 or code doesn't exist, it's available
        if (error.response?.status === 404) {
          return false
        }
        // If other error, assume code exists to be safe
        return true
      }
    }

    // Validation rules
    const validateCode = async (rule, value, callback) => {
      if (!value || value.trim() === "") {
        callback()
        return
      }

      const codeExists = await checkCodeExists(value.trim())
      if (codeExists) {
        callback(new Error(t("global.code-already-exists")))
      } else {
        callback()
      }
    }

    const validateEndDate = (rule, value, callback) => {
      if (!value || !data.value.starts_at) {
        callback()
        return
      }
      const startDate = new Date(data.value.starts_at)
      const endDate = new Date(value)
      if (endDate <= startDate) {
        callback(new Error(t("global.end-date-must-be-after-start-date")))
      } else {
        callback()
      }
    }

    const rules = ref({
      code: [
        {
          required: true,
          trigger: "blur",
          message: t("global.code-required")
        },
        {
          validator: validateCode,
          trigger: "blur"
        }
      ],
      percentage: [
        {
          required: true,
          trigger: "blur",
          message: t("global.percentage-required")
        },
        {
          type: "number",
          min: 1,
          max: 100,
          message: t("global.percentage-must-be-between-1-and-100")
        }
      ],
      ends_at: [
        {
          validator: validateEndDate,
          trigger: "change"
        }
      ]
    })

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disabled = true
      button.value.ariaDisabled = true

      form.value.validate((valid, errors) => {
        if (valid) {
          // Validate end date is after start date
          if (data.value.starts_at && data.value.ends_at) {
            const startDate = new Date(data.value.starts_at)
            const endDate = new Date(data.value.ends_at)
            if (endDate <= startDate) {
              Swal.fire({
                icon: "error",
                text: t("global.end-date-must-be-after-start-date"),
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: { confirmButton: "btn btn-danger" }
              })
              button.value.removeAttribute("data-kt-indicator")
              button.value.disabled = false
              button.value.ariaDisabled = false
              return
            }
          }

          // Prepare payload
          const payload = {
            code: data.value.code,
            percentage: data.value.percentage,
            starts_at: data.value.starts_at,
            ends_at: data.value.ends_at,
            is_active: data.value.is_active
          }

          const apiUrl = id ? `/discount_codes/${id}` : `/discount_codes`
          const apiMethod = id ? "put" : "post"

          axiosClient[apiMethod](apiUrl, payload)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: id
                  ? t("global.discount-code-updated-successfully")
                  : t("global.discount-code-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: { confirmButton: "btn btn-primary" }
              })
              router.push({ name: "discount_codes-list" })
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

    onMounted(() => {
      loading.value = true

      // When there is an ID, get discount code data and populate form
      if (id) {
        axiosClient
          .get(`/discount_codes/${id}`)
          .then((response) => {
            const result = response.data || response.data.result || response.data.data
            // Set fields
            data.value.code = result.code || ""
            originalCode.value = result.code || "" // Store original code
            data.value.percentage = result.percentage || null
            data.value.starts_at = result.starts_at || null
            data.value.ends_at = result.ends_at || null
            data.value.is_active = result.is_active !== undefined ? result.is_active : true

            loading.value = false
            if (form.value) form.value.clearValidate()
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: t("global.error-loading-discount-code"),
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
      t,
      loading,
      form,
      rules,
      button,
      data,
      submit,
      codeChecking
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
