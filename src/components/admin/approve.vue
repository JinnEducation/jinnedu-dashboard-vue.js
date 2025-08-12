<!-- Done Reviewing -->
<template>
  <div class="card card-flush py-4">
    <div class="card-header">
      <div class="card-title">
        <h2 class="required">{{ t("global.approve") }}</h2>
      </div>
      <!-- <div class="card-toolbar">
        <div id="add-approve" :class="`rounded-circle w-15px h-15px ${color}`"></div>
      </div> -->
    </div>
    <div class="card-body pt-0">
      <label for="approve" class="form-label sr-only">Select approve</label>
      <el-form-item prop="approve">
        <el-select
          id="approve"
          v-model="approve"
          name="approve"
          placeholder="Set approve"
          :clearable="true"
          @change="setColor">
          <el-option v-for="item in approves" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, toRef, watch} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "add-approve",
  props: {default: {type: Number, required: false, default: null}},
  setup(props, {expose}) {
    const {t} = useI18n()

    const approves = ref([
      {name: "Not-Approved", id: 0, color: "bg-danger"},
      {name: "Approve", id: 1, color: "bg-success"}
      // {name: "Draft", id: 1, color: "bg-info"},
      // {name: "Scheduled", id: 2, color: "bg-warning"},
    ])

    const defaultRef = toRef(props, "default")
    const approve = ref(0)
    const color = ref("bg-success")

    watch(
      () => defaultRef.value,
      (value) => {
        approve.value = value
      }
    )

    const setColor = function setColor(value) {
      const selected = approves.value.find((item) => Number(item.id) === Number(value))
      color.value = selected.color
    }

    expose({approve})
    return {approves, approve, color, setColor,t}
  }
})
</script>
