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

                <div class="fv-row row">
                  <div class="col-12 col-md-4">
                    <label for="group-class-minimum-size" class="required form-label">
                      {{ t("global.quantity") }}
                    </label>
                    <el-form-item prop="minimumSize" class="el-width">
                      <el-input-number
                        id="group-class-minimum-size"
                        v-model="data.quantity"
                        type="number"
                        :min="5" />
                    </el-form-item>
                  </div>
                </div>

                <div class="fv-row">
                  <div class="row">
                    <div class="col-lg-6">
                      <input
                        id="kt_create_payment_form_payment_type_paypal"
                        v-model="data.paymentType"
                        type="radio"
                        name="payment-type"
                        value="paypal"
                        class="btn-check" />
                      <label
                        for="kt_create_payment_form_payment_type_paypal"
                        class="justify-content-center btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center mb-10">
                        <span class="svg-icon svg-icon-3x me-5">
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
                      </label>
                    </div>
                    <div class="col-lg-6">
                      <input
                        id="kt_create_payment_form_payment_type_bank"
                        v-model="data.paymentType"
                        type="radio"
                        name="payment-type"
                        value="bank"
                        class="btn-check" />
                      <label
                        for="kt_create_payment_form_payment_type_bank"
                        class="justify-content-center btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center">
                        <span class="svg-icon svg-icon-3x me-5">
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
                      </label>
                    </div>
                  </div>

                  <!-- PayPal Form Fields -->
                  <template v-if="data.paymentType === 'paypal'">
                    <div class="card card-flush p-4">
                      <!-- PayPal Form Fields Go Here -->
                      <div class="fv-row mb-10">
                        <label for="paypalAccount" class="required form-label">
                          {{ t("global.paypal-account") }}
                          </label
                        >
                        <el-form-item prop="paypalAccount">
                          <el-input
                            id="paypalAccount"
                            v-model="data.paypalAccount"
                            type="text"
                            name="paypalAccount"
                            :placeholder="t('global.paypal-account')" />
                        </el-form-item>
                      </div>
                      <!-- Add more PayPal fields as needed -->
                    </div>
                  </template>

                  <!-- Bank Form Fields -->
                  <template v-if="data.paymentType === 'bank'">
                    <div class="card card-flush p-4">
                      <!-- Bank Form Fields Go Here -->
                      <div class="fv-row mb-10">
                        <label for="bank-name" class="required form-label">
                          {{ t("global.bank-name") }}
                          </label>
                        <el-form-item prop="bankName">
                          <el-input
                            id="bank-name"
                            v-model="data.bankName"
                            type="text"
                            name="bank-name"
                            :placeholder="t('global.bank-name')" />
                        </el-form-item>
                      </div>

                      <div class="fv-row mb-10">
                        <label for="bank-account-number" class="required form-label">
                          {{ t("global.bank-account-number") }}
                          </label>
                        <el-form-item prop="bankAccountNumber">
                          <el-input
                            id="bank-account-number"
                            v-model="data.bankAccountNumber"
                            type="text"
                            name="bank-account-number"
                            :placeholder="t('global.bank-account-number')" />
                        </el-form-item>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end">
              <router-link id="cancel" to="/dashboard/payout/index" class="btn btn-light me-5">
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
import {defineComponent, onBeforeMount, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"

export default defineComponent({
  name: "add-payout",
  components: {
    Toolbar
  },
  setup() {
    // Get necessary data from router/route/store
    const {t} = useI18n()
    const store = useStore()
    const router = useRouter()
    const {userInfo} = store.state
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type

    // Define form necessary data
    const loading = ref(null)
    const form = ref(null)
    const rules = ref({})

    // Define necessary data for this specific component
    const API_PATH = ref(import.meta.env.VITE_APP_API_BASE_URL)
    const button = ref(null)
    const status = ref({status: null, date: null})

    // Define data schema to be submit it
    const data = ref({
      title: "",
      quantity: "",
      paymentType: "paypal", // Default to PayPal
      paypalAccount: "",
      bankName: "",
      bankAccountNumber: "",
      tutor: null,
      user: null
    })

    const checkForTutor = function checkForTutor() {
      // if tutors search tutors
      if (userInfoObject.user.type === 2) {
        axiosClient.get(`/users?type=2&tutor_id=${userInfoObject.user.id}`).then((response) => {
          data.value.tutor = response.data.result.data.id
          // Update tutors with the fetched data
          //   tutors.value = response.data.result.data;
        })
        // if admin search in tutors
      } else {
        data.value.user = userInfoObject.user.id
        // axiosClient.get(`/users?type=2`).then((response) => {
        //   tutors.value = response.data.result.data
        // })
      }
    }

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disable = true
      button.value.ariaDisabled = true
      form.value.validate((valid, errors) => {
        if (valid) {
          axiosClient
            .post(`payouts/store`, {
              //  title:data.value.title,
              amount: data.value.quantity,
              method: data.value.paymentType,
              paypal_account: data.value.paypalAccount ? data.value.paypalAccount : "",
              bank_name: data.value.bankName ? data.value.bankName : "",
              account_no: data.value.bankAccountNumber ? data.value.bankAccountNumber : ""
              //  tutor:data.value.tutor ? data.value.tutor : '',
              //  user:data.value.user ? data.value.user : ''
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
                router.push({name: "dashboard"})
              } else {
                let errorMessage = ""
                switch (response.data["msg-code"]) {
                  case "223":
                    errorMessage = t("errors.you-don't-have-a-balance")
                    break
                  default:
                    errorMessage = t("global.unknown-error")
                    break
                }

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
          // Handle validation errors
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

    onBeforeMount(() => {})

    onMounted(() => {
      checkForTutor()
    })

    return {
      loading,
      form,
      rules,
      button,
      status,
      data,
      checkForTutor,
      API_PATH,
      SERVER_PATH,
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
</style>
