<!-- DONE REVIEWING: NEW -->
<template>
  <modal-layout
    id="kt_modal_add_user"
    ref="addUserModal"
    header-id="kt_modal_add_user_header"
    close-id="kt_modal_add_user_close"
    :title="id ? t('global.edit-user') : t('global.add-user')"
    form-id="kt_modal_add_user_form"
    :form-model="user"
    :form-model-reset="modelReset"
    :form-rules="rules"
    scroll-id="kt_modal_add_user_scroll"
    @form-submit="submit">
    <div class="fv-row mb-7">
      <label for="user-avatar" class="d-block fw-semibold fs-6 mb-5">{{
        t("global.avatar")
      }}</label>
      <div class="d-flex justify-content-center">
        <div
          data-kt-image-input="true"
          class="image-input image-input-outline image-input-placeholder">
          <div
            id="add-user-modal-avatar"
            class="image-input-wrapper w-125px h-125px"
            style="background: var()"></div>
          <label
            data-bs-toggle="tooltip"
            data-kt-image-input-action="change"
            title="Change Avatar"
            class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow">
            <i class="bi bi-pencil-fill fs-7"></i>
            <input
              id="user-avatar"
              type="file"
              name="user-avatar"
              accept=".png, .jpg, .jpeg"
              @change="handleFileInputChange($event)" />
            <input type="hidden" name="avatar-remove" />
          </label>
          <span
            data-bs-toggle="tooltip"
            data-kt-image-input-action="cancel"
            title="Cancel Avatar"
            class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow">
            <i class="bi bi-x fs-2"></i>
          </span>
          <span
            data-bs-toggle="tooltip"
            data-kt-image-input-action="remove"
            title="Remove Avatar"
            class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow">
            <i class="bi bi-x fs-2"></i>
          </span>
        </div>
      </div>
      <div class="form-text">{{ t("global.image-note") }}</div>
    </div>
    <div class="fv-row mb-7">
      <label for="user-name" class="required fw-semibold fs-6 mb-2">{{ t("global.name") }}</label>
      <el-form-item prop="name" class="mb-0">
        <el-input id="user-name" v-model="user.name" type="text" name="user-name" />
      </el-form-item>
    </div>
    <div class="fv-row mb-7">
      <label for="user-email" class="required fw-semibold fs-6 mb-2">{{ t("global.email") }}</label>
      <el-form-item prop="email" class="mb-0">
        <el-input id="user-email" v-model="user.email" type="text" name="user-email" />
      </el-form-item>
    </div>
    <div class="fv-row">
      <label for="user-password" :class="`${id ? '' : 'required'} fw-semibold fs-6 mb-2`">{{
        t("global.password")
      }}</label>
      <el-form-item prop="password" class="mb-0">
        <el-input id="user-password" v-model="user.password" type="text" name="user-password" />
      </el-form-item>
    </div>
    <template v-if="selectedType === 'Admin'">
      <div class="mb-7">
        <label for="user-role" class="required fw-semibold fs-6 mb-5">{{ t("global.role") }}</label>
        <template v-for="(role, index) in user.roles" :key="index">
          <div class="d-flex fv-row">
            <div class="form-check form-check-custom form-check-solid">
              <input
                :id="`user-role-${role.id}`"
                v-model="role.checked"
                type="checkbox"
                :value="role.id"
                :name="`user-role-${role.id}`"
                :checked="role.checked"
                class="form-check-input me-3" />
              <label :for="`user-role-${role.id}`" class="form-check-label">
                <div :class="{'fw-bold text-gray-800': role.checked}">
                  {{ t(`global.${role.title}`) }}
                </div>
              </label>
            </div>
          </div>
          <div v-if="index !== user.roles.length - 1" class="separator separator-dashed my-5" />
          <!-- <div class="d-flex fv-row">
          <el-radio
            :id="`user-role-${role.id}`"
            v-model="selectedRoleId"
            :label="role.id"
            class="form-check-input me-3">
            <span :class="{'fw-bold text-gray-800': role.checked}">
              {{ t(`global.${role.title}`) }}
            </span>
          </el-radio>
        </div> -->
          <!-- <div v-if="index !== user.roles.length - 1" class="separator separator-dashed my-5" /> -->
        </template>
      </div>
    </template>
  </modal-layout>
</template>

<script>
import {hideModal, removeModalBackdrop} from "@/core/helpers/dom"
import {forEach} from "lodash"
import {computed, defineComponent, onMounted, ref, toRef, watch} from "vue"
import {useI18n} from "vue-i18n"
import axiosClient from "../../../plugins/axios"
import ModalLayout from "../../../components/layouts/admin/modal.vue"

export default defineComponent({
  name: "add-user-modal",
  components: {ModalLayout},
  props: {
    idCurrent: {type: Number, required: false, default: null},
    userCurrent: {type: Object, required: false, default: null},
    selectedType: {type: String, required: false, default: null}
  },
  emits: ["on-after-submit"],
  setup(props, {emit, expose}) {
    const {t} = useI18n()
    const addUserModal = ref(null)
    const id = toRef(props, "idCurrent")
    const user = toRef(props, "userCurrent")
    const userType = toRef(props, "selectedType")
    const avatar = ref("")
    const imageSelected = ref("")
    // const selectedRoleId = ref(null)

    watch(id, (newVal, oldVal) => {
      id.value = newVal
      // Handle logic for updated prop value
    })

    const submit = async () => {
      if (!addUserModal.value.form) return
      addUserModal.value.form.validate((valid, errors) => {
        if (valid) {
          addUserModal.value.loading = true
          // let selectedRoleId = null

          // if (userType.value === "Admin") {
          //   const userRoles = []
          //   forEach(user.value.roles, (role) => {
          //     userRoles.push({
          //       id: role.id,
          //       allow: document.getElementById(`user-role-${role.id}`).checked
          //     })
          //   })
          //   // selectedRoleId = user.value.roles.find((role) => role.checked)?.id || null
          //   selectedRoleId = JSON.stringify(userRoles)
          // } else if (userType.value === "Tutor" || userType.value === "Student") {
          //   const roleTitle = userType.value.toLowerCase()
          //   const userRole = user.value.roles.find((role) => role.title.toLowerCase() === roleTitle)
          //   selectedRoleId = userRole ? userRole.id : null
          // }

          let selectedRoleId = null

          if (userType.value === "Admin") {
            const userRoles = []
            forEach(user.value.roles, (role) => {
              userRoles.push({
                id: role.id,
                allow: document.getElementById(`user-role-${role.id}`).checked
              })
            })
            selectedRoleId = JSON.stringify(userRoles)
          } else if (userType.value === "Tutor" || userType.value === "Student") {
            const roleTitle = userType.value.toLowerCase()
            const userRole = user.value.roles.find((role) => role.title.toLowerCase() === roleTitle)
            if (userRole) {
              const userRoles = [{id: userRole.id, allow: true}] // Only include the relevant role
              selectedRoleId = JSON.stringify(userRoles)
            } else {
              selectedRoleId = JSON.stringify([]) // No role found, send an empty array
            }
          }
          const formData = new FormData()
          formData.append("avatar", imageSelected.value)
          formData.append("name", user.value.name)
          formData.append("email", user.value.email.toLowerCase())
          formData.append("password", user.value.password)
          formData.append("roles", selectedRoleId) // In

          axiosClient[id.value ? "post" : "post"](
            id.value ? `/users/edit/${id.value}` : "/users/create",
            formData
          )
            .then((response) => {
              if (response.data.success) {
                Swal.fire({
                  icon: "success",
                  text: t("global.user-added-successfully"),
                  confirmButtonText: t("global.thank-you"),
                  buttonsStyling: false,
                  customClass: {confirmButton: "btn btn-primary"}
                })

                hideModal(addUserModal.value.modal)
                removeModalBackdrop()
                emit("on-after-submit")
              } else {
                // Handle validation errors
                let errorMessage = ""
                switch (response.data["msg-code"]) {
                  case "validation-error":
                    errorMessage = t("errors.email-used")
                    break
                  default:
                    errorMessage = t("global.unknown-error")
                    break
                }

                Swal.fire({
                  icon: "error",
                  text: errorMessage,
                  confirmButtonText: t("global.got-it"),
                  buttonsStyling: false,
                  customClass: {confirmButton: "btn btn-danger"}
                })
              }
            })
            .catch((error) => {
              let errorMessage = t("global.errors-detected")
              if (
                error.response &&
                error.response.data &&
                error.response.data.message === "email-duplicated"
              ) {
                errorMessage = t("global.email-duplicated-error-message")
              } else if (
                error.response &&
                error.response.data &&
                error.response.data.errors &&
                error.response.data.errors.email
              ) {
                errorMessage = error.response.data.errors.email[0]
              }

              Swal.fire({
                icon: "error",
                text: errorMessage,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            })
            .finally(() => {
              addUserModal.value.loading = false
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
          // Swal.fire({
          //   icon: "error",
          //   text: t("global.errors-detected"),
          //   confirmButtonText: t("global.got-it"),
          //   buttonsStyling: false,
          //   customClass: {confirmButton: "btn btn-danger"}
          // })

          // return false
        }
      })
    }
    const handleFileInputChange = function handleFileInputChange(e) {
      // eslint-disable-next-line
      imageSelected.value = e.target.files[0]
      const reader = new FileReader()

      reader.readAsBinaryString(imageSelected.value)
      reader.onload = (event) => {
        avatar.value = event.target.result
      }
    }

    const validatePassword = function validatePassword() {
      return passwordMeter.getScore() === 100
    }

    const handleInputPassword = function handleInputPassword(value) {
      if (value.length > 0) validation[1].updateFieldStatus("password", "NotValidated")
    }

    const modelReset = function modelReset() {
      Object.entries(user.value).forEach(([key]) => {
        user.value[key] = null
      })
    }

    const rules = computed(() => ({
      name: [{required: true, trigger: "change", message: t("global.name-required")}],
      email: [{required: true, trigger: "change", message: t("global.email-required")}],
      password: id.value
        ? [
            {
              required: false,
              trigger: "change",
              message: t("global.password-required")
            }
          ]
        : [
            {
              required: true,
              trigger: "change",
              message: t("global.password-required")
            }
          ],
      roles: [{required: true, type: "array", min: 1, message: t("global.role-required")}]
    }))

    onMounted(() => {
      KTImageInput.init()
    })

    expose({addUserModal})
    return {
      t,
      id,
      addUserModal,
      user,
      rules,
      submit,
      handleFileInputChange,
      modelReset,
      handleInputPassword,
      validatePassword
    }
  }
})
</script>

<style scoped>
.form-check-input {
  border: 0px;
}
</style>
