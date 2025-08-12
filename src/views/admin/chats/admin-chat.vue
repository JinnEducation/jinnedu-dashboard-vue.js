<!-- DONE REVIEWING: 25/06/2023 -->
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
                <label for="search-private-chats" class="sr-only">
                  {{ t("global.search-name-email") }}
                </label>
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
                <template v-for="(user, index) in usersPrivateChats" :key="index">
                  <div
                    style="cursor: pointer"
                    class="d-flex flex-stack py-4"
                    @click="openUserPrivateChat(user.contact_id)"
                    @keypress="openUserPrivateChat(user.contact_id)">
                    <div class="d-flex align-items-center">
                      <template v-if="user.avatar">
                        <div class="symbol symbol-circle symbol-45px">
                          <img
                            v-if="user.avatar !== null"
                            :src="`${SERVER_PATH}/${user.avatar}`"
                            :alt="user.name" />
                          <!-- If user does not have an avatar, show default image -->
                          <img
                            v-else
                            src="https://scotturb.com/wp-content/uploads/2016/11/product-placeholder-300x300.jpg"
                            alt="Default Image" />
                          <div
                            class="symbol-badge start-100 top-100 border-4 h-8px w-8px ms-n2 mt-n2"
                            :class="user.online === 1 ? 'bg-success' : 'bg-danger'" />
                        </div>
                      </template>
                      <template v-else>
                        <div
                          class="symbol symbol-circle symbol-45px"
                          style="background: url('/src/assets/media/svg/files/blank-image.svg')">
                          <div class="symbol-label fs-3 bg-light-warning text-warning">
                            {{ user.name.charAt(0).toUpperCase() }}
                          </div>
                          <div
                            class="symbol-badge start-100 top-100 border-4 h-8px w-8px ms-n2 mt-n2"
                            :class="user.online === 1 ? 'bg-success' : 'bg-danger'" />
                        </div>
                      </template>
                      <div class="ms-5">
                        <h3 class="fs-5 fw-bold text-gray-900 text-hover-primary mb-2">
                          {{ user.name }}
                        </h3>
                        <div v-if="user.status === 1" class="fw-semibold text-muted">
                          <img
                            src="/src/assets/media/gif/typing.gif"
                            :alt="`${user.name}`"
                            style="width: 50px" />
                        </div>
                        <div
                          v-else-if="user[['last', 'msg'].join('_')] !== null"
                          class="fw-semibold text-muted">
                          {{ user[["last", "msg"].join("_")] }}
                        </div>
                        <div v-else class="fw-semibold text-muted">
                          <span
                            class="badge fs-7 m-1"
                            :class="
                              user.type === 1
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
                      <span
                        v-if="user['unseen'] > 0"
                        class="badge badge-sm badge-circle badge-light-warning">
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
        <div class="flex-lg-row-fluid ms-lg-7 ms-xl-10">
          <div v-if="userPrivateChat" id="kt_chat_messenger" class="card">
            <div id="kt_chat_messenger_header" class="card-header">
              <div class="card-title">
                <div class="d-flex justify-content-center flex-column me-3">
                  <h2 class="fs-4 fw-bold text-gray-900 text-hover-primary me-1 mb-2 lh-1">
                    {{ userPrivateChat ? userPrivateChat.name : "-" }}
                  </h2>
                  <div class="mb-0 lh-1">
                    <span
                      class="badge badge-circle w-10px h-10px me-1"
                      :class="
                        userPrivateChat
                          ? userPrivateChat.online
                            ? 'badge-success'
                            : 'badge-danger'
                          : 'badge-warning'
                      " />
                    <span class="fs-7 fw-semibold text-muted">
                      {{
                        userPrivateChat
                          ? userPrivateChat.online
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
              <div
                id="kt_chat_messenger_scroll"
                class="scroll-y me-n5 pe-5 h-300px h-lg-300px"
                data-kt-element="messages"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: true, lg: true}"
                data-kt-scroll-dependencies="#kt_header, #kt_app_header, #kt_app_toolbar, #kt_toolbar, #kt_footer, #kt_app_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer"
                data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_messenger_body"
                data-kt-scroll-height="{default: '300px', lg: '300px'}"
                data-kt-scroll-max-height="300px"
                data-kt-scroll-offset="5px">
                <template
                  v-for="(userPrivateChatMessagesItem, index) in userPrivateChatMessages"
                  :key="index">
                  <div
                    class="d-flex mb-10"
                    :class="
                      userPrivateChatMessagesItem.direction === 'start'
                        ? 'justify-content-start'
                        : 'justify-content-end'
                    ">
                    <div
                      class="d-flex flex-column"
                      :class="
                        userPrivateChatMessagesItem.direction === 'start'
                          ? 'align-items-start'
                          : 'align-items-end'
                      ">
                      <div class="d-flex align-items-center mb-2">
                        <template
                          v-if="userPrivateChatMessagesItem[['from', 'user'].join('_')].avatar">
                          <div class="symbol symbol-circle symbol-35px">
                            <img
                              :src="`${SERVER_PATH}/${
                                userPrivateChatMessagesItem[['from', 'user'].join('_')].avatar
                              }`"
                              :alt="`${
                                userPrivateChatMessagesItem[['from', 'user'].join('_')].name
                              }`" />
                          </div>
                        </template>
                        <template v-else>
                          <div
                            class="symbol symbol-circle symbol-35px"
                            style="background: url('/src/assets/media/svg/files/blank-image.svg')">
                            <div class="symbol-label fs-3 bg-light-warning text-warning">
                              {{
                                userPrivateChatMessagesItem[["from", "user"].join("_")].name
                                  .charAt(0)
                                  .toUpperCase()
                              }}
                            </div>
                          </div>
                        </template>
                        <div class="ms-3">
                          <h5 class="fs-5 fw-bold text-gray-900 text-hover-primary me-1">
                            {{ userPrivateChatMessagesItem[["from", "user"].join("_")].name }}
                          </h5>
                          <span class="text-muted fs-7 mb-1">
                            {{
                              getUserPrivateChatSinceTime(
                                userPrivateChatMessagesItem[["since", "start"].join("_")]
                              )
                            }}
                          </span>
                        </div>
                      </div>
                      <div
                        data-kt-element="message-text"
                        class="p-5 rounded bg-light-info text-dark fw-semibold mw-lg-400px text-start">
                        {{ userPrivateChatMessagesItem.message }}
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <!-- <div id="kt_chat_messenger_footer" class="card-footer pt-4">
              <label for="user-private-chat-message" class="sr-only">
                {{ t("global.type-message") }}
              </label>
              <input
                id="user-private-chat-message"
                v-model="userPrivateChatMessage"
                :placeholder="t('global.type-message')"
                data-kt-element="input"
                class="form-control form-control-flush mb-3 px-0"
                @keyup.prevent="changeUserPrivateChatTypingStatus" />
              <p
                v-if="errorMessage"
                class="badge badge-light-danger fs-7 p-4 fw-bold d-block text-start">
                {{ errorMessage }}
              </p>
              <div class="d-flex flex-stack">
                <button
                  type="button"
                  data-kt-element="send"
                  class="btn btn-primary"
                  style="min-width: 92px"
                  @click="sendUserPrivateChatMessage()">
                  <span v-if="loadingSendMessage" class="svg-icon svg-icon-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        stroke="white"
                        stroke-width="3"
                        fill="transparent">
                        <animate
                          attributeName="r"
                          from="10"
                          to="15"
                          dur="1s"
                          begin="0s"
                          repeatCount="indefinite" />
                        <animate
                          attributeName="stroke-opacity"
                          from="1"
                          to="0"
                          dur="1s"
                          begin="0s"
                          repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </span>
                  <span v-else>{{ t("global.submit") }}</span>
                </button>
              </div>
            </div> -->
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
import {computed, defineComponent, onBeforeMount, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute} from "vue-router"

export default defineComponent({
  name: "private-chat",
  components: {Toolbar},
  setup() {
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const route = useRoute()
    const path = computed(() => route.path)
    const userId = route.params.id
    const abilities = ref({
      index: false,
      create: false,
      edit: false,
      destroy: false,
      show: false,
      createStudentLink: false,
      createTutorLink: false
    })
    const loadingSendMessage = ref(false)

    const {t} = useI18n()
    const errorMessage = ref(null)
    const loading = ref(false)
    const data = ref([])
    const idsSelected = ref([])
    const initUsersPrivateChats = ref([])
    const usersPrivateChats = ref([])
    const usersPrivateChatsSearch = ref([])
    const userPrivateChat = ref([])
    const userPrivateChatMessages = ref([])
    const userPrivateChatMessage = ref([])
    const userPrivateChatMessageAudio = ref([])
    const userPrivateChatState = ref({
      id: {last: 0, first: 0},
      scroll: {waiting: false, height: 2},
      typing: false
    })

    const getUserPrivateChatSinceTime = function getUserPrivateChatSinceTime(time) {
      if (time.y > 0) return `${time.y} ${t("global.years")}`
      if (time.m > 0) return `${time.m} ${t("global.months")}`
      if (time.d > 0) return `${time.d} ${t("global.days")}`
      if (time.h > 0) return `${time.h} ${t("global.hours")}`
      if (time.i > 0) return `${time.i} ${t("global.minutes")}`
      if (time.s > 0) return `${time.s} ${t("global.seconds")}`
    }

    const getUsersPrivateChats = function getUsersPrivateChats(queryString = "") {
      let query = queryString
      if (usersPrivateChatsSearch.value !== null && queryString === "")
        query = `?${["q", usersPrivateChatsSearch.value].join("=")}`
      axiosClient
        .get(`/front/chats/chat-contacts${query}`, {params: {user_id: userId}})
        .then((response) => {
          usersPrivateChats.value = response.data.result.data
        })
    }

    const searchUsersPrivateChats = function searchUsersPrivateChats(event) {
      getUsersPrivateChats(`?${["q", event.target.value].join("=")}`)
    }

    const getUserPrivateChatMessages = function getUserPrivateChatMessages(
      scroll,
      queryString = "",
      send = false
    ) {
      if (!userPrivateChat.value) return
      if (userPrivateChatState.value.scroll.waiting) return
      userPrivateChatState.value.scroll.waiting = true

      axiosClient
        .get(`/front/chats/messages-list/${userPrivateChat.value.id}${queryString}`, {
          params: {user_id: userId}
        })
        .then((response) => {
          userPrivateChatState.value.scroll.waiting = false
          if (response.data.contact) userPrivateChat.value.online = response.data.contact.online
          if (response.data.result.data.length !== 0) {
            const firstElement = response.data.result.data[0]
            const lastElement = response.data.result.data.slice(-1)
            userPrivateChatState.value.id.first = firstElement.id
            userPrivateChatState.value.id.last = lastElement[0].id
            if (send) {
              userPrivateChatMessages.value.push(firstElement)
            } else {
              userPrivateChatMessages.value.push(...response.data.result.data.reverse())
            }

            // userPrivateChatMessages.value.push(...response.data.result.data.reverse())
            if (scroll) {
              if (queryString !== "") userPrivateChatMessageAudio.value.play()
            }
          }
        })
        .finally(() => {
          KTScroll.init()
          const scrollElement = document.querySelector("#kt_chat_messenger_scroll")
          if (scroll) {
            scrollElement.scrollTop = parseInt(scrollElement.scrollHeight, 10)
            userPrivateChatState.value.scroll.height = parseInt(scrollElement.scrollHeight, 10)
          } else {
            scrollElement.scrollTop =
              parseInt(scrollElement.scrollHeight, 10) - userPrivateChatState.value.scroll.height
            userPrivateChatState.value.scroll.height = parseInt(scrollElement.scrollHeight, 10)
          }
        })
    }

    const checkFirstId = function checkFirstId() {
      if (userPrivateChatState.value.id.first)
        getUserPrivateChatMessages(
          true,
          `?${["first", "id"].join("_")}=${userPrivateChatState.value.id.first}`
        )
    }

    const openUserPrivateChat = function openUserPrivateChat(id) {
      userPrivateChatState.value.id.first = 0
      userPrivateChatState.value.id.last = 0
      userPrivateChatState.value.scroll.waiting = false
      userPrivateChatState.value.scroll.height = 0
      userPrivateChatMessages.value = []

      axiosClient.get(`/front/chats/chat-contacts/${id}`).then((response) => {
        userPrivateChat.value = response.data.result
        userPrivateChatMessages.value = []
        getUserPrivateChatMessages(true)
      })
    }

    const sendUserPrivateChatMessage = function sendUserPrivateChatMessage() {
      if (!userPrivateChat.value) return
      if (!userPrivateChatMessage.value) return
      loadingSendMessage.value = true

      axiosClient
        .post(`/front/chats/send-message`, {
          [["to", "user"].join("_")]: userPrivateChat.value.id,
          message: userPrivateChatMessage.value
        })
        .then((response) => {
          // Check for success or handle other logic based on the response
          if (response.data.success) {
            userPrivateChatMessage.value = ""
            getUserPrivateChatMessages(
              true,
              `?${["first", "id"].join("_")}=${userPrivateChatState.value.id.first}`,
              true
            )
            loadingSendMessage.value = false
            errorMessage.value = null
          } else {
            // Handle specific success=false scenarios
            switch (response.data["msg-code"]) {
              case "999":
                errorMessage.value = t("global.contain-email-address")
                break
              case "888":
                errorMessage.value = t("global.contain-phone-number")
                break
              case "777":
                errorMessage.value = t("global.contain-url")
                break
              case "666":
                errorMessage.value = t("global.contain-forbidden-word", {
                  forbiddenWord: response.data.forbidden_word
                })
                break
              default:
                errorMessage.value = t("global.unknown-error")
                break
            }
            setTimeout(() => {
              errorMessage.value = null // Clear the error message
            }, 2000)
          }
        })
        .catch(() => {
          errorMessage.value = t("global.unknown-error")

          setTimeout(() => {
            errorMessage.value = null // Clear the error message
          }, 2000)
        })
        .finally(() => {
          // KTScroll.init()
          // const scrollElement = document.querySelector("#kt_chat_messenger_scroll")
          // scrollElement.scrollTop = parseInt(scrollElement.scrollHeight, 10)
          loadingSendMessage.value = false
        })
    }

    const changeUserPrivateChatTypingStatus = function changeUserPrivateChatTypingStatus(e) {
      if (e.keyCode === 13) {
        sendUserPrivateChatMessage()
        return
      }

      if (!userPrivateChatMessage.value) {
        if (!userPrivateChatState.value.typing) return
        userPrivateChatState.value.typing = false
      } else {
        if (userPrivateChatState.value.typing) return
        userPrivateChatState.value.typing = true
      }

      axiosClient.get(
        `/front/chats/typing-status/${userPrivateChat.value.id}/${
          userPrivateChatState.value.typing ? 1 : 0
        }`
      )
    }

    const changeUserPrivateChatOnlineStatus = function changeUserPrivateChatOnlineStatus() {
      axiosClient.get(`/front/chats/online-status`)
    }

    onBeforeMount(() => {
      loading.value = false
      usersPrivateChats.value = []
      userPrivateChat.value = null
      userPrivateChatMessages.value = []
      userPrivateChatMessage.value = null
      getUsersPrivateChats()
      getMenuAbilities(path.value, abilities)
    })

    onMounted(() => {
      if (route.query.id) openUserPrivateChat(userId)
      initUsersPrivateChats.value.splice(0, data.value.length, ...data.value)
      // setInterval(() => checkFirstId(), 10000)
      // setInterval(() => getUsersPrivateChats(), 20000)
      setInterval(() => changeUserPrivateChatOnlineStatus(), 30000)
      userPrivateChatMessageAudio.value = new Audio(
        "/src/assets/media/mp3/text-message-notification.mp3"
      )

      KTUtil.onDOMContentLoaded(() => {
        KTAppChat.init(document.querySelector("#kt_chat_messenger"))
      })
    })

    return {
      SERVER_PATH,
      t,
      loading,
      abilities,
      idsSelected,
      usersPrivateChats,
      usersPrivateChatsSearch,
      userPrivateChat,
      userPrivateChatMessages,
      userPrivateChatMessage,
      userPrivateChatMessageAudio,
      checkFirstId,
      getUserPrivateChatSinceTime,
      getUsersPrivateChats,
      searchUsersPrivateChats,
      openUserPrivateChat,
      getUserPrivateChatMessages,
      sendUserPrivateChatMessage,
      changeUserPrivateChatTypingStatus,
      changeUserPrivateChatOnlineStatus,
      loadingSendMessage,
      errorMessage
    }
  }
})
</script>
