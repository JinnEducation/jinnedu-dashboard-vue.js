<template>
  <div v-if="!id" class="alert alert-warning">
    {{ t("global.save_course_first") }}
  </div>

  <template v-else>
    <!-- ================= INTRO SESSION ================= -->
    <IntroSessionEditor
      :intro-session="introSession"
      @create="createIntroSession"
      @save="saveIntroSession"
      @delete="deleteIntroSession" />

    <!-- ================= SECTIONS ================= -->
    <div>
      <div class="d-flex justify-content-between align-items-center mb-5">
        <h3 class="m-0">{{ t("global.sections") }}</h3>
        <el-button type="primary" plain @click="addSection">
          + {{ t("global.add_section") }}
        </el-button>
      </div>

      <SectionEditor
        v-for="(section, sIdx) in sections"
        :key="section.id || sIdx"
        :section="section"
        :section-index="sIdx"
        :items="sectionItems(section.id)"
        :active-lang="activeLang"
        :language-id="languageId"
        :default-section-slug="DEFAULT_SECTION_SLUG"
        :show-move-up="showMoveUp"
        :show-move-down="showMoveDown"
        @save-title="saveSectionTitle"
        @save="saveSection"
        @delete="deleteSection"
        @add-item="addItem"
        @save-item="saveItem"
        @delete-item="deleteItem"
        @move-item="moveItem" />
    </div>
  </template>
</template>

<script>
/* eslint-disable vue/no-mutating-props, no-param-reassign */
import {defineComponent, ref, computed, onMounted} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"
import Swal from "sweetalert2"
import IntroSessionEditor from "./IntroSessionEditor.vue"
import SectionEditor from "./SectionEditor.vue"

export default defineComponent({
  name: "course-content-tab",
  components: {
    IntroSessionEditor,
    SectionEditor
  },
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    data: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const {t} = useI18n()
    const store = useStore()
    const route = useRoute()

    const languages = computed(() => store.state.languages)
    const languageId = ref(null)
    const langNow = languages.value.find((element) => element.shortname === store.state.language)
    languageId.value = langNow ? langNow.id : null

    const activeLang = computed(() => store.state.language || "ar")

    const courseId = computed(() => props.id || route.params.id)

    // <!-- ================= INTRO SESSION ================= -->
    const introSession = ref(null)

    const createIntroSession = () => {
      // Initialize title object with all language keys
      const titleObj = {}
      languages.value.forEach((lang) => {
        titleObj[lang.id] = ""
      })

      introSession.value = {
        id: null,
        type: "intro",
        section_id: null,
        is_free_preview: true,
        duration_seconds: null,
        content_source: "zoom",
        title: titleObj,
        zoom_meeting_id: null,
        zoom_start_at: null,
        external_video_url: null,
        instructor_id: props?.data?.instructor_id || null
      }
    }

    const saveIntroSession = async (session) => {
      if (!courseId.value) return

      let typeIntro = "intro"
      if (session.content_source === "zoom") {
        typeIntro = "intro_zoom"
      } else {
        typeIntro = "intro_recording"
      }
      const payload = {
        type: typeIntro,
        section_id: null,
        is_free_preview: session.is_free_preview,
        duration_seconds: session.duration_seconds,
        content_source: session.content_source,
        langs: languages.value.map((lang) => ({
          lang: lang.shortname,
          title: session.title?.[lang.id] || session.title?.[lang.shortname] || "",
          description:
            session.description?.[lang.id] || session.description?.[lang.shortname] || null
        })),
        zoom_start_at: session.zoom_start_at,
        external_video_url: session.external_video_url,
        instructor_id: props?.data?.instructor_id || null
      }

      try {
        if (session.id) {
          payload.append("_method", "PUT")
          await axiosClient.post(`/admin/items/${session.id}`, payload)
        } else {
          const res = await axiosClient.post(`/admin/courses/${courseId.value}/items`, payload)
          introSession.value.id = res.data.item?.id || res.data.data.id
        }
        Swal.fire({
          icon: "success",
          text: t("global.saved-successfully"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-primary"}
        })
      } catch (e) {
        Swal.fire({
          icon: "error",
          text: e.response?.data?.message || t("global.error-saving"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      }
    }

    const deleteIntroSession = async () => {
      if (!introSession.value.id) {
        introSession.value = null
        return
      }

      try {
        await axiosClient.delete(`/admin/items/${introSession.value.id}`)
        introSession.value = null
        Swal.fire({
          icon: "success",
          text: t("global.deleted-successfully"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-primary"}
        })
      } catch (e) {
        Swal.fire({
          icon: "error",
          text: e.response?.data?.message || t("global.error-deleting"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      }
    }

    // <!-- ================= sections ================= -->
    const sections = ref([]) // كل السكاشن
    const items = ref([]) // كل العناصر (flat) ثم نوزعها على sections

    const contentLoading = ref(false)

    // أول سكشن افتراضي (غير قابل للحذف)
    const DEFAULT_SECTION_SLUG = "default-content"

    const sortSections = async () => {
      if (!courseId.value) return
      const orderedIds = sections.value.map((s) => s.id).filter(Boolean)
      if (orderedIds.length === 0) return
      await axiosClient.post(`/admin/courses/${courseId.value}/sections/sort`, {ids: orderedIds})
    }

    const addSection = () => {
      // Initialize title object with all language keys
      const titleObj = {}
      languages.value.forEach((lang) => {
        titleObj[lang.id] = ""
      })

      sections.value.push({
        id: null,
        _isNew: true,
        _saving: false,
        title: titleObj
      })
    }

    const saveSection = async (section) => {
      if (!courseId.value) return

      section._saving = true

      try {
        if (!section.id) {
          // CREATE
          const res = await axiosClient.post(`/admin/courses/${courseId.value}/sections`, {
            title: section.title
          })

          const s = res.data.data || res.data.result?.data

          section.id = s.id
          section._isNew = false
        } else {
          // UPDATE
          await axiosClient.put(`/admin/sections/${section.id}`, {title: section.title})
        }

        await sortSections()
      } finally {
        section._saving = false
      }
    }

    const saveSectionTitle = async (section) => {
      await axiosClient.put(`/admin/sections/${section.id}`, {
        title: section.title || {}
      })
    }

    const deleteSection = async (section) => {
      if (!section.id) {
        sections.value = sections.value.filter((s) => s !== section)
        return
      }

      await axiosClient.delete(`/admin/sections/${section.id}`)
      sections.value = sections.value.filter((s) => s.id !== section.id)

      await sortSections()
    }

    const sectionItems = (sectionId) => {
      return items.value
        .filter((i) => i.section_id === sectionId && i.type !== "intro")
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    }

    const sortItems = async () => {
      if (!courseId.value) return
      // ترتيب عالمي لكل العناصر (يسهل على الباك)
      const orderedIds = items.value
        .filter((i) => i.type !== "intro" && i.id)
        .sort((a, b) => {
          // حسب ترتيب sections ثم sort_order داخلها
          const sa = sections.value.findIndex((s) => s.id === a.section_id)
          const sb = sections.value.findIndex((s) => s.id === b.section_id)
          if (sa !== sb) return sa - sb
          return (a.sort_order || 0) - (b.sort_order || 0)
        })
        .map((i) => i.id)

      if (orderedIds.length === 0) return
      await axiosClient.post(`/admin/courses/${courseId.value}/items/sort`, {ids: orderedIds})
    }

    const addItem = (sectionId) => {
      if (!courseId.value) return

      items.value.push({
        id: null,
        _isNew: true,
        _saving: false,

        section_id: sectionId,
        sort_order: sectionItems(sectionId).length,

        type: "lesson_video",
        is_free_preview: false,
        duration_seconds: null,

        title: {},
        description: {},

        content_source: "upload",
        zoom_start_at: null,
        external_video_url: null
      })
    }

    const saveItem = async (item) => {
      if (!courseId.value) return

      item._saving = true

      try {
        if (!item.id) {
          // CREATE
          const res = await axiosClient.post(`/admin/courses/${courseId.value}/items`, {
            section_id: item.section_id,
            type: item.type,
            is_free_preview: item.is_free_preview ? 1 : 0,
            duration_seconds: item.duration_seconds,
            content_source: item.content_source,
            langs: languages.value.map((lang) => ({
              lang: lang.shortname,
              title: item.title?.[lang.id] || item.title?.[lang.shortname] || "",
              description: item.description?.[lang.id] || item.description?.[lang.shortname] || null
            })),
            zoom_start_at: item.zoom_start_at,
            external_video_url: item.external_video_url,
            instructor_id: props?.data?.instructor_id || null
          })

          const it = res.data.data || res.data.result?.data

          item.id = it.id
          item.sort_order = it.sort_order ?? item.sort_order
          item._isNew = false
        } else {
          // UPDATE
          await axiosClient.post(`/admin/items/${item.id}`, {
            section_id: item.section_id,
            type: item.type,
            is_free_preview: item.is_free_preview ? 1 : 0,
            duration_seconds: item.duration_seconds,
            content_source: item.content_source,

            langs: languages.value.map((lang) => ({
              lang: lang.shortname,
              title: item.title?.[lang.id] || item.title?.[lang.shortname] || "",
              description: item.description?.[lang.id] || item.description?.[lang.shortname] || null
            })),

            zoom_start_at: item.zoom_start_at,
            external_video_url: item.external_video_url,
            instructor_id: props?.data?.instructor_id || null,
            _method: "PUT"
          })
        }

        Swal.fire({
          icon: "success",
          text: t("global.saved-successfully"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-primary"}
        })
        await sortItems()
      } catch (e) {
        console.log(e)
        Swal.fire({
          icon: "error",
          text: e.response?.data?.message || t("global.error-saving"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      } finally {
        item._saving = false
      }
    }

    const deleteItem = async (item) => {
      // لو لسه جديد وما انحفظ
      if (!item.id) {
        items.value = items.value.filter((i) => i !== item)
        return
      }

      await axiosClient.delete(`/admin/items/${item.id}`)
      items.value = items.value.filter((i) => i.id !== item.id)

      await sortItems()
    }

    const setToStartOfSection = (item, targetSectionId) => {
      // نجعلها 0 والباقي نرفعهم
      const list = sectionItems(targetSectionId)
      list.forEach((i) => {
        i.sort_order = (i.sort_order ?? 0) + 1
      })
      item.sort_order = 0
    }

    const swapPositions = (a, b) => {
      const ap = a.sort_order ?? 0
      const bp = b.sort_order ?? 0
      a.sort_order = bp
      b.sort_order = ap
    }

    const setToEndOfSection = (item, targetSectionId) => {
      const list = sectionItems(targetSectionId)
      const maxPos = list.length ? Math.max(...list.map((i) => i.sort_order ?? 0)) : 0
      item.sort_order = maxPos + 1
    }

    /**
     * حركة ديناميكية:
     * - داخل نفس السكشن: swap
     * - آخر عنصر + down => ينتقل لأول السكشن اللي بعده
     * - أول عنصر + up => ينتقل لآخر السكشن اللي قبله
     */
    const moveItem = async (payload) => {
      const {sectionId, index, direction} = payload
      const sIndex = sections.value.findIndex((s) => s.id === sectionId)
      if (sIndex === -1) return

      const currentItems = sectionItems(sectionId)
      const item = currentItems[index]
      if (!item) return

      const isUp = direction === "up"
      const isDown = direction === "down"

      // داخل نفس السكشن
      if (isUp && index > 0) {
        const prev = currentItems[index - 1]
        swapPositions(item, prev)
        await sortItems()
        return
      }

      if (isDown && index < currentItems.length - 1) {
        const next = currentItems[index + 1]
        swapPositions(item, next)
        await sortItems()
        return
      }

      // بين السكاشن
      if (isUp && index === 0 && sIndex > 0) {
        const prevSection = sections.value[sIndex - 1]
        item.section_id = prevSection.id
        // ضعها آخر واحدة في القسم السابق
        setToEndOfSection(item, prevSection.id)
        await saveItem(item)
        await sortItems()
        return
      }

      if (isDown && index === currentItems.length - 1 && sIndex < sections.value.length - 1) {
        const nextSection = sections.value[sIndex + 1]
        item.section_id = nextSection.id
        // ضعها أول واحدة في القسم التالي
        setToStartOfSection(item, nextSection.id)
        await saveItem(item)
        await sortItems()
        return
      }
    }

    const showMoveUp = (sectionId, idx) => {
      const sIndex = sections.value.findIndex((s) => s.id === sectionId)

      // إذا أول عنصر، يظهر سهم لفوق فقط لو في قسم فوقه
      if (idx === 0) return sIndex > 0
      return true
    }

    const showMoveDown = (sectionId, idx) => {
      const sIndex = sections.value.findIndex((s) => s.id === sectionId)
      const list = sectionItems(sectionId)

      // إذا آخر عنصر، يظهر سهم لتحت فقط لو في قسم بعده
      if (idx === list.length - 1) return sIndex < sections.value.length - 1
      return true
    }

    onMounted(() => {
      if (!courseId.value) return

      contentLoading.value = true

      Promise.all([
        axiosClient.get(`/admin/courses/${courseId.value}/sections`),
        axiosClient.get(`/admin/courses/${courseId.value}/items`)
      ])
        .then(([secRes, itemsRes]) => {
          const secData = secRes.data.data || secRes.data.result?.data || secRes.data || []
          const itemsData = itemsRes.data.data || itemsRes.data.result?.data || itemsRes.data || []

          // console.log(secRes)
          // console.log(itemsRes)
          // Sections
          sections.value = (secData || [])
            .map((s) => ({
              id: s.id,
              slug: s.slug || null,
              sort_order: s.sort_order ?? 0,
              title: s.title || {} // object by lang id
            }))
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

          // Items
          items.value = (itemsData || [])
            .map((it) => ({
              id: it.id,
              course_id: it.course_id,
              section_id: it.section_id, // null allowed for intro
              sort_order: it.sort_order ?? 0,
              type: it.type, // intro / lesson_video / workshop...
              is_free_preview: !!it.is_free_preview,
              duration_seconds: it.duration_seconds ?? null,

              title: it.title || {}, // object by lang id
              description: it.description || {}, // object by lang id (nullable)

              // skeleton fields (stored)
              content_source: it.content_source || "upload", // zoom/upload/url
              zoom_start_at: it.zoom_start_at ?? null,
              external_video_url: it.external_video_url ?? null,
              instructor_id: props?.data?.instructor_id || null
            }))
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

          // Intro Session: نستخرجها من items (section_id null + type intro)
          const intro = items.value.find(
            (i) => i.type === "intro" || i.type === "intro_zoom" || i.type === "intro_recording"
          )
          if (intro) {
            let contentSource = "zoom"
            if (intro.type === "intro_zoom") {
              contentSource = "zoom"
            }
            if (intro.type === "intro_recording") {
              contentSource = "upload"
            }
            introSession.value = {
              id: intro.id,
              type: intro.type,
              section_id: null,
              is_free_preview: !!intro.is_free_preview,
              duration_seconds: intro.duration_seconds ?? null,
              content_source: contentSource || "zoom",
              zoom_start_at: intro.zoom_start_at ?? null,
              external_video_url: intro.external_video_url ?? null,
              title: intro.title || {}
            }
            // Remove the intro item from items.value list
            items.value = items.value.filter((i) => i.id !== intro.id)
          }
        })
        .catch(() => {
          sections.value = []
          items.value = []
        })
        .finally(() => {
          contentLoading.value = false
        })
    })

    return {
      t,
      id: courseId.value,
      languageId,
      activeLang,
      introSession,
      createIntroSession,
      saveIntroSession,
      deleteIntroSession,
      sections,
      items,
      contentLoading,
      DEFAULT_SECTION_SLUG,
      addSection,
      saveSectionTitle,
      deleteSection,
      saveSection,
      sortSections,
      sectionItems,
      addItem,
      saveItem,
      deleteItem,
      sortItems,
      moveItem,
      showMoveUp,
      showMoveDown
    }
  }
})
</script>
