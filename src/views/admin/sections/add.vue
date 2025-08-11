<!-- DONE REVIEWING: NEW -->
<template>
  <toolbar :title="`Add ${section.charAt(0).toUpperCase() + section.slice(1)}`" />
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
          class="form d-flex flex-column flex-lg-row">
          <div class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.thumbnail") }}</h2>
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
                  <!-- Image Preview + Remove -->
                  <div v-if="data.thumbnail && data.thumbnail.url" class="relative d-inline-block">
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

                  <!-- Icon Placeholder -->
                  <el-icon v-else class="avatar-uploader-icon">
                    <plus />
                  </el-icon>
                </el-upload>

                <div class="text-muted fs-7">
                  {{ t("global.set-group-class-thumbnail-image") }}
                </div>
              </div>
            </div>

            <status ref="status" />
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ section.charAt(0).toUpperCase() + section.slice(1) }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="parent">
                  <el-select
                    id="parent-select"
                    v-model="data.parent"
                    name="parent-select"
                    :placeholder="t('global.select-a-parent')"
                    :filterable="true"
                    :clearable="true">
                    <template v-if="parents.length > 0">
                      <el-option
                        v-for="item in parents"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name" />
                    </template>
                  </el-select>
                </el-form-item>
                <router-link
                  :to="`/dashboard/sections/${section}/add`"
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
                  {{ section }}
                  {{ t("global.create-a-new") }}
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
                    :placeholder="t('global.select-a-tag')"
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
                <div class="text-muted fs-7">{{ t(`global.add-tags-to-${section}`) }}</div>
              </div>
            </div>

            <div v-if="section === 'categories'" class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2 class="required">{{ t("global.type") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="types" class="mb-2">
                  <el-select
                    id="type-select"
                    v-model="data.type"
                    name="type-select"
                    :placeholder="t('global.select-a-type')"
                    :filterable="true"
                    :allow-create="true">
                    <template v-if="data.types.length > 0">
                      <el-option
                        v-for="item in data.types"
                        :key="item"
                        :value="item"
                        :label="item" />
                    </template>
                  </el-select>
                </el-form-item>
                <div class="text-muted fs-7">{{ t(`global.add-type-to-${section}`) }}</div>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <languages-tabs v-slot="slot">
              <div class="card-body pt-0">
                <div class="mb-10 fv-row">
                  <label :for="`${section}-title`" class="required form-label">
                    {{ section.charAt(0).toUpperCase() + section.slice(1) }}
                    {{ t("global.title") }}
                  </label>
                  <el-form-item :prop="`title.${[slot.language.id]}`">
                    <el-input
                      :id="`${section}-title`"
                      v-model="data.title[slot.language.id]"
                      type="text"
                      :name="`${section}-title`"
                      :placeholder="
                        t(`global.${section.charAt(0).toLowerCase() + section.slice(1)}-title`)
                      " />
                  </el-form-item>
                </div>
                <div class="mb-10 fv-row">
                  <label :for="`${section}-summary`" class="required form-label">
                    {{ section.charAt(0).toUpperCase() + section.slice(1) }}
                    {{ t("global.summary") }}
                  </label>
                  <el-form-item :prop="`summary.${[slot.language.id]}`">
                    <el-input
                      :id="`${section}-summary`"
                      v-model="data.summary[slot.language.id]"
                      type="text"
                      :name="`${section}-summary`"
                      :placeholder="
                        t(`global.${section.charAt(0).toLowerCase() + section.slice(1)}-summary`)
                      " />
                  </el-form-item>
                </div>
                <div class="fv-row">
                  <label :for="`${section}-description`" class="form-label">
                    {{ section.charAt(0).toUpperCase() + section.slice(1) }}
                    {{ t("global.description") }}
                  </label>
                  <div
                    :id="`${section}-${slot.language.name}-description`"
                    :ref="setEditorsRefs"
                    :options="options"
                    :name="`${section}-description`"
                    :data-language-id="slot.language.id"
                    data-key="description"></div>

                  <!-- <quill-editor
                    :id="`${section}-${slot.language.name}-description`"
                    :ref="setEditorsRefs"
                    :options="options"
                    :name="`${section}-description`"
                    :data-language-id="slot.language.id"
                    class="min-h-200px mb-2"></quill-editor> -->
                  <div class="text-muted fs-7">
                    {{
                      t(
                        `global.set-a-description-to-${
                          section.charAt(0).toLowerCase() + section.slice(1)
                        }-for-better-visibility`
                      )
                    }}
                  </div>
                </div>
              </div>
            </languages-tabs>
            <!-- <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2 class="required">
                    {{ section.charAt(0).toUpperCase() + section.slice(1) }}
                    {{ t("global.name") }}
                  </h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <div class="fv-row">
                  <el-form-item prop="name">
                    <el-input
                      :id="`${section}-name`"
                      v-model="data.name"
                      type="text"
                      :name="`${section}-name`"
                      :placeholder="
                        t(`global.${section.charAt(0).toLowerCase() + section.slice(1)}-name`)
                      " />
                  </el-form-item>
                </div>
              </div>
            </div> -->
            <div class="d-flex justify-content-end">
              <router-link
                id="cancel"
                :to="`/dashboard/sections/${section}`"
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
                <span class="indicator-label">
                  {{ t("global.save-changes") }}
                </span>
                <span class="indicator-progress">
                  {{ t("global.please-wait") }}
                  ...
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
// import {QuillEditor} from "@vueup/vue-quill"
import {ElMessage as Message} from "element-plus"
import {defineComponent, onBeforeMount, onMounted, ref, watch, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import {createEditorsData, createLanguages} from "../../../core/helpers/creators"
import axiosClient from "../../../plugins/axios"
import ClassicEditor from "../../../ckeditor"
import {Plus, Delete} from "@element-plus/icons-vue"
// import ThumbnailUploader from "@/components/admin/ThumbnailUploader.vue"

export default defineComponent({
  name: "add-sections",
  components: {
    Toolbar,
    // Thumbnail,
    Status,
    LanguagesTabs,
    Plus,
    Delete
    // ThumbnailUploader
  },
  setup() {
    // Get necessary data from router/route/store
    const {t} = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const {languages} = store.state
    const {section, id} = route.params
    const API_PATH = ref(import.meta.env.VITE_APP_API_BASE_URL)
    const token = computed(() => store.state.user.token)

    // Define form necessary data
    const loading = ref(null)
    const form = ref(null)
    const rules = ref({
      name: [
        {
          required: true,
          trigger: "change",
          message: t(`global.${section}-name-required-unique`)
        }
      ],
      type: [
        {
          required: true,
          trigger: "change",
          message: t(`global.${section}-status-required`)
        }
      ],
      status: [
        {
          required: true,
          trigger: "change",
          message: t(`global.${section}-status-required`)
        }
      ],
      thumbnail: [
        // New validation rule for thumbnail
        {
          required: false,
          trigger: "change",
          message: t(`global.thumbnail-image-required`)
        }
      ],
      title: {},
      summary: {}
    })

    languages.forEach((languageItem) => {
      // eslint-disable-next-line
      const {id, name} = languageItem
      rules.value.title[id] = [
        {
          required: true,
          trigger: "change",
          message: t(
            `global.${section}-title-in-${name.charAt(0).toUpperCase() + name.slice(1)}-is-required`
          )
        }
      ]

      rules.value.summary[id] = [
        {
          required: true,
          trigger: "change",
          message: t(
            `global.${section}-summary-in-${
              name.charAt(0).toUpperCase() + name.slice(1)
            }-is-required`
          )
        }
      ]
    })

    // Define necessary data for this specific component
    const button = ref(null)
    const status = ref({status: 0, date: Date.now()})
    const parents = ref([])
    const editors = []
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)

    // Define data schema to be submit it
    const data = ref({
      name: null,
      thumbnail: {},
      title: {},
      summary: {},
      description: {},
      status: status.value.status,
      date: status.value.date,
      parent: null,
      tags: [],
      types: ["general", "tab"],
      type: ""
    })

    // Watch status (status/data) changes and update them in data schema
    watch(
      () => [status.value.status, status.value.date],
      ([statusValue, dateValue]) => {
        data.value.status = statusValue
        data.value.date = dateValue || Date.now()
      }
    )
    // Validate thumbnail before uploading it (validate type and size)
    const handleBeforeUpload = (file) => {
      // if (file.type !== "image/jpeg" || file.type !== "image/png") {
      //   Message.error(t("global.avatar-picture-must-be-jpg-format"))
      //   return false
      // }

      if (file.size / 1024 / 1024 > 2) {
        Message.error(t("global.avatar-picture-must-not-exceed-2mb"))
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
        text: t("global.thumbnail-added-successfully"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-primary"}
      })
    }

    // Get value from editors and add it to editors array
    // const setEditorsRefs = function setEditorsRefs(editor) {
    //   if (editor && editor.getEditor()) {
    //     const editorId = editor.getEditor().getAttribute("data-language-id")
    //     editors.value.push({id: editorId, editor})
    //   }
    // }

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

    const removeThumbnail = function removeThumbnail(id) {
      data.value.thumbnail.id = null
      data.value.thumbnail.url = null
      axiosClient.delete(`/medias/delete/${id}`).then(() => {
        Swal.fire({
          icon: "success",
          text: t("global.thumbnail-removed-successfully"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-primary"}
        })
      })
    }

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disable = true
      button.value.ariaDisabled = true

      form.value.validate((valid, errors) => {
        if (valid) {
          // Refactor THIS
          const {parent} = data.value
          const date = new Date(data.value.date).toISOString().split("T")[0]

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
            {key: "summary", values: data.value.summary},
            {key: "description", values: data.value.description}
          )

          axiosClient
            .post(id ? `/${section}/update/${id}` : `/${section}/create`, {
              image: data.value.thumbnail.id ?? null,
              name: data.value.name,
              status: data.value.status,
              publish: data.value.status === 0 ? 1 : 0,
              [["publish", "date"].join("_")]: date,
              [["parent", "id"].join("_")]: parent || 0,
              langs: languagesArray,
              tags: data.value.tags,
              type: section === "categories" ? data.value.type : null
            })
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.section-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              router.push({name: "section-list"})
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

          // Swal.fire({
          //   icon: "error",
          //   text: t("global.errors-detected"),
          //   confirmButtonText: t("global.got-it"),
          //   buttonsStyling: false,
          //   customClass: {confirmButton: "btn btn-danger"}
          // })

          // button.value.removeAttribute("data-kt-indicator")
          // button.value.disabled = false
          // button.value.ariaDisabled = false
        }
      })
    }

    onBeforeMount(() => {
      if (id) {
        loading.value = true
      }
    })

    onMounted(() => {
      let sectionsPromise = null
      let sectionPromise = null
      let mediaPromise = null
      loading.value = true

      sectionsPromise = axiosClient
        .get(`/${[section, "?", ["parent", "id"].join("_"), "=", 0].join("")}`)
        .then((response) => {
          parents.value = response.data.result.data.filter((element) => {
            return Number(element.id) !== Number(id)
          })
        })

      Promise.resolve(sectionsPromise).then(() => {
        // When there is an ID get section data and add it to data object
        if (id) {
          sectionPromise = axiosClient.get(`/${section}/show/${id}`).then((responseInner) => {
            const {result} = responseInner.data
            data.value.name = result.name
            data.value.type = result.type
            status.value.status = result.status
            status.value.date = result[["publish", "date"].join("_")]
              ? new Date(`${result[["publish", "date"].join("_")]}T00:00:00Z`)
              : Date.now()

            // Get image data and add it to data object
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

            // Loop over languages data and add it to data object
            languages.forEach((language) => {
              result.langs.forEach((lang) => {
                if (Number(language.id) === Number(lang[["language", "id"].join("_")])) {
                  data.value.title[language.id] = lang.title
                  data.value.summary[language.id] = lang.summary
                  // editors.value.forEach((editor) => {
                  //   if (Number(language.id) === Number(editor.id))
                  //     editor.editor.setHTML(lang.description)
                  // })
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

            // Loop over parents data and add it to data object
            parents.value.forEach((parentItem) => {
              if (parentItem.id === result[["parent", "id"].join("_")])
                data.value.parent = parentItem.id
            })

            form.value.clearValidate()
            Promise.all([sectionPromise, mediaPromise]).then(() => {
              loading.value = false
            })
          })
        } else {
          loading.value = false
        }
      })
    })

    return {
      section,
      loading,
      form,
      rules,
      button,
      status,
      data,
      parents,
      API_PATH,
      SERVER_PATH,
      setEditorsRefs,
      handleOnSuccess,
      handleBeforeUpload,
      submit,
      t,
      token,
      removeThumbnail
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
