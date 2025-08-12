<!-- DONE REVIEWING: 23/06/2023 -->
<template>
  <modal-layout
    id="kt_modal_add_note"
    ref="addNoteModal"
    header-id="kt_modal_add_note_header"
    close-id="kt_modal_add_note_close"
    title="Add Note"
    form-id="kt_modal_add_note_form"
    :form-model="conference"
    :form-model-reset="modelReset"
    :form-rules="rules"
    scroll-id="kt_modal_add_note_scroll"
    @form-submit="submit">
    <div class="fv-row mb-7">
      <label for="add-note-textarea" class="fs-6 fw-semibold mb-2">{{ t("global.note") }}</label>
      <el-form-item prop="note">
        <el-input
          id="add-note-textarea"
          v-model="conference.note"
          type="textarea"
          :cols="60"
          :rows="10"
          :placeholder="t('global.your-notes')" />
      </el-form-item>
    </div>
  </modal-layout>
</template>

<script>
import {hideModal, removeModalBackdrop} from "@/core/helpers/dom"
import {defineComponent, onBeforeUpdate, ref, toRef} from "vue"
import {useI18n} from "vue-i18n"
import axiosClient from "../../../../plugins/axios"
import ModalLayout from "../../../layouts/admin/modal.vue"

export default defineComponent({
  name: "upload-file-modal",
  components: {ModalLayout},
  props: {
    idCurrent: {type: String, required: false, default: null},
    conferenceCurrent: {type: Object, require: false, default: null}
  },
  emits: ["after-on-submit"],
  setup(props, {emit, expose}) {
    const {t} = useI18n()
    const addNoteModal = ref(null)
    const id = toRef(props, "idCurrent")
    const conference = toRef(props, "conferenceCurrent")
    const rules = ref({note: [{required: true, trigger: "change", message: "Note is required"}]})

    const submit = function submit() {
      if (!addNoteModal.value.form) return
      addNoteModal.value.form.validate((valid, errors) => {
        if (valid) {
          const formData = new FormData()
          formData.append("note", conference.value.note)
          addNoteModal.value.loading = true

          axiosClient
            .post(`/conferences/add-note/${id.value}`, formData)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.note-added-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })

              hideModal(addNoteModal.value.modal)
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
              addNoteModal.value.loading = false
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
      Object.entries(conference.value).forEach(([key]) => {
        conference.value[key] = null
      })
    }

    onBeforeUpdate(() => {
      addNoteModal.value.form.resetFields()
    })

    expose({addNoteModal})
    return {
      addNoteModal,
      conference,
      rules,
      modelReset,
      submit,
      t
    }
  }
})
</script>
