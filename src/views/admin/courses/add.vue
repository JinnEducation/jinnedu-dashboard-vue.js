<template>
  <toolbar
    :title="
      id ? `${t('global.edit')} ${t('global.course')}` : `${t('global.add')} ${t('global.course')}`
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

      <template v-else>
        <el-form
          ref="form"
          :model="data"
          :rules="rules"
          class="form d-flex flex-column flex-lg-row">
          <!-- Sidebar -->
          <div class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
            <!-- Promo Video -->
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.promo_video") }}</h2>
                </div>
              </div>

              <div class="card-body text-center pt-0">
                <div class="mb-6">
                  <label class="form-label">{{ t("global.promo_video_url") }}</label>
                  <el-input v-model="promoVideoInput" :placeholder="t('global.optional')" />
                </div>

                <div class="mb-6">
                  <label class="form-label">{{ t("global.promo_video_duration") }}</label>
                  <el-input
                    type="number"
                    v-model="data.promo_video_duration_seconds"
                    :placeholder="t('global.optional')" />
                </div>

                <div class="separator separator-dashed my-6"></div>

                <div class="mb-4 text-start">
                  <label class="form-label">{{ t("global.or_upload_video") }}</label>
                </div>

                <video-uploader v-model="data.promo_video_url" />
              </div>
            </div>

            <!-- Status / Pricing -->
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.settings") }}</h2>
                </div>
              </div>

              <div class="card-body pt-0">
                <div class="mb-5">
                  <label class="form-label required">{{ t("global.category") }}</label>
                  <el-form-item prop="category_id">
                    <el-select
                      v-model="data.category_id"
                      filterable
                      class="w-100"
                      :placeholder="t('global.select')">
                      <el-option
                        v-for="cat in categories"
                        :key="cat.id"
                        :label="cat.name || cat.title || cat.label"
                        :value="cat.id" />
                    </el-select>
                  </el-form-item>
                </div>

                <div class="mb-5">
                  <label class="form-label">{{ t("global.status") }}</label>
                  <el-select v-model="data.status" class="w-100">
                    <el-option value="draft" :label="t('global.draft')" />
                    <el-option value="published" :label="t('global.published')" />
                  </el-select>
                </div>

                <div class="mb-5">
                  <label class="form-label">{{ t("global.price") }}</label>
                  <el-input
                    type="number"
                    v-model="data.price"
                    :disabled="data.is_free"
                    :placeholder="t('global.optional')" />
                </div>

                <div class="mb-5">
                  <label class="form-check form-switch form-check-custom form-check-solid">
                    <input class="form-check-input" type="checkbox" v-model="data.is_free" />
                    <span class="form-check-label fw-semibold text-muted">
                      {{ t("global.free_course") }}
                    </span>
                  </label>
                </div>

                <div class="separator separator-dashed my-6"></div>

                <div class="mb-5">
                  <label class="form-label">{{ t("global.discount_type") }}</label>
                  <el-select
                    v-model="data.discount_type"
                    clearable
                    class="w-100"
                    :placeholder="t('global.optional')">
                    <el-option value="percent" :label="t('global.percent')" />
                    <el-option value="fixed" :label="t('global.fixed')" />
                  </el-select>
                </div>

                <div class="mb-5">
                  <label class="form-label">{{ t("global.discount_value") }}</label>
                  <el-input
                    type="number"
                    v-model="data.discount_value"
                    :placeholder="t('global.optional')" />
                </div>

                <div class="mb-5">
                  <label class="form-label">{{ t("global.discount_starts_at") }}</label>
                  <el-date-picker
                    v-model="data.discount_starts_at"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm"
                    class="w-100"
                    :placeholder="t('global.optional')" />
                </div>

                <div class="mb-5">
                  <label class="form-label">{{ t("global.discount_ends_at") }}</label>
                  <el-date-picker
                    v-model="data.discount_ends_at"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm"
                    class="w-100"
                    :placeholder="t('global.optional')" />
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <!-- Main Tabs -->
            <div class="card card-flush">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.course_information") }}</h2>
                </div>
              </div>

              <div class="card-body pt-0">
                <el-tabs v-model="activeMainTab" class="mt-2">
                  <!-- BASICS -->
                  <el-tab-pane :label="t('global.basics')" name="basics">
                    <div class="mb-6">
                      <label class="form-label">{{ t("global.instructor_optional") }}</label>

                      <el-select
                        v-model="data.instructor_id"
                        filterable
                        clearable
                        class="w-100"
                        :placeholder="t('global.select')">
                        <el-option
                          v-for="teacher in instructors"
                          :key="teacher.id"
                          :label="teacher.name"
                          :value="teacher.id" />
                      </el-select>
                    </div>

                    <div class="mb-6">
                      <label class="form-check form-switch form-check-custom form-check-solid">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="data.has_certificate" />
                        <span class="form-check-label fw-semibold text-muted">
                          {{ t("global.has_certificate") }}
                        </span>
                      </label>
                    </div>
                  </el-tab-pane>

                  <!-- LANGUAGES -->
                  <el-tab-pane :label="t('global.languages')" name="languages">
                    <languages-tabs instance-id="course-languages" v-slot="slot">
                      <div class="card-body pt-0 p-0">
                        <div class="mb-10 fv-row">
                          <label class="required form-label">{{ t("global.title") }}</label>
                          <el-form-item :prop="`title.${slot.language.id}`">
                            <el-input v-model="data.title[slot.language.id]" />
                          </el-form-item>
                        </div>

                        <div class="mb-10 fv-row">
                          <label class="form-label">{{ t("global.excerpt") }}</label>
                          <el-form-item :prop="`excerpt.${slot.language.id}`">
                            <el-input v-model="data.excerpt[slot.language.id]" />
                          </el-form-item>
                        </div>

                        <div class="mb-10 fv-row">
                          <label class="form-label">{{ t("global.description") }}</label>
                          <el-form-item :prop="`description.${slot.language.id}`">
                            <el-input
                              type="textarea"
                              :rows="6"
                              v-model="data.description[slot.language.id]" />
                          </el-form-item>
                        </div>

                        <div class="mb-10 fv-row">
                          <div class="d-flex justify-content-between mb-2">
                            <label class="form-label">{{ t("global.outcomes") }}</label>

                            <el-button
                              type="primary"
                              plain
                              size="small"
                              @click="addOutcome(slot.language.id)">
                              + {{ t("global.add_item") }}
                            </el-button>
                          </div>

                          <div
                            v-for="(item, index) in data.outcomes_json[slot.language.id]"
                            :key="index"
                            class="d-flex align-items-center mb-2">
                            <el-input
                              v-model="data.outcomes_json[slot.language.id][index]"
                              class="me-2" />
                            <el-button
                              type="danger"
                              circle
                              @click="removeOutcome(slot.language.id, index)">
                              <svg
                                style="width: 16px; height: 16px"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M4 4 L12 12 M12 4 L4 12"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="1.8"
                                  stroke-linecap="round" />
                              </svg>
                            </el-button>
                          </div>
                        </div>

                        <div class="mb-10 fv-row">
                          <div class="d-flex justify-content-between mb-2">
                            <label class="form-label">{{ t("global.requirements") }}</label>
                            <el-button
                              type="primary"
                              plain
                              size="small"
                              @click="addRequirement(slot.language.id)">
                              + {{ t("global.add_item") }}
                            </el-button>
                          </div>

                          <div
                            v-for="(item, index) in data.requirements_json[slot.language.id]"
                            :key="index"
                            class="d-flex align-items-center mb-2">
                            <el-input
                              v-model="data.requirements_json[slot.language.id][index]"
                              class="me-2" />
                            <el-button
                              type="danger"
                              circle
                              @click="removeOutcome(slot.language.id, index)">
                              <svg
                                style="width: 16px; height: 16px"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M4 4 L12 12 M12 4 L4 12"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="1.8"
                                  stroke-linecap="round" />
                              </svg>
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </languages-tabs>
                  </el-tab-pane>

                  <!-- CONTENT -->
                  <el-tab-pane :label="t('global.content')" name="content">
                    <CourseContentTab :id="id" :data="data" />
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex justify-content-end">
              <button ref="button" type="button" class="btn btn-primary" @click="submit">
                <span class="indicator-label">{{ t("global.save") }}</span>
                <span class="indicator-progress">
                  {{ t("global.please-wait") }}
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
          </div>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import LanguagesTabs from "@/components/admin/languages-tabs.vue"
import CourseContentTab from "@/components/admin/courses/CourseContentTab.vue"
import VideoUploader from "@/components/admin/VideoUploader.vue"
import {ElMessage as Message} from "element-plus"
import {defineComponent, onBeforeMount, onMounted, ref, computed, watch} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"
import Swal from "sweetalert2"

export default defineComponent({
  name: "course-add-edit",
  components: {
    Toolbar,
    LanguagesTabs,
    VideoUploader,
    CourseContentTab
  },
  setup() {
    const {t} = useI18n()
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const {id} = route.params
    const token = computed(() => store.state.user.token)

    const loading = ref(false)
    const form = ref(null)
    const button = ref(null)

    const categories = ref([])
    const instructors = ref([])

    const activeMainTab = ref("basics")

    const videoUploading = ref(false)
    const videoProgress = ref(0)

    const userInfo = store.state.userInfo
    const userInfoObject = userInfo ? JSON.parse(userInfo) : null
    const userId = userInfoObject?.user?.id || null

    const languages = computed(() => store.state.languages)
    const languageId = ref(null)
    const langNow = languages.value.find((element) => element.shortname === store.state.language)
    languageId.value = langNow ? langNow.id : null

    const data = ref({
      category_id: null,
      instructor_id: null,

      promo_video_url: null,
      promo_video_duration_seconds: null,

      price: 0,
      is_free: false,

      discount_type: null,
      discount_value: null,
      discount_starts_at: null,
      discount_ends_at: null,

      has_certificate: false,

      status: "draft",
      user_id: userId,

      title: {},
      excerpt: {},
      description: {},
      outcomes_json: {},
      requirements_json: {}
    })

    const promoVideoInput = computed({
      get() {
        const url = data.value.promo_video_url
        if (!url) return ""

        // لو فيديو مرفوع (محلي) لا نعرضه في input
        if (url.includes("/storage/")) return ""

        return url
      },
      set(val) {
        data.value.promo_video_url = val || null
      }
    })

    const rules = ref({
      category_id: [{required: true, trigger: "change", message: t("global.category-required")}],
      title: {}
    })

    const addOutcome = (lang) => {
      if (!data.value.outcomes_json[lang]) {
        data.value.outcomes_json[lang] = []
      }
      data.value.outcomes_json[lang].push("")
    }

    const removeOutcome = (lang, index) => {
      data.value.outcomes_json[lang].splice(index, 1)
    }

    const addRequirement = (lang) => {
      if (!data.value.requirements_json[lang]) {
        data.value.requirements_json[lang] = []
      }
      data.value.requirements_json[lang].push("")
    }

    const removeRequirement = (lang, index) => {
      data.value.requirements_json[lang].splice(index, 1)
    }

    const handleUploadProgress = (event) => {
      videoUploading.value = true
      const percent = Math.round(event.percent || 0)
      videoProgress.value = percent > 100 ? 100 : percent
    }

    const handleBeforeVideoUpload = (file) => {
      const allowed = ["video/mp4", "video/quicktime", "video/x-matroska", "video/webm"]
      if (!allowed.includes(file.type)) {
        Message.error(t("errors.video-format-not-supported"))
        return false
      }
      return true
    }

    const handleVideoChange = (file) => {
      data.value.promo_video_file = file.raw
      data.value.promo_video_file_name = file.name
      videoUploading.value = false
      videoProgress.value = 0
    }

    const removePromoVideo = () => {
      data.value.promo_video_file = null
      data.value.promo_video_file_name = null
    }

    // <!-- ================= submit ================= -->
    const submit = async () => {
      if (!form.value) return

      form.value.validate(async (valid) => {
        if (!valid) return

        button.value?.setAttribute("data-kt-indicator", "on")

        try {
          const fd = new FormData()

          fd.append("category_id", data.value.category_id ?? "")
          fd.append("instructor_id", data.value.instructor_id ?? "")
          fd.append("price", data.value.price ?? 0)
          fd.append("is_free", data.value.is_free ? 1 : 0)
          fd.append("status", data.value.status ?? "draft")
          fd.append("has_certificate", data.value.has_certificate ? 1 : 0)

          fd.append("discount_type", data.value.discount_type ?? "")
          fd.append("discount_value", data.value.discount_value ?? "")
          fd.append("discount_starts_at", data.value.discount_starts_at ?? "")
          fd.append("discount_ends_at", data.value.discount_ends_at ?? "")

          fd.append("promo_video_url", data.value.promo_video_url ?? "")
          fd.append("promo_video_duration_seconds", data.value.promo_video_duration_seconds ?? "")

          if (data.value.promo_video_file) {
            fd.append("promo_video_file", data.value.promo_video_file)
          }

          fd.append(
            "langs",
            JSON.stringify({
              title: data.value.title,
              excerpt: data.value.excerpt,
              description: data.value.description,
              outcomes_json: data.value.outcomes_json,
              requirements_json: data.value.requirements_json
            })
          )
          // Sections are managed separately in CourseContentTab

          if (id) {
            fd.append("_method", "PUT")
            await axiosClient.post(`admin/courses/${id}`, fd)
          } else {
            await axiosClient.post(`admin/courses`, fd)
          }

          Swal.fire({
            icon: "success",
            text: t("global.saved-successfully"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          }).then(() => {
            router.push({path: "/dashboard/courses/index"})
          })
        } catch (e) {
          Swal.fire({
            icon: "error",
            text: t("global.error-saving"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })
        } finally {
          button.value?.removeAttribute("data-kt-indicator")
        }
      })
    }

    onBeforeMount(() => {
      if (id) loading.value = true
    })

    onMounted(() => {
      loading.value = true

      const categoriesPromise = axiosClient
        .get(`/categories`)
        .then((response) => {
          categories.value = response.data.data || response.data.result?.data || []
        })
        .catch(() => {
          categories.value = []
        })

      const instructorsPromise = axiosClient
        .get("/instructors")
        .then((response) => {
          instructors.value = response.data.data || response || []
        })
        .catch(() => {
          instructors.value = []
        })
      const loadEditPromise = id
        ? axiosClient
            .get(`admin/courses/${id}`)
            .then((res) => {
              const course = res.data.data || res.data.result?.data || res.data

              data.value.category_id = course.category_id ?? null
              data.value.instructor_id = course.instructor_id ?? null
              data.value.promo_video_url = course.promo_video_url ?? null
              data.value.promo_video_duration_seconds = course.promo_video_duration_seconds ?? null

              data.value.price = course.price ?? 0
              data.value.is_free = !!course.is_free

              data.value.discount_type = course.discount_type ?? null
              data.value.discount_value = course.discount_value ?? null
              data.value.discount_starts_at = course.discount_starts_at ?? null
              data.value.discount_ends_at = course.discount_ends_at ?? null

              data.value.has_certificate = !!course.has_certificate
              data.value.status = course.status ?? "draft"

              data.value.title = course.title || {}
              data.value.excerpt = course.excerpt || {}
              data.value.description = course.description || {}
              data.value.outcomes_json = course.outcomes_json || {}
              data.value.requirements_json = course.requirements_json || {}
            })
            .catch(() => {})
        : Promise.resolve()

      // Content (sections, items, intro) is now managed by CourseContentTab component
      Promise.all([categoriesPromise, instructorsPromise, loadEditPromise]).finally(() => {
        loading.value = false
        if (form.value) form.value.clearValidate()
      })
    })

    return {
      t,
      id,
      token,
      loading,
      form,
      button,
      categories,
      languageId,
      CourseContentTab,
      data,
      rules,
      activeMainTab,
      videoUploading,
      videoProgress,
      submit,
      handleBeforeVideoUpload,
      handleVideoChange,
      handleUploadProgress,
      removePromoVideo,
      instructors,
      addOutcome,
      removeOutcome,
      addRequirement,
      removeRequirement,
      promoVideoInput
    }
  }
})
</script>
