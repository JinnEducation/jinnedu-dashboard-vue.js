<!-- DONE REVIEWING: NEW -->
<template>
  <toolbar :title="t(`global.add-exams`)" />
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
          <div
            class="d-flex flex-shrink-0 flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2 class="required">{{ t("global.category") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="category">
                  <el-select
                    id="category-select"
                    v-model="data.category"
                    name="category-select"
                    :placeholder="t('global.select-a-category')"
                    :filterable="true"
                    :clearable="true"
                    @change="handleSectionSelectChange">
                    <template v-if="categories.length > 0">
                      <el-option
                        v-for="item in categories.filter(
                          (element) => element[['parent', 'id'].join('_')] === 0
                        )"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name" />
                    </template>
                  </el-select>
                </el-form-item>
                <router-link
                  to="/dashboard/sections/categories/add"
                  class="btn btn-light-primary btn-sm mt-2">
                  <span class="svg-icon svg-icon-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none">
                      <rect
                        x="11"
                        y="18"
                        rx="1"
                        width="12"
                        height="2"
                        transform="rotate(-90 11 18)"
                        fill="currentColor"
                        opacity="0.5" />
                      <rect x="6" y="11" rx="1" width="12" height="2" fill="currentColor" />
                    </svg>
                  </span>
                  {{ t("global.create-a-new-category") }}
                </router-link>
              </div>
            </div>
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2 class="required">{{ t("global.level") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="level">
                  <el-select
                    id="level-select"
                    v-model="data.level"
                    name="level-select"
                    placeholder="Select a level"
                    :filterable="true"
                    :clearable="true"
                    @change="handleLevelSelectChange">
                    <template v-if="levels.length > 0">
                      <el-option
                        v-for="item in levels"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                        :selected="item.id === data.level" />
                    </template>
                  </el-select>
                </el-form-item>
                <router-link
                  to="/dashboard/constants/levels"
                  class="btn btn-light-primary btn-sm mt-2">
                  <span class="svg-icon svg-icon-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none">
                      <rect
                        x="11"
                        y="18"
                        rx="1"
                        width="12"
                        height="2"
                        transform="rotate(-90 11 18)"
                        fill="currentColor"
                        opacity="0.5" />
                      <rect x="6" y="11" rx="1" width="12" height="2" fill="currentColor" />
                    </svg>
                  </span>
                  {{ t("global.create-a-new-level") }}
                </router-link>
              </div>
            </div>
            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2 class="required">{{ t("global.group-class") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <el-form-item prop="groupClass">
                  <el-select
                    id="group-class-select"
                    v-model="data.groupClass"
                    name="group-class-select"
                    :placeholder="t('global.select-a-group-class')"
                    :filterable="true"
                    :clearable="true">
                    <template v-if="filteredGroupClasses.length > 0">
                      <el-option
                        v-for="groupClass in filteredGroupClasses"
                        :key="groupClass.id"
                        :value="groupClass.id"
                        :label="
                          groupClass.langs.find(
                            (lang) => Number(lang.language_id) === Number(languageId)
                          )?.title
                        "
                        :selected="groupClass.id === data.groupClass" />
                    </template>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
            <languages-tabs v-slot="slot">
              <div>
                <div class="card mx-5 mb-4 bg-light">
                  <div class="card-header">
                    <h5>{{ t("global.exam-details") }}</h5>
                  </div>
                  <div class="card-body" style="background: #fafafa">
                    <div class="fv-row mb-10">
                      <label :for="'exam-title-' + slot.language.id" class="required form-label">
                        {{ t("global.exam-title") }}
                      </label>
                      <el-form-item :prop="`examTitles.${slot.language.id}`">
                        <el-input
                          :id="'exam-title-' + slot.language.id"
                          v-model="data.examTitles[slot.language.id]"
                          type="text"
                          :placeholder="t('global.exam-title')" />
                      </el-form-item>
                    </div>
                    <div class="fv-row mb-10">
                      <label :for="'exam-description-' + slot.language.id" class="form-label">
                        {{ t("global.description") }}
                      </label>
                      <el-form-item>
                        <el-input
                          :id="'exam-description-' + slot.language.id"
                          v-model="data.examDescriptions[slot.language.id]"
                          type="textarea"
                          :rows="3"
                          :placeholder="t('global.description')" />
                      </el-form-item>
                    </div>
                    <div class="fv-row mb-10">
                      <label :for="'exam-instructions-' + slot.language.id" class="form-label">
                        {{ t("global.instructions") }}
                      </label>
                      <el-form-item>
                        <el-input
                          :id="'exam-instructions-' + slot.language.id"
                          v-model="data.examInstructions[slot.language.id]"
                          type="textarea"
                          :rows="3"
                          :placeholder="t('global.instructions')" />
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div
                  v-for="(question, questionIndex) in data.questions"
                  :key="question.id"
                  class="card mx-5 mb-4 bg-gray">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h5>{{ t("global.exam-question") }} #{{ questionIndex + 1 }}</h5>
                    <button
                      type="button"
                      class="btn btn-sm btn-light-danger"
                      @click="removeQuestion(questionIndex)">
                      {{ t("global.remove-question") }}
                    </button>
                  </div>
                  <div class="card-body" style="background: #fafafa">
                    <div class="fv-row mb-10">
                      <label :for="'exam-question-' + questionIndex" class="required form-label">
                        {{ t("global.exam-question") }}
                      </label>
                      <el-form-item :prop="`questions.${questionIndex}.titles.${slot.language.id}`">
                        <el-input
                          :id="'exam-question-' + questionIndex"
                          v-model="question.titles[slot.language.id]"
                          type="text"
                          :placeholder="t('global.exam-question')" />
                      </el-form-item>
                    </div>
                    <div :class="`d-flex flex-column gap-7`">
                      <div
                        v-for="(answer, answerIndex) in question.answers"
                        :key="answer.id"
                        class="d-flex align-items-center gap-3">
                        <div class="form-check form-check-sm form-check-custom form-check-solid">
                          <label
                            :for="'is-true-' + questionIndex + '-' + answerIndex + '-radio'"
                            class="sr-only"
                            >{{ t("global.is-true") }}</label
                          >
                          <input
                            :id="'is-true-' + questionIndex + '-' + answerIndex + '-radio'"
                            v-model="question.correctAnswerId"
                            type="radio"
                            :name="'is-true-' + questionIndex + '-radio'"
                            :value="answer.id"
                            required
                            class="form-check-input" />
                        </div>
                        <label
                          :for="'exam-answer-' + answer.id"
                          class="required form-label mb-0"
                          style="white-space: nowrap">
                          {{ t("global.answer") }} #{{ answerIndex + 1 }}
                        </label>
                        <el-form-item
                          :prop="`questions.${questionIndex}.answers.${answerIndex}.titles.${slot.language.id}`"
                          class="mb-0">
                          <el-input
                            :id="'exam-answer-' + answer.id"
                            v-model="answer.titles[slot.language.id]"
                            type="text"
                            :placeholder="`Exam Answer #${answerIndex + 1}`" />
                        </el-form-item>
                        <button
                          type="button"
                          class="btn btn-sm btn-outline btn-light-danger"
                          @click="removeAnswer(questionIndex, answer.id)">
                          {{ t("global.delete") }}
                        </button>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        class="btn btn-sm btn-light btn-outline mt-3"
                        @click="addAnswer(questionIndex)">
                        {{ t("global.add-answer") }}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    class="btn btn-sm btn-light btn-outline mr-auto mt-5"
                    @click="addQuestion">
                    {{ t("global.add-question") }}
                  </button>
                </div>
              </div>
            </languages-tabs>

            <div class="card card-flush py-4">
              <div class="card-header">
                <div class="card-title">
                  <h2>{{ t("global.exam-details") }}</h2>
                </div>
              </div>
              <div class="card-body pt-0">
                <div class="fv-row mb-10">
                  <label for="exam-name" class="required form-label">
                    {{ t("global.exam-unique-name") }}
                  </label>
                  <el-form-item prop="name">
                    <el-input
                      id="exam-name"
                      v-model="data.name"
                      type="text"
                      :placeholder="t('global.exam-unique-name')" />
                  </el-form-item>
                </div>
                <div class="fv-row mb-10">
                  <label for="duration-minutes" class="required form-label">
                    {{ t("global.duration-minutes") }}
                  </label>
                  <el-form-item prop="duration_minutes">
                    <el-input-number
                      id="duration-minutes"
                      v-model="data.duration_minutes"
                      :min="1"
                      :max="999"
                      :placeholder="t('global.duration-minutes')"
                      style="width: 100%" />
                  </el-form-item>
                </div>
                <div class="fv-row mb-10">
                  <label for="pass-percentage" class="required form-label">
                    {{ t("global.pass-percentage") }}
                  </label>
                  <el-form-item prop="pass_percentage">
                    <el-input-number
                      id="pass-percentage"
                      v-model="data.pass_percentage"
                      :min="0"
                      :max="100"
                      :placeholder="t('global.pass-percentage')"
                      style="width: 100%" />
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-end">
              <router-link id="cancel" to="/dashboard/exams/index" class="btn btn-light me-5">
                {{ t("global.cancel") }}
              </router-link>
              <button
                id="submit"
                ref="button"
                type="submit"
                class="btn btn-primary"
                @click.prevent="submit">
                <span class="indicator-label">{{ t("global.save-changes") }}</span>
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
import LanguagesTabs from "@/components/admin/languages-tabs.vue"
import {defineComponent, onBeforeMount, onMounted, ref, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import axiosClient from "../../../plugins/axios"

export default defineComponent({
  name: "add-exam",
  components: {
    Toolbar,
    LanguagesTabs
  },
  setup() {
    // Get necessary data from router/route/store
    const {t} = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const {languages} = store.state
    const {id} = route.params
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)

    // Define form necessary data
    const loading = ref(null)
    const form = ref(null)
    const rules = ref({
      name: [
        {
          required: true,
          trigger: "change",
          message: t(`global.an-exam-name-required-unique`)
        }
      ],
      category: [
        {
          required: true,
          trigger: "change",
          message: t(`global.exam-category-required`)
        }
      ],
      level: [
        {
          required: true,
          trigger: "change",
          message: t(`global.exam-level-required`)
        }
      ],
      duration_minutes: [
        {
          required: true,
          trigger: "change",
          message: t(`global.duration-minutes-required`)
        }
      ],
      pass_percentage: [
        {
          required: true,
          trigger: "change",
          message: t(`global.pass-percentage-required`)
        }
      ],
      examTitles: {},
      title: {},
      answers: []
    })

    languages.forEach((languageItem) => {
      // eslint-disable-next-line
      const {id, name} = languageItem
      rules.value.examTitles[id] = [
        {
          required: true,
          trigger: "change",
          message: t(
            `global.exam-title-in-${name.charAt(0).toUpperCase() + name.slice(1)}-is-required`
          )
        }
      ]
    })

    // Define necessary data for this specific component
    const API_PATH = ref(import.meta.env.VITE_APP_API_BASE_URL)
    const button = ref(null)
    const categories = ref([])
    const categoriesChildren = ref([])
    const levels = ref([])
    const groupClasses = ref([])

    const languagesData = computed(() => store.state.languages)
    const languageId = ref(null)
    const lang = languagesData.value.find((element) => element.shortname === store.state.language)
    languageId.value = lang ? lang.id : null

    // Function to generate unique IDs
    // eslint-disable-next-line func-style
    function generateUniqueId() {
      return Math.random().toString(36).substr(2, 4)
    }

    // Define data schema to be submitted
    const data = ref({
      name: null,
      duration_minutes: 60,
      pass_percentage: 70,
      examTitles: {},
      examDescriptions: {},
      examInstructions: {},
      questions: [
        {
          id: generateUniqueId(),
          type: "mcq",
          score: 10,
          titles: {},
          explanations: {},
          answers: [
            {id: generateUniqueId(), isCorrect: false, titles: {}},
            {id: generateUniqueId(), isCorrect: false, titles: {}}
          ],
          correctAnswerId: null
        }
      ],
      category: null,
      categoryChildren: null,
      level: null,
      groupClass: null
    })

    const addQuestion = () => {
      data.value.questions.push({
        id: Date.now(),
        type: "mcq",
        score: 10,
        titles: {},
        explanations: {},
        answers: [
          {id: Date.now() + 1, isCorrect: false, titles: {}},
          {id: Date.now() + 2, isCorrect: false, titles: {}}
        ],
        correctAnswerId: null
      })
    }

    const removeQuestion = (questionIndex) => {
      if (data.value.questions.length > 1) {
        data.value.questions.splice(questionIndex, 1)
      } else {
        // Optional: You can show a message if the user tries to remove the last question.
        // alert("At least one question is required.")
        Swal.fire({
          icon: "error",
          text: t("global.at-least-one-question-required"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      }
    }

    const addAnswer = (questionIndex) => {
      data.value.questions[questionIndex].answers.push({
        id: generateUniqueId(), // Use unique ID function
        isCorrect: false, // Default value
        titles: {} // Initialize as an empty object
      })
    }

    const removeAnswer = (questionIndex, answerId) => {
      const {answers} = data.value.questions[questionIndex]
      if (answers.length > 2) {
        data.value.questions[questionIndex].answers = answers.filter(
          (answer) => answer.id !== answerId
        )
      } else {
        // Optional: Show a message if trying to remove the last answer.
        // alert("At least two answers are required.")
        Swal.fire({
          icon: "error",
          text: t("global.at-least-two-question-required"),
          confirmButtonText: t("global.got-it"),
          buttonsStyling: false,
          customClass: {confirmButton: "btn btn-danger"}
        })
      }
    }


    const filteredGroupClasses = computed(() => {
      // Check if groupClasses.value is an array before attempting to filter it
      if (Array.isArray(groupClasses.value)) {
        return groupClasses.value.filter((group) => group.level_id === data.value.level)
      }
      // Handle the case where groupClasses.value is not an array
      return []
    })

    const fetchGroupClasses = () => {
      axiosClient
        .get(`/group-classes?level=${data.value.level}`)
        .then((response) => {
          // Ensure response.data is an array before assigning it to groupClasses.value
          if (Array.isArray(response.data.result.data)) {
            groupClasses.value = response.data.result.data
          } else {
            // console.error("Invalid data format for group classes:", response.data)
          }
        })
        .catch(() => {
          // Error fetching group classes
        })
    }

    const handleLevelSelectChange = () => {
      fetchGroupClasses()
    }

    // Get categories children after changing category value
    const handleSectionSelectChange = function handleSectionSelectChange() {
      categoriesChildren.value = []
      data.value.categoryChildren = null

      if (data.value.category) {
        return axiosClient.get(`/categories/show/${data.value.category}`).then((response) => {
          if (response.data.result.childrens.length > 0)
            categoriesChildren.value = response.data.result.childrens
          else if (response.data.result.childrens.length === 0) categoriesChildren.value = []
          else categoriesChildren.value = []
        })
      }
    }

    const submit = function submit() {
      button.value.setAttribute("data-kt-indicator", "on")
      button.value.disabled = true
      button.value.ariaDisabled = true

      form.value.validate((valid, errors) => {
        if (valid) {
          // Validate at least one question
          if (data.value.questions.length === 0) {
            Swal.fire({
              icon: "error",
              text: t("global.at-least-one-question-required"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
            button.value.removeAttribute("data-kt-indicator")
            button.value.disabled = false
            button.value.ariaDisabled = false
            return
          }

          // Validate each question has at least 2 answers and at least one correct answer
          for (let i = 0; i < data.value.questions.length; i += 1) {
            const question = data.value.questions[i]
            if (question.answers.length < 2) {
              Swal.fire({
                icon: "error",
                text: t("global.at-least-two-question-required"),
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
              button.value.removeAttribute("data-kt-indicator")
              button.value.disabled = false
              button.value.ariaDisabled = false
              return
            }
            if (!question.correctAnswerId) {
              Swal.fire({
                icon: "error",
                text: t("global.at-least-one-correct-answer-required"),
                confirmButtonText: t("global.got-it"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-danger"}
              })
              button.value.removeAttribute("data-kt-indicator")
              button.value.disabled = false
              button.value.ariaDisabled = false
              return
            }
          }

          // Prepare data to send to the backend
          const {category, categoryChildren} = data.value

          // Build exam data according to new API
          const examData = {
            level_id: data.value.level,
            category_id: categoryChildren || category || 0,
            group_class_id: data.value.groupClass,
            duration_minutes: data.value.duration_minutes,
            pass_percentage: data.value.pass_percentage,
            is_active: true,
            langs: languages.map((language) => ({
              language_id: language.id,
              title: data.value.examTitles[language.id] || "",
              description: data.value.examDescriptions[language.id] || "",
              instructions: data.value.examInstructions[language.id] || ""
            })),
            questions: data.value.questions.map((q, qIndex) => ({
              question_no: qIndex + 1,
              type: q.type || "mcq",
              score: q.score || 10,
              is_active: true,
              langs: languages.map((language) => ({
                language_id: language.id,
                title: q.titles[language.id] || "",
                explanation: q.explanations?.[language.id] || null
              })),
              answers: q.answers.map((a, aIndex) => ({
                is_correct: a.id === q.correctAnswerId,
                sort_order: aIndex + 1,
                langs: languages.map((language) => ({
                  language_id: language.id,
                  title: a.titles[language.id] || ""
                }))
              }))
            }))
          }

          // Send data to the backend
          axiosClient
            .post(id ? `/exams/update/${id}` : `/exams/create`, examData)
            .then(() => {
              Swal.fire({
                icon: "success",
                text: t("global.exam-created-successfully"),
                confirmButtonText: t("global.thank-you"),
                buttonsStyling: false,
                customClass: {confirmButton: "btn btn-primary"}
              })
              router.push({name: "exams-group-class"})
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


    onBeforeMount(() => {
      if (id) {
        loading.value = true
      }
    })

    onMounted(() => {
      let categoriesPromise = null
      let levelsPromise = null
      let groupClassesPromise = null
      loading.value = true

      categoriesPromise = axiosClient.get(`/${["categories"].join("")}`).then((response) => {
        categories.value = response.data.result.data
      })

      levelsPromise = axiosClient.get("/levels?exams=1").then((responseLevels) => {
        levels.value = responseLevels.data.result.data
      })

      groupClassesPromise = axiosClient.get("/group-classes").then((responseGroupClasses) => {
        groupClasses.value = responseGroupClasses.data.result.data
      })

      Promise.all([categoriesPromise, levelsPromise, groupClassesPromise])
        .then(() => {
          if (!id) {
            loading.value = false
            return
          }

          axiosClient
            .get(`/exams/show/${id}`)
            .then((response) => {
              const {data: result} = response

              // Set basic exam details
              const englishLang = result.data.langs_all?.find(
                (element) => element.language_id === 1
              )
              data.value.name = englishLang ? englishLang.title : ""
              data.value.level = result.data.level_id
              data.value.groupClass = result.data.group_class_id
              data.value.duration_minutes = result.data.duration_minutes || 60
              data.value.pass_percentage = result.data.pass_percentage || 70

              // Populate exam translations for each language
              data.value.examTitles = {}
              data.value.examDescriptions = {}
              data.value.examInstructions = {}
              languages.forEach((languageItem) => {
                const langEntry = result.data.langs_all?.find(
                  (langItem) => Number(languageItem.id) === Number(langItem.language_id)
                )
                if (langEntry) {
                  data.value.examTitles[languageItem.id] = langEntry.title || ""
                  data.value.examDescriptions[languageItem.id] = langEntry.description || ""
                  data.value.examInstructions[languageItem.id] = langEntry.instructions || ""
                }
              })

              // Convert questions from new API structure
              data.value.questions = (result.data.questions || []).map((question) => {
                const questionData = {
                  id: question.id,
                  type: question.type || "mcq",
                  score: question.score || 10,
                  titles: {},
                  explanations: {},
                  answers: [],
                  correctAnswerId: null
                }

                // Populate question titles and explanations for each language
                languages.forEach((languageItem) => {
                  const langEntry = question.langs_all?.find(
                    (langItem) => Number(languageItem.id) === Number(langItem.language_id)
                  )
                  if (langEntry) {
                    questionData.titles[languageItem.id] = langEntry.title || ""
                    questionData.explanations[languageItem.id] = langEntry.explanation || ""
                  }
                })

                // Convert answers
                questionData.answers = (question.answers || []).map((answer) => {
                  const answerData = {
                    id: answer.id,
                    isCorrect: answer.is_correct,
                    titles: {}
                  }

                  // Set correct answer ID
                  if (answer.is_correct) {
                    questionData.correctAnswerId = answer.id
                  }

                  // Populate answer titles for each language
                  languages.forEach((languageItem) => {
                    const answerLangEntry = answer.langs_all?.find(
                      (answerLangItem) =>
                        Number(answerLangItem.language_id) === Number(languageItem.id)
                    )
                    if (answerLangEntry) {
                      answerData.titles[languageItem.id] = answerLangEntry.title || ""
                    }
                  })

                  return answerData
                })

                return questionData
              })

              // Handle category selection
              const categoryMatch = categories.value.find(
                (category) => category.id === result.data.category_id || category.parent_id === 0
              )

              if (categoryMatch) {
                data.value.category =
                  categoryMatch.parent_id === 0 ? categoryMatch.id : categoryMatch.parent_id

                if (categoryMatch.parent_id !== 0) {
                  handleSectionSelectChange().then(() => {
                    data.value.categoryChildren = categoryMatch.id
                  })
                }
              }

              // Clear form validation and stop loading
              form.value.clearValidate()
              loading.value = false
            })
            .catch(() => {
              loading.value = false
            })
        })
        .catch(() => {
          loading.value = false
        })
    })

    return {
      id,
      loading,
      form,
      rules,
      button,
      data,
      categories,
      categoriesChildren,
      levels,
      API_PATH,
      SERVER_PATH,
      handleSectionSelectChange,
      submit,
      handleLevelSelectChange,
      filteredGroupClasses,
      t,
      addQuestion,
      removeQuestion,
      addAnswer,
      removeAnswer,
      languageId
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
