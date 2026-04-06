// DONE REVIEWING: 23/06/2023
import {createRouter, createWebHistory} from "vue-router"

import i18n, {getI18nLanguages} from "@/plugins/i18n"
import store from "@/store"

// AUTH COMPONENTS
const AuthLayout = () => import("@/components/layouts/admin/auth.vue")
const MyCoursesLayout = () => import("@/components/layouts/admin/my-courses.vue")
const DashboardLayout = () => import("@/components/layouts/admin/dashboard.vue")
const ForgotPassword = () => import("@/views/admin/auth/forgot-password.vue")
const NewPassword = () => import("@/views/admin/auth/new-password.vue")
const StudentSignIn = () => import("@/views/admin/auth/student-sign-in.vue")
const StudentSignInCheck = () => import("@/views/admin/auth/student-sign-in-check.vue")
const AdminSignIn = () => import("@/views/admin/auth/admin-sign-in.vue")

// import AdminSignIn from "@/views/admin/admin-sign-in.vue"sign-up-17-2-2025
const SignUp = () => import("@/views/admin/auth/sign-up.vue")
// import Profile from "@/views/admin/profile.vue"
const EmailVerify = () => import("@/views/admin/auth/verify-email.vue")

// GLOBAL COMPONENTS
const PrivateChat = () => import("@/views/admin/chats/private-chat.vue")
const AdminChat = () => import("@/views/admin/chats/admin-chat.vue")
const Index = () => import("@/views/admin/index.vue")

// LIST COMPONENTS
const ComplaintsList = () => import("@/views/admin/complaints/list.vue")
const ConstantsList = () => import("@/views/admin/constants/list.vue")
const ContentList = () => import("@/views/admin/contents/list.vue")
const ExamList = () => import("@/views/admin/exams/list.vue")
const GroupCLassExam = () => import("@/views/admin/exams/exam-group-class.vue")
const ForbiddenWords = () => import("@/views/admin/words/list.vue")
const TransactionsList = () => import("@/views/admin/transactions/list.vue")
const PaymentTransactionsList = () => import("@/views/admin/paymentTransactions/list.vue")
const GroupClassList = () => import("@/views/admin/group-classes/list.vue")
const LabelsList = () => import("@/views/admin/labels/list.vue")
const LanguagesList = () => import("@/views/admin/languages/list.vue")
const CourseList = () => import("@/views/admin/courses/list.vue")
// import TutorOurCourse from "@/views/admin/courses/tutor-index.vue"
const RolesList = () => import("@/views/admin/roles/list.vue")
const SectionList = () => import("@/views/admin/sections/list.vue")
const TranslationsList = () => import("@/views/admin/translations/list.vue")
const UsersList = () => import("@/views/admin/users/list.vue")
const FavoritesList = () => import("@/views/admin/favorites/list.vue")
const MailingList = () => import("@/views/admin/mailing-list/list.vue")

// CONFERENCE COMPONENTS
const AddComplaintConferences = () => import("@/views/admin/conferences/add-complaint.vue")
const AddNoteConferences = () => import("@/views/admin/conferences/add-note.vue")
const AddReviewConferences = () => import("@/views/admin/conferences/add-review.vue")
const AdminConferences = () => import("@/views/admin/conferences/admin-list.vue")
const StudentConferences = () => import("@/views/admin/conferences/student-list.vue")
const StudentRecordingsList = () => import("@/views/admin/conferences/student-recordings-list.vue")
const TutorConferences = () => import("@/views/admin/conferences/tutor-list.vue")
const TutorConferenceDetials = () =>
  import("@/views/admin/conferences/tutorConferenceDetials/tutorConferenceDetials.vue")
const UploadFileConferences = () => import("@/views/admin/conferences/upload-file.vue")
const UploadVideoConferences = () => import("@/views/admin/conferences/upload-video.vue")
const ViewComplaintConferences = () => import("@/views/admin/conferences/view-complaint.vue")

// ORDER COMPONENTS
const AdminOrders = () => import("@/views/admin/orders/admin-list.vue")
const MyOrders = () => import("@/views/admin/orders/my-list.vue")

// ADD COMPONENTS
const ContentAdd = () => import("@/views/admin/contents/add.vue")
const ExamAdd = () => import("@/views/admin/exams/add.vue")
const GroupClassAdd = () => import("@/views/admin/group-classes/add.vue")
const CourseADD = () => import("@/views/admin/courses/add.vue")
const RoleAdd = () => import("@/views/admin/roles/add.vue")
const SectionAdd = () => import("@/views/admin/sections/add.vue")
const payoutAdd = () => import("@/views/admin/payout/add.vue")
const payoutList = () => import("@/views/admin/payout/list.vue")
const tutorFinancesList = () => import("@/views/admin/tutor-finances/list.vue")
const UserInfo = () => import("@/views/admin/user-info.vue")
const TutorInformation = () => import("@/views/admin/users/tutor-information.vue")
const StudentInformation = () => import("@/views/admin/users/student-information.vue")

const Settings = () => import("@/views/admin/settings/list.vue")
const SettingUpdate = () => import("@/views/admin/settings/edit.vue")
const ContactUs = () => import("@/views/admin/contact-us/index.vue")
const Accounting = () => import("@/views/admin/accounting/list.vue")
const tutorFinancesAccounting = () => import("@/views/admin/tutor-finances/accounting.vue")
const TutorFinance = () => import("@/views/admin/finance/tutorFinance.vue")

const UnAvailable = () => import("@/views/admin/unAvailable.vue")

const MenusList = () => import("@/views/admin/menus/list.vue")
const MenusAdd = () => import("@/views/admin/menus/add.vue")

// blog
const OurBlogList = () => import("@/views/admin/blog/list.vue")
const OurArticalADD = () => import("@/views/admin/blog/add.vue")
// faq
const FaqList = () => import("@/views/admin/faq/list.vue")
const FaqAdd = () => import("@/views/admin/faq/add.vue")
// help articles
const HelpArticlesList = () => import("@/views/admin/help-articles/list.vue")
const HelpArticlesAdd = () => import("@/views/admin/help-articles/add.vue")
// cateqblog
const CateqBlogList = () => import("@/views/admin/cateqblog/list.vue")
const CateqBlogADD = () => import("@/views/admin/cateqblog/add.vue")
// sliders
const SlidersList = () => import("@/views/admin/slider/list.vue")
const SliderAdd = () => import("@/views/admin/slider/add.vue")
// discount_codes
const DiscountCodesList = () => import("@/views/admin/discount_codes/list.vue")
const DiscountCodesAdd = () => import("@/views/admin/discount_codes/add.vue")
// discount_codes
const ChatBlockedWordsList = () => import("@/views/admin/chat_blocked_words/list.vue")
const ChatBlockedWordsAdd = () => import("@/views/admin/chat_blocked_words/add.vue")

// My Courses
const CoursePlayer = () => import("@/views/admin/my-courses/CoursePlayer.vue")
const MyCourseList = () => import("@/views/admin/my-courses/list.vue")
const MyCertificateList = () => import("@/views/admin/my-courses/certificateList.vue")

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
        {
          path: "/dashboard/my-courses/all",
          name: "my-courses-all",
          component: MyCourseList,
          meta: {type: "all"}
        },
        {
          path: "/dashboard/my-courses/completed",
          name: "my-courses-completed",
          component: MyCourseList,
          meta: {type: "completed"}
        },
        {
          path: "/dashboard/my-courses/unfinished",
          name: "my-courses-unfinished",
          component: MyCourseList,
          meta: {type: "unfinished"}
        },
        {
          path: "/dashboard/my-courses/certificates",
          name: "my-courses-certificates",
          component: MyCertificateList
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
          path: "/dashboard/mailing-list/index",
          name: "mailing-list",
          component: MailingList
        },
        {
          path: "/dashboard/favorites/index",
          name: "favorites",
          component: FavoritesList
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
        // faq
        {
          path: "/dashboard/faq/index",
          name: "faq-list",
          component: FaqList
        },
        {
          path: "/dashboard/faq/create",
          name: "faq-create",
          component: FaqAdd
        },
        {
          path: "/dashboard/faq/update/:id",
          name: "faq-update",
          component: FaqAdd
        },
        // help articles
        {
          path: "/dashboard/help-articles/index/:audience?",
          name: "help-articles-list",
          component: HelpArticlesList
        },
        {
          path: "/dashboard/help-articles/create",
          name: "help-articles-create",
          component: HelpArticlesAdd
        },
        {
          path: "/dashboard/help-articles/update/:id",
          name: "help-articles-update",
          component: HelpArticlesAdd
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
          path: "/dashboard/conferences/student-recordings",
          name: "student-recordings",
          component: StudentRecordingsList
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
        {
          path: "/dashboard/conferences/:conference/recordings",
          name: "upload-video-conferences",
          component: UploadVideoConferences
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
          path: "/dashboard/chats/admin-chat",
          name: "admin-chat",
          component: AdminChat
        },
        {
          path: "/dashboard/tutor-finances/index",
          name: "tutor-finances-list",
          component: tutorFinancesList
        },
        {
          path: "/dashboard/tutor-finances/accounting",
          name: "tutor-finances-accounting",
          component: tutorFinancesAccounting
        },
        {
          path: "/dashboard/payout/list",
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
    // My Courses ROUTES,
    {
      path: "/my-courses",
      name: "my-courses",
      meta: {protected: true},
      redirect: {name: "my-courses-index"},
      component: MyCoursesLayout,
      children: [
        {
          path: "/my-courses/:id/index",
          name: "my-courses-index",
          component: CoursePlayer
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
      path: "/sign-in-check",
      meta: {protected: false},
      name: "sign-in-check",
      component: StudentSignInCheck
    },
    {
      path: "/auth",
      name: "auth",
      meta: {protected: false},
      redirect: {name: "sign-in"},
      component: AuthLayout,
      children: [
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
