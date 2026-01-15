// DONE REVIEWING: 23/06/2023
import {createRouter, createWebHistory} from "vue-router"

import i18n, {getI18nLanguages} from "@/plugins/i18n"
import store from "@/store"

// AUTH COMPONENTS
import AuthLayout from "@/components/layouts/admin/auth.vue"
import DashboardLayout from "@/components/layouts/admin/dashboard.vue"
import ForgotPassword from "@/views/admin/auth/forgot-password.vue"
import NewPassword from "@/views/admin/auth/new-password.vue"
import StudentSignIn from "@/views/admin/auth/student-sign-in.vue"
import StudentSignInCheck from "@/views/admin/auth/student-sign-in-check.vue"
import AdminSignIn from "@/views/admin/auth/admin-sign-in.vue"

// import AdminSignIn from "@/views/admin/admin-sign-in.vue"sign-up-17-2-2025
import SignUp from "@/views/admin/auth/sign-up.vue"
// import Profile from "@/views/admin/profile.vue"
import EmailVerify from "@/views/admin/auth/verify-email.vue"

// GLOBAL COMPONENTS
import PrivateChat from "@/views/admin/chats/private-chat.vue"
import AdminChat from "@/views/admin/chats/admin-chat.vue"
import Index from "@/views/admin/index.vue"

// LIST COMPONENTS
import ComplaintsList from "@/views/admin/complaints/list.vue"
import ConstantsList from "@/views/admin/constants/list.vue"
import ContentList from "@/views/admin/contents/list.vue"
import ExamList from "@/views/admin/exams/list.vue"
import GroupCLassExam from "@/views/admin/exams/exam-group-class.vue"
import ForbiddenWords from "@/views/admin/words/list.vue"
import TransactionsList from "@/views/admin/transactions/list.vue"
import PaymentTransactionsList from "@/views/admin/paymentTransactions/list.vue"
import GroupClassList from "@/views/admin/group-classes/list.vue"
import LabelsList from "@/views/admin/labels/list.vue"
import LanguagesList from "@/views/admin/languages/list.vue"
import CourseList from "@/views/admin/courses/list.vue"
// import TutorOurCourse from "@/views/admin/courses/tutor-index.vue"
import RolesList from "@/views/admin/roles/list.vue"
import SectionList from "@/views/admin/sections/list.vue"
import TranslationsList from "@/views/admin/translations/list.vue"
import UsersList from "@/views/admin/users/list.vue"

// CONFERENCE COMPONENTS
import AddComplaintConferences from "@/views/admin/conferences/add-complaint.vue"
import AddNoteConferences from "@/views/admin/conferences/add-note.vue"
import AddReviewConferences from "@/views/admin/conferences/add-review.vue"
import AdminConferences from "@/views/admin/conferences/admin-list.vue"
import StudentConferences from "@/views/admin/conferences/student-list.vue"
import TutorConferences from "@/views/admin/conferences/tutor-list.vue"
import TutorConferenceDetials from "@/views/admin/conferences/tutorConferenceDetials/tutorConferenceDetials.vue"
import UploadFileConferences from "@/views/admin/conferences/upload-file.vue"
import ViewComplaintConferences from "@/views/admin/conferences/view-complaint.vue"

// ORDER COMPONENTS
import AdminOrders from "@/views/admin/orders/admin-list.vue"
import MyOrders from "@/views/admin/orders/my-list.vue"

// ADD COMPONENTS
import ContentAdd from "@/views/admin/contents/add.vue"
import ExamAdd from "@/views/admin/exams/add.vue"
import GroupClassAdd from "@/views/admin/group-classes/add.vue"
import CourseADD from "@/views/admin/courses/add.vue"
import RoleAdd from "@/views/admin/roles/add.vue"
import SectionAdd from "@/views/admin/sections/add.vue"
import payoutAdd from "@/views/admin/payout/add.vue"
import payoutList from "@/views/admin/payout/list.vue"
import UserInfo from "@/views/admin/user-info.vue"
import TutorInformation from "@/views/admin/users/tutor-information.vue"
import StudentInformation from "@/views/admin/users/student-information.vue"

import Settings from "@/views/admin/settings/list.vue"
import SettingUpdate from "@/views/admin/settings/edit.vue"
import ContactUs from "@/views/admin/contact-us/index.vue"
import Accounting from "@/views/admin/accounting/list.vue"
import TutorFinance from "@/views/admin/finance/tutorFinance.vue"

import UnAvailable from "@/views/admin/unAvailable.vue"

import MenusList from "@/views/admin/menus/list.vue"
import MenusAdd from "@/views/admin/menus/add.vue"

// blog
import OurBlogList from "@/views/admin/blog/list.vue"
import OurArticalADD from "@/views/admin/blog/add.vue"
// cateqblog
import CateqBlogList from "@/views/admin/cateqblog/list.vue"
import CateqBlogADD from "@/views/admin/cateqblog/add.vue"
// sliders
import SlidersList from "@/views/admin/slider/list.vue"
import SliderAdd from "@/views/admin/slider/add.vue"
// discount_codes
import DiscountCodesList from "@/views/admin/discount_codes/list.vue"
import DiscountCodesAdd from "@/views/admin/discount_codes/add.vue"
// discount_codes
import ChatBlockedWordsList from "@/views/admin/chat_blocked_words/list.vue"
import ChatBlockedWordsAdd from "@/views/admin/chat_blocked_words/add.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_DIRECTORY),
  routes: [
    // GLOBAL ROUTES
    {
      path: "/",
      name: "root",
      redirect: {name: "dashboard"}
    },
    {
      path: "/dashboard",
      name: "dashboard",
      meta: {protected: true},
      redirect: {name: "index"},
      component: DashboardLayout,
      children: [
        {
          path: "/dashboard/index",
          name: "index",
          component: Index
        },
        // UnAvailable
        {
          path: "/dashboard/interests/index",
          name: "interests-list",
          component: UnAvailable
        },
        {
          path: "/dashboard/certifications/index",
          name: "certifications-list",
          component: UnAvailable
        },
        {
          path: "/dashboard/favorites/index",
          name: "favorites-list",
          component: UnAvailable
        },
        {
          path: "/dashboard/supports/index",
          name: "supports-list",
          component: UnAvailable
        },
        {
          path: "/dashboard/invitations/admin-invitations",
          name: "admin-invitations-list",
          component: UnAvailable
        },
        {
          path: "/dashboard/invitations/parent-invitations",
          name: "parent-invitations-list",
          component: UnAvailable
        },
        {
          path: "/dashboard/invitations/child-invitations",
          name: "child-invitations-list",
          component: UnAvailable
        },
        // Menu
        {
          path: "/dashboard/menu/index",
          name: "menus-list",
          component: MenusList
        },
        {
          path: "/dashboard/menu/create",
          name: "menus-add",
          component: MenusAdd
        },
        {
          path: "/dashboard/menu/update/:id",
          name: "menus-update",
          component: MenusAdd
        },
        // {
        //   path: "/profile",
        //   name: "profile",
        //   component: Profile
        // },

        // {
        //   path: "/settings",
        //   name: "settings",
        //   component: Settings
        // },
        {
          path: "/dashboard/settings/index",
          name: "settings",
          component: Settings
        },
        {
          path: "/dashboard/settings/update/:id",
          name: "settings-update",
          component: SettingUpdate
        },
        {
          path: "/dashboard/contact-us/index",
          name: "ContactUs",
          component: ContactUs
        },
        // USER/ROLE ROUTES
        {
          path: "/userInfo",
          name: "userInfo",
          component: UserInfo
        },
        {
          path: "/tutorInformation/:id",
          name: "tutorInformation",
          component: TutorInformation
        },

        {
          path: "/studentInformation/:id",
          name: "studentInformation",
          component: StudentInformation
        },

        {
          path: "/dashboard/users/index",
          name: "users",
          component: UsersList
        },
        {
          path: "/dashboard/accounting",
          name: "accounting",
          component: Accounting
        },
        {
          path: "/dashboard/roles/index",
          name: "roles",
          component: RolesList
        },
        {
          path: "/dashboard/roles/add",
          name: "role-add",
          component: RoleAdd
        },
        {
          path: "/dashboard/roles/update/:id",
          name: "role-update",
          component: RoleAdd
        },
        // LOCALIZATION ROUTES
        {
          path: "/dashboard/localization/languages",
          name: "languages",
          component: LanguagesList
        },
        {
          path: "/dashboard/localization/labels",
          name: "labels",
          component: LabelsList
        },
        {
          path: "/dashboard/localization/translations",
          name: "translations",
          component: TranslationsList
        },
        // SECTION/CONTENT/CONSTANT ROUTES
        {
          path: "/dashboard/sections/:section",
          name: "section-list",
          component: SectionList
        },
        {
          path: "/dashboard/sections/:section/add",
          name: "section-add",
          component: SectionAdd
        },
        {
          path: "/dashboard/sections/:section/update/:id",
          name: "section-update",
          component: SectionAdd
        },
        {
          path: "/dashboard/contents/:content",
          name: "content-list",
          component: ContentList
        },
        {
          path: "/dashboard/contents/:content/add",
          name: "content-add",
          component: ContentAdd
        },
        {
          path: "/dashboard/contents/:content/update/:id",
          name: "content-update",
          component: ContentAdd
        },
        {
          path: "/dashboard/constants/:constant",
          name: "translations-list",
          component: ConstantsList
        },
        {
          path: "/dashboard/forbidden-words",
          name: "forbidden-words",
          component: ForbiddenWords
        },
        {
          path: "/dashboard/wallet/getWalletTransactions",
          name: "transactions",
          component: TransactionsList
        },
        {
          path: "/dashboard/wallet/payment/transactions",
          name: "paymentTransactionsList",
          component: PaymentTransactionsList
        },
        // LIBRARY ROUTES
        {
          path: "/dashboard/library/:content/update/:id",
          name: "library-update",
          component: ContentAdd
        },
        {
          path: "/dashboard/library/:content",
          name: "library-list",
          component: ContentList
        },
        {
          path: "/dashboard/library/:content/add",
          name: "library-add",
          component: ContentAdd
        },
        // GROUP-CLASS/OUR-COURSE ROUTES

        {
          path: "/dashboard/group-classes/index",
          name: "group-class-list",
          component: GroupClassList
        },
        {
          path: "/dashboard/group-classes/create",
          name: "group-class-create",
          component: GroupClassAdd
        },

        {
          path: "/dashboard/group-classes/update/:id",
          name: "group-class-update",
          component: GroupClassAdd
        },
        {
          path: "/dashboard/courses/index",
          name: "private-course-list",
          component: CourseList
        },
        // {
        //   path: "/dashboard/courses/tutor-index",
        //   name: "tutor-private-course",
        //   component: TutorOurCourse
        // },
        {
          path: "/dashboard/courses/create",
          name: "private-course-create",
          component: CourseADD
        },
        {
          path: "/dashboard/courses/update/:id",
          name: "private-course-update",
          component: CourseADD
        },
        // blog
        {
          path: "/dashboard/blog/index",
          name: "private-artical-list",
          component: OurBlogList
        },
        {
          path: "/dashboard/blog/create",
          name: "private-artical-create",
          component: OurArticalADD
        },
        {
          path: "/dashboard/blog/update/:id",
          name: "private-artical-update",
          component: OurArticalADD
        },
        // cateqblog
        {
          path: "/dashboard/cateqblog/index",
          name: "cateqblog-list",
          component: CateqBlogList
        },
        {
          path: "/dashboard/cateqblog/create",
          name: "cateqblog-create",
          component: CateqBlogADD
        },
        {
          path: "/dashboard/cateqblog/update/:id",
          name: "cateqblog-update",
          component: CateqBlogADD
        },
        // sliders
        {
          path: "/dashboard/slider/index",
          name: "slider-list",
          component: SlidersList
        },
        {
          path: "/dashboard/slider/create",
          name: "slider-create",
          component: SliderAdd
        },
        {
          path: "/dashboard/slider/update/:id",
          name: "slider-update",
          component: SliderAdd
        },
        // DiscountCodes
        {
          path: "/dashboard/discount_codes/index",
          name: "discount_codes-list",
          component: DiscountCodesList
        },
        {
          path: "/dashboard/discount_codes/create",
          name: "discount_codes-create",
          component: DiscountCodesAdd
        },
        {
          path: "/dashboard/discount_codes/update/:id",
          name: "discount_codes-update",
          component: DiscountCodesAdd
        },
        // chat_blocked_words
        {
          path: "/dashboard/chat_blocked_words/index",
          name: "chat_blocked_words-list",
          component: ChatBlockedWordsList
        },
        {
          path: "/dashboard/chat_blocked_words/create",
          name: "chat_blocked_words-create",
          component: ChatBlockedWordsAdd
        },
        {
          path: "/dashboard/chat_blocked_words/update/:id",
          name: "chat_blocked_words-update",
          component: ChatBlockedWordsAdd
        },
        // EXAM ROUTES
        {
          path: "/dashboard/exams/index/:id",
          name: "exams-list",
          component: ExamList
        },

        {
          path: "/dashboard/exams/group-classes",
          name: "exams-group-class",
          component: GroupCLassExam
        },
        {
          path: "/dashboard/exams/create",
          name: "exams-create",
          component: ExamAdd
        },
        {
          path: "/dashboard/exams/update/:id",
          name: "exams-update",
          component: ExamAdd
        },
        // ORDER ROUTES
        {
          path: "/dashboard/orders/admin-index",
          name: "admin-orders",
          component: AdminOrders
        },
        {
          path: "/dashboard/orders/my-index",
          name: "my-orders",
          component: MyOrders
        },
        // CONFERENCE ROUTES
        {
          path: "/dashboard/conferences/admin-index",
          name: "admin-conferences",
          component: AdminConferences
        },
        {
          path: "/dashboard/conferences/tutor-index",
          name: "tutor-conferences",
          component: TutorConferences
        },
        {
          path: "/dashboard/tutor-statistics/completed-conference",
          name: "tutor-conferences-detials",
          component: TutorConferenceDetials
        },
        {
          path: "/dashboard/conferences/student-index",
          name: "student-conferences",
          component: StudentConferences
        },
        {
          path: "/dashboard/conferences/:conference/notes/",
          name: "add-note-conferences",
          component: AddNoteConferences
        },
        {
          path: "/dashboard/conferences/:conference/reviews/",
          name: "add-review-conferences",
          component: AddReviewConferences
        },
        {
          path: "/dashboard/conferences/:conference/complaints",
          name: "add-complaint-conferences",
          component: AddComplaintConferences
        },
        {
          path: "/dashboard/conferences/:conference/complaints/:complaintId",
          name: "view-complaint-conferences",
          component: ViewComplaintConferences
        },
        {
          path: "/dashboard/conferences/:conference/files",
          name: "upload-file-conferences",
          component: UploadFileConferences
        },
        // COMPLAINTS ROUTES
        {
          path: "/dashboard/complaints/index/:conference_id?",
          name: "complaints-list",
          component: ComplaintsList
        },
        // PRIVATE-CHAT ROUTES
        {
          path: "/dashboard/chats/private-chat",
          name: "private-chat",
          component: PrivateChat
        },
        {
          path: "/dashboard/chats/admin-chat/:id",
          name: "admin-chat",
          component: AdminChat
        },
        {
          path: "/dashboard/payout/index",
          name: "payout-list",
          component: payoutList
        },
        {
          path: "/dashboard/payout/create",
          name: "payout-create",
          component: payoutAdd
        },
        {
          path: "/dashboard/tutor-finance/my-index",
          name: "tutor-finance",
          component: TutorFinance
        }
      ]
    },
    // AUTH ROUTES,
    {
      path: "/profile",
      name: "profile",
      component: SignUp
    },

    {
      path: "/auth",
      name: "auth",
      meta: {protected: false},
      redirect: {name: "sign-in"},
      component: AuthLayout,
      children: [
        {
          path: "/auth/sign-in-check",
          name: "sign-in-check",
          component: StudentSignInCheck
        },
        {
          path: "/auth/sign-in",
          name: "sign-in",
          component: StudentSignIn
        },
        {
          path: "/admin/sign-in",
          name: "admin-sign-in",
          component: AdminSignIn
        },
        // {
        //   path: "/tutor/sign-in",
        //   name: "tutor-sign-in",
        //   component: TutorSignIn
        // },
        {
          path: "/auth/sign-up",
          name: "sign-up",
          component: SignUp
        },
        {
          path: "/auth/forgot-password",
          name: "forgot-password",
          component: ForgotPassword
        },
        {
          path: "/password/reset/:token",
          name: "new-password",
          component: NewPassword
        }
      ]
    },
    {
      path: "/email/verify/:id/:token",
      name: "email-verify",
      component: EmailVerify
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state.user.token) {
    if (to.path.split("/")[1] === "auth") next({name: "root"})
    else next()
  } else if (to.meta.protected) next({name: "auth"})
  else next()
})

router.beforeEach((to, from, next) => {
  let {languages} = store.state
  if (!languages) languages = store.dispatch("getAPILanguages")

  Promise.resolve(languages).then(() => {
    if (store.state.language) {
      if (store.state.language !== i18n.locale) {
        getI18nLanguages(store.state.language)
        next()
      } else {
        next()
      }
    } else {
      store.dispatch("setLanguage", navigator.languages).then(() => {
        getI18nLanguages(store.state.language)
        next()
      })
    }
  })
})

export default router
