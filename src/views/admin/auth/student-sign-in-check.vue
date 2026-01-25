<!-- DONE REVIEWING: NEW -->
<template>
  <div>
    <h1>Sign In Check</h1>
  </div>
</template>

<script>
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { defineComponent, onMounted } from "vue"
import axiosClient from "@/plugins/axios"

export default defineComponent({
  name: "sign-in-check",
  setup() {
    const router = useRouter()
    const store = useStore()

    onMounted(async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get("token")
      const email = params.get("email")
      const to = params.get("to") || "dashboard"

      // لو ناقص بيانات التحقق
      if (!token || !email) {
        router.replace("/auth/sign-in?to=" + to)
        return
      }

      // قراءة بيانات المستخدم المخزنة
      const savedToken = localStorage.getItem("TOKEN")
      const savedUser = JSON.parse(localStorage.getItem("user") || "null")

      // 🧠 تحقق: إذا كان المستخدم القديم مختلف عن الجديد → امسح القديم
      if (savedUser?.user?.email && (savedUser.user.email != email)) {
        store.commit("UN_SET_USER")
      }
      const resChaeck = await axiosClient.post("/auth/check-token", { token, email })
      // تحقق من وجود المستخدم المخزن مسبقاً
      if (savedToken && (savedUser?.user?.email == email) && resChaeck.data.success) {
        store.commit("SET_USER", {
          token,
          user: resChaeck.data.user
        })
        // ✅ المستخدم مسجل فعلاً، روح مباشرة
        router.replace(`/${to}`)
        return
      }
      try {
        if (resChaeck.data.success && resChaeck.data.user) {

          // 1️⃣ خزّن التوكن فورًا (مثل sign-in)
          localStorage.setItem("TOKEN", token)

          // 2️⃣ ثبّت الهيدر يدويًا
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // 3️⃣ خزّن في Vuex
          store.commit("SET_USER", {
            token,
            user: resChaeck.data.user
          })

          // 4️⃣ توجيه
          router.replace(`/${to}`)
        }

        else {
          store.commit("UN_SET_USER")
          // router.replace("/auth/sign-in?to=" + to)
        }
        // if(resChaeck.success == 'false'){
        //             router.replace("/auth/sign-in?to=" + to)

        // }
      } catch (error) {
        console.error("check-token error:", error)
        // router.replace("/auth/sign-in?to=" + to)
      }
    })
  }
})
</script>
