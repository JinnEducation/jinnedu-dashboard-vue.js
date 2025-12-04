<!-- DONE REVIEWING: NEW -->
<template>
  <toolbar :title="t('global.group-classes-management')" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <span class="svg-icon svg-icon-1 position-absolute ms-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none">
                  <rect
                    x="17"
                    y="15"
                    rx="1"
                    width="8"
                    height="2"
                    transform="rotate(45 17 15)"
                    fill="currentColor"
                    opacity="0.5" />
                  <path
                    d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                    fill="currentColor" />
                </svg>
              </span>
              <label for="search-group-classes" class="sr-only">{{
                t("global.search-group-classes")
              }}</label>
              <input
                id="search-group-classes"
                type="text"
                name="search-group-classes"
                :placeholder="t('global.search-group-classes')"
                data-kt-content-table-filter="search"
                class="form-control form-control-solid w-250px ps-14"
                @keyup.enter="searchDataTableBodyRows" />
            </div>
          </div>
          <div v-if="userType === 0" class="card-toolbar">
            <div data-kt-content-table-toolbar="base" class="d-flex justify-content-end">
              <router-link :to="`/dashboard/group-classes/create`" class="btn btn-primary">
                <span class="svg-icon svg-icon-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none">
                    <rect
                      x="11"
                      y="20"
                      rx="1"
                      width="16"
                      height="2"
                      transform="rotate(-90 11 20)"
                      fill="currentColor"
                      opacity="0.5" />
                    <rect x="4" y="11" rx="1" width="16" height="2" fill="currentColor" />
                  </svg>
                </span>
                {{ t("global.add-button") }} {{ t("global.group-classes") }}
              </router-link>
            </div>
          </div>
        </div>
        <template v-if="loading">
          <div class="card-body p-0">
            <div class="card-px text-center py-20 my-10">
              <div role="status" class="spinner-border text-primary">
                <span class="visually-hidden">{{ t("global.loading") }}...</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="data.length === 0">
          <div class="card-body p-0">
            <div class="card-px text-center py-20 my-10">
              <h2 class="fs-2x fw-bold mb-10">{{ t("global.welcome") }}</h2>
              <p class="text-gray-400 fs-5 fw-semibold mb-13">
                <span>
                  {{ t("global.no-group-classes") }}
                </span>
              </p>
              <router-link
                v-show="abilities.create"
                :to="`/dashboard/group-classes/create`"
                class="btn btn-primary er fs-6 px-8 py-4">
                {{ t("global.add-button") }} {{ t("global.group-classes") }}
              </router-link>
            </div>
            <div class="text-center px-5">
              <img
                src="@/assets/media/illustrations/welcome.png"
                :alt="`Add Group Class Illustration`"
                class="mw-100 mh-300px" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="card-body py-4">
            <data-table
              :data="data"
              :header="header"
              :checkbox-enabled="true"
              checkbox-label="id"
              :items-total="itemsTotal"
              :items-per-page-dropdown-enabled="true"
              :page-current="currentPage"
              :items-per-page="itemsPerPage"
              :query-string="currentSearchQuery"
              @on-sort="onSort"
              @on-items-select="onItemsSelect">
              <template #id="{row: groupClass}">
                {{ data.indexOf(groupClass) + 1 }}
              </template>
              <template #name="{row: groupClass}">
                {{ groupClass.name }}
              </template>
              <template #title="{row: groupClass}">
                {{
                  groupClass.langs.find((lang) => Number(lang.language_id) === Number(languageId))
                    ?.title
                }}
              </template>
              <template #classes="{row: groupClass}">
                {{ groupClass.classes }}
              </template>
              <template v-if="userType === 0" #status="{row: groupClass}">
                <span v-if="groupClass.status === 0" class="text-danger">{{
                  t("global.in-active")
                }}</span>
                <span v-else-if="groupClass.status === 1" class="text-success">{{
                  t("global.active")
                }}</span>
              </template>
              <template v-if="userType === 0" #have_exams="{row: groupClass}">
                <span v-if="groupClass.have_exams === 1" class="text-success">{{
                  t("global.yes_have_exams")
                }}</span>
                <span v-else class="text-danger">{{
                  t("global.no_have_exams")
                }}</span>
              </template>
              <template #tutors="{row: groupClass}">
                <div v-if="groupClass.tutor">
                  <template v-if="userType === 0">
                    <button
                      type="button"
                      class="btn text-success p-3 me-2"
                      @click="gotoTutorInformation(groupClass.tutor.id)">
                      {{ groupClass.tutor.name }}
                    </button>
                  </template>
                  <template v-else>
                    <div class="text-success">
                      {{ groupClass.tutor.name }}
                    </div>
                  </template>
                </div>
                <div v-else class="text-danger">{{ t("global.no-tutors-assigned") }}</div>
              </template>

              <template #actions="{row: groupClass}">
                <button
                  type="button"
                  aria-label="show details"
                  class="btn btn-light-primary me-2 px-2"
                  @click="showGroupClassDetails(groupClass)">
                  {{ t("global.details") }}
                </button>

                <!-- group class details in tutor modal -->
                <template v-if="groupClassModalDetails[groupClass.id]">
                  <div class="modal">
                    <div class="modal-dialog model-xl">
                      <div class="modal-content">
                        <!-- Modal header -->
                        <div class="modal-header">
                          <h5 class="modal-title">{{ t("global.group-class-details") }}</h5>
                          <button
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            @click="closeGroupClassDetailsModal(groupClass)"></button>
                        </div>
                        <!-- Modal body -->
                        <div class="modal-body">
                          <ul>
                            <div class="d-flex">
                              <div class="detail-title">{{ t("global.group-class-name") }}</div>
                              <div>
                                {{ groupClassModalDetails[groupClass.id].group_class.name }}
                              </div>
                            </div>
                            <!-- <div class="d-flex">
                              <div class="detail-title">{{ t("global.classes") }} :</div>
                              <div>
                                {{ groupClassModalDetails[groupClass.id].group_class.classes }}
                              </div>
                            </div>

                            <div class="d-flex">
                              <div class="detail-title">{{ t("global.class-length") }} :</div>
                              <div>
                                {{ groupClassModalDetails[groupClass.id].group_class.class_length }}
                              </div>
                            </div>

                            <div class="d-flex">
                              <div class="detail-title">{{ t("global.publish-date") }} :</div>
                              <div>
                                {{ groupClassModalDetails[groupClass.id].group_class.publish_date }}
                              </div>
                            </div>

                            <div class="d-flex">
                              <div class="detail-title">{{ t("global.price") }} :</div>
                              <div>
                                {{ groupClassModalDetails[groupClass.id].group_class.price }}
                              </div>
                            </div>

                            <div style="text-align: left">
                              <div class="detail-title">{{ t("global.dates") }} :</div>
                              <ul
                                v-for="conference in groupClassModalDetails[groupClass.id]
                                  .conferences"
                                :key="conference.id">
                                <li>{{ conference.date }}</li>
                              </ul>
                            </div> -->
                          </ul>

                          <div class="d-flex">
                            <h2 class="text-bold text-warning">
                              {{ t("global.conference") }}
                            </h2>
                          </div>
                          <table class="table mt-4">
                            <thead>
                              <tr class="text-center">
                                <th>{{ t("global.date") }}</th>
                                <th>{{ t("global.start_time") }}</th>
                                <th>{{ t("global.end_time") }}</th>
                                <th>{{ t("global.taken") }}</th>
                                <th>{{ t("global.students") }}</th>
                              </tr>
                            </thead>
                            <tbody
                              v-if="
                                groupClassModalDetails[groupClass.id] &&
                                groupClassModalDetails[groupClass.id].conferences
                              ">
                              <template
                                v-for="conference in groupClassModalDetails[groupClass.id]
                                  .conferences"
                                :key="conference.id">
                                <!-- Main Conference Row -->
                                <tr class="text-center">
                                  <td>{{ conference.date }}</td>
                                  <td>{{ conference.start_time }}</td>
                                  <td>{{ conference.end_time }}</td>
                                  <td>
                                    <font-awesome-icon
                                      :icon="conference.is_taken ? faCheckSquare : faWindowClose"
                                      :class="
                                        conference.is_taken ? 'text-success' : 'text-danger'
                                      " />
                                  </td>
                                  <td>
                                    <template v-if="conference.is_taken">
                                      <button
                                        type="button"
                                        class="btn btn-sm btn-primary"
                                        @click="conference.showStudents = !conference.showStudents">
                                        <!-- {{
                                          conference.showStudents
                                            ? t("global.hide-students")
                                            : t("global.show-students")
                                        }} -->

                                        <i
                                          :class="
                                            conference.showStudents
                                              ? 'pi pi-angle-down'
                                              : 'pi pi-angle-up'
                                          "></i>
                                      </button>
                                    </template>
                                    <template v-else>
                                      <em>{{ t("global.no-students") }}</em>
                                    </template>
                                  </td>
                                </tr>

                                <!-- Collapsible Student Row -->
                                <tr v-if="conference.showStudents">
                                  <td colspan="6">
                                    <table class="table table-bordered mt-2">
                                      <thead>
                                        <tr class="text-center">
                                          <th>#</th>
                                          <th>{{ t("global.student") }}</th>
                                          <th v-if="userType === 2">
                                            {{ t("global.attendance") }}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr
                                          v-for="(student, index) in conference.students"
                                          :key="student.id"
                                          class="text-center">
                                          <td>{{ index + 1 }}</td>
                                          <td>{{ student.name }}</td>
                                          <td v-if="userType === 2">
                                            <label class="switch">
                                              <input
                                                type="checkbox"
                                                :checked="student.status"
                                                @change="
                                                  toggleConferenceAttendance(
                                                    conference.id,
                                                    student.id
                                                  )
                                                " />
                                              <span class="slider round"></span>
                                            </label>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </template>
                            </tbody>
                            <tbody v-else>
                              <tr>
                                <td colspan="6">{{ t("global.no-conferences") }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-secondary"
                            @click="closeGroupClassDetailsModal(groupClass)">
                            {{ t("global.close") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- register tutor to group class -->
                <button
                  v-if="
                    userType === 2 &&
                    !isTutorApplied(groupClass.applied_tutors, userInfoObject.user.id)
                  "
                  type="button"
                  aria-label="Register"
                  class="btn btn-icon btn-light-primary me-2 registertooltip"
                  @click="registerGroupClass(groupClass.id)">
                  <span class="svg-icon svg-icon-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style="width: 1.5rem; height: 1.5rem">
                      <g fill="none" fill-rule="evenodd">
                        <rect x="4" y="11" rx="1" width="16" height="2" fill="currentColor" />
                        <rect
                          x="4"
                          y="11"
                          rx="1"
                          width="16"
                          height="2"
                          transform="translate(12, 12) rotate(-270) translate(-12, -12)"
                          fill="currentColor"
                          opacity="0.5" />
                      </g>
                    </svg>
                  </span>
                  <span class="registertooltiptext">{{ t("global.register-to-group-class") }}</span>
                </button>

                <!-- un register ( tutor ) -->
                <button
                  v-if="
                    userType === 2 &&
                    isTutorApplied(groupClass.applied_tutors, userInfoObject.user.id) &&
                    !groupClass.tutor
                  "
                  type="button"
                  aria-label="Register"
                  class="btn btn-icon btn-light-primary me-2 unregistertooltip"
                  @click="unRegisterGroupClass(groupClass.id)">
                  <span class="svg-icon svg-icon-danger">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style="width: 1.5rem; height: 1.5rem; color: red">
                      <rect x="4" y="11" rx="1" width="16" height="2" fill="red" />
                    </svg>
                  </span>
                  <span class="unregistertooltiptext">{{
                    t("global.un-register-to-group-class")
                  }}</span>
                </button>

                <!-- un register  button -->
                <button
                  v-if="userType === 0 && groupClass.canUnAssignedTutor === 1"
                  type="button"
                  aria-label="Un Register"
                  class="btn btn-icon btn-light-danger me-2"
                  @click="unRegisterGroupClassTutor(groupClass.id)">
                  <span class="svg-icon svg-icon-danger">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style="width: 1.5rem; height: 1.5rem">
                      <rect x="4" y="11" rx="1" width="16" height="2" fill="currentColor" />
                    </svg>
                  </span>
                </button>

                <!-- tutor requested button -->
                <button
                  v-if="userType === 0"
                  type="button"
                  aria-label="assigned tutors"
                  class="btn btn-icon btn-light-primary me-2 showtooltip custom-button"
                  style="background-color: #ddefff"
                  @click="openModal(groupClass)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    shape-rendering="geometricPrecision"
                    text-rendering="geometricPrecision"
                    image-rendering="optimizeQuality"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    style="width: 2.5rem; height: 2.5rem; color: blue"
                    viewBox="0 0 512 318.97"
                    class="custom-svg"
                    fill="#2c2cd3">
                    <path
                      fill-rule="nonzero"
                      d="M165.11 35.37c-3.87 0-6.99-3.12-6.99-6.99s3.12-6.99 6.99-6.99h148.37V6.99c0-3.87 3.12-6.99 6.99-6.99s6.99 3.12 6.99 6.99v14.4h176.8c3.87 0 6.99 3.12 6.99 6.99s-3.12 6.99-6.99 6.99h-16.09v200.88h16.84c3.87 0 6.99 3.12 6.99 6.99s-3.12 6.99-6.99 6.99H324.7v7.1c.38.25.63.5.87.75l42.8 40.68c2.74 2.62 2.87 7.11.25 9.85-2.62 2.75-7.11 2.87-9.86.25l-33.93-32.31v35.43c0 3.87-3.12 6.99-6.99 6.99s-6.99-3.12-6.99-6.99v-36.8l-35.43 33.68c-2.75 2.62-7.24 2.62-9.86-.25-2.62-2.74-2.62-7.23.25-9.85l42.8-40.68c.62-.62 1.49-1.12 2.24-1.5v-6.35H163.06c-3.87 0-6.99-3.12-6.99-6.99s3.12-6.99 6.99-6.99h311.13V35.37H165.11zM301.7 206.69a6.4 6.4 0 0 1-6.4-6.4c0-3.53 2.87-6.39 6.4-6.39h136.37c3.53 0 6.39 2.86 6.39 6.39 0 3.54-2.86 6.4-6.39 6.4H301.7zm9.66-42.99c-3.53 0-6.39-2.86-6.39-6.39 0-3.54 2.86-6.4 6.39-6.4h126.71c3.53 0 6.39 2.86 6.39 6.4 0 3.53-2.86 6.39-6.39 6.39H311.36zm-20.78-42.99c-3.53 0-6.39-2.86-6.39-6.39s2.86-6.4 6.39-6.4h147.49c3.53 0 6.39 2.87 6.39 6.4 0 3.53-2.86 6.39-6.39 6.39H290.58zm-65.77-42.99c-3.53 0-6.39-2.86-6.39-6.39s2.86-6.4 6.39-6.4h213.26c3.53 0 6.39 2.87 6.39 6.4 0 3.53-2.86 6.39-6.39 6.39H224.81zm-4.62 84.52 48.49-50.84c2.85-3 7.59-3.11 10.58-.27 3 2.85 3.11 7.59.27 10.58l-45.68 47.9c3.75 4.54 5.53 10.65 4.34 16.88-2.12 11.09-12.83 18.36-23.91 16.24l-50.71-9.75c-5.06-.88-9.8-3.66-13.05-8.15l-16.45-22.73-.04 2.05v-1.48l-1.31 75.84 1.99 11.36H49.66l1.76-10.52-1.56-75.24v.04l-.26-12.9-.09.1c-8.7 8.71-9.07 29.47-10.04 42.08l-2.21 28.88c-.51 6.59-1.06 10.31-6.22 14.77-7.5 6.46-20.13 7.79-26.8-.38-4.31-5.26-4.52-13.66-4.08-21.33 2.22-38.37 6.73-96.12 49.7-115.12v.48c18.22-7.24 39.69-4.09 59.29-4.09 9.33 0 17.53 1.37 24.81 4.16 4.65 1.07 8.94 3.76 11.96 7.93l32.96 45.57 41.31 7.94zM91.77 3.13c23.89 0 43.25 19.36 43.25 43.25 0 23.88-19.36 43.24-43.25 43.24S48.52 70.26 48.52 46.38c0-23.89 19.36-43.25 43.25-43.25z" />
                  </svg>
                  <span class="showtooltiptext">{{ t("global.show-requested-tutors") }}</span>
                </button>

                <!-- tutor requested modal -->
                <template v-if="modals[groupClass.id]">
                  <div class="modal">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <!-- Modal header -->
                        <div class="modal-header">
                          <h5 class="modal-title">{{ t("global.tutors-requested") }}</h5>
                          <button
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            @click="closeModal(groupClass)"></button>
                        </div>
                        <!-- Modal body -->
                        <div class="modal-body">
                          <table style="text-align: left; width: 100%">
                            <thead>
                              <tr>
                                <th class="p-2 text-info">{{ t("global.name") }}</th>
                                <th class="p-2 text-info">{{ t("global.specialization") }}</th>
                                <th class="p-2 text-info">{{ t("global.price") }}</th>
                                <th class="p-2 text-info">{{ t("global.rating") }}</th>
                                <th class="p-2 text-info">{{ t("global.status") }}</th>
                                <th class="p-2 text-info">{{ t("global.action") }}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="tutor in selectedTutors" :key="tutor.id">
                                <td class="p-2">
                                  <a href="#" @click="gotoUserInformation(tutor.id)">
                                    {{ tutor.name }}
                                  </a>
                                </td>
                                <td class="p-2">{{ tutor.specialization }}</td>
                                <td class="p-2">{{ tutor.price }}</td>
                                <td class="p-2">
                                  <div class="rating">
                                    <template v-if="tutor.rating">
                                      <i
                                        v-for="i in Math.round(tutor.rating)"
                                        :key="i"
                                        class="fas fa-star"
                                        style="color: #f8f725"></i>
                                    </template>
                                  </div>
                                </td>
                                <td class="p-2">
                                  <template
                                    v-if="groupClass.tutor && groupClass.tutor.id == tutor.id">
                                    <p class="text-success m-0">
                                      {{ t("global.accepted") }}
                                    </p>
                                  </template>
                                  <template v-else>
                                    <p class="text-danger m-0">
                                      {{ t("global.rejected") }}
                                    </p>
                                  </template>
                                </td>
                                <td class="p-2">
                                  <button
                                    v-if="!groupClass.tutor"
                                    type="button"
                                    class="btn btn-success"
                                    @click="assignTutor(tutor.id, groupClass)">
                                    {{ t("global.assign") }}
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <!-- Modal footer -->
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-secondary"
                            @click="closeModal(groupClass)">
                            {{ t("global.close") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- edit button -->
                <router-link
                  v-if="userType === 0"
                  v-show="abilities.edit"
                  :to="`/dashboard/group-classes/update/${groupClass.id}`"
                  aria-label="Update"
                  class="btn btn-icon btn-light-success edittooltip me-2">
                  <span class="svg-icon svg-icon-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style="width: 1.5rem; height: 1.5rem">
                      <path
                        d="M3,16 L5,16 C5.55228475,16 6,15.5522847 6,15 C6,14.4477153 5.55228475,14 5,14 L3,14 L3,12 L5,12 C5.55228475,12 6,11.5522847 6,11 C6,10.4477153 5.55228475,10 5,10 L3,10 L3,8 L5,8 C5.55228475,8 6,7.55228475 6,7 C6,6.44771525 5.55228475,6 5,6 L3,6 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 C10.5522847,3 11,3.44771525 11,4 L11,19 C11,19.5522847 10.5522847,20 10,20 L4,20 C3.44771525,20 3,19.5522847 3,19 L3,16 Z"
                        fill="currentColor"
                        opacity="0.5" />
                      <path
                        d="M16,3 L19,3 C20.1045695,3 21,3.8954305 21,5 L21,15.2485298 C21,15.7329761 20.8241635,16.200956 20.5051534,16.565539 L17.8762883,19.5699562 C17.6944473,19.7777745 17.378566,19.7988332 17.1707477,19.6169922 C17.1540423,19.602375 17.1383289,19.5866616 17.1237117,19.5699562 L14.4948466,16.565539 C14.1758365,16.200956 14,15.7329761 14,15.2485298 L14,5 C14,3.8954305 14.8954305,3 16,3 Z"
                        fill="currentColor" />
                    </svg>
                  </span>
                  <span class="edittooltiptext">{{ t("global.edit") }}</span>
                </router-link>
                <button
                  v-if="userType === 0"
                  v-show="abilities.destroy"
                  type="button"
                  aria-label="Delete"
                  class="btn btn-icon btn-light-danger deletetooltip"
                  @click="deleteGroupClass(groupClass.id)">
                  <span class="svg-icon svg-icon-danger">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      style="width: 1.5rem; height: 1.5rem">
                      <path
                        d="M6,8 L18,8 L17.106535,19.6150447 C17.04642,20.3965405 16.3947578,21 15.6109533,21 L8.38904671,21 C7.60524225,21 6.95358004,20.3965405 6.89346498,19.6150447 L6,8 Z M8,10 L8.45438229,14.0894406 L15.5517885,14.0339036 L16,10 L8,10 Z"
                        fill="currentColor"
                        fill-rule="nonzero" />
                      <path
                        d="M14,4.5 L14,3.5 C14,3.22385763 13.7761424,3 13.5,3 L10.5,3 C10.2238576,3 10,3.22385763 10,3.5 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z"
                        fill="currentColor"
                        opacity="0.5" />
                    </svg>
                  </span>
                  <span class="deletetooltiptext">{{ t("global.delete") }}</span>
                </button>
              </template>
            </data-table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import DataTable from "@/components/admin/data-table/index.vue"
import axiosClient from "@/plugins/axios"
import getMenuAbilities from "@/plugins/get-menu-abilities"
import arraySort from "array-sort"
import {computed, defineComponent, onBeforeMount, onMounted, provide, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import "primeicons/primeicons.css"

import {
  faCheckSquare,
  faWindowClose,
  faArrowAltCircleUp,
  faArrowAltCircleDown
} from "@fortawesome/free-solid-svg-icons"

export default defineComponent({
  name: "contents-list",
  components: {Toolbar, DataTable, FontAwesomeIcon},
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const languages = computed(() => store.state.languages)
    const languageId = ref(null)
    const lang = languages.value.find((element) => element.shortname === store.state.language)
    languageId.value = lang ? lang.id : null

    const path = computed(() => route.path)
    const abilities = ref({
      index: false,
      create: false,
      edit: false,
      destroy: false,
      show: false
    })
    const modals = ref({})
    const modalDetails = ref({})
    const groupClassModalDetails = ref({})

    const {userInfo} = store.state
    const userInfoObject = JSON.parse(userInfo)
    const userType = userInfoObject.user.type

    const {t} = useI18n()
    const loading = ref(false)
    const header = ref([
      {
        columnName: "#",
        columnLabel: "id",
        sortEnabled: true,
        columnWidth: 75
      },
      {
        columnName: t("global.name"),
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.title"),
        columnLabel: "title",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.classes"),
        columnLabel: "classes",
        sortEnabled: true,
        columnWidth: 100
      },
      userType !== 2 && {
        columnName: t("global.status"),
        columnLabel: "status",
        sortEnabled: true,
        columnWidth: 80
      },
      userType !== 2 && {
        columnName: t("global.have-exams"),
        columnLabel: "have_exams",
        sortEnabled: true,
        columnWidth: 175
      },
      {
        columnName: t("global.tutor-assigned"),
        columnLabel: "tutors",
        sortEnabled: false,
        columnWidth: 175
      },
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 175
      }
    ])

    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const initGroupClasses = ref([])
    const idsSelected = ref([])

    // Define variables and methods
    const showModal = ref(false)
    const selectedTutors = ref([])

    // Method to open the modal and pass tutors data
    const openModal = function openModal(groupClass) {
      axiosClient
        .get(`/group-classes/tutors/${groupClass.id}`)
        .then((response) => {
          selectedTutors.value = response.data.result.data
          // showModal.value = true
          modals.value = {...modals.value, [groupClass.id]: true}
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Error fetching tutors:", error)
        })
    }

    const showDetailsInTutor = function showDetailsInTutor(groupClass) {
      axiosClient
        .get(`/group-classes/tutors/${groupClass.id}`)
        .then((response) => {
          // selectedTutors.value = response.data.result.data
          modalDetails.value = {...modalDetails.value, [groupClass.id]: true}
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Error fetching tutors:", error)
        })
    }

    const showGroupClassDetails = function showGroupClassDetails(groupClass) {
      axiosClient
        .get(`/group-classes/details/${groupClass.id}`)
        .then((response) => {
          const {data} = response.data
          groupClassModalDetails.value = {
            ...groupClassModalDetails.value,
            [groupClass.id]: data // Store the entire group class details
          }
        })
        .catch((error) => {
          console.error("Error fetching group class details:", error)
        })
    }

    const closeGroupClassDetailsModal = function closeGroupClassDetailsModal(groupClass) {
      // showModal.value = false
      groupClassModalDetails.value = {...groupClassModalDetails.value, [groupClass.id]: false}
    }

    const toggleConferenceAttendance = function toggleConferenceAttendance(
      conference_id,
      student_id
    ) {
      try {
        const response = axiosClient.post("/conferences/toggle-conference-attendance", {
          conference_id,
          student_id
        })

        if (response.data.success) {
          // Find the conference and toggle is_taken
          this.groupClassModalDetails[this.groupClass.id].conferences.forEach((conference) => {
            if (conference.id === conference_id) {
              // Find the student and toggle is_taken
              conference.students.forEach((student) => {
                if (student.id === student_id) {
                  student.status = !student.status
                }
              })
            }
          })
        }
      } catch (error) {
        console.error("Error toggling attendance:", error)
      }
    }

    // Method to close the modal
    const closeModal = function closeModal(groupClass) {
      // showModal.value = false
      modals.value = {...modals.value, [groupClass.id]: false}
    }

    // Method to close the modal
    const closeDetailsInTutorModal = function closeDetailsInTutorModal(groupClass) {
      // showModal.value = false
      modalDetails.value = {...modalDetails.value, [groupClass.id]: false}
    }
    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      if (userType === 2) {
        axiosClient
          .get(`/group-classes/tutor-index${queryString}`)
          .then((response) => {
            data.value = response.data.result.data
            itemsTotal.value = response.data.result.total
            currentPage.value = response.data.result.current_page
            itemsPerPage.value = response.data.result.per_page
          })
          .finally(() => {
            loading.value = false
          })
      } else {
        axiosClient
          .get(`/group-classes${queryString}`)
          .then((response) => {
            data.value = response.data.result.data
            itemsTotal.value = response.data.result.total
            currentPage.value = response.data.result.current_page
            itemsPerPage.value = response.data.result.per_page
          })
          .finally(() => {
            loading.value = false
          })
      }
    }

    const assignTutor = function assignTutor(tutorId, groupClass) {
      const requestData = {
        tutor_id: tutorId,
        group_class_id: groupClass.id
      }

      axiosClient
        .post(`/group-classes/assign-tutor`, requestData)
        .then((response) => {
          // Handle success response here

          closeModal(groupClass)

          Swal.fire({
            icon: "success",
            text: t("global.tutor-assigned-successfully"),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })

          getDataTableBodyRows()
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {})
    }

    const gotoTutorInformation = (userId) => {
      // Navigate to the tutorInformation route with the user ID as a parameter
      router.push({name: "tutorInformation", params: {id: userId}})
    }

    const isTutorApplied = function isTutorApplied(appliedTutors, tutorId) {
      return appliedTutors?.some((tutor) => tutor.tutor_id === tutorId)
    }

    const currentSearchQuery = ref("")
    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      currentSearchQuery.value = e.target.value
      getDataTableBodyRows(`?q=${currentSearchQuery.value}`)
    }

    const registerGroupClass = function registerGroupClass(id) {
      loading.value = true
      axiosClient
        .post(`/group-classes/register-as-tutor/${id}`)
        .then(() => {
          getDataTableBodyRows()
          Swal.fire({
            icon: "success",
            text: t("global.course-registered-successfully"),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
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
          loading.value = false
        })
    }

    const unRegisterGroupClass = function unRegisterGroupClass(id) {
      loading.value = true
      axiosClient
        .post(`/group-classes/un-register-as-tutor/${id}`)
        .then(() => {
          getDataTableBodyRows()
          Swal.fire({
            icon: "success",
            text: t("global.group-class-un-registered-successfully"),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
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
          loading.value = false
        })
    }

    const unRegisterGroupClassTutor = function unRegisterGroupClassTutor(id) {
      loading.value = true
      axiosClient
        .post("/group-classes/un-assign-tutor", {group_class_id: id})
        .then(() => {
          getDataTableBodyRows()
          Swal.fire({
            icon: "success",
            text: t("global.group-class-un-registered-successfully"),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })
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
          loading.value = false
        })
    }

    const onSort = function onSort(sort) {
      const reverse = sort.order === "ASC".toLowerCase()
      if (sort.label) arraySort(data.value, sort.label, {reverse})
    }

    const onItemsSelect = function onItemsSelect(itemsSelected) {
      if (itemsSelected.length === 0) idsSelected.value = []
      else idsSelected.value = [...idsSelected.value, ...itemsSelected]
    }

    const deleteGroupClass = function deleteGroupClass(id) {
      console.log(id)
      Swal.fire({
        icon: "error",
        text: t("global.ensure-delete"),
        showCancelButton: true,
        confirmButtonText: t("global.yes-delete"),
        cancelButtonText: t("global.go-back"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-danger", cancelButton: "btn btn-active-light"}
      }).then((result) => {
        if (result.isConfirmed) {
          axiosClient.delete(`/group-classes/delete/${id}`).then(() => {
            Swal.fire({
              icon: "success",
              text: t("global.group-classes-deleted-successfully"),
              confirmButtonText: t("global.thank-you"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-primary"}
            })
            getDataTableBodyRows()
          })
        }
      })
    }

    const deleteFewGroupClasses = function deleteFewGroupClasses() {
      idsSelected.value.forEach((item) => {
        deleteGroupClass(item)
      })

      idsSelected.value.length = 0
    }
    const gotoUserInformation = function gotoUserInformation(userId) {
      // Navigate to the userInformation route with the user ID as a parameter
      router.push({name: "userInformation", params: {id: userId}})
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
      getMenuAbilities(path.value, abilities)
    })

    onMounted(() => {
      initGroupClasses.value.splice(0, data.value.length, ...data.value)
    })

    return {
      t,
      loading,
      header,
      data,
      abilities,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      currentSearchQuery,
      searchDataTableBodyRows,
      onSort,
      onItemsSelect,
      deleteGroupClass,
      deleteFewGroupClasses,
      userType,
      registerGroupClass,
      unRegisterGroupClass,
      unRegisterGroupClassTutor,
      openModal,
      closeModal,
      showModal,
      showDetailsInTutor,
      showGroupClassDetails,
      selectedTutors,
      userInfoObject,
      isTutorApplied,
      assignTutor,
      modals,
      modalDetails,
      groupClassModalDetails,
      closeDetailsInTutorModal,
      closeGroupClassDetailsModal,
      gotoUserInformation,
      gotoTutorInformation,
      toggleConferenceAttendance,
      faCheckSquare,
      faWindowClose,
      faArrowAltCircleUp,
      faArrowAltCircleDown,
      languageId
    }
  }
})
</script>
<style scoped>
/* Modal styles go here */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Change from 130% to 100% */
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: auto; /* Change from scroll to auto */
}

.modal-dialog {
  width: 90%;
}
.model-xl {
  width: 100%;
  max-width: 1000px;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh; /* Ensures the modal is not taller than the screen */
  overflow-y: auto; /* Enables scrolling inside the modal if content is too large */
  padding: 20px;
  border-radius: 10px;
  margin: 0 auto;
}

.detail-title {
  font-weight: bold;
}

.modal-content {
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.modal-title {
  margin: 0;
}

.modal-body {
  padding-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
}

.modal-dialog {
  max-width: 90% !important;
}
.custom-button:hover {
  background-color: #cce6ff; /* New background color on hover */
}

.custom-button:hover .custom-svg {
  fill: #ffffff; /* New SVG color on hover */
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #28a745;
}

input:checked + .slider:before {
  transform: translateX(18px);
}
</style>
