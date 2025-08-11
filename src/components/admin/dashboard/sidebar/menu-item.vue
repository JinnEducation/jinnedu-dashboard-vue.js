<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <div data-kt-menu-trigger="click" class="menu-item menu-accordion">
    <span class="menu-link">
      <span class="menu-icon">
        <span class="svg-icon svg-icon-2">
          <span class="svg-icon svg-icon-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <polygon points="0 0 24 0 24 24 0 24" />
                <rect
                  x="9"
                  y="5"
                  rx="1"
                  width="2"
                  height="14"
                  fill="currentColor"
                  opacity="0.3"
                  transform="translate(10, 12) rotate(-90) translate(-10, -12)" />
                <rect x="19" y="3" rx="1" width="2" height="18" fill="currentColor" opacity="0.5" />
                <path
                  d="M7.70710318,15.7071045 C7.31657888,16.0976288 6.68341391,16.0976288 6.29288961,15.7071045 C5.90236532,15.3165802 5.90236532,14.6834152 6.29288961,14.2928909 L12.2928896,8.29289093 C12.6714686,7.914312 13.281055,7.90106637 13.675721,8.26284357 L19.675721,13.7628436 C20.08284,14.136036 20.1103429,14.7686034 19.7371505,15.1757223 C19.3639581,15.5828413 18.7313908,15.6103443 18.3242718,15.2371519 L13.0300721,10.3841355 L7.70710318,15.7071045 Z"
                  fill="currentColor"
                  fill-rule="nonzero"
                  transform="translate(14, 11) scale(1, -1) rotate(90) translate(-14, -11)" />
              </g>
            </svg>
          </span>
        </span>
      </span>
      <span class="menu-title">{{ t(title) }}</span>
      <span v-if="children.length > 0" class="menu-arrow"></span>
    </span>
    <div v-if="children.length > 0" class="menu-sub menu-sub-accordion">
      <div v-for="child in children" :key="child.title" class="menu-item">
        <router-link :to="`/dashboard/${child.link.replaceAll('.', '/')}`" class="menu-link">
          <span class="menu-bullet">
            <span class="bullet bullet-dot"></span>
          </span>
          <span class="menu-title">{{ t(child.title) }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "sidebar-menu-item",
  props: {
    title: {type: String, required: true},
    icon: {type: Object, required: false, default: null},
    children: {type: Array, required: false, default: null}
  },
  setup() {
    const {t} = useI18n()
    return {t}
  }
})
</script>
