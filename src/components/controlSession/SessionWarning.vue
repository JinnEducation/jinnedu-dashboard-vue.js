<template>
  <div v-if="showWarning" class="session-warning-overlay">
    <div class="session-warning-modal">
      <h3>Session Timeout Warning</h3>
      <p>Your session will expire due to inactivity in {{ countdown }} seconds.</p>
      <div class="buttons">
        <button @click="extendSession" class="btn-continue">Continue Session</button>
        <button @click="logoutNow" class="btn-logout">Log Out Now</button>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, ref, onMounted, onUnmounted, watch} from "vue"
import {useStore} from "vuex"

export default {
  name: "SessionWarning",
  setup() {
    const store = useStore()
    const countdown = ref(60)
    let countdownInterval = null

    // Corrected to access sessionWarning from root state
    const showWarning = computed(() => store.state.sessionWarning)

    const extendSession = () => {
      store.dispatch("resetInactivityTimer")
    }

    const logoutNow = () => {
      store.dispatch("signOut") // Changed to match your store's action name
    }

    // Watch for warning state changes
    watch(showWarning, (newVal) => {
      if (newVal) {
        countdown.value = 60 // Reset countdown when warning appears
        countdownInterval = setInterval(() => {
          countdown.value -= 1
          if (countdown.value <= 0) {
            clearInterval(countdownInterval)
            logoutNow()
          }
        }, 1000)
      } else {
        if (countdownInterval) {
          clearInterval(countdownInterval)
        }
      }
    })

    onUnmounted(() => {
      if (countdownInterval) clearInterval(countdownInterval)
    })

    return {
      showWarning,
      countdown,
      extendSession,
      logoutNow
    }
  }
}
</script>

<style>
.session-warning-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.session-warning-modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.session-warning-modal h3 {
  margin-top: 0;
  color: #d32f2f;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-continue {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-logout {
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
