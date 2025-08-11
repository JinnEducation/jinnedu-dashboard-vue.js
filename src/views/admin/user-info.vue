<template>
  <toolbar :title="t('global.tutor-information')" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <div class="card card-xl-stretch mb-5 mb-xl-7">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-dark">{{
              t("global.account-overview-title")
            }}</span>
          </h3>
        </div>
        <div class="card-body pt-5">
          <div class="row">
            <div class="col-md-6">
              <div v-if="!loading">
                <h3 class="card-title align-items-start flex-column">
                  <span class="card-label fw-bold text-dark">{{ t("global.personal-info") }}</span>
                </h3>
                <template v-if="profile.abouts[0]">
                  <p>
                    <strong>{{ t("global.first_name") }}:</strong>
                    {{ profile.abouts[0] ? profile.abouts[0].first_name : "" }}
                  </p>
                  <p>
                    <strong>{{ t("global.last_name") }}:</strong>
                    {{ profile.abouts[0] ? profile.abouts[0].last_name : "" }}
                  </p>
                  <p>
                    <strong>{{ t("global.phone") }}:</strong>
                    {{ profile.abouts[0] ? profile.abouts[0].phone : "" }}
                  </p>
                  <p>
                    <strong>{{ t("global.age") }}:</strong>
                    {{ profile.abouts[0] ? profile.abouts[0].age : "" }}
                  </p>
                  <p>
                    <strong>{{ t("global.country") }}:</strong>
                    {{ profile.abouts[0] ? profile.abouts[0].country.name : "" }}
                  </p>
                </template>
                <template v-else>
                  <p>
                    <strong>{{ t("global.name") }}:</strong> {{ profile.name }}
                  </p>
                  <p>
                    <strong>{{ t("global.email") }}:</strong> {{ profile.email }}
                  </p>
                </template>
                <!-- Add more properties as needed -->
              </div>
              <div v-else>
                <!-- Loading spinner or message -->
                <p>{{ t("global.loading-profile") }}...</p>
              </div>
            </div>

            <div class="col-md-6">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-dark">{{ t("global.financial-info") }}</span>
              </h3>
              <template v-if="financial">
                <p>
                  <strong>{{ t("global.balance") }}:</strong>
                  {{ financial ? financial.balance : "" }}
                </p>
                <p>
                  <strong>{{ t("global.group_classes_count") }}:</strong>
                  {{ financial ? financial.group_class_count : "" }}
                </p>
                <p>
                  <strong>{{ t("global.trial_lesson_count") }}:</strong>
                  {{ financial ? financial.trial_lesson_count : "" }}
                </p>
                <p>
                  <strong>{{ t("global.private_lesson_count") }}:</strong>
                  {{ financial ? financial.private_lesson_count : "" }}
                </p>
                <p>
                  <strong>{{ t("global.package_count") }}:</strong>
                  {{ financial ? financial.package_count : "" }}
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import {defineComponent, onBeforeMount, ref} from "vue"
import {useI18n} from "vue-i18n"
import axiosClient from "../../plugins/axios"

export default defineComponent({
  name: "dashboard-index",
  components: {Toolbar},
  setup() {
    const {t} = useI18n()
    const profile = ref({})
    const financial = ref({})
    const loading = ref(true)

    onBeforeMount(() => {
      axiosClient
        .get("/profile")
        .then((response) => {
          profile.value = response.data.result

          axiosClient
            .get("/user-info")
            .then((res) => {
              financial.value = res.data
            })
            .finally(() => {
              loading.value = false
            })
        })
        .finally(() => {
          loading.value = false
        })
    })

    return {t, profile, financial, loading}
  }
})
</script>
