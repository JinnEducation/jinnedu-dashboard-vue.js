<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div class="m-0 d-flex justify-content-start align-items-center">
    <button
      type="button"
      data-kt-menu-trigger="click"
      data-kt-menu-placement="bottom-start"
      data-kt-menu-offset="0px, 0px"
      class="btn btn-flex btn-link rotate">
      <img
        :src="`${language.icon}`"
        :alt="`${t(language.name)} Flag`"
        class="w-25px h-25px rounded-circle me-3" />
      <span class="text-capitalize me-2">{{ t(`languages.${language.name}`) }}</span>
      <span class="svg-icon svg-icon-3 svg-icon-muted rotate-180 m-0">
        <arrow-down-icon />
      </span>
    </button>
    <div
      data-kt-menu="true"
      class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-4">
      <languages-menu-item
        v-for="item in languages"
        :key="item.name"
        :name="item.name"
        :icon="item.icon"
        :link="item.link"
        @set-language="setLanguage(item.shortname)" />
    </div>
    <a
      href="https://learning.jinnedu.com/"
      target="blank"
      class="btn btn-outline d-flex align-items-center btn-outline-dashed btn-outline-primary btn-active-light-primary ms-5">
      <span class="svg-icon svg-icon-2 me-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <g fill="none" fill-rule="evenodd">
            <rect x="0" y="0" width="24" height="24" />
            <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.5" />
            <path
              d="M11.7357634,20.9961946 C6.88740052,20.8563914 3,16.8821712 3,12 C3,11.9168367 3.00112797,11.8339369 3.00336944,11.751315 C3.66233009,11.8143341 4.85636818,11.9573854 4.91262842,12.4204038 C4.9904938,13.0609191 4.91262842,13.8615942 5.45804656,14.101772 C6.00346469,14.3419498 6.15931561,13.1409372 6.6267482,13.4612567 C7.09418079,13.7815761 8.34086797,14.0899175 8.34086797,14.6562185 C8.34086797,15.222396 8.10715168,16.1034596 8.34086797,16.2636193 C8.57458427,16.423779 9.5089688,17.54465 9.50920913,17.7048097 C9.50956962,17.8649694 9.83857487,18.6793513 9.74040201,18.9906563 C9.65905192,19.2487394 9.24857641,20.0501554 8.85059781,20.4145589 C9.75315358,20.7620621 10.7235846,20.9657742 11.7357634,20.9960544 L11.7357634,20.9961946 Z M8.28272988,3.80112099 C9.4158415,3.28656421 10.6744554,3 12,3 C15.5114513,3 18.5532143,5.01097452 20.0364482,7.94408274 C20.069657,8.72412177 20.0638332,9.39135321 20.2361262,9.6327358 C21.1131932,10.8600506 18.0995147,11.7043158 18.5573343,13.5605384 C18.7589671,14.3794892 16.5527814,14.1196773 16.0139722,14.886394 C15.4748026,15.6527403 14.1574598,15.137809 13.8520064,14.9904917 C13.546553,14.8431744 12.3766497,15.3341497 12.4789081,14.4995164 C12.5805657,13.664636 13.2922889,13.6156126 14.0555619,13.2719546 C14.8184743,12.928667 15.9189236,11.7871741 15.3781918,11.6380045 C12.8323064,10.9362407 11.963771,8.47852395 11.963771,8.47852395 C11.8110443,8.44901109 11.8493762,6.74109366 11.1883616,6.69207022 C10.5267462,6.64279981 10.170464,6.88841096 9.20435656,6.69207022 C8.23764828,6.49572949 8.44144409,5.85743687 8.2887174,4.48255778 C8.25453994,4.17415686 8.25619136,3.95717082 8.28272988,3.80112099 Z M20.9991771,11.8770357 C20.9997251,11.9179585 21,11.9589471 21,12 C21,16.9406923 17.0188468,20.9515364 12.0895088,20.9995641 C16.970233,20.9503326 20.9337111,16.888438 20.9991771,11.8770357 Z"
              fill="currentColor"
              opacity="1" />
          </g>
        </svg>
      </span>
      {{ t("global.home") }}
    </a>
  </div>
</template>

<script>
import {computed, defineComponent, onBeforeMount, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useStore} from "vuex"
import {getI18nLanguages} from "../../../../plugins/i18n"
import ArrowDownIcon from "../../icons/arrow-down-icon.vue"
import LanguagesMenuItem from "./languages-menu-item.vue"

export default defineComponent({
  name: "form-footer",
  components: {LanguagesMenuItem, ArrowDownIcon},
  setup() {
    const {t} = useI18n()
    const store = useStore()
    const language = ref(null)
    const languages = computed(() => store.state.languages)

    const getLanguage = function getLanguage() {
      return languages.value.find(
        (item) => item.shortname === computed(() => store.state.language).value
      )
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

    return {t, language, languages, setLanguage}
  }
})
</script>
