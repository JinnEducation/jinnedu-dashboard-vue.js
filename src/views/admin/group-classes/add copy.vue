<!-- DONE REVIEWING: NEW -->
<template>
  <toolbar :title="`Add Group Class`" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <template v-if="loading">
        <div class="card-body p-0">
          <div class="card-px text-center py-20 my-10">
            <div role="status" class="spinner-border text-primary">
              <span class="visually-hidden">Loading...</span>
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
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>Thumbnail</h2>
                </div>
              </div>
              <div class="card-body text-center pt-0">
                <el-upload
                  class="avatar-uploader"
                  :action="`${API_PATH}/medias/create`"
                  :show-file-list="false"
                  :headers="{Authorization: `Bearer ${token}`}"
                  name="attachment"
                  :on-success="handleOnSuccess"
                  :before-upload="handleBeforeUpload">
                  <img
                    v-if="data.thumbnail && data.thumbnail.url"
                    :src="data.thumbnail.url"
                    alt="Uploading Image"
                    class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon">
                    <plus />
                  </el-icon>
                </el-upload>
                <div class="text-muted fs-7">
                  Set group class thumbnail image. Only .png and .jpg image files are accepted
                </div>
              </div>
            </div>
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>Attachment</h2>
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
                  Set group class attachment . Only .pdf and .word files are accepted
                </div>
              </div>
            </div>

            <status v-if="userType !== 2" ref="status" />

            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>Level</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="level">
                  <el-select
                    id="level-select"
                    v-model="data.level"
                    name="level-select"
                    placeholder="Select a level"
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
                  Create a new level
                </router-link>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <languages-tabs v-slot="slot">
              <div class="card-body pt-0">
                <div class="mb-10 fv-row">
                  <label for="group-class-title" class="required form-label">
                    Group Class Title
                  </label>
                  <el-form-item :prop="`title.${[slot.language.id]}`">
                    <el-input
                      id="group-class-title"
                      v-model="data.title[slot.language.id]"
                      type="text"
                      name="group-class-title"
                      placeholder="Group Class Title" />
                  </el-form-item>
                </div>
                <div class="mb-10 fv-row">
                  <label :for="`group-class-about`" class="form-label">Group Class About</label>

                  <!-- <ckeditor :editor="editor" v-model="editorData"></ckeditor> -->

                  <div ref="editor"></div>
                  <ckeditor
                    :editor="editor"
                    :id="`group-class-${slot.language.name}-about`"
                    v-model="data.about[slot.language.id]"
                    :config="editorConfig">
                  </ckeditor>
                  <div class="text-muted fs-7">
                    Set a about to group class for better visibility
                  </div>
                </div>
                <div class="mb-10 fv-row">
                  <label :for="`group-class-headline`" class="form-label">
                    Group Class Headline
                  </label>
                  <ckeditor
                    :editor="editor"
                    :id="`group-class-${slot.language.name}-headline`"
                    v-model="data.headline[slot.language.id]"
                    :config="editorConfig">
                  </ckeditor>

                  <div class="text-muted fs-7">
                    Set a headline to group class for better visibility
                  </div>
                </div>
                <div class="mb-10 fv-row">
                  <label :for="`group-class-information`" class="form-label">
                    Group Class Information
                  </label>
                  <ckeditor
                    :editor="editor"
                    :id="`group-class-${slot.language.name}-information`"
                    v-model="data.information[slot.language.id]"
                    :config="editorConfig">
                  </ckeditor>
                  <div class="text-muted fs-7">
                    Set a information to group class for better visibility
                  </div>
                </div>
              </div>
            </languages-tabs>
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>Group Class Details</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <div class="fv-row mb-10">
                  <label for="group-class-name" class="required form-label">Name</label>
                  <el-form-item prop="name">
                    <el-input
                      id="group-class-name"
                      v-model="data.name"
                      type="text"
                      name="group-class-name"
                      placeholder="Group Class Name" />
                  </el-form-item>
                </div>
                <div class="fv-row row">
                  <div class="col-12 col-md-4">
                    <label for="group-class-minimum-size" class="required form-label">
                      Minimum Students Size
                    </label>
                    <el-form-item prop="minimumSize" class="el-width">
                      <el-input-number
                        id="group-class-minimum-size"
                        v-model="data.minimumSize"
                        type="number"
                        :min="2" />
                    </el-form-item>
                  </div>
                  <div class="col-12 col-md-4">
                    <label for="group-class-classes-number" class="required form-label">
                      Classes Number
                    </label>
                    <el-form-item prop="classesNumber" class="el-width">
                      <el-input-number
                        id="group-class-classes-number"
                        v-model="data.classesNumber"
                        type="number"
                        :min="3" />
                    </el-form-item>
                  </div>
                  <div class="col-12 col-md-4">
                    <label for="group-class-classes-length" class="required form-label">
                      Classes Length (Minutes)
                    </label>
                    <el-form-item prop="classesLength" class="el-width">
                      <el-input-number
                        id="group-class-classes-length"
                        v-model="data.classesLength"
                        :disabled="true" />
                    </el-form-item>
                  </div>
                </div>
                <div class="fv-row row">
                  <div class="col-12">
                    <label for="group-class-minimum-size" class="required form-label">
                      Price
                    </label>
                    <el-form-item prop="price" class="el-width">
                      <el-input-number
                        id="group-class-minimum-size"
                        v-model="data.price"
                        type="number"
                        :min="5"
                        :step="5" />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <div class="card card-flush py-4">
              <div class="card-body">
                <template v-for="classNumber in data.classesNumber" :key="classNumber">
                  <div class="fv-row row" :class="{'mb-10': classNumber !== data.classesNumber}">
                    <div v-if="data.dates[classNumber - 1]" class="col-12">
                      <label
                        :for="`group-class-${classNumber}-class-date`"
                        class="required form-label">
                        Class {{ classNumber }} - Date
                      </label>
                      <el-form-item
                        :prop="`dates[${classNumber - 1}].classDate`"
                        class="el-width mb-0">
                        <el-date-picker
                          :id="`group-class-${classNumber}-class-date`"
                          v-model="data.dates[classNumber - 1].classDate"
                          type="datetime"
                          placeholder="Pick a date and time" />
                      </el-form-item>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <div class="d-flex justify-content-end">
              <router-link
                id="cancel"
                to="/dashboard/group-classes/index"
                class="btn btn-light me-5">
                Cancel
              </router-link>
              <button
                id="submit"
                ref="button"
                type="submit"
                class="btn btn-primary"
                @click.prevent="submit"
                @keypress.prevent="click">
                <span class="indicator-label">Save Changes</span>
                <span class="indicator-progress">
                  Please wait ...
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
// import Thumbnail from "@/components/admin/thumbnail.vue"
import {QuillEditor} from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.bubble.css"
import {ElMessage as Message} from "element-plus"
import {defineComponent, onBeforeMount, onMounted, ref, watch, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import {createEditorsData, createLanguages} from "../../../core/helpers/creators"
import axiosClient from "../../../plugins/axios"
import {Plus} from "@element-plus/icons-vue"
import StarterKit from "@tiptap/starter-kit"
// import Table from "@tiptap/extension-table"
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

import {CKEditor} from "@ckeditor/ckeditor5-vue"
import ClassicEditor from "../../../ckeditor"

export default defineComponent({
  name: "add-group-classes",
  components: {
    Toolbar,
    Status,
    LanguagesTabs,
    CKEditor,
    Plus,
    EditorContent
  },
  setup() {
    const {t} = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const editor = ClassicEditor
    const editorConfig = {
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "blockQuote"
      ],
      placeholder: "Type here..."
    }
    const {languages} = store.state
    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type
    const {id} = route.params
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const token = computed(() => store.state.user.token)

    const TipEditor = useEditor({
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none"
      },
      content: "<p> Tip Top 🎉</p>",
      extensions: [StarterKit]
    })

    // Define form necessary data
    const loading = ref(null)
    const form = ref(null)
    const rules = ref({
      name: [
        {
          required: true,
          trigger: "change",
          message: `A group class name is required and has to be unique`
        }
      ],
      status: [
        {
          required: true,
          trigger: "change",
          message: `A group class status is required`
        }
      ],
      category: [
        {
          required: true,
          trigger: "change",
          message: `A group class category is required`
        }
      ],
      level: [
        {
          required: true,
          trigger: "change",
          message: `A group class level is required`
        }
      ],
      thumbnail: [
        // New validation rule for thumbnail
        {
          required: true,
          trigger: "change",
          message: `A thumbnail image is required`
        }
      ],
      title: {},
      tutorId: "",
      dates: []
    })

    languages.forEach((languageItem) => {
      // eslint-disable-next-line
      const {id, name} = languageItem
      rules.value.title[id] = [
        {
          required: true,
          trigger: "change",
          message: `A group class title in ${
            name.charAt(0).toUpperCase() + name.slice(1)
          } is required`
        }
      ]
    })

    // Define necessary data for this specific component
    const API_PATH = ref(import.meta.env.VITE_APP_API_BASE_URL)
    const button = ref(null)
    const status = ref({status: null, date: null})
    // const approvement = ref({approvement: null})
    const categories = ref([])
    const categoriesChildren = ref([])
    const levels = ref([])
    const tutors = ref([])
    const editors = ref([])
    const media = ref([])
    const aboutContent = ref({})

    // Define data schema to be submit it
    const data = ref({
      name: null,
      thumbnail: {},
      attachment: {},
      title: {},
      about: {},
      headline: {},
      information: {},
      status: status.value.status || null,
      date: status.value.date || null,
      approvement: null,
      category: null,
      categoryChildren: null,
      level: null,
      tutorId: null,
      minimumSize: 2,
      classesNumber: 3,
      classesLength: 60,
      price: 10,
      dates: []
    })

    // Watch status (status/data) changes and update them in data schema
    watch(
      () => [status.value.status, status.value.date],
      ([statusValue, dateValue]) => {
        data.value.status = statusValue
        data.value.date = dateValue
      }
    )

    const handleBeforeUpload = (file) => {
      // Check if the file type is either JPEG or PNG
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        Message.error("Avatar picture must be either JPG or PNG format.")
        return false
      }

      // Validate file size
      if (file.size / 1024 / 1024 > 2) {
        Message.error("Avatar picture must not exceed 2 MB.")
        return false
      }

      return true
    }

    // When upload thumbnail successfully add it to thumbnail url property
    const handleOnSuccess = (response) => {
      data.value.thumbnail.id = response.result.id
      data.value.thumbnail.url = `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
        response.result.path
      }`
      Swal.fire({
        icon: "success",
        text: t("global.thumbnail_added_successfully"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-primary"}
      })
    }

    const handleAttachmentBeforeUpload = (file) => {
      if (
        !/^application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/.test(
          file.type
        )
      ) {
        Message.error("Group class attachment must be PDF or Word document only")
        return false
      }

      // Validate file size
      if (file.size / 1024 / 1024 > 2) {
        Message.error("Group class attachment must be pdf or word only must not exceed 2 MB.")
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
        text: t("global.attachment_added_successfully"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-primary"}
      })
    }

    // Get value from editors and add it to editors array
    const setEditorsRefs = function setEditorsRefs(editor) {
      if (editor && editor.getEditor()) {
        const editorId = editor.getEditor().getAttribute("data-language-id")
        const editorKey = editor.getEditor().getAttribute("data-key")
        editors.value.push({id: editorId, key: editorKey, editor})
      }
    }

    // get tutors
    const tutorRemoteMethod = function tutorRemoteMethod(query) {
      if (query) {
        // if tutors search tutors
        if (userInfoObject.user.type === 2) {
          axiosClient
            .get(`/users?q=${query}&type=2&tutor_id=${userInfoObject.user.id}`)
            .then((response) => {
              tutors.value = response.data.result.data
            })
          // if admin search in tutors
        } else {
          axiosClient.get(`/users?q=${query}&type=2`).then((response) => {
            tutors.value = response.data.result.data
          })
        }
      } else tutors.value = []
    }

    const submit = function submit() {
      // Check if thumbnail is uploaded
      if (!data.value.thumbnail.id) {
        Swal.fire("Please upload a thumbnail before submitting.", "", "error")
        return
      }

      // Check for unique dates
      const selectedDates = data.value.dates.map((date) => date.classDate)
      const uniqueDates = new Set(selectedDates)
      if (selectedDates.length !== uniqueDates.size) {
        Swal.fire("Please choose a different date for each class.", "", "error")
        return
      }
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disable = true
      button.value.ariaDisabled = true
      form.value.validate((valid, errors) => {
        if (valid) {
          // Refactor THIS
          const {category, categoryChildren} = data.value
          const date = new Date(data.value.date).toISOString().split("T")[0]

          createEditorsData({
            editors: editors.value,
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
            {key: "about", values: aboutContent.value},
            {key: "headline", values: data.value.headline},
            {key: "information", values: data.value.information}
          )

          const createDates = function createDates(datesArgument) {
            const datesArray = []

            // eslint-disable-next-line no-shadow
            datesArgument.forEach((date) => {
              const isoDate = new Date(date.classDate).toISOString()
              const formattedDate = isoDate.replace("T", " ").substring(0, 19) // Format: YYYY-MM-DD HH:mm:ss

              datesArray.push({
                [["class", "date"].join("_")]: formattedDate
              })
            })

            return datesArray
          }

          axiosClient
            .post(id ? `/group-classes/update/${id}` : `/group-classes/create`, {
              image: data.value.thumbnail.id,
              attachment: data.value.attachment.id,
              name: data.value.name,
              // status:  data.value.status,
              // if user is tutor put status = 0 else status = 1
              status: data.value.status,
              publish: data.value.status,
              [["publish", "date"].join("_")]: date,
              [["category", "id"].join("_")]: categoryChildren || category || 0,
              langs: languagesArray,
              [["min", "size"].join("_")]: data.value.minimumSize,
              [["class", "length"].join("_")]: data.value.classesLength,
              price: data.value.price,
              [["level", "id"].join("_")]: data.value.level,
              classes: data.value.classesNumber,
              dates: createDates(data.value.dates),
              ...(id
                ? {}
                : {
                    classes: data.value.classesNumber,
                    dates: createDates(data.value.dates)
                  })
            })
            .then((response) => {
              if (response.data.success) {
                router.push({name: "group-class-list"})
              } else {
                let errorMessage = ""
                switch (response.data["msg-code"]) {
                  case "555":
                    errorMessage = t("errors.book-date-is-old")
                    break
                  case "666":
                    errorMessage = t("errors.book-date-is-same")
                    break
                  case "777":
                    errorMessage = t("errors.book-date-is-not-arranged")
                    break
                  default:
                    errorMessage = t("global.unknown-error")
                    break
                }

                Swal.fire({
                  icon: "error",
                  text: errorMessage,
                  confirmButtonText: t("global.got-it"),
                  buttonsStyling: false,
                  customClass: {confirmButton: "btn btn-danger"}
                })
              }
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

    onBeforeMount(() => {
      if (id) {
        loading.value = true
      }
    })

    onMounted(() => {
      ClassicEditor.create(document.querySelector("#editor"))
        .then((editor) => {
        })
        .catch((error) => {
          console.error("Error initializing editor:", error)
        })

      let categoriesPromise = null
      let levelsPromise = null
      let groupClassPromise = null
      let mediaPromise = null
      let tutorsPromise = null
      loading.value = true

      watch(
        () => data.value.classesNumber,
        (value) => {
          if (data.value.dates.length < value) {
            data.value.dates.push({classDate: Date.now()})
            rules.value.dates.push({
              classDate: [
                {
                  required: true,
                  trigger: "change",
                  message: "A class date is required"
                }
              ]
            })
          } else if (data.value.dates.length > value) {
            data.value.dates.pop()
            rules.value.dates.pop()
          }
        }
      )

      categoriesPromise = axiosClient.get(`/${["get-categories"].join("")}`).then((response) => {
        categories.value = response.data.result.data
      })

      levelsPromise = axiosClient.get("/get-levels").then((responseLevels) => {
        levels.value = responseLevels.data.result.data
      })

      Array.from({length: data.value.classesNumber}).forEach(() => {
        data.value.dates.push({
          classDate: Date.now()
        })
      })

      Array.from({length: data.value.classesNumber}).forEach(() => {
        rules.value.dates.push({
          classDate: [
            {
              required: true,
              trigger: "change",
              message: "A class date is required"
            }
          ]
        })
      })

      // Loop over outlines data and add it to data object

      // const tutorsPromise = axiosClient
      //   .get(["/users", ["type", 2].join("=")].join("?"))
      //   .then((response) => {
      //     tutors.value = response.data.result.data
      //     data.value.tutorId = tutors.value[0]?.id
      //   })

      if (userInfoObject.user.type === 2) {
        tutorsPromise = axiosClient
          .get(`get-users?type=2&tutor_id=${userInfoObject.user.id}`)
          .then((response) => {
            tutors.value = response.data.result.data
            data.value.tutorId = tutors.value[0]?.id
          })
          .catch((error) => {
            // Handle the error
          })
      } else {
        tutorsPromise = axiosClient
          .get(`get-users?type=2`)
          .then((response) => {
            tutors.value = response.data.result.data
            data.value.tutorId = tutors.value[0]?.id
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {})
      }

      Promise.all([categoriesPromise, levelsPromise]).then(() => {
        // When there is an ID get group class data and add it to data object

        if (id) {
          groupClassPromise = axiosClient.get(`/group-classes/show/${id}`).then((responseInner) => {
            const {result} = responseInner.data
            data.value.name = result.name
            status.value.status = result.status
            data.value.approvement = result.status
            status.value.date = Date.now()
            data.value.level = result[["level", "id"].join("_")]
            data.value.tutorId = result[["tutor", "id"].join("_")]
            data.value.minimumSize = result[["min", "size"].join("_")]
            data.value.classesLength = result[["class", "length"].join("_")]
            data.value.price = Number(result.price)

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

            // Loop over languages data and add it to data object
            languages.forEach((language) => {
              result.langs.forEach((lang) => {
                if (Number(language.id) === Number(lang[["language", "id"].join("_")])) {
                  data.value.title[language.id] = lang.title

                  editors.value.forEach((editor) => {
                    if (Number(language.id) === Number(editor.id)) {
                      Object.keys(lang).forEach((key) => {
                        if (key === editor.key) {
                          editor.editor.setHTML(lang[key])
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

            // Loop over outlines data and add it to data object
            data.value.classesNumber = result.classes
            // data.value.dates.forEach(() => {
            //   data.value.dates.push({
            //     classDate: Date.now(
            //   })
            // })
            data.value.dates = result.dates.map((date) => ({classDate: date.class_date}))

            form.value.clearValidate()
            Promise.all([groupClassPromise, mediaPromise, tutorsPromise]).then(() => {
              loading.value = false
            })
          })
        } else {
          loading.value = false
        }
      })
    })

    return {
      id,
      loading,
      form,
      rules,
      button,
      status,
      data,
      categories,
      categoriesChildren,
      levels,
      tutors,
      API_PATH,
      SERVER_PATH,
      setEditorsRefs,
      handleOnSuccess,
      handleBeforeUpload,
      handleAttachmentOnSuccess,
      handleAttachmentBeforeUpload,
      tutorRemoteMethod,
      submit,
      userType,
      token,
      media,
      aboutContent,
      TipEditor
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
            ["clean"],
            [{table: []}]
          ]
        }
      },
      editorInit: {
        toolbar_mode: "sliding",
        plugins:
          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
        mergetags_list: [
          {value: "First.Name", title: "First Name"},
          {value: "Email", title: "Email"}
        ],
        ai_request: (request, respondWith) =>
          respondWith.string(() => Promise.reject("See docs to implement AI Assistant"))
      },
      editor: ClassicEditor,
      editorData: "<p>Content of the editor.</p>"
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
</style>

<style>
.el-width .el-input,
.el-width .el-select,
.el-width .el-input-number {
  width: 100%;
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
</style>
