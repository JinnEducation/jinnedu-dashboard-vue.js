<template>
  <div class="d-flex flex-stack">
    <button
      class="btn border bg-primary"
      type="button"
      style="color: white"
      @click="loginWithGoogle">
      <img
        alt="google"
        src="../../../../assets/media/google.png"
        style="background: white"
        class="h-30px rounded me-5" />
      {{ t("global.google") }}
    </button>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue"
import {useI18n} from "vue-i18n"
import {auth, provider, signInWithPopup} from "../../../../firebase"
import {useStore} from "vuex"

export default defineComponent({
  name: "google-sign-in-button",
  setup(_, {expose}) {
    const {t} = useI18n() // Access translations
    const button = ref(null) // Reference to the button
    const store = useStore()

    expose({button}) // Expose the button reference for parent components

    const loginWithGoogle = async () => {
      try {
        // Sign in with Google
        const result = await signInWithPopup(auth, provider)

        // Get user details
        const {user} = result
        const {displayName, email, photoURL, uid} = user
        // Prepare data for the API request
        const postData = {
          name: displayName,
          email: email,
          provider_name: "google",
          provider_id: uid,
          type: 1, // Change to 2 if it's a tutor
          avatar: photoURL || null // Nullable
        }

        store.dispatch("signInWithGoogle", postData).then((response) => {
          if (response.token) {
            window.location.assign(window.location.origin)
          } else {
            Swal.fire({
              icon: "error",
              text: t("errors.invalid-email-or-password"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
          }
        })

        // // Send POST request to the endpoint
        // const response = await axios.post(
        //   "https://jinntest.jinnedu.com/server/api/social_login",
        //   postData
        // )

        // console.log("API Response:", response.data)

        // // Handle successful response
        // alert("Login successful!")
      } catch (error) {
        // alert("Login failed. Please try again.")
        Swal.fire({
          icon: "error",
          text: t("errors.login-failed")
        })
      }
    }

    return {button, t, loginWithGoogle} // Expose the `loginWithGoogle` method
  }
})
</script>
