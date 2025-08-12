<!-- DONE REVIEWING: 23/06/2023 -->
<template>
  <modal-layout
    id="kt_modal_upload_file"
    ref="uploadFileModal"
    header-id="kt_modal_upload_file_header"
    close-id="kt_modal_upload_file_close"
    :title="t('global.upload-file')"
    form-id="kt_modal_upload_file_form"
    :form-model="conference"
    :form-model-reset="modelReset"
    :form-rules="rules"
    scroll-id="kt_modal_upload_file_scroll"
    @form-submit="submit">
    <div class="fv-row mb-8">
      <label for="upload-file-attachment" class="fs-6 fw-semibold mb-2">
        {{ t("global.attachments") }}
      </label>
      <input
        id="upload-file-attachment"
        type="file"
        class="form-control form-control-solid"
        @change="handleUploadFileInputChange($event)" />
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
    const uploadFileModal = ref(null)
    const uploadFileSelected = ref(null)
    const id = toRef(props, "idCurrent")
    const conference = toRef(props, "conferenceCurrent")
    const rules = ref({file: null})

    const submit = function submit() {
      if (!uploadFileModal.value.form) return
      uploadFileModal.value.form.validate(() => {
        const formData = new FormData()
        formData.append("file", uploadFileSelected.value)

        uploadFileModal.value.loading = true
        axiosClient
          .post(`/conferences/upload-file/${id.value}`, formData)
          .then(() => {
            Swal.fire({
              icon: "success",
              text: t("global.file-uploaded-successfully"),
              confirmButtonText: t("global.thank-you"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-primary"}
            })

            hideModal(uploadFileModal.value.modal)
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
            uploadFileModal.value.loading = false
          })
      })
    }

    const handleUploadFileInputChange = function handleUploadFileInputChange(e) {
      // eslint-disable-next-line
      uploadFileSelected.value = e.target.files[0]
      const reader = new FileReader()
      reader.readAsBinaryString(uploadFileSelected.value)
    }

    const modelReset = function modelReset() {
      Object.entries(conference.value).forEach(([key]) => {
        conference.value[key] = null
      })
    }

    onBeforeUpdate(() => {
      uploadFileModal.value.form.resetFields()
    })

    expose({uploadFileModal})
    return {
      uploadFileModal,
      uploadFileSelected,
      conference,
      rules,
      handleUploadFileInputChange,
      modelReset,
      submit,
      t
    }
  }
})
</script>
