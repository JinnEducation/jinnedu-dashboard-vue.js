// DONE REVIEWING: 25/06/2023
import axios from "axios"
// eslint-disable-next-line
import store from "../store"

const baseURL = import.meta.env.VITE_APP_API_BASE_URL
const axiosClient = axios.create({baseURL})

axiosClient.interceptors.request.use((config) => {
  // eslint-disable-next-line
  config.headers.Authorization = `Bearer ${store.state.user.token}`
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response)
    //   if (Number(error.response.status) === 401 || Number(error.response.status) === 511) {
    //     store.commit("UN_SET_USER")
    //     window.location.assign("/me/auth")
    //   }
    // else if (Number(error.response.status) === 403)
    //   window.location.assign("/me/dashboard/index")

    return Promise.reject(error)
  }
)

export default axiosClient
