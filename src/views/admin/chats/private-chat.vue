<!-- DONE REVIEWING: updated for new Chat API + Echo (Real-time) -->
<template>
  <toolbar :title="t('global.private-chat-management')" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <div class="d-flex flex-column flex-lg-row">
        <!-- Sidebar -->
        <div class="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0">
          <div class="card card-flush">
            <div id="kt_chat_contacts_header" class="card-header pt-7">
              <div class="w-100 position-relative d-flex align-items-center" autocomplete="off">
                <span class="svg-icon svg-icon-1 position-absolute ms-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                    <rect x="17" y="15" rx="1" width="8" height="2" transform="rotate(45 17 15)" fill="currentColor"
                      opacity="0.5" />
                    <path
                      d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                      fill="currentColor" />
                  </svg>
                </span>
                <label for="search-private-chats" class="sr-only">
                  {{ t("global.search-name-email") }}
                </label>
                <input id="search-private-chats" v-model="usersPrivateChatsSearch" type="text"
                  name="search-private-chats" :placeholder="t('global.search-name-email')"
                  class="form-control form-control-solid px-13" @keyup.enter.prevent="searchUsersPrivateChats" />
              </div>
              <button class="btn btn-light-primary w-100 mb-3" @click="openNewChat = !openNewChat">
                {{ t('global.start-new-chat') }}
              </button>

              <!-- Start New Chat Users -->
              <div v-if="openNewChat" class="mb-5">

                <div class="mb-3">
                  <input v-model="newChatSearch" type="text" class="form-control form-control-solid"
                    :placeholder="t('global.search-name-email')" @keyup.enter="getNewChatUsers" />
                </div>

                <div v-if="newChatUsers.length === 0" class="text-muted text-center py-5">
                  {{ t('global.no-users-found') }}
                </div>

                <div v-for="user in newChatUsers" :key="user.id"
                  class="d-flex align-items-center py-3 px-2 rounded cursor-pointer hover-bg-light"
                  @click="startChatWithUser(user)">
                  <div class="symbol symbol-40px me-3">
                    <img v-if="user.avatar" :src="`${SERVER_PATH}/${user.avatar}`" alt="" />
                    <div v-else class="symbol-label bg-light-primary text-primary fw-bold">
                      {{ (user.name || user.email || '?').charAt(0).toUpperCase() }}
                    </div>
                  </div>

                  <div class="flex-grow-1">
                    <div class="fw-bold">{{ user.name }}</div>
                    <div class="text-muted fs-7">{{ user.email }}</div>
                  </div>
                </div>

                <hr />
              </div>

            </div>

            <div id="kt_chat_contacts_body" class="card-body pt-5">
              <div class="scroll-y me-n5 pe-5 h-420px h-lg-420px" data-kt-scroll="true"
                data-kt-scroll-activate="{default: true, lg: true}"
                data-kt-scroll-dependencies="#kt_header, #kt_app_header, #kt_toolbar, #kt_app_toolbar, #kt_footer, #kt_app_footer, #kt_chat_contacts_header"
                data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_contacts_body"
                data-kt-scroll-height="{default: '420px', lg: '420px'}" data-kt-scroll-max-height="420px"
                data-kt-scroll-offset="5px">
                <template v-for="(user, index) in usersPrivateChats" :key="index">
                  <div style="cursor: pointer" class="d-flex flex-stack py-4"
                    @click="openUserPrivateChat(user.contact_id)" @keypress="openUserPrivateChat(user.contact_id)">
                    <div class="d-flex align-items-center">
                      <template v-if="user.contact?.avatar">
                        <div class="symbol symbol-circle symbol-45px">
                          <img v-if="user.contact?.avatar !== null" :src="`${SERVER_PATH}/${user.contact?.avatar}`"
                            :alt="user.contact?.name" />
                          <img v-else
                            src="https://scotturb.com/wp-content/uploads/2016/11/product-placeholder-300x300.jpg"
                            alt="Default Image" />
                          <div class="symbol-badge start-100 top-100 border-4 h-8px w-8px ms-n2 mt-n2"
                            :class="user.online === 1 ? 'bg-success' : 'bg-danger'" />
                        </div>
                      </template>

                      <template v-else>
                        <div class="symbol symbol-circle symbol-45px"
                          style="background: url('/src/assets/media/svg/files/blank-image.svg')">
                          <div class="symbol-label fs-3 bg-light-warning text-warning">
                            {{ (user.contact?.name || '').charAt(0).toUpperCase() }}
                          </div>
                          <div class="symbol-badge start-100 top-100 border-4 h-8px w-8px ms-n2 mt-n2"
                            :class="user.online === 1 ? 'bg-success' : 'bg-danger'" />
                        </div>
                      </template>

                      <div class="ms-5">
                        <h3 class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">
                          {{ user.contact?.name || '' }}
                        </h3>

                        <div v-if="user.status === 1" class="fw-semibold text-muted">
                          <img src="/src/assets/media/gif/typing.gif" :alt="`${user.contact?.name || ''}`"
                            style="width: 50px" />
                        </div>

                        <div v-else-if="user[['last', 'msg'].join('_')] !== null" class="fw-semibold text-muted">
                          {{ user[["last", "msg"].join("_")] }}
                        </div>

                        <div v-else class="fw-semibold text-muted">
                          <span class="badge fs-7 m-1" :class="user.type === 1
                            ? 'badge-light-primary'
                            : user.type === 2
                              ? 'badge-light-success'
                              : 'badge-light-danger'
                            ">
                            {{
                              user.type === 1
                                ? t("global.student")
                                : user.type === 2
                                  ? t("global.tutor")
                                  : t("global.administrator")
                            }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex flex-column align-items-end ms-2">
                      <span class="text-muted fs-7 mb-1">
                        {{ getUserPrivateChatSinceTime(user[["since", "start"].join("_")]) }}
                      </span>
                      <span v-if="user['unseen'] > 0" class="badge badge-sm badge-circle badge-light-warning">
                        {{ user[["un", "seen"].join("")] }}
                      </span>
                    </div>
                  </div>
                  <div class="separator separator-dashed d-none"></div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat window -->
        <div class="flex-lg-row-fluid ms-lg-7 ms-xl-10">
          <div v-if="userPrivateChat" id="kt_chat_messenger" class="card">
            <div id="kt_chat_messenger_header" class="card-header">
              <div class="card-title">
                <div class="d-flex justify-content-center flex-column me-3">
                  <h2 class="fs-4 fw-bold text-gray-900 text-hover-primary me-1 mb-2 lh-1">
                    {{ userPrivateChat ? userPrivateChat.contact?.name : "-" }}
                  </h2>
                  <div class="mb-0 lh-1">
                    <span class="badge badge-circle w-10px h-10px me-1" :class="userPrivateChat
                      ? userPrivateChat.contact?.online
                        ? 'badge-success'
                        : 'badge-danger'
                      : 'badge-warning'
                      " />
                    <span class="fs-7 fw-semibold text-muted">
                      {{
                        userPrivateChat
                          ? userPrivateChat.contact?.online
                            ? t("global.online")
                            : t("global.offline")
                          : "-"
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div id="kt_chat_messenger_body" class="card-body">
              <div id="kt_chat_messenger_scroll" class="scroll-y me-n5 pe-5 h-300px h-lg-300px"
                data-kt-element="messages" data-kt-scroll="true" data-kt-scroll-activate="{default: true, lg: true}"
                data-kt-scroll-dependencies="#kt_header, #kt_app_header, #kt_app_toolbar, #kt_toolbar, #kt_footer, #kt_app_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer"
                data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_messenger_body"
                data-kt-scroll-height="{default: '300px', lg: '300px'}" data-kt-scroll-max-height="300px"
                data-kt-scroll-offset="5px">
                <template v-for="(userPrivateChatMessagesItem, index) in userPrivateChatMessages" :key="index">
                  <div class="d-flex mb-10"
                    :class="userPrivateChatMessagesItem.direction === 'start' ? 'justify-content-start' : 'justify-content-end'">
                    <div class="d-flex flex-column"
                      :class="userPrivateChatMessagesItem.direction === 'start' ? 'align-items-start' : 'align-items-end'">
                      <div class="d-flex align-items-center mb-2">
                        <template v-if="userPrivateChatMessagesItem[['from', 'user'].join('_')]?.avatar">
                          <div class="symbol symbol-circle symbol-35px">
                            <img
                              :src="`${SERVER_PATH}/${userPrivateChatMessagesItem[['from', 'user'].join('_')].avatar}`"
                              :alt="`${userPrivateChatMessagesItem[['from', 'user'].join('_')].name}`" />
                          </div>
                        </template>
                        <template v-else>
                          <div class="symbol symbol-circle symbol-35px"
                            style="background: url('/src/assets/media/svg/files/blank-image.svg')">
                            <div class="symbol-label fs-3 bg-light-warning text-warning">
                              {{
                                userPrivateChatMessagesItem[["from", "user"].join("_")]?.name
                                  ?.charAt(0)
                                  ?.toUpperCase()
                              }}
                            </div>
                          </div>
                        </template>

                        <div class="ms-3">
                          <h5 class="fs-5 fw-bold text-gray-900 text-hover-primary me-1">
                            {{ userPrivateChatMessagesItem[["from", "user"].join("_")]?.name }}
                          </h5>
                          <span class="text-muted fs-7 mb-1">
                            {{ getUserPrivateChatSinceTime(userPrivateChatMessagesItem[["since", "start"].join("_")]) }}
                          </span>
                        </div>
                      </div>

                      <div data-kt-element="message-text"
                        class="p-5 rounded bg-light-info text-dark fw-semibold mw-lg-400px text-start">
                        {{ userPrivateChatMessagesItem.message }}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <div id="kt_chat_messenger_footer" class="card-footer pt-4">
              <label for="user-private-chat-message" class="sr-only">
                {{ t("global.type-message") }}
              </label>
              <input id="user-private-chat-message" v-model="userPrivateChatMessage"
                :placeholder="t('global.type-message')" data-kt-element="input"
                class="form-control form-control-flush mb-3 px-0" @keyup.prevent="changeUserPrivateChatTypingStatus" />

              <p v-if="errorMessage" class="badge badge-light-danger fs-7 p-4 fw-bold d-block text-start">
                {{ errorMessage }}
              </p>

              <div class="d-flex flex-stack">
                <button type="button" data-kt-element="send" class="btn btn-primary" style="min-width: 92px"
                  @click="sendUserPrivateChatMessage()">
                  <span v-if="loadingSendMessage" class="svg-icon svg-icon-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" stroke="white" stroke-width="3" fill="transparent">
                        <animate attributeName="r" from="10" to="15" dur="1s" begin="0s" repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity" from="1" to="0" dur="1s" begin="0s"
                          repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </span>
                  <span v-else>{{ t("global.submit") }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty state (keep blank as your original layout did) -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import axiosClient from "@/plugins/axios"
import getMenuAbilities from "@/plugins/get-menu-abilities"
import store from "@/store"

import { computed, defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref, watch, nextTick } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

import { initEcho } from "@/plugins/echo"

export default defineComponent({
  name: "private-chat",
  components: { Toolbar },
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const path = computed(() => route.path)
    const userPrivateChatId = Number(route.query.user_id)

    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)

    // permissions
    const abilities = ref({
      index: false,
      create: false,
      edit: false,
      destroy: false,
      show: false,
      createStudentLink: false,
      createTutorLink: false
    })

    const loading = ref(false)
    const loadingSendMessage = ref(false)
    const errorMessage = ref(null)

    // sidebar contacts (existing chats)
    const usersPrivateChats = ref([])
    const usersPrivateChatsSearch = ref("")

    // current chat
    const userPrivateChat = ref(null) // {id, name, avatar, ...}
    const userPrivateChatMessages = ref([])
    const userPrivateChatReminderContact = ref(null) // contactId
    const userPrivateChatMessage = ref("")
    const userPrivateChatMessageAudio = ref(null)

    const userPrivateChatState = ref({
      typing: false
    })

    // Start New Chat
    const openNewChat = ref(false)
    const newChatUsers = ref([])
    const newChatSearch = ref("")

    const blockedWords = ref([])
    // Echo
    const echo = window.Echo
    const currentRoom = ref(null)
    let currentChannel = null

    const authUserId = () => Number(store.state.user?.user?.id || JSON.parse(localStorage.getItem("user")).user?.id || 0)
    const authToken = () => store.state.user?.token || JSON.parse(localStorage.getItem("user")).token || ""
    // ========= Helpers =========
    const normalizeList = (payload) => {
      // supports: paginator {data:[]}, {data:{data:[]}}, {result:{data:[]}}, []
      if (Array.isArray(payload)) return payload
      if (Array.isArray(payload?.data)) return payload.data
      if (Array.isArray(payload?.data?.data)) return payload.data.data
      if (Array.isArray(payload?.result?.data)) return payload.result.data
      if (Array.isArray(payload?.result)) return payload.result
      return []
    }

    const displayName = (u) => {
      if (!u) return "User"
      return u.name || u.email || "User"
    }


    // IMPORTANT: match backend room naming: 3_4
    const roomId = (a, b) => [Number(a), Number(b)].sort((x, y) => x - y).join("_")

    const scrollToBottom = async () => {
      await nextTick()

      const el = document.querySelector("#kt_chat_messenger_scroll")
      if (!el) return

      el.scrollTop = el.scrollHeight
    }

    const updateSidebarLocal = (otherId, lastMsg, lastMsgDate = null, incUnseen = false) => {
      const idx = usersPrivateChats.value.findIndex((c) => Number(c.contact_id) === Number(otherId))
      if (idx !== -1) {
        const c = usersPrivateChats.value[idx]
        c.last_msg = lastMsg ?? c.last_msg
        c.last_msg_date = lastMsgDate ?? c.last_msg_date
        if (incUnseen) c.unseen = Number(c.unseen || 0) + 1

        // move to top
        usersPrivateChats.value.splice(idx, 1)
        usersPrivateChats.value.unshift(c)
      }
    }


    // ========= Realtime =========
    const subscribeToRoom = (contactId) => {
      if (!window.Echo) return

      const myId = authUserId()
      // if (!myId || !contactId) return
      const room = roomId(myId, contactId)
      // already subscribed
      if (currentRoom.value === room) return

      // leave old
      try {
        if (currentChannel && currentRoom.value) {
          window.Echo.leave(`chat.${currentRoom.value}`)
        }
      } catch (_) { }

      currentRoom.value = room

      // IMPORTANT: channel must match backend: private-chat.{room}
      currentChannel = window.Echo
        .private(`chat.${roomId(myId, contactId)}`)
        .listen(".message.sent", (e) => {
          const msg = e?.message ?? e
          if (!msg) return
          const myId = authUserId()
          const fromId = Number(e.from_user ?? 0)
          const toId = Number(e.to_user ?? 0)
          const otherId = fromId === myId ? toId : fromId
          if (!otherId) return

          const msgRoom = roomId(myId, otherId)

          const isCurrent =
            Number(userPrivateChatReminderContact.value) === Number(otherId) &&
            String(currentRoom.value) === String(msgRoom)
          // تحديث القائمة الجانبية دائمًا
          updateSidebarLocal(otherId, e.message, e.created_at, !isCurrent)

          // إضافة الرسالة فقط للمحادثة المفتوحة
          if (isCurrent) {
            const exists = userPrivateChatMessages.value.some(m => Number(m.id) === Number(e.id))
            if (!exists) {
              userPrivateChatMessages.value.push({
                ...e,
                direction: fromId === myId ? "end" : "start"
              })
            }

            scrollToBottom()

            if (toId === myId) {
              markSeen(otherId)
            }
          }
        })
        .listen(".typing.updated", (e) => {
          const fromId = Number(e.from_user ?? 0)
          const idx = usersPrivateChats.value.findIndex((u) => Number(u.contact_id) === fromId)
          if (idx !== -1) usersPrivateChats.value[idx].status = Number(e.status) === 1 ? 1 : 0
        })
        .listen(".messages.seen", (e) => {
          const byId = Number(e.by_user ?? 0)
          const idx = usersPrivateChats.value.findIndex((u) => Number(u.contact_id) === byId)
          if (idx !== -1) usersPrivateChats.value[idx].unseen = 0
        })
    }
    // ========= API =========
    const getUsersPrivateChats = async (queryString = "") => {
      let query = queryString
      if (!query && usersPrivateChatsSearch.value) {
        query = `?q=${encodeURIComponent(usersPrivateChatsSearch.value)}`
      }
      const res = await axiosClient.get(`/chat/contacts${query}`)
      usersPrivateChats.value = normalizeList(res.data)
    }

    const searchUsersPrivateChats = (event) => {
      usersPrivateChatsSearch.value = event.target.value
      getUsersPrivateChats(`?q=${encodeURIComponent(event.target.value)}`)
    }

    const markSeen = async (contactId) => {
      try {
        await axiosClient.post(`/chat/${contactId}/seen`)
        const idx = usersPrivateChats.value.findIndex((u) => Number(u.contact_id) === Number(contactId))
        if (idx !== -1) usersPrivateChats.value[idx].unseen = 0
      } catch (_) { }
    }

    const getUserPrivateChatMessages = async (scroll = true) => {
      if (!userPrivateChat.value) return

      const res = await axiosClient.get(`/chat/${userPrivateChat.value.id}/messages`)
      const list = normalizeList(res.data)

      // build UI once (NO reverse/push chaos)
      const myId = authUserId()
      userPrivateChatMessages.value = list.map((m) => {
        const fromId = Number(m.from_user ?? m.from_user_id ?? 0)
        return {
          ...m,
          direction: Number(m.from_user) === myId ? "end" : "start",
          from_user_obj: m.from_user_obj || m.from_user_data || m.sender || null
        }
      })

      if (scroll) scrollToBottom()
    }

    const openUserPrivateChat = async (id) => {
      const contactId = Number(id)
      userPrivateChatReminderContact.value = contactId

      // load contact details
      const res = await axiosClient.get(`/chat/contacts/${contactId}`)
      const data = res.data?.data ?? res.data?.result ?? res.data

      userPrivateChat.value = {
        id: contactId,
        name: data?.name || data?.contact_name || data?.user?.name || data?.email || null,
        email: data?.email || data?.contact_email || data?.user?.email || null,
        avatar: data?.avatar || data?.contact_avatar || data?.user?.avatar || null,
        online: Number(data?.online || 0),
        contact: data?.contact
      }

      await getUserPrivateChatMessages(true)
      scrollToBottom()

      // subscribe realtime (AFTER loading chat)
      subscribeToRoom(contactId)

      // mark seen
      markSeen(contactId)
    }
    const setOnlineStatus = async (id, status) => {
      await axiosClient.post(`/chat/online`, { status: status })
    }
    // ========= Start New Chat (users list) =========
    const getNewChatUsers = async () => {
      const q = newChatSearch.value ? `?q=${encodeURIComponent(newChatSearch.value)}` : ""
      const res = await axiosClient.get(`/chat/users${q}`)
      newChatUsers.value = normalizeList(res.data)
    }

    watch(openNewChat, async (val) => {
      if (val) await getNewChatUsers()
    })

    const startChatWithUser = async (user) => {
      openNewChat.value = false

      // open empty chat UI immediately
      userPrivateChat.value = {
        id: Number(user.id),
        name: user.name || null,
        email: user.email || null,
        avatar: user.avatar || null,
        online: Number(user.online || 0),
        contact: user.contact
      }
      userPrivateChatReminderContact.value = Number(user.id)
      userPrivateChatMessages.value = []

      // subscribe (it will work after first message too)
      subscribeToRoom(Number(user.id))
      scrollToBottom()
    }

    const loadBlockedWords = async () => {
      try {
        const res = await axiosClient.get('/chat/blocked-words')
        blockedWords.value = (res.data || []).map(w => w.toLowerCase())
      } catch (e) {
        blockedWords.value = []
      }
    }

    const validateChatMessage = (text) => {
      const msg = text.toLowerCase()

      // 1️⃣ منع الروابط
      if (/https?:\/\/|www\./i.test(msg)) {
        return "Links are not allowed"
      }

      // 2️⃣ منع أرقام التواصل (7 أرقام أو أكثر)
      if (/\b\d{7,}\b/.test(msg)) {
        return "Phone numbers are not allowed"
      }

      // 3️⃣ منع الكلمات من DB
      for (const word of blockedWords.value) {
        if (word && msg.includes(word)) {
          return "This message contains forbidden words"
        }
      }

      return null // مسموح
    }


    // ========= Send message =========
    const sendUserPrivateChatMessage = async () => {
      if (!userPrivateChat.value) return
      const text = (userPrivateChatMessage.value || "").trim()
      if (!text) return

      const validationError = validateChatMessage(text)
      if (validationError) {
        errorMessage.value = validationError
        setTimeout(() => (errorMessage.value = null), 2000)
        return
      }
      
      loadingSendMessage.value = true
      const toId = Number(userPrivateChat.value.id)
      const myId = authUserId()

      // optimistic UI (so you SEE it immediately)
      const tempId = `tmp-${Date.now()}`
      userPrivateChatMessages.value.push({
        id: tempId,
        from_user: myId,
        to_user: toId,
        message: text,
        created_at: new Date().toISOString(),
        direction: "start"
      })
      scrollToBottom()
      userPrivateChatMessage.value = ""

      try {
        const res = await axiosClient.post(`/chat/messages`, {
          to_user: toId,
          message: text
        })

        // backend should return created message in data
        const msg = res.data?.data || res.data?.message || null
        if (msg) {
          const fromId = Number(msg.from_user ?? msg.from_user_id ?? 0)
          const prepared = msg

          const idx = userPrivateChatMessages.value.findIndex((m) => m.id === tempId)
          if (idx !== -1) userPrivateChatMessages.value[idx] = prepared
        }

        // update sidebar locally NOW
        updateSidebarLocal(toId, text, new Date().toISOString(), false)

        // after first message, ensure contact appears in /contacts
        // (because chat_contacts is created on first message)
        await getUsersPrivateChats()

        // ensure we are on the right room
        subscribeToRoom(toId)

        errorMessage.value = null
      } catch (e) {
        errorMessage.value = t("global.unknown-error")
        setTimeout(() => (errorMessage.value = null), 2000)
      } finally {
        loadingSendMessage.value = false
      }
    }

    const changeUserPrivateChatTypingStatus = async (e) => {
      if (e.keyCode === 13) {
        await sendUserPrivateChatMessage()
        return
      }
      if (!userPrivateChat.value) return

      const nowTyping = !!(userPrivateChatMessage.value || "").trim()
      if (userPrivateChatState.value.typing === nowTyping) return
      userPrivateChatState.value.typing = nowTyping

      try {
        await axiosClient.post(`/chat/${userPrivateChat.value.id}/typing`, {
          status: nowTyping ? 1 : 0
        })
      } catch (_) { }
    }



    // ========= UI helpers used by template =========
    const getUserPrivateChatSinceTime = (time) => {
      if (!time) return ""
      if (time.y > 0) return `${time.y} ${t("global.years")}`
      if (time.m > 0) return `${time.m} ${t("global.months")}`
      if (time.d > 0) return `${time.d} ${t("global.days")}`
      if (time.h > 0) return `${time.h} ${t("global.hours")}`
      if (time.i > 0) return `${time.i} ${t("global.minutes")}`
      if (time.s > 0) return `${time.s} ${t("global.seconds")}`
      return ""
    }

    // ========= Lifecycle =========
    onBeforeMount(async () => {
      loading.value = false
      usersPrivateChats.value = []
      userPrivateChat.value = null
      userPrivateChatMessages.value = []
      userPrivateChatMessage.value = ""

      await getUsersPrivateChats()
      getMenuAbilities(path.value, abilities)
    })

    onMounted(async () => {
      initEcho(store.state.user.token)

      loadBlockedWords()

      if(userPrivateChatId){
        openUserPrivateChat(userPrivateChatId)
      }

      // audio (keep, but your file path currently 404 — this doesn't break chat)
      try {
        userPrivateChatMessageAudio.value = new Audio("/src/assets/media/mp3/text-message-notification.mp3")
      } catch (_) { }

      // open chat from query
      if (route.query.id) {
        await openUserPrivateChat(route.query.id)
      }
      await setOnlineStatus(authUserId(), 1)

      if (!window.Echo) {
        console.warn("Echo not found")
        return
      }
    })

    onBeforeUnmount(() => {
      setOnlineStatus(authUserId(), 0)
    })

    // ========= Return to template =========
    return {
      SERVER_PATH,
      t,
      loading,
      abilities,

      usersPrivateChats,
      usersPrivateChatsSearch,
      userPrivateChat,
      userPrivateChatMessages,
      userPrivateChatMessage,
      userPrivateChatMessageAudio,

      getUserPrivateChatSinceTime,
      getUsersPrivateChats,
      searchUsersPrivateChats,
      openUserPrivateChat,
      getUserPrivateChatMessages,
      sendUserPrivateChatMessage,
      changeUserPrivateChatTypingStatus,

      loadingSendMessage,
      errorMessage,

      openNewChat,
      newChatUsers,
      newChatSearch,
      getNewChatUsers,
      startChatWithUser,

      // for template initials (if used)
      displayName
    }
  }
})
</script>