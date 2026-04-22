<template>
  <div class="main-header-content">
    <div class="custom-flex-header">
      <div class="left-content">
        <div>
          <label for="select-languages" class="visually-hidden">{{ $t("global.language") }}</label>
          <select
            id="select-languages"
            v-model="language"
            class="form-select"
            @change="setLanguage(language)">
            <option
              v-for="languageElement in languages"
              :key="languageElement.name"
              :value="languageElement.shortname"
              :class="{'text-primary': language.name === languageElement.name}">
              {{ t(`languages.${languageElement.name}`) }}
            </option>
          </select>
        </div>
        <!-- <div>
          <label for="select-currencies" class="visually-hidden">{{ $t("global.language") }}</label>
          <select id="select-currencies" class="form-select">
            <option value="1">Dollar</option>
            <option value="2">Euro</option>
          </select>
        </div> -->
      </div>
      <div class="right-content">
        <div v-if="userType === 1 || userType === 2" class="balance-flex-content">
          <div style="position: relative">
            <button type="button" class="balance-flex" @click="toggleNavbarMenu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"></path>
              </svg>
              <p>{{ $t("global.balance") }}: {{ wallet?.result?.balance }} $</p>
            </button>
            <div
              ref="navbarMenuRef"
              class="navbar-menu-custom"
              :class="{active: isActiveNavbarMenu}">
              <ul class="navbar-menu-custom-ul">
                <li>
                  <span>{{ wallet?.result?.group_class_count ?? "0" }}</span>
                  {{ t("global.group-classes") }}
                </li>
                <li>
                  <span>{{ wallet?.result?.our_course_count ?? "0" }}</span>
                  {{ t("global.courses") }}
                </li>
                <li>
                  <span>{{ wallet?.result?.private_lesson_count ?? "0" }}</span>
                  {{ t("global.private-lessons") }}
                </li>
              </ul>
            </div>
          </div>
          <a v-if="userType === 1" class="custom-btn-header-style" :href="frontUrl('checkout')">
            {{ $t("global.buy-points") }}</a
          >
        </div>
        <div class="custom-col-line"></div>
        <div class="relative">
          <button
            type="button"
            class="px-4 py-2 border"
            style="
              height: 30px;
              align-items: center;
              justify-content: start;
              display: flex;
              gap: 5px;
              border-radius: 20px;
            "
            @click="toggleDropdown">
            <svg
              style="width: 22px"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{{ $t("global.my-profile") }}</span>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isDropdownOpen"
            ref="dropdownRef"
            :class="
              userType === 0
                ? 'dropdown-buttons'
                : userType === 1
                ? 'student-dropdown-buttons'
                : 'tutor-dropdown-buttons'
            "
            class="absolute right-0 mt-2 bg-white border rounded-md shadow-md z-10">
            <ul
              class="list-links-with-icons"
              style="flex-direction: column; align-items: start; padding: 10px">
              <!-- chats -->
              <li class="favorites-root-item" style="height: 30px">
                <router-link
                  to="/dashboard/chats/private-chat/"
                  style="display: flex; gap: 15px; width: 200px; color: black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path>
                  </svg>
                  <span>{{ t("global.chats") }}</span>
                </router-link>
              </li>
              <!-- notifications -->
              <li style="height: 30px">
                <div>
                  <button
                    type="button"
                    style="display: flex; gap: 15px; width: 200px"
                    @click="toggleNotifications">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
                    </svg>
                    <span>{{ t("global.notifications") }}</span>
                  </button>
                  <div
                    ref="notificationsRef"
                    class="navbar-menu"
                    :class="{active: isActiveNotifications}">
                    <ul v-if="notifications && notifications.length > 0">
                      <li v-for="(item, index) in notifications" :key="index">
                        <button type="button">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                            fill="currentColor">
                            <path
                              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"></path>
                          </svg>
                          <div>
                            <h3>{{ item.data.title }}</h3>
                            <ul>
                              <li>{{ item.data.details }}</li>
                            </ul>
                          </div>
                        </button>
                      </li>
                    </ul>
                    <p v-else class="text-center">{{ $t("global.no-notifications") }}</p>
                  </div>
                </div>
              </li>
              <!-- favorites appear for all dashboard users -->
              <li style="height: 30px">
                <div ref="likesWrapper" class="relative">
                  <button
                    type="button"
                    style="display: flex; gap: 15px; width: 200px"
                    @click="toggleLikes">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
                    </svg>
                    <span>{{ $t("global.favorites") }}</span>
                  </button>

                  <div :class="{active: isActiveLikes}" class="navbar-menu favorites-menu">
                    <div class="favorites-menu-header">
                      <h4>{{ t("global.favorites") }}</h4>
                    </div>
                    <ul v-if="favoritesLoading" class="favorites-state-list">
                      <li>
                        <p class="text-center">{{ t("global.loading") }}...</p>
                      </li>
                    </ul>
                    <ul v-else-if="normalizedFavorites.length > 0" class="favorites-state-list">
                      <li v-for="favorite in normalizedFavorites" :key="favorite.id">
                        <div class="favorite-entry">
                          <div class="favorite-entry-info">
                            <img
                              :src="favorite.image"
                              :alt="favorite.title"
                              class="favorite-entry-image" />
                            <div class="favorite-entry-text">
                              <h3>{{ favorite.title }}</h3>
                              <span>{{ favorite.label }}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            class="favorite-delete-btn"
                            :aria-label="t('global.delete')"
                            @click.stop="removeFavorite(favorite.id)">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              aria-hidden="true">
                              <path
                                d="M6 8h12l-.9 11.6c-.06.8-.72 1.4-1.5 1.4H8.4c-.78 0-1.44-.6-1.5-1.4L6 8Zm2 2 .45 4.1 7.1-.05L16 10H8Z"
                                fill="currentColor" />
                              <path
                                d="M14 4.5v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1H5.5a.5.5 0 0 0-.5.5v.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H14Z"
                                fill="currentColor"
                                opacity=".5" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    </ul>
                    <ul v-else class="favorites-state-list">
                      <li>
                        <p class="text-center">{{ $t("global.no-favorites") }}</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>

              <!-- inquires appear in student dashboard only -->
              <li v-if="userType === 1" style="height: 30px">
                <a :href="`${baseUrl}/inquiries/`" class="inquiries-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    class="inquiries-icon">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                  </svg>
                  <span>{{ t("global.inquiries") }}</span>
                </a>
              </li>

              <li style="height: 30px !important">
                <router-link
                  to="/dashboard/index/"
                  style="display: flex; gap: 15px; width: 200px; color: black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{{ t("global.profile") }}</span>
                </router-link>
              </li>
              <li>
                <button
                  type="button"
                  class="button-white-sign-out"
                  style="display: flex; gap: 15px; width: 200px; color: black; padding: 0px 5px"
                  @click="signOut">
                  {{ $t("global.sign-out") }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="second-header">
      <div class="second-header-content">
        <div class="left-content-second-header">
          <a :href="frontUrl()" class="logo-header">
            <img alt="Logo" :src="`${PUBLIC_PATH}/front/assets/imgs/logo.png`" loading="lazy" />
          </a>
          <!-- <div ref="navbarCategoriesRef" style="position: relative">
            <button type="button" class="categories-btn" @click="toggleCategories">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5 stroke-current">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"></path>
              </svg>
              {{ $t("global.categories") }}
            </button>
            <ul
              aria-labelledby="navbar-categories-toggle"
              class="navbar-links-custom"
              :class="{active: isActiveCategories}">
              <li v-for="(category, index) in categories" :key="index" aria-hidden="true">
                <a class="navbar-menu-link" :href="`${baseUrl}/our-courses/?${category.id}`">
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </div> -->
          <!-- <a class="search-btn" href="#"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="h-6 w-5 stroke-gray-300">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
            </svg>
            {{ $t("global.search") }}</a
          > -->
        </div>
        <div>
          <button type="button" class="open-menu-btn" @click="toggleMenuResponsive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"></path>
            </svg>
            {{ $t("global.menu") }}
          </button>
          <div class="right-content-second-header" :class="{active: isActiveMenuResponsive}">
            <button
              type="button"
              aria-label="Close Menu"
              class="close-btn"
              @click="toggleMenuResponsive">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <ul>
              <li>
                <router-link to="/dashboard/index/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{{ t("global.profile") }}</span>
                </router-link>
              </li>
              <li>
                <a class="navbar-link" target="_blank" :href="frontUrl()">
                  {{ $t("global.home") }}</a
                >
              </li>
              <li>
                <a class="navbar-link" target="_blank" :href="frontUrl('categories')">
                  {{ $t("global.categories") }}</a
                >
              </li>
              <li>
                <a class="navbar-link" target="_blank" :href="frontUrl('coming_soon')">
                  {{ $t("global.k-12") }}</a
                >
              </li>
              <li>
                <a class="navbar-link" :href="frontUrl('blog')">
                  {{ $t("global.blog") }}
                </a>
              </li>
              <li ref="activeClassesRef" class="position-relative">
                <button type="button" @click="toggleClasses">
                  {{ $t("global.classes") }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                  </svg>
                </button>
                <ul
                  aria-labelledby="navbar-categories-toggle"
                  class="navbar-links-custom"
                  :class="{active: isActiveClasses}">
                  <li aria-hidden="true">
                    <a
                      class="navbar-menu-link"
                      :href="frontUrl('online-group-classes')">
                      {{ $t("global.group-classes") }}</a
                    >
                  </li>
                  <li aria-hidden="true">
                    <a
                      class="navbar-menu-link"
                      :href="frontUrl('online_private_classes')">
                      {{ $t("global.private-lessons") }}</a
                    >
                  </li>
                </ul>
              </li>
              <li>
                <a class="navbar-link" target="_blank" :href="frontUrl('coming_soon')">
                  {{ $t("global.events") }}</a
                >
              </li>
              <li ref="helpRef" class="position-relative">
                <button type="button" @click="toggleHelp">
                  {{ $t("global.helps") }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                  </svg>
                </button>
                <ul
                  aria-labelledby="navbar-categories-toggle"
                  class="navbar-links-custom"
                  :class="{active: isActiveHelp}">
                  <li aria-hidden="true">
                    <a class="navbar-menu-link" :href="frontUrl('help-for-student')">
                      {{ $t("global.help-for-student") }}</a
                    >
                  </li>
                  <li aria-hidden="true">
                    <a class="navbar-menu-link" :href="frontUrl('help-for-tutor')">
                      {{ $t("global.help-for-tutor") }}</a
                    >
                  </li>
                  <li aria-hidden="true">
                    <a class="navbar-menu-link" :href="frontUrl('faq')">
                      {{ $t("global.faq") }}</a
                    >
                  </li>
                </ul>
              </li>
              <li ref="pagesRef" class="position-relative">
                <button type="button" @click="togglePages">
                  {{ $t("global.about") }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                  </svg>
                </button>
                <ul
                  aria-labelledby="navbar-categories-toggle"
                  class="navbar-links-custom"
                  :class="{active: isActivePages}">
                  <li aria-hidden="true">
                    <a class="navbar-menu-link" :href="frontUrl('pages/about-us')">
                      {{ $t("global.about-us") }}</a
                    >
                  </li>
                  <li aria-hidden="true">
                    <a
                      class="navbar-menu-link"
                      :href="frontUrl('pages/how-jin-works')">
                      {{ $t("global.how-jin-works") }}</a
                    >
                  </li>
                  <li aria-hidden="true">
                    <a class="navbar-menu-link" :href="frontUrl('pages/terms-of-use')">
                      {{ $t("global.terms-of-use") }}</a
                    >
                  </li>
                  <li aria-hidden="true">
                    <a class="navbar-menu-link" :href="frontUrl('pages/Policy')">
                      {{ $t("global.privacy-policy") }}</a
                    >
                  </li>
                  <li aria-hidden="true">
                    <a class="navbar-menu-link" :href="frontUrl('contact-us')">
                      {{ $t("global.contact-us") }}</a
                    >
                  </li>
                </ul>
              </li>
              <li class="responsive-links">
                <div class="right-content">
                  <div v-if="userType === 1 || userType === 2" class="balance-flex-content">
                    <div style="position: relative">
                      <button type="button" class="balance-flex" @click="toggleNavbarMenu">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"></path>
                        </svg>
                        <p>
                          {{ t("global.balance") }}
                        </p>
                      </button>
                      <div
                        ref="navbarMenuRef"
                        class="navbar-menu-custom"
                        :class="{active: isActiveNavbarMenu}">
                        <ul class="navbar-menu-custom-ul">
                          <li>
                            <span>{{ wallet?.result?.group_class_count ?? "0" }}</span>
                            {{ t("global.group-classes") }}
                          </li>
                          <li>
                            <span>{{ wallet?.result?.our_course_count ?? "0" }}</span>
                            {{ t("global.courses") }}
                          </li>
                          <li>
                            <span>{{ wallet?.result?.private_lesson_count ?? "0" }}</span>
                            {{ t("global.private-lessons") }}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <a
                      v-if="userType === 1"
                      class="custom-btn-header-style"
                      :href="frontUrl('checkout')">
                      {{ $t("global.buy-points") }}</a
                    >
                  </div>
                  <div class="custom-col-line"></div>
                  <ul class="list-links-with-icons">
                    <li>
                      <div>
                        <button type="button" @click="toggleNotifications">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
                          </svg>
                        </button>
                        <div
                          ref="notificationsRef"
                          class="navbar-menu"
                          :class="{active: isActiveNotifications}">
                          <ul>
                            <!--                  <li>-->
                            <!--                    <p>There are no notifications.</p>-->
                            <!--                  </li>-->
                            <li>
                              <button type="button">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                  fill="currentColor">
                                  <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"></path>
                                </svg>
                                <span class="sr-only">login</span>
                                <div>
                                  <h3>global.login:</h3>
                                  <ul>
                                    <li>new-login</li>
                                  </ul>
                                </div>
                              </button>
                            </li>
                            <li>
                              <button type="button">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                  fill="currentColor">
                                  <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"></path>
                                </svg>
                                <div>
                                  <h3>global.login:</h3>
                                  <ul>
                                    <li>new-login</li>
                                  </ul>
                                </div>
                              </button>
                            </li>
                            <li>
                              <button type="button">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                  fill="currentColor">
                                  <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"></path>
                                </svg>
                                <div>
                                  <h3>global.login:</h3>
                                  <ul>
                                    <li>new-login</li>
                                  </ul>
                                </div>
                              </button>
                            </li>
                            <li>
                              <button type="button">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                  fill="currentColor">
                                  <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"></path>
                                </svg>
                                <div>
                                  <h3>global.login:</h3>
                                  <ul>
                                    <li>new-login</li>
                                  </ul>
                                </div>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <button type="button" @click="toggleLikes">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
                          </svg>
                        </button>
                        <div
                          ref="likesRef"
                          class="navbar-menu likes-menu"
                          :class="{active: isActiveLikes}">
                          <ul>
                            <!--                  <li>-->
                            <!--                    <p>There are no notifications.</p>-->
                            <!--                  </li>-->
                            <li>
                              <button type="button">
                                <img
                                  src="https://learning.jinnedu.com/images/webp-169445588564ff584d307ad.webp"
                                  alt="Image" />
                                <div>
                                  <h3>Ahmed Test</h3>
                                  <h4>w-moon99@outlook.com</h4>
                                </div>
                              </button>
                            </li>
                            <li>
                              <button type="button">
                                <img
                                  src="https://learning.jinnedu.com/images/webp-169445588564ff584d307ad.webp"
                                  alt="Image" />
                                <div>
                                  <h3>Ahmed Test</h3>
                                  <h4>w-moon99@outlook.com</h4>
                                </div>
                              </button>
                            </li>
                            <li>
                              <button type="button">
                                <img
                                  src="https://learning.jinnedu.com/images/webp-169445588564ff584d307ad.webp"
                                  alt="Image" />
                                <div>
                                  <h3>Ahmed Test</h3>
                                  <h4>w-moon99@outlook.com</h4>
                                </div>
                              </button>
                            </li>
                            <li>
                              <button type="button">
                                <img
                                  src="https://learning.jinnedu.com/images/webp-169445588564ff584d307ad.webp"
                                  alt="Image" />
                                <div>
                                  <h3>Ahmed Test</h3>
                                  <h4>w-moon99@outlook.com</h4>
                                </div>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li>
                      <router-link to="/dashboard/chats/private-chat/">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path>
                        </svg>
                      </router-link>
                    </li>
                    <li>
                      <a :href="`${baseUrl}/inquiries/`">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
                        </svg>
                      </a>
                    </li>
                    <li>
                      <router-link to="/dashboard/users/index/">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </router-link>
                    </li>
                    <li>
                      <button type="button" class="flex items-end">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"></path>
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="custom-popup-container" :class="{active: isActiveInviteModal}">
      <div class="custom-layer" @click="toggleInviteModal"></div>
      <div class="popup-content">
        <h2>{{ $t("global.invite-your-friends") }}</h2>
        <div>
          <label> {{ $t("global.enter-email") }} </label>
          <input id="email" type="email" name="email" class="input-gray-50 input" />
        </div>
        <button type="button" class="button-primary-custom">{{ $t("global.send") }}</button>
      </div>
    </div> -->
  </div>
</template>
<script>
import {getI18nLanguages} from "@/plugins/i18n"
import {defineComponent, ref, onMounted, computed, onBeforeMount, watch} from "vue"
import {onClickOutside} from "@vueuse/core"
import axiosClient from "@/plugins/axios"
import {useI18n} from "vue-i18n"
import {useStore} from "vuex"
import {useRouter} from "vue-router"
import DefaultGroupClassImage from "@/assets/media/default-group-class.png"
import DefaultTutorImage from "@/assets/media/default-tutor.png"

export default defineComponent({
  name: "website-header",
  components: {
    DefaultGroupClassImage,
    DefaultTutorImage
  },
  setup() {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL
    const router = useRouter()
    const notifications = ref([])
    const favorites = ref([])
    const isActiveNavbarMenu = ref(false)
    const isActiveNotifications = ref(false)
    const isActiveLikes = ref(false)
    const isActiveCategories = ref(false)
    const isActiveClasses = ref(false)
    const isActiveLibrary = ref(false)
    const isActiveHelp = ref(false)
    const isActivePages = ref(false)
    const isActiveMenuResponsive = ref(false)
    const isActiveInviteModal = ref(false)
    const {t} = useI18n()
    const store = useStore()
    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type
    const languages = computed(() => store.state.languages)
    const language = ref(store.state.language)
    const languageId = ref(null)
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const PUBLIC_PATH = ref(import.meta.env.VITE_APP_Public_URL)

    // const favorites = ref([])

    const likesWrapper = ref(null)
    const favoritesLoading = ref(false)

    // Fetch favorites when menu is opened
    const getLocalizedTitle = (langs = []) => {
      if (!Array.isArray(langs) || langs.length === 0) return ""
      const preferred = langs.find(
        (item) =>
          Number(item?.id ?? item?.language_id) === Number(languageId.value) && Boolean(item?.title)
      )
      return preferred?.title || langs.find((item) => Boolean(item?.title))?.title || ""
    }

    const getFavoriteType = (favorite) => {
      const type = favorite?.type
      if ([1, "1", "Tutor", "Tutors", "tutor"].includes(type)) return 1
      if ([2, "2", "Course", "Courses", "course"].includes(type)) return 2
      if ([3, "3", "Group_classes", "GroupClass", "group_class", "group-class"].includes(type)) {
        return 3
      }
      return 0
    }

    const toStorageUrl = (path) => {
      if (!path) return ""
      if (String(path).startsWith("http")) return path
      return `${PUBLIC_PATH.value}/storage/${path}`
    }

    const normalizedFavorites = computed(() => {
      if (!Array.isArray(favorites.value)) return []

      return favorites.value
        .map((favorite, index) => {
          const id = favorite?.id || `favorite-${index}`

          const favoriteType = getFavoriteType(favorite)

          if (favoriteType === 1) {
            const tutorData =
              favorite?.tutor || favorite?.teacher || favorite?.user || favorite?.favoriteable || {}
            return {
              id,
              title: tutorData?.full_name || tutorData?.name || favorite?.name || "-",
              label: t("global.tutor"),
              image: tutorData?.avatar || favorite?.avatar || DefaultTutorImage
            }
          }

          if (favoriteType === 2) {
            const courseData = favorite?.course || favorite?.favoriteable || {}
            return {
              id,
              title:
                getLocalizedTitle(courseData?.langs || favorite?.langs) ||
                courseData?.title ||
                favorite?.title ||
                "-",
              label: t("global.course"),
              image:
                toStorageUrl(courseData?.course_image || courseData?.image) ||
                DefaultGroupClassImage
            }
          }

          if (favoriteType === 3) {
            const groupClassData =
              favorite?.group_class || favorite?.groupClass || favorite?.favoriteable || {}
            return {
              id,
              title:
                getLocalizedTitle(groupClassData?.langs || favorite?.langs) ||
                groupClassData?.name ||
                favorite?.name ||
                "-",
              label: t("global.group-class"),
              image:
                toStorageUrl(groupClassData?.image_info?.path || groupClassData?.image) ||
                DefaultGroupClassImage
            }
          }

          return null
        })
        .filter((item) => item !== null)
    })

    const fetchFavorites = async () => {
      favoritesLoading.value = true
      try {
        const response = await axiosClient.get("/front/tutors-favorites")
        favorites.value = response?.data?.resultl?.data || response?.data?.result?.data || []
      } catch (error) {
        favorites.value = []
      } finally {
        favoritesLoading.value = false
      }
    }

    watch(isActiveLikes, (newVal) => {
      if (newVal) fetchFavorites()
    })

    // Click outside handler
    // const handleClickOutside = (e) => {
    //   if (likesWrapper.value && !likesWrapper.value.contains(e.target)) {
    //     isActiveLikes.value = false
    //   }
    // }
    const getLanguage = function getLanguage() {
      const cb = (element) => element.shortname === computed(() => store.state.language).value
      return languages.value.find(cb)
    }
    const setLanguage = async function setLanguage(languageSelected) {
      if (!languageSelected || languageSelected === store.state.language) {
        language.value = getLanguage()?.shortname || store.state.language
        return
      }

      await store.dispatch("setLanguage", languageSelected)
      await getI18nLanguages(languageSelected)
      language.value = getLanguage()?.shortname || store.state.language
    }

    const frontUrl = (path = "") => {
      const base = String(baseUrl || "").replace(/\/$/, "")
      const currentLanguage = String(language.value || store.state.language || "").trim()
      const languageSegment = currentLanguage ? `/${currentLanguage}` : ""
      const cleanedPath = String(path || "").replace(/^\/+|\/+$/g, "")

      if (!cleanedPath) {
        return `${base}${languageSegment}/`
      }

      return `${base}${languageSegment}/${cleanedPath}/`
    }
    const isDropdownOpen = ref(false)
    const dropdownRef = ref(null)

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isDropdownOpen.value = false
      }
    }

    const lang = languages.value.find((element) => element.shortname === store.state.language)
    languageId.value = lang ? lang.id : null

    const navbarMenuRef = ref(null)
    const notificationsRef = ref(null)
    const likesRef = ref(null)
    const navbarCategoriesRef = ref(null)
    const activeClassesRef = ref(null)
    const libraryRef = ref(null)
    const helpRef = ref(null)

    const pagesRef = ref(null)
    const signOut = function signOut() {
      store.dispatch("signOut").finally(() => router.replace({name: "sign-in"}))
    }

    const wallet = ref(null)
    const hasFetchedInitialData = ref(false)

    const ensureInitialData = () => {
      if (hasFetchedInitialData.value) return
      hasFetchedInitialData.value = true
      fetchCategories()
      fetchWallet()
      getNotifications()
    }

    const fetchWallet = async () => {
      try {
        const response = await axiosClient.get("/wallet/balance")
        wallet.value = response.data
        // console.log(wallet.value.balance)
      } catch (error) {
        console.error("Error fetching wallet:", error)
      }
    }

    const categories = ref([])

    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/front/sections/categories")
        categories.value = response.data.result.data // Assuming the API response contains an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    onClickOutside(navbarMenuRef, () => {
      isActiveNavbarMenu.value = false
    })
    onClickOutside(notificationsRef, () => {
      isActiveNotifications.value = false
    })
    onClickOutside(likesWrapper, () => {
      isActiveLikes.value = false
    })
    onClickOutside(navbarCategoriesRef, () => {
      isActiveCategories.value = false
    })
    onClickOutside(activeClassesRef, () => {
      isActiveClasses.value = false
    })
    onClickOutside(libraryRef, () => {
      isActiveLibrary.value = false
    })
    onClickOutside(helpRef, () => {
      isActiveHelp.value = false
    })
    onClickOutside(pagesRef, () => {
      isActivePages.value = false
    })
    const toggleNavbarMenu = () => {
      isActiveNavbarMenu.value = !isActiveNavbarMenu.value
      if (isActiveNavbarMenu.value) ensureInitialData()
    }
    const toggleNotifications = () => {
      isActiveNotifications.value = !isActiveNotifications.value
      if (isActiveNotifications.value) ensureInitialData()
    }
    const toggleLikes = () => {
      isActiveLikes.value = !isActiveLikes.value
    }

    const removeFavorite = (id) => {
      if (!id) return

      const confirmDelete =
        typeof Swal !== "undefined"
          ? Swal.fire({
              icon: "error",
              text: t("global.ensure-delete"),
              showCancelButton: true,
              confirmButtonText: t("global.yes-delete"),
              cancelButtonText: t("global.go-back"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger", cancelButton: "btn btn-active-light"}
            }).then((result) => Boolean(result?.isConfirmed))
          : Promise.resolve(window.confirm(t("global.ensure-delete")))

      confirmDelete.then((isConfirmed) => {
        if (!isConfirmed) return
        axiosClient.delete(`/favorites/delete/${id}`).then(() => {
          favorites.value = favorites.value.filter(
            (favorite) => String(favorite?.id) !== String(id)
          )
        })
      })
    }
    const toggleCategories = () => {
      isActiveCategories.value = !isActiveCategories.value
    }
    const toggleClasses = () => {
      isActiveClasses.value = !isActiveClasses.value
    }
    const toggleLibrary = () => {
      isActiveLibrary.value = !isActiveLibrary.value
    }
    const toggleHelp = () => {
      isActiveHelp.value = !isActiveHelp.value
    }
    const togglePages = () => {
      isActivePages.value = !isActivePages.value
    }
    const toggleMenuResponsive = () => {
      isActiveMenuResponsive.value = !isActiveMenuResponsive.value
    }
    const toggleInviteModal = () => {
      isActiveInviteModal.value = !isActiveInviteModal.value
    }
    const getNotifications = function getNotifications() {
      axiosClient.get(`/notifications`).then((response) => {
        notifications.value = response.data.result.data
      })
    }
    // const getFavorites = function getFavorites() {
    //   axiosClient.get("/front/tutors-favorites").then((response) => {
    //     favorites.value = response.data.resultl.data
    //   })
    // }
    onBeforeMount(() => {
      language.value = getLanguage().shortname
    })
    onMounted(() => {
      setTimeout(() => {
        ensureInitialData()
      }, 350)
      // getFavorites()
    })

    return {
      toggleNavbarMenu,
      isActiveNavbarMenu,
      toggleNotifications,
      isActiveNotifications,
      toggleLikes,
      isActiveLikes,
      PUBLIC_PATH,
      navbarMenuRef,
      notificationsRef,
      likesRef,
      isActiveCategories,
      toggleCategories,
      navbarCategoriesRef,
      activeClassesRef,
      isActiveClasses,
      toggleClasses,
      toggleLibrary,
      isActiveLibrary,
      libraryRef,
      toggleHelp,
      isActiveHelp,
      helpRef,
      isActivePages,
      togglePages,
      pagesRef,
      isActiveMenuResponsive,
      toggleMenuResponsive,
      notifications,
      getNotifications,
      // getFavorites,
      favorites,
      t,
      languages,
      language,
      setLanguage,
      frontUrl,
      signOut,
      isActiveInviteModal,
      toggleInviteModal,
      baseUrl,
      categories,
      fetchCategories,
      wallet,
      fetchWallet,
      userType,
      languageId,
      toggleDropdown,
      handleClickOutside,
      isDropdownOpen,
      dropdownRef,
      likesWrapper,
      normalizedFavorites,
      favoritesLoading,
      removeFavorite,
      SERVER_PATH,
      DefaultGroupClassImage,
      DefaultTutorImage
    }
  }
})
</script>
<style lang="scss">
.custom-popup-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  padding: 1rem;
  display: grid;
  place-items: center;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  visibility: hidden;

  &.active {
    opacity: 1;
    visibility: visible;
  }

  .button-primary-custom {
    border-radius: 0.25rem;
    border-width: 2px;
    border-color: transparent;
    padding: 1.1rem 1.5rem;
    font-weight: 500;
    line-height: 1rem;
    background: #1d4ed8;
    color: #ffffff;
    margin-top: 16px;
    font-size: 14px;
    transition: all 0.25s ease-in-out;

    &:hover {
      background: #1e3a8a;
    }
  }

  .popup-content {
    background: #ffffff;
    max-width: 448px;
    padding: 1.5rem;
    position: relative;
    z-index: 100;
    width: 100%;

    input {
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1;
      border-radius: 0.25rem;
      width: 100%;
      flex-shrink: 1;
      padding: 1.2rem 1.25rem;
      outline: 2px solid transparent;
      outline-offset: 2px;
      transition-property: all;
      transition-duration: 0.2s;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 6px;
      border: 2px solid #f3f4f6;
    }

    label {
      font-size: 16px;
      margin-top: 6px;
    }
  }

  .custom-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    z-index: 1;
  }
}

.button-white-sign-out {
  border-radius: 0.25rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1rem;
  background: #ffffff;
  border: 2px solid #f3f4f6;
  color: #0d6efd;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #1e3a8a;
    color: #ffffff;
  }
}

.main-header-content {
  background: #f9fafb;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  .custom-flex-header {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    padding: 16px 24px;

    @media (max-width: 1280px) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .left-content {
    display: flex;
    align-items: center;
    gap: 16px;

    .input {
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1;
      --tw-text-opacity: 1;
      border-radius: 0.25rem !important;
      border-width: 2px;
      --tw-border-opacity: 1;
      --tw-bg-opacity: 1;
      width: 100%;
      flex-shrink: 1;
      padding: 0.75rem 1.25rem;
      outline: 2px solid transparent;
      outline-offset: 2px;
      transition-property: all;
      transition-duration: 0.2s;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .right-content {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    width: max-content;

    @media (max-width: 768px) {
      display: none;
    }

    .custom-btn-header-style {
      transition: all 0.25s ease-in-out;
      border-radius: 0.25rem;
      border-width: 2px;
      border-color: transparent;
      padding: 1rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1rem;
      background: #1d4ed8;
      color: #ffffff;

      &:hover {
        background: #1e3a8a;
      }
    }

    .balance-flex {
      display: flex;
      gap: 8px;
      border: none;
      background: transparent;
      align-items: center;

      svg {
        width: 20px;
        height: 20px;
        stroke: #6b7280;
      }

      p {
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1;
        color: #374151;
        margin: 0;
      }
    }

    .navbar-menu-custom {
      position: absolute;
      top: 90%;
      inset-inline-end: 0;
      width: 20rem;
      border-radius: 0.25rem;
      box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05), 0 4px 8px -4px rgba(0, 0, 0, 0.05);
      opacity: 0;
      visibility: hidden;
      transition: all 0.25s ease-in-out;
      background: #ffffff;
      z-index: 100;

      @media (max-width: 640px) {
        inset-inline-end: -80%;
        top: 140%;
      }

      &.active {
        opacity: 1;
        visibility: visible;
      }

      .navbar-menu-custom-ul {
        display: flex;
        flex-direction: column;
        padding: 12px !important;
        gap: 12px;
        list-style: none;
        margin: 0;

        li {
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 12px;
          border-radius: 0.25rem;
          padding: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1;
          color: #374151;
          border: 2px solid #f3f4f6;

          span {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            border-radius: 50%;
            background: #dbeafe;
            color: #1d4ed8;
            width: 1.75rem;
            height: 1.75rem;
          }
        }
      }
    }

    .balance-flex-content {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
    }

    .custom-col-line {
      display: none;
      height: 20px;
      width: 1px;
      background: #e5e7eb;

      @media (min-width: 768px) {
        display: block;
      }
    }

    .list-links-with-icons {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
      list-style: none;
      padding: 0;
      margin: 0;
      height: max-content;

      li {
        height: max-content;

        > div {
          height: 40px;
          width: 40px;
        }
      }

      > li.favorites-root-item > div {
        height: auto;
        width: auto;
      }

      > li > button,
      > li > a,
      > li > div > button,
      > li > div > a {
        display: grid;
        place-items: center;
        border: none;
        background: transparent;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        padding: 0;

        svg {
          height: 20px;
          width: 20px;
          stroke: #6b7280;
        }
      }

      .navbar-menu {
        //position: absolute;
        //top: 90%;
        position: relative;
        bottom: 85%;
        left: -270px;
        inset-inline-end: 0;
        width: 20rem;
        border-radius: 0.25rem;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05), 0 4px 8px -4px rgba(0, 0, 0, 0.05);
        max-height: 300px;
        overflow-y: scroll;
        opacity: 0;
        visibility: hidden;
        transition: all 0.25s ease-in-out;
        padding: 0.75rem;
        background: #ffffff;
        z-index: 1000;

        @media (max-width: 768px) {
          max-height: 200px;
        }

        &.active {
          opacity: 1;
          visibility: visible;
        }

        ul {
          list-style: none;
          padding: 0 !important;
          margin: 0 !important;

          li {
            p {
              margin: 0;
            }

            &:last-child {
              button {
                margin-bottom: 0;
              }
            }

            button {
              display: flex;
              align-items: start;
              gap: 12px;
              border-radius: 0.25rem;
              width: 100%;
              border: 2px solid #f3f4f6;
              border-radius: 0.25rem;
              padding: 0.75rem;
              height: auto;
              margin-bottom: 0.75rem;

              svg {
                width: 20px;
                height: 20px;
                fill: #1d4ed8;
                stroke: #1d4ed8;
              }

              div {
                width: calc(100% - 32px);
                text-align: start;
              }
            }
          }
        }

        > ul {
          padding: 0.4rem !important;
        }

        &.likes-menu {
          img {
            width: 48px;
            height: 48px;
            border-radius: 4px;
            object-fit: cover;
          }

          button {
            align-items: center;

            div {
              width: calc(100% - 60px);

              h3 {
                font-size: 14px;
                color: #1d4ed8;
              }

              h4 {
                font-size: 14px;
                color: #999ea7;
                display: -webkit-box;
                overflow: hidden;
                margin-bottom: 0;
                word-break: break-all;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
            }
          }
        }

        &.favorites-menu {
          left: -290px;
          width: 22rem;
          max-height: 360px;
          overflow-y: auto;
          padding: 0;

          .favorites-menu-header {
            padding: 0.75rem 0.9rem;
            border-bottom: 1px solid #eef1f5;
            background: linear-gradient(90deg, #f8fafc, #eef4ff);

            h4 {
              margin: 0;
              font-size: 14px;
              font-weight: 700;
              color: #1f2937;
            }
          }

          .favorites-state-list {
            list-style: none;
            margin: 0;
            padding: 0.65rem 0.7rem;

            > li {
              display: flex;
              align-items: stretch;
              margin-bottom: 0.55rem;

              &:last-child {
                margin-bottom: 0;
              }

              p {
                margin: 0;
                color: #6b7280;
              }
            }
          }

          .favorite-entry {
            border: 1px solid #e7edf4;
            border-radius: 10px;
            background: #ffffff;
            padding: 0.55rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            width: 100%;
            transition: all 0.2s ease;

            &:hover {
              border-color: #c7d8f0;
              box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
            }
          }

          .favorite-entry-info {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            min-width: 0;
            width: 100%;
            flex: 1 1 auto;
          }

          .favorite-entry-image {
            width: 44px;
            height: 44px;
            border-radius: 8px;
            object-fit: cover;
            flex-shrink: 0;
          }

          .favorite-entry-text {
            min-width: 0;

            h3 {
              margin: 0;
              color: #1f2937;
              font-size: 13px;
              font-weight: 600;
              line-height: 1.25;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            span {
              display: block;
              margin-top: 2px;
              color: #64748b;
              font-size: 12px;
            }
          }

          .favorite-delete-btn {
            border: 1px solid #f7d4d4;
            background: #fff5f5;
            color: #e11d48;
            width: 32px;
            height: 32px;
            min-width: 32px;
            min-height: 32px;
            border-radius: 8px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
            padding: 0;
            margin: 0;
            margin-bottom: 0;
            line-height: 1;
            align-items: center;
            justify-content: center;
            position: static;

            svg {
              width: 16px;
              height: 16px;
              fill: currentColor;
            }

            &:hover {
              background: #ffe7e7;
            }
          }
        }
      }
    }
  }

  .second-header {
    background: #f3f4f6;
    padding: 16px 24px;

    .open-menu-btn {
      display: none;
      align-items: center;
      gap: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: hsla(220, 9%, 46%, 0.75);
      border: none;
      padding: 0;
      background: transparent;
      font-weight: bold;

      svg {
        width: 20px;
        height: 20px;
        stroke: #9095a0;
      }

      @media (max-width: 1280px) {
        display: flex;
      }
    }

    .second-header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .left-content-second-header {
        display: flex;
        align-items: center;
        gap: 40px;

        .logo-header {
          // width: 88px;
          display: block;

          img {
            width: 100%;
            height: 2.5rem;
          }
        }

        .categories-btn {
          display: flex;
          gap: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: hsla(220, 9%, 46%, 0.75);
          border: none;
          padding: 0;
          background: transparent;

          @media (max-width: 768px) {
            display: none;
          }

          svg {
            width: 20px;
            height: 20px;
          }
        }
      }

      .right-content-second-header {
        @media (max-width: 1280px) {
          position: fixed;
          top: 0;
          inset-inline-end: -100%;
          width: 100%;
          height: 100vh;
          background: #ffffff;
          z-index: 1000;
          display: grid;
          place-items: center;
          overflow: auto;
          transition-property: all;
          transition-duration: 0.3s;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

          > ul {
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        }

        &.active {
          inset-inline-end: 0;
        }

        .right-content {
          display: none;

          @media (max-width: 768px) {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
          }
        }

        .close-btn {
          display: none;
          border: none;
          padding: 0;
          background: transparent;

          svg {
            width: 20px;
            height: 20px;
            stroke: #9095a0;
            transition: all 0.25s ease-in-out;
          }

          &:hover {
            svg {
              stroke: #1d4ed8;
            }
          }

          @media (max-width: 1280px) {
            position: absolute;
            top: 20px;
            inset-inline-end: 20px;
            display: block;
          }
        }

        .navbar-links-custom {
          inset-inline-end: 0;
          inset-inline-start: inherit;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .navbar-links-custom {
          padding: 0.75rem 0 !important;
        }

        > ul {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1.75rem;

          > li {
            > a,
            > button {
              svg {
                width: 20px;
              }

              font-size: 0.875rem;
              border: none;
              padding: 0;
              background: transparent;
              font-weight: 500;
              line-height: 1;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: hsla(220, 9%, 46%, 0.75);
              gap: 0.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.25s ease-in-out;

              &:hover {
                color: #1d4ed8;
              }
            }
          }
        }
      }
    }
  }

  .search-btn {
    display: none;

    @media (min-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      background: #ffffff;
      padding: 0.75rem 1.25rem;
      font-weight: 500;
      line-height: 1rem;
      width: fit-content;
      font-size: 14px;
      color: #1d4ed8;
      transition: all 0.25s ease-in-out;
      border-radius: 0.25rem;

      &:hover {
        background: #1e3a8a;
        color: #ffffff;

        svg {
          stroke: #ffffff;
        }
      }

      svg {
        transition: all 0.25s ease-in-out;
        width: 20px;
        height: 24px;
        stroke: #d1d5db;
      }
    }
  }

  .navbar-links-custom {
    position: absolute;
    top: 120%;
    inset-inline-start: 0;
    z-index: 10;
    width: 13rem;
    border-radius: 0.25rem;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05), 0 4px 8px -4px rgba(0, 0, 0, 0.05);
    list-style: none;
    margin: 0;
    background: #ffffff;
    padding: 0.75rem 0;
    opacity: 0;
    visibility: hidden;
    transition: all 0.25s ease-in-out;

    &.active {
      opacity: 1;
      visibility: visible;
    }

    a {
      font-size: 0.875rem;
      line-height: 1;
      display: inline-block;
      width: 100%;
      padding: 0.75rem 1.25rem;
      font-weight: 400;
      transition-property: all;
      transition-duration: 0.2s;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      color: #6b7280;

      &:hover {
        background: #f3f4f6;
      }
    }
  }
}

:root {
  --bs-app-header-height: 164px;
  --bs-app-header-height-actual: 74px;

  @media (max-width: 1280px) {
    --bs-app-header-height: 218px !important;
  }

  @media (max-width: 768px) {
    --bs-app-header-height: 170px !important;
  }
}

.app-wrapper {
  padding-bottom: 20px;

  @media (max-width: 1280px) {
    margin-top: var(--bs-app-header-height) !important;
  }
}

.app-sidebar.flex-column {
  top: var(--bs-app-header-height);
}

.app-sidebar-logo-default {
  width: 100%;
  object-fit: cover;
}

.app-sidebar-logo > a {
  // display: none !important;
}

.app-sidebar-logo {
  height: 80px !important;
}

.app-sidebar-wrapper {
  margin-top: 0 !important;
}
</style>
