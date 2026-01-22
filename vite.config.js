// DONE REVIEWING: NEW
import vueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"
import vue from "@vitejs/plugin-vue"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import { defineConfig } from "vite"
import postcssRTLCSS from "postcss-rtlcss"
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5"

const require = createRequire(import.meta.url)

export default defineConfig({
  base: "/me/",
  // define: {
  //   VITE_APP_NAME: JSON.stringify("jinnedu"),
  //   VITE_APP_FULL_NAME: JSON.stringify("JINN Education"),
  //   VITE_APP_VERSION: JSON.stringify("1.0.0"),
  //   VITE_APP_BASE_DIRECTORY: JSON.stringify("/me"),
  //   VITE_APP_BASE_URL: JSON.stringify("https://learning.jinnedu.com/"), // Assuming you use the default Vite development port
  //   VITE_APP_SERVER_BASE_URL: JSON.stringify("https://learning.jinnedu.com/"), // Change the port as per your local server configuration
  //   VITE_APP_API_BASE_URL: JSON.stringify("https://learning.jinnedu.com/api") // Change the port and path as per your local server configuration
  // },
  css: {
    postcss: {
      plugins: [postcssRTLCSS({})]
    }
  },
  plugins: [
    vue(),
    ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
    vueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), "./src/locales/**"),
      runtimeOnly: false
    })
  ],
  // server: {
  //   port: 5173,
  //   strictPort: true // يمنع تغيير البورت تلقائيًا
  // },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    target: "esnext"
  }
})
