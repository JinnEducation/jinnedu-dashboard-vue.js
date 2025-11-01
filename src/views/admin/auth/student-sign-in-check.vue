<!-- DONE REVIEWING: NEW -->
<template>
  <div>
    <h1>Student Sign In Check</h1>
  </div>
</template>

<!-- <script>
import {defineComponent, onMounted} from "vue"
import background from "../../../assets/media/auth/sign-up.png"
import AuthLogo from "../../../components/admin/auth/logo.vue"
import SignInForm from "../../../components/admin/sign-in/form.vue"
import FormFooter from "../../../components/admin/uis/form/footer.vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "sign-in",
  components: {
    AuthLogo,
    SignInForm,
    FormFooter
  },

  setup() {
    const {t} = useI18n()

    onMounted(() => {
      KTUtil.onDOMContentLoaded(() => {
        KTComponents.init()
        KTThemeMode.init()
        KTThemeModeUser.init()
      })
    })

    return {background, t}
  }
})
</script> -->

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
        router.replace("/auth/sign-in")
        return
      }

      // قراءة بيانات المستخدم المخزنة
      const savedToken = localStorage.getItem("TOKEN")
      const savedUser = JSON.parse(localStorage.getItem("user") || "null")

      // 🧠 تحقق: إذا كان المستخدم القديم مختلف عن الجديد → امسح القديم
      if (savedUser?.user?.email && savedUser.user.email !== email) {
        store.commit("UN_SET_USER")
      }

      // تحقق من وجود المستخدم المخزن مسبقاً
      if (savedToken && savedUser?.user?.email === email) {
        // ✅ المستخدم مسجل فعلاً، روح مباشرة
        router.replace(`/${to}`)
        return
      }

      try {
        // تحقق من التوكن عبر الـ API
        const res = await axiosClient.post("/auth/check-token", { token, email })

        if (res.data.success && res.data.user) {
          // ✅ خزّن المستخدم في Vuex بنفس النظام الحالي
          const result = {
            token: token,
            user: res.data.user
          }

          // 🧹 امسح أي بيانات قديمة أولاً قبل الحفظ الجديد
          store.commit("UN_SET_USER")
          store.commit("SET_USER", result)

          // 🔁 توجه مباشرة إلى المسار المطلوب
          window.location.replace(`/${to}`)
        } else {
          router.replace("/auth/sign-in")
        }
      } catch (error) {
        console.error("check-token error:", error)
        router.replace("/auth/sign-in")
      }
    })
  }
})
</script>
