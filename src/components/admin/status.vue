<!-- Done Reviewing -->
<template>
  <div class="card card-flush py-4">
    <div class="card-header">
      <div class="card-title">
        <h2 class="required">{{ t("global.status") }}</h2>
      </div>
      <!-- <div class="card-toolbar">
        <div id="add-status" :class="`rounded-circle w-15px h-15px ${color}`"></div>
      </div> -->
    </div>
    <div class="card-body pt-0">
      <label for="status" class="form-label sr-only">{{ t("global.select-status") }}</label>
      <el-form-item prop="status">
        <el-select
          id="status"
          v-model="status"
          name="status"
          placeholder="Set status"
          :clearable="true"
          @change="setColor">
          <el-option v-for="item in statuses" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, toRef, watch} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "add-status",
  props: {default: {type: Number, required: false, default: null}},
  setup(props, {expose}) {
    const {t} = useI18n()

    const statuses = ref([
      {name: "In-Active", id: 0, color: "bg-danger"},
      {name: "Active", id: 1, color: "bg-success"}
    ])

    const defaultRef = toRef(props, "default")
    const status = ref(0)
    const date = ref(Date.now())
    const color = ref("bg-success")

    watch(
      () => defaultRef.value,
      (value) => {
        status.value = value
      }
    )

    const setColor = function setColor(value) {
      const selected = statuses.value.find((item) => Number(item.id) === Number(value))
      color.value = selected.color
    }

    expose({status, date})
    return {statuses, status, color, date, setColor, t}
  }
})
</script>
