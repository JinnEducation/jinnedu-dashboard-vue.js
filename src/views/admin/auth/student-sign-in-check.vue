<!-- DONE REVIEWING: NEW -->
<template>
  <div class="p-6 text-center">
    <h1>{{ statusTitle }}</h1>
    <p v-if="statusMessage">{{ statusMessage }}</p>
  </div>
</template>

<script>
import {useRouter} from "vue-router"
import {useStore} from "vuex"
import {defineComponent, onMounted, ref} from "vue"
import axiosClient from "@/plugins/axios"

export default defineComponent({
  name: "sign-in-check",
  setup() {
    const router = useRouter()
    const store = useStore()
    const statusTitle = ref("Verifying your sign in...")
    const statusMessage = ref("Please wait while we complete your login.")

    onMounted(async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get("token")
      const email = params.get("email")
      const to = params.get("to") || "dashboard"
      const resolveRedirectPath = () => {
        const normalized = String(to || "").replace(/^\/+/, "")
        if (!normalized || normalized === "dashboard") {
          return "/dashboard/index"
        }
        return `/${normalized}`
      }

      // لو ناقص بيانات التحقق
      if (!token || !email) {
        statusTitle.value = "Redirecting to sign in"
        router.replace("/auth/sign-in?to=" + to)
        return
      }

      // قراءة بيانات المستخدم المخزنة
      const savedToken = localStorage.getItem("TOKEN")
      const savedUser = JSON.parse(localStorage.getItem("user") || "null")

      // 🧠 تحقق: إذا كان المستخدم القديم مختلف عن الجديد → امسح القديم
      if (savedUser?.user?.email && savedUser.user.email != email) {
        store.commit("UN_SET_USER")
      }

      try {
        const resCheck = await axiosClient.post("/auth/check-token", {token, email})

        if (savedToken && savedUser?.user?.email == email && resCheck.data.success) {
          store.commit("SET_USER", {
            token,
            user: resCheck.data.user
          })
          await store.dispatch("getAPINavigation", {force: true})
          router.replace(resolveRedirectPath())
          return
        }

        if (resCheck.data.success && resCheck.data.user) {
          // 1️⃣ خزّن التوكن فورًا (مثل sign-in)
          localStorage.setItem("TOKEN", token)

          // 2️⃣ ثبّت الهيدر يدويًا
          axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // 3️⃣ خزّن في Vuex
          store.commit("SET_USER", {
            token,
            user: resCheck.data.user
          })

          await store.dispatch("getAPINavigation", {force: true})

          // 4️⃣ توجيه
          router.replace(resolveRedirectPath())
        } else {
          store.commit("UN_SET_USER")
          statusTitle.value = "Sign in verification failed"
          statusMessage.value = "Redirecting you back to sign in."
          router.replace("/auth/sign-in?to=" + to)
        }
      } catch (error) {
        console.error("check-token error:", error)
        store.commit("UN_SET_USER")
        statusTitle.value = "Unable to verify sign in"
        statusMessage.value = "Please try again. Redirecting to sign in."
        router.replace("/auth/sign-in?to=" + to)
      }
    })

    return {
      statusTitle,
      statusMessage
    }
  }
})
</script>
