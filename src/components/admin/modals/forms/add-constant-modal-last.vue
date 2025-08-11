<template>
          <modal-layout
            id="kt_modal_add_constant"
            ref="addConstantModal"
            header-id="kt_modal_add_constant_header"
            close-id="kt_modal_add_constant_close"
            title="Add Constant"
            form-id="kt_modal_add_constant_form"
            :form-model="constant"
            :form-model-reset="modelReset"
            :form-rules="rules"
            scroll-id="kt_modal_add_constant_scroll"
            @form-submit="submit">
            <template v-if="constantName === 'currencies'">
              <div class="fv-row mb-7">
                <label for="currency" class="required fw-semibold fs-6 mb-2">Currency</label>
                <el-form-item prop="currency" class="mb-0">
                  <el-select v-model="constant.name" placeholder="Select currency" style="width: 100%">
                    <el-option
                      v-for="currency in currencies"
                      :key="currency.value"
                      :label="currency.label"
                      :value="currency.value" />
                  </el-select>
                </el-form-item>
              </div>
            </template>
            <template v-else>
              <div class="fv-row mb-7">
                <label for="constant-name" class="required fw-semibold fs-6 mb-2">Name</label>
                <el-form-item prop="name" class="mb-0">
                  <el-input
                    id="constant-name"
                    v-model="constant.name"
                    type="text"
                    name="constant-name"
                    placeholder="English" />
                </el-form-item>
              </div>
              <div v-for="language in languages" :key="language.name" class="fv-row mb-7">
                <label :for="language-${language.id}" class="required fw-semibold fs-6 mb-2">
                  {{ language.name.charAt(0).toUpperCase() + language.name.slice(1) }}
                </label>
                <el-form-item :prop="language.name" class="mb-0">
                  <el-input
                    :id="language-${language.id}"
                    v-model="constant[language.name]"
                    type="text"
                    :name="language-${language.id}"
                    :placeholder="${
                      language.name.charAt(0).toUpperCase() + language.name.slice(1)
                    } Translation" />
                </el-form-item>
              </div>
            </template>
          </modal-layout>
        </template>
        
        <script>
        import {hideModal, removeModalBackdrop} from "@/core/helpers/dom"
        import {defineComponent, onBeforeUpdate, onUpdated, ref, toRef} from "vue"
        import {useI18n} from "vue-i18n"
        import axiosClient from "../../../../plugins/axios"
        import ModalLayout from "../../../layouts/admin/modal.vue"
        
        export default defineComponent({
          name: "add-constant-modal",
          components: {ModalLayout},
          props: {
            idCurrent: {type: Number, required: false, default: null},
            constantName: {type: String, require: false, default: null},
            constantCurrent: {type: Object, require: false, default: null}
          },
          emits: ["after-on-submit"],
          setup(props, {emit, expose}) {
            const {t} = useI18n()
            const addConstantModal = ref(null)
            const id = toRef(props, "idCurrent")
            const constantName = toRef(props, "constantName")
            const constant = toRef(props, "constantCurrent")
            const rules = ref({
              name: [{required: true, trigger: "change", message: t("global.name-required")}]
            })
        
            const fetchCurrencies = async () => {
              try {
                const response = await axios.get(
                  "https://api.fastforex.io/currencies?api_key=4146caa721-7b424cd3a8-sh6gtc"
                )
                const currencyData = response.data.currencies
                currencies.value = Object.entries(currencyData).map(([value, label]) => ({
                  label,
                  value
                }))
              } catch (error) {
                console.error("Error fetching currencies:", error)
              }
            }
        
            const languages = ref([])
            const currencies = ref([])
        
            onUpdated(() => {
              fetchCurrencies()
        
              axiosClient.get("/locales/langs").then((response) => {
                languages.value = response.data.data
                languages.value.forEach((language) => {
                  rules.value[language.name] = [
                    {
                      required: true,
                      trigger: "change",
                      message: ${language.name} is required
                    }
                  ]
                  if (id.value) {
                    if (constant.value.trans) {
                      constant.value.trans.forEach((translation) => {
                        if (translation[["lang", "id"].join("")] === language.id)
                          constant.value[language.name] = translation.title
                      })
                    }
                  }
                })
              })
            })
        
            onBeforeUpdate(() => {
              addConstantModal.value.form.resetFields()
            })
        
            const submit = function submit() {
              if (!addConstantModal.value.form) return
              addConstantModal.value.form.validate((valid, errors) => {
                if (valid) {
                  const createTranslations = function createTranslations() {
                    const translations = []
                    languages.value.forEach((language) => {
                      if (constant.value[language.name]) {
                        translations.push({
                          [["lang", "id"].join("")]: language.id,
                          title: constant.value[language.name]
                        })
                      }
                      if (constantName.value === "currencies") {
                        translations.push({
                          [["lang", "id"].join("")]: language.id,
                          title: constant.value.name
                        })
                      }
                    })
        
                    return translations
                  }
        
                  addConstantModal.value.loading = true
                  axiosClient[id.value ? "put" : "post"](
                    id.value
                      ? /${constantName.value}/update/${id.value}
                      : /${constantName.value}/create,
                    {name: constant.value.name, trans: createTranslations()}
                  )
                    .then(() => {
                      Swal.fire({
                        icon: "success",
                        text: t("global.constant-added-successfully"),
                        confirmButtonText: t("global.thank-you"),
                        buttonsStyling: false,
                        customClass: {confirmButton: "btn btn-primary"}
                      })
        
                      hideModal(addConstantModal.value.modal)
                      removeModalBackdrop()
                      emit("after-on-submit")
        
                      // Reload the page upon success
                      window.location.reload()
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
                      addConstantModal.value.loading = false
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
              Object.entries(constant.value).forEach(([key]) => {
                constant.value[key] = null
              })
            }
        
            expose({addConstantModal})
            return {
              addConstantModal,
              constant,
              rules,
              currencies,
              languages,
              modelReset,
              submit
            }
          }
        })
        </script>