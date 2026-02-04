<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div
    data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
    data-kt-menu-placement="left-start"
    data-kt-menu-offset="-15px, 0"
    class="menu-item px-5">
    <a href="#" class="menu-link px-5">
      <span class="menu-title position-relative">
        {{ t("global.language") }}
        <span
          class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
          {{ t(`languages.${language.name}`) }}
          <img
            :src="language.icon"
            :alt="`${language.name} Icon`"
            class="w-15px h-15px rounded-1 ms-2" />
        </span>
      </span>
    </a>
    <div class="menu-sub menu-sub-dropdown w-175px py-4">
      <div v-for="languageElement in languages" :key="languageElement.name" class="menu-item px-3">
        <a
          href="#"
          class="menu-link d-flex px-5"
          :class="{active: language.name === languageElement.name}"
          @click.prevent="setLanguage(languageElement.shortname)">
          <span class="symbol symbol-20px me-4">
            <img
              :src="languageElement.icon"
              :alt="`${languageElement.name} Icon`"
              class="rounded-1" />
          </span>
          {{ t(`languages.${languageElement.name}`) }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {getI18nLanguages} from "@/plugins/i18n"
import {computed, defineComponent, onBeforeMount, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useStore} from "vuex"

export default defineComponent({
  name: "navbar-languages-menu",
  setup() {
    const {t} = useI18n()
    const store = useStore()
    const languages = computed(() => store.state.languages)
    const language = ref(null)

    const getLanguage = function getLanguage() {
      const cb = (element) => element.shortname === computed(() => store.state.language).value
      return languages.value.find(cb)
    }

    const setLanguage = function setLanguage(languageSelected) {
      store.dispatch("setLanguage", languageSelected).then(() => {
        getI18nLanguages(languageSelected)
        language.value = getLanguage()
      })
    }
    onBeforeMount(() => {
      language.value = getLanguage()
    })

    return {
      t,
      languages,
      language,
      setLanguage
    }
  }
})
</script>
