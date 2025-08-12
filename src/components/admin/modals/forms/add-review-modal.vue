<!-- DONE REVIEWING: 23/06/2023 -->
<template>
  <modal-layout
    id="kt_modal_add_review"
    ref="addReviewModal"
    header-id="kt_modal_add_review_header"
    close-id="kt_modal_add_review_close"
    title="Add Review"
    form-id="kt_modal_add_review_form"
    :form-model="conference"
    :form-model-reset="modelReset"
    :form-rules="rules"
    scroll-id="kt_modal_add_review_scroll"
    @form-submit="submit">
    <div class="fv-row mb-7">
      <label for="add-review-textarea" class="fs-6 fw-semibold mb-2">
        {{ t("global.stars") }}
      </label>
      <el-form-item prop="stars">
        <el-radio-group v-model="conference.stars">
          <el-radio :label="5" size="large">{{ t("global.5") }}</el-radio>
          <el-radio :label="4" size="large">{{ t("global.4") }}</el-radio>
          <el-radio :label="3" size="large">{{ t("global.3") }}</el-radio>
          <el-radio :label="2" size="large">{{ t("global.2") }}</el-radio>
          <el-radio :label="1" size="large">{{ t("global.1") }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="add-review-textarea" class="fs-6 fw-semibold mb-2">
        {{ t("global.comment") }}
      </label>
      <el-form-item prop="comment">
        <el-input
          id="add-review-textarea"
          v-model="conference.comment"
          type="textarea"
          :cols="60"
          :rows="10"
          :placeholder="t('global.your-review')" />
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
    const addReviewModal = ref(null)
    const id = toRef(props, "idCurrent")
    const conference = toRef(props, "conferenceCurrent")
    const rules = ref({
      stars: [
        {
          required: true,
          trigger: "change",
          message: "Stars is required"
        }
      ],
      comment: [
        {
          required: true,
          trigger: "change",
          message: t("global.comment-required")
        }
      ]
    })

    const submit = function submit() {
      if (!addReviewModal.value.form) return
      addReviewModal.value.form.validate((valid, errors) => {
        if (valid) {
          const formData = new FormData()
          formData.append("ref_id", id.value)
          formData.append("type", "conference")
          formData.append("stars", conference.value.stars)
          formData.append("comment", conference.value.comment)

          addReviewModal.value.loading = true
          axiosClient
            .post(`/front/reviews/create`, formData)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.constant-added-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })

              hideModal(addReviewModal.value.modal)
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
              addReviewModal.value.loading = false
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
      addReviewModal.value.form.resetFields()
    })

    expose({addReviewModal})
    return {
      addReviewModal,
      conference,
      rules,
      modelReset,
      submit,
      t
    }
  }
})
</script>
