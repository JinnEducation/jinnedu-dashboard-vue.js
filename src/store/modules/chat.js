import axios from "@/plugins/axios"
import {initEcho} from "@/plugins/echo"
import {makeChatRoom} from "@/utils/chatRoom"

export default {
  namespaced: true,

  state: () => ({
    contacts: [],
    activeContactId: null,
    messages: {}, // { contactId: [] }
    typing: {}, // { contactId: boolean }
    loadingContacts: false,
    loadingMessages: false
  }),

  mutations: {
    SET_CONTACTS(state, contacts) {
      state.contacts = contacts
    },

    SET_ACTIVE_CONTACT(state, contactId) {
      state.activeContactId = contactId
    },

    SET_MESSAGES(state, {contactId, messages}) {
      state.messages[contactId] = messages
    },

    ADD_MESSAGE(state, {contactId, message}) {
      if (!state.messages[contactId]) {
        state.messages[contactId] = []
      }
      state.messages[contactId].push(message)
    },

    SET_TYPING(state, {contactId, status}) {
      state.typing[contactId] = status
    }
  },

  actions: {
    async fetchContacts({commit}) {
      commit("SET_CONTACTS", [])
      const {data} = await axios.get("/chat/contacts")
      commit("SET_CONTACTS", data.data ?? data)
    },

    async openChat({commit, dispatch}, contactId) {
      commit("SET_ACTIVE_CONTACT", contactId)
      await dispatch("fetchMessages", contactId)
      dispatch("subscribeToRoom", contactId)
    },

    async fetchMessages({commit}, contactId) {
      const {data} = await axios.get(`/chat/${contactId}/messages`)
      commit("SET_MESSAGES", {contactId, messages: data.data ?? data})
    },

    async sendMessage({state}, message) {
      if (!state.activeContactId) return

      await axios.post("/chat/messages", {
        to_user: state.activeContactId,
        message
      })
    },
    async setTyping(_, {contactId, status}) {
      await axios.post(`/chat/${contactId}/typing`, {status})
    },

    subscribeToRoom({rootState, state, commit}, contactId) {
      const userId = rootState.user.user.id
      const room = makeChatRoom(userId, contactId)
      // const echo = initEcho(rootState.user.token)
      const echo = rootState.app.echo

      if (!echo) {
        console.warn("Echo not initialized")
        return
      }

      echo
        .private(`chat.${room}`)
        .listen(".message.sent", (e) => {
          console.log("RECEIVED MESSAGE", e)
          const msg = e?.message ?? e
          commit("ADD_MESSAGE", {
            contactId,
            message: msg
          })
        })
        .listen(".typing.updated", (e) => {
          console.log("RECEIVED TYPING", e)
          commit("SET_TYPING", {
            contactId: e.from_user,
            status: e.status
          })
        })
    }
  }
}
