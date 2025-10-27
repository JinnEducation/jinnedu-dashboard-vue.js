<!-- eslint-disable no-unused-vars -->
<!-- DONE REVIEWING: 25/06/2023 -->
<template>
  <toolbar :title="blogId ? t(`global.update-blog`) : t(`global.add-blog`)" />
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
        <el-form ref="form" :model="data" :rules="rules" label-position="top" class="form d-flex flex-column gap-6">

          <!-- 🟢 التصنيف -->
          <el-form-item label="Category" prop="categ_blog_id">
            <el-select v-model="data.categ_blog_id" placeholder="Select category" filterable clearable>
              <el-option v-for="item in categories" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
          </el-form-item>

          <!-- 🟢 العنوان -->
          <el-form-item label="Title" prop="title">
            <el-input v-model="data.title" placeholder="Enter blog title" />
          </el-form-item>

          <!-- 🟢 الرابط (slug) -->
          <el-form-item label="Slug" prop="slug">
            <el-input v-model="data.slug" placeholder="Auto-generated or edit manually" />
          </el-form-item>

          <!-- 🟢 الوصف -->
          <el-form-item label="Description" prop="description">
            <el-input type="textarea" rows="4" v-model="data.description"
              placeholder="Write a short description for this blog..." />
          </el-form-item>

          <!-- 🟢 الصورة -->
          <el-form-item label="Image" prop="image">
            <el-upload :show-file-list="false" :auto-upload="false" accept="image/*"
              :on-change="(file) => handleImageUpload(file)">
              <img v-if="data.image" :src="data.image" class="rounded border" style="max-width: 200px; height: auto;" />
              <el-button v-else type="primary">Select Image</el-button>
            </el-upload>
          </el-form-item>

          <!-- 🟢 التاريخ -->
          <el-form-item label="Date" prop="date">
            <el-date-picker v-model="data.date" type="date" placeholder="Select publish date" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width: 100%" />
          </el-form-item>

          <!-- 🟢 الحالة -->
          <el-form-item label="Status" prop="status">
            <el-select v-model="data.status" placeholder="Select status">
              <el-option label="Published" value="published" />
              <el-option label="Draft" value="draft" />
            </el-select>
          </el-form-item>

          <!-- 🟢 زر الإرسال -->
          <div class="d-flex justify-content-end mt-5">
            <router-link to="/dashboard/blog/index" class="btn btn-light me-3">
              Cancel
            </router-link>
            <el-button type="primary" @click="submitForm(form)">
              {{ blogId ? t(`global.update-blog`) : t(`global.add-blog`) }}
            </el-button>

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
import { ElMessage as Message } from "element-plus"
import { defineComponent, onBeforeMount, onMounted, ref, watch, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"
import { createEditorsData, createLanguages } from "../../../core/helpers/creators"
import axiosClient from "../../../plugins/axios"
import { Plus, Delete } from "@element-plus/icons-vue"
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
    const { t } = useI18n()
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const API_PATH = ref(import.meta.env.VITE_APP_API_BASE_URL)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { languages } = store.state
    const { id } = route.params
    const { userInfo } = store.state
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
      title: [{ required: true, message: "Title is required", trigger: "blur" }],
      description: [{ required: true, message: "Description is required", trigger: "blur" }],
      categ_blog_id: [{ required: true, message: "Category is required", trigger: "change" }],
      date: [{ required: true, message: "Date is required", trigger: "change" }]
    })


    languages.forEach((languageItem) => {
      // eslint-disable-next-line
      const { id, name } = languageItem
      rules.value.title[id] = [
        {
          required: true,
          trigger: "change",
          message: t(
            `blog-title-in-${name.charAt(0).toUpperCase() + name.slice(1)}-is-required`
          )
        }
      ]
    })


    // Define necessary data for this specific component
    const button = ref(null)
    const status = ref({ status: null, date: null })
    const approve = ref({ approve: null })
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
      categ_blog_id: '',
      title: '',
      slug: '',
      description: '',
      image: '',
      date: '',
      status: 'draft',
      user_id: 1 // أو خذ المستخدم الحالي من store
    })
    const blogId = route.params.id

    const handleDataUpate = (blogId) => {
      if (blogId) {
        axiosClient.get(`blog/${blogId}`)
          .then((res) => {
            const blog = res.data
            data.value = blog;
            categories.value.forEach((categoryItem) => {
              console.log(data.value.relations.categ_blog_id.id, categoryItem.id);
              if (categoryItem.id == data.value.relations.categ_blog_id.id) {
                console.log(data.value, categories.value);
                data.value.categ_blog_id = categoryItem.id
              }
            })
          })
          .catch((err) => {
            console.error(err)
            Swal.fire({
              icon: 'error',
              text: 'Error loading blog data',
            })
          })
      }
    }


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
      data.value.thumbnail.url = `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${response.result.path
        }`

      Swal.fire({
        icon: "success",
        text: t("global.thumbnail-added-successfully"),
        buttonsStyling: false,
        customClass: { confirmButton: "btn btn-primary" }
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
        customClass: { confirmButton: "btn btn-primary" }
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
      for (const [type, { test }] of Object.entries(allowedTypes)) {
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
      const { maxSizeMB, errorMessage } = allowedTypes[fileType]
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
        customClass: { confirmButton: "btn btn-primary" }
      })
      // `${import.meta.env.VITE_APP_SERVER_BASE_URL}/${
      //   response.result.path
      // }`
    }

    const initializeCKEditor = (editorData) => {
      ClassicEditor.create(editorData?.editor)
        .then((editor) => {
          editors.push({ id: editorData?.editorId, key: editorData?.editorKey, editor })
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

        initializeCKEditor({ editor, editorId, editorKey })

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
          const { category } = data.value
          const date = new Date(data.value.date).toISOString().split("T")[0]

          createEditorsData({
            editors: editors,
            property: "id",
            data: [
              { key: "about", data: data.value.about },
              { key: "headline", data: data.value.headline },
              { key: "information", data: data.value.information }
            ],
            multiple: true
          })

          const languagesArray = createLanguages(
            { key: "title", values: data.value.title },
            { key: "about", values: data.value.about },
            { key: "headline", values: data.value.headline },
            { key: "information", values: data.value.information }
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
            .post(id ? `/blog/update/${id}` : `/blog/create`, {
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
                customClass: { confirmButton: "btn btn-primary" }
              })
              router.push({ name: "private-course-list" })
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                text: t("global.errors-detected"),
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
            customClass: { confirmButton: "btn btn-danger" }
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
          customClass: { confirmButton: "btn btn-primary" }
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
                customClass: { confirmButton: "btn btn-primary" }
              })

              tabImageUploading.value = false
            })
            .catch(() => {
              // Handle error if the delete request fails
              Swal.fire({
                icon: "error",
                text: t("global.error-removing-thumbnail"),
                buttonsStyling: false,
                customClass: { confirmButton: "btn btn-primary" }
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

      categoriesPromise = axiosClient.get(`/${["cateqblog"].join("")}`).then((response) => {
        categories.value = response.data.data
      })

      loading.value = false
      handleDataUpate(blogId);
    })

    // ✅ رفع الصورة (محلي Base64)
    const handleImageUpload = (file) => {
      data.value.imageFile = file.raw
      data.value.image = URL.createObjectURL(file.raw) // للمعاينة فقط
    }


    watch(() => data.value.title, (val) => {
      data.value.slug = val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    })
    // ✅ الإرسال
    const submitForm = () => {
      const fd = new FormData()
      Object.keys(data.value).forEach(key => {
        if (key !== 'image') fd.append(key, data.value[key])
      })

      if (data.value.imageFile) {
        fd.append('image', data.value.imageFile)
      }

      axiosClient.post('blog', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(() => {
          Swal.fire({
            icon: "success",
            text: "Blog created successfully!",
            confirmButtonText: "OK"
          })
          router.push("/dashboard/blog/index")
        })
        .catch((error) => {
          console.error(error)
          Swal.fire({
            icon: "error",
            text: "Error while creating blog",
            confirmButtonText: "Close"
          })
        })

      // لو تعديل (id موجود)
      if (blogId) {
        axiosClient.post(`blog/${blogId}?_method=PUT`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Blog updated successfully!",
              confirmButtonText: "OK"
            })
            router.push("/dashboard/blog/index")
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: "Error updating blog",
            })
          })
      } else {
        // لو إضافة جديدة
        axiosClient.post("blog", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              text: "Blog created successfully!",
              confirmButtonText: "OK"
            })
            router.push("/dashboard/blog/index")
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: "Error while creating blog",
            })
          })
      }
    }

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
      languageId,
      blogId,
      handleDataUpate,
      handleImageUpload,
      submitForm
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
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction
            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
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
