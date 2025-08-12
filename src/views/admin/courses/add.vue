<!-- eslint-disable no-unused-vars -->
<!-- DONE REVIEWING: 25/06/2023 -->
<template>
  <toolbar :title="t(`global.add-our-courses`)" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <template v-if="loading">
        <div class="card-body p-0">
          <div class="card-px text-center py-20 my-10">
            <div role="status" class="spinner-border text-primary">
              <span class="visually-hidden">{{ t("global.loading") }}...</span>
            </div>
          </div>
        </div>
      </template>
      <div v-show="!loading">
        <el-form
          ref="form"
          :model="data"
          :rules="rules"
          :validate-on-rule-change="false"
          class="form d-flex flex-column flex-lg-row">
          <div
            class="d-flex flex-shrink-0 flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
            <!-- <div class="card card-flush py-4">
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
                    :on-success="handleOnSuccess"
                    :on-progress="handleUploadProgress"
                    :before-upload="handleBeforeUpload">
                    <div
                      v-if="data.thumbnail && data.thumbnail.url"
                      class="relative d-inline-block">
                      <img :src="data.thumbnail.url" alt="Uploading Image" class="avatar" />
                      <el-button
                        type="danger"
                        size="small"
                        circle
                        class="remove-btn"
                        @click.stop.prevent="removeThumbnail(data.thumbnail.id)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>

                    <el-icon v-else class="avatar-uploader-icon">
                      <plus />
                    </el-icon>
                  </el-upload>
                </div>
                <div class="text-muted fs-7">
                  {{ t("global.set-group-class-thumbnail-image") }}
                </div>
              </div>
            </div> -->

            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.attachment") }}</h2>
                </div>
              </div>
              <div class="card-body text-center pt-0">
                <el-upload
                  class="avatar-uploader"
                  :action="`${API_PATH}/medias/create`"
                  :show-file-list="false"
                  :headers="{Authorization: `Bearer ${token}`}"
                  name="attachments"
                  :on-success="handleAttachmentOnSuccess"
                  :before-upload="handleAttachmentBeforeUpload">
                  <img
                    v-if="data.attachment && data.attachment.url"
                    :src="data.attachment.url"
                    alt="Uploading Image"
                    class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon">
                    <plus />
                  </el-icon>
                </el-upload>
                <div class="text-muted fs-7">
                  {{ t("global.set-course-attachment") }}
                </div>
              </div>
            </div>
            <status v-if="userType === 0" ref="status" />
            <approve v-if="userType === 0" ref="approve" />
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2 class="required">{{ t("global.category") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="category">
                  <el-select
                    id="category-select"
                    v-model="data.category"
                    name="category-select"
                    :placeholder="t('global.select-a-category')"
                    :filterable="true"
                    :clearable="true"
                    @change="handleSectionSelectChange">
                    <template v-if="categories.length > 0">
                      <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name" />
                    </template>
                  </el-select>
                </el-form-item>
                <router-link
                  to="/dashboard/sections/categories/add"
                  class="btn btn-light-primary btn-sm mt-2">
                  <span class="svg-icon svg-icon-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none">
                      <rect
                        x="11"
                        y="18"
                        rx="1"
                        width="12"
                        height="2"
                        transform="rotate(-90 11 18)"
                        fill="currentColor"
                        opacity="0.5" />
                      <rect x="6" y="11" rx="1" width="12" height="2" fill="currentColor" />
                    </svg>
                  </span>

                  {{ t("global.create-a-new-category") }}
                </router-link>
              </div>
              <!-- <div
                v-if="categoriesChildren.length > 0 || data.categoryChildren"
                class="card-body pt-0">
                <label for="category-children-select" class="form-label">Children</label>
                <el-form-item prop="categoryChildren" class="mb-2">
                  <el-select
                    id="category-children-select"
                    v-model="data.categoryChildren"
                    name="category-children-select"
                    placeholder="Select a category"
                    :filterable="true">
                    <template v-if="categoriesChildren.length > 0">
                      <el-option
                        v-for="item in categoriesChildren"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name" />
                    </template>
                  </el-select>
                </el-form-item>
                <div class="text-muted fs-7 mb-7">Add categories children to our courses</div>
              </div> -->
            </div>
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.level") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="level">
                  <el-select
                    id="level-select"
                    v-model="data.level"
                    name="level-select"
                    :placeholder="t('global.select-a-level')"
                    :filterable="true"
                    :clearable="true">
                    <template v-if="levels.length > 0">
                      <el-option
                        v-for="item in levels"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name" />
                    </template>
                  </el-select>
                </el-form-item>
                <router-link
                  to="/dashboard/constants/levels"
                  class="btn btn-light-primary btn-sm mt-2">
                  <span class="svg-icon svg-icon-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none">
                      <rect
                        x="11"
                        y="18"
                        rx="1"
                        width="12"
                        height="2"
                        transform="rotate(-90 11 18)"
                        fill="currentColor"
                        opacity="0.5" />
                      <rect x="6" y="11" rx="1" width="12" height="2" fill="currentColor" />
                    </svg>
                  </span>

                  {{ t("global.create-a-new-level") }}
                </router-link>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <languages-tabs v-slot="slot">
              <div class="card-body pt-0">
                <div class="mb-10 fv-row">
                  <div class="card card-flush py-4">
                    <div class="card-header">
                      <div class="card-title">
                        <h2>{{ t("global.thumbnail") }}</h2>
                      </div>
                    </div>
                    <div class="card-body text-center pt-0" style="width: 50%">
                      <!-- Loading indicator -->
                      <div v-if="tabImageUploading" class="upload-loading-overlay">
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
                          :data="{language_id: slot.language.id}"
                          name="attachment"
                          :on-success="
                            (response) => handleOnSuccessOnTabs(response, slot.language.id)
                          "
                          :on-progress="handleUploadProgressOnTabs"
                          :before-upload="handleBeforeUpload">
                          <!-- Image Preview + Remove -->

                          <template v-if="data.thumbnails[slot.language.id]?.length">
                            <div
                              v-for="(thumb, index) in data.thumbnails[slot.language.id]"
                              :key="thumb.id"
                              class="relative d-inline-block mr-2">
                              <img
                                v-if="thumb.url"
                                :src="thumb.url"
                                alt="Uploading Image"
                                class="avatar" />
                              <el-button
                                type="danger"
                                size="small"
                                circle
                                class="remove-btn"
                                @click.stop.prevent="removeThumbnailOnTabs(slot.language.id)">
                                <el-icon><Delete /></el-icon>
                              </el-button>
                            </div>
                          </template>
                          <el-icon v-else class="avatar-uploader-icon">
                            <plus />
                          </el-icon>
                        </el-upload>
                      </div>
                      <div class="text-muted fs-7">
                        {{ t("global.set-group-class-thumbnail-image") }}
                      </div>
                    </div>
                  </div>

                  <label for="our-course-title" class="required form-label">
                    {{ t("global.our-courses-title") }}
                  </label>

                  <el-form-item :prop="`title.${[slot.language.id]}`">
                    <el-input
                      id="our-course-title"
                      v-model="data.title[slot.language.id]"
                      type="text"
                      name="our-course-title"
                      :placeholder="t('global.our-courses-title')" />
                  </el-form-item>
                </div>
                <div class="mb-10 fv-row">
                  <label :for="`our-course-about`" class="form-label">
                    {{ t("global.our-courses-about") }}
                  </label>
                  <div
                    :id="`our-course-${slot.language.name}-about`"
                    :ref="setEditorsRefs"
                    :options="options"
                    name="our-course-about"
                    :data-language-id="slot.language.id"
                    data-key="about"></div>

                  <div class="text-muted fs-7">
                    {{ t("global.set-a-about-to-our-courses-for-better-visibility") }}
                  </div>
                </div>
                <div class="mb-10 fv-row">
                  <label :for="`our-course-headline`" class="form-label">
                    {{ t("global.our-courses-headline") }}
                  </label>
                  <div
                    :id="`our-course-${slot.language.name}-headline`"
                    :ref="setEditorsRefs"
                    :options="options"
                    name="our-course-headline"
                    :data-language-id="slot.language.id"
                    data-key="headline"></div>

                  <div class="text-muted fs-7">
                    {{ t("global.set-a-headline-to-our-courses-for-better-visibility") }}
                  </div>
                </div>
                <div class="mb-10 fv-row">
                  <label :for="`our-course-information`" class="form-label">
                    {{ t("global.our-courses-information") }}
                  </label>
                  <div
                    :id="`our-course-${slot.language.name}-information`"
                    :ref="setEditorsRefs"
                    :options="options"
                    name="our-course-information"
                    :data-language-id="slot.language.id"
                    data-key="information"></div>

                  <div class="text-muted fs-7">
                    {{ t("global.set-a-information-to-our-courses-for-better-visibility") }}
                  </div>
                </div>
              </div>
            </languages-tabs>
            <!-- <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.our-courses-details") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <div class="fv-row mb-10">
                  <label for="our-course-name" class="required form-label">{{
                    t("global.name")
                  }}</label>
                  <el-form-item prop="name">
                    <el-input
                      id="our-course-name"
                      v-model="data.name"
                      type="text"
                      name="our-course-name"
                      :placeholder="t('global.our-courses-name')" />
                  </el-form-item>
                </div>
              </div>
            </div> -->
            <div class="d-flex justify-content-end">
              <router-link id="cancel" to="/dashboard/our-courses/index" class="btn btn-light me-5">
                {{ t("global.cancel") }}
              </router-link>
              <button
                id="submit"
                ref="button"
                type="submit"
                class="btn btn-primary"
                @click.prevent="submit"
                @keypress.prevent="click">
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
import Status from "@/components/admin/status.vue"
import Approve from "@/components/admin/approve.vue"
import {ElMessage as Message} from "element-plus"
import {defineComponent, onBeforeMount, onMounted, ref, watch, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import {createEditorsData, createLanguages} from "../../../core/helpers/creators"
import axiosClient from "../../../plugins/axios"
import {Plus, Delete} from "@element-plus/icons-vue"
import ClassicEditor from "../../../ckeditor"

export default defineComponent({
  name: "add-courses",
  components: {
    Toolbar,
    Status,
    Approve,
    LanguagesTabs,
    Plus,
    Delete
  },
  setup() {
    // Get necessary data from router/route/store
    const {t} = useI18n()
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const API_PATH = ref(import.meta.env.VITE_APP_API_BASE_URL)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const {languages} = store.state
    const {id} = route.params
    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type
    const token = computed(() => store.state.user.token)
    const languageId = ref(null)
    const languagesData = computed(() => store.state.languages)
    const lang = languagesData.value.find((element) => element.shortname === store.state.language)
    languageId.value = lang ? lang.id : null

    // Define form necessary data
    const loading = ref(null)
    const form = ref(null)
    const rules = ref({
      // name: [
      //   {
      //     required: true,
      //     trigger: "change",
      //     message: t(`global.our-courses-name-required-unique`)
      //   }
      // ],
      status: [
        {
          required: true,
          trigger: "change",
          message: t(`global.our-courses-status-required`)
        }
      ],
      category: [
        {
          required: true,
          trigger: "change",
          message: t(`global.our-courses-category-required`)
        }
      ],
      thumbnail: [
        {
          required: false,
          trigger: "change",
          message: t(`global.thumbnail-image-is-required`)
        }
      ],
      title: {}
    })

    languages.forEach((languageItem) => {
      // eslint-disable-next-line
      const {id, name} = languageItem
      rules.value.title[id] = [
        {
          required: true,
          trigger: "change",
          message: t(
            `our-courses-title-in-${name.charAt(0).toUpperCase() + name.slice(1)}-is-required`
          )
        }
      ]
    })

    // Define necessary data for this specific component
    const button = ref(null)
    const status = ref({status: null, date: null})
    const approve = ref({approve: null})
    const categories = ref([])
    const categoriesChildren = ref([])
    const levels = ref([])
    const tutors = ref([])
    const editors = []
    const imageUploading = ref(false)
    const tabImageUploading = ref(false)
    const images = ref([])

    // Define data schema to be submit it
    const data = ref({
      // name: null,
      thumbnail: {},
      thumbnails: {},
      attachment: {},
      title: {},
      about: {},
      headline: {},
      information: {},
      status: status.value.status || null,
      approve: approve.value.approve || null,
      date: status.value.date || null,
      category: null,
      categoryChildren: null,
      level: null,
      classesNumber: 3,
      classesLength: 60,
      tutorId: []
    })

    // Watch status (status/data) changes and update them in data schema
    watch(
      () => [status.value.status, status.value.date, approve.value.approve],
      ([statusValue, dateValue, approveValue]) => {
        data.value.status = statusValue
        data.value.date = dateValue
        data.value.approve = approveValue
      }
    )

    // Validate thumbnail before uploading it (validate type and size)
    const handleBeforeUpload = (file) => {
      // Check if the file type is either JPEG or PNG
      if (file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "image/png") {
        Message.error(t("global.avatar-picture-must-be-either-jpg-or-png-format."))
        return false
      }

      // Validate file size
      if (file.size / 1024 / 1024 > 5) {
        Message.error(t("global.avatar-picture-must-not-exceed-5-mb."))
        return false
      }

      return true
    }

    const handleUploadProgress = (event, file, fileList) => {
      imageUploading.value = true
    }
    const handleUploadProgressOnTabs = (event, file, fileList) => {
      tabImageUploading.value = true
    }

    // When upload thumbnail successfully add it to thumbnail url property
    const handleOnSuccess = (response) => {
      data.value.thumbnail.id = response.result.id
      data.value.thumbnail.url = `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
        response.result.path
      }`

      Swal.fire({
        icon: "success",
        text: t("global.thumbnail-added-successfully"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-primary"}
      })
      imageUploading.value = false
    }

    const handleOnSuccessOnTabs = (response, tabLanguageId) => {
      if (!data.value.thumbnails) {
        data.value.thumbnails = {}
      }

      if (!Array.isArray(data.value.thumbnails[tabLanguageId])) {
        data.value.thumbnails[tabLanguageId] = []
      }

      const newThumbnail = {
        id: response.result.id,
        url: `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${response.result.path}`
      }

      data.value.thumbnails[tabLanguageId].push(newThumbnail)
      images.value.push(newThumbnail.id)

      Swal.fire({
        icon: "success",
        text: t("global.thumbnail-added-successfully"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-primary"}
      })

      tabImageUploading.value = false
    }

    const handleAttachmentBeforeUpload = (file) => {
      // Define allowed file types and their corresponding validation rules
      const allowedTypes = {
        video: {
          test: /^video\//,
          maxSizeMB: 50,
          errorMessage: t(
            "global.course-attachment-must-be-a-video-file-only-and-must-not-exceed-50-mb."
          )
        },
        pdf: {
          test: /^application\/pdf/,
          maxSizeMB: 10,
          errorMessage: t(
            "global.course-attachment-must-be-a-pdf-file-only-and-must-not-exceed-10-mb."
          )
        },
        document: {
          test: /^application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/,
          maxSizeMB: 20,
          errorMessage: t(
            "global.course-attachment-must-be-a-document-file-(doc, docx)-only-and-must-not-exceed-20-mb."
          )
        }
      }

      // Determine the file type based on its MIME type
      let fileType = null
      // eslint-disable-next-line no-restricted-syntax
      for (const [type, {test}] of Object.entries(allowedTypes)) {
        if (test.test(file.type)) {
          fileType = type
          break
        }
      }

      // If the file type is not allowed, show an error message
      if (!fileType) {
        Message.error(t("global.unsupported-file-type-please-upload-a-valid-file."))
        return false
      }

      // Validate file size
      const {maxSizeMB, errorMessage} = allowedTypes[fileType]
      if (file.size / 1024 / 1024 > maxSizeMB) {
        Message.error(errorMessage)
        return false
      }

      return true
    }

    // When upload thumbnail successfully add it to thumbnail url property
    const handleAttachmentOnSuccess = (response) => {
      data.value.attachment.id = response.result.id
      data.value.attachment.url = "/src/assets/media/upload_image.jpg"
      Swal.fire({
        icon: "success",
        text: t("global.attachment-added-successfully"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-primary"}
      })
      // `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
      //   response.result.path
      // }`
    }

    const initializeCKEditor = (editorData) => {
      ClassicEditor.create(editorData?.editor)
        .then((editor) => {
          editors.push({id: editorData?.editorId, key: editorData?.editorKey, editor})
          // eslint-disable-next-line no-console
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(`Error initializing editor:`, error)
        })
    }

    // Get value from editors and add it to editors array
    // const setEditorsRefs = function setEditorsRefs(editor) {
    //   if (editor) {
    //     const editorId = editor?.getAttribute("data-language-id")
    //     const editorKey = editor?.getAttribute("data-key")
    //     initializeCKEditor({editor, editorId, editorKey})
    //   }
    // }
    const initializedEditors = ref({})

    const setEditorsRefs = function setEditorsRefs(editor) {
      if (editor) {
        const editorId = editor?.getAttribute("data-language-id")
        const editorKey = editor?.getAttribute("data-key")
        const uniqueKey = `${editorKey}_${editorId}`

        // Prevent duplicate initialization
        if (initializedEditors.value[uniqueKey]) return

        initializeCKEditor({editor, editorId, editorKey})

        // Mark this editor as initialized
        initializedEditors.value[uniqueKey] = true
      }
    }

    // Remote method for searching tutors
    const tutorRemoteMethod = function tutorRemoteMethod(query) {
      if (query) {
        // Check if the user is of type 2
        if (userInfoObject.user.type === 2) {
          axiosClient
            .get(`/users?q=${query}&type=2&tutor_id=${userInfoObject.user.id}`)
            .then((response) => {
              tutors.value = response.data.result.data
            })
            // eslint-disable-next-line no-unused-vars
            .catch((error) => {
              // Handle the error
            })
        } else {
          // For admin or non-type 2 users
          axiosClient
            .get(`/users?q=${query}&type=2`)
            .then((response) => {
              tutors.value = response.data.result.data
            })
            // eslint-disable-next-line no-unused-vars
            .catch((error) => {
              // Handle the error
            })
        }
      } else {
        tutors.value = [] // Clear tutors when query is empty
      }
    }

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disable = true
      button.value.ariaDisabled = true

      // if (!data.value.thumbnail.id) {
      //   Swal.fire(t("global.please-upload-a-thumbnail-before-submitting."), "", "error")
      //   return
      // }
      form.value.validate((valid, errors) => {
        if (valid) {
          // Refactor THIS
          const {category} = data.value
          const date = new Date(data.value.date).toISOString().split("T")[0]

          createEditorsData({
            editors: editors,
            property: "id",
            data: [
              {key: "about", data: data.value.about},
              {key: "headline", data: data.value.headline},
              {key: "information", data: data.value.information}
            ],
            multiple: true
          })

          const languagesArray = createLanguages(
            {key: "title", values: data.value.title},
            {key: "about", values: data.value.about},
            {key: "headline", values: data.value.headline},
            {key: "information", values: data.value.information}
          )

          let groupClassApprovement

          // in create and user is tutor
          if (!id && userInfoObject.user.type === 2) {
            groupClassApprovement = 0
          } else if (userInfoObject.user.type === 0) {
            groupClassApprovement = data.value.approve
          }

          // const groupClassApprovementToSend =
          //   groupClassApprovement === null ? 0 : groupClassApprovement
          console.log(data.value.thumbnails)

          // Push the thumbnail ID into the images array if available
          // if (data.value.thumbnails && data.value.thumbnails.id) {
          //   images.value.push(data.value.thumbnails.id)
          // }

          const uniqueIds = new Set(images.value)

          if (data.value.thumbnails) {
            Object.values(data.value.thumbnails).forEach((thumbnailList) => {
              if (Array.isArray(thumbnailList)) {
                thumbnailList.forEach((thumb) => {
                  if (thumb?.id && !uniqueIds.has(thumb.id)) {
                    uniqueIds.add(thumb.id)
                  }
                })
              } else if (thumbnailList?.id && !uniqueIds.has(thumbnailList.id)) {
                uniqueIds.add(thumbnailList.id)
              }
            })
          }

          // Convert Set back to array
          images.value = Array.from(uniqueIds)

          axiosClient
            .post(id ? `/our-courses/update/${id}` : `/our-courses/create`, {
              images: images.value,
              // image: data.value.thumbnail.id ?? null,
              attachment: data.value.attachment.id ?? null,
              // name: data.value.name,
              status: userType === 0 ? data.value.status : 0,
              publish: groupClassApprovement,
              // [["publish", "date"].join("_")]: date,
              // [["category", "id"].join("_")]: category || 0,
              publish_date: date,
              category_id: category || 0,
              langs: languagesArray,
              level_id: data.value.level
            })
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.course-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              router.push({name: "private-course-list"})
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                text: t("global.errors-detected"),
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
          // Handle validation errors
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

    const removeThumbnail = function removeThumbnail(id) {
      imageUploading.value = true
      data.value.thumbnail.id = null
      data.value.thumbnail.url = null
      axiosClient.delete(`/medias/delete/${id}`).then(() => {
        Swal.fire({
          icon: "success",
          text: t("global.thumbnail-removed-successfully"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-primary"}
        })
        imageUploading.value = false
      })
    }

    const removeThumbnailOnTabs = function removeThumbnailOnTabs(languageId) {
      tabImageUploading.value = true

      console.log(languageId)
      // Ensure thumbnail data is available for the specific language
      if (data.value.thumbnails && data.value.thumbnails[languageId]) {
        const thumbnailId = data.value.thumbnails[languageId]

        // console.log(data.value.thumbnail[languageId], thumbnailId)
        // Proceed with the delete request if the thumbnail exists
        if (thumbnailId) {
          axiosClient
            .delete(`/medias/delete/${thumbnailId}`)
            .then(() => {
              // Clear the thumbnail for the specific language
              delete data.value.thumbnails[languageId]

              // Show success message
              Swal.fire({
                icon: "success",
                text: t("global.thumbnail-removed-successfully"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })

              tabImageUploading.value = false
            })
            .catch(() => {
              // Handle error if the delete request fails
              Swal.fire({
                icon: "error",
                text: t("global.error-removing-thumbnail"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              tabImageUploading.value = false
            })
        } else {
          // Handle case when there is no thumbnail to remove
          tabImageUploading.value = false
        }
      } else {
        // Handle case when there's no thumbnail for the given language
        tabImageUploading.value = false
      }
    }

    onBeforeMount(() => {
      if (id) {
        loading.value = true
      }
    })

    onMounted(() => {
      let categoriesPromise = null
      let levelsPromise = null
      let privateCoursePromise = null
      let mediaPromise = null
      let tutorsPromise = null
      loading.value = true

      categoriesPromise = axiosClient.get(`/${["get-categories"].join("")}`).then((response) => {
        categories.value = response.data.result.data
      })

      levelsPromise = axiosClient.get("/get-levels").then((responseLevels) => {
        levels.value = responseLevels.data.result.data
      })

      if (userInfoObject.user.type === 2) {
        tutorsPromise = axiosClient
          .get(`get-users?type=2&tutor_id=${userInfoObject.user.id}`)
          .then((response) => {
            tutors.value = response.data.result.data
          })
          .catch((error) => {
            // Handle the error
          })
      } else {
        tutorsPromise = axiosClient
          .get(`get-users?type=2`)
          .then((response) => {
            tutors.value = response.data.result.data
            // data.value.tutorId = tutors.value[0]?.id
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            // Handle the error
          })
      }

      Promise.all([categoriesPromise, levelsPromise, tutorsPromise]).then(() => {
        // When there is an ID get our courses data and add it to data object
        if (id) {
          privateCoursePromise = axiosClient
            .get(`/our-courses/show/${id}`)
            .then((responseInner) => {
              const {result} = responseInner.data
              // data.value.name = result.name
              status.value.status = result.status
              approve.value.approve = result.publish
              status.value.date = Date.now()
              if (result.levels && result.levels.length !== 0) {
                data.value.level = result.levels[0].level_id
              } else {
                data.value.level = null
              }

              // Get image data and add it to data object
              if (result.image) {
                data.value.thumbnail.id = result.image
                mediaPromise = axiosClient
                  .get(`medias/show/${result.image}`)
                  .then((responseMedia) => {
                    data.value.thumbnail.url = `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
                      responseMedia.data.result.path
                    }`
                  })
              }

              // // Assuming `result.images` is the array of image IDs returned in the response
              // if (result.images && result.images.length > 0) {
              //   // Loop through the images array to handle each image ID
              //   result.images.forEach((imageId) => {
              //     data.value.thumbnail = Array.isArray(data.value.thumbnail)
              //       ? data.value.thumbnail
              //       : []

              //     // Add the image to the thumbnails array with an ID and null URL
              //     data.value.thumbnail.push({id: imageId, url: null})

              //     // Fetch the image URL based on its ID
              //     axiosClient.get(`medias/show/${imageId}`).then((responseMedia) => {
              //       console.log(data.value.thumbnail, imageId)
              //       // Find the corresponding thumbnail object by ID and set its URL
              //       const thumbnail = data.value.thumbnail.find((thumb) => thumb.id === imageId)
              //       console.log(thumbnail)
              //       if (thumbnail) {
              //         thumbnail.url = `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
              //           responseMedia.data.result.path
              //         }`
              //       }
              //     })
              //   })
              // }

              console.log(result.images_media)
              if (result.images_media) {
                result.images_media.forEach((image) => {
                  const languagesTabs = [
                    {id: 1, name: "English"},
                    {id: 2, name: "Arabic"}
                  ]
                  console.log(image)
                  // const language = languagesTabs[image.language_id]
                  // if (!language) return // Prevent out-of-bounds error

                  const tabLanguageId = image.language_id
                  if (!Array.isArray(data.value.thumbnails[tabLanguageId])) {
                    data.value.thumbnails[tabLanguageId] = []
                  }

                  data.value.thumbnails[tabLanguageId].push({id: image.id, url: null})

                  axiosClient.get(`medias/show/${image.id}`).then((res) => {
                    const imageObj = data.value.thumbnails[tabLanguageId].find(
                      (img) => img.id === image.id
                    )
                    console.log(imageObj)
                    if (imageObj) {
                      imageObj.url = `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
                        res.data.result.path
                      }`
                    }
                  })
                })
              }

              tutors.value.forEach((tutor) => {
                result.tutors.forEach((tut) => {
                  if (tutor.id === tut.tutor_id) {
                    // data.value.tutorId = tutor.id
                    data.value.tutorId.push(tutor.id)
                  }
                })
              })
              // Loop over languages data and add it to data object
              languages.forEach((language) => {
                result.langs.forEach((lang) => {
                  if (Number(language.id) === Number(lang[["language", "id"].join("_")])) {
                    data.value.title[language.id] = lang.title
                    editors.forEach((editor) => {
                      if (Number(language.id) === Number(editor.id)) {
                        Object.keys(lang).forEach((key) => {
                          if (key === editor.key) {
                            editor.editor.setData(lang[key])
                          }
                        })
                      }
                    })
                  }
                })
              })

              // Loop over categories data and add it to data object
              categories.value.forEach((categoryItem) => {
                if (categoryItem.id === result[["category", "id"].join("_")]) {
                  data.value.category = categoryItem.id
                }
              })

              form.value.clearValidate()
              Promise.all([privateCoursePromise, mediaPromise]).then(() => {
                loading.value = false
              })
            })
        } else {
          loading.value = false
        }
      })
    })

    return {
      SERVER_PATH,
      API_PATH,
      loading,
      form,
      rules,
      button,
      approve,
      status,
      data,
      categories,
      categoriesChildren,
      levels,
      tutors,
      setEditorsRefs,
      initializeCKEditor,
      handleOnSuccess,
      handleOnSuccessOnTabs,
      handleUploadProgress,
      handleUploadProgressOnTabs,
      handleBeforeUpload,
      handleAttachmentOnSuccess,
      handleAttachmentBeforeUpload,
      imageUploading,
      tabImageUploading,
      tutorRemoteMethod,
      submit,
      token,
      userType,
      t,
      removeThumbnail,
      removeThumbnailOnTabs,
      languageId
    }
  },
  data() {
    return {
      options: {
        debug: "info",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
            ["link", "image", "video", "formula"],
            [{header: 1}, {header: 2}], // custom button values
            [{list: "ordered"}, {list: "bullet"}, {list: "check"}],
            [{script: "sub"}, {script: "super"}], // superscript/subscript
            [{indent: "-1"}, {indent: "+1"}], // outdent/indent
            [{direction: "rtl"}], // text direction
            [{size: ["small", false, "large", "huge"]}], // custom dropdown
            [{header: [1, 2, 3, 4, 5, 6, false]}],
            [{color: []}, {background: []}], // dropdown with defaults from theme
            [{font: []}],
            [{align: []}],
            ["clean"]
          ]
        }
      }
    }
  }
})
</script>

<style>
.el-width .el-input,
.el-width .el-select,
.el-width .el-input-number {
  width: 100%;
}
</style>
