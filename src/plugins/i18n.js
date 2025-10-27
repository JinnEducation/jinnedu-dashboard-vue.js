// DONE REVIEWING: 25/06/2023
import messages from "@intlify/unplugin-vue-i18n/messages"
import axios from "axios"
import {createI18n} from "vue-i18n"
import store from "../store"
import axiosClient from "./axios"

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("LANGUAGE"),
  fallbackLocale: localStorage.getItem("LANGUAGE"),
  messages
})

const i18nLanguages = []

export const setI18nDirections = function setI18nDirections(language, direction) {
  // eslint-disable-next-line
  direction = direction === "rtl" ? direction : ""
  const HTML_ELEMENT = document.documentElement
  const BODY_ELEMENT = document.body
  const FONT_CSS_ELEMENT = document.getElementById("font-css-element")
  const KT_MENU_PLACEMENT_ELEMENTS = document.querySelectorAll("[data-kt-menu-placement]")

  HTML_ELEMENT.removeAttribute("lang")
  HTML_ELEMENT.removeAttribute("dir")
  HTML_ELEMENT.removeAttribute("direction")
  HTML_ELEMENT.setAttribute("lang", language)
  HTML_ELEMENT.setAttribute("dir", direction || "ltr")
  HTML_ELEMENT.setAttribute("direction", direction || "ltr")
  HTML_ELEMENT.style.direction = direction || "ltr"

  const fontCDN = "https://fonts.googleapis.com/css2"
  const fontURL =
    direction === "rtl"
      ? "Tajawal:wght@200;300;400;500;700;800;900"
      : "Inter:wght@100;200;300;400;500;600;700;800;900"

  const fontHREF = [fontCDN, ["family", fontURL].join("=")].join("?")
  BODY_ELEMENT.style.fontFamily = direction === "rtl" ? "Tajawal" : "Inter"
  FONT_CSS_ELEMENT.removeAttribute("href")
  FONT_CSS_ELEMENT.setAttribute("href", fontHREF)

  KT_MENU_PLACEMENT_ELEMENTS.forEach((element) => {
    const placement = element.getAttribute("data-kt-menu-placement")
    if (direction === "rtl") {
      if (placement === "bottom-start") element.setAttribute("data-kt-menu-placement", "bottom-end")
      if (placement === "right-start") element.setAttribute("data-kt-menu-placement", "left-start")
    }

    if (direction === "ltr") {
      if (placement === "bottom-end") element.setAttribute("data-kt-menu-placement", "bottom-start")
      if (placement === "left-start") element.setAttribute("data-kt-menu-placement", "right-start")
    }
  })
}

export const setI18nLanguages = function setI18nLanguages(language, direction) {
  i18n.locale = language
  i18n.global.locale.value = language
  axios.defaults.headers.common["Accept-Language"] = language
  setI18nDirections(language, direction)
  return language
}

export const getI18nLanguages = async function getI18nLanguages(language) {
  try {
    store.state.loading = true

    // حمّل اللغات لو مش موجودة
    let languages = store.state.languages
    if (!Array.isArray(languages) || !languages.length) {
      languages = await store.dispatch("getAPILanguages") // تأكد أنها ترجع Array
    }

    // طابق بالـ lowercase لتفادي اختلافات مثل ar vs ar-SA
    const langKey = String(language || '').toLowerCase()
    const matched = languages.find(l =>
      String(l.shortname || l.short_name || '').toLowerCase() === langKey
    )

    if (!matched) {
      console.warn(`Language "${language}" not found in languages array.`)
      // ممكن تختار ترجع هنا أو تكمل بفول باك
      store.state.loading = false
      return
    }

    const direction = matched.direction || 'ltr'

    if (i18nLanguages.includes(language)) {
      if (language !== i18n.locale) setI18nLanguages(language, direction)
      return
    }

    const { data } = await axiosClient.get(`/locales/lang/${language}?v=${Date.now()}`)
    i18nLanguages.push(language)
    i18n.global.setLocaleMessage(language, data)
    return setI18nLanguages(language, direction)

  } finally {
    setTimeout(() => { store.state.loading = false }, 1500)
  }
}


export default i18n
