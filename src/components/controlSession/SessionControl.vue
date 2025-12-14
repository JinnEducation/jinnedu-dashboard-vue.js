<script>
import {defineComponent, onMounted, onUnmounted, watch, computed} from "vue"
import {useStore} from "vuex"
import {useRouter} from "vue-router"

export default defineComponent({
  name: "SessionControl",
  setup() {
    const store = useStore()
    const router = useRouter()

    // Session timeout settings (15 minutes in milliseconds)
    const SESSION_TIMEOUT = 15 * 60 * 1000
    const WARNING_TIMEOUT = 14 * 60 * 1000 // Show warning at 14 minutes
    let inactivityTimer = null
    let warningTimer = null
    let sessionCheckInterval = null

    // Use the isAuthenticated getter from your store
    const isAuthenticated = computed(() => store.getters.isAuthenticated)

    // Method to reset the inactivity timer
    const resetInactivityTimer = () => {
      // Clear existing timers
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }
      if (warningTimer) {
        clearTimeout(warningTimer)
      }

      // Set new timers
      inactivityTimer = setTimeout(() => {
        store.dispatch("signOut", {reason: "inactivity"})
        router.push({name: "sign-in"})
      }, SESSION_TIMEOUT)

      warningTimer = setTimeout(() => {
        store.commit("SET_SESSION_WARNING", true)
      }, WARNING_TIMEOUT)

      // Reset warning state if user becomes active again
      store.commit("SET_SESSION_WARNING", false)
    }

    // Setup event listeners for user activity
    const setupActivityListeners = () => {
      const events = ["mousedown", "mousemove", "keypress", "scroll", "click", "touchstart"]
      events.forEach((event) => {
        window.addEventListener(event, resetInactivityTimer)
      })
    }

    // Remove event listeners
    const removeActivityListeners = () => {
      const events = ["mousedown", "mousemove", "keypress", "scroll", "click", "touchstart"]
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer)
      })
    }

    // Initialize session tracking
    const initSessionTracking = () => {
      resetInactivityTimer()
      setupActivityListeners()

      // For SuperAdmin, check sessions every minute
      if (store.getters.isSuperAdmin) {
        sessionCheckInterval = setInterval(() => {
          store.dispatch("checkConcurrentSessions")
        }, 15 * 60 * 1000)
      }
    }

    // Initialize when component mounts
    onMounted(() => {
      if (isAuthenticated.value) {
        initSessionTracking()
      }
    })

    // Clean up when component unmounts
    onUnmounted(() => {
      removeActivityListeners()
      if (inactivityTimer) clearTimeout(inactivityTimer)
      if (warningTimer) clearTimeout(warningTimer)
      if (sessionCheckInterval) clearInterval(sessionCheckInterval)
    })

    // Watch for authentication changes
    watch(isAuthenticated, (newVal) => {
      if (newVal) {
        initSessionTracking()
      } else {
        removeActivityListeners()
        if (inactivityTimer) clearTimeout(inactivityTimer)
        if (warningTimer) clearTimeout(warningTimer)
        if (sessionCheckInterval) clearInterval(sessionCheckInterval)
      }
    })

    return {}
  }
})
</script>
