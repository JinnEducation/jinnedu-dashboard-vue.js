<template>
  <div class="app-sidebar-menu flex-column-fluid">
    <div id="application-sidebar-menu-wrapper" data-kt-scroll="true" data-kt-scroll-wrappers="#application-sidebar-menu"
      data-kt-scroll-dependencies="#application-sidebar-logo, #application-sidebar-footer"
      data-kt-scroll-activate="true" data-kt-scroll-height="700px" data-kt-scroll-offset="100px"
      data-kt-scroll-save-state="true" class="app-sidebar-wrapper hover-scroll-overlay-y my-5">
      <div id="#application-sidebar-menu" data-kt-menu="true" data-kt-menu-expand="true" style="margin: 75px 0px"
        class="menu menu-column menu-rounded menu-sub-indention px-3 pb-16">
        <sidebar-menu-item v-for="element in filteredNavigation" :key="element.title" :title="element.title"
          :icon="element.icon" :children="element.children" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onBeforeMount } from "vue"
import SidebarMenuItem from "./menu-item.vue"
import { useStore } from "vuex"

export default defineComponent({
  name: "sidebar-menu",
  components: { SidebarMenuItem },
  setup() {
    const store = useStore()
    const { userInfo } = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type

    const filteredTitles = [
      "global.tutor-conferences",
      "global.student-conferences",
      "global.my-orders"
    ]

    const filterItems = (items) => {
      return items?.filter((item) => {
        const shouldFilter = userType === 0 && filteredTitles.includes(item.title)
        if (shouldFilter) return false // Exclude if the parent item should be filtered
        if (item.children) {
          item.children = filterItems(item.children) // Recursively filter children
          return item.children.length > 0 // Include parent item only if it has remaining children
        }
        return true // Include if it's not to be filtered and has no children
      })
    }

    const filterNavigation = () => {
      const originalNavigation = store.state.navigation
      // const originalNavigation = [
      //   {
      //     id: 1,
      //     title: "global.settings-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "settings.svg",
      //     children: [
      //       { id: 2, title: "global.settings-list", type: "child", link: "settings.index" },
      //     ],
      //   },
      //   {
      //     id: 2,
      //     title: "global.users-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "users.svg",
      //     children: [
      //       { id: 8, title: "global.users-list", type: "child", link: "users.index" },
      //     ],
      //   },
      //   {
      //     id: 3,
      //     title: "global.certifications-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "certifications.svg",
      //     children: [
      //       { id: 14, title: "global.certifications-list", type: "child", link: "certifications.index" },
      //     ],
      //   },
      //   {
      //     id: 4,
      //     title: "global.complaints-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "complaints.svg",
      //     children: [
      //       { id: 20, title: "global.complaints-list", type: "child", link: "complaints.index" },
      //     ],
      //   },
      //   {
      //     id: 5,
      //     title: "global.supports-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "supports.svg",
      //     children: [
      //       { id: 25, title: "global.supports-list", type: "child", link: "supports.index" },
      //     ],
      //   },
      //   {
      //     id: 6,
      //     title: "global.favorites-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "favorites.svg",
      //     children: [
      //       { id: 30, title: "global.favorites-list", type: "child", link: "favorites.index" },
      //     ],
      //   },
      //   {
      //     id: 7,
      //     title: "global.interests-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "interests.svg",
      //     children: [
      //       { id: 35, title: "global.interests-list", type: "child", link: "interests.index" },
      //     ],
      //   },
      //   {
      //     id: 8,
      //     title: "global.roles-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "roles.svg",
      //     children: [
      //       { id: 40, title: "global.roles-list", type: "child", link: "roles.index" },
      //     ],
      //   },
      //   {
      //     id: 9,
      //     title: "global.group-classes-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "group-classes.svg",
      //     children: [
      //       { id: 46, title: "global.group-classes-list", type: "child", link: "group-classes.index" },
      //       { id: 47, title: "global.group-classes-create", type: "child", link: "group-classes.create" },
      //     ],
      //   },
      //   {
      //     id: 10,
      //     title: "global.blog-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "blogs.svg",
      //     children: [
      //       { id: 52, title: "global.blog-list", type: "child", link: "blog.index" },
      //       { id: 53, title: "global.blog-create", type: "child", link: "blog.create" },
      //     ],
      //   },
      //   {
      //     id: 11,
      //     title: "global.our-courses-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "blogs.svg",
      //     children: [
      //       { id: 52, title: "global.our-courses-list", type: "child", link: "our-courses.index" },
      //       { id: 53, title: "global.our-courses-create", type: "child", link: "our-courses.create" },
      //       { id: 54, title: "global.tutor-index", type: "child", link: "our-courses.tutor-index" },
      //     ],
      //   },
      //   {
      //     id: 12,
      //     title: "global.conferences-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "conferences.svg",
      //     children: [
      //       { id: 61, title: "global.admin-conferences", type: "child", link: "conferences.admin-index" },
      //     ],
      //   },
      //   {
      //     id: 13,
      //     title: "global.orders-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "orders.svg",
      //     children: [
      //       { id: 72, title: "global.admin-orders", type: "child", link: "orders.admin-index" },
      //     ],
      //   },
      //   {
      //     id: 14,
      //     title: "global.chats-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "chats.svg",
      //     children: [
      //       { id: 77, title: "global.private-chat", type: "child", link: "chats.private-chat" },
      //     ],
      //   },
      //   {
      //     id: 15,
      //     title: "global.invitations",
      //     type: "parent",
      //     link: "#",
      //     icon: "invitations.svg",
      //     children: [
      //       { id: 83, title: "global.admin-invitations", type: "child", link: "invitations.admin-invitations" },
      //       { id: 84, title: "global.parent-invitations", type: "child", link: "invitations.parent-invitations" },
      //       { id: 85, title: "global.child-invitations", type: "child", link: "invitations.child-invitations" },
      //     ],
      //   },
      //   {
      //     id: 16,
      //     title: "global.localization-management",
      //     type: "parent",
      //     link: "#",
      //     icon: "localization.svg",
      //     children: [
      //       { id: 91, title: "global.languages-management", type: "child", link: "localization.languages" },
      //       { id: 92, title: "global.labels-management", type: "child", link: "localization.labels" },
      //       { id: 93, title: "global.translations-management", type: "child", link: "localization.translations" },
      //     ],
      //   },
      //   {
      //     id: 17,
      //     title: "global.constants",
      //     type: "parent",
      //     link: "#",
      //     icon: "constants.svg",
      //     children: [
      //       { id: 110, title: "global.countries-management", link: "constants.countries" },
      //       { id: 111, title: "global.levels-management", link: "constants.levels" },
      //       { id: 112, title: "global.currencies-management", link: "constants.currencies" },
      //       { id: 113, title: "global.specializations-management", link: "constants.specializations" },
      //       { id: 114, title: "global.experiences-management", link: "constants.experiences" },
      //       { id: 115, title: "global.situations-management", link: "constants.situations" },
      //       { id: 116, title: "global.subjects-management", link: "constants.subjects" },
      //       { id: 117, title: "global.degree-types-management", link: "constants.degree-types" },
      //       { id: 118, title: "global.week-days-management", link: "constants.week-days" },
      //       { id: 119, title: "global.world-timezones-management", link: "constants.world-timezones" },
      //       { id: 120, title: "global.outlines-management", link: "constants.outlines" },
      //       { id: 121, title: "global.prices-management", link: "constants.prices" },
      //       { id: 122, title: "global.sort-by-tutors-management", link: "constants.sort-by-tutors" },
      //     ],
      //   },
      //   {
      //     id: 18,
      //     title: "global.sections",
      //     type: "parent",
      //     link: "#",
      //     icon: "sections.svg",
      //     children: [
      //       { id: 189, title: "global.departments-management", link: "sections.departments" },
      //       { id: 190, title: "global.categories-management", link: "sections.categories" },
      //       { id: 191, title: "global.blogs-management", link: "sections.courses" },
      //       { id: 192, title: "global.navigations-management", link: "sections.navigations" },
      //     ],
      //   },
      //   {
      //     id: 19,
      //     title: "global.contents",
      //     type: "parent",
      //     link: "#",
      //     icon: "contents.svg",
      //     children: [
      //       { id: 214, title: "global.posts-management", link: "contents.posts" },
      //       { id: 215, title: "global.pages-management", link: "contents.pages" },
      //       { id: 216, title: "global.events-management", link: "contents.events" },
      //       { id: 217, title: "global.helps-management", link: "contents.helps" },
      //       { id: 218, title: "global.advertisements-management", link: "contents.advertisements" },
      //       { id: 219, title: "global.packages-management", link: "contents.packages" },
      //     ],
      //   },
      //   {
      //     id: 20,
      //     title: "global.library",
      //     type: "parent",
      //     link: "#",
      //     icon: "library.svg",
      //     children: [
      //       { id: 251, title: "global.videos-management", link: "library.videos" },
      //       { id: 252, title: "global.links-management", link: "library.links" },
      //       { id: 253, title: "global.documents-management", link: "library.documents" },
      //       { id: 254, title: "global.images-management", link: "library.images" },
      //     ],
      //   },
      // ]
      return filterItems(originalNavigation)
    }

    const filteredNavigation = computed(() => {
      return filterNavigation()
    })

    onBeforeMount(() => store.dispatch("getAPINavigation"))

    return { filteredNavigation }
  }
})
</script>

<!-- data-kt-scroll-height="auto" -->
