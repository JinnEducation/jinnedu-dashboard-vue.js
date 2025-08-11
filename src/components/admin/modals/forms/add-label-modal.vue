<!-- Done Reviewing: 30/01/2023 -->
<template>
  <modal-layout
    id="kt_modal_add_label"
    ref="addLabelModal"
    header-id="kt_modal_add_label_header"
    close-id="kt_modal_add_label_close"
    title="Add Label"
    form-id="kt_modal_add_label_form"
    :form-model="label"
    :form-model-reset="modelReset"
    :form-rules="rules"
    scroll-id="kt_modal_add_label_scroll"
    @form-submit="submit">
    <div class="fv-row mb-7">
      <label for="label-name" class="required fw-semibold fs-6 mb-2">{{ t("global.name") }}</label>
      <el-form-item prop="name" class="mb-0">
        <el-input
          id="label-name"
          v-model="label.name"
          type="text"
          name="label-name"
          placeholder="Name" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="label-file" class="required fw-semibold fs-6 mb-2">{{ t("global.file") }}</label>
      <el-form-item prop="file" class="mb-0">
        <el-input
          id="label-file"
          v-model="label.file"
          type="text"
          name="label-file"
          placeholder="File" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="label-title" class="required fw-semibold fs-6 mb-2">{{
        t("global.title")
      }}</label>
      <el-form-item prop="title" class="mb-0">
        <el-input
          id="label-title"
          v-model="label.title"
          type="text"
          name="label-title"
          placeholder="Title" />
      </el-form-item>
    </div>
    <div v-for="language in languages" :key="language.name" class="fv-row mb-7">
      <label :for="`language-${language.id}`" class="required fw-semibold fs-6 mb-2">
        {{ language.name.charAt(0).toUpperCase() + language.name.slice(1) }}
      </label>
      <el-form-item :prop="language.name" class="mb-0">
        <el-input
          :id="`language-${language.id}`"
          v-model="label[language.name]"
          type="text"
          :name="`language-${language.id}`"
          :placeholder="
            t(
              `global.${language.name.charAt(0).toLowerCase() + language.name.slice(1)}-translation`
            )
          " />
      </el-form-item>
    </div>
  </modal-layout>
</template>

<script>
import {defineComponent, onBeforeUpdate, onUpdated, ref, toRef} from "vue"
import {useI18n} from "vue-i18n"
import {hideModal, removeModalBackdrop} from "../../../../core/helpers/dom"
import axiosClient from "../../../../plugins/axios"
import ModalLayout from "../../../layouts/admin/modal.vue"

export default defineComponent({
  name: "add-label-modal",
  components: {ModalLayout},
  props: {
    idCurrent: {type: Number, required: false, default: null},
    labelCurrent: {type: Object, require: false, default: null}
  },
  emits: ["after-on-submit"],
  setup(props, {emit, expose}) {
    const {t} = useI18n()
    const addLabelModal = ref(null)
    const id = toRef(props, "idCurrent")
    const label = toRef(props, "labelCurrent")

    const rules = ref({
      name: [{required: true, trigger: "change", message: t("global.name-required")}],
      file: [{required: true, trigger: "change", message: t("global.file-required")}],
      title: [{required: true, trigger: "change", message: t("global.title-required")}]
    })

    const languages = ref([])
    onUpdated(() => {
      axiosClient.get("/locales/langs").then((response) => {
        languages.value = response.data.data
        languages.value.forEach((language) => {
          rules.value[language.name] = [
            {
              required: true,
              trigger: "change",
              message: `global.${language.name} is required`
            }
          ]

          if (id.value) {
            if (label.value.trans) {
              label.value.trans.forEach((translation) => {
                if (translation[["lang", "id"].join("")] === language.id)
                  label.value[language.name] = translation.title
              })
            }
          }
        })
      })
    })

    onBeforeUpdate(() => {
      addLabelModal.value.form.resetFields()
    })

    const submit = function submit() {
      if (!addLabelModal.value.form) return
      addLabelModal.value.form.validate((valid, errors) => {
        if (valid) {
          const createTranslations = function createTranslations() {
            const translations = []
            languages.value.forEach((language) => {
              if (label.value[language.name]) {
                translations.push({
                  [["lang", "id"].join("")]: language.id,
                  title: label.value[language.name]
                })
              }
            })

            return translations
          }

          addLabelModal.value.loading = true
          axiosClient[id.value ? "put" : "post"](
            id.value ? `/labels/update/${id.value}` : "/labels/create",
            {
              name: label.value.name.toLowerCase(),
              file: label.value.file.toLowerCase(),
              title: label.value.title,
              trans: createTranslations()
            }
          )
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.label-added-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })

              hideModal(addLabelModal.value.modal)
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
              addLabelModal.value.loading = false
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

    const modelReset = function modelReset() {
      Object.entries(label.value).forEach(([key]) => {
        label.value[key] = null
      })
    }

    expose({addLabelModal})
    return {
      addLabelModal,
      label,
      rules,
      languages,
      modelReset,
      submit,
      t
    }
  }
})
</script>
