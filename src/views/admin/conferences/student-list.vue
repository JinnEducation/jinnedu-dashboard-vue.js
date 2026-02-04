<!-- DONE REVIEWING: 23/06/2023 -->
<template>
  <!-- MODAL -->
  <div id="kt_modal_add_reschedule" tabindex="-1" class="modal fade" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div id="kt_modal_add_reschedule_header" class="modal-header">
          <h2 class="fw-bold">
            {{ t("global.reschedule-conference") }}
          </h2>
          <div id="kt_modal_add_reschedule_close" data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary">
            <span class="svg-icon svg-icon-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                <rect x="6" y="17" rx="1" width="16" height="2" transform="rotate(-45 6 17)" fill="currentColor"
                  opacity="0.5"></rect>
                <rect x="7" y="6" rx="1" width="16" height="2" transform="rotate(45 7 6)" fill="currentColor"></rect>
              </svg>
            </span>
          </div>
        </div>
        <form id="kt_modal_add_reschedule_form" class="el-form el-form--default el-form--label-right form">
          <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <div id="kt_modal_add_reschedule_scroll" data-kt-scroll="true"
              data-kt-scroll-wrappers="#kt_modal_add_reschedule_scroll"
              data-kt-scroll-dependencies="#kt_modal_add_reschedule_header"
              data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
              data-kt-scroll-offset="300px" class="d-flex flex-column scroll-y me-n7 pe-7">
              <div class="d-flex flex-column mb-8 fv-row fv-plugins-icon-container">
                <label for="reschedule-date-input" class="d-flex align-items-center fs-6 fw-semibold mb-2">
                  <span class="required">{{ t("global.date") }}</span>
                </label>
                <input id="reschedule-date-input" type="datetime-local" class="form-control form-control-solid" />
                <div class="fv-plugins-message-container invalid-feedback"></div>
              </div>
            </div>
            <div class="text-center pt-15">
              <button type="button" data-bs-dismiss="modal" class="btn btn-light me-3">
                {{ t("global.discard") }}
              </button>
              <button type="submit" class="btn btn-primary" @click.prevent="handleRescheduleSubmit"
                @keypress="handleRescheduleSubmit">
                <span class="indicator-label">
                  {{ t("global.submit") }}
                  <span class="svg-icon svg-icon-3 ms-2 me-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                      <rect x="18" y="13" rx="1" width="13" height="2" transform="rotate(-180 18 13)"
                        fill="currentColor" opacity="0.5"></rect>
                      <path
                        d="M15.4343 12.5657L11.25 16.75C10.8358 17.1642 10.8358 17.8358 11.25 18.25C11.6642 18.6642 12.3358 18.6642 12.75 18.25L18.2929 12.7071C18.6834 12.3166 18.6834 11.6834 18.2929 11.2929L12.75 5.75C12.3358 5.33579 11.6642 5.33579 11.25 5.75C10.8358 6.16421 10.8358 6.83579 11.25 7.25L15.4343 11.4343C15.7467 11.7467 15.7467 12.2533 15.4343 12.5657Z"
                        fill="currentColor"></path>
                    </svg>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- MODAL -->
  <toolbar :title="t('global.student-conferences-management')" />
  <div class="app-content flex-column-fluid">
    <div class="app-container container-xxl">
      <div class="card">
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <span class="svg-icon svg-icon-1 position-absolute ms-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <rect x="17" y="15" rx="1" width="8" height="2" transform="rotate(45 17 15)" fill="currentColor"
                    opacity="0.5" />
                  <path
                    d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                    fill="currentColor" />
                </svg>
              </span>
              <label for="search-student-conferences" class="sr-only">
                {{ t("global.search-student-conferences") }}
              </label>
              <input id="search-student-conferences" type="text" name="search-conferences"
                :placeholder="t('global.search-student-conferences')" data-kt-item-table-filter="search"
                class="form-control form-control-solid w-250px ps-14" @keyup.enter="searchDataTableBodyRows" />
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
                  {{ t("global.no-conferences") }}
                </span>
              </p>
            </div>
            <div class="text-center px-5"></div>
          </div>
        </template>
        <template v-else>
          <div class="card-body py-4">
            <data-table :data="data" :header="header" :checkbox-enabled="true" checkbox-label="id"
              :items-total="itemsTotal" :page-current="currentPage" :items-per-page="itemsPerPage"
              :items-per-page-dropdown-enabled="true" @on-sort="onSort" @on-items-select="onItemsSelect">
              <template #title="{ row: conference }">
                <div v-if="conference.ref_type === 1">
                  <a class="text-danger" :href="`${baseUrl}/group-class/${conference.group_class?.slug}`">
                    {{ conference.title }}
                  </a>
                </div>
                <div v-else class="d-flex align-items-center justify-content-start">
                  <a class="text-danger" :href="`${baseUrl}/tutors/${conference.tutor?.slug}`">
                    {{ conference.title }}
                  </a>
                </div>
              </template>
              <template #ref_type="{ row: conference }">
                <span class="badge fs-7 m-1" :class="[
                  conference[['ref', 'type'].join('_')] === 1
                    ? 'badge-light-primary'
                    : conference[['ref', 'type'].join('_')] === 2
                      ? 'badge-light-success'
                      : 'badge-light-warning'
                ]">
                  {{
                    conference[["ref", "type"].join("_")] === 1
                      ? "Group Class"
                      : conference[["ref", "type"].join("_")] === 2
                        ? "Our Courses"
                        : "Trial Lesson"
                  }}
                </span>
              </template>
              <template #date="{ row: conference }">
                {{ conference.date }}
              </template>
              <template #start_time="{ row: conference }">
                {{ conference[["start", "time"].join("_")] }}
              </template>
              <template #end_time="{ row: conference }">
                {{ conference[["end", "time"].join("_")] }}
              </template>
              <template #tutor="{ row: conference }">
                <template v-if="conference.tutor && conference.tutor?.avatar">
                  <div class="symbol symbol-circle symbol-45px overflow-hidden me-3">
                    <div class="symbol-label">
                      <img :src="`${SERVER_PATH}/storage/${conference.tutor?.avatar}`" :alt="`${conference.tutor?.name}`"
                        class="w-100" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <template v-if="conference.tutor && conference.tutor?.name">
                    <div class="symbol symbol-circle symbol-50px overflow-hidden me-3"
                      style="background: url('/src/assets/media/svg/files/blank-image.svg')"
                      :title="`${conference.tutor?.name}`">
                      <div class="symbol-label fs-3 bg-light-warning text-warning">
                        {{ conference.tutor?.name?.charAt(0)?.toUpperCase() || '' }}
                      </div>
                    </div>
                  </template>
                </template>
              </template>
              <template #attendance="{ row: conference }">
                <span class="badge fs-7 m-1" :class="[
                  conference.attendance_status === true
                    ? 'badge-light-success'
                    : 'badge-light-warning'
                ]">
                  {{
                    conference.attendance_status === true
                      ? t("global.attended")
                      : t("global.not-attended")
                  }}
                </span>
              </template>
              <template v-if="abilities.createStudentLink ||
                abilities.addNote ||
                abilities.addReview ||
                abilities.addComplaint ||
                abilities.uploadFile
                " #actions="{ row: conference }">
                <button v-if="conference.ref_type !== 1" type="button" aria-label="Reschedule"
                  class="btn btn-icon btn-light-info me-2 rescheduletooltip"
                  @click="showRescheduleModal(conference.id)">
                  <span class="svg-icon svg-icon-info">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem">
                      <g fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <path
                          d="M10.9630156,7.5 L11.0475062,7.5 C11.3043819,7.5 11.5194647,7.69464724 11.5450248,7.95024814 L12,12.5 L15.2480695,14.3560397 C15.403857,14.4450611 15.5,14.6107328 15.5,14.7901613 L15.5,15 C15.5,15.2109164 15.3290185,15.3818979 15.1181021,15.3818979 C15.0841582,15.3818979 15.0503659,15.3773725 15.0176181,15.3684413 L10.3986612,14.1087258 C10.1672824,14.0456225 10.0132986,13.8271186 10.0316926,13.5879956 L10.4644883,7.96165175 C10.4845267,7.70115317 10.7017474,7.5 10.9630156,7.5 Z"
                          fill="currentColor" />
                        <path
                          d="M7.38979581,2.8349582 C8.65216735,2.29743306 10.0413491,2 11.5,2 C17.2989899,2 22,6.70101013 22,12.5 C22,18.2989899 17.2989899,23 11.5,23 C5.70101013,23 1,18.2989899 1,12.5 C1,11.5151324 1.13559454,10.5619345 1.38913364,9.65805651 L3.31481075,10.1982117 C3.10672013,10.940064 3,11.7119264 3,12.5 C3,17.1944204 6.80557963,21 11.5,21 C16.1944204,21 20,17.1944204 20,12.5 C20,7.80557963 16.1944204,4 11.5,4 C10.54876,4 9.62236069,4.15592757 8.74872191,4.45446326 L9.93948308,5.87355717 C10.0088058,5.95617272 10.0495583,6.05898805 10.05566,6.16666224 C10.0712834,6.4423623 9.86044965,6.67852665 9.5847496,6.69415008 L4.71777931,6.96995273 C4.66931162,6.97269931 4.62070229,6.96837279 4.57348157,6.95710938 C4.30487471,6.89303938 4.13906482,6.62335149 4.20313482,6.35474463 L5.33163823,1.62361064 C5.35654118,1.51920756 5.41437908,1.4255891 5.49660017,1.35659741 C5.7081375,1.17909652 6.0235153,1.2066885 6.2010162,1.41822583 L7.38979581,2.8349582 Z"
                          fill="currentColor" opacity="0.5" />
                      </g>
                    </svg>
                    <span class="rescheduletooltiptext">{{ t("global.reschedule") }}</span>
                  </span>
                </button>
                <button v-if="!conference.meet_url && !conference.is_end && conference.is_available" type="button"
                  aria-label="Create Link" class="btn btn-icon btn-light-success me-2"
                  @click="getConferenceLink(conference.id)">
                  <span class="svg-icon svg-icon-primary">
                    <svg v-if="loadingMeetUrl === conference.id" id="L9" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                      viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve"
                      style="width: 4rem; height: 4rem">
                      <path fill="#fff"
                        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s"
                          from="0 50 50" to="360 50 50" repeatCount="indefinite" />
                      </path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      style="width: 1.5rem; height: 1.5rem">
                      <rect x="2" y="6" rx="2" width="13" height="12" fill="currentColor" />
                      <path
                        d="M22,8.4142119 L22,15.5857848 C22,16.1380695 21.5522847,16.5857848 21,16.5857848 C20.7347833,16.5857848 20.4804293,16.4804278 20.2928929,16.2928912 L16.7071064,12.7071013 C16.3165823,12.3165768 16.3165826,11.6834118 16.7071071,11.2928877 L20.2928936,7.70710477 C20.683418,7.31658067 21.316583,7.31658098 21.7071071,7.70710546 C21.8946433,7.89464181 22,8.14899558 22,8.4142119 Z"
                        fill="currentColor" opacity="0.5" />
                    </svg>
                  </span>
                </button>

                <a v-if="conference.meet_url && !conference.is_end" :href="conference.meet_url" aria-label="Create Link"
                  target="_blank" class="btn btn-icon btn-light-primary me-2">
                  <span class="svg-icon svg-icon-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem">
                      <rect x="2" y="6" rx="2" width="13" height="12" fill="currentColor" />
                      <path
                        d="M22,8.4142119 L22,15.5857848 C22,16.1380695 21.5522847,16.5857848 21,16.5857848 C20.7347833,16.5857848 20.4804293,16.4804278 20.2928929,16.2928912 L16.7071064,12.7071013 C16.3165823,12.3165768 16.3165826,11.6834118 16.7071071,11.2928877 L20.2928936,7.70710477 C20.683418,7.31658067 21.316583,7.31658098 21.7071071,7.70710546 C21.8946433,7.89464181 22,8.14899558 22,8.4142119 Z"
                        fill="currentColor" opacity="0.5" />
                    </svg>
                  </span>
                </a>

                <router-link v-show="abilities.addNote" :to="`/dashboard/conferences/${conference.id}/notes`"
                  aria-label="Add Note" class="btn btn-icon btn-light-primary me-2 notestooltip">
                  <span class="svg-icon svg-icon-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.75rem; height: 1.75rem">
                      <g fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <path
                          d="M3,16 L5,16 C5.55228475,16 6,15.5522847 6,15 C6,14.4477153 5.55228475,14 5,14 L3,14 L3,12 L5,12 C5.55228475,12 6,11.5522847 6,11 C6,10.4477153 5.55228475,10 5,10 L3,10 L3,8 L5,8 C5.55228475,8 6,7.55228475 6,7 C6,6.44771525 5.55228475,6 5,6 L3,6 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 C10.5522847,3 11,3.44771525 11,4 L11,19 C11,19.5522847 10.5522847,20 10,20 L4,20 C3.44771525,20 3,19.5522847 3,19 L3,16 Z"
                          fill="currentColor" opacity="0.5" />
                        <path
                          d="M16,3 L19,3 C20.1045695,3 21,3.8954305 21,5 L21,15.2485298 C21,15.7329761 20.8241635,16.200956 20.5051534,16.565539 L17.8762883,19.5699562 C17.6944473,19.7777745 17.378566,19.7988332 17.1707477,19.6169922 C17.1540423,19.602375 17.1383289,19.5866616 17.1237117,19.5699562 L14.4948466,16.565539 C14.1758365,16.200956 14,15.7329761 14,15.2485298 L14,5 C14,3.8954305 14.8954305,3 16,3 Z"
                          fill="currentColor" />
                      </g>
                    </svg>
                    <span class="notestooltiptext">{{ t("global.notes") }}</span>
                  </span>
                </router-link>
                <router-link v-show="abilities.addReview" :to="`/dashboard/conferences/${conference.id}/reviews`"
                  aria-label="Create Link" class="btn btn-icon btn-light-success me-2 reviewstooltip">
                  <span class="svg-icon svg-icon-success">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.75rem; height: 1.75rem">
                      <g fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24" />
                        <path
                          d="M12,4.25932872 C12.1488635,4.25921584 12.3000368,4.29247316 12.4425657,4.36281539 C12.6397783,4.46014562 12.7994058,4.61977315 12.8967361,4.81698575 L14.9389263,8.95491503 L19.5054023,9.61846284 C20.0519472,9.69788046 20.4306287,10.2053233 20.351211,10.7518682 C20.3195865,10.9695052 20.2170993,11.1706476 20.0596157,11.3241562 L16.7552826,14.545085 L17.5353298,19.0931094 C17.6286908,19.6374458 17.263103,20.1544017 16.7187666,20.2477627 C16.5020089,20.2849396 16.2790408,20.2496249 16.0843804,20.1472858 L12,18 L12,4.25932872 Z"
                          fill="currentColor" opacity="0.5" />
                        <path
                          d="M12,4.25932872 L12,18 L7.91561963,20.1472858 C7.42677504,20.4042866 6.82214789,20.2163401 6.56514708,19.7274955 C6.46280801,19.5328351 6.42749334,19.309867 6.46467018,19.0931094 L7.24471742,14.545085 L3.94038429,11.3241562 C3.54490071,10.938655 3.5368084,10.3055417 3.92230962,9.91005817 C4.07581822,9.75257453 4.27696063,9.65008735 4.49459766,9.61846284 L9.06107374,8.95491503 L11.1032639,4.81698575 C11.277344,4.464261 11.6315987,4.25960807 12,4.25932872 Z"
                          fill="currentColor" />
                      </g>
                    </svg>
                    <span class="reviewstooltiptext">{{ t("global.reviews") }}</span>
                  </span>
                </router-link>
                <router-link v-show="abilities.addComplaint" :to="`/dashboard/conferences/${conference.id}/complaints`"
                  aria-label="Create Link" class="btn btn-icon btn-light-warning me-2 complaintstooltip">
                  <span class="svg-icon svg-icon-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.75rem; height: 1.75rem">
                      <g fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <rect x="2" y="2" rx="10" width="20" height="20" fill="currentColor" opacity="0.25" />
                        <path
                          d="M6.16794971,14.5547002 C5.86159725,14.0951715 5.98577112,13.4743022 6.4452998,13.1679497 C6.90482849,12.8615972 7.52569784,12.9857711 7.83205029,13.4452998 C8.9890854,15.1808525 10.3543313,16 12,16 C13.6456687,16 15.0109146,15.1808525 16.1679497,13.4452998 C16.4743022,12.9857711 17.0951715,12.8615972 17.5547002,13.1679497 C18.0142289,13.4743022 18.1384028,14.0951715 17.8320503,14.5547002 C16.3224187,16.8191475 14.3543313,18 12,18 C9.64566871,18 7.67758127,16.8191475 6.16794971,14.5547002 Z"
                          fill="currentColor" transform="translate(12, 15) scale(1, -1) translate(-12, -15)" />
                      </g>
                    </svg>
                    <span class="complaintstooltiptext">{{ t("global.compaints") }}</span>
                  </span>
                </router-link>
                <router-link v-show="abilities.uploadFile" :to="`/dashboard/conferences/${conference.id}/files`"
                  aria-label="Upload File" class="btn btn-icon btn-light-danger me-2">
                  <span class="svg-icon svg-icon-primary filestooltip">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem">
                      <g fill="none" fill-rule="evenodd">
                        <rect x="0" y="0" width="24" height="24" />
                        <path
                          d="M2,13 C2,12.5 2.5,12 3,12 C3.5,12 4,12.5 4,13 C4,13.3333333 4,15 4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 C2,15 2,13.3333333 2,13 Z"
                          fill="currentColor" fill-rule="nonzero" opacity="0.5" />
                        <rect x="11" y="2" rx="1" width="2" height="14" fill="currentColor" opacity="0.5" />
                        <path
                          d="M12.0362375,3.37797611 L7.70710678,7.70710678 C7.31658249,8.09763107 6.68341751,8.09763107 6.29289322,7.70710678 C5.90236893,7.31658249 5.90236893,6.68341751 6.29289322,6.29289322 L11.2928932,1.29289322 C11.6689749,0.916811528 12.2736364,0.900910387 12.6689647,1.25670585 L17.6689647,5.75670585 C18.0794748,6.12616487 18.1127532,6.75845471 17.7432941,7.16896473 C17.3738351,7.57947475 16.7415453,7.61275317 16.3310353,7.24329415 L12.0362375,3.37797611 Z"
                          fill="currentColor" fill-rule="nonzero" />
                      </g>
                    </svg>
                    <span class="filestooltiptext">{{ t("global.files") }}</span>
                  </span>
                </router-link>
                <button v-show="abilities.destroy" type="button" aria-label="Delete"
                  class="btn btn-icon btn-light-danger deletetooltip" @click="deleteItem(conference.id)">
                  <span class="svg-icon svg-icon-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem">
                      <path
                        d="M6,8 L18,8 L17.106535,19.6150447 C17.04642,20.3965405 16.3947578,21 15.6109533,21 L8.38904671,21 C7.60524225,21 6.95358004,20.3965405 6.89346498,19.6150447 L6,8 Z M8,10 L8.45438229,14.0894406 L15.5517885,14.0339036 L16,10 L8,10 Z"
                        fill="currentColor" fill-rule="nonzero" />
                      <path
                        d="M14,4.5 L14,3.5 C14,3.22385763 13.7761424,3 13.5,3 L10.5,3 C10.2238576,3 10,3.22385763 10,3.5 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z"
                        fill="currentColor" opacity="0.5" />
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
import { computed, defineComponent, onBeforeMount, onMounted, provide, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { hideModal, showModal } from "../../../core/helpers/dom"

export default defineComponent({
  name: "student-conferences",
  components: { Toolbar, DataTable },
  setup() {
    const route = useRoute()
    const baseUrl = import.meta.env.VITE_APP_BASE_URL
    const loadingMeetUrl = ref(null)
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)
    const path = computed(() => route.path)
    const abilities = ref({
      index: false,
      create: false,
      edit: false,
      destroy: false,
      show: false,
      createStudentLink: false,
      addNote: false,
      addReview: false,
      addComplaint: false,
      uploadFile: false
    })

    const { t } = useI18n()
    const loading = ref(false)
    const header = ref([
      {
        columnName: t("global.conference_title"),
        columnLabel: "title",
        sortEnabled: false,
        columnWidth: 195
      },
      { columnName: t("global.type"), columnLabel: "ref_type", sortEnabled: false, columnWidth: 135 },
      { columnName: t("global.date"), columnLabel: "date", sortEnabled: false, columnWidth: 135 },
      {
        columnName: t("global.start-time"),
        columnLabel: "start_time",
        sortEnabled: false,
        columnWidth: 100
      },
      {
        columnName: t("global.end-time"),
        columnLabel: "end_time",
        sortEnabled: false,
        columnWidth: 100
      },
      { columnName: t("global.tutor"), columnLabel: "tutor", sortEnabled: false, columnWidth: 135 },
      {
        columnName: t("global.attendance"),
        columnLabel: "attendance",
        sortEnabled: false,
        columnWidth: 135
      },

      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 250
      }
    ])

    const data = ref([])
    const itemsTotal = ref(0)
    const currentPage = ref(0)
    const itemsPerPage = ref(0)
    const initItems = ref([])
    const idsSelected = ref([])

    const getDataTableBodyRows = function getDataTableBodyRows(queryString = "") {
      loading.value = true
      axiosClient
        .get(`/conferences/student-index${queryString}`)
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

    const searchDataTableBodyRows = function searchDataTableBodyRows(e) {
      getDataTableBodyRows(["?", ["q", e.target.value].join("=")].join(""))
    }

    const onSort = function onSort(sort) {
      const reverse = sort.order === "ASC".toLowerCase()
      if (sort.label) arraySort(data.value, sort.label, { reverse })
    }

    const onItemsSelect = function onItemsSelect(itemsSelected) {
      if (itemsSelected.length === 0) idsSelected.value = []
      else idsSelected.value = [...idsSelected.value, ...itemsSelected]
    }

    const deleteItem = function deleteItem(id) {
      Swal.fire({
        icon: "error",
        text: t("global.ensure-delete"),
        showCancelButton: true,
        confirmButtonText: t("global.yes-delete"),
        cancelButtonText: t("global.go-back"),
        buttonsStyling: false,
        customClass: { confirmButton: "btn btn-danger", cancelButton: "btn btn-active-light" }
      }).then((result) => {
        if (result.isConfirmed) {
          axiosClient.delete(`/conferences/delete/${id}`).then(() => {
            getDataTableBodyRows()
          })
        }
      })
    }

    const getConferenceLink = function getConferenceLink(id) {
      loadingMeetUrl.value = id
      axiosClient.get(`/conferences/create-student-link/${id}`).then((response) => {
        // let link = null
        // if (!response.data.success) {
        //   Swal.fire(response.data.message, "", "info")
        //   loadingMeetUrl.value = null
        // } else {
        //   link = JSON.parse(response.data.result.response)
        //   window.open(link.meet_url, "_blank")
        // }
        // loadingMeetUrl.value = null
        const Response = JSON.parse(response.data.result.response)

        if (Response.status === "error") {
          // Handle the case where the class has ended
          Swal.fire(Response.error, "", "error")
          loadingMeetUrl.value = false
        } else {
          // Open the meet_url only if the class hasn't ended
          window.open(Response.data ? Response.data.join_url : Response.data.start_url, "_blank")
          // eslint-disable-next-line no-use-before-define
          getDataTableBodyRows()
        }
      })
    }

    const deleteFewItems = function deleteFewItems() {
      idsSelected.value.forEach((item) => {
        deleteItem(item)
      })

      idsSelected.value.length = 0
    }

    const showRescheduleModal = function showRescheduleModal(id) {
      document.querySelector("#kt_modal_add_reschedule").setAttribute("data-conference-id", id)
      showModal(document.querySelector("#kt_modal_add_reschedule"))
    }

    const handleRescheduleSubmit = function handleRescheduleSubmit() {
      axiosClient
        .post(
          `/conferences/student-change-date/${document
            .querySelector("#kt_modal_add_reschedule")
            .getAttribute("data-conference-id")}`,
          { date: document.querySelector("#reschedule-date-input").value.split("T").join(" ") }
        )
        .then((response) => {
          if (response.data["msg-code"] === "111") {
            Swal.fire({
              icon: "error",
              text: response.data.message,
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: { confirmButton: "btn btn-danger" }
            })
          } else {
            Swal.fire({
              icon: "success",
              text: t("global.email-sent"),
              confirmButtonText: t("global.thank-you"),
              buttonsStyling: false,
              customClass: { confirmButton: "btn btn-primary" }
            }).then((result) => {
              if (result.isConfirmed) {
                hideModal(document.querySelector("#kt_modal_add_reschedule"))
              }
            })
          }
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            text: t("global.errors-detected"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: { confirmButton: "btn btn-danger" }
          })
        })
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)
    onBeforeMount(() => {
      data.value = []
      loading.value = false
      getDataTableBodyRows()
      getMenuAbilities(path.value, abilities)
    })

    onMounted(() => {
      initItems.value.splice(0, data.value.length, ...data.value)
    })

    return {
      SERVER_PATH,
      t,
      loading,
      header,
      data,
      itemsTotal,
      currentPage,
      itemsPerPage,
      idsSelected,
      abilities,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      onSort,
      onItemsSelect,
      getConferenceLink,
      deleteItem,
      deleteFewItems,
      showRescheduleModal,
      handleRescheduleSubmit,
      loadingMeetUrl,
      baseUrl
    }
  }
})
</script>
