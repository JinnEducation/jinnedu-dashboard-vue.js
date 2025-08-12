<template>
  <toolbar
    :title="
      id
        ? `${t('global.edit')} ${t(`global.${content}`)}`
        : `${t('global.add')} ${t(`global.${content}`)}`
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
        <div v-if="content === 'events'" class="d-flex justify-content-center align-items-center">
          <div class="card p-3 m-3 col-md-8" style="height: 400px">
            <VueDatePicker
              v-model="selectedDates"
              inline
              auto-apply
              multi-dates
              :mode="'date'"
              :enable-time="false"
              :model-value="selectedDates"
              @update:modelValue="handleDateChange" />
          </div>
          <div
            class="col-md-4"
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
            ">
            <div>
              <span style="font-size: 18px; font-weight: bold"
                >{{ t("global.start-date") }} :
              </span>
              <span style="font-size: 17px; font-weight: bold; color: #69d177">{{
                startDate
              }}</span>
            </div>
            <div>
              <span style="font-size: 18px; font-weight: bold">{{ t("global.end-date") }} : </span>
              <span style="font-size: 17px; font-weight: bold; color: rgb(239 46 46)">{{
                endDate
              }}</span>
            </div>
          </div>
        </div>

        <el-form
          ref="form"
          :model="data"
          :rules="rules"
          class="form d-flex flex-column flex-lg-row">
          <div
            v-if="content !== 'packages'"
            class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
            <div v-if="content !== 'links'" class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.thumbnail") }}</h2>
                </div>
              </div>
              <div class="card-body text-center pt-0">
                <!-- Loading indicator -->
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
                    <!-- Image Preview + Remove -->
                    <div
                      v-if="data.thumbnail && data.thumbnail.url"
                      class="relative d-inline-block">
                      <template v-if="ThumbFileType === 'image'">
                        <img :src="data.thumbnail.url" alt="Uploading Image" class="avatar-image" />
                      </template>

                      <template v-else-if="ThumbFileType === 'video'">
                        <video :src="data.thumbnail.url" controls class="avatar">
                          <track kind="captions" srclang="en" label="English" />
                        </video>
                      </template>

                      <template v-else-if="ThumbFileType === 'pdf'">
                        <div class="file-preview">
                          <el-icon><Document /></el-icon>
                          <div class="file-name">{{ getFileName(data.thumbnail.url) }}</div>
                        </div>
                      </template>

                      <template v-else-if="ThumbFileType === 'word'">
                        <div class="file-preview">
                          <el-icon><Document /></el-icon>
                          <div class="file-name">{{ getFileName(data.thumbnail.url) }}</div>
                        </div>
                      </template>

                      <template v-else>
                        <div class="file-preview">
                          <el-icon><Document /></el-icon>
                          <div class="file-name">{{ getFileName(data.thumbnail.url) }}</div>
                        </div>
                      </template>
                      <el-button
                        type="danger"
                        size="small"
                        circle
                        class="remove-btn"
                        @click.stop.prevent="removeThumbnail(data.thumbnail.id)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>

                    <!-- Icon Placeholder -->
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
            <status ref="status" />
            <div v-if="content !== 'packages' && content !== 'links'" class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t(`global.${content}`) }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="department">
                  <el-select
                    id="department-select"
                    v-model="data.department"
                    name="department-select"
                    :placeholder="t('global.select-department')"
                    :filterable="true"
                    :clearable="true"
                    @change="handleSectionSelectChange">
                    <template v-if="departments.length > 0">
                      <el-option
                        v-for="item in departments"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name" />
                    </template>
                  </el-select>
                </el-form-item>
                <router-link
                  to="/dashboard/sections/departments/add"
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
                  {{ t("global.create-department") }}
                </router-link>
              </div>
            </div>
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.tags") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="tags" class="mb-2">
                  <el-select
                    id="tags-select"
                    v-model="data.tags"
                    name="tags-select"
                    :placeholder="t('global.select-tags')"
                    :multiple="true"
                    :filterable="true"
                    :allow-create="true">
                    <template v-if="data.tags.length > 0">
                      <el-option
                        v-for="item in data.tags"
                        :key="item"
                        :value="item"
                        :label="item" />
                    </template>
                  </el-select>
                </el-form-item>
                <div class="text-muted fs-7">{{ t(`global.add-${content}-tags`) }}</div>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <languages-tabs v-slot="slot">
              <div class="card-body pt-0">
                <div class="mb-10 fv-row">
                  <label :for="`${content}-title`" class="required form-label">
                    {{ t(`global.${content}-title`) }}
                  </label>
                  <el-form-item :prop="`title.${[slot.language.id]}`">
                    <el-input
                      :id="`${content}-title`"
                      v-model="data.title[slot.language.id]"
                      type="text"
                      :name="`${content}-title`"
                      :placeholder="t(`global.${content}-title`)" />
                  </el-form-item>
                </div>
                <div v-if="content !== 'packages'" class="fv-row">
                  <label :for="`${content}-description`" class="form-label">
                    {{ t(`global.${content}`) }} {{ t("global.description") }}
                  </label>
                  <!-- <quill-editor
                    :id="`${content}-${slot.language.name}-description`"
                    :ref="setEditorsRefs"
                    :options="options"
                    :name="`${content}-description`"
                    :data-language-id="slot.language.id"
                    class="min-h-200px mb-2"></quill-editor> -->
                  <div
                    :id="`${content}-${slot.language.name}-description`"
                    :ref="setEditorsRefs"
                    :options="options"
                    :name="`${content}-description`"
                    :data-language-id="slot.language.id"
                    data-key="description"></div>
                </div>
                <div v-else class="fv-row">
                  <label :for="`${content}-description`" class="form-label">
                    {{ t(`global.${content}-description`) }}
                  </label>
                  <div
                    :id="`packages-${slot.language.name}-description`"
                    :ref="setCKEditorsRefs"
                    :options="options"
                    name="packages-description"
                    :data-language-id="slot.language.id"
                    data-key="description"></div>

                  <div class="text-muted fs-7">
                    {{ t(`global.set-a-description-to-${content}-for-better-visibility`) }}
                  </div>
                </div>
              </div>
            </languages-tabs>
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2 class="required">{{ t(`global.${content}-name`) }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <div class="fv-row">
                  <el-form-item prop="name">
                    <el-input
                      :id="`${content}-name`"
                      v-model="data.name"
                      type="text"
                      :name="`${content}-name`"
                      :placeholder="t(`global.${content}-name`)" />
                  </el-form-item>
                </div>
                <div class="fv-row">
                  <el-form-item v-if="content === 'links'" prop="link">
                    <el-input
                      :id="`${content}-url`"
                      v-model="data.link"
                      type="text"
                      :name="`${content}-url`"
                      :placeholder="`global.${content}-url`" />
                  </el-form-item>
                </div>
                <div v-if="content === 'packages'" class="fv-row row">
                  <div class="col-12 col-md-3">
                    <label for="package-price" class="required form-label">{{
                      t("global.price")
                    }}</label>
                    <el-form-item prop="package.price" class="el-width">
                      <el-input-number id="package-price" v-model="data.package.price" :min="5" />
                    </el-form-item>
                  </div>
                  <div class="col-12 col-md-3">
                    <label for="package-group-classes" class="required form-label">
                      {{ t("global.group-classes") }}
                    </label>
                    <el-form-item prop="package.groupClasses" class="el-width">
                      <el-input-number
                        id="package-group-classes"
                        v-model="data.package.groupClasses"
                        :min="0" />
                    </el-form-item>
                  </div>
                  <div class="col-12 col-md-3">
                    <label for="package-private-lessons" class="required form-label">
                      {{ t("global.private-lessons") }}
                    </label>
                    <el-form-item prop="package.privateLessons" class="el-width">
                      <el-input-number
                        id="package-private-lessons"
                        v-model="data.package.privateLessons"
                        :min="0" />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <template>
              <media ref="media" :note="`set-${content}-media-gallery`" />
            </template>
            <div class="d-flex justify-content-end">
              <router-link
                id="cancel"
                :to="`/dashboard/${hosts[2]}/${content}`"
                class="btn btn-light me-5">
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
import Media from "@/components/admin/media.vue"
import Status from "@/components/admin/status.vue"
import {ElMessage as Message} from "element-plus"
import {defineComponent, onBeforeMount, onMounted, ref, watch, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import {createEditorsData, createLanguages, createMedia} from "../../../core/helpers/creators"
import axiosClient from "../../../plugins/axios"
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"
import ClassicEditor from "../../../ckeditor"
import {Plus, Delete} from "@element-plus/icons-vue"

export default defineComponent({
  name: "add-contents",
  components: {
    Toolbar,
    Status,
    LanguagesTabs,
    Media,
    Plus,
    Delete,
    VueDatePicker
  },
  setup() {
    // Get necessary data from router/route/store
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const API_PATH = ref(import.meta.env.VITE_APP_API_BASE_URL)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const {t} = useI18n()
    const CKeditors = []
    const {languages} = store.state
    const {content, id} = route.params
    const hosts = ref([])
    const token = computed(() => store.state.user.token)
    const imageUploading = ref(null)

    // Define form necessary data
    const loading = ref(null)
    const form = ref(null)
    const showCalendar = ref(null)

    // Define necessary data for this specific component
    const button = ref(null)
    const status = ref({status: null, date: null})
    const departments = ref([])
    const departmentsChildren = ref([])
    const editors = []
    const media = ref([])

    const selectedDates = ref([]) // Add a new data property to store selected dates

    // Define data schema to be submit it
    const data = ref({
      name: null,
      link: null,
      thumbnail: {},
      title: {},
      description: {},
      status: status.value?.status || null,
      date: status.value?.date || null,
      department: null,
      departmentChildren: null,
      tags: [],
      package: {
        price: 5,
        groupClasses: 1,
        ourCourses: 1,
        privateLessons: 1
      }
    })

    const startDate = ref(null)
    const endDate = ref(null)

    const rules = ref({
      name: [
        {
          required: true,
          trigger: "change",
          message: t(`global.${content}-name-required-and-unique`)
        }
      ],
      status: [
        {
          required: true,
          trigger: "change",
          message: t(`global.${content}-status-required`)
        }
      ],
      department: [
        {
          required: true,
          trigger: "change",
          message: t(`global.${content}-department-required`)
        }
      ],
      thumbnail: [
        {
          required: false,
          trigger: "change",
          message: t(`global.thumbnail-image-required`)
        }
      ],
      link: [
        {
          required: true,
          trigger: "change",
          message: t(`global.${content}-link-required`)
        },
        {
          validator: (rule, value, callback) => {
            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
            if (!urlRegex.test(value)) {
              callback(new Error(`The ${content} link must be a valid URL`))
            } else {
              callback()
            }
          }
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
            `global.${content}-title-in-${name.charAt(0).toUpperCase() + name.slice(1)}-required`
          )
        }
      ]
    })

    // Watch status (status/data) changes and update them in data schema
    watch(
      () => [status.value?.status, status.value?.date],
      ([statusValue, dateValue]) => {
        data.value.status = statusValue
        data.value.date = dateValue
      }
    )

    const handleUploadStart = () => {
      imageUploading.value = true
    }

    const handleUploadProgress = (event, file, fileList) => {
      imageUploading.value = true
    }

    const handleBeforeUpload = (file) => {
      // Allowed file types and their corresponding MIME types
      const allowedTypes = {
        images: ["image/jpeg", "image/png"],
        posts: ["image/jpeg", "image/png"],
        pages: ["image/jpeg", "image/png", "video/mp4"],
        events: ["image/jpeg", "image/png"],
        helps: ["image/jpeg", "image/png"],
        videos: ["video/mp4", "video/quicktime"],
        documents: ["application/pdf"],
        links: ["text/plain", "text/html", "application/json"] // Assuming links can be text files, HTML files, or JSON files
        // Add more types as needed
      }

      // Determine the allowed MIME types based on the content
      const allowedMimeTypes = allowedTypes[content]

      if (!allowedMimeTypes) {
        Message.error(t("errors.invalid-content-type."))
        return false
      }

      if (content === "pages") {
        // Check if the file type is supported for videos
        if (!allowedMimeTypes.includes(file.type)) {
          Message.error(t("errors.video-must-be-in-jpg-png-or-mp4-format"))
          return false
        }
      }

      // If specific content type is video
      if (content === "videos") {
        // Check if the file type is supported for videos
        if (!allowedMimeTypes.includes(file.type)) {
          Message.error(t("errors.video-must-be-in-mp4-format"))
          return false
        }
      }

      // If specific content type is image
      if (
        content === "images" ||
        content === "posts" ||
        content === "events" ||
        content === "helps"
      ) {
        // Check if the file type is supported for images
        if (!allowedMimeTypes.includes(file.type)) {
          Message.error(t("errors.image-must-be-in-jpg-or-png-format."))
          return false
        }
      }

      // If specific content type is pdf
      if (content === "documents") {
        // Check if the file type is supported for PDFs
        if (!allowedMimeTypes.includes(file.type)) {
          Message.error(t("errors.pdf-must-be-in-pdf-format."))
          return false
        }
      }

      // Determine the file type based on its MIME type
      let fileType
      const allowedTypesKeys = Object.keys(allowedTypes)
      for (let i = 0; i < allowedTypesKeys.length; i++) {
        const type = allowedTypesKeys[i]
        if (allowedTypes[type].includes(file.type)) {
          fileType = type
          break
        }
      }

      // If file type is not recognized
      if (!fileType) {
        Message.error(t("errors.file-type-not-supported."))
        return false
      }

      // Validate file size
      const maxSize = {
        images: 5, // 5 MB for images
        videos: 50, // 50 MB for videos
        documents: 10, // 10 MB for PDFs
        links: 1 // 1 MB for links (assuming text files)
        // Adjust sizes as needed
      }[fileType]

      if (file.size / 1024 / 1024 > maxSize) {
        Message.error(t(`file-size-must-not-exceed-${maxSize}-mb.`))
        return false
      }

      return true
    }

    // When upload thumbnail successfully add it to media files list
    const handleOnSuccess = (response, file) => {
      // if (content === "videos") {
        media.value.list.unshift(file)
      // }
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

    // Get departments children after changing department value
    const handleSectionSelectChange = function handleSectionSelectChange() {
      departmentsChildren.value = []
      data.value.departmentChildren = null

      if (data.value.department) {
        return axiosClient.get(`/departments/show/${data.value.department}`).then((response) => {
          if (response.data.result.childrens.length > 0)
            departmentsChildren.value = response.data.result.childrens
          else if (response.data.result.childrens.length === 0) departmentsChildren.value = []
          else departmentsChildren.value = []
        })
      }
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
    const setEditorsRefs = function setEditorsRefs(editor) {
      if (editor) {
        const editorId = editor?.getAttribute("data-language-id")
        const editorKey = editor?.getAttribute("data-key")
        initializeCKEditor({editor, editorId, editorKey})
      }
    }

    // Get value from editors and add it to editors array
    const setCKEditorsRefs = function setCKEditorsRefs(editor) {
      if (editor) {
        const editorId = editor?.getAttribute("data-language-id")
        const editorKey = editor?.getAttribute("data-key")
        initializeCKEditor({editor, editorId, editorKey})
      }
    }

    const config = ref({
      mode: "multiple", // Enable multiple date selection
      dateFormat: "Y-m-d", // Specify date format
      altFormat: "DD-MM-YYYY",
      minDate: new Date(), // Prevent selection of past dates
      inline: true // Show the calendar inline
    })

    // Helper function to format dates
    const formatDate = (date) => {
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`
    }

    // Handle date change from the date picker
    const handleDateChange = (newDates) => {
      // Sort the dates in ascending order before formatting them
      const sortedDates = newDates.sort((a, b) => new Date(a) - new Date(b))

      // Format the dates as needed
      selectedDates.value = sortedDates.map((date) => formatDate(date))
      if (selectedDates.value.length > 0) {
        startDate.value = selectedDates.value[0] // Set the first date as the start date (earliest date)
        endDate.value = selectedDates.value[selectedDates.value.length - 1] // Set the last date as the end date (latest date)
      } else {
        startDate.value = null
        endDate.value = null
      }
    }

    const getFileType = (url) => {
      if (!url) return "unknown"
      const extension = url.split(".").pop().toLowerCase()

      if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension)) {
        return "image"
      }
      if (["mp4", "webm", "ogg"].includes(extension)) {
        return "video"
      }
      if (["pdf"].includes(extension)) {
        return "pdf"
      }
      if (["doc", "docx"].includes(extension)) {
        return "word"
      }
      return "file"
    }

    const getFileName = (url) => {
      return url.split("/").pop()
    }

    const ThumbFileType = computed(() => getFileType(data.value.thumbnail?.url))

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disable = true
      button.value.ariaDisabled = true

      // if (!id && content !== "packages" && content !== "links") {
      //   if (!data.value.thumbnail.id) {
      //     Swal.fire(t("errors.please-upload-a-thumbnail-before-submitting."), "", "error")
      //     return
      //   }
      // }

      form.value.validate((valid, errors) => {
        if (valid) {
          // Refactor THIS
          const {department, departmentChildren} = data.value
          const date = new Date(data.value.date).toISOString().split("T")[0]

          createEditorsData({
            editors: CKeditors,
            property: "id",
            data: data.value.description
          })

          const PackageLanguagesArray = createLanguages(
            {key: "title", values: data.value.title},
            {key: "description", values: data.value.description}
          )

          // createQuillEditorsData({
          //   editors: editors.value,
          //   property: "id",
          //   data: data.value.description
          // })
          createEditorsData({
            editors: editors,
            property: "id",
            data: data.value.description
          })

          const languagesArray = createLanguages(
            {key: "title", values: data.value.title},
            {key: "description", values: data.value.description}
          )

          let departmentsArray
          let mediaArray

          if (content !== "packages" && content !== "links") {
            departmentsArray = [
              ...(department ? [{[["department", "id"].join("_")]: department}] : []),
              ...(departmentChildren
                ? [{[["department", "id"].join("_")]: departmentChildren}]
                : [])
            ]
          }

          mediaArray = createMedia(media.value.list)

          // Split the string into an array using the split method
          const selectedDateArray = Array.isArray(selectedDates.value)
            ? selectedDates.value.map((date) => formatDate(date)) // Format each date
            : []
          axiosClient
            .post(
              id ? `/${content}/update/${id}` : `/${content}/create`,
              content === "packages"
                ? {
                    name: data.value.name,
                    langs: PackageLanguagesArray,
                    package: {
                      price: data.value.package.price,
                      group_class_count: data.value.package.groupClasses,
                      private_lesson_count: data.value.package.privateLessons
                    }
                  }
                : {
                    name: data.value.name,
                    link: data.value.link,
                    status: data.value.status,
                    publish: data.value.status === 0 ? 1 : 0,
                    selected_dates: selectedDateArray,
                    [["publish", "date"].join("_")]: date,
                    [["parent", "id"].join("_")]: department,
                    langs: languagesArray,
                    departments: departmentsArray,
                    thumbnail: data.value.thumbnail.id,
                    media: mediaArray,
                    tags: data.value.tags
                  }
            )
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.content-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              if (hosts.value[2] === "contents") router.push({name: "content-list"})
              else router.push({name: `${hosts.value[2]}-list`})
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

    const options = {
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

    onBeforeMount(() => {
      hosts.value = route.path.split("/")
      if (id) loading.value = true
    })

    onMounted(() => {
      let departmentsPromise = null
      let contentPromise = null
      let mediaPromise = null
      loading.value = true

      // Watch media files list and change thumbnail url value based on first item
      watch(
        () => media.value.list,
        (value) => {
          if (value[0] && (value[0].raw || value[0].url))
            data.value.thumbnail.url = value[0].raw
              ? URL.createObjectURL(value[0].raw)
              : value[0].url
          else data.value.thumbnail.url = null
        },
        {deep: true}
      )

      departmentsPromise = axiosClient.get(`/departments`).then((response) => {
        departments.value = response.data.result.data
      })

      Promise.resolve(departmentsPromise).then(() => {
        // When there is an ID get content data and add it to data object
        if (id) {
          if (content === "packages") {
            contentPromise = axiosClient.get(`/${content}/show/${id}`).then((responseInner) => {
              const {result} = responseInner.data
              data.value.name = result.name
              data.value.package.price = result.package?.price ?? 0
              data.value.package.groupClasses = result.package?.group_class_count ?? 0
              // data.value.package.ourCourses = result.package.our_course_count
              data.value.package.privateLessons = result.package?.private_lesson_count ?? 0

              // Loop over languages data and add it to data object
              languages.forEach((language) => {
                result.langs.forEach((lang) => {
                  if (Number(language.id) === Number(lang[["language", "id"].join("_")])) {
                    data.value.title[language.id] = lang.title
                    // CKeditors.forEach((editor) => {
                    //   if (Number(language.id) === Number(editor.id)) {
                    //     editor.editor.getData(lang.description)
                    //   }
                    // })
                    CKeditors.forEach((editor) => {
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

              Promise.all([contentPromise]).then(() => {
                loading.value = false
              })
            })
          } else {
            contentPromise = axiosClient.get(`/${content}/show/${id}`).then((responseInner) => {
              const {result} = responseInner.data

              data.value.name = result.name
              data.value.link = result.link

              // Use array destructuring to get the start date and end date
              ;[startDate.value, endDate.value] = [
                result.selected_dates ? result.selected_dates[0] : null,
                result.selected_dates
                  ? result.selected_dates[result.selected_dates.length - 1]
                  : null
              ]
              selectedDates.value = result.selected_dates ?? null
              status.value.status = result.status
              status.value.date = result[["publish", "date"].join("_")]

              // Loop over languages data and add it to data object
              // languages.forEach((language) => {
              //   result.langs.forEach((lang) => {
              //     if (Number(language.id) === Number(lang[["language", "id"].join("_")])) {
              //       data.value.title[language.id] = lang.title
              //       editors.forEach((editor) => {
              //         if (Number(language.id) === Number(editor.id))
              //           editor.editor.setHTML(lang.description)
              //       })
              //     }
              //   })
              // })
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

              // Loop over departments data and add it to data object
              departments.value.forEach((departmentItem) => {
                result.departments.forEach((departmentItemInner) => {
                  data.value.department = departmentItem.id
                  // if (departmentItem.id === departmentItemInner[["department", "id"].join("_")]) {
                  // }
                })
              })

              // Loop over media data and add it to data object
              // if (result.media.length > 0) {
              //   mediaPromise = result.media.forEach((item) => {
              //     axiosClient
              //       .get(`medias/show/${item[["media", "id"].join("_")]}`)
              //       .then((responseMedia) => {
              //         media.value.list.push({
              //           [["media", "id"].join("_")]: responseMedia.data.result.id,
              //           name: responseMedia.data.result.name,
              //           url: `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
              //             responseMedia.data.result.path
              //           }`
              //         })
              //       })
              //   })
              // }

              if (result.image) {
                data.value.thumbnail.id = result.image
                mediaPromise = axiosClient
                  .get(`medias/show/${result.image}`)
                  .then((responseMedia) => {
                    if (responseMedia.data.result?.path) {
                      data.value.thumbnail.url = `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
                        responseMedia.data.result.path
                      }`
                    }
                  })
              }

              form.value.clearValidate()
              Promise.all([contentPromise, mediaPromise]).then(() => {
                loading.value = false
              })
            })
          }
        } else {
          loading.value = false
        }
      })
    })
    return {
      id,
      setCKEditorsRefs,
      startDate,
      endDate,
      options,
      SERVER_PATH,
      API_PATH,
      t,
      content,
      hosts,
      loading,
      form,
      rules,
      button,
      status,
      data,
      departments,
      departmentsChildren,
      media,
      setEditorsRefs,
      handleOnSuccess,
      handleBeforeUpload,
      handleSectionSelectChange,
      submit,
      token,
      selectedDates,
      showCalendar,
      CKeditors,
      config,
      handleDateChange,
      removeThumbnail,
      getFileType,
      getFileName,
      ThumbFileType,
      handleUploadStart,
      handleUploadProgress,
      imageUploading
    }
  },
  data() {
    return {}
  },
  methods: {}
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
