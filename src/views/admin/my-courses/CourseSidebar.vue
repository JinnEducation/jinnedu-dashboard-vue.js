<template>

    <aside class="course-sidebar" :class="{ closed: !sidebarOpen }">
        <button class="sidebar-toggle" @click="toggleSidebar">
            {{ sidebarOpen ? '❮' : '❯' }}
        </button>

        <template v-if="sidebarOpen">

            <div class="sidebar-header">
                <h3 class="course-title">
                    {{ typeof courseTitle == "object" ? courseTitle[languageId] : courseTitle }}
                </h3>
            </div>
            <div class="progress-wrapper">
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
                </div>
                <span>{{ progressPercent }}%</span>
            </div>
            <div class="rating-box">
                <div class="rating-title">
                    {{ t("global.rate_course") }}
                </div>

                <div class="stars">
                    <button v-for="n in 5" :key="n" class="star" :class="{ active: n <= (hoverStars || stars) }"
                        @mouseenter="hoverStars = n" @mouseleave="hoverStars = 0" @click="rateCourse(n)" type="button">
                        ★
                    </button>
                </div>

                <button v-if="statusRating" class="comment-link" @click="openComment">
                    {{ t("global.comment") }}
                </button>
            </div>
            <div v-for="section in sections" :key="section.id" class="section">
                <!-- Section Header -->
                <div class="section-header" @click="toggleSection(section.id)">
                    <div class="section-left">
                        <!-- Icon (section completed or not) -->
                        <div class="icon" :class="{ complate: isSectionCompleted(section) }">
                            <div v-if="isSectionCompleted(section)">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor"
                                        d="M9 16.17 5.53 12.7a1 1 0 0 0-1.41 1.41l4.18 4.18a1 1 0 0 0 1.41 0L20.29 7.71a1 1 0 1 0-1.41-1.41z" />
                                </svg>
                            </div>
                            <div v-else>

                            </div>
                        </div>

                        <span class="section-title">
                            {{ getTitle(section) }}
                        </span>
                    </div>

                    <span class="arrow">
                        {{ openSections.includes(section.id) ? '▾' : '▸' }}
                    </span>
                </div>

                <!-- Section Items -->
                <div v-if="openSections.includes(section.id)" class="section-items">
                    <div v-for="item in section.items" :key="item.id" class="item"
                        :class="{ active: item.id === activeItemId }" @click="selectItem(item.id)">
                        <div class="icon" :class="{ complate: item.completed }">
                            <div v-if="item.completed">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor"
                                        d="M9 16.17 5.53 12.7a1 1 0 0 0-1.41 1.41l4.18 4.18a1 1 0 0 0 1.41 0L20.29 7.71a1 1 0 1 0-1.41-1.41z" />
                                </svg>
                            </div>
                            <div v-else>
                            </div>
                        </div>

                        <span class="item-title">
                            {{ getTitle(item) }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="section" v-if="hasCertificate && (progressPercent == 100)">
                <!-- Section Header -->
                <div class="section-header" @click="selectCourseCertificate">
                    <div class="section-left">
                        <!-- Icon (section completed or not) -->
                        <div class="icon complate">
                            <!-- <div>
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor"
                                        d="M9 16.17 5.53 12.7a1 1 0 0 0-1.41 1.41l4.18 4.18a1 1 0 0 0 1.41 0L20.29 7.71a1 1 0 1 0-1.41-1.41z" />
                                </svg>
                            </div> -->
                        </div>

                        <span class="section-title">
                            {{ t("global.course_certificate") }}
                        </span>
                    </div>

                    <span class="arrow">
                        ▸
                    </span>
                </div>
            </div>
        </template>

        <template v-else>
            <div v-for="section in sections" :key="section.id" class="section">
                <!-- Section Header -->
                <div class="section-header" @click="toggleSidebar">
                    <div class="section-left">
                        <!-- Icon (section completed or not) -->
                        <div class="icon" :class="{ complate: isSectionCompleted(section) }">
                            <div v-if="isSectionCompleted(section)">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor"
                                        d="M9 16.17 5.53 12.7a1 1 0 0 0-1.41 1.41l4.18 4.18a1 1 0 0 0 1.41 0L20.29 7.71a1 1 0 1 0-1.41-1.41z" />
                                </svg>
                            </div>
                            <div v-else>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </aside>
    <!-- Comment Modal -->
    <div v-if="commentOpen" class="modal-overlay" @click.self="closeComment">
        <div class="modal-box">
            <h4 class="modal-title">
                {{ t("global.write_comment") }}
            </h4>

            <textarea v-model="comment" class="modal-textarea" :placeholder="t('global.comment_placeholder')"
                rows="4"></textarea>

            <div class="modal-actions">
                <button class="btn" @click="closeComment">
                    {{ t("global.cancel") }}
                </button>

                <button class="btn btn-primary" :disabled="saving || !stars" @click="saveReview">
                    {{ saving ? t("global.saving") : t("global.save") }}
                </button>
            </div>
        </div>
    </div>


</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import axiosClient from "@/plugins/axios"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
/* =========================
  PROPS
========================= */
const props = defineProps({
    sections: {
        type: Array,
        required: true
    },
    activeItemId: {
        type: Number,
        default: null
    },
    courseTitle: {
        type: String,
        default: null
    },
    courseId: {
        type: Number,
        default: null
    },
    languageId: {
        type: Number,
        default: null
    },
    progressPercent: {
        type: Number,
        default: null
    },
    initialStars: {
        type: Number,
        default: null
    },
    hasCertificate: {
        type: Number,
        default: null
    },
    initialComment: {
        type: String,
        default: null
    },
})

/* =========================
  EMITS
========================= */
const emit = defineEmits(['selectItem','selectCertificate','updateStart'])

/* =========================
  STATE
========================= */
const openSections = ref([])

/* =========================
  INIT
========================= */
watch(
    () => props.sections,
    (sections) => {
        // افتح أول Section تلقائيًا
        if (sections.length && openSections.value.length === 0) {
            openSections.value.push(sections[0].id)
        }
    },
    { immediate: true }
)

/* =========================
  METHODS
========================= */
const toggleSection = (sectionId) => {
    if (openSections.value.includes(sectionId)) {
        openSections.value = openSections.value.filter(id => id !== sectionId)
    } else {
        openSections.value.push(sectionId)
    }
}

const selectItem = (itemId) => {
    emit('selectItem', itemId)
}

const selectCourseCertificate = () => {
    emit('selectCertificate')
}

const isSectionCompleted = (section) => {
    return section.items.length > 0 &&
        section.items.every(item => item.completed)
}

const getTitle = (obj) => {
    // يدعم langs أو title مباشر
    if (obj.title) {
        return obj.title[props.languageId]
    }
    return obj.title || '—'
}

const sidebarOpen = ref(true)

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

const stars = ref(props.initialStars || 0)
const hoverStars = ref(0)
const commentOpen = ref(false)
const comment = ref(props.initialComment || '')

const rateCourse = async (n) => {
    stars.value = n
    await saveReview()
}

const saving = ref(false)
const statusRating = ref(false)

/* فتح المودال */
const openComment = () => {
    if (!stars.value) return // لازم يكون مقيم أول
    commentOpen.value = true
}

/* إغلاق */
const closeComment = () => {
    commentOpen.value = false
}

/* حفظ (نفس سجل التقييم) */
const saveReview = async () => {
    if (!stars.value) return

    saving.value = true
    statusRating.value = false

    try {
        await axiosClient.post(
            `/admin/student/courses/${props.courseId}/reviews`,
            {
                rating: stars.value,          // ✅ الاسم الصحيح
                comment: comment.value || null,
            }
        )

        commentOpen.value = false
        emit('updateStart',stars.value)
    } catch (e) {
        console.error(e)
    } finally {
        saving.value = false
        statusRating.value = true
    }
}

onMounted(() => {
    if (stars.value > 0) {
        statusRating.value = true
    }
})

</script>

<style scoped>
.sidebar-header {
    padding: 12px;
    border-bottom: 1px solid #eee;
}

.course-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
}

.course-sidebar {
    width: 360px;
    border-right: 1px solid #e5e5e5;
    padding: 12px;
    position: relative;
    transition: all 0.3s;
    /* ضروري */
}

.sidebar-toggle {
    position: absolute;
    right: -18px !important;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    z-index: 5;
    box-shadow: 0 4px 10px rgba(0, 0, 0, .12);
    display: flex;
    align-items: center;
    justify-content: center;
}

.course-sidebar.closed {
    width: 72px;
    /* أو display:none لو بدك */
}

.section {
    margin-bottom: 12px;
    overflow-x: hidden;
    overflow-y: auto;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
}

.section-header:hover {
    background: #f5f5f5;
}

.section-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.section-title {
    font-weight: 600;
}

.section-items {
    margin-top: 6px;
    padding-left: 30px;
}

.item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    cursor: pointer;
    border-radius: 8px;
}

.item:hover {
    background: #f5f5f5;
}

.item.active {
    background: #eaf3ff;
}

.icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    user-select: none;
    color: rgb(255, 255, 255);
    background-color: inherit;
    border: 2px dashed rgb(11, 157, 160);
}

.icon.complate {
    background-color: rgb(11, 157, 160);
    border: 2px dashed rgb(11, 157, 160);
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

.rating-box {
    padding: 14px 12px;
    border-top: 1px solid #eee;
}

.rating-title {
    font-size: 14px;
    color: #444;
    margin-bottom: 6px;
}

.stars {
    display: flex;
    gap: 6px;
}

.star {
    background: none;
    border: none;
    font-size: 24px;
    color: #d1d5db;
    cursor: pointer;
    padding: 0;
}

.star.active {
    color: #f59e0b;
}

.comment-link {
    margin-top: 6px;
    background: none;
    border: none;
    color: #2563eb;
    font-size: 13px;
    cursor: pointer;
    padding: 0;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-box {
    width: 100%;
    max-width: 380px;
    background: #fff;
    border-radius: 14px;
    padding: 16px;
}

.modal-title {
    margin: 0 0 10px;
    font-weight: 600;
}

.modal-textarea {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    resize: none;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.sidebar-header,
.rating-box {
    border-bottom: 1px solid #f1f1f1;
}


.btn {
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
}

.btn-primary {
    background: #0d9488;
    border-color: #0d9488;
    color: #fff;
}
</style>
