<template>
    <div class="course-player">
        <template v-if="loading">
            <div class="card course-main">
                <div class="card-body p-0">
                    <div class="card-px text-center py-20 my-10">
                        <div role="status" class="spinner-border text-primary">
                            <span class="visually-hidden">{{ t("global.loading") }}...</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <!-- Sidebar -->
            <CourseSidebar :sections="sections" :activeItemId="activeItem?.id" :courseId="courseId" :languageId="languageId"
                :courseTitle="courseTitle" :progressPercent="progressPercent" :initialStars="initialStars" :hasCertificate="hasCertificate"
                :initialComment="initialComment" @selectItem="setActiveItem" @updateStart="updateStart" @selectCertificate="selectCourseCertificate" />


            <!-- Main Content -->
            <div class="course-main">
                <CourseContent v-if="activeItem" :key="activeItem.id" :item="activeItem" @prev="goPrev" @next="goNext"
                    @complete="completeItem"  :languageId="languageId" />
                <CourseCertificate v-if="activeItemCertificate"  :courseId="courseId" :initialStars="initialStars" />
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axiosClient from "@/plugins/axios"
import CourseSidebar from "./CourseSidebar.vue"
import CourseContent from "./CourseContent.vue"
import CourseCertificate from "./CourseCertificate.vue"
import { useI18n } from "vue-i18n"
const { t } = useI18n()

import { useStore } from "vuex"

const store = useStore()
const languages = computed(() => store.state.languages)
const languageId = ref(null)
const lang = languages.value.find((element) => element.shortname === store.state.language)
languageId.value = lang ? lang.id : null


/* =========================
  ROUTE
========================= */
const route = useRoute()
// const courseId = 3
const courseId = route.params.id || route.params.course

/* =========================
  STATE
========================= */
const loading = ref(false)

const sections = ref([])       // Sections + items (للـ Sidebar)
const flatItems = ref([])      // items خطي (للتنقل)
const activeIndex = ref(0)     // index الحالي
const activeItemCertificate = ref(false)     // index الحالي

const courseTitle = ref('')
const hasCertificate = ref(0)
const initialStars = ref(0)
const initialComment = ref('')

/* =========================
  COMPUTED
========================= */
const activeItem = computed(() => {
    return flatItems.value[activeIndex.value] || null
})

const progressPercent = computed(() => {
    if (!flatItems.value.length) return 0
    const completed = flatItems.value.filter(i => i.completed).length
    return Math.round((completed / flatItems.value.length) * 100)
})

/* =========================
  API LOAD
========================= */
const loadPlayer = async () => {
    loading.value = true
    await axiosClient
        .get(`admin/student/courses/${courseId}/player`)
        .then((response) => {
            // 1) ركّب sections مع items
            sections.value = buildSections(response.data.sections, response.data.items)

            // 2) ابني flat list للتنقل
            flatItems.value = buildFlatItems(sections.value)

            // 3) حدّد العنصر النشط (أول غير مكتمل)
            activeIndex.value = findFirstUncompleted(flatItems.value)
            courseTitle.value = response.data.course?.title || ''
            hasCertificate.value = response.data.course?.has_certificate || 0
            initialStars.value = response.data.course?.review?.stars || 0
            initialComment.value = response.data.course?.review?.comment || ''
        })
        .finally(() => {
            loading.value = false
        })
}

/* =========================
  HELPERS
========================= */
const buildSections = (sectionsRaw, itemsRaw) => {
    const map = {}

    sectionsRaw.forEach(sec => {
        map[sec.id] = {
            ...sec,
            items: []
        }
    })

    itemsRaw.forEach(item => {
        if (map[item.section_id]) {
            map[item.section_id].items.push({
                ...item,
                completed: !!item.completed
            })
        }
    })

    return Object.values(map)
}

const buildFlatItems = (sections) => {
    const result = []
    sections.forEach(sec => {
        sec.items.forEach(item => result.push(item))
    })
    return result
}

const findFirstUncompleted = (items) => {
    const index = items.findIndex(i => !i.completed)
    return index !== -1 ? index : 0
}

/* =========================
  SIDEBAR ACTION
========================= */
const setActiveItem = (itemId) => {
    const index = flatItems.value.findIndex(i => i.id === itemId)
    if (index !== -1) {
        activeIndex.value = index
    }
    activeItemCertificate.value = false;
}
const selectCourseCertificate = () => {
    activeIndex.value = null;
    activeItemCertificate.value = true;
}
const updateStart = (start) => {
    initialStars.value = start;
}

/* =========================
  NAVIGATION
========================= */
const goNext = () => {
    if (activeIndex.value < flatItems.value.length - 1) {
        activeIndex.value++
    }
}

const goPrev = () => {
    if (activeIndex.value > 0) {
        activeIndex.value--
    }
}

/* =========================
  COMPLETE ITEM
========================= */
const completeItem = async () => {
    if (!activeItem.value) return

    const itemId = activeItem.value.id

    await axiosClient.post(
        `/admin/student/items/${itemId}/progress`,
        { status: 'completed' }
    )

    // 1) تحديث العنصر الحالي
    flatItems.value[activeIndex.value].completed = true

    // 2) تحديث نفس العنصر داخل sections (للـ Sidebar)
    sections.value.forEach(sec => {
        sec.items.forEach(it => {
            if (it.id === itemId) {
                it.completed = true
            }
        })
    })

    // 3) الانتقال تلقائيًا للعنصر التالي
    goNext()
}

/* =========================
  INIT
========================= */
onMounted(loadPlayer)
</script>


<style scoped>
.course-player {
    display: flex;
    height: 100%;
    position: relative;
    /* margin-top: 200px; */
}

.course-main {
    flex: 1;
}
</style>
