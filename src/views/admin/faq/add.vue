<template>
  <toolbar
    :title="
      id ? `${t('global.edit')} ${t('global.faq')}` : `${t('global.add')} ${t('global.faq')}`
    " />
  <div class="app-content flex-column-fluid mb-10">
    <div class="app-container container-xxl">
      <template v-if="loading">
        <div class="card-body p-0">
          <div class="card-px text-center py-20 my-10">
            <div role="status" class="spinner-border text-primary">
              <span class="visually-hidden">{{ t("global.loading") }}</span>
            </div>
          </div>
        </div>
      </template>
      <div v-show="!loading">
        <el-form
          ref="form"
          :model="data"
          :rules="rules"
          class="form d-flex flex-column flex-lg-row">
          <div class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.status") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="status">
                  <el-select
                    v-model="data.status"
                    name="status-select"
                    :placeholder="t('global.select-status')"
                    :filterable="true"
                    :clearable="true">
                    <template v-if="statusValues.length > 0">
                      <el-option
                        v-for="item in statusValues"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label" />
                    </template>
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.sort_order") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="sort_order">
                  <el-input
                    v-model.number="data.sort_order"
                    type="number"
                    name="sort-order"
                    :placeholder="t('global.sort_order')"
                    min="0" />
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <languages-tabs v-slot="slot">
              <div class="card-body pt-0">
                <div class="mb-10 fv-row">
                  <label for="faq-question" class="required form-label">
                    {{ t("global.question") }}
                  </label>
                  <el-form-item :prop="`question.${slot.language.id}`">
                    <el-input
                      id="faq-question"
                      v-model="data.question[slot.language.id]"
                      type="text"
                      name="faq-question"
                      :placeholder="t('global.question')"
                      maxlength="500" />
                  </el-form-item>
                </div>

                <div class="fv-row">
                  <label for="faq-answer" class="required form-label">
                    {{ t("global.answer") }}
                  </label>
                  <el-form-item :prop="`answer.${slot.language.id}`">
                    <el-input
                      id="faq-answer"
                      v-model="data.answer[slot.language.id]"
                      type="textarea"
                      :rows="8"
                      name="faq-answer"
                      :placeholder="t('global.answer')" />
                  </el-form-item>
                </div>
              </div>
            </languages-tabs>

            <div class="d-flex justify-content-end">
              <router-link id="cancel" to="/dashboard/faq/index" class="btn btn-light me-5">
                {{ t("global.cancel") }}
              </router-link>
              <button
                id="submit"
                ref="button"
                type="submit"
                class="btn btn-primary"
                @click.prevent="submit">
                <span class="indicator-label">{{ t("global.save-changes") }}</span>
                <span class="indicator-progress">
                  {{ t("global.please-wait") }}...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import LanguagesTabs from "@/components/admin/languages-tabs.vue"
import {defineComponent, onBeforeMount, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "@/plugins/axios"
import Swal from "sweetalert2"

export default defineComponent({
  name: "faq-add-edit",
  components: {
    Toolbar,
    LanguagesTabs
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const {t} = useI18n()
    const {languages, userInfo} = store.state
    const {id} = route.params
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type

    const loading = ref(false)
    const form = ref(null)
    const button = ref(null)
    const statusValues = ref([])

    const data = ref({
      status: "draft",
      sort_order: 0,
      question: {},
      answer: {}
    })

    const rules = ref({
      status: [
        {
          required: true,
          trigger: "change",
          message: t("global.status-required")
        }
      ],
      sort_order: [
        {
          required: true,
          trigger: "change",
          message: t("global.sort_order-required")
        }
      ],
      question: {},
      answer: {}
    })

    languages.forEach((languageItem) => {
      const {id: langId, name} = languageItem
      rules.value.question[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(`global.question-in-${name.toLowerCase()}-required`)
        }
      ]

      rules.value.answer[langId] = [
        {
          required: true,
          trigger: "change",
          message: t(`global.answer-in-${name.toLowerCase()}-required`)
        }
      ]
    })

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disabled = true
      button.value.ariaDisabled = true

      form.value.validate((valid, errors) => {
        if (valid) {
          const payload = {
            status: data.value.status,
            sort_order: data.value.sort_order,
            question: data.value.question || {},
            answer: data.value.answer || {},
            langs: languages
          }

          const apiUrl = id ? `/faq/${id}` : `/faq`
          const apiMethod = id ? "put" : "post"

          axiosClient[apiMethod](apiUrl, payload)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: id
                  ? t("global.faq-updated-successfully")
                  : t("global.faq-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              router.push({name: "faq-list"})
            })
            .catch((error) => {
              const errorMsg = error.response?.data?.message || t("global.errors-detected")
              Swal.fire({
                icon: "error",
                text: errorMsg,
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            })
            .finally(() => {
              button.value.removeAttribute("data-kt-indicator")
              button.value.disabled = false
              button.value.ariaDisabled = false
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

    onBeforeMount(() => {
      if (id) loading.value = true
    })

    onMounted(() => {
      statusValues.value =
        userType === 2
          ? [
              {
                value: "draft",
                label: t("global.draft")
              }
            ]
          : [
              {
                value: "draft",
                label: t("global.draft")
              },
              {
                value: "published",
                label: t("global.published")
              },
              {
                value: "archived",
                label: t("global.archived")
              }
            ]

      if (id) {
        loading.value = true
        axiosClient
          .get(`/faq/${id}`)
          .then((response) => {
            const result = response.data.data || response.data.result || response.data
            data.value.status = result.status || "draft"
            data.value.sort_order = Number(result.sort_order || 0)

            if (result.question && typeof result.question === "object") {
              data.value.question = {...result.question}
            }

            if (result.answer && typeof result.answer === "object") {
              data.value.answer = {...result.answer}
            }

            loading.value = false
            if (form.value) form.value.clearValidate()
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: t("global.errors-detected"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
            loading.value = false
          })
      } else {
        loading.value = false
      }
    })

    return {
      id,
      t,
      loading,
      form,
      rules,
      button,
      data,
      statusValues,
      submit
    }
  }
})
</script>
