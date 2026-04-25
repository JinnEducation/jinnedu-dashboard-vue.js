<template>
  <toolbar :title="t(`global.add-payout`)" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <template v-if="loading">
        <div class="card-body p-0">
          <div class="card-px text-center py-20 my-10">
            <div role="status" class="spinner-border text-primary">
              <span class="visually-hidden">{{ t("global.loading") }}...</span>
            </div>
          </div>
        </div>
      </template>

      <div v-show="!loading">
        <el-form
          ref="form"
          :model="data"
          :rules="rules"
          :validate-on-rule-change="false"
          class="form d-flex flex-column flex-lg-row">
          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>
                    {{ t("global.payout-details") }}
                  </h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <!-- <div class="fv-row mb-10">
                  <label for="group-class-name" class="required form-label">Title</label>
                  <el-form-item prop="quantity">
                    <el-input
                      id="group-class-name"
                      v-model="data.title"
                      type="text"
                      name="group-class-name"
                      placeholder="Title" />
                  </el-form-item>
                </div> -->

                <div class="fv-row mb-8">
                  <label for="payout-amount" class="required form-label">{{
                    t("global.amount")
                  }}</label>
                  <el-form-item prop="quantity" class="el-width payout-amount-field">
                    <el-input-number
                      id="payout-amount"
                      v-model="data.quantity"
                      type="number"
                      :min="1"
                      :max="1000000"
                      :step="1"
                      controls-position="right" />
                  </el-form-item>
                </div>

                <div class="fv-row">
                  <label class="required form-label d-block mb-4">{{ t("global.method") }}</label>
                  <el-form-item prop="paymentType" class="w-100 mb-4">
                    <div class="row g-4 w-100 m-0">
                      <div class="col-md-6 p-0 pe-md-2">
                        <input
                          id="kt_create_payment_form_payment_type_paypal"
                          v-model="data.paymentType"
                          type="radio"
                          name="payment-type"
                          value="paypal"
                          class="btn-check" />
                        <label
                          for="kt_create_payment_form_payment_type_paypal"
                          class="payment-option d-flex align-items-center justify-content-center p-5 rounded w-100">
                          <span class="svg-icon svg-icon-2x me-3 text-primary">
                            <svg
                              id="Layer_1"
                              data-name="Layer 1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512">
                              <path
                                d="M424.81,148.79c-.43,2.76-.93,5.58-1.49,8.48-19.17,98-84.76,131.8-168.54,131.8H212.13a20.67,20.67,0,0,0-20.47,17.46L169.82,444.37l-6.18,39.07a10.86,10.86,0,0,0,9.07,12.42,10.72,10.72,0,0,0,1.7.13h75.65a18.18,18.18,0,0,0,18-15.27l.74-3.83,14.24-90,.91-4.94a18.16,18.16,0,0,1,18-15.3h11.31c73.3,0,130.67-29.62,147.44-115.32,7-35.8,3.38-65.69-15.16-86.72A72.27,72.27,0,0,0,424.81,148.79Z" />
                              <path
                                d="M385.52,51.09C363.84,26.52,324.71,16,274.63,16H129.25a20.75,20.75,0,0,0-20.54,17.48l-60.55,382a12.43,12.43,0,0,0,10.39,14.22,12.58,12.58,0,0,0,1.94.15h89.76l22.54-142.29-.7,4.46a20.67,20.67,0,0,1,20.47-17.46h42.65c83.77,0,149.36-33.86,168.54-131.8.57-2.9,1.05-5.72,1.49-8.48h0C410.94,98.06,405.19,73.41,385.52,51.09Z" />
                            </svg>
                          </span>
                          <div>
                            <div class="fw-bold">PayPal</div>
                            <small class="text-muted">{{ t("global.paypal-account") }}</small>
                          </div>
                        </label>
                      </div>
                      <div class="col-md-6 p-0 ps-md-2">
                        <input
                          id="kt_create_payment_form_payment_type_bank"
                          v-model="data.paymentType"
                          type="radio"
                          name="payment-type"
                          value="bank"
                          class="btn-check" />
                        <label
                          for="kt_create_payment_form_payment_type_bank"
                          class="payment-option d-flex align-items-center justify-content-center p-5 rounded w-100">
                          <span class="svg-icon svg-icon-2x me-3 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                              <path
                                fill="var(--ci-primary-color, currentColor)"
                                d="M247.759,14.358,16,125.946V184H496V125.638ZM464,152H48v-5.946L248.241,49.642,464,146.362Z"
                                class="ci-primary" />
                              <rect
                                width="416"
                                height="32"
                                x="48"
                                y="408"
                                fill="var(--ci-primary-color, currentColor)"
                                class="ci-primary" />
                              <rect
                                width="480"
                                height="32"
                                x="16"
                                y="464"
                                fill="var(--ci-primary-color, currentColor)"
                                class="ci-primary" />
                              <rect
                                width="32"
                                height="160"
                                x="56"
                                y="216"
                                fill="var(--ci-primary-color, currentColor)"
                                class="ci-primary" />
                              <rect
                                width="32"
                                height="160"
                                x="424"
                                y="216"
                                fill="var(--ci-primary-color, currentColor)"
                                class="ci-primary" />
                              <rect
                                width="32"
                                height="160"
                                x="328"
                                y="216"
                                fill="var(--ci-primary-color, currentColor)"
                                class="ci-primary" />
                              <rect
                                width="32"
                                height="160"
                                x="152"
                                y="216"
                                fill="var(--ci-primary-color, currentColor)"
                                class="ci-primary" />
                              <rect
                                width="32"
                                height="160"
                                x="240"
                                y="216"
                                fill="var(--ci-primary-color, currentColor)"
                                class="ci-primary" />
                            </svg>
                          </span>
                          <div>
                            <div class="fw-bold">{{ t("global.bank-name") }}</div>
                            <small class="text-muted">Bank Transfer</small>
                          </div>
                        </label>
                      </div>
                    </div>
                  </el-form-item>

                  <template v-if="data.paymentType === 'paypal'">
                    <div class="card card-flush p-4 payout-method-card">
                      <div class="fv-row mb-0">
                        <label for="paypalAccount" class="required form-label">
                          {{ t("global.paypal-account") }}
                        </label>
                        <el-form-item prop="paypalAccount">
                          <el-input
                            id="paypalAccount"
                            v-model="data.paypalAccount"
                            type="text"
                            name="paypalAccount"
                            :placeholder="t('global.paypal-account')" />
                        </el-form-item>
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div class="card card-flush p-4 payout-method-card">
                      <div class="row g-4">
                        <div class="col-md-6">
                          <label for="bank-account-name" class="required form-label">{{
                            t("global.name")
                          }}</label>
                          <el-form-item prop="bankAccountName">
                            <el-input
                              id="bank-account-name"
                              v-model="data.bankAccountName"
                              type="text"
                              name="bank-account-name"
                              :placeholder="t('global.name')" />
                          </el-form-item>
                        </div>
                        <div class="col-md-6">
                          <label for="country" class="required form-label">{{
                            t("global.country")
                          }}</label>
                          <el-form-item prop="countryId">
                            <el-select
                              id="country"
                              v-model="data.countryId"
                              filterable
                              clearable
                              class="w-100"
                              :placeholder="`${t('global.select')} ${t('global.country')}`">
                              <el-option
                                v-for="countryOption in countries"
                                :key="countryOption.id"
                                :label="countryOption.name"
                                :value="countryOption.id" />
                            </el-select>
                          </el-form-item>
                        </div>
                        <div class="col-md-6">
                          <label for="bank-name" class="required form-label">{{
                            t("global.bank-name")
                          }}</label>
                          <el-form-item prop="bankName">
                            <el-input
                              id="bank-name"
                              v-model="data.bankName"
                              type="text"
                              name="bank-name"
                              :placeholder="t('global.bank-name')" />
                          </el-form-item>
                        </div>
                        <div class="col-md-6">
                          <label for="swift-code" class="required form-label">{{
                            t("global.swift-code")
                          }}</label>
                          <el-form-item prop="swiftCode">
                            <el-input
                              id="swift-code"
                              v-model="data.swiftCode"
                              type="text"
                              name="swift-code"
                              :placeholder="t('global.swift-code')" />
                          </el-form-item>
                        </div>
                        <div class="col-md-6">
                          <label for="iban" class="required form-label">{{
                            t("global.iban")
                          }}</label>
                          <el-form-item prop="iban">
                            <el-input
                              id="iban"
                              v-model="data.iban"
                              type="text"
                              name="iban"
                              :placeholder="t('global.iban')" />
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end">
              <router-link id="cancel" to="/dashboard/payout/list" class="btn btn-light me-5">
                {{ t("global.cancel") }}
              </router-link>
              <button
                id="submit"
                ref="button"
                type="submit"
                class="btn btn-primary"
                @click.prevent="submit"
                @keypress.prevent="click">
                <span class="indicator-label">
                  {{ t("global.save-changes") }}
                </span>
                <span class="indicator-progress">
                  {{ t("global.please-wait") }} ...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import {defineComponent, onMounted, ref, watch} from "vue"
import {useI18n} from "vue-i18n"
import {useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"

export default defineComponent({
  name: "add-payout",
  components: {
    Toolbar
  },
  setup() {
    const {t} = useI18n()
    const store = useStore()
    const router = useRouter()
    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type

    const loading = ref(false)
    const form = ref(null)
    const button = ref(null)
    const status = ref({status: null, date: null})

    const data = ref({
      quantity: "",
      paymentType: "paypal",
      paypalAccount: "",
      bankName: "",
      bankAccountName: "",
      iban: "",
      swiftCode: "",
      country: "",
      countryId: null,
      tutor: null,
      user: null
    })
    const countries = ref([])
    const availableBalance = ref(null)
    const defaultCountryId = ref(null)
    const defaultCountryName = ref("")

    const requiredForMethod = (method) => {
      return (rule, value, callback) => {
        if (data.value.paymentType === method && !String(value || "").trim()) {
          callback(new Error(t("global.errors-detected")))
          return
        }
        callback()
      }
    }

    const rules = ref({
      quantity: [{required: true, trigger: "change", message: t("global.amount-is-required")}],
      paymentType: [{required: true, trigger: "change", message: t("global.type-is-required")}],
      paypalAccount: [{validator: requiredForMethod("paypal"), trigger: ["blur", "change"]}],
      bankName: [{validator: requiredForMethod("bank"), trigger: ["blur", "change"]}],
      bankAccountName: [{validator: requiredForMethod("bank"), trigger: ["blur", "change"]}],
      iban: [{validator: requiredForMethod("bank"), trigger: ["blur", "change"]}],
      swiftCode: [{validator: requiredForMethod("bank"), trigger: ["blur", "change"]}],
      countryId: [{validator: requiredForMethod("bank"), trigger: ["blur", "change"]}]
    })

    const getDefaultCountry = () => {
      const user = userInfoObject?.user || {}
      return user.country?.name || user.country_name || user.country || user.address_country || ""
    }

    const checkForTutor = function checkForTutor() {
      if (userInfoObject.user.type === 2) {
        data.value.tutor = userInfoObject.user.id
      } else {
        data.value.user = userInfoObject.user.id
      }
    }

    const loadCountries = async () => {
      const response = await axiosClient.get("/front/constants/countries?limit=500")
      countries.value = response.data?.result?.data || []
    }

    const loadProfileCountry = async () => {
      try {
        const response = await axiosClient.get("/profileUser")
        const about = response.data?.result?.abouts?.[0] || null
        defaultCountryId.value = about?.country_id || null
        defaultCountryName.value = about?.country?.name || ""
      } catch (e) {
        defaultCountryId.value = null
        defaultCountryName.value = ""
      }
    }

    const loadWalletBalance = async () => {
      try {
        const response = await axiosClient.get("/wallet/balance")
        const balance =
          response?.data?.result?.balance ?? response?.data?.balance ?? response?.data?.result?.amount
        availableBalance.value = Number(balance ?? 0)
      } catch (e) {
        availableBalance.value = null
      }
    }

    const getApiErrorMessage = (responseData) => {
      const message = responseData?.message
      if (message === "you-don't-have-enough-balance") {
        const key = "errors.you-don't-have-enough-balance"
        const translated = t(key)
        return translated !== key ? translated : t("errors.you-don't-have-a-balance")
      }
      if (message === "you-don't-have-a-balance" || responseData?.["msg-code"] === "223") {
        return t("errors.you-don't-have-a-balance")
      }
      return t("global.unknown-error")
    }

    watch(
      () => data.value.paymentType,
      (paymentType) => {
        if (paymentType === "paypal") {
          data.value.bankName = ""
          data.value.bankAccountName = ""
          data.value.iban = ""
          data.value.swiftCode = ""
          data.value.country = ""
          data.value.countryId = null
        } else {
          data.value.paypalAccount = ""
          if (!data.value.countryId && defaultCountryId.value) {
            data.value.countryId = defaultCountryId.value
          }

          if (!data.value.countryId && defaultCountryName.value && countries.value.length) {
            const matchedCountry = countries.value.find(
              (countryOption) => countryOption.name === defaultCountryName.value
            )
            if (matchedCountry) data.value.countryId = matchedCountry.id
          }

          if (!data.value.country && !data.value.countryId) {
            data.value.country = getDefaultCountry()
          }
        }
      }
    )

    watch(
      () => data.value.countryId,
      (countryId) => {
        const selectedCountry = countries.value.find(
          (countryOption) => Number(countryOption.id) === Number(countryId)
        )
        data.value.country = selectedCountry?.name || ""
      }
    )

    const submit = function submit() {
      const requestedAmount = Number(data.value.quantity || 0)
      if (
        availableBalance.value !== null &&
        Number.isFinite(requestedAmount) &&
        requestedAmount > Number(availableBalance.value)
      ) {
        const key = "errors.you-don't-have-enough-balance"
        const translated = t(key)
        Swal.fire({
          icon: "error",
          text: translated !== key ? translated : t("errors.you-don't-have-a-balance"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
        return
      }

      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disabled = true
      button.value.ariaDisabled = true
      form.value.validate((valid, errors) => {
        if (valid) {
          axiosClient
            .post(`payouts/store`, {
              amount: data.value.quantity,
              method: data.value.paymentType,
              paypal_account: data.value.paypalAccount ? data.value.paypalAccount : "",
              bank_name: data.value.bankName ? data.value.bankName : "",
              bank_account_name: data.value.bankAccountName ? data.value.bankAccountName : "",
              iban: data.value.iban ? data.value.iban : "",
              swift_code: data.value.swiftCode ? data.value.swiftCode : "",
              country: data.value.country ? data.value.country : "",
              country_id: data.value.countryId ? data.value.countryId : ""
            })
            .then((response) => {
              if (response.data.success) {
                Swal.fire({
                  icon: "success",
                  text: t("global.payout-requested-successfully"),
                  confirmButtonText: t("global.thank-you"),
                  buttonsStyling: false,
                  customClass: {confirmButton: "btn btn-primary"}
                })
                router.push({name: "payout-list"})
              } else {
                const errorMessage = getApiErrorMessage(response.data)

                Swal.fire({
                  icon: "error",
                  text: errorMessage,
                  confirmButtonText: t("global.got-it"),
                  buttonsStyling: false,
                  customClass: {confirmButton: "btn btn-danger"}
                })
              }
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                text: t("global.errors-detected"),
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
            })
            .finally(() => {
              button.value.removeAttribute("data-kt-indicator")
              button.value.disabled = false
              button.value.ariaDisabled = false
            })
        } else {
          const errorMessages = Object.values(errors)
            .flat()
            .map((error) => error.message)
          Swal.fire({
            icon: "error",
            title: t("global.errors-detected"),
            html: errorMessages.join("<br>"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          })

          button.value.removeAttribute("data-kt-indicator")
          button.value.disabled = false
          button.value.ariaDisabled = false
        }
      })
    }

    onMounted(async () => {
      checkForTutor()
      await Promise.allSettled([loadCountries(), loadProfileCountry(), loadWalletBalance()])

      if (defaultCountryId.value && countries.value.length) {
        const countryExists = countries.value.some(
          (countryOption) => Number(countryOption.id) === Number(defaultCountryId.value)
        )
        if (countryExists) data.value.countryId = defaultCountryId.value
      }

      if (!data.value.countryId && defaultCountryName.value && countries.value.length) {
        const matchedCountry = countries.value.find(
          (countryOption) => countryOption.name === defaultCountryName.value
        )
        if (matchedCountry) data.value.countryId = matchedCountry.id
      }

      if (!data.value.country && !data.value.countryId) {
        data.value.country = getDefaultCountry()
      }
    })

    return {
      loading,
      form,
      rules,
      button,
      status,
      data,
      countries,
      getDefaultCountry,
      checkForTutor,
      submit,
      userType,
      t
    }
  }
})
</script>

<style>
.el-width .el-input,
.el-width .el-select,
.el-width .el-input-number {
  width: 100%;
}

.payout-amount-field .el-input-number {
  width: 220px;
}

.payment-option {
  border: 1px dashed #d3d7dd;
  background: #f8f9fb;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 92px;
}

.payment-option:hover {
  border-color: #3699ff;
  background: #eef6ff;
}

.btn-check:checked + .payment-option {
  border-color: #3699ff;
  background: #e8f2ff;
  box-shadow: 0 0 0 1px rgba(54, 153, 255, 0.25);
}

.payout-method-card {
  border: 1px solid #eef0f4;
  background: #fcfdff;
}
</style>
