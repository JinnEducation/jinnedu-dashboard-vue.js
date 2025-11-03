<!-- eslint-disable no-unused-vars -->
<template>
  <toolbar :title="menuId ? t('global.update-menu') : t('global.add-menu')" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <!-- Loading State -->
      <template v-if="loading">
        <div class="card-body p-0">
          <div class="card-px text-center py-20 my-10">
            <div role="status" class="spinner-border text-primary">
              <span class="visually-hidden">{{ t("global.loading") }}...</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Form Card -->
      <div v-show="!loading" class="card">
        <div class="card-body">
          <el-form
            ref="formRef"
            :model="data"
            :rules="rules"
            label-position="top"
            class="form"
          >
            <!-- Parent Menu -->
            <div class="row mb-5">
              <div class="col-md-6">
                <el-form-item :label="t('global.parent-menu')" prop="p_id">
                  <el-select
                    v-model="data.p_id"
                    :placeholder="t('global.select-parent-menu')"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option :label="t('global.root-menu')" :value="0" />
                    <el-option
                      v-for="parent in parents"
                      :key="parent.id"
                      :value="parent.id"
                      :label="parent.title"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <div class="col-md-6">
                <el-form-item label="Type" prop="type">
                  <el-input
                    v-model="data.type"
                    placeholder="e.g., App\Models\User"
                  />
                </el-form-item>
              </div>
            </div>

            <!-- Title & Name -->
            <div class="row mb-5">
              <div class="col-md-6">
                <el-form-item :label="t('global.title')" prop="title">
                  <el-input
                    v-model="data.title"
                    :placeholder="t('global.enter-menu-title')"
                  />
                </el-form-item>
              </div>

              <div class="col-md-6">
                <el-form-item :label="t('global.name')" prop="name">
                  <el-input
                    v-model="data.name"
                    :placeholder="t('global.enter-menu-name')"
                  />
                </el-form-item>
              </div>
            </div>

            <!-- Route & Slug -->
            <div class="row mb-5">
              <div class="col-md-6">
                <el-form-item :label="t('global.route')" prop="route">
                  <el-input
                    v-model="data.route"
                    :placeholder="t('global.enter-route-path')"
                  />
                </el-form-item>
              </div>

              <div class="col-md-6">
                <el-form-item label="Slug" prop="slug">
                  <el-input
                    v-model="data.slug"
                    placeholder="Auto-generated from title"
                  />
                </el-form-item>
              </div>
            </div>

            <!-- Active Routes -->
            <div class="row mb-5">
              <div class="col-md-12">
                <el-form-item label="Active Routes" prop="active_routes_array">
                  <el-select
                    v-model="data.active_routes_array"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="Enter routes and press enter"
                    style="width: 100%"
                  />
                  <small class="text-muted d-block mt-2">
                    Routes that should highlight this menu (pipe-separated)
                  </small>
                </el-form-item>
              </div>
            </div>

            <!-- SVG Icon Upload -->
            <div class="row mb-5">
              <div class="col-md-12">
                <el-form-item label="SVG Icon" prop="svg">
                  <el-upload
                    :show-file-list="false"
                    :auto-upload="false"
                    accept="image/*"
                    :on-change="handleSvgUpload"
                  >
                    <img
                      v-if="data.svg_url"
                      :src="data.svg_url"
                      alt="Menu icon"
                      class="rounded border"
                      style="
                        max-width: 100px;
                        height: auto;
                        cursor: pointer;
                      "
                    />
                    <el-button v-else type="primary">
                      {{ t("global.select-icon") }}
                    </el-button>
                  </el-upload>
                  <small class="text-muted d-block mt-2">
                    Upload SVG or image file for menu icon
                  </small>
                </el-form-item>
              </div>
            </div>

            <!-- Switches -->
            <div class="row mb-5">
              <div class="col-md-4">
                <el-form-item :label="t('global.status')" prop="status">
                  <el-switch
                    v-model="data.status"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="Active"
                    inactive-text="Inactive"
                  />
                </el-form-item>
              </div>

              <div class="col-md-4">
                <el-form-item label="Invisible" prop="invisible">
                  <el-switch
                    v-model="data.invisible"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="Hidden"
                    inactive-text="Visible"
                  />
                </el-form-item>
              </div>

              <div class="col-md-4">
                <el-form-item label="Sortable" prop="sortable">
                  <el-switch
                    v-model="data.sortable"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="Yes"
                    inactive-text="No"
                  />
                </el-form-item>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="d-flex justify-content-end mt-8">
              <router-link to="/dashboard/menu/index" class="btn btn-light me-3">
                {{ t("global.cancel") }}
              </router-link>
              <el-button
                type="primary"
                :loading="submitting"
                @click="submitForm"
              >
                {{ menuId ? t("global.update-menu") : t("global.add-menu") }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import { defineComponent, onBeforeMount, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import axiosClient from "../../../plugins/axios"

export default defineComponent({
  name: "add-menu",
  components: {
    Toolbar
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const menuId = route.params.id

    // Form references
    const loading = ref(false)
    const submitting = ref(false)
    const formRef = ref(null)

    // Validation rules
    const rules = ref({
      title: [{ required: true, message: "Title is required", trigger: "blur" }]
    })

    // Parent menus list
    const parents = ref([])

    // Form data schema
    const data = ref({
      p_id: 0,
      title: "",
      name: "",
      route: "",
      slug: "",
      type: "",
      active_routes_array: [],
      status: 0,
      invisible: 0,
      sortable: 0,
      svg_url: "",
      svg_file: null
    })

    // Load parent menus (p_id = 0)
    const loadParents = () => {
      axiosClient
        .get("/menus/patents")
        .then((response) => {
          parents.value = response.data.data || response.data || []
        })
        .catch(() => {
          // Silently handle error
        })
    }

    // Load existing menu for edit
    const loadMenuItem = (id) => {
      loading.value = true
      axiosClient
        .get(`/menus/${id}`)
        .then((response) => {
          const menu = response.data.data || response.data
          Object.assign(data.value, {
            p_id: menu.p_id || 0,
            title: menu.title || "",
            name: menu.name || "",
            route: menu.route || "",
            slug: menu.slug || "",
            type: menu.type || "",
            active_routes_array: (menu.active_routes || "").split("|").filter(Boolean),
            status: Number(menu.status) || 0,
            invisible: Number(menu.invisible) || 0,
            sortable: Number(menu.sortable) || 0,
            svg_url: menu.svg || ""
          })
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            text: t("global.errors-detected"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: { confirmButton: "btn btn-danger" }
          })
        })
        .finally(() => {
          loading.value = false
        })
    }

    // Watch title and auto-generate slug
    watch(
      () => data.value.title,
      (val) => {
        if (val && !menuId) {
          data.value.slug = val
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
        }
      }
    )

    // Handle SVG file upload
    const handleSvgUpload = (file) => {
      if (file && file.raw) {
        data.value.svg_file = file.raw
        data.value.svg_url = URL.createObjectURL(file.raw)
      }
    }

    // Submit form
    const submitForm = () => {
      if (!formRef.value) return

      formRef.value.validate((valid, errors) => {
        if (valid) {
          submitting.value = true

          const fd = new FormData()

          // Prepare payload
          const payload = {
            p_id: data.value.p_id || 0,
            title: data.value.title,
            name: data.value.name,
            route: data.value.route,
            slug: data.value.slug,
            type: data.value.type,
            active_routes: data.value.active_routes_array.join("|"),
            status: Number(!!data.value.status),
            invisible: Number(!!data.value.invisible),
            sortable: Number(!!data.value.sortable)
          }

          // Append all fields to FormData
          Object.entries(payload).forEach(([key, value]) => {
            fd.append(key, value ?? "")
          })

          // Append SVG file if newly selected
          if (data.value.svg_file) {
            fd.append("svg", data.value.svg_file)
          }

          // Determine URL and method
          const url = menuId ? `/menus/${menuId}` : "/menus"
          const requestConfig = {
            headers: { "Content-Type": "multipart/form-data" }
          }

          // Add _method for PUT if updating (Laravel workaround)
          if (menuId) {
            fd.append("_method", "PUT")
          }

          const apiCall = axiosClient.post(url, fd, requestConfig)

          apiCall
            .then(() => {
              Swal.fire({
                icon: "success",
                text: menuId
                  ? t("global.menu-updated-successfully")
                  : t("global.menu-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: { confirmButton: "btn btn-primary" }
              })
              router.push("/dashboard/menu/index")
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                text: t("global.errors-detected"),
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: { confirmButton: "btn btn-danger" }
              })
            })
            .finally(() => {
              submitting.value = false
            })
        } else {
          // Handle validation errors
          const errorMessages = Object.values(errors)
            .flat()
            .map((error) => error.message)
          Swal.fire({
            icon: "error",
            title: t("global.errors-detected"),
            html: errorMessages.join("<br>"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: { confirmButton: "btn btn-danger" }
          })
        }
      })
    }

    // Lifecycle hooks
    onBeforeMount(() => {
      loadParents()
      if (menuId) {
        loadMenuItem(menuId)
      }
    })

    return {
      t,
      loading,
      submitting,
      formRef,
      rules,
      data,
      parents,
      menuId,
      handleSvgUpload,
      submitForm
    }
  }
})
</script>

<style scoped>
.el-form-item {
  margin-bottom: 1.5rem;
}
</style>
