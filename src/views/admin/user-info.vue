<template>
  <toolbar :title="t('global.profile-information')" />

  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <!-- Loading -->
      <div v-if="loading" class="card card-xl-stretch mb-5 mb-xl-7">
        <div class="card-body">
          <p class="mb-0">{{ t("global.loading-profile") }}...</p>
        </div>
      </div>

      <div v-else class="row g-5">
        <!-- LEFT: Personal Info -->
        <div class="col-12 col-lg-6">
          <div class="card card-xl-stretch mb-5 mb-xl-7">
            <div class="card-header border-0 pt-5">
              <h3 class="card-title align-items-start flex-column mb-0">
                <span class="card-label fw-bold text-dark">
                  {{ t("global.personal-info") }}
                </span>
              </h3>
            </div>

            <div class="card-body pt-0">
              <!-- Avatar + Name -->
              <div class="d-flex align-items-center gap-4 mb-6">
                <div class="symbol symbol-60px symbol-circle overflow-hidden">
                  <img
                    v-if="profile?.avatar"
                    :src="profile?.avatar"
                    alt="avatar"
                    class="object-fit-cover" />
                  <div v-else class="symbol-label bg-light text-gray-600 fw-bold">
                    {{ (about?.first_name || profile?.name || "U").toString().charAt(0) }}
                  </div>
                </div>

                <div class="d-flex flex-column">
                  <span class="fw-bold text-gray-900 fs-5">
                    {{ fullName }}
                  </span>
                  <span class="text-gray-600">
                    {{ about?.email || profile?.email || "-" }}
                  </span>
                </div>
              </div>

              <!-- Info List -->
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">{{ t("global.first_name") }}</span>
                  <span class="fw-semibold text-gray-900">{{ about?.first_name || "-" }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">{{ t("global.last_name") }}</span>
                  <span class="fw-semibold text-gray-900">{{ about?.last_name || "-" }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">{{ t("global.phone") }}</span>
                  <span class="fw-semibold text-gray-900">{{ about?.phone || "-" }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">{{ t("global.country") }}</span>
                  <span class="fw-semibold text-gray-900">
                    {{ about?.country?.name || "-" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template v-if="isTutor">
          <!-- Tutor Description -->
          <div class="col-12 col-lg-6">
            <div class="card card-xl-stretch mb-5">
              <div class="card-header border-0 pt-5">
                <h3 class="card-title fw-bold text-dark">
                  {{ t("global.tutor-details") }}
                </h3>
              </div>

              <div class="card-body pt-0" v-if="profile.descriptions?.length">
                <div class="mb-4">
                  <div class="text-gray-600">{{ t("global.headline") }}</div>
                  <div class="fw-semibold">{{ profile.descriptions[0].headline || "-" }}</div>
                </div>

                <div class="mb-4">
                  <div class="text-gray-600">{{ t("global.interests") }}</div>
                  <div class="fw-semibold">{{ profile.descriptions[0].interests || "-" }}</div>
                </div>

                <div class="mb-4">
                  <div class="text-gray-600">{{ t("global.motivation") }}</div>
                  <div class="fw-semibold">{{ profile.descriptions[0].motivation || "-" }}</div>
                </div>

                <div class="mb-4">
                  <div class="text-gray-600">{{ t("global.experience") }}</div>
                  <div class="fw-semibold">{{ profile.descriptions[0].experience || "-" }}</div>
                </div>

                <div>
                  <div class="text-gray-600">{{ t("global.methodology") }}</div>
                  <div class="fw-semibold">{{ profile.descriptions[0].methodology || "-" }}</div>
                </div>
              </div>

              <div class="card-body pt-0 text-muted" v-else>
                {{ t("global.no-data") }}
              </div>
            </div>
          </div>
          <!-- Availability -->
          <div class="col-12 col-lg-6">
            <div class="card card-xl-stretch mb-5">
              <div class="card-header border-0 pt-5">
                <h3 class="card-title fw-bold text-dark">
                  {{ t("global.availability") }}
                </h3>
              </div>

              <div class="card-body pt-0">
                <div
                  v-for="(a, index) in profile.availabilities"
                  :key="index"
                  class="d-flex justify-content-between mb-2">
                  <span class="text-gray-600">{{ a.day?.name }}</span>
                  <span class="fw-semibold"> {{ a.hour_from }} - {{ a.hour_to }} </span>
                </div>

                <div v-if="!profile.availabilities?.length" class="text-muted">
                  {{ t("global.no-data") }}
                </div>
              </div>
            </div>
          </div>
          <!-- Hourly Rate -->
          <div class="col-12 col-lg-6">
            <div class="card card-xl-stretch mb-5">
              <div class="card-header border-0 pt-5">
                <h3 class="card-title fw-bold text-dark">
                  {{ t("global.hourly-rate") }}
                </h3>
              </div>

              <div class="card-body pt-0">
                <span class="fw-semibold fs-4">
                  {{ profile.hourlyPrices?.[0]?.price ?? "-" }}
                </span>
              </div>
            </div>
          </div>
          <!-- Certifications -->
          <div class="col-12 col-lg-6">
            <div class="card card-xl-stretch mb-5">
              <div class="card-header border-0 pt-5">
                <h3 class="card-title fw-bold text-dark">
                  {{ t("global.certifications") }}
                </h3>
              </div>

              <div class="card-body pt-0">
                <div
                  v-for="(cert, index) in profile.certifications"
                  :key="index"
                  class="mb-4 border-bottom pb-3">
                  <div class="fw-semibold">{{ cert.name }}</div>
                  <div class="text-gray-600">{{ cert.issued_by }}</div>
                  <div class="text-gray-500">{{ cert.year_from }} - {{ cert.year_to }}</div>

                  <a
                    v-if="cert.file_path"
                    :href="cert.file_path"
                    target="_blank"
                    class="text-primary fw-semibold">
                    {{ t("global.view-file") }}
                  </a>
                </div>

                <div v-if="!profile.certifications?.length" class="text-muted">
                  {{ t("global.no-data") }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="col-12 col-lg-6">
          <div class="card card-xl-stretch mb-5 mb-xl-7">
            <div class="card-header border-0 pt-5">
              <h3 class="card-title align-items-start flex-column mb-0">
                <span class="card-label fw-bold text-dark">
                  {{ t("global.financial-info") }}
                </span>
              </h3>
            </div>

            <div class="card-body pt-0">
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">{{ t("global.balance") }}</span>
                  <span class="fw-semibold text-gray-900">{{ financial?.balance ?? "-" }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">{{ t("global.group_classes_count") }}</span>
                  <span class="fw-semibold text-gray-900">{{
                    financial?.group_class_count ?? "-"
                  }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">{{ t("global.trial_lesson_count") }}</span>
                  <span class="fw-semibold text-gray-900">{{
                    financial?.trial_lesson_count ?? "-"
                  }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">{{ t("global.private_lesson_count") }}</span>
                  <span class="fw-semibold text-gray-900">{{
                    financial?.private_lesson_count ?? "-"
                  }}</span>
                </div>

                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">{{ t("global.package_count") }}</span>
                  <span class="fw-semibold text-gray-900">{{
                    financial?.package_count ?? "-"
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, computed, onMounted} from "vue"
import {useI18n} from "vue-i18n"
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import axiosClient from "@/plugins/axios"

export default defineComponent({
  name: "UserInfo",
  components: {Toolbar},

  setup() {
    const {t} = useI18n()

    const profile = ref({})
    const financial = ref({})
    const loading = ref(true)
    const userType = computed(() => profile.value?.type ?? null)
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const PUBLIC_PATH = ref(import.meta.env.VITE_APP_Public_URL)

    const isTutor = computed(() => userType.value === 2)

    // ===== Computed (واضحة وبسيطة)
    const about = computed(() => {
      return profile.value?.abouts?.[0] || null
    })

    const fullName = computed(() => {
      if (!about.value) return "-"
      return [about.value.first_name, about.value.last_name].filter(Boolean).join(" ") || "-"
    })

    // ===== Load data
    const loadProfile = async () => {
      try {
        const res = await axiosClient.get("/profileUser")
        profile.value = res.data?.result || {}
      } catch (e) {
        profile.value = {}
      }
    }

    const loadFinancial = async () => {
      try {
        const res = await axiosClient.get("/user-info")
        financial.value = res.data || {}
      } catch (e) {
        financial.value = {}
      }
    }

    // ===== Lifecycle
    onMounted(async () => {
      loading.value = true
      await Promise.all([loadProfile(), loadFinancial()])
      loading.value = false
    })

    return {
      t,
      profile,
      financial,
      loading,
      PUBLIC_PATH,
      SERVER_PATH,
      about,
      fullName,
      userType,
      isTutor
    }
  }
})
</script>
