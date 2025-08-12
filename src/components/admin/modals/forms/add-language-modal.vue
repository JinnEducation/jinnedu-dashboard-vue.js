<!-- Done Reviewing: 30/01/2023 -->
<template>
  <modal-layout
    id="kt_modal_add_language"
    ref="addLanguageModal"
    header-id="kt_modal_add_language_header"
    close-id="kt_modal_add_language_close"
    title="Add Language"
    form-id="kt_modal_add_language_form"
    :form-model="language"
    :form-model-reset="modelReset"
    :form-rules="rules"
    scroll-id="kt_modal_add_language_scroll"
    @form-submit="submit">
    <div class="fv-row mb-7">
      <label for="language-name" class="required fw-semibold fs-6 mb-2">{{
        t("global.name")
      }}</label>
      <el-form-item prop="name" class="mb-0">
        <el-input
          id="language-name"
          v-model="language.name"
          type="text"
          name="language-name"
          placeholder="English" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="language-shortname" class="required fw-semibold fs-6 mb-2">
        {{ t("global.short-name") }}
      </label>
      <el-form-item prop="shortname" class="mb-0">
        <el-input
          id="language-shortname"
          v-model="language.shortname"
          type="text"
          name="language-shortname"
          placeholder="EN" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="language-direction" class="required fw-semibold fs-6 mb-2">{{
        t("global.direction")
      }}</label>
      <el-form-item prop="direction" class="mb-0">
        <el-input
          id="language-direction"
          v-model="language.direction"
          type="text"
          name="language-direction"
          placeholder="LTR" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="language-direction-word" class="required fw-semibold fs-6 mb-2">
        {{ t("global.direction-word") }}
      </label>
      <el-form-item prop="dirword" class="mb-0">
        <el-input
          id="language-direction-word"
          v-model="language.dirword"
          type="text"
          name="language-direction-word"
          placeholder="Left" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="language-icon" class="required fw-semibold fs-6 mb-2">
        {{ t("global.icon") }}
      </label>
      <el-form-item prop="icon" class="mb-0">
        <el-input
          id="language-icon"
          v-model="language.icon"
          type="text"
          name="language-icon"
          placeholder="Icon URL" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="language-status" class="required fw-semibold fs-6 mb-2">
        {{ t("global.active") }}
      </label>
      <el-form-item prop="status" class="mb-0">
        <el-switch
          id="language-status"
          v-model="language.status"
          name="language-status"
          class="ml-2"
          style="
            --el-switch-on-color: var(--bs-primary);
            --el-switch-off-color: var(--bs-gray-200);
          " />
      </el-form-item>
    </div>
  </modal-layout>
</template>

<script>
import {hideModal, removeModalBackdrop} from "@/core/helpers/dom"
import {defineComponent, ref, toRef, watch} from "vue"
import {useI18n} from "vue-i18n"
import axiosClient from "../../../../plugins/axios"
import ModalLayout from "../../../layouts/admin/modal.vue"

export default defineComponent({
  name: "add-language-modal",
  components: {ModalLayout},
  props: {
    idCurrent: {type: Number, required: false, default: null},
    languageCurrent: {type: Object, require: false, default: null}
  },
  emits: ["after-on-submit"],
  setup(props, {emit, expose}) {
    const {t} = useI18n()
    const addLanguageModal = ref(null)
    const id = toRef(props, "idCurrent")
    const language = toRef(props, "languageCurrent")

    const rules = ref({
      name: [{required: true, trigger: "change", message: t("global.name-required")}],
      shortname: [{required: true, trigger: "change", message: t("global.short-name-required")}],
      direction: [{required: true, trigger: "change", message: t("global.direction-required")}],
      dirword: [{required: true, trigger: "change", message: t("global.direction-required")}],
      icon: [{required: true, trigger: "change", message: t("global.icon-required")}],
      status: [{required: false, trigger: "change"}]
    })

    watch(
      () => language.value.status,
      (value) => {
        if (value === 1) language.value.status = true
        else if (value === 0) language.value.status = false
      }
    )

    const submit = function submit() {
      if (!addLanguageModal.value.form) return
      addLanguageModal.value.form.validate((valid, errors) => {
        if (valid) {
          addLanguageModal.value.loading = true
          axiosClient[id.value ? "put" : "post"](
            id.value ? `/languages/update/${id.value}` : "/languages/create",
            {
              name: language.value.name.toLowerCase(),
              shortname: language.value.shortname.toLowerCase(),
              direction: language.value.direction.toLowerCase(),
              dirword: language.value.dirword.toLowerCase(),
              icon: language.value.icon,
              status: language.value.status ? Number("1") : Number("0")
            }
          )
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.language-added-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })

              hideModal(addLanguageModal.value.modal)
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
              addLanguageModal.value.loading = false
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
      Object.entries(language.value).forEach(([key]) => {
        language.value[key] = null
      })
    }

    expose({addLanguageModal})
    return {
      addLanguageModal,
      language,
      rules,
      modelReset,
      submit,
      t
    }
  }
})
</script>
