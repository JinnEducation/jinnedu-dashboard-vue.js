<template>
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="fv-row mt-5">
        <h1>{{ isNew ? t("global.create-new-setting") : t("global.edit-setting") }}</h1>
        <el-form
          ref="form"
          :model="setting"
          :rules="rules"
          :validate-on-rule-change="false"
          class="form">
          <div class="fv-row mb-7">
            <label for="settings-name" class="required fw-semibold fs-6 mb-2">{{
              t("global.settings-name")
            }}</label>
            <el-form-item prop="name" class="mb-0">
              <el-input
                id="settings-name"
                v-model="setting.name"
                type="text"
                name="settings-name" />
            </el-form-item>
          </div>
          <div class="fv-row mb-7">
            <label class="required fw-semibold fs-6 mb-2">{{ t("global.settings-name") }}</label>
            <languages-tabs v-slot="slot">
              <el-form-item :prop="`trans.${slot.language.id}`" class="mb-0">
                <el-input
                  v-model="setting.trans[slot.language.id]"
                  type="text"
                  :name="`settings-name-${slot.language.shortname}`" />
              </el-form-item>
            </languages-tabs>
          </div>
          <div class="fv-row mb-7">
            <label for="settings-type" class="required fw-semibold fs-6 mb-2">
              {{ t("global.type") }}
            </label>
            <el-form-item prop="type" class="mb-0">
              <el-input
                id="settings-type"
                v-model="setting.type"
                type="text"
                name="settings-type" />
            </el-form-item>
          </div>
          <div class="fv-row mb-7">
            <label for="settings-value" class="required fw-semibold fs-6 mb-2">
              {{ t("global.value") }}
            </label>
            <el-form-item prop="value" class="mb-0">
              <el-input
                id="settings-value"
                v-model="setting.value"
                type="text"
                name="settings-value" />
            </el-form-item>
          </div>
          <div class="fv-row mb-7">
            <label for="settings-options" class="required fw-semibold fs-6 mb-2">
              {{ t("global.options") }}
            </label>
            <el-form-item prop="options" class="mb-0">
              <el-input
                id="settings-options"
                v-model="setting.options"
                type="text"
                name="settings-options" />
            </el-form-item>
          </div>
          <div class="fv-row mb-7">
            <label for="settings-icon" class="required fw-semibold fs-6 mb-2">
              {{ t("global.icon") }}
            </label>
            <el-form-item prop="icon" class="mb-0">
              <el-input
                id="settings-icon"
                v-model="setting.icon"
                type="text"
                name="settings-icon" />
            </el-form-item>
          </div>
          <div class="fv-row mb-7">
            <label for="settings-class" class="required fw-semibold fs-6 mb-2">
              {{ t("global.class") }}
            </label>
            <el-form-item prop="class" class="mb-0">
              <el-input
                id="settings-class"
                v-model="setting.class"
                type="text"
                name="settings-class" />
            </el-form-item>
          </div>
          <div class="fv-row mb-7">
            <label for="settings-color" class="required fw-semibold fs-6 mb-2">
              {{ t("global.color") }}
            </label>
            <el-form-item prop="color" class="mb-0">
              <el-input
                id="settings-color"
                v-model="setting.color"
                type="text"
                name="settings-color" />
            </el-form-item>
          </div>
          <button
            id="submit"
            ref="button"
            type="submit"
            class="btn btn-primary"
            @click.prevent="submit"
            @keypress.prevent="click">
            <span class="indicator-label">
              {{ t("global.save-changes") }}
            </span>
            <span class="indicator-progress">
              {{ t("global.please-wait") }} ...
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import LanguagesTabs from "@/components/admin/languages-tabs.vue"
import {useI18n} from "vue-i18n"
import {computed, onBeforeMount, ref} from "vue"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"
import {useRoute, useRouter} from "vue-router"

export default {
  name: "setting-component",
  components: {LanguagesTabs},
  setup() {
    const {t} = useI18n()
    const store = useStore()

    const route = useRoute()

    const {id} = route.params

    const languages = computed(() => store.state.languages || [])
    const form = ref(null)

    const setting = ref({
      name: "",
      trans: {},
      type: "",
      value: "",
      options: "",
      icon: "",
      class: "",
      color: ""
    })

    const rules = ref({
      name: [
        {
          required: true,
          trigger: "change",
          message: t("global.settings-name")
        }
      ],
      trans: {}
    })

    const isNew = ref(true)

    const router = useRouter()

    const normalizeTransObject = (transArray = []) => {
      const transObject = {}

      transArray.forEach((item) => {
        if (item && item.langid) {
          transObject[item.langid] = item.title || ""
        }
      })

      return transObject
    }

    const initializeTrans = (transObject = {}) => {
      const mapped = {}

      languages.value.forEach((language) => {
        mapped[language.id] = transObject[language.id] || ""
      })

      setting.value.trans = mapped
    }

    const initializeTransRules = () => {
      const transRules = {}

      languages.value.forEach((language) => {
        transRules[language.id] = [
          {
            required: true,
            trigger: "change",
            message: `${t("global.settings-name")} (${language.name})`
          }
        ]
      })

      rules.value.trans = transRules
    }

    const buildTransPayload = () => {
      return Object.keys(setting.value.trans || {}).map((langid) => ({
        langid: Number(langid),
        title: setting.value.trans[langid] || ""
      }))
    }

    const submit = () => {
      if (!form.value) return

      form.value.validate((isValid) => {
        if (!isValid) return

        axiosClient
          .post(`/settings/update/${id}`, {
            name: setting.value.name,
            trans: buildTransPayload(),
            type: setting.value.type,
            value: setting.value.value,
            options: setting.value.options,
            icon: setting.value.icon,
            class: setting.value.class,
            color: setting.value.color
          })
          .then(() => {
            Swal.fire({
              icon: "success",
              text: t("global.settings-updated-successfully"),
              confirmButtonText: t("global.thank-you"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-primary"}
            })
            router.push({name: "settings"})
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              text: t("global.something-went-wrong"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-primary"}
            })
          })
      })
    }

    const fetchSettingData = () => {
      axiosClient
        .get(`/settings/show/${id}`)
        .then((response) => {
          const result = response.data.result || {}
          const transObject = normalizeTransObject(result.trans || [])

          setting.value = {
            name: result.name || "",
            trans: {},
            type: result.type || "",
            value: result.value || "",
            options: result.options || "",
            icon: result.icon || "",
            class: result.class || "",
            color: result.color || ""
          }

          initializeTrans(transObject)
          isNew.value = false
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            text: t("global.something-went-wrong"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
        })
    }

    const initializeForm = async () => {
      if (!Array.isArray(store.state.languages) || store.state.languages.length === 0) {
        await store.dispatch("getAPILanguages")
      }

      initializeTransRules()
      initializeTrans()
      fetchSettingData()
    }

    onBeforeMount(() => {
      initializeForm()
    })

    return {
      t,
      form,
      setting,
      rules,
      isNew,
      submit
    }
  }
}
</script>
