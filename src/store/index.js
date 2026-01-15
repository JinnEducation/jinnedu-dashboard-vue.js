import {createStore} from "vuex"
import chat from "./modules/chat"
import {initEcho} from "@/plugins/echo"
import axiosClient from "../plugins/axios"
const serverUrl = import.meta.env.VITE_APP_API_BASE_URL
const serverBaseUrl = import.meta.env.VITE_APP_SERVER_BASE_URL

const store = createStore({
  state: {
    userInfo: localStorage.getItem("user"),
    user: {token: localStorage.getItem("TOKEN") || null, data: {}},
    language: localStorage.getItem("LANGUAGE") || null,
    language_id: localStorage.getItem("LANGUAGE_ID") || null,
    languages: JSON.parse(localStorage.getItem("LANGUAGES")) || null,
    navigation: JSON.parse(localStorage.getItem("NAVIGATION")) || null,
    loading: false,
    // Session control state
    lastActivity: null,
    sessionWarning: false,
    inactivityTimer: null,
    warningTimer: null,
    sessionCheckInterval: null,
    sessionWarningCountdown: 60,
    echo: null
  },
  getters: {
    user(state) {
      return state.user
    },
    language(state) {
      return state.language
    },
    languageId(state) {
      return state.language_id
    },
    languages(state) {
      return state.languages
    },
    navigation(state) {
      return state.navigation
    },
    isSuperAdmin(state) {
      return state.user.data?.role === "SuperAdmin"
    },
    isAuthenticated(state) {
      return !!state.user.token
    },
    sessionWarning(state) {
      return state.sessionWarning
    },
    sessionWarningCountdown(state) {
      return state.sessionWarningCountdown
    }
  },
  actions: {
    // Existing actions
    setLanguage({commit, state}, data) {
      if (typeof data === "string") commit("SET_LANGUAGE", data)
      else {
        const languages = Object.keys(state.languages).map((key) => state.languages[key].shortname)
        const language = languages.find((languagesItem) =>
          data.find((item) =>
            item.split(new RegExp(languagesItem, "gi")).length - 1 > 0 ? languagesItem : null
          )
        )
        commit("SET_LANGUAGE", language)
      }
    },

    setLanguageId({commit, state}, data) {
      if (typeof data === "string") {
        commit("SET_LANGUAGE_ID", data)
      } else if (Array.isArray(data)) {
        const language = Object.values(state.languages).find((lang) => {
          return data.includes(lang.id) || data.includes(lang.shortname)
        })
        if (language) {
          commit("SET_LANGUAGE_ID", language.id)
        }
      }
    },

    async getAPILanguages({commit}) {
      return axiosClient.get("/locales/langs").then((response) => {
        commit("SET_LANGUAGES", response.data.data)
        return response.data.data
      })
    },

    async getAPINavigation({commit}) {
      return axiosClient.get("/navigation").then((response) => {
        commit("SET_NAVIGATION", response.data)
        return response.data
      })
    },

    async changeName(_, data) {
      return axiosClient.post("/update-profile", data).then((response) => {
        return response.data
      })
    },

    async signUp({commit}, data) {
      try {
        const response = await axiosClient.post("/register", data)
        if (response.data.success) {
          commit("SET_USER", response.data.result)
          return response.data.result
        }
        throw new Error(response.data.message)
      } catch (error) {
        return Promise.reject(error.message)
      }
    },

    // Enhanced signIn with session control
    async signIn({commit, dispatch}, data) {
      try {
        const response = await axiosClient.post("/login", data)
        // response.data.result.token
        if (response.data.success) {
          commit("SET_USER", response.data.result)
          window.open(`${serverBaseUrl}/bridge-login/${response.data.result.token}`, "_blank")
          // For SuperAdmin, invalidate any existing sessions
          if (response.data.result.user.role === "SuperAdmin") {
            await axiosClient.post("/api/session/invalidate-others")
          }

          // Initialize session tracking
          await dispatch("initSessionTracking")

          return response.data.result
        }
        return response
      } catch (error) {
        throw error
      }
    },

    async signInWithGoogle({commit}, data) {
      return axiosClient.post("/social_login", data).then((response) => {
        if (response.data.success) {
          commit("SET_USER", response.data.result)
          return response.data.result
        }
        return response
      })
    },

    // Enhanced signOut with session cleanup
    async signOut({commit, state}, {reason} = {}) {
      try {
        await axiosClient.post("/logout")

        // Clear all timers and intervals
        if (state.inactivityTimer) clearTimeout(state.inactivityTimer)
        if (state.warningTimer) clearTimeout(state.warningTimer)
        if (state.sessionCheckInterval) clearInterval(state.sessionCheckInterval)

        const {userInfo} = store.state
        const userInfoObject = JSON.parse(userInfo)
        window.open(`${serverBaseUrl}/bridge-logout/${userInfoObject.token}`, "_blank")
        commit("UN_SET_USER")

        // Return different messages based on logout reason
        if (reason === "inactivity") {
          return {message: "You have been automatically logged out due to inactivity."}
        }
        if (reason === "concurrent") {
          return {message: "You have been logged out because your account is active elsewhere."}
        }
        return {message: "You have been successfully logged out."}
      } catch (error) {
        if (error.response?.data?.message === "Unauthenticated.") {
          commit("UN_SET_USER")
        }
        throw error
      }
    },

    async fetchWallet({commit}) {
      return axiosClient
        .get(`${serverUrl}/wallet/balance`)
        .then((response) => {
          // console.log(response)
          return response
        })
        .catch((error) => {
          if (error.response.data.message === "Unauthenticated.") {
            commit("UN_SET_USER")
          }
          throw error
        })
    },

    async passwordForgot(_, data) {
      return axiosClient.post("/forgot-password", data).then((response) => {
        return response.data
      })
    },

    async resetPassword(_, data) {
      return axiosClient.post("/reset-password", data).then((response) => {
        return response.data
      })
    },

    unsetUser({commit}) {
      commit("UN_SET_USER")
    },

    // Session control actions
    async checkConcurrentSessions({commit, getters, dispatch}) {
      if (!getters.isSuperAdmin) return

      try {
        const response = await axiosClient.get("/api/session/check")
        if (response.data.hasActiveSessionElsewhere) {
          await dispatch("signOut", {reason: "concurrent"})
          throw new Error("You have been logged out because your account is active elsewhere.")
        }
      } catch (error) {
        console.error("Session check failed:", error)
        throw error
      }
    },

    initSessionTracking({commit, dispatch, state, getters}) {
      // Clear any existing timers
      if (state.inactivityTimer) clearTimeout(state.inactivityTimer)
      if (state.warningTimer) clearTimeout(state.warningTimer)
      if (state.sessionCheckInterval) clearInterval(state.sessionCheckInterval)

      // Update last activity time
      commit("UPDATE_LAST_ACTIVITY")

      // For SuperAdmin, check sessions every minute
      if (getters.isSuperAdmin) {
        state.sessionCheckInterval = setInterval(() => {
          dispatch("checkConcurrentSessions")
        }, 60000)
      }

      // Set up 15-minute inactivity timer
      dispatch("resetInactivityTimer")
    },

    resetInactivityTimer({commit, state}) {
      // Clear existing timers
      if (state.inactivityTimer) clearTimeout(state.inactivityTimer)
      if (state.warningTimer) clearTimeout(state.warningTimer)

      // Reset countdown
      commit("SET_SESSION_WARNING_COUNTDOWN", 60)

      // Set warning at 14 minutes
      state.warningTimer = setTimeout(() => {
        commit("SET_SESSION_WARNING", true)

        // Start countdown
        const countdownInterval = setInterval(() => {
          if (state.sessionWarningCountdown <= 1) {
            clearInterval(countdownInterval)
          }
          commit("DECREMENT_SESSION_WARNING_COUNTDOWN")
        }, 1000)
      }, 14 * 60 * 1000)

      // Set logout at 30 minutes
      state.inactivityTimer = setTimeout(() => {
        this.dispatch("signOut", {reason: "inactivity"})
      }, 30 * 60 * 1000)

      // Update last activity
      commit("UPDATE_LAST_ACTIVITY")
    },

    recordUserActivity({commit, dispatch}) {
      commit("UPDATE_LAST_ACTIVITY")
      dispatch("resetInactivityTimer")
    },

    extendSession({commit, dispatch}) {
      commit("SET_SESSION_WARNING", false)
      commit("SET_SESSION_WARNING_COUNTDOWN", 60)
      dispatch("resetInactivityTimer")
    },
    initEcho({commit, rootState}) {
      const token = rootState.user.token
      const echo = initEcho(token)

      commit("SET_ECHO", echo)
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user.token = user.token
      state.user.data = user.user
      localStorage.removeItem("TOKEN")
      localStorage.removeItem("user")
      sessionStorage.removeItem("activeSession")
      localStorage.setItem("TOKEN", user.token)
      localStorage.setItem("user", JSON.stringify(user))
      sessionStorage.setItem("activeSession", "true")
      state.lastActivity = Date.now()
    },

    UN_SET_USER(state) {
      state.user.token = null
      state.user.data = {}
      localStorage.removeItem("TOKEN")
      localStorage.removeItem("user")
      sessionStorage.removeItem("activeSession")
      state.lastActivity = null
      state.sessionWarning = false
      state.sessionWarningCountdown = 60
    },

    SET_LANGUAGE(state, language) {
      state.language = language
      localStorage.setItem("LANGUAGE", language)
    },

    SET_LANGUAGE_ID(state, languageID) {
      state.language_id = languageID
      localStorage.setItem("LANGUAGE_ID", languageID)
    },

    SET_LANGUAGES(state, languages) {
      state.languages = languages
      localStorage.setItem("LANGUAGES", JSON.stringify(languages))
    },

    SET_NAVIGATION(state, navigation) {
      state.navigation = navigation
      localStorage.setItem("NAVIGATION", JSON.stringify(navigation))
    },

    // Session control mutations
    UPDATE_LAST_ACTIVITY(state) {
      state.lastActivity = Date.now()
    },

    SET_SESSION_WARNING(state, value) {
      state.sessionWarning = value
    },

    SET_SESSION_WARNING_COUNTDOWN(state, value) {
      state.sessionWarningCountdown = value
    },

    DECREMENT_SESSION_WARNING_COUNTDOWN(state) {
      state.sessionWarningCountdown--
    },
    SET_ECHO(state, echo) {
      state.echo = echo
      window.Echo = echo
    }
  },
  modules: {
    chat
  }
})

export default store
