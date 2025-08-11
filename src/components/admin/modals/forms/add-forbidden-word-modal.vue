<template>
  <modal-layout
    id="kt_modal_add_forbidden_word"
    ref="addForbiddenWordModal"
    header-id="kt_modal_add_word_header"
    close-id="kt_modal_add_word_close"
    :title="idCurrent ? 'Edit Word' : 'Add Word'"
    form-id="kt_modal_add_word_form"
    scroll-id="kt_modal_add_word_scroll"
    :form-model="words"
    :form-rules="rules"
    @form-submit="submit">
    <div class="fv-row mb-7">
      <label for="add-word-textarea" class="fs-6 fw-semibold mb-2"> {{ t("global.word") }}</label>
      <el-form-item prop="word">
        <el-input v-model="words.word" type="text" :placeholder="t('global.your-word')" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="add-status-checkbox" class="fs-6 fw-semibold mb-2">
        {{ t("global.status") }}</label
      >
      <el-form-item prop="status">
        <el-checkbox v-model="words.status"> {{ t("global.enable") }}</el-checkbox>
      </el-form-item>
    </div>
  </modal-layout>
</template>

<script>
import {hideModal, removeModalBackdrop} from "@/core/helpers/dom"
import {defineComponent, onBeforeUpdate, ref, toRef, watch} from "vue"
import {useI18n} from "vue-i18n"
import axiosClient from "../../../../plugins/axios"
import ModalLayout from "../../../layouts/admin/modal.vue"

export default defineComponent({
  components: {ModalLayout},
  props: {
    idCurrent: {type: String, required: false, default: null},
    wordCurrent: {type: Object, require: false, default: null}
  },
  emits: ["after-on-submit"],
  setup(props, {emit, expose}) {
    const {t} = useI18n()
    const addForbiddenWordModal = ref(null)
    const words = ref({word: "", status: false})
    const rules = ref({
      word: [{required: true, trigger: "change", message: t("global.word-required")}],
      status: [{required: true, trigger: "change", message: t("global.status-required")}]
    })

    const submit = () => {
      if (!addForbiddenWordModal.value.form) return

      addForbiddenWordModal.value.form.validate((valid, errors) => {
        if (valid) {
          if (props.idCurrent) {
            // It's an update, so make a PUT request
            axiosClient
              .put(`/forbidden-words/${props.idCurrent}`, words.value)
              .then((response) => {
                Swal.fire({
                  icon: "success",
                  text: t("global.forbidden-word-updated-successfully"),
                  buttonsStyling: false,
                  customClass: {confirmButton: "btn btn-primary"}
                })
                hideModal(addForbiddenWordModal.value.modal)
                removeModalBackdrop()
                emit("after-on-submit")
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  text: t("global.errors-detected"),
                  confirmButtonText: t("global.got-it"),
                  buttonsStyling: false,
                  customClass: {confirmButton: "btn btn-danger"}
                })
              })
          } else {
            // It's an add, so make a POST request
            axiosClient
              .post("/forbidden-words", words.value)
              .then((response) => {
                Swal.fire({
                  icon: "success",
                  text: t("global.forbidden-word-created-successfully"),
                  confirmButtonText: t("global.thank-you"),
                  buttonsStyling: false,
                  customClass: {confirmButton: "btn btn-primary"}
                })
                hideModal(addForbiddenWordModal.value.modal)
                removeModalBackdrop()
                emit("after-on-submit")
                // emit("form-submit")
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  text: t("global.errors-detected"),
                  confirmButtonText: t("global.got-it"),
                  buttonsStyling: false,
                  customClass: {confirmButton: "btn btn-danger"}
                })
              })
          }
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

    const clearForm = () => {
      words.value = {word: "", status: false}
    }

    onBeforeUpdate(() => {
      addForbiddenWordModal.value.form.resetFields()
    })

    const modelReset = function modelReset() {
      Object.entries(conference.value).forEach(([key]) => {
        conference.value[key] = null
      })
    }

    // Watch for changes in the idCurrent prop and update the form accordingly
    watch(
      toRef(props, "idCurrent"),
      (newId, oldId) => {
        if (newId !== oldId) {
          if (newId) {
            // Fetch the current word data and update the form
            axiosClient.get(`/forbidden-words/${newId}`).then((response) => {
              words.value.word = response.data.word
              words.value.status = response.data.status === 1
            })
          } else {
            // Clear the form if idCurrent is null (add mode)
            clearForm()
          }
        }
      },
      {immediate: true}
    ) // Add the immediate option

    expose({addForbiddenWordModal})

    return {
      addForbiddenWordModal,
      words,
      rules,
      submit,
      modelReset,
      t
    }
  }
})
</script>
