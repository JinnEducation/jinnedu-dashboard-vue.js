<!-- Done Reviewing -->
<template>
  <div class="col-md-4">
    <div class="card card-flush h-md-100">
      <div class="card-header">
        <div class="card-title">
          <h2>{{ t("global." + item.title) }}</h2>
        </div>
      </div>
      <div class="card-body pt-1">
        <div class="d-flex flex-column text-gray-600">
          <template v-for="(child, index) in item.childrens" :key="index">
            <div class="d-flex align-items-center py-2">
              <div class="form-check form-check-sm form-check-custom form-check-solid">
                <input
                  :id="`role-child-${child.id}`"
                  type="checkbox"
                  :value="child.id"
                  :name="`role-child-${child.id}`"
                  :checked="child.checked"
                  class="form-check-input" />
              </div>
              <label :for="`role-child-${child.id}`" class="ms-3">
                {{ t(`global.${child.title}`) }}
              </label>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "role-menu",
  props: {
    item: {type: Object, required: true}
  },
  setup() {
    const {t} = useI18n()
    return {t}
  }
})
</script>
