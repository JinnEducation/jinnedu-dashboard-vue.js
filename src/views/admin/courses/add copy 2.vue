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
                  <el-input v-model="data.promo_video_url" :placeholder="t('global.optional')" />
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

                <el-upload
                  class="w-100"
                  drag
                  :headers="{Authorization: `Bearer ${token}`}"
                  :show-file-list="false"
                  :auto-upload="false"
                  :before-upload="handleBeforeVideoUpload"
                  :on-change="handleVideoChange"
                  :on-progress="handleUploadProgress">
                  <i class="bi bi-cloud-upload fs-3x text-primary"></i>
                  <div class="el-upload__text mt-3">
                    {{ t("global.drop_video_here_or_click") }}
                  </div>
                </el-upload>

                <div v-if="videoUploading" class="mt-4">
                  <div class="progress">
                    <div
                      class="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      :style="{width: `${videoProgress}%`}"></div>
                  </div>
                </div>

                <div v-if="data.promo_video_file_name" class="mt-4 text-start">
                  <div class="fw-bold">{{ t("global.selected_file") }}:</div>
                  <div class="text-muted">{{ data.promo_video_file_name }}</div>
                  <button
                    type="button"
                    class="btn btn-sm btn-light-danger mt-3"
                    @click="removePromoVideo">
                    {{ t("global.remove") }}
                  </button>
                </div>
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
                    class="w-100"
                    :placeholder="t('global.optional')" />
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
                    <languages-tabs v-slot="slot">
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
                    <div v-if="!id" class="alert alert-warning">
                      {{ t("global.save_course_first") }}
                    </div>

                    <template v-else>
                      <!-- ================= INTRO SESSION ================= -->
                      <div class="card mb-7">
                        <div class="card-header">
                          <div class="card-title">
                            <h3>{{ t("global.intro_session") }}</h3>
                          </div>
                        </div>

                        <div class="card-body">
                          <!-- Add -->
                          <div v-if="!introSession" class="text-center py-6">
                            <el-button type="primary" @click="createIntroSession">
                              + {{ t("global.add_intro_session") }}
                            </el-button>
                          </div>

                          <!-- Edit -->
                          <div v-else class="border rounded p-4">
                            <!-- Basic Info -->
                            <div class="row mb-4">
                              <div class="col-md-6">
                                <label class="form-label">{{ t("global.title") }}</label>
                                <el-input v-model="introSession.title[activeLang]" />
                              </div>

                              <div class="col-md-3">
                                <label class="form-label">{{ t("global.type") }}</label>
                                <el-input value="Intro Session" disabled />
                              </div>

                              <div class="col-md-3">
                                <label class="form-label">{{ t("global.duration") }}</label>
                                <el-input
                                  type="number"
                                  v-model="introSession.duration_seconds"
                                  :placeholder="t('global.optional')" />
                              </div>
                            </div>

                            <!-- Free / Paid -->
                            <div class="mb-4">
                              <el-checkbox v-model="introSession.is_free_preview">
                                {{ t("global.free_preview") }}
                              </el-checkbox>
                            </div>

                            <!-- Content Source -->
                            <div class="mb-4">
                              <label class="form-label">{{ t("global.content_source") }}</label>
                              <el-radio-group v-model="introSession.content_source">
                                <el-radio label="zoom">Zoom</el-radio>
                                <el-radio label="upload">Upload Video</el-radio>
                                <el-radio label="url">Video URL</el-radio>
                              </el-radio-group>
                            </div>

                            <!-- Zoom -->
                            <div v-if="introSession.content_source === 'zoom'" class="mb-4">
                              <label class="form-label">{{ t("global.zoom_schedule") }}</label>
                              <el-date-picker
                                v-model="introSession.zoom_start_at"
                                type="datetime"
                                class="w-100"
                                :placeholder="t('global.select_date')" />
                            </div>

                            <!-- Upload (structure only) -->
                            <div v-if="introSession.content_source === 'upload'" class="mb-4">
                              <el-upload disabled drag class="w-100">
                                <div class="el-upload__text">
                                  Upload video (will be enabled later)
                                </div>
                              </el-upload>
                            </div>

                            <!-- URL -->
                            <div v-if="introSession.content_source === 'url'" class="mb-4">
                              <el-input
                                v-model="introSession.external_video_url"
                                placeholder="https://..." />
                            </div>

                            <!-- Actions -->
                            <div class="d-flex justify-content-between mt-5">
                              <el-button type="danger" plain @click="deleteIntroSession">
                                {{ t("global.delete") }}
                              </el-button>

                              <el-button type="primary" @click="saveIntroSession">
                                {{ t("global.save") }}
                              </el-button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- ================= SECTIONS ================= -->
                      <div>
                        <div class="d-flex justify-content-between align-items-center mb-5">
                          <h3 class="m-0">{{ t("global.sections") }}</h3>
                          <el-button type="primary" plain @click="addSection">
                            + {{ t("global.add_section") }}
                          </el-button>
                        </div>

                        <div
                          v-for="(section, sIdx) in sections"
                          :key="section.id"
                          class="card mb-6">
                          <div
                            class="card-header d-flex justify-content-between align-items-center">
                            <div class="card-title">
                              <span class="fw-bold">
                                {{
                                  section.title?.[languageId] ||
                                  section.title?.ar ||
                                  t("global.section")
                                }}
                              </span>
                            </div>

                            <div class="d-flex gap-2">
                              <!-- Edit title (languages tabs فقط للعنوان) -->
                              <el-popover trigger="click" width="420">
                                <template #reference>
                                  <el-button type="primary" plain size="small">
                                    {{ t("global.edit_title") }}
                                  </el-button>
                                </template>

                                <languages-tabs v-slot="slot">
                                  <div class="mb-3">
                                    <label class="form-label">{{ t("global.title") }}</label>
                                    <el-input v-model="section.title[slot.language.id]" />
                                  </div>
                                </languages-tabs>

                                <div class="d-flex justify-content-end mt-3">
                                  <el-button
                                    type="primary"
                                    size="small"
                                    @click="saveSectionTitle(section)">
                                    {{ t("global.save") }}
                                  </el-button>
                                </div>
                              </el-popover>

                              <!-- Delete section (غير الافتراضي وبشرط ما فيه عناصر وممنوع حذف أول عنصر مهما كان) -->
                              <template v-if="sIdx !== 0">
                                <el-button
                                  type="danger"
                                  plain
                                  size="small"
                                  :disabled="
                                    section.slug === DEFAULT_SECTION_SLUG ||
                                    sectionItems(section.id).length > 0
                                  "
                                  @click="deleteSection(section)">
                                  {{ t("global.delete") }}
                                </el-button>
                              </template>
                              <el-button type="primary" size="small" @click="saveSection(section)">
                                {{ t("global.save") }}
                              </el-button>
                            </div>
                          </div>

                          <div class="card-body">
                            <!-- Items list -->
                            <div
                              v-for="(item, idx) in sectionItems(section.id)"
                              :key="item.id"
                              class="border rounded p-4 mb-4">
                              <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="fw-bold">
                                  {{
                                    item.title?.[activeLang] || item.title?.ar || t("global.item")
                                  }}
                                </div>

                                <!-- Move controls (ديناميكية) -->
                                <div class="d-flex gap-2">
                                  <el-button
                                    v-if="showMoveUp(section.id, idx)"
                                    size="small"
                                    @click="moveItem(section.id, idx, 'up')">
                                    ▲
                                  </el-button>

                                  <el-button
                                    v-if="showMoveDown(section.id, idx)"
                                    size="small"
                                    @click="moveItem(section.id, idx, 'down')">
                                    ▼
                                  </el-button>
                                </div>
                              </div>

                              <!-- Item fields (languages tabs للعنوان والوصف فقط) -->
                              <languages-tabs v-slot="slot">
                                <div class="row mb-3">
                                  <div class="col-md-6">
                                    <label class="form-label">{{ t("global.title") }}</label>
                                    <el-input v-model="item.title[slot.language.id]" />
                                  </div>

                                  <div class="col-md-6">
                                    <label class="form-label">{{ t("global.description") }}</label>
                                    <el-input
                                      type="textarea"
                                      :rows="2"
                                      v-model="item.description[slot.language.id]" />
                                  </div>
                                </div>
                              </languages-tabs>

                              <div class="row mb-3">
                                <div class="col-md-3">
                                  <label class="form-label">{{ t("global.type") }}</label>
                                  <el-select v-model="item.type" class="w-100">
                                    <el-option value="lesson_video" label="Lesson Video" />
                                    <el-option
                                      value="workshop_recording"
                                      label="Workshop (Recorded)" />
                                    <el-option
                                      value="workshop_live"
                                      label="Workshop (Live - Zoom)" />
                                  </el-select>
                                </div>

                                <div class="col-md-3">
                                  <label class="form-label">{{ t("global.duration") }}</label>
                                  <el-input
                                    type="number"
                                    v-model="item.duration_seconds"
                                    :placeholder="t('global.optional')" />
                                </div>

                                <div class="col-md-3 d-flex align-items-end">
                                  <el-checkbox v-model="item.is_free_preview">
                                    {{ t("global.free_preview") }}
                                  </el-checkbox>
                                </div>
                              </div>

                              <!-- Content source (هيكلية فقط - upload/zoom skeleton) -->
                              <div class="mb-3">
                                <label class="form-label">{{ t("global.content_source") }}</label>
                                <el-radio-group v-model="item.content_source">
                                  <el-radio label="upload">Upload</el-radio>
                                  <el-radio label="url">URL</el-radio>
                                  <el-radio label="zoom" :disabled="item.type !== 'workshop_live'"
                                    >Zoom</el-radio
                                  >
                                </el-radio-group>
                              </div>

                              <div v-if="item.content_source === 'zoom'" class="mb-3">
                                <el-date-picker
                                  v-model="item.zoom_start_at"
                                  type="datetime"
                                  class="w-100"
                                  :placeholder="t('global.select_date')" />
                              </div>

                              <div v-if="item.content_source === 'url'" class="mb-3">
                                <el-input
                                  v-model="item.external_video_url"
                                  placeholder="https://..." />
                              </div>

                              <div v-if="item.content_source === 'upload'" class="mb-3">
                                <el-upload disabled drag class="w-100">
                                  <div class="el-upload__text">Upload (will be enabled later)</div>
                                </el-upload>
                              </div>

                              <div class="d-flex justify-content-end gap-2 mt-4">
                                <el-button
                                  type="danger"
                                  plain
                                  size="small"
                                  @click="deleteItem(item)">
                                  {{ t("global.delete") }}
                                </el-button>
                                <el-button type="primary" size="small" @click="saveItem(item)">
                                  {{ t("global.save") }}
                                </el-button>
                              </div>
                            </div>

                            <el-button type="primary" plain @click="addItem(section.id)">
                              + {{ t("global.add_item") }}
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </template>
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
import {ElMessage as Message} from "element-plus"
import {defineComponent, onBeforeMount, onMounted, ref, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"
import Swal from "sweetalert2"

export default defineComponent({
  name: "course-add-edit",
  components: {
    Toolbar,
    LanguagesTabs
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
    console.log(languages)
    const languageId = ref(null)
    const langNow = languages.value.find((element) => element.shortname === store.state.language)
    languageId.value = langNow ? langNow.id : null

    const data = ref({
      category_id: null,
      instructor_id: null,

      promo_video_url: null,
      promo_video_duration_seconds: null,
      promo_video_file: null,
      promo_video_file_name: null,

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
      requirements_json: {},
      sections: []
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

    // <!-- ================= INTRO SESSION ================= -->
    const introSession = ref(null)

    const createIntroSession = () => {
      introSession.value = {
        id: null,
        type: "intro",
        section_id: null,
        is_free_preview: true,
        duration_seconds: null,
        content_source: "zoom",
        title: {
          ar: "",
          en: ""
        },
        zoom_meeting_id: null,
        zoom_start_at: null,
        external_video_url: null
      }
    }

    const saveIntroSession = async () => {
      let typeIntro = "intro"
      if (introSession.value.content_source === "zoom") {
        typeIntro = "intro_zoom"
      } else {
        typeIntro = "intro_recording"
      }
      const payload = {
        type: typeIntro,
        section_id: null,
        is_free_preview: introSession.value.is_free_preview,
        duration_seconds: introSession.value.duration_seconds,
        content_source: introSession.value.content_source,
        langs: languages.value.map((lang) => ({
          lang: lang.shortname,
          title: introSession.value.title?.[lang.shortname] ?? "",
          description: introSession.value.description?.[lang.shortname] ?? null
        })),
        zoom_start_at: introSession.value.zoom_start_at,
        external_video_url: introSession.value.external_video_url
      }

      try {
        if (introSession.value.id) {
          await axiosClient.put(`/admin/items/${introSession.value.id}`, payload)
        } else {
          const res = await axiosClient.post(`/admin/courses/${id}/items`, payload)
          introSession.value.id = res.data.data.id
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          text: e.response?.data?.message || t("global.error-saving"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      }
    }

    const deleteIntroSession = async () => {
      if (!introSession.value.id) {
        introSession.value = null
        return
      }

      await axiosClient.delete(`/admin/items/${introSession.value.id}`)

      introSession.value = null
    }

    // <!-- ================= sections ================= -->
    const sections = ref([]) // كل السكاشن
    const items = ref([]) // كل العناصر (flat) ثم نوزعها على sections

    const contentLoading = ref(false)

    // أول سكشن افتراضي (غير قابل للحذف)
    const DEFAULT_SECTION_SLUG = "default-content"

    const sortSections = async () => {
      if (!id) return
      const orderedIds = sections.value.map((s) => s.id)
      await axiosClient.post(`/admin/courses/${id}/sections/sort`, {ids: orderedIds})
    }

    const addSection = () => {
      sections.value.push({
        id: null,
        _isNew: true,
        _saving: false,
        title: {}
      })
    }
    const saveSection = async (section) => {
      if (!id) return

      section._saving = true

      try {
        if (!section.id) {
          // CREATE
          const res = await axiosClient.post(`/admin/courses/${id}/sections`, {
            title: section.title
          })

          const s = res.data.data || res.data.result?.data

          section.id = s.id
          section._isNew = false
        } else {
          // UPDATE
          await axiosClient.put(`/admin/sections/${section.id}`, {title: section.title})
        }

        await sortSections()
      } finally {
        section._saving = false
      }
    }

    const saveSectionTitle = async (section) => {
      await axiosClient.put(`/admin/sections/${section.id}`, {
        title: section.title || {}
      })
    }

    const deleteSection = async (section) => {
      if (!section.id) {
        sections.value = sections.value.filter((s) => s !== section)
        return
      }

      await axiosClient.delete(`/admin/sections/${section.id}`)
      sections.value = sections.value.filter((s) => s.id !== section.id)

      await sortSections()
    }

    const sectionItems = (sectionId) => {
      return items.value
        .filter((i) => i.section_id === sectionId && i.type !== "intro")
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    }

    const addItem = (sectionId) => {
      if (!id) return

      items.value.push({
        id: null,
        _isNew: true,
        _saving: false,

        section_id: sectionId,
        sort_order: sectionItems(sectionId).length,

        type: "lesson_video",
        is_free_preview: false,
        duration_seconds: null,

        title: {},
        description: {},

        content_source: "upload",
        zoom_start_at: null,
        external_video_url: null
      })
    }

    const saveItem = async (item) => {
      if (!id) return

      item._saving = true

      try {
        if (!item.id) {
          // CREATE
          const res = await axiosClient.post(`/admin/courses/${id}/items`, {
            section_id: item.section_id,
            type: item.type,
            is_free_preview: item.is_free_preview ? 1 : 0,
            duration_seconds: item.duration_seconds,

            title: item.title || {},
            description: item.description || {},

            content_source: item.content_source,
            zoom_start_at: item.zoom_start_at,
            external_video_url: item.external_video_url
          })

          const it = res.data.data || res.data.result?.data

          item.id = it.id
          item.sort_order = it.sort_order ?? item.sort_order
          item._isNew = false
        } else {
          // UPDATE
          await axiosClient.put(`/admin/items/${item.id}`, {
            section_id: item.section_id,
            type: item.type,
            is_free_preview: item.is_free_preview ? 1 : 0,
            duration_seconds: item.duration_seconds,

            title: item.title || {},
            description: item.description || {},

            content_source: item.content_source,
            zoom_start_at: item.zoom_start_at,
            external_video_url: item.external_video_url
          })
        }

        await sortItems()
      } finally {
        item._saving = false
      }
    }

    const deleteItem = async (item) => {
      // لو لسه جديد وما انحفظ
      if (!item.id) {
        items.value = items.value.filter((i) => i !== item)
        return
      }

      await axiosClient.delete(`/admin/items/${item.id}`)
      items.value = items.value.filter((i) => i.id !== item.id)

      await sortItems()
    }

    const sortItems = async () => {
      if (!id) return
      // ترتيب عالمي لكل العناصر (يسهل على الباك)
      const orderedIds = items.value
        .filter((i) => i.type !== "intro")
        .sort((a, b) => {
          // حسب ترتيب sections ثم sort_order داخلها
          const sa = sections.value.findIndex((s) => s.id === a.section_id)
          const sb = sections.value.findIndex((s) => s.id === b.section_id)
          if (sa !== sb) return sa - sb
          return (a.sort_order || 0) - (b.sort_order || 0)
        })
        .map((i) => i.id)

      await axiosClient.post(`/admin/courses/${id}/items/sort`, {ids: orderedIds})
    }

    /**
     * حركة ديناميكية:
     * - داخل نفس السكشن: swap
     * - آخر عنصر + down => ينتقل لأول السكشن اللي بعده
     * - أول عنصر + up => ينتقل لآخر السكشن اللي قبله
     */
    const moveItem = async (sectionId, indexInSection, direction) => {
      const sIndex = sections.value.findIndex((s) => s.id === sectionId)
      if (sIndex === -1) return

      const currentItems = sectionItems(sectionId)
      const item = currentItems[indexInSection]
      if (!item) return

      const isUp = direction === "up"
      const isDown = direction === "down"

      // داخل نفس السكشن
      if (isUp && indexInSection > 0) {
        const prev = currentItems[indexInSection - 1]
        swapPositions(item, prev)
        await sortItems()
        return
      }

      if (isDown && indexInSection < currentItems.length - 1) {
        const next = currentItems[indexInSection + 1]
        swapPositions(item, next)
        await sortItems()
        return
      }

      // بين السكاشن
      if (isUp && indexInSection === 0 && sIndex > 0) {
        const prevSection = sections.value[sIndex - 1]
        item.section_id = prevSection.id
        // ضعها آخر واحدة في القسم السابق
        setToEndOfSection(item, prevSection.id)
        await saveItem(item)
        await sortItems()
        return
      }

      if (
        isDown &&
        indexInSection === currentItems.length - 1 &&
        sIndex < sections.value.length - 1
      ) {
        const nextSection = sections.value[sIndex + 1]
        item.section_id = nextSection.id
        // ضعها أول واحدة في القسم التالي
        setToStartOfSection(item, nextSection.id)
        await saveItem(item)
        await sortItems()
        return
      }
    }

    const swapPositions = (a, b) => {
      const ap = a.sort_order ?? 0
      const bp = b.sort_order ?? 0
      a.sort_order = bp
      b.sort_order = ap
    }

    const setToEndOfSection = (item, targetSectionId) => {
      const list = sectionItems(targetSectionId)
      const maxPos = list.length ? Math.max(...list.map((i) => i.sort_order ?? 0)) : 0
      item.sort_order = maxPos + 1
    }

    const setToStartOfSection = (item, targetSectionId) => {
      // نجعلها 0 والباقي نرفعهم
      const list = sectionItems(targetSectionId)
      list.forEach((i) => (i.sort_order = (i.sort_order ?? 0) + 1))
      item.sort_order = 0
    }

    const showMoveUp = (sectionId, idx) => {
      const sIndex = sections.value.findIndex((s) => s.id === sectionId)
      const list = sectionItems(sectionId)

      // إذا أول عنصر، يظهر سهم لفوق فقط لو في قسم فوقه
      if (idx === 0) return sIndex > 0
      return true
    }

    const showMoveDown = (sectionId, idx) => {
      const sIndex = sections.value.findIndex((s) => s.id === sectionId)
      const list = sectionItems(sectionId)

      // إذا آخر عنصر، يظهر سهم لتحت فقط لو في قسم بعده
      if (idx === list.length - 1) return sIndex < sections.value.length - 1
      return true
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
          fd.append("sections", JSON.stringify(data.value.sections))

          if (id) {
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

      const loadContentPromise = id
        ? Promise.all([
            axiosClient.get(`/admin/courses/${id}/sections`),
            axiosClient.get(`/admin/courses/${id}/items`)
          ])
            .then(([secRes, itemsRes]) => {
              const secData = secRes.data.data || secRes.data.result?.data || secRes.data || []
              const itemsData =
                itemsRes.data.data || itemsRes.data.result?.data || itemsRes.data || []

              console.log(secData)
              console.log(itemsData)
              // Sections
              sections.value = (secData || [])
                .map((s) => ({
                  id: s.id,
                  slug: s.slug || null,
                  sort_order: s.sort_order ?? 0,
                  title: s.title || {} // object by lang id
                }))
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

              // Items
              items.value = (itemsData || [])
                .map((it) => ({
                  id: it.id,
                  course_id: it.course_id,
                  section_id: it.section_id, // null allowed for intro
                  sort_order: it.sort_order ?? 0,
                  type: it.type, // intro / lesson_video / workshop...
                  is_free_preview: !!it.is_free_preview,
                  duration_seconds: it.duration_seconds ?? null,

                  title: it.title || {}, // object by lang id
                  description: it.description || {}, // object by lang id (nullable)

                  // skeleton fields (stored)
                  content_source: it.content_source || "upload", // zoom/upload/url
                  zoom_start_at: it.zoom_start_at ?? null,
                  external_video_url: it.external_video_url ?? null
                }))
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

              // Intro Session: نستخرجها من items (section_id null + type intro)
              const intro = items.value.find((i) => i.type === "intro")
              if (intro) {
                introSession.value = {
                  id: intro.id,
                  type: "intro",
                  section_id: null,
                  is_free_preview: !!intro.is_free_preview,
                  duration_seconds: intro.duration_seconds ?? null,
                  content_source: intro.content_source || "zoom",
                  zoom_start_at: intro.zoom_start_at ?? null,
                  external_video_url: intro.external_video_url ?? null,
                  // العنوان حسب اللغة النشطة (بدون تبويب لغات)
                  title: intro.title?.[activeLang.value] || ""
                }
              }
            })
            .catch(() => {
              sections.value = []
              items.value = []
            })
        : Promise.resolve()

      Promise.all([
        categoriesPromise,
        instructorsPromise,
        loadEditPromise,
        loadContentPromise
      ]).finally(() => {
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
      sections,
      items,
      contentLoading,
      DEFAULT_SECTION_SLUG,
      addSection,
      saveSectionTitle,
      deleteSection,
      saveSection,
      sortSections,
      sectionItems,
      addItem,
      saveItem,
      deleteItem,
      sortItems,
      moveItem,
      swapPositions,
      setToEndOfSection,
      setToStartOfSection,
      showMoveUp,
      showMoveDown,
      introSession,
      createIntroSession,
      saveIntroSession,
      deleteIntroSession
    }
  }
})
</script>
