<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div class="app-navbar-item ms-1 ms-md-3">
    <div
      data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
      data-kt-menu-attach="parent"
      data-kt-menu-placement="bottom-end"
      class="cursor-pointer symbol symbol-30px symbol-md-40px">
      <img :src="`https://jinntest.jinnedu.com/server/${profile.avatar}`" alt="User Menu Toggle" />
    </div>
    <div
      data-kt-menu="true"
      class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px">
      <div class="menu-item px-3">
        <div class="menu-content d-flex align-items-center px-3">
          <div class="symbol symbol-50px me-5">
            <img :src="`hhttps://jinntest.jinnedu.com/server/${profile.avatar}`" alt="User" />
          </div>
          <div class="d-flex flex-column">
            <div class="fw-bold d-flex align-items-center fs-5">
              {{ profile.name }}
              <span class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"></span>
            </div>
            <a href="#" class="fw-semibold text-muted text-hover-primary fs-7">
              {{ profile.email }}
            </a>
          </div>
        </div>
      </div>
      <div class="separator my-2"></div>
      <div class="menu-item px-5">
        <router-link to="/dashboard/index" class="menu-link px-5">{{
          t("global.my-profile")
        }}</router-link>
      </div>
      <div class="separator my-2"></div>
      <navbar-languages-menu />
      <div type="button" class="menu-item px-5" @click="signOut" @keypress="signOut">
        <a href="#" class="menu-link px-5">{{ t("global.sign-out") }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onBeforeMount, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../../../plugins/axios"
import NavbarLanguagesMenu from "./languages-menu.vue"

export default defineComponent({
  name: "navbar-user-menu",
  components: {NavbarLanguagesMenu},
  setup() {
    const {t} = useI18n()
    const router = useRouter()
    const store = useStore()
    const profile = ref({})
    const signOut = function signOut() {
      store.dispatch("signOut").finally(() => router.push({name: "auth"}))
    }

    onBeforeMount(() => {
      axiosClient.get("/profile").then((response) => {
        profile.value = response.data.user
      })
    })

    return {t, profile, signOut}
  }
})
</script>
