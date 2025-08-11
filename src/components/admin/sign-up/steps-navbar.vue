<template>
  <div class="stepper-nav">
    <div data-kt-stepper-element="nav" class="stepper-item current">
      <div class="stepper-wrapper">
        <div class="stepper-icon rounded-3">
          <span
            class="stepper-check svg-icon svg-icon-1x svg-danger"
            :class="{'text-white': isProfile}"
            :style="{display: isProfile ? 'initial' : 'none'}">
            <check-icon />
          </span>
          <span class="stepper-number" :style="{display: isProfile ? 'none' : 'initial'}">1</span>
        </div>
        <div v-if="!isProfile" class="stepper-label">
          <h3 class="stepper-title fs-2">{{ t("global.account-type-title") }}</h3>
          <!-- <div class="stepper-desc fw-normal">{{ t("global.account-type-description") }}</div> -->
        </div>
        <div v-else class="stepper-label">
          <h3 class="stepper-title fs-2">{{ t("global.profile-title") }}</h3>
          <!-- <div class="stepper-desc fw-normal">{{ t("global.profile-description") }}</div> -->
        </div>
      </div>
      <div class="stepper-line h-40px"></div>
    </div>
    <div data-kt-stepper-element="nav" class="stepper-item">
      <div class="stepper-wrapper">
        <div class="stepper-icon rounded-3">
          <span
            class="stepper-check svg-icon svg-icon-1x"
            :class="{'text-white': isProfile}"
            :style="{display: isProfile ? 'initial' : 'none'}">
            <check-icon />
          </span>
          <span class="stepper-number" :style="{display: isProfile ? 'none' : 'initial'}">2</span>
        </div>
        <div class="stepper-label">
          <h3 class="stepper-title fs-2">{{ t("global.account-information-title") }}</h3>
          <!-- <div class="stepper-desc fw-normal">
            {{ t("global.account-information-description") }}
          </div> -->
        </div>
      </div>
      <div v-show="accountType === 'tutor'" class="stepper-line h-40px"></div>
    </div>
    <div v-show="accountType === 'tutor'" data-kt-stepper-element="nav" class="stepper-item">
      <div class="stepper-wrapper">
        <div class="stepper-icon rounded-3">
          <span
            class="stepper-check svg-icon svg-icon-1x"
            :class="{'text-white': isProfile}"
            :style="{display: isProfile ? 'initial' : 'none'}">
            <check-icon />
          </span>
          <span class="stepper-number" :style="{display: isProfile ? 'none' : 'initial'}">3</span>
        </div>
        <div class="stepper-label">
          <h3 class="stepper-title fs-2">{{ t("global.personal-information-title") }}</h3>
          <!-- <div class="stepper-desc fw-normal">
            {{ t("global.personal-information-description") }}
          </div> -->
        </div>
      </div>
      <div class="stepper-line h-40px"></div>
    </div>
    <div v-show="accountType === 'tutor'" data-kt-stepper-element="nav" class="stepper-item">
      <div class="stepper-wrapper">
        <div class="stepper-icon rounded-3">
          <span
            class="stepper-check svg-icon svg-icon-1x"
            :class="{'text-white': isProfile}"
            :style="{display: isProfile ? 'initial' : 'none'}">
            <check-icon />
          </span>
          <span class="stepper-number" :style="{display: isProfile ? 'none' : 'initial'}">4</span>
        </div>
        <div class="stepper-label">
          <h3 class="stepper-title fs-2">{{ t("global.biography-information-title") }}</h3>
          <!-- <div class="stepper-desc fw-normal">
            {{ t("global.biography-information-description") }}
          </div> -->
        </div>
      </div>
      <div class="stepper-line h-40px"></div>
    </div>
    <div v-show="accountType === 'tutor'" data-kt-stepper-element="nav" class="stepper-item">
      <div class="stepper-wrapper">
        <div class="stepper-icon rounded-3">
          <span
            class="stepper-check svg-icon svg-icon-1x"
            :class="{'text-white': isProfile}"
            :style="{display: isProfile ? 'initial' : 'none'}">
            <check-icon />
          </span>
          <span class="stepper-number" :style="{display: isProfile ? 'none' : 'initial'}">5</span>
        </div>
        <div class="stepper-label">
          <h3 class="stepper-title fs-2">{{ t("global.daily-availability-time-title") }}</h3>
          <!-- <div class="stepper-desc fw-normal">
            {{ t("global.daily-availability-time-description") }}
          </div> -->
        </div>
      </div>
      <div class="stepper-line h-40px"></div>
    </div>
    <div v-show="accountType === 'tutor'" data-kt-stepper-element="nav" class="stepper-item">
      <div class="stepper-wrapper">
        <div class="stepper-icon rounded-3">
          <span
            class="stepper-check svg-icon svg-icon-1x"
            :class="{'text-white': isProfile}"
            :style="{display: isProfile ? 'initial' : 'none'}">
            <check-icon />
          </span>
          <span class="stepper-number" :style="{display: isProfile ? 'none' : 'initial'}">6</span>
        </div>
        <div class="stepper-label">
          <h3 class="stepper-title fs-2">{{ t("global.price-information-title") }}</h3>
          <!-- <div class="stepper-desc fw-normal">{{ t("global.price-information-description") }}</div> -->
        </div>
      </div>
      <div class="stepper-line h-40px"></div>
    </div>
    <div
      v-show="accountType === 'tutor'"
      v-if="!isProfile"
      data-kt-stepper-element="nav"
      class="stepper-item">
      <div class="stepper-wrapper">
        <div class="stepper-icon rounded-3">
          <span
            class="stepper-check svg-icon svg-icon-1x"
            :class="{'text-white': isProfile}"
            :style="{display: isProfile ? 'initial' : 'none'}">
            <check-icon />
          </span>
          <span class="stepper-number" :style="{display: isProfile ? 'none' : 'initial'}">7</span>
        </div>
        <div class="stepper-label">
          <h3 class="stepper-title fs-2">{{ t("global.certification-information-title") }}</h3>
          <!-- <div class="stepper-desc fw-normal">
            {{ t("global.certification-information-description") }}
          </div> -->
        </div>
      </div>
      <div class="stepper-line h-40px"></div>
    </div>
    <div v-show="accountType === 'tutor'" data-kt-stepper-element="nav" class="stepper-item">
      <div class="stepper-wrapper">
        <div class="stepper-icon rounded-3">
          <span
            class="stepper-check svg-icon svg-icon-1x"
            :class="{'text-white': isProfile}"
            :style="{display: isProfile ? 'initial' : 'none'}">
            <check-icon />
          </span>
          <span class="stepper-number" :style="{display: isProfile ? 'none' : 'initial'}">8</span>
        </div>
        <div class="stepper-label">
          <h3 class="stepper-title fs-2">{{ t("global.tutor-video-title") }}</h3>
          <!-- <div class="stepper-desc fw-normal">{{ t("global.tutor-video-description") }}</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue"
import {useI18n} from "vue-i18n"
import CheckIcon from "../icons/check-icon.vue"

export default defineComponent({
  name: "steps-navbar",
  components: {CheckIcon},
  props: {
    accountType: {type: String, required: true},
    isProfile: {type: Boolean, required: true}
  },
  setup() {
    const {t} = useI18n()
    return {t}
  }
})
</script>
