// Disable console logs in production
import ElementPlus from "element-plus"
import "element-plus/theme-chalk/dark/css-vars.css"
import "element-plus/theme-chalk/index.css"
import "@vuepic/vue-datepicker/dist/main.css"
import {createApp, watchEffect} from "vue"
import App from "./App.vue"
import I18N from "./plugins/i18n"
import Router from "./router"
import Store from "./store"
import "./assets/css/plugins.css"
import "./assets/css/style1.css" // Default style

const application = createApp(App)
application.config.warnHandler = () => null

application.use(Router)
application.use(Store)
application.use(I18N)
application.use(ElementPlus)

// Watch for language changes and load the correct CSS
watchEffect(() => {
  const {language} = Store.state // Directly access store state
  if (language === "ar") {
    import("./assets/css/ar_style.css")
  } else {
    import("./assets/css/style1.css")
  }
})

application.mount("#kt_app_root")
