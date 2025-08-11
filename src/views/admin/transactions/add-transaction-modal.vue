<template>
  <modal-layout
    id="kt_modal_add_transaction"
    ref="addTransactionModal"
    header-id="kt_modal_add_word_header"
    close-id="kt_modal_add_word_close"
    :title="t('global.add-transaction')"
    form-id="kt_modal_add_word_form"
    scroll-id="kt_modal_add_word_scroll"
    :form-model="transaction"
    :form-rules="rules"
    @form-submit="submit">
    <div class="fv-row mb-7">
      <label for="add-user-id" class="fs-6 fw-semibold mb-2">{{ t("global.user") }}</label>
      <el-form-item prop="user_id">
        <el-select
          v-model="transaction.user_id"
          :placeholder="t('global.select-user')"
          style="width: 100%">
          <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id" />
        </el-select>
      </el-form-item>
    </div>

    <div class="fv-row mb-7">
      <label for="add-amount" class="fs-6 fw-semibold mb-2">{{ t("global.amount") }}</label>
      <el-form-item prop="amount">
        <el-input v-model="transaction.amount" type="number" :placeholder="t('global.amount')" />
      </el-form-item>
    </div>

    <div class="fv-row mb-7">
      <label for="add-type" class="fs-6 fw-semibold mb-2">{{ t("global.type") }}</label>
      <el-form-item prop="type">
        <el-select
          v-model="transaction.type"
          :placeholder="t('global.select-type')"
          style="width: 100%">
          <el-option label="Credit" value="credit" />
          <el-option label="Debit" value="debit" />
        </el-select>
      </el-form-item>
    </div>

    <div class="fv-row mb-7">
      <label for="add-description" class="fs-6 fw-semibold mb-2">{{
        t("global.description")
      }}</label>
      <el-form-item prop="description">
        <el-input
          v-model="transaction.description"
          type="text"
          :placeholder="'global.description'" />
      </el-form-item>
    </div>
    <!-- <div class="fv-row mb-7">
      <label for="add-order-id" class="fs-6 fw-semibold mb-2">{{t('global.order')}}</label>
      <el-form-item prop="order_id">
        <el-select v-model="transaction.order_id" placeholder="Select Order">
          <el-option v-for="order in orders" :key="order.id" :label="order.id" :value="order.id" />
        </el-select>
      </el-form-item>
    </div> -->
  </modal-layout>
</template>

<script>
import {hideModal, removeModalBackdrop} from "@/core/helpers/dom"
import {defineComponent, ref, onMounted} from "vue"
import {useI18n} from "vue-i18n"
import axiosClient from "../../../plugins/axios"
import ModalLayout from "../../../components/layouts/admin/modal.vue"

export default defineComponent({
  components: {ModalLayout},
  emits: ["after-on-submit"],
  setup(_, {emit, expose}) {
    const {t} = useI18n()
    const addTransactionModal = ref(null)
    const transaction = ref({
      user_id: "",
      amount: "",
      type: "",
      description: "",
      order_id: ""
    })
    const users = ref([])
    const orders = ref([])

    const rules = ref({
      user_id: [{required: true, trigger: "change", message: t("global.user-id-is-required")}],
      amount: [{required: true, trigger: "change", message: t("global.amount-is-required")}],
      type: [{required: true, trigger: "change", message: t("global.type-is-required")}]
    })

    // Fetch users and orders from API
    const fetchUsersAndOrders = async () => {
      try {
        const userResponse = await axiosClient.get("/users/all")
        // const orderResponse = await axiosClient.get("/orders")

        users.value = userResponse.data.result // Assuming the API response returns a list of users
        // orders.value = orderResponse.data // Assuming the API response returns a list of orders
      } catch (error) {
        console.error("Failed to fetch users or orders:", error)
      }
    }

    const submit = () => {
      if (!addTransactionModal.value.form) return

      addTransactionModal.value.form.validate((valid, errors) => {
        if (valid) {
          // Make a POST request to add a new transaction
          axiosClient
            .post("wallet/add-transaction", transaction.value)
            .then((response) => {
              Swal.fire({
                icon: "success",
                text: t("global.transaction-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              hideModal(addTransactionModal.value.modal)
              removeModalBackdrop()
              emit("after-on-submit")
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                text: t("global.errors-detected"),
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
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
        }
      })
    }

    onMounted(() => {
      fetchUsersAndOrders()
    })

    expose({addTransactionModal})

    return {
      addTransactionModal,
      transaction,
      users,
      orders,
      rules,
      submit,
      t
    }
  }
})
</script>
