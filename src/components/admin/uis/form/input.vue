<!-- DONE REVIEWING: GITHUB COMMIT -->
<template>
  <label :for="id" class="form-label required" :class="{'sr-only': isSrOnly}">
    {{ label }}
  </label>
  <input
    :id="id"
    ref="input"
    :type="type"
    :name="name"
    :value="inputValue"
    :min="type === 'number' ? 0 : false"
    :placeholder="placeholder"
    :class="['form-control form-control-solid form-control-lg', classes].join(' ')"
    @input="updateInputValue" />
</template>

<script>
import {defineComponent, ref} from "vue"

export default defineComponent({
  name: "form-input",
  props: {
    id: {type: String, required: true},
    isSrOnly: {type: Boolean, required: false, default: true},
    label: {type: String, required: true},
    type: {type: String, required: true},
    name: {type: String, required: true},
    inputValue: {type: String, default: null},
    placeholder: {type: String, required: true},
    classes: {type: String, default: ""}
  },
  emits: ["update:inputValue", "handleInputPassword"],
  setup(_, {emit, expose}) {
    const input = ref(null)
    const updateInputValue = function updateInputValue(event) {
      emit("update:inputValue", event.target.value)
      if (event.target.name === "password") emit("handleInputPassword", event.target.value)
    }

    expose({input})
    return {input, updateInputValue}
  }
})
</script>
