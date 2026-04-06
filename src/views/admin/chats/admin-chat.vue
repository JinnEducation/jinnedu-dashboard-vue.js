<template>
  <toolbar :title="t('global.admin-chat-management')" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <div class="d-flex flex-column flex-lg-row">
        <div class="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0">
          <div class="card card-flush">
            <div id="kt_chat_contacts_header" class="card-header pt-7">
              <div class="w-100 position-relative d-flex align-items-center" autocomplete="off">
                <span class="svg-icon svg-icon-1 position-absolute ms-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none">
                    <rect
                      x="17"
                      y="15"
                      rx="1"
                      width="8"
                      height="2"
                      transform="rotate(45 17 15)"
                      fill="currentColor"
                      opacity="0.5" />
                    <path
                      d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                      fill="currentColor" />
                  </svg>
                </span>
                <label for="search-private-chats" class="sr-only">{{
                  t("global.search-name-email")
                }}</label>
                <input
                  id="search-private-chats"
                  v-model="usersPrivateChatsSearch"
                  type="text"
                  name="search-private-chats"
                  :placeholder="t('global.search-name-email')"
                  class="form-control form-control-solid px-13"
                  @keyup.enter.prevent="searchUsersPrivateChats" />
              </div>
            </div>

            <div id="kt_chat_contacts_body" class="card-body pt-5">
              <div
                class="scroll-y me-n5 pe-5 h-420px h-lg-420px"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: true, lg: true}"
                data-kt-scroll-dependencies="#kt_header, #kt_app_header, #kt_toolbar, #kt_app_toolbar, #kt_footer, #kt_app_footer, #kt_chat_contacts_header"
                data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_contacts_body"
                data-kt-scroll-height="{default: '420px', lg: '420px'}"
                data-kt-scroll-max-height="420px"
                data-kt-scroll-offset="5px">
                <template v-for="(row, index) in usersPrivateChats" :key="index">
                  <div
                    style="cursor: pointer"
                    class="d-flex flex-stack py-4"
                    @click="openUserPrivateChat(row)">
                    <div class="d-flex align-items-center">
                      <div
                        class="me-3"
                        style="
                          position: relative;
                          width: 52px;
                          height: 44px;
                          min-width: 52px;
                          overflow: hidden;
                        ">
                        <template v-if="getRowPrimaryUser(row).avatar">
                          <img
                            class="symbol symbol-circle border border-2 border-white"
                            :src="resolveAvatarUrl(getRowPrimaryUser(row).avatar)"
                            :alt="getDisplayName(getRowPrimaryUser(row), 'User')"
                            style="
                              position: absolute;
                              left: 0;
                              top: 0;
                              z-index: 2;
                              width: 28px;
                              height: 28px;
                              object-fit: cover;
                            " />
                        </template>
                        <template v-else>
                          <div
                            class="symbol-label symbol-circle fs-7 bg-light-primary text-primary border border-2 border-white"
                            style="
                              position: absolute;
                              width: 28px;
                              height: 28px;
                              left: 0;
                              top: 0;
                              z-index: 2;
                            ">
                            {{ getInitial(getDisplayName(getRowPrimaryUser(row))) }}
                          </div>
                        </template>

                        <template v-if="getRowSecondaryUser(row).avatar">
                          <img
                            class="symbol symbol-circle border border-2 border-white"
                            :src="resolveAvatarUrl(getRowSecondaryUser(row).avatar)"
                            :alt="getDisplayName(getRowSecondaryUser(row), 'User')"
                            style="
                              position: absolute;
                              left: 16px;
                              top: 12px;
                              z-index: 1;
                              width: 28px;
                              height: 28px;
                              object-fit: cover;
                            " />
                        </template>
                        <template v-else>
                          <div
                            class="symbol-label symbol-circle fs-7 bg-light-warning text-warning border border-2 border-white"
                            style="
                              position: absolute;
                              width: 28px;
                              height: 28px;
                              left: 16px;
                              top: 12px;
                              z-index: 1;
                            ">
                            {{ getInitial(getDisplayName(getRowSecondaryUser(row))) }}
                          </div>
                        </template>

                        <div
                          class="symbol-badge border-3 h-8px w-8px"
                          :class="Number(row.online) === 1 ? 'bg-success' : 'bg-danger'"
                          style="position: absolute; right: 2px; bottom: 2px; z-index: 3" />
                      </div>

                      <div class="min-w-0">
                        <h3 class="fs-6 fw-bold text-gray-900 text-hover-primary mb-2">
                          {{
                            getDisplayName(
                              getRowPrimaryUser(row),
                              `User #${getRowPrimaryUser(row).id || "-"}`
                            )
                          }}
                          <span class="text-muted px-1">-</span>
                          {{
                            getDisplayName(
                              getRowSecondaryUser(row),
                              `User #${getRowSecondaryUser(row).id || "-"}`
                            )
                          }}
                        </h3>
                        <div v-if="Number(row.status) === 1" class="fw-semibold text-muted">
                          <img
                            src="/src/assets/media/gif/typing.gif"
                            :alt="`${getDisplayName(getRowSecondaryUser(row), 'User')}`"
                            style="width: 50px" />
                        </div>
                        <div v-else-if="row.last_msg !== null" class="fw-semibold text-muted">
                          {{ row.last_msg }}
                        </div>
                        <div v-else class="fw-semibold text-muted">
                          <span
                            class="badge fs-7 m-1"
                            :class="
                              Number(row.type) === 1
                                ? 'badge-light-primary'
                                : Number(row.type) === 2
                                ? 'badge-light-success'
                                : 'badge-light-danger'
                            ">
                            {{
                              Number(row.type) === 1
                                ? t("global.student")
                                : Number(row.type) === 2
                                ? t("global.tutor")
                                : t("global.administrator")
                            }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex flex-column align-items-end ms-2">
                      <span class="text-muted fs-7 mb-1">{{
                        getUserPrivateChatSinceTime(row.since_start)
                      }}</span>
                      <span
                        v-if="Number(row.unseen) > 0"
                        class="badge badge-sm badge-circle badge-light-warning"
                        >{{ row.unseen }}</span
                      >
                    </div>
                  </div>
                  <div class="separator separator-dashed d-none"></div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-lg-row-fluid ms-lg-7 ms-xl-10">
          <div v-if="activeConversation" id="kt_chat_messenger" class="card">
            <div id="kt_chat_messenger_header" class="card-header">
              <div class="card-title">
                <div class="d-flex justify-content-center flex-column me-3">
                  <div class="d-flex align-items-center mb-2">
                    <div
                      class="me-4"
                      style="
                        position: relative;
                        width: 62px;
                        height: 50px;
                        min-width: 62px;
                        overflow: hidden;
                      ">
                      <template v-if="activePrimaryUser.avatar">
                        <img
                          class="symbol symbol-circle border border-2 border-white"
                          :src="resolveAvatarUrl(activePrimaryUser.avatar)"
                          :alt="activePrimaryLabel"
                          style="
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index: 2;
                            width: 34px;
                            height: 34px;
                            object-fit: cover;
                          " />
                      </template>
                      <template v-else>
                        <div
                          class="symbol-label symbol-circle fs-6 bg-light-primary text-primary border border-2 border-white"
                          style="
                            position: absolute;
                            width: 34px;
                            height: 34px;
                            left: 0;
                            top: 0;
                            z-index: 2;
                          ">
                          {{ getInitial(activePrimaryLabel) }}
                        </div>
                      </template>

                      <template v-if="activeSecondaryUser.avatar">
                        <img
                          class="symbol symbol-circle border border-2 border-white"
                          :src="resolveAvatarUrl(activeSecondaryUser.avatar)"
                          :alt="activeSecondaryLabel"
                          style="
                            position: absolute;
                            left: 18px;
                            top: 14px;
                            z-index: 1;
                            width: 34px;
                            height: 34px;
                            object-fit: cover;
                          " />
                      </template>
                      <template v-else>
                        <div
                          class="symbol-label symbol-circle fs-6 bg-light-warning text-warning border border-2 border-white"
                          style="
                            position: absolute;
                            width: 34px;
                            height: 34px;
                            left: 18px;
                            top: 14px;
                            z-index: 1;
                          ">
                          {{ getInitial(activeSecondaryLabel) }}
                        </div>
                      </template>
                    </div>

                    <h2 class="fs-4 fw-bold text-gray-900 text-hover-primary me-1 lh-1">
                      {{ activePrimaryLabel }}
                      <span class="text-muted px-2">-</span>
                      {{ activeSecondaryLabel }}
                    </h2>
                  </div>

                  <div class="mb-0 lh-1">
                    <span
                      class="badge badge-circle w-10px h-10px me-1"
                      :class="
                        Number(activeSecondaryUser.online) === 1 ? 'badge-success' : 'badge-danger'
                      " />
                    <span class="fs-7 fw-semibold text-muted">{{
                      Number(activeSecondaryUser.online) === 1
                        ? t("global.online")
                        : t("global.offline")
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div id="kt_chat_messenger_body" class="card-body">
              <div
                id="kt_chat_messenger_scroll"
                class="scroll-y me-n5 pe-5 h-300px h-lg-300px"
                data-kt-element="messages"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: true, lg: true}"
                data-kt-scroll-dependencies="#kt_header, #kt_app_header, #kt_app_toolbar, #kt_toolbar, #kt_footer, #kt_app_footer, #kt_chat_messenger_header"
                data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_messenger_body"
                data-kt-scroll-height="{default: '300px', lg: '300px'}"
                data-kt-scroll-max-height="300px"
                data-kt-scroll-offset="5px">
                <template v-for="(message, index) in userPrivateChatMessages" :key="index">
                  <div
                    class="d-flex mb-10"
                    :class="
                      message.direction === 'start'
                        ? 'justify-content-start'
                        : 'justify-content-end'
                    ">
                    <div
                      class="d-flex flex-column"
                      :class="
                        message.direction === 'start' ? 'align-items-start' : 'align-items-end'
                      ">
                      <div class="d-flex align-items-center mb-2">
                        <template v-if="getMessageSender(message).avatar">
                          <div class="symbol symbol-circle symbol-35px">
                            <img
                              :src="resolveAvatarUrl(getMessageSender(message).avatar)"
                              :alt="`${getMessageSender(message).name || 'User'}`" />
                          </div>
                        </template>
                        <template v-else>
                          <div
                            class="symbol symbol-circle symbol-35px"
                            style="background: url('/src/assets/media/svg/files/blank-image.svg')">
                            <div class="symbol-label fs-3 bg-light-warning text-warning">
                              {{ getInitial(getMessageSender(message).name) }}
                            </div>
                          </div>
                        </template>

                        <div class="ms-3">
                          <h5 class="fs-5 fw-bold text-gray-900 text-hover-primary me-1">
                            {{ getMessageSender(message).name || "-" }}
                          </h5>
                          <span class="text-muted fs-7 mb-1">{{
                            getUserPrivateChatSinceTime(message.since_start)
                          }}</span>
                        </div>
                      </div>

                      <div
                        data-kt-element="message-text"
                        class="p-5 rounded bg-light-info text-dark fw-semibold mw-lg-400px text-start">
                        {{ message.message }}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import axiosClient from "@/plugins/axios"
import getMenuAbilities from "@/plugins/get-menu-abilities"
import {computed, defineComponent, onBeforeMount, onBeforeUnmount, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute} from "vue-router"

export default defineComponent({
  name: "admin-chat",
  components: {Toolbar},
  setup() {
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const route = useRoute()
    const path = computed(() => route.path)

    const abilities = ref({
      index: false,
      create: false,
      edit: false,
      destroy: false,
      show: false,
      createStudentLink: false,
      createTutorLink: false
    })

    const {t} = useI18n()
    const loading = ref(false)
    const usersPrivateChats = ref([])
    const usersPrivateChatsSearch = ref("")
    const userPrivateChatMessages = ref([])
    const userPrivateChatMessageAudio = ref(null)
    const fallbackPrimaryUser = ref({id: 0, name: "", avatar: "", online: 0})

    const activeConversation = ref(null)
    const activePrimaryUser = ref({id: 0, name: "", avatar: "", online: 0})
    const activeSecondaryUser = ref({id: 0, name: "", avatar: "", online: 0})

    const userPrivateChatState = ref({
      id: {last: 0, first: 0},
      scroll: {waiting: false, height: 0}
    })

    const pollIntervals = {
      messages: null,
      contacts: null,
      heartbeat: null
    }

    const activePrimaryLabel = computed(() =>
      getDisplayName(activePrimaryUser.value, `User #${activePrimaryUser.value.id || "-"}`)
    )
    const activeSecondaryLabel = computed(() =>
      getDisplayName(activeSecondaryUser.value, `User #${activeSecondaryUser.value.id || "-"}`)
    )

    const getInitial = function getInitial(name) {
      if (!name || typeof name !== "string") return "U"
      return name.charAt(0).toUpperCase()
    }

    const getDisplayName = function getDisplayName(user, fallback = "") {
      return user?.name || user?.full_name || user?.username || fallback
    }

    const normalizeDirection = function normalizeDirection(direction) {
      if (direction === "start" || direction === "end") return direction
      if (Number(direction) === 1) return "start"
      if (Number(direction) === 2) return "end"
      return "start"
    }

    const normalizeUserEntity = function normalizeUserEntity(user, fallbackId = null) {
      return {
        id: Number(user?.id || fallbackId || 0),
        name: user?.name || user?.full_name || user?.username || "",
        avatar: user?.avatar || user?.image || user?.photo || "",
        online: Number(user?.online || 0)
      }
    }

    const getRowPrimaryUser = function getRowPrimaryUser(row) {
      const explicit = normalizeUserEntity(
        row?.monitored_user ||
          row?.user ||
          row?.first_user ||
          row?.participant_one ||
          row?.from_user || {
            id: row?.user_id || row?.first_user_id || row?.participant_one_id || row?.from_user_id,
            name: row?.user_name || row?.first_user_name || row?.participant_one_name || "",
            avatar: row?.user_avatar || row?.first_user_avatar || row?.participant_one_avatar || "",
            online: row?.user_online || row?.first_user_online || 0
          }
      )

      if (explicit.id || explicit.name || explicit.avatar) return explicit

      if (fallbackPrimaryUser.value.id) {
        return normalizeUserEntity(
          fallbackPrimaryUser.value,
          row?.user_id || fallbackPrimaryUser.value.id
        )
      }

      return normalizeUserEntity({}, row?.user_id || 0)
    }

    const getRowSecondaryUser = function getRowSecondaryUser(row) {
      return normalizeUserEntity(
        row?.contact ||
          row?.second_user ||
          row?.participant_two ||
          row?.to_user || {
            id:
              row?.contact_id || row?.second_user_id || row?.participant_two_id || row?.to_user_id,
            name: row?.contact_name || row?.name || row?.full_name || row?.second_user_name || "",
            avatar:
              row?.contact_avatar ||
              row?.avatar ||
              row?.second_user_avatar ||
              row?.participant_two_avatar ||
              "",
            online: row?.contact_online || row?.online || row?.second_user_online || 0
          }
      )
    }

    const resolveAvatarUrl = function resolveAvatarUrl(avatar) {
      if (!avatar) return ""
      if (/^https?:\/\//i.test(avatar)) return avatar
      const base = (SERVER_PATH.value || "").replace(/\/$/, "")
      const cleanAvatar = String(avatar).replace(/^\//, "")
      return `${base}/${cleanAvatar}`
    }

    const getMessageSender = function getMessageSender(message) {
      const explicit = normalizeUserEntity(
        message?.from_user ||
          message?.from_user_obj ||
          message?.from_user_data ||
          message?.sender ||
          message?.from ||
          message?.user || {
            id: message?.from_user_id || message?.sender_id || message?.from_id || 0,
            name:
              message?.from_user_name ||
              message?.sender_name ||
              message?.from_name ||
              message?.user_name ||
              "",
            avatar:
              message?.from_user_avatar ||
              message?.sender_avatar ||
              message?.from_avatar ||
              message?.user_avatar ||
              ""
          }
      )

      if (explicit.name || explicit.avatar) return explicit

      if (message?.direction === "start") {
        return normalizeUserEntity(activePrimaryUser.value, activePrimaryUser.value.id)
      }
      if (message?.direction === "end") {
        return normalizeUserEntity(activeSecondaryUser.value, activeSecondaryUser.value.id)
      }

      return {id: 0, name: "", avatar: "", online: 0}
    }

    const normalizeMessageItem = function normalizeMessageItem(message) {
      const direction = normalizeDirection(message?.direction)
      return {
        ...message,
        direction,
        from_user: getMessageSender({...message, direction})
      }
    }

    const getUserPrivateChatSinceTime = function getUserPrivateChatSinceTime(time) {
      if (!time) return ""
      if (time.y > 0) return `${time.y} ${t("global.years")}`
      if (time.m > 0) return `${time.m} ${t("global.months")}`
      if (time.d > 0) return `${time.d} ${t("global.days")}`
      if (time.h > 0) return `${time.h} ${t("global.hours")}`
      if (time.i > 0) return `${time.i} ${t("global.minutes")}`
      if (time.s > 0) return `${time.s} ${t("global.seconds")}`
      return ""
    }

    const getUsersPrivateChats = function getUsersPrivateChats(queryString = "") {
      let query = queryString
      if (!query && usersPrivateChatsSearch.value) {
        query = `?q=${encodeURIComponent(usersPrivateChatsSearch.value)}`
      }

      axiosClient.get(`/front/chats/chat-contacts${query}`).then((response) => {
        usersPrivateChats.value = response?.data?.result?.data || []
        const monitored = normalizeUserEntity(response?.data?.monitored_user)
        if (monitored.id || monitored.name || monitored.avatar) {
          fallbackPrimaryUser.value = monitored
        }
      })
    }

    const searchUsersPrivateChats = function searchUsersPrivateChats(event) {
      usersPrivateChatsSearch.value = event?.target?.value || ""
      getUsersPrivateChats(`?q=${encodeURIComponent(usersPrivateChatsSearch.value)}`)
    }

    const applyScrollState = function applyScrollState(scrollToBottom) {
      if (typeof KTScroll !== "undefined") KTScroll.init()
      const scrollElement = document.querySelector("#kt_chat_messenger_scroll")
      if (!scrollElement) return

      if (scrollToBottom) {
        scrollElement.scrollTop = parseInt(scrollElement.scrollHeight, 10)
        userPrivateChatState.value.scroll.height = parseInt(scrollElement.scrollHeight, 10)
      } else {
        scrollElement.scrollTop =
          parseInt(scrollElement.scrollHeight, 10) - userPrivateChatState.value.scroll.height
        userPrivateChatState.value.scroll.height = parseInt(scrollElement.scrollHeight, 10)
      }
    }

    const getUserPrivateChatMessages = function getUserPrivateChatMessages(
      scroll,
      queryString = ""
    ) {
      if (!activeConversation.value?.contact_id) return
      if (userPrivateChatState.value.scroll.waiting) return

      userPrivateChatState.value.scroll.waiting = true

      const params = {}
      if (activeConversation.value.user_id) params.user_id = activeConversation.value.user_id

      axiosClient
        .get(`/front/chats/messages-list/${activeConversation.value.contact_id}${queryString}`, {
          params
        })
        .then((response) => {
          const monitored = normalizeUserEntity(
            response?.data?.monitored_user,
            activeConversation.value.user_id
          )
          if (monitored.id || monitored.name || monitored.avatar) {
            activePrimaryUser.value = {
              ...activePrimaryUser.value,
              ...monitored,
              id: activePrimaryUser.value.id || monitored.id
            }
          }

          const contact = normalizeUserEntity(
            response?.data?.contact,
            activeConversation.value.contact_id
          )
          if (contact.id || contact.name || contact.avatar) {
            activeSecondaryUser.value = {
              ...activeSecondaryUser.value,
              ...contact,
              id: activeSecondaryUser.value.id || contact.id
            }
          }

          const messages = (response?.data?.result?.data || []).map((item) =>
            normalizeMessageItem(item)
          )
          if (!messages.length) return

          userPrivateChatState.value.id.first = messages[0].id
          userPrivateChatState.value.id.last = messages[messages.length - 1].id

          if (queryString) {
            const existing = new Set(userPrivateChatMessages.value.map((item) => Number(item.id)))
            const newMessages = messages.filter((item) => !existing.has(Number(item.id)))
            if (newMessages.length) {
              userPrivateChatMessages.value.push(...newMessages)
              if (userPrivateChatMessageAudio.value) userPrivateChatMessageAudio.value.play()
            }
          } else {
            userPrivateChatMessages.value = [...messages].reverse()
          }
        })
        .finally(() => {
          userPrivateChatState.value.scroll.waiting = false
          applyScrollState(scroll)
        })
    }

    const checkFirstId = function checkFirstId() {
      if (!userPrivateChatState.value.id.first) return
      getUserPrivateChatMessages(true, `?first_id=${userPrivateChatState.value.id.first}`)
    }

    const openUserPrivateChat = function openUserPrivateChat(row) {
      const primary = getRowPrimaryUser(row)
      const secondary = getRowSecondaryUser(row)
      if (!secondary.id) return

      userPrivateChatState.value.id.first = 0
      userPrivateChatState.value.id.last = 0
      userPrivateChatState.value.scroll.waiting = false
      userPrivateChatState.value.scroll.height = 0
      userPrivateChatMessages.value = []

      activeConversation.value = {
        user_id: primary.id || Number(row?.user_id || 0),
        contact_id: secondary.id || Number(row?.contact_id || 0)
      }

      activePrimaryUser.value = primary
      activeSecondaryUser.value = secondary

      const params = {}
      if (activeConversation.value.user_id) params.user_id = activeConversation.value.user_id

      axiosClient
        .get(`/front/chats/chat-contacts/${activeConversation.value.contact_id}`, {params})
        .then((response) => {
          const details = normalizeUserEntity(
            response?.data?.result,
            activeConversation.value.contact_id
          )

          if (details.id === activeConversation.value.contact_id || !details.id) {
            activeSecondaryUser.value = {
              ...activeSecondaryUser.value,
              ...details,
              id: activeConversation.value.contact_id
            }
          }

          getUserPrivateChatMessages(true)
        })
        .catch(() => {
          getUserPrivateChatMessages(true)
        })
    }

    const changeUserPrivateChatOnlineStatus = function changeUserPrivateChatOnlineStatus() {
      axiosClient.get(`/front/chats/online-status`)
    }

    onBeforeMount(() => {
      loading.value = false
      usersPrivateChats.value = []
      userPrivateChatMessages.value = []

      getUsersPrivateChats()
      getMenuAbilities(path.value, abilities)
    })

    onMounted(() => {
      pollIntervals.messages = setInterval(() => checkFirstId(), 10000)
      pollIntervals.contacts = setInterval(() => getUsersPrivateChats(), 20000)
      pollIntervals.heartbeat = setInterval(() => changeUserPrivateChatOnlineStatus(), 30000)

      try {
        userPrivateChatMessageAudio.value = new Audio(
          "/src/assets/media/mp3/text-message-notification.mp3"
        )
      } catch (_) {}

      if (typeof KTUtil !== "undefined") {
        KTUtil.onDOMContentLoaded(() => {
          if (typeof KTAppChat !== "undefined") {
            KTAppChat.init(document.querySelector("#kt_chat_messenger"))
          }
        })
      }
    })

    onBeforeUnmount(() => {
      if (pollIntervals.messages) clearInterval(pollIntervals.messages)
      if (pollIntervals.contacts) clearInterval(pollIntervals.contacts)
      if (pollIntervals.heartbeat) clearInterval(pollIntervals.heartbeat)
    })

    return {
      SERVER_PATH,
      t,
      loading,
      abilities,
      usersPrivateChats,
      usersPrivateChatsSearch,
      userPrivateChatMessages,
      activeConversation,
      activePrimaryUser,
      activeSecondaryUser,
      activePrimaryLabel,
      activeSecondaryLabel,
      getInitial,
      getDisplayName,
      getMessageSender,
      getRowPrimaryUser,
      getRowSecondaryUser,
      resolveAvatarUrl,
      getUserPrivateChatSinceTime,
      searchUsersPrivateChats,
      openUserPrivateChat
    }
  }
})
</script>
