<!-- Done Reviewing -->
<template>
  <toolbar :title="t('global.add-role')" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <el-form :id="`add-role-form`" class="form d-flex flex-column flex-lg-row mb-10">
        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-5 g-xl-9">
          <div class="col-md-4">
            <label for="role-name" class="required form-label">
              {{ t("global.role-name") }}
            </label>
            <el-form-item class="mb-2">
              <el-input
                id="role-name"
                v-model="roleName"
                type="text"
                name="role-name"
                :placeholder="t('global.role-name')" />
            </el-form-item>
            <div class="text-muted fs-7">
              {{ t("global.role-name-required-unique") }}
            </div>
          </div>
          <div class="col-md-4">
            <label for="role-title" class="required form-label">
              {{ t("global.role-title") }}
            </label>
            <el-form-item class="mb-2">
              <el-input
                id="role-title"
                v-model="roleTitle"
                type="text"
                name="role-title"
                :placeholder="t('global.role-title')" />
            </el-form-item>
            <div class="text-muted fs-7">
              {{ t("global.role-title-required-unique") }}
            </div>
          </div>
          <div class="col-md-4"></div>
          <template v-for="(menu, index) in menus" :key="index">
            <template v-if="menu.type !== ''">
              <role-menu :item="menu" />
            </template>
            <template v-else>
              <template v-for="(child, innerIndex) in menu.childrens" :key="innerIndex">
                <role-menu :item="child" />
              </template>
            </template>
          </template>
        </div>
      </el-form>
      <div class="d-flex justify-content-end">
        <router-link id="cancel" to="/dashboard/roles/index" class="btn btn-light me-5">
          {{ t("global.cancel") }}
        </router-link>
        <button
          id="submit"
          type="submit"
          class="btn btn-primary"
          @click.prevent="submit"
          @keypress.prevent="click">
          <span class="indicator-label">
            {{ t("global.save-changes") }}
          </span>
          <span class="indicator-progress">
            {{ t("global.please-wait") }}...
            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import RoleMenu from "@/components/admin/role-menu.vue"
import {forEach} from "lodash"
import {defineComponent, onBeforeMount, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import axiosClient from "../../../plugins/axios"

export default defineComponent({
  name: "add-roles",
  components: {
    Toolbar,
    RoleMenu
  },
  setup() {
    const {t} = useI18n()
    const route = useRoute()
    const router = useRouter()
    const {id} = route.params
    const roles = ref(null)
    const menus = ref(null)
    const roleName = ref(null)
    const roleTitle = ref(null)
    const roleMenu = []

    const submit = function submit() {
      forEach(menus.value, (value) => {
        if (value.type === "") {
          forEach(value.childrens, (parent) => {
            const roleMenuChildrens = []
            forEach(parent.childrens, (children) => {
              roleMenuChildrens.push({
                id: children.id,
                allow: document.getElementById(`role-child-${children.id}`).checked
              })
            })

            roleMenu.push({id: parent.id, childrens: roleMenuChildrens})
          })
        } else {
          const roleMenuChildrens = []
          forEach(value.childrens, (children) => {
            roleMenuChildrens.push({
              id: children.id,
              allow: document.getElementById(`role-child-${children.id}`).checked
            })
          })

          roleMenu.push({id: value.id, childrens: roleMenuChildrens})
        }
      })
      axiosClient
        .post(id ? `/roles/update/${id}` : `/roles/create`, {
          name: roleName.value,
          title: roleTitle.value,
          menus: roleMenu
        })
        .then((response) => {
          if (response.data.success) {
            Swal.fire({
              icon: "success",
              text: t("global.role-saved-successfully"),
              confirmButtonText: t("global.thank-you"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-primary"}
            }).then((result) => {
              if (result.isConfirmed) {
                router.push({name: "roles"})
              }
            })
          } else {
            Swal.fire({
              icon: "error",
              text: t("global.errors-detected"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
          }
        })
        .catch((error) => {
          let message = ""
          if (error.response.data.message) message = error.response.data.message
          else message = ""

          Swal.fire({
            icon: "error",
            text: message,
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })
        })
    }

    onBeforeMount(() => {
      if (id) {
        axiosClient.get(`/roles/show/${id}`).then((response) => {
          if (response.data.success) {
            const data = response.data.result
            roleName.value = data.name
            roleTitle.value = data.title
          }
        })

        axiosClient.get(`/roles/menus/${id}`).then((response) => {
          menus.value = response.data
        })
      } else {
        axiosClient.get(`/roles/menus`).then((response) => {
          menus.value = response.data
        })
      }
    })

    return {
      roles,
      menus,
      roleName,
      roleTitle,
      submit,
      t
    }
  }
})
</script>
