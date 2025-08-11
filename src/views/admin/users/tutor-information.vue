<template>
  <toolbar :title="t('global.tutor-information')" />
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <div id="kt_app_content_container" class="app-container container-xxl">
      <div class="card card-xl-stretch mb-5 mb-xl-7">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-dark">{{
              t("global.account-overview-title")
            }}</span>
          </h3>
        </div>
        <div class="card-body pt-5">
          <div class="row">
            <div class="col-md-3">
              <div class="card-body pt-9 pb-0">
                <div v-if="!loading" class="d-flex flex-wrap flex-sm-nowrap mb-6">
                  <div
                    class="d-flex flex-center flex-shrink-0 bg-light rounded w-100px h-100px w-lg-150px h-lg-150px me-7 mb-4 overflow-hidden">
                    <img
                      v-if="profile.avatar"
                      :src="SERVER_PATH + '/' + profile.avatar"
                      :alt="profile.abouts[0]?.first_name"
                      class="w-100" />
                    <span
                      v-else
                      class="w-100 h-100 d-flex justify-content-center align-items-center symbol-label bg-light-warning text-warning fs-1 fw-bold">
                      {{ profile.abouts[0]?.first_name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div v-if="!loading">
                <h3 class="card-title align-items-start flex-column">
                  <span class="card-label fw-bold text-dark">{{ t("global.personal-info") }}</span>
                </h3>
                <template v-if="profile.abouts[0]">
                  <p>
                    <strong>{{ t("global.first-name") }}:</strong>
                    {{ profile.abouts[0]?.first_name }}
                  </p>
                  <p>
                    <strong>{{ t("global.last-name") }}:</strong>
                    {{ profile.abouts[0]?.last_name }}
                  </p>
                  <p>
                    <strong>{{ t("global.phone") }}:</strong>
                    {{ profile.abouts[0]?.phone }}
                  </p>
                  <p>
                    <strong>{{ t("global.age") }}:</strong>
                    {{ profile.abouts[0]?.age }}
                  </p>
                  <p>
                    <strong>{{ t("global.country") }}:</strong>
                    {{ profile.abouts[0]?.country.name }}
                  </p>
                  <p>
                    <strong>{{ t("global.last-online-date") }}:</strong>
                    {{ profile.last_online_date }}
                  </p>
                  <p>
                    <strong>{{ t("global.status") }}:</strong>
                    {{ profile.abouts[0]?.online == 1 ? t("global.online") : t("global.offline") }}
                  </p>
                </template>
                <template v-else>
                  <p>
                    <strong>{{ t("global.name") }}:</strong> {{ profile.name }}
                  </p>
                  <p>
                    <strong>{{ t("global.email") }}:</strong> {{ profile.email }}
                  </p>
                </template>
              </div>
              <div v-else>
                <p>{{ t("global.loading") }}...</p>
              </div>
            </div>

            <div class="col-md-3">
              <div v-if="!loading">
                <h3 class="card-title align-items-start flex-column">
                  <span class="card-label fw-bold text-dark">{{
                    t("global.specialization-info")
                  }}</span>
                </h3>
                <template v-if="profile.abouts[0]">
                  <p>
                    <strong>{{ t("global.subject") }}:</strong>
                    {{ profile.abouts[0] ? profile.abouts[0]?.subject.name : "" }}
                  </p>
                  <p>
                    <strong>{{ t("global.language") }}:</strong>
                    {{ profile.abouts[0] ? profile.abouts[0]?.language.name : "" }}
                  </p>
                  <p>
                    <strong>{{ t("global.experience") }}:</strong>
                    {{ profile.abouts[0] ? profile.abouts[0]?.experience.name : "" }}
                  </p>
                </template>
              </div>
              <div v-else>
                <p>{{ t("global.loading") }}...</p>
              </div>
            </div>

            <div class="col-md-2">
              <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-dark">{{ t("global.financial-info") }}</span>
              </h3>
              <template v-if="financial">
                <p>
                  <strong>{{ t("global.balance") }}:</strong>
                  {{ financial ? financial.balance : "" }}
                </p>
                <p>
                  <strong>{{ t("global.group-classes-count") }}:</strong>
                  {{ financial ? financial.group_class_count : "" }}
                </p>
                <p>
                  <strong>{{ t("global.trial-lesson-count") }}:</strong>
                  {{ financial ? financial.trial_lesson_count : "" }}
                </p>
                <p>
                  <strong>{{ t("global.private-lesson-count") }}:</strong>
                  {{ financial ? financial.private_lesson_count : "" }}
                </p>
                <p>
                  <strong>{{ t("global.package-count") }}:</strong>
                  {{ financial ? financial.package_count : "" }}
                </p>
              </template>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="nav nav-line-tabs d-flex" style="width: 50%; padding: 20px">
            <!-- <template v-for="type in orderTypes" :key="type">
              <li class="nav-item">
                <a
                  class="nav-link p-3"
                  :class="{active: selectedType === type}"
                  @click="handleTabChange(type)">
                  {{ type }}
                </a>
              </li>
            </template> -->
            <select
              v-model="selectedType"
              class="form-select"
              @change="handleTabChange($event.target.value)">
              <option v-for="type in orderTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
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
          <template v-if="groupClassData.length === 0 && selectedType === 'Completed Group Class'">
            <div class="card-body p-0">
              <div class="card-px text-center py-20 my-10">
                <h2 class="fs-2x fw-bold mb-10">{{ t("global.welcome") }}</h2>
                <p class="text-gray-400 fs-5 fw-semibold mb-13">
                  <span>
                    {{ t("global.no-group-class") }}
                  </span>
                </p>
              </div>
              <div class="text-center px-5"></div>
            </div>
          </template>
          <template
            v-if="privateLessonData.length === 0 && selectedType === 'Completed Private Lesson'">
            <div class="card-body p-0">
              <div class="card-px text-center py-20 my-10">
                <h2 class="fs-2x fw-bold mb-10">{{ t("global.welcome") }}</h2>
                <p class="text-gray-400 fs-5 fw-semibold mb-13">
                  <span>
                    {{ t("global.no-private-lesson") }}
                  </span>
                </p>
              </div>
              <div class="text-center px-5"></div>
            </div>
          </template>
          <template v-else>
            <div class="card-body py-4">
              <div class="tab-content">
                <template v-for="type in orderTypes" :key="type">
                  <div
                    :id="`${type.toLowerCase().replace(/\s/g, '-')}-tab-content`"
                    class="tab-pane"
                    :class="{active: selectedType === type}">
                    <!-- Private Lesson -->
                    <data-table
                      v-if="selectedType === 'Completed Private Lesson'"
                      :data="privateLessonData"
                      :header="privateLessonHeader"
                      :checkbox-enabled="true"
                      checkbox-label="id"
                      :items-total="privateLessonItemsTotal"
                      :page-current="privateLessonCurrentPage"
                      :items-per-page="privateLessonItemsPerPage"
                      :items-per-page-dropdown-enabled="true">
                      <template #extra="{row: privateLesson}">
                        <button
                          type="button"
                          class="btn btn-light-primary"
                          @click="openPrivateLessonModal(privateLesson)">
                          {{ t("global.conferences") }}
                        </button>

                        <template v-if="privateLessonModals[privateLesson.id]">
                          <div class="modal">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <!-- Modal header -->
                                <div class="modal-header">
                                  <h5 class="modal-title">{{ t("global.conferences") }}</h5>
                                  <button
                                    type="button"
                                    class="btn-close"
                                    aria-label="Close"
                                    @click="closePrivateLessonModal(privateLesson)"></button>
                                </div>
                                <!-- Modal body -->
                                <div class="modal-body">
                                  <table style="text-align: left; width: 100%">
                                    <thead>
                                      <tr>
                                        <th class="p-2 text-primary">{{ t("global.id") }}</th>
                                        <th class="p-2 text-primary">{{ t("global.title") }}</th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.start-time") }}
                                        </th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.end-time") }}
                                        </th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.complaint") }}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr
                                        v-if="privateLesson.conference"
                                        :class="{'has-complaint': privateLesson.hasComplaint}">
                                        <td class="p-2">
                                          {{ privateLesson.conference.id }}
                                        </td>
                                        <td class="p-2">
                                          {{ privateLesson.conference.title }}
                                        </td>
                                        <td class="p-2">
                                          {{ privateLesson.conference.start_time }}
                                        </td>
                                        <td class="p-2">
                                          {{ privateLesson.conference.end_time }}
                                        </td>
                                        <td class="p-2">
                                          <button
                                            v-if="privateLesson.hasComplaint"
                                            type="button"
                                            class="btn btn-light-primary"
                                            @click="
                                              navigateToComplaints(privateLesson.conference.id)
                                            ">
                                            {{ t("global.complaint") }}
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
                                    @click="closePrivateLessonModal(privateLesson)">
                                    {{ t("global.close") }}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </template>
                      <template #id="{row: privateLesson}">
                        <!-- {{ data.indexOf(order) + 1 }} -->
                        {{ privateLesson.id }}
                      </template>
                      <template #student="{row: privateLesson}">
                        {{ privateLesson.student.name }}
                      </template>
                      <template #price="{row: privateLesson}">
                        {{ privateLesson.price }}
                      </template>
                      <template #tutor_percentage="{row: privateLesson}">
                        {{ privateLesson.tutor_precentage }}
                      </template>
                      <template #fee="{row: privateLesson}">
                        {{ privateLesson.fee }}
                      </template>
                    </data-table>

                    <!-- not Private Lesson -->
                    <data-table
                      v-if="selectedType === 'Not Completed Private Lesson'"
                      :data="notCompletedPrivateLessonData"
                      :header="privateLessonHeader"
                      :checkbox-enabled="true"
                      checkbox-label="id"
                      :items-total="notCompletedPrivateLessonItemsTotal"
                      :page-current="notCompletedPrivateLessonCurrentPage"
                      :items-per-page="notCompletedPrivateLessonItemsPerPage"
                      :items-per-page-dropdown-enabled="true">
                      <template #extra="{row: privateLesson}">
                        <button
                          type="button"
                          class="btn btn-light-primary"
                          @click="openPrivateLessonModal(privateLesson)">
                          {{ t("global.conferences") }}
                        </button>

                        <template v-if="privateLessonModals[privateLesson.id]">
                          <div class="modal">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <!-- Modal header -->
                                <div class="modal-header">
                                  <h5 class="modal-title">{{ t("global.conferences") }}</h5>
                                  <button
                                    type="button"
                                    class="btn-close"
                                    aria-label="Close"
                                    @click="closePrivateLessonModal(privateLesson)"></button>
                                </div>
                                <!-- Modal body -->
                                <div class="modal-body">
                                  <table style="text-align: left; width: 100%">
                                    <thead>
                                      <tr>
                                        <th class="p-2 text-primary">{{ t("global.id") }}</th>
                                        <th class="p-2 text-primary">{{ t("global.title") }}</th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.start_time") }}
                                        </th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.end-time") }}
                                        </th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.complaint") }}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr
                                        v-if="privateLesson.conference"
                                        :class="{'has-complaint': privateLesson.hasComplaint}">
                                        <td class="p-2">
                                          {{ privateLesson.conference.id }}
                                        </td>
                                        <td class="p-2">
                                          {{ privateLesson.conference.title }}
                                        </td>
                                        <td class="p-2">
                                          {{ privateLesson.conference.start_time }}
                                        </td>
                                        <td class="p-2">
                                          {{ privateLesson.conference.end_time }}
                                        </td>
                                        <td class="p-2">
                                          <button
                                            v-if="privateLesson.hasComplaint"
                                            type="button"
                                            class="btn btn-light-primary"
                                            @click="
                                              navigateToComplaints(privateLesson.conference.id)
                                            ">
                                            {{ t("global.complaint") }}
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
                                    @click="closePrivateLessonModal(privateLesson)">
                                    {{ t("global.close") }}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </template>
                      <template #id="{row: privateLesson}">
                        {{ privateLesson.id }}
                      </template>
                      <template #student="{row: privateLesson}">
                        {{ privateLesson.student.name }}
                      </template>
                      <template #price="{row: privateLesson}">
                        {{ privateLesson.price }}
                      </template>
                      <template #tutor_percentage="{row: privateLesson}">
                        {{ privateLesson.tutor_precentage }}
                      </template>
                      <template #fee="{row: privateLesson}">
                        {{ privateLesson.fee }}
                      </template>
                    </data-table>

                    <!-- completed group classes -->
                    <data-table
                      v-if="selectedType === 'Completed Group Class'"
                      :data="groupClassData"
                      :header="groupClassHeader"
                      :checkbox-enabled="true"
                      checkbox-label="id"
                      :items-total="groupClassItemsTotal"
                      :page-current="groupClassCurrentPage"
                      :items-per-page="groupClassItemsPerPage"
                      :items-per-page-dropdown-enabled="true">
                      <template #extra="{row: groupClass}">
                        <button
                          type="button"
                          class="btn btn-light-primary"
                          @click="openGroupClassModal(groupClass)">
                          {{ t("global.conferences") }}
                        </button>

                        <template v-if="groupClassModals[groupClass.id]">
                          <div class="modal">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <!-- Modal header -->
                                <div class="modal-header">
                                  <h5 class="modal-title">{{ t("global.conferences") }}</h5>
                                  <button
                                    type="button"
                                    class="btn-close"
                                    aria-label="Close"
                                    @click="closeGroupClassModal(groupClass)"></button>
                                </div>
                                <!-- Modal body -->
                                <div class="modal-body">
                                  <table style="text-align: left; width: 100%">
                                    <thead>
                                      <tr>
                                        <th class="p-2 text-primary">{{ t("global.id") }}</th>
                                        <th class="p-2 text-primary">{{ t("global.title") }}</th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.start-time") }}
                                        </th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.end-time") }}
                                        </th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.complaint") }}
                                        </th>

                                        <th class="p-2 text-primary">
                                          {{ t("global.fee-transfer") }}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr
                                        v-for="conference in groupClass.conferences"
                                        :key="conference.id"
                                        :class="{'has-complaint': groupClass.hasComplaint}">
                                        <td class="p-2">
                                          {{ conference.id }}
                                        </td>
                                        <td class="p-2">
                                          {{ conference.title }}
                                        </td>
                                        <td class="p-2">
                                          {{ conference.start_time }}
                                        </td>
                                        <td class="p-2">
                                          {{ conference.end_time }}
                                        </td>
                                        <td class="p-2">
                                          <button
                                            v-if="conference.hasComplaint"
                                            type="button"
                                            class="btn btn-light-primary"
                                            @click="navigateToComplaints(conference.id)">
                                            {{ t("global.complaint") }}
                                          </button>
                                        </td>

                                        <td class="p-2">
                                          <button
                                            v-if="!conference.feesTransferred"
                                            type="button"
                                            class="btn btn-light-warning"
                                            @click="feeTransfer(conference.id)">
                                            {{ t("global.fee-transfer") }}
                                          </button>
                                          <div v-else class="bg-success text-white p-4">
                                            {{ t("global.transfered") }}
                                          </div>
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
                                    @click="closeGroupClassModal(groupClass)">
                                    {{ t("global.close") }}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </template>
                      <template #id="{row: groupClass}">
                        {{ groupClass.id }}
                      </template>
                      <template #name="{row: groupClass}">
                        {{ groupClass.name }}
                      </template>
                      <template #classes="{row: groupClass}">
                        {{ groupClass.classes }}
                      </template>
                      <template #price="{row: groupClass}">
                        {{ groupClass.price }}
                      </template>
                      <template #tutor_percentage="{row: groupClass}">
                        {{ groupClass.tutor_precentage }}
                      </template>
                      <template #fee="{row: groupClass}">
                        {{ groupClass.fee }}
                      </template>
                      <template #students="{row: groupClass}">
                        {{ groupClass.students }}
                      </template>
                    </data-table>

                    <!-- not completed group classes -->
                    <data-table
                      v-if="selectedType === 'Not Completed Group Class'"
                      :data="notCompletedGroupClassData"
                      :header="groupClassHeader"
                      :checkbox-enabled="true"
                      checkbox-label="id"
                      :items-total="notCompletedGroupClassItemsTotal"
                      :page-current="notCompletedGroupClassCurrentPage"
                      :items-per-page="notCompletedGroupClassItemsPerPage"
                      :items-per-page-dropdown-enabled="true">
                      <template #extra="{row: groupClass}">
                        <button
                          type="button"
                          class="btn btn-light-primary"
                          @click="openGroupClassModal(groupClass)">
                          {{ t("global.conferences") }}
                        </button>

                        <template v-if="groupClassModals[groupClass.id]">
                          <div class="modal">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <!-- Modal header -->
                                <div class="modal-header">
                                  <h5 class="modal-title">{{ t("global.conferences") }}</h5>
                                  <button
                                    type="button"
                                    class="btn-close"
                                    aria-label="Close"
                                    @click="closeGroupClassModal(groupClass)"></button>
                                </div>
                                <!-- Modal body -->
                                <div class="modal-body">
                                  <table style="text-align: left; width: 100%">
                                    <thead>
                                      <tr>
                                        <th class="p-2 text-primary">{{ t("global.id") }}</th>
                                        <th class="p-2 text-primary">{{ t("global.title") }}</th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.start-time") }}
                                        </th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.end-time") }}
                                        </th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.complaint") }}
                                        </th>
                                        <th class="p-2 text-primary">
                                          {{ t("global.fee-transfer") }}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr
                                        v-for="conference in groupClass.conferences"
                                        :key="conference.id"
                                        :class="{'has-complaint': groupClass.hasComplaint}">
                                        <td class="p-2">
                                          {{ conference.id }}
                                        </td>
                                        <td class="p-2">
                                          {{ conference.title }}
                                        </td>
                                        <td class="p-2">
                                          {{ conference.start_time }}
                                        </td>
                                        <td class="p-2">
                                          {{ conference.end_time }}
                                        </td>
                                        <td class="p-2">
                                          <button
                                            v-if="conference.hasComplaint"
                                            type="button"
                                            class="btn btn-light-primary"
                                            @click="navigateToComplaints(conference.id)">
                                            {{ t("global.complaint") }}
                                          </button>
                                        </td>

                                        <td class="p-2">
                                          <button
                                            v-if="!conference.feesTransferred"
                                            type="button"
                                            class="btn btn-light-warning"
                                            @click="feeTransfer(conference.id)">
                                            {{ t("global.fee-transfer") }}
                                          </button>
                                          <div v-else class="bg-light-success">
                                            {{ t("global.transfered") }}
                                          </div>
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
                                    @click="closeGroupClassModal(groupClass)">
                                    {{ t("global.close") }}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </template>
                      <template #id="{row: groupClass}">
                        {{ groupClass.id }}
                      </template>
                      <template #name="{row: groupClass}">
                        {{ groupClass.name }}
                      </template>
                      <template #classes="{row: groupClass}">
                        {{ groupClass.classes }}
                      </template>
                      <template #price="{row: groupClass}">
                        {{ groupClass.price }}
                      </template>
                      <template #tutor_percentage="{row: groupClass}">
                        {{ groupClass.tutor_precentage }}
                      </template>
                      <template #fee="{row: groupClass}">
                        {{ groupClass.fee }}
                      </template>
                      <template #students="{row: groupClass}">
                        {{ groupClass.students }}
                      </template>
                    </data-table>

                    <data-table
                      v-if="selectedType === 'Pending Finance'"
                      :data="pendingFinanceData"
                      :header="pendingFinanceHeader"
                      :checkbox-enabled="true"
                      checkbox-label="id"
                      :items-total="pendingFinanceItemsTotal"
                      :page-current="pendingFinanceCurrentPage"
                      :items-per-page="pendingFinanceItemsPerPage"
                      :items-per-page-dropdown-enabled="true">
                      <template #id="{row: pendingFinance}">
                        {{ pendingFinance.id }}
                      </template>
                      <template #name="{row: pendingFinance}">
                        {{
                          pendingFinance.group_class
                            ? pendingFinance.group_class.name
                            : "private lesson"
                        }}
                      </template>
                      <template #percentage="{row: pendingFinance}">
                        {{ pendingFinance.percentage }}
                      </template>
                      <template #fee="{row: pendingFinance}">
                        {{ pendingFinance.fee }}
                      </template>
                      <template #actions="{row: pendingFinance}">
                        <button
                          type="button"
                          class="btn btn-light-primary"
                          @click="openPendingFinanceModal(pendingFinance)">
                          {{ t("global.change-status") }}
                        </button>
                        <template v-if="pendingFinanceModals[pendingFinance.id]">
                          <div class="modal">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <!-- Modal header -->
                                <div class="modal-header">
                                  <h5 class="modal-title">{{ t("global.change-status") }}</h5>
                                  <button
                                    type="button"
                                    class="btn-close"
                                    aria-label="Close"
                                    @click="closePendingFinanceModal(pendingFinance)"></button>
                                </div>
                                <!-- Modal body -->
                                <div class="modal-body">
                                  <div class="col-12 col-md-6 fv-row mb-5">
                                    <label
                                      for="view-complaint-status-input"
                                      class="required fs-6 fw-semibold mb-2">
                                      {{ t("global.status") }}
                                    </label>
                                    <select
                                      id="view-complaint-status-input"
                                      v-model="status"
                                      class="form-select form-select-solid">
                                      <option value="transferred" selected>
                                        {{ t("global.transferred") }}
                                      </option>
                                      <option value="rejected">{{ t("global.rejected") }}</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label
                                      for="view-complaint-message-textarea"
                                      class="required fs-6 fw-semibold mb-2">
                                      {{ t("global.notes") }}
                                    </label>
                                    <textarea
                                      id="view-complaint-message-textarea"
                                      v-model="notes"
                                      rows="6"
                                      :placeholder="t('global.notes')"
                                      class="form-control form-control-solid placeholder-gray-600 fw-bold fs-4 ps-9 pt-7"></textarea>
                                  </div>
                                </div>
                                <!-- Modal footer -->
                                <div class="modal-footer">
                                  <button
                                    type="button"
                                    class="btn btn-secondary"
                                    @click="closePendingFinanceModal(pendingFinance)">
                                    {{ t("global.close") }}
                                  </button>
                                  <button
                                    type="button"
                                    class="btn btn-primary"
                                    @click="submitPendingFinanceForm(pendingFinance)">
                                    {{ t("global.submit") }}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </template>
                    </data-table>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "@/components/admin/dashboard/toolbar.vue"
import {defineComponent, onBeforeMount, ref, onMounted, provide} from "vue"
import DataTable from "@/components/admin/data-table/index.vue"
import {useI18n} from "vue-i18n"
import axiosClient from "../../../plugins/axios"
import {useRoute, useRouter} from "vue-router"

export default defineComponent({
  name: "user-info",
  components: {Toolbar, DataTable},
  setup() {
    const {t} = useI18n()
    const loading = ref(false)
    const router = useRouter()
    const SERVER_PATH = ref(import.meta.env.VITE_APP_SERVER_BASE_URL)

    const profile = ref({})
    const financial = ref({})
    const route = useRoute()
    const userId = route.params.id

    const hasComplaint = ref({})

    const groupClassData = ref([])
    const groupClassItemsTotal = ref(0)
    const groupClassCurrentPage = ref(0)
    const groupClassItemsPerPage = ref(0)

    const notCompletedGroupClassData = ref([])
    const notCompletedGroupClassItemsTotal = ref(0)
    const notCompletedGroupClassCurrentPage = ref(0)
    const notCompletedGroupClassItemsPerPage = ref(0)

    const privateLessonData = ref([])
    const privateLessonItemsTotal = ref(0)
    const privateLessonCurrentPage = ref(0)
    const privateLessonItemsPerPage = ref(0)

    const notCompletedPrivateLessonData = ref([])
    const notCompletedPrivateLessonItemsTotal = ref(0)
    const notCompletedPrivateLessonCurrentPage = ref(0)
    const notCompletedPrivateLessonItemsPerPage = ref(0)

    const pendingFinanceData = ref([])
    const pendingFinanceItemsTotal = ref(0)
    const pendingFinanceCurrentPage = ref(0)
    const pendingFinanceItemsPerPage = ref(0)

    const groupClassModals = ref({})
    const privateLessonModals = ref({})
    const pendingFinanceModals = ref({})

    const status = ref("")
    const notes = ref("")

    const orderTypes = [
      "Completed Group Class",
      "Not Completed Group Class",
      "Completed Private Lesson",
      "Not Completed Private Lesson",
      "Pending Finance"
    ]
    const selectedType = ref("Completed Group Class") // Default selected type

    const groupClassHeader = ref([
      {columnName: "#", columnLabel: "extra", sortEnabled: true, columnWidth: 150},
      {columnName: t("global.id"), columnLabel: "id", sortEnabled: true, columnWidth: 25},
      {columnName: t("global.name"), columnLabel: "name", sortEnabled: true, columnWidth: 75},
      {columnName: t("global.classes"), columnLabel: "classes", sortEnabled: true, columnWidth: 75},
      {columnName: t("global.price"), columnLabel: "price", sortEnabled: true, columnWidth: 75},
      {
        columnName: t("global.tutor-percentage"),
        columnLabel: "tutor_percentage",
        sortEnabled: true,
        columnWidth: 75
      },
      {columnName: t("global.fee"), columnLabel: "fee", sortEnabled: true, columnWidth: 75},
      {
        columnName: t("global.students"),
        columnLabel: "students",
        sortEnabled: true,
        columnWidth: 150
      }
    ])

    const privateLessonHeader = ref([
      {columnName: "#", columnLabel: "extra", sortEnabled: true, columnWidth: 150},
      {columnName: t("global.id"), columnLabel: "id", sortEnabled: true, columnWidth: 75},
      {
        columnName: t("global.student"),
        columnLabel: "student",
        sortEnabled: true,
        columnWidth: 150
      },
      {columnName: t("global.price"), columnLabel: "price", sortEnabled: true, columnWidth: 150},
      {
        columnName: t("global.tutor-percentage"),
        columnLabel: "tutor_percentage",
        sortEnabled: true,
        columnWidth: 150
      },
      {columnName: t("global.fee"), columnLabel: "fee", sortEnabled: true, columnWidth: 150}
    ])

    const pendingFinanceHeader = ref([
      // {columnName: "#", columnLabel: "extra", sortEnabled: true, columnWidth: 150},
      {columnName: t("global.id"), columnLabel: "id", sortEnabled: true, columnWidth: 25},
      {columnName: t("global.name"), columnLabel: "name", sortEnabled: true, columnWidth: 75},
      {
        columnName: t("global.percentage"),
        columnLabel: "percentage",
        sortEnabled: true,
        columnWidth: 75
      },
      {columnName: t("global.fee"), columnLabel: "fee", sortEnabled: true, columnWidth: 75},
      {
        columnName: t("global.actions"),
        columnLabel: "actions",
        sortEnabled: true,
        columnWidth: 150
      }
    ])

    // Method to open the modal
    const openGroupClassModal = function openGroupClassModal(groupClass) {
      groupClassModals.value = {...groupClassModals.value, [groupClass.id]: true}
    }

    // Method to close the modal
    const closeGroupClassModal = function closeGroupClassModal(groupClass) {
      groupClassModals.value = {...groupClassModals.value, [groupClass.id]: false}
    }

    // Method to open the modal
    const openPendingFinanceModal = function openPendingFinanceModal(pendingFinance) {
      pendingFinanceModals.value = {...pendingFinanceModals.value, [pendingFinance.id]: true}
    }

    // Method to close the modal
    const closePendingFinanceModal = function closePendingFinanceModal(pendingFinance) {
      pendingFinanceModals.value = {...pendingFinanceModals.value, [pendingFinance.id]: false}
    }

    // Method to open the modal
    const openPrivateLessonModal = function openPrivateLessonModal(privateLesson) {
      privateLessonModals.value = {...privateLessonModals.value, [privateLesson.id]: true}
    }

    // Method to close the modal
    const closePrivateLessonModal = function closePrivateLessonModal(privateLesson) {
      privateLessonModals.value = {...privateLessonModals.value, [privateLesson.id]: false}
    }
    const fetchData = async (url) => {
      try {
        const response = await axiosClient.get(url)
        return response.data.result
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching data:", error)
        throw error
      }
    }

    const updateData = async (type, data) => {
      // Filter data based on conference.hasComplaint
      const hasComplaintData = data.data.filter((item) => item.hasComplaint)
      const hasNotComplaintData = data.data.filter((item) => !item.hasComplaint)

      if (type === "Completed Private Lesson") {
        privateLessonData.value = hasNotComplaintData
        privateLessonItemsTotal.value = hasNotComplaintData.length
        privateLessonCurrentPage.value = hasNotComplaintData.current_page
        privateLessonItemsPerPage.value = hasNotComplaintData.per_page
      } else if (type === "Not Completed Private Lesson") {
        notCompletedPrivateLessonData.value = hasComplaintData
        notCompletedPrivateLessonItemsTotal.value = hasComplaintData.length
        notCompletedPrivateLessonCurrentPage.value = hasComplaintData.current_page
        notCompletedPrivateLessonItemsPerPage.value = hasComplaintData.per_page
      } else if (type === "Completed Group Class") {
        groupClassData.value = hasNotComplaintData
        groupClassItemsTotal.value = hasNotComplaintData.length
        groupClassCurrentPage.value = hasNotComplaintData.current_page
        groupClassItemsPerPage.value = hasNotComplaintData.per_page
      } else if (type === "Not Completed Group Class") {
        notCompletedGroupClassData.value = hasComplaintData
        notCompletedGroupClassItemsTotal.value = hasComplaintData.length
        notCompletedGroupClassCurrentPage.value = hasComplaintData.current_page
        notCompletedGroupClassItemsPerPage.value = hasComplaintData.per_page
      } else if (type === "Pending Finance") {
        pendingFinanceData.value = data.data
        pendingFinanceItemsTotal.value = data.total
        pendingFinanceCurrentPage.value = data.current_page
        pendingFinanceItemsPerPage.value = data.per_page
      }
    }

    const getDataTableBodyRows = async (queryString = "") => {
      loading.value = true // Start loading

      const urls = {
        "Completed Group Class": "/tutor-statistics/group-class-orders",
        "Not Completed Group Class": "/tutor-statistics/group-class-orders",
        "Completed Private Lesson": "/tutor-statistics/private-lesson-orders",
        "Not Completed Private Lesson": "/tutor-statistics/private-lesson-orders",
        "Pending Finance": "/tutor-statistics/get-tutor-finance"
      }

      // Determine the value for hasComplaint as 0 or 1
      const hasComplaint = selectedType.value.includes("Not") ? 1 : 0

      let url = `${urls[selectedType.value]}?tutor_id=${userId}`

      if (selectedType.value !== "Pending Finance") {
        url += `&has_complaint=${hasComplaint}`
      }

      if (queryString) {
        url += `&${queryString}`
      }

      try {
        const data = await fetchData(url)
        await updateData(selectedType.value, data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching data:", error)
      } finally {
        loading.value = false // Stop loading
      }
    }

    const searchDataTableBodyRows = (e) => {
      getDataTableBodyRows(`q=${e.target.value}`)
    }

    const handleTabChange = (type) => {
      selectedType.value = type
      getDataTableBodyRows()
    }

    provide("getDataTableBodyRows", getDataTableBodyRows)

    onBeforeMount(async () => {
      try {
        loading.value = true // Start loading
        const [profileResponse, userInfoResponse] = await Promise.all([
          axiosClient.get("/profile", {params: {user_id: userId}}),
          axiosClient.get("/tutor-statistics/tutor-info", {params: {user_id: userId}})
        ])
        profile.value = profileResponse.data.result
        financial.value = userInfoResponse.data
        selectedType.value = "Pending Finance"
        await getDataTableBodyRows()
        selectedType.value = "Completed Group Class"
        await getDataTableBodyRows()
        selectedType.value = "Completed Private Lesson"
        await getDataTableBodyRows()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching profile and user info:", error)
      } finally {
        loading.value = false // Stop loading
      }
    })

    onMounted(async () => {})

    const toggleConference = ref({})

    const submitPendingFinanceForm = (pendingFinance) => {
      const data = {
        status: status.value,
        notes: notes.value
      }

      // Send the data to the server
      axiosClient
        .post(`/tutor-statistics/update-tutor-finance/${pendingFinance.id}`, data)
        .then((response) => {
          // Handle success response
          Swal.fire({
            icon: "success",
            text: t("global.tutor-finance-updated-successfully"),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })

          getDataTableBodyRows()
          closePendingFinanceModal(pendingFinance)
        })
        .catch((error) => {
          // Handle error response
        })
    }

    // const showAdditionalDetailsForGroupClass = ref(null)
    const showConferences = (groupClass) => {
      // Toggle the value for the corresponding groupClass ID
      toggleConference.value[groupClass.id] = !toggleConference.value[groupClass.id]
      // Trigger reactivity
      toggleConference.value = {...toggleConference.value}
    }

    const navigateToComplaints = (conferenceId) => {
      router.push({
        name: "complaints-list", // Assuming 'complaints' is the name of your route
        params: {conference_id: conferenceId}
      })
    }

    const feeTransfer = (conferenceId) => {
      axiosClient
        .post(`/tutor-statistics/tutor-transfer-fees/${conferenceId}`)
        .then((response) => {
          // Handle success response
          Swal.fire({
            icon: "success",
            text: t("global.fee-transfered-successfully"),
            confirmButtonText: t("global.thank-you"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-primary"}
          })

          // getDataTableBodyRows()
        })
        .catch((error) => {
          // Handle error response
        })
    }

    return {
      t,
      feeTransfer,
      SERVER_PATH,
      loading,
      showConferences,
      toggleConference,
      navigateToComplaints,
      profile,
      financial,
      groupClassHeader,
      privateLessonHeader,
      pendingFinanceHeader,
      hasComplaint,
      orderTypes,
      selectedType,
      notCompletedGroupClassData,
      notCompletedGroupClassItemsTotal,
      notCompletedGroupClassCurrentPage,
      notCompletedGroupClassItemsPerPage,
      groupClassData,
      groupClassItemsTotal,
      groupClassCurrentPage,
      groupClassItemsPerPage,
      // notCompletedP
      notCompletedPrivateLessonData,
      notCompletedPrivateLessonItemsTotal,
      notCompletedPrivateLessonCurrentPage,
      notCompletedPrivateLessonItemsPerPage,
      privateLessonData,
      privateLessonItemsTotal,
      privateLessonCurrentPage,
      privateLessonItemsPerPage,
      pendingFinanceData,
      pendingFinanceItemsTotal,
      pendingFinanceCurrentPage,
      pendingFinanceItemsPerPage,
      handleTabChange,
      searchDataTableBodyRows,
      getDataTableBodyRows,
      groupClassModals,
      openGroupClassModal,
      closeGroupClassModal,
      pendingFinanceModals,
      openPendingFinanceModal,
      closePendingFinanceModal,
      privateLessonModals,
      openPrivateLessonModal,
      closePrivateLessonModal,
      status,
      notes,
      submitPendingFinanceForm
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
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.detail-title {
  font-weight: bold;
}

.modal-dialog {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 90%;
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
.has-complaint {
  background-color: #ffcccc; /* Light red */
}
</style>
