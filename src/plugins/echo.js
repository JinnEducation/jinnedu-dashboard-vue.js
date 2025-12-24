import Echo from "laravel-echo"
import Pusher from "pusher-js"

window.Pusher = Pusher

export const initEcho = (token) => {
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,

    authEndpoint: `${import.meta.env.VITE_APP_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    }
  })
}

// echoInstance = new Echo({
//   broadcaster: "pusher",
//   key: import.meta.env.VITE_PUSHER_APP_KEY,
//   cluster: "mt1",
//   wsHost: import.meta.env.VITE_PUSHER_HOST || '',
//   wsPort: Number(import.meta.env.VITE_PUSHER_PORT || 8000),
//   wssPort: Number(import.meta.env.VITE_PUSHER_PORT || 8000),
//   forceTLS: true,
//   encrypted: false,
//   disableStats: true,
//   enabledTransports: ["ws", "wss"],
//   authEndpoint: `${import.meta.env.VITE_APP_API_BASE_URL}/broadcasting/auth`,
//   auth: {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json",
//     },
//   },
// })
