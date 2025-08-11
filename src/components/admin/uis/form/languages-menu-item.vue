<template>
  <div class="menu-item px-3" @click="setLanguage" @keypress="setLanguage">
    <a :href="link" class="menu-link d-flex px-5">
      <span v-if="icon" class="symbol symbol-20px me-4">
        <img :src="icon" :alt="`${t(`languages.${name}`)} Flag`" class="rounded-1" />
      </span>
      <span>{{ t(`languages.${name}`) }}</span>
    </a>
  </div>
</template>

<script>
import {defineComponent} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "languages-menu-item",
  props: {
    name: {type: String, required: true},
    icon: {type: String, required: true},
    link: {type: String, required: true}
  },
  emits: ["setLanguage"],
  setup(_, {emit}) {
    const {t} = useI18n()
    const setLanguage = function setLanguage() {
      emit("setLanguage")
    }

    return {t, setLanguage}
  }
})
</script>
