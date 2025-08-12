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
                      <label for="exam-question" class="required form-label">
                        {{ t("global.exam-question") }}
                      </label>
                      <el-form-item :prop="`questions.${questionIndex}.title.${slot.language.id}`">
                        <el-input
                          v-model="question.title[slot.language.id]"
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
                            v-model="question.answersTrue[slot.language.id]"
                            type="radio"
                            :name="'is-true-' + questionIndex + '-' + slot.language.id + '-radio'"
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
                          :prop="`questions.${questionIndex}.answers.${answerIndex}.title.${slot.language.id}`"
                          class="mb-0">
                          <el-input
                            :id="'exam-answer-' + answer.id"
                            v-model="answer.title[slot.language.id]"
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
import {defineComponent, onBeforeMount, onMounted, ref, watch, computed} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import {createLanguagesCustom} from "../../../core/helpers/creators"
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
      title: {},
      answers: []
    })

    languages.forEach((languageItem) => {
      // eslint-disable-next-line
      const {id, name} = languageItem
      rules.value.title[id] = [
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
      questions: [
        {
          id: generateUniqueId(),
          title: {},
          answers: [
            {id: generateUniqueId(), is_true: 0, title: {}},
            {id: generateUniqueId(), is_true: 0, title: {}}
          ],
          answersTrue: 0
        }
      ],
      title: "", // Assuming title is a string
      answers: Array.from({length: 2}, (_, index) => ({
        id: generateUniqueId(), // Use a function to generate unique IDs
        is_true: 0,
        title: []
      })),
      answersTrue: 0,
      category: null,
      categoryChildren: null,
      level: null,
      groupClass: null
    })

    const addQuestion = () => {
      data.value.questions.push({
        id: Date.now(),
        title: {},
        answers: [
          {id: Date.now() + 1, is_true: 0, title: {}},
          {id: Date.now() + 2, is_true: 0, title: {}}
        ],
        answersTrue: 0
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
        is_true: 0, // Default value
        title: {} // Initialize as an empty object
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

    const updateAnswersRules = function updateAnswersRules() {
      rules.value.answers = []
      data.value.answers.forEach((answer, index) => {
        rules.value.answers[index] = {title: {}}
        languages.forEach((languageItem) => {
          const {id: languageId} = languageItem
          rules.value.answers[index].title[languageId] = [
            {
              required: true,
              trigger: "change",
              message: t("global.this-field-is-required")
            }
          ]
        })
      })
    }

    updateAnswersRules()

    watch(
      () => data.value.answers.length,
      () => {
        updateAnswersRules()
      }
    )

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
        .catch((error) => {
          // console.error("Error fetching group classes:", error)
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
          // Prepare data to send to the backend
          const {category, categoryChildren} = data.value

          // Prepare `questions` with `answers` for each language
          const questions = data.value.questions.map((question) => ({
            id: question.id,
            langs: createLanguagesCustom({key: "title", values: question.title}),
            answers: question.answers.map((answer) => {
              // Check if `langs` exists and has at least one item
              const languageId =
                answer.langs && answer.langs[0] ? answer.langs[0].language_id : null

              // Check if the `answersTrue` mapping contains the answer for this language
              const isAnswerTrue = languageId && question.answersTrue[languageId] === answer.id

              // If not found in `answersTrue`, use the `answer.is_true` as a fallback
              const finalIsTrue = isAnswerTrue
              return {
                id: answer.id,
                is_true: finalIsTrue ? 1 : 0, // Set the `is_true` based on the conditions
                langs: createLanguagesCustom({
                  key: "title",
                  values: answer.title
                })
              }
            })
          }))

          // Send data to the backend
          axiosClient
            .post(id ? `/exams/update/${id}` : `/exams/create`, {
              name: data.value.name,
              [["category", "id"].join("_")]: categoryChildren || category || 0,
              [["level", "id"].join("_")]: data.value.level,
              group_class_id: data.value.groupClass,
              questions: questions
            })
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

    // const submit = function submit() {
    //   button.value.setAttribute("data-kt-indicator", "on")
    //   button.value.disable = true
    //   button.value.ariaDisabled = true
    //   form.value.validate((valid, errors) => {
    //     if (valid) {
    //       // Refactor THIS
    //       const {category, categoryChildren} = data.value
    //       const languagesArray = createLanguagesCustom({key: "title", values: data.value.title})

    //       data.value.answers.forEach((answer) => {
    //         // eslint-disable-next-line
    //         answer.langs = createLanguagesCustom({key: "title", values: answer.title})
    //         // eslint-disable-next-line
    //         if (Number(answer.id) === Number(data.value.answersTrue)) answer.is_true = 1
    //       })

    //       axiosClient
    //       .post(id ? `/exams/update/${id}` : `/exams/create`, {
    //         name: data.value.name,
    //           [["category", "id"].join("_")]: categoryChildren || category || 0,
    //           langs: languagesArray,
    //           [["level", "id"].join("_")]: data.value.level,
    //           group_class_id: data.value.groupClass,
    //           answers: data.value.answers
    //         })
    //         .then(() => {
    //           Swal.fire({
    //             icon: "success",
    //             text: t("global.exam-created-successfully"),
    //             confirmButtonText: t("global.thank-you"),
    //             buttonsStyling: false,
    //             customClass: {confirmButton: "btn btn-primary"}
    //           })
    //           router.push({name: "exams-list"})
    //         })
    //         .catch(() => {
    //           Swal.fire({
    //             icon: "error",
    //             text: t("global.errors-detected"),
    //             confirmButtonText: t("global.got-it"),
    //             buttonsStyling: false,
    //             customClass: {confirmButton: "btn btn-danger"}
    //           })
    //         })
    //         .finally(() => {
    //           button.value.removeAttribute("data-kt-indicator")
    //           button.value.disabled = false
    //           button.value.ariaDisabled = false
    //         })
    //     } else {
    //       const errorMessages = Object.values(errors)
    //         .flat()
    //         .map((error) => error.message)
    //       Swal.fire({
    //         icon: "error",
    //         title: t("global.errors-detected"),
    //         html: errorMessages.join("<br>"),
    //         confirmButtonText: t("global.got-it"),
    //         buttonsStyling: false,
    //         customClass: {confirmButton: "btn btn-danger"}
    //       })

    //       button.value.removeAttribute("data-kt-indicator")
    //       button.value.disabled = false
    //       button.value.ariaDisabled = false
    //     }
    //   })
    // }

    onBeforeMount(() => {
      if (id) {
        loading.value = true
      }
    })

    onMounted(() => {
      let categoriesPromise = null
      let levelsPromise = null
      let groupClassesPromise = null
      const examPromise = null
      loading.value = true

      categoriesPromise = axiosClient.get(`/${["categories"].join("")}`).then((response) => {
        categories.value = response.data.result.data
      })

      levelsPromise = axiosClient.get("/levels").then((responseLevels) => {
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
              const englishLang = result.data.langs.find((element) => element.language_id === 1)
              data.value.name = englishLang ? englishLang.title : ""
              data.value.level = result.data.level_id
              data.value.groupClass = result.data.group_class_id

              // Populate titles for each language
              data.value.title = {}
              languages.forEach((language) => {
                const langEntry = result.data.langs.find(
                  (lang) => Number(language.id) === Number(lang.language_id)
                )
                if (langEntry) {
                  data.value.title[language.id] = langEntry.title
                }
              })

              // Group questions by unique exam_id to avoid duplication
              const groupedQuestions = result.data.langs.reduce((acc, question) => {
                if (!acc[question.exam_id]) {
                  acc[question.exam_id] = {
                    id: question.exam_id,
                    title: {[question.language_id]: question.title},
                    answersTrue: {}, // Initialize language-specific true answers
                    answers: []
                  }
                } else {
                  // Add additional languages to the question title
                  acc[question.exam_id].title[question.language_id] = question.title
                }

                return acc
              }, {})

              // Convert groupedQuestions to an array and map through each question
              data.value.questions = Object.values(groupedQuestions).map((questionFinal) => {
                const questionAnswers = result.data.answers.filter(
                  (answer) => answer.exam_id === questionFinal.id
                )

                questionFinal.answers = questionAnswers.map((answer) => {
                  const answerFinal = {
                    id: answer.id,
                    is_true: answer.is_true,
                    title: {[answer.langs[0].language_id]: answer.langs[0].title},
                    langs: answer.langs
                  }

                  // Set the correct answer ID for the respective language
                  if (answer.is_true) {
                    // Initialize answersTrue for each language if not already set
                    answer.langs.forEach((answerLang) => {
                      questionFinal.answersTrue[answerLang.language_id] = answer.id
                    })
                  }

                  // Add additional language titles for each answer
                  languages.forEach((language) => {
                    const answerLangEntry = answer.langs.find(
                      (answerLang) => answerLang.language_id === language.id
                    )
                    if (answerLangEntry) {
                      answerFinal.title[language.id] = answerLangEntry.title
                    }
                  })

                  return answerFinal
                })

                return questionFinal
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
            .catch((error) => {
              console.error("Failed to fetch exam data:", error)
              loading.value = false
            })
        })
        .catch((error) => {
          console.error("Failed to load initial data:", error)
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
