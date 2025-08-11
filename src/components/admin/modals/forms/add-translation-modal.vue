<!-- Done Reviewing: 29/01/2023 -->
<template>
  <modal-layout
    id="kt_modal_add_translation"
    ref="addTranslationModal"
    header-id="kt_modal_add_translation_header"
    close-id="kt_modal_add_translation_close"
    :title="id ? t('global.edit-translation') : t('global.add-translation')"
    form-id="kt_modal_add_translation_form"
    :form-model="translation"
    :form-model-reset="modelReset"
    :form-rules="rules"
    scroll-id="kt_modal_add_translation_scroll"
    @form-submit="submit">
    <div class="fv-row mb-7">
      <label for="translation-title" class="required fw-semibold fs-6 mb-2">{{
        t("global.title")
      }}</label>
      <el-form-item prop="title" class="mb-0">
        <el-input
          id="translation-title"
          v-model="translation.title"
          type="text"
          name="translation-title"
          placeholder="Title" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="translation-label-name" class="required fw-semibold fs-6 mb-2">Label</label>
      <el-form-item prop="label" class="mb-0">
        <el-select
          id="translation-label-name"
          v-model="translation.label"
          name="translation-label-name"
          placeholder="Enter translation's label"
          filterable
          remote
          remote-show-suffix
          :remote-method="remoteMethod"
          :reserve-keyword="true"
          :loading="loading">
          <el-option
            v-for="label in options"
            :key="label.id"
            :value="label.id"
            :label="label.name" />
        </el-select>
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="translation-language-name" class="required fw-semibold fs-6 mb-2">
        {{ t("global.language") }}
      </label>
      <el-form-item prop="language" class="mb-0">
        <el-select
          id="translation-language-name"
          v-model="translation.language"
          name="translation-language-name"
          placeholder="Enter translation's language">
          <el-option
            v-for="language in languages"
            :key="language.id"
            :value="language.id"
            :label="language.name" />
        </el-select>
      </el-form-item>
    </div>
  </modal-layout>
</template>

<script>
import {hideModal, removeModalBackdrop} from "@/core/helpers/dom"
import {defineComponent, onBeforeMount, ref, toRef} from "vue"
import axiosClient from "../../../../plugins/axios"
import ModalLayout from "../../../layouts/admin/modal.vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "add-translation-modal",
  components: {ModalLayout},
  props: {
    idCurrent: {type: Number, required: false, default: null},
    translationCurrent: {type: Object, require: false, default: null}
  },
  emits: ["after-on-submit"],

  setup(props, {emit, expose}) {
    const addTranslationModal = ref(null)
    const id = toRef(props, "idCurrent")
    const translation = toRef(props, "translationCurrent")
    const {t} = useI18n()

    const rules = ref({
      title: [{required: true, trigger: "change", message: "Title is required"}],
      label: [{required: true, trigger: "change", message: "Label Name is required"}],
      language: [{required: true, trigger: "change", message: "Language Name is required"}]
    })

    const labels = ref()
    const languages = ref()
    const options = ref([])

    const submit = function submit() {
      if (!addTranslationModal.value.form) return
      addTranslationModal.value.form.validate((valid, errors) => {
        if (valid) {
          addTranslationModal.value.loading = true
          axiosClient[id.value ? "put" : "post"](
            id.value ? `/translations/update/${id.value}` : "/translations/create",
            {
              title: translation.value.title,
              [["label", "id"].join("")]: translation.value.label,
              [["lang", "id"].join("")]: translation.value.language
            }
          )
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.translation-added-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })

              hideModal(addTranslationModal.value.modal)
              removeModalBackdrop()
              emit("after-on-submit")
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
              addTranslationModal.value.loading = false
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

    const remoteMethod = (query) => {
      if (query) {
        addTranslationModal.value.loading = true
        axiosClient.get(["/labels/options", "?", "q", "=", query].join("")).then((response) => {
          options.value = response.data
          addTranslationModal.value.loading = false
        })
      } else options.value = []
    }

    const getLabels = function getLabels() {
      axiosClient.get("/labels").then((response) => {
        labels.value = response.data.result.data
      })
    }

    const getLanguages = function getLanguages() {
      axiosClient.get("/languages").then((response) => {
        languages.value = response.data.result.data
      })
    }

    const modelReset = function modelReset() {
      translation.value.title = null
      translation.value.label = null
      translation.value.language = null
    }

    onBeforeMount(() => {
      labels.value = []
      getLabels()
      languages.value = []
      getLanguages()
    })

    expose({addTranslationModal})
    return {
      addTranslationModal,
      translation,
      rules,
      labels,
      languages,
      options,
      modelReset,
      remoteMethod,
      submit,
      t,
      id
    }
  }
})
</script>
