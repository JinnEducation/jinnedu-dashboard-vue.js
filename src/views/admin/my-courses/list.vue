<template>
    <toolbar :title="courseType == 'completed'
        ? t('global.completed_courses')
        : courseType == 'unfinished'
            ? t('global.unfinished_courses')
            : t('global.my-courses-management')" />

    <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-xxl">
            <div class="card">
                <div class="card-header border-0 pt-6">
                    <div class="card-title">
                        <div class="d-flex align-items-center position-relative my-1">
                            <span class="svg-icon svg-icon-1 position-absolute ms-6">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                    fill="none">
                                    <rect x="17" y="15" rx="1" width="8" height="2" transform="rotate(45 17 15)"
                                        fill="currentColor" opacity="0.5" />
                                    <path
                                        d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                                        fill="currentColor" />
                                </svg>
                            </span>
                            <label for="search-menu" class="sr-only">{{ t("global.search-courses") }}</label>
                            <input id="search-menu" type="text" name="search-menu"
                                :placeholder="t('global.search-courses')" data-kt-content-table-filter="search"
                                class="form-control form-control-solid w-250px ps-14"
                                @keyup.enter="searchDataTableBodyRows" />
                        </div>
                    </div>
                </div>
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
                        {{ t("global.no_courses") }}
                    </div>

                    <div v-else class="grid">
                        <div v-for="c in courses" :key="c.id" class="card">

                            <!-- Course Image -->
                            <div class="course-image" v-if="c.course_image">
                                <img :src="c.course_image" :alt="c.title[languageId]" />
                            </div>

                            <!-- Card Top -->
                            <div class="card-top">
                                <div class="course-title">
                                    {{ typeof c.title == "object" ? c.title[languageId] : c.title }}
                                </div>
                                <div class="course-desc" v-if="c.description">
                                    {{ typeof c.description == "object" ? c.description[languageId] : c.description }}
                                </div>
                            </div>

                            <!-- Progress -->
                            <div class="progress-wrapper">
                                <div class="progress-bar">
                                    <div class="progress-fill" :style="{ width: c.progress_percent + '%' }"></div>
                                </div>
                                <span>{{ c.progress_percent }}%</span>
                            </div>

                            <!-- Actions -->
                            <div class="actions">
                                <div class="progress-sub">
                                    <span>{{ c.completed_items }} / {{ c.total_items }}</span>
                                    <span>{{ t('global.lessons') }}</span>
                                </div>

                                <button class="btn" @click="goToCourse(c.id)">
                                    {{ t('global.continue') }}
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
import { useRouter, useRoute } from 'vue-router'
import axiosClient from '@/plugins/axios' // عدّل المسار حسب مشروعك
import { useI18n } from "vue-i18n"
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import { useStore } from "vuex"

const store = useStore()
const languages = computed(() => store.state.languages)
const languageId = ref(null)
const lang = languages.value.find((element) => element.shortname === store.state.language)
languageId.value = lang ? lang.id : null

const router = useRouter()
const { t } = useI18n()
const loading = ref(true)
const error = ref('')
const courses = ref([])
const route = useRoute()
const courseType = computed(() => route.meta.type || 'all')

const fetchMyCourses = async () => {
    loading.value = true
    error.value = ''

    try {
        const { data } = await axiosClient.get(
            '/admin/student/courses/my-courses',
            {
                params: {
                    type: courseType.value
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
    router.push(`/my-courses/${courseId}/index`) // عدّل المسار حسب routing عندك
}

onMounted(fetchMyCourses)
watch(
    () => route.fullPath,
    () => fetchMyCourses()
)
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
    justify-content: space-between;
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
