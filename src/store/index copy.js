const store = createStore({
  state: {
    userInfo: sessionStorage.getItem("user"),
    user: {token: sessionStorage.getItem("TOKEN") || null, data: {}},
    language: localStorage.getItem("LANGUAGE") || null,
    language_id: localStorage.getItem("LANGUAGE_ID") || null,
    languages: JSON.parse(localStorage.getItem("LANGUAGES")) || null,
    navigation: JSON.parse(localStorage.getItem("NAVIGATION")) || null,
    loading: false
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
    }
  },
  actions: {
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
        console.error("Sign up error:", error.message)
        Swal.fire({
          icon: "error",
          text: error.message || "An error occurred during registration",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
        return Promise.reject(error.message)
      }
    },
    async signIn({commit}, data) {
      return axiosClient.post("/login", data).then((response) => {
        if (response.data.success) {
          commit("SET_USER", response.data.result)
          return response.data.result
        }
        return response
      })
    },
    async signOut({commit}) {
      return axiosClient.post("/logout").then((response) => {
        commit("UN_SET_USER")
        return response
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
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user.token = user.token
      state.user.data = user.user
      sessionStorage.setItem("TOKEN", user.token)
      sessionStorage.setItem("user", JSON.stringify(user))
    },
    UN_SET_USER(state) {
      state.user.token = null
      state.user.data = {}
      sessionStorage.removeItem("TOKEN")
      sessionStorage.removeItem("user")
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
    }
  }
})

export default store
