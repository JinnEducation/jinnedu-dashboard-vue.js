<template>
  <div>
    <toolbar :title="t('global.social-media-settings')" />
    <div class="app-content flex-column-fluid">
      <div class="app-container container-xxl">
        <div class="card social-media-card">
          <div class="card-header border-0 pt-6">
            <div class="card-title d-block">
              <h2 class="fw-bold mb-2">{{ t("global.social-media-links") }}</h2>
              <p class="text-muted fs-6 mb-0">
                {{ t("global.manage-footer-social-media-links") }}
              </p>
            </div>
          </div>

          <div class="card-body pt-4">
            <template v-if="loading">
              <div class="text-center py-20">
                <div role="status" class="spinner-border text-primary">
                  <span class="visually-hidden">{{ t("global.loading") }}...</span>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="d-flex flex-column gap-5">
                <div v-for="link in links" :key="link.id" class="social-link-row">
                  <div class="social-link-platform">
                    <span class="social-link-icon">
                      <i :class="link.icon"></i>
                    </span>
                    <div>
                      <div class="fw-bold text-gray-900">{{ link.name }}</div>
                      <div class="text-muted fs-7">{{ t("global.platform") }}</div>
                    </div>
                  </div>

                  <div class="social-link-input">
                    <label :for="`social-link-${link.id}`" class="form-label fw-semibold mb-2">
                      {{ t("global.social-link") }}
                    </label>
                    <input
                      :id="`social-link-${link.id}`"
                      v-model="link.url"
                      type="url"
                      class="form-control form-control-solid"
                      :placeholder="t('global.enter-social-link')" />
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-end mt-8">
                <button type="button" class="btn btn-primary" :disabled="saving" @click="saveLinks">
                  <span v-if="!saving">{{ t("global.save-changes") }}</span>
                  <span v-else>
                    {{ t("global.please-wait") }} ...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import axiosClient from "@/plugins/axios"
import {defineComponent, onBeforeMount, ref} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "social-media-settings",
  components: {Toolbar},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const saving = ref(false)
    const links = ref([])

    const getLinks = () => {
      loading.value = true
      axiosClient
        .get("/social-media-links")
        .then((response) => {
          links.value = response.data.result || []
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            text: t("global.something-went-wrong"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
        })
        .finally(() => {
          loading.value = false
        })
    }

    const saveLinks = () => {
      saving.value = true
      axiosClient
        .post("/social-media-links/bulk-update", {
          links: links.value.map((link) => ({id: link.id, url: link.url || ""}))
        })
        .then((response) => {
          links.value = response.data.result || links.value
          Swal.fire({
            icon: "success",
            text: t("global.social-media-updated-successfully"),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            text: t("global.something-went-wrong"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
        })
        .finally(() => {
          saving.value = false
        })
    }

    onBeforeMount(() => {
      getLinks()
    })

    return {t, loading, saving, links, saveLinks}
  }
})
</script>

<style scoped>
.social-media-card {
  overflow: hidden;
}

.social-link-row {
  display: grid;
  grid-template-columns: minmax(220px, 280px) 1fr;
  gap: 1.5rem;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid #eff2f5;
  border-radius: 0.95rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
}

.social-link-platform {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.social-link-icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  color: var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.1);
  border-radius: 12px;
  font-size: 1.25rem;
}

.social-link-input {
  min-width: 0;
}

@media (max-width: 767.98px) {
  .social-link-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
