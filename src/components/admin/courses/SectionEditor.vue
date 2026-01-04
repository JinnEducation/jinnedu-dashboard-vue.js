<template>
  <div class="card mb-6">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div class="card-title">
        <span class="fw-bold">
          {{ section.title?.[languageId] || section.title?.ar || t("global.section") }}
        </span>
      </div>

      <div class="d-flex gap-2">
        <!-- Edit title (languages tabs فقط للعنوان) -->
        <el-popover trigger="click" width="420">
          <template #reference>
            <el-button type="primary" plain size="small">
              {{ t("global.edit_title") }}
            </el-button>
          </template>

          <languages-tabs v-slot="slot">
            <div class="mb-3">
              <label class="form-label">{{ t("global.title") }}</label>
              <el-input
                :key="`section-${section.id || 'new'}-title-${slot.language.id}`"
                :model-value="section.title[slot.language.id] || ''"
                @update:model-value="section.title[slot.language.id] = $event" />
            </div>
          </languages-tabs>

          <div class="d-flex justify-content-end mt-3">
            <el-button type="primary" size="small" @click="$emit('save-title', section)">
              {{ t("global.save") }}
            </el-button>
          </div>
        </el-popover>

        <!-- Delete section (غير الافتراضي وبشرط ما فيه عناصر وممنوع حذف أول عنصر مهما كان) -->
        <template v-if="sectionIndex !== 0">
          <el-button
            type="danger"
            plain
            size="small"
            :disabled="section.slug === DEFAULT_SECTION_SLUG || items.length > 0"
            @click="$emit('delete', section)">
            {{ t("global.delete") }}
          </el-button>
        </template>
        <el-button type="primary" size="small" @click="$emit('save', section)">
          {{ t("global.save") }}
        </el-button>
      </div>
    </div>

    <div class="card-body">
      <!-- Items list -->
      <ItemEditor
        v-for="(item, idx) in items"
        :key="item.id || idx"
        :item="item"
        :index="idx"
        :section-id="section.id"
        :active-lang="activeLang"
        :show-move-up="showMoveUp(section.id, idx)"
        :show-move-down="showMoveDown(section.id, idx)"
        @save="handleItemSave"
        @delete="handleItemDelete"
        @move="(payload) => handleItemMove(payload, idx)" />

      <el-button type="primary" plain @click="$emit('add-item', section.id)">
        + {{ t("global.add_item") }}
      </el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
import {defineComponent} from "vue"
import {useI18n} from "vue-i18n"
import LanguagesTabs from "@/components/admin/languages-tabs.vue"
import ItemEditor from "./ItemEditor.vue"

export default defineComponent({
  name: "section-editor",
  components: {
    LanguagesTabs,
    ItemEditor
  },
  props: {
    section: {
      type: Object,
      required: true
    },
    sectionIndex: {
      type: Number,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    activeLang: {
      type: String,
      required: true
    },
    languageId: {
      type: [String, Number],
      required: true
    },
    DEFAULT_SECTION_SLUG: {
      type: String,
      default: "default-content"
    },
    showMoveUp: {
      type: Function,
      required: true
    },
    showMoveDown: {
      type: Function,
      required: true
    }
  },
  emits: ["save-title", "save", "delete", "add-item", "save-item", "delete-item", "move-item"],
  setup(props, {emit}) {
    const {t} = useI18n()

    const handleItemSave = (item) => {
      emit("save-item", item)
    }

    const handleItemDelete = (item) => {
      emit("delete-item", item)
    }

    const handleItemMove = (payload, itemIndex) => {
      emit("move-item", {
        sectionId: props.section.id,
        index: itemIndex,
        direction: payload.direction
      })
    }

    return {
      t,
      handleItemSave,
      handleItemDelete,
      handleItemMove
    }
  }
})
</script>
