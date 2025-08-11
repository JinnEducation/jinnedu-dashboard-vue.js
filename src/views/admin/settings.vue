<template>
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="fv-row mt-5">
        <h1>{{ isNew ? t("global.create-new-setting") : t("global.edit-setting") }}</h1>
        <!-- <form @submit.prevent="submitForm"> -->
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
          <!-- <button type="submit" class="btn btn-primary">Update</button> -->
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
        <!-- </form> -->
      </div>
    </div>
  </div>
</template>

<script>
import {useI18n} from "vue-i18n"
import {onBeforeMount, ref} from "vue"
import axiosClient from "../../plugins/axios"
import {useRouter} from "vue-router"

export default {
  name: "setting-component",
  setup() {
    const {t} = useI18n()

    const setting = ref({
      name: "",
      type: "",
      value: "",
      options: "",
      icon: "",
      class: "",
      color: ""
    })

    const isNew = ref(true)

    const router = useRouter()

    // const updateSetting = () => {
    //   axiosClient
    //     .post("/settings", {
    //       // Pass the values directly from the ref object
    //       name: setting.value.name,
    //       type: setting.value.type,
    //       value: setting.value.value,
    //       options: setting.value.options,
    //       icon: setting.value.icon,
    //       class: setting.value.class,
    //       color: setting.value.color
    //     })
    //     .then(() => {
    //       router.push({name: "settings"})
    //     })
    //     .catch((error) => {
    //       console.error("Error updating setting:", error)
    //     })
    // }

    const submit = () => {
      axiosClient
        .post("/settings/update/1", {
          // Pass the values directly from the ref object
          name: setting.value.name,
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
        .catch((error) => {
          console.error("Error updating setting:", error)
        })
    }

    const fetchSettingData = () => {
      axiosClient
        .get("/settings")
        .then((response) => {
          const data = response.data.result.data[0]
          setting.value = data
          isNew.value = false
        })
        .catch((error) => {
          console.error("Error fetching setting data:", error)
        })
    }

    onBeforeMount(() => {
      fetchSettingData()
    })

    return {
      t,
      setting,
      isNew,
      submit
    }
  }
}
</script>
<style>
/* Add your styles here */
</style>
