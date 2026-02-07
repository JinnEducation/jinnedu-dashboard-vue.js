<template>
    <toolbar :title="t('global.my-certificates-management')" />
    <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-xxl">
            <div class="card">
                <template v-if="loading">
                    <div class="card-body p-0">
                        <div class="card-px text-center py-20 my-10">
                            <div role="status" class="spinner-border text-primary">
                                <span class="visually-hidden">{{ t("global.loading") }}...</span>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-if="courses.length === 0" class="state">
                        {{ t("global.no_certificates") }}
                    </div>

                    <div v-else class="grid">
                        <div v-for="c in courses" :key="c.id" class="card">

                            <!-- Course Image -->
                            <div class="course-image" v-if="c.course_image">
                                <img :src="c.course_image" :alt="c.title" />
                            </div>

                            <!-- Card Top -->
                            <div class="card-top">
                                <div class="course-title">{{ typeof c.title == "object" ? c.title[languageId] : c.title }}</div>
                            </div>

                            <!-- Actions -->
                            <div class="actions">
                                <button class="btn" @click="goToCourse(c.id)">
                                    {{ t('global.export') }}
                                </button>
                            </div>

                        </div>
                    </div>

                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axiosClient from '@/plugins/axios' // عدّل المسار حسب مشروعك
import { useI18n } from "vue-i18n"
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import { useStore } from "vuex"

const store = useStore()
const languages = computed(() => store.state.languages)
const languageId = ref(null)
const lang = languages.value.find((element) => element.shortname === store.state.language)
languageId.value = lang ? lang.id : null

const { t } = useI18n()
const loading = ref(true)
const error = ref('')
const courses = ref([])
const BASE_URL = ref(import.meta.env.VITE_APP_BASE_URL)

const fetchMyCourses = async () => {
    loading.value = true
    error.value = ''

    try {
        const { data } = await axiosClient.get(
            '/admin/student/courses/my-courses',
            {
                params: {
                    type: 'completed'
                }
            }
        )
        courses.value = Array.isArray(data) ? data : (data.data || [])
    } catch (e) {
        error.value = e?.response?.data?.message || 'فشل جلب دوراتي.'
    } finally {
        loading.value = false
    }
}

const goToCourse = (courseId) => {
    window.open(
        `${BASE_URL.value}/admin/student/courses/${courseId}/certificate`,
        "_blank"
    )
}

onMounted(fetchMyCourses)
</script>

<style scoped>
.my-courses-page {
    padding: 20px;
}

.header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 14px;
}

.title {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
}

.meta {
    font-size: 13px;
    color: #666;
}

.state {
    padding: 18px;
    border: 1px solid #eee;
    border-radius: 12px;
    background: #fafafa;
}

.state.error {
    border-color: #fca5a5;
    background: #fff1f2;
    color: #991b1b;
}

.grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
}

@media (max-width: 1100px) {
    .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 700px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

.card {
    border: 1px solid #eee;
    border-radius: 14px;
    background: #fff;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.course-image {
    width: 100%;
    height: 160px;
    overflow: hidden;
    border-radius: 12px;
    background: #f3f4f6;
}

.course-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}


.card-top {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.course-title {
    font-weight: 700;
    font-size: 16px;
    line-height: 1.3;
}

.course-desc {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    max-height: 40px;
    overflow: hidden;
}

.progress-wrapper {
    padding: 10px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
}

.progress-bar {
    height: 6px;
    width: 100%;
    background: #eee;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #0d9488;
}

.actions {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.btn {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid #0d9488;
    background: #0d9488;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
}

.progress-sub {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid #0d9488;
    background: #0d9488;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    gap: 4px;
}
</style>
