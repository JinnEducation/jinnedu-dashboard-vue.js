<!-- DONE REVIEWING: 23/06/2023 -->
<template>
  <modal-layout
    id="kt_modal_upload_file"
    ref="addComplaintModal"
    header-id="kt_modal_upload_file_header"
    close-id="kt_modal_upload_file_close"
    :title="t('global.add-complaint')"
    form-id="kt_modal_upload_file_form"
    :form-model="conference"
    :form-model-reset="modelReset"
    :form-rules="rules"
    scroll-id="kt_modal_upload_file_scroll"
    @form-submit="submit">
    <div class="d-flex flex-column mb-8 fv-row fv-plugins-icon-container">
      <label for="add-complaint-input" class="d-flex align-items-center fs-6 fw-semibold mb-2">
        <span class="required"> {{ t("global.subject") }}</span>
      </label>
      <input
        id="add-complaint-input"
        v-model="conference.subject"
        type="text"
        :placeholder="t('global.enter-your-complaint-subject')"
        class="form-control form-control-solid" />
      <div class="fv-plugins-message-container invalid-feedback"></div>
    </div>
    <div class="d-flex flex-column mb-8 fv-row fv-plugins-icon-container">
      <label for="add-complaint-textarea" class="fs-6 fw-semibold mb-2">
        {{ t("global.description") }}</label
      >
      <textarea
        id="add-complaint-textarea"
        v-model="conference.note"
        :placeholder="t('global.enter-your-complaint-description')"
        rows="4"
        class="form-control form-control-solid">
      </textarea>
      <div class="fv-plugins-message-container invalid-feedback"></div>
    </div>
    <div class="fv-row mb-8">
      <label for="add-complaint-attachments" class="fs-6 fw-semibold mb-2">
        {{ t("global.attachments") }}</label
      >
      <input
        id="add-complaint-attachments"
        type="file"
        class="form-control form-control-solid"
        @change="handleFileInputChange($event)" />
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
  name: "add-complaint-modal",
  components: {ModalLayout},
  props: {
    idCurrent: {type: String, required: false, default: null},
    conferenceName: {type: String, require: false, default: null},
    conferenceCurrent: {type: Object, require: false, default: null}
  },
  emits: ["after-on-submit"],
  setup(props, {emit, expose}) {
    const {t} = useI18n()
    const addComplaintModal = ref(null)
    const addComplaintFileSelected = ref("")
    const id = toRef(props, "idCurrent")
    const conference = toRef(props, "conferenceCurrent")
    const rules = ref({
      note: [{required: true, trigger: "change", message: t("global.note-required")}],
      subject: [{required: true, trigger: "change", message: t("global.subject-required")}]
    })

    const handleFileInputChange = function handleFileInputChange(e) {
      // eslint-disable-next-line
      addComplaintFileSelected.value = e.target.files[0]
      const reader = new FileReader()
      reader.readAsBinaryString(addComplaintFileSelected.value)
    }

    const submit = function submit() {
      if (!addComplaintModal.value.form) return
      addComplaintModal.value.form.validate((valid, errors) => {
        if (valid) {
          const formData = new FormData()
          formData.append("subject", conference.value.subject)
          formData.append("note", conference.value.note)
          formData.append("file", addComplaintFileSelected.value)

          addComplaintModal.value.loading = true
          axiosClient
            .post(`/conferences/add-complaint/${id.value}`, formData)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.complaint-added-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })

              hideModal(addComplaintModal.value.modal)
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
              addComplaintModal.value.loading = false
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
      addComplaintModal.value.form.resetFields()
    })

    expose({addComplaintModal})
    return {
      addComplaintModal,
      conference,
      rules,
      addComplaintFileSelected,
      handleFileInputChange,
      modelReset,
      submit,
      t
    }
  }
})
</script>
