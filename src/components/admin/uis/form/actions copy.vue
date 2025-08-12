<template>
  <div class="d-flex flex-stack">
    <button ref="button" type="submit" class="btn btn-primary">
      <span class="indicator-label">{{ t("global.submit") }}</span>
      <span class="indicator-progress">
        {{ t("global.wait-please") }}
        <span class="spinner-border spinner-border-sm align-middle ms-2" />
      </span>
    </button>
    <button class="btn btn-secondary" type="button" @click="loginWithGoogle">
      Login with Google
    </button>
  </div>
</template>

<script>
import {defineComponent, ref, onMounted} from "vue"
import {useI18n} from "vue-i18n"
import {useStore} from "vuex"
import {auth, provider, signInWithPopup, onAuthStateChanged} from "../../../../firebase"
import Swal from "sweetalert2"

export default defineComponent({
  name: "form-button",
  setup(_, {expose}) {
    const {t} = useI18n() // Access translations
    const button = ref(null) // Reference to the button
    const store = useStore() // Vuex store
    const isLoggedIn = ref(false) // Track if the user is already logged in

    expose({button}) // Expose the button reference for parent components

    const loginWithGoogle = async () => {
      try {
        if (isLoggedIn.value) {
          // If already signed in, skip the popup
          const user = auth.currentUser
          console.log("User already signed in:", user)

          // Prepare data for the API request
          const {displayName, email, photoURL, uid} = user
          const postData = {
            name: displayName,
            email: email,
            provider_name: "google",
            provider_id: uid,
            type: 1, // Change to 2 if it's a tutor
            avatar: photoURL || null // Nullable
          }

          // Dispatch Vuex action
          store.dispatch("signInWithGoogle", postData).then((response) => {
            if (response.token) {
              window.location.assign(window.location.origin)
            } else {
              Swal.fire({
                icon: "error",
                text: "Invalid Email or Password or Email Not Found",
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            }
          })
        } else {
          // If not signed in, proceed with Google sign-in popup
          const result = await signInWithPopup(auth, provider)

          // Get user details
          const {user} = result
          const {displayName, email, photoURL, uid} = user

          console.log("User Info:", user)

          // Prepare data for the API request
          const postData = {
            name: displayName,
            email: email,
            provider_name: "google",
            provider_id: uid,
            type: 1, // Change to 2 if it's a tutor
            avatar: photoURL || null // Nullable
          }

          // Dispatch Vuex action
          store.dispatch("signInWithGoogle", postData).then((response) => {
            if (response.token) {
              window.location.assign(window.location.origin)
            } else {
              Swal.fire({
                icon: "error",
                text: "Invalid Email or Password or Email Not Found",
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            }
          })
        }
      } catch (error) {
        console.error("Google Login or API Error:", error.message)
        Swal.fire({
          icon: "error",
          text: "Login failed. Please try again.",
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      }
    }

    // Check if user is already signed in
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        console.log(user)
        if (user) {
          isLoggedIn.value = true // User is already signed in
        } else {
          isLoggedIn.value = false // No user is signed in
        }
      })
    })

    return {button, t, loginWithGoogle, isLoggedIn} // Expose methods and state
  }
})
</script>
