<!-- Done Reviewing -->
<template>
  <div class="card card-flush py-4">
    <div class="card-header">
      <div class="card-title">
        <h2>approvement</h2>
      </div>
      <div class="card-toolbar">
        <div id="add-approvement" :class="`rounded-circle w-15px h-15px ${color}`"></div>
      </div>
    </div>
    <div class="card-body pt-0">
      <label for="approvement" class="form-label sr-only">Select approvement</label>
      <el-form-item prop="approvement">
        <el-select
          id="approvement"
          v-model="approvement"
          name="approvement"
          placeholder="Set approvement"
          :clearable="true"
          @change="setColor">
          <el-option
            v-for="item in approvementes"
            :key="item.id"
            :value="item.id"
            :label="item.name" />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, toRef, watch} from "vue"

export default defineComponent({
  name: "add-approvement",
  props: {default: {type: Number, required: false, default: null}},
  setup(props, {expose}) {
    const approvementes = ref([
      {name: "Approved", id: 1, color: "bg-success"},
      {name: "Not-Approved", id: 0, color: "bg-danger"}
    ])

    const defaultRef = toRef(props, "default")
    const approvement = ref(0)
    const color = ref("bg-success")

    watch(
      () => defaultRef.value,
      (value) => {
        approvement.value = value
      }
    )

    const setColor = function setColor(value) {
      const selected = approvementes.value.find((item) => Number(item.id) === Number(value))
      color.value = selected.color
    }

    expose({approvement})
    return {approvementes, approvement, color, setColor}
  }
})
</script>
