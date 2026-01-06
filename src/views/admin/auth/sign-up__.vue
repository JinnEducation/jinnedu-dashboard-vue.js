<template>
  <div
    id="kt_create_account_stepper"
    class="d-flex flex-column flex-lg-row flex-column-fluid stepper stepper-pills stepper-column stepper-multistep">
    <div class="d-flex flex-column flex-lg-row-auto w-lg-350px w-xl-500px">
      <div
        class="d-flex flex-column position-lg-fixed top-0 bottom-0 w-lg-350px w-xl-500px scroll-y bgi-size-cover bgi-position-center"
        :style="{'background-image': `url('${background}')`}">
        <div class="d-flex flex-center py-10 py-lg-20 mt-lg-20">
          <router-link to="/">
            <img alt="Logo" src="../../../assets/media/logos/logo.png" class="h-80px rounded" />
          </router-link>
        </div>
        <div class="d-flex flex-row-fluid justify-content-center p-10">
          <steps-navbar :account-type="data.accountType" :is-profile="isProfile" />
        </div>
        <div class="d-flex flex-center flex-wrap px-5 py-10">
          <div class="d-flex fw-normal">
            <a v-if="!isProfile" href="https://learning.jinnedu.com" class="text-white px-5">{{
              t("global.home")
            }}</a>
            <router-link v-if="!isProfile" to="/auth/sign-in" class="text-white px-5">
              {{ t("global.sign-in") }}
            </router-link>
            <router-link v-if="isProfile" to="/dashboard/index" class="text-white px-5">
              {{ t("global.dashboard") }}
            </router-link>
            <a href="https://learning.jinnedu.com/coming-soon" class="text-white px-5">
              {{ t("global.contact-us") }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column flex-lg-row-fluid py-10">
      <div class="d-flex flex-center flex-column flex-column-fluid">
        <div class="w-lg-650px w-xl-700px p-10 p-lg-15 mx-auto">
          <div v-show="loading" class="card-body p-0">
            <div class="card-px text-center py-20 my-10">
              <div role="status" class="spinner-border text-primary">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          <form
            v-show="!loading"
            id="kt_create_account_form"
            ref="form"
            novalidate="novalidate"
            class="my-auto pb-5"
            @submit.prevent="handleFormSubmission">
            <div class="current" data-kt-stepper-element="content">
              <template v-if="!isProfile">
                <div class="w-100">
                  <div class="pb-10 pb-lg-15">
                    <h2 class="fw-bold d-flex align-items-center text-dark">
                      {{ t("global.account-type-title") }}
                      <span
                        title="Account details is issued based on account type"
                        data-bs-toggle="tooltip"
                        class="ms-1">
                        <span class="svg-icon svg-icon-primary svg-icon-2x">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                              <rect x="0" y="0" width="24" height="24" />
                              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.25" />
                              <rect x="11" y="10" rx="1" width="2" height="7" fill="currentColor" />
                              <rect x="11" y="7" rx="1" width="2" height="2" fill="currentColor" />
                            </g>
                          </svg>
                        </span>
                      </span>
                    </h2>
                    <div class="text-muted fw-semibold fs-6">
                      {{ t("global.account-type-description") }}
                    </div>
                  </div>
                  <div class="fv-row">
                    <div class="row">
                      <div class="col-lg-6">
                        <input
                          id="kt_create_account_form_account_type_tutor"
                          v-model="data.accountType"
                          type="radio"
                          name="account-type"
                          value="tutor"
                          class="btn-check" />
                        <label
                          for="kt_create_account_form_account_type_tutor"
                          class="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center mb-10">
                          <span class="svg-icon svg-icon-3x me-5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24">
                              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <rect x="0" y="0" width="24" height="24" />
                                <path
                                  d="M18,2 L20,2 C21.6568542,2 23,3.34314575 23,5 L23,19 C23,20.6568542 21.6568542,22 20,22 L18,22 L18,2 Z"
                                  fill="currentColor"
                                  opacity="0.5" />
                                <path
                                  d="M5,2 L17,2 C18.6568542,2 20,3.34314575 20,5 L20,19 C20,20.6568542 18.6568542,22 17,22 L5,22 C4.44771525,22 4,21.5522847 4,21 L4,3 C4,2.44771525 4.44771525,2 5,2 Z M12,11 C13.1045695,11 14,10.1045695 14,9 C14,7.8954305 13.1045695,7 12,7 C10.8954305,7 10,7.8954305 10,9 C10,10.1045695 10.8954305,11 12,11 Z M7.00036205,16.4995035 C6.98863236,16.6619875 7.26484009,17 7.4041679,17 C11.463736,17 14.5228466,17 16.5815,17 C16.9988413,17 17.0053266,16.6221713 16.9988413,16.5 C16.8360465,13.4332455 14.6506758,12 11.9907452,12 C9.36772908,12 7.21569918,13.5165724 7.00036205,16.4995035 Z"
                                  fill="currentColor" />
                              </g>
                            </svg>
                          </span>
                          <span class="d-block fw-semibold text-start">
                            <span class="text-dark fw-bold d-block fs-4 mb-2">{{
                              t("global.tutor-account-title")
                            }}</span>
                            <span class="text-muted fw-semibold fs-6">
                              {{ t("global.tutor-account-description") }}
                            </span>
                          </span>
                        </label>
                      </div>
                      <div class="col-lg-6">
                        <input
                          id="kt_create_account_form_account_type_student"
                          v-model="data.accountType"
                          type="radio"
                          name="account-type"
                          value="student"
                          class="btn-check" />
                        <label
                          for="kt_create_account_form_account_type_student"
                          class="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center">
                          <span class="svg-icon svg-icon-3x me-5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24">
                              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <polygon points="0 0 24 0 24 24 0 24" />
                                <path
                                  d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z"
                                  fill="currentColor"
                                  fill-rule="nonzero"
                                  opacity="0.5" />
                                <path
                                  d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z"
                                  fill="currentColor"
                                  fill-rule="nonzero" />
                              </g>
                            </svg>
                          </span>
                          <span class="d-block fw-semibold text-start">
                            <span class="text-dark fw-bold d-block fs-4 mb-2">{{
                              t("global.student-account-title")
                            }}</span>
                            <span class="text-muted fw-semibold fs-6">
                              {{ t("global.student-account-description") }}
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="w-100">
                  <div class="pb-10 pb-lg-15">
                    <h2 class="fw-bold d-flex align-items-center text-dark">
                      {{ t("global.profile-title") }}
                      <span
                        title="Account details is issued based on account type"
                        data-bs-toggle="tooltip"
                        class="ms-1">
                        <span class="svg-icon svg-icon-primary svg-icon-2x">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                              <rect x="0" y="0" width="24" height="24" />
                              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.25" />
                              <rect x="11" y="10" rx="1" width="2" height="7" fill="currentColor" />
                              <rect x="11" y="7" rx="1" width="2" height="2" fill="currentColor" />
                            </g>
                          </svg>
                        </span>
                      </span>
                    </h2>
                    <div class="text-muted fw-semibold fs-6">
                      {{ t("global.profile-description") }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div data-kt-stepper-element="content">
              <div class="w-100">
                <div class="pb-10 pb-lg-12">
                  <h2 class="fw-bold text-dark">{{ t("global.account-information-title") }}</h2>
                  <div class="text-muted fw-semibold fs-6">
                    {{ t("global.account-information-description") }}
                  </div>
                </div>
                <div class="fv-row mb-7">
                  <label for="user-avatar" class="d-block fw-semibold fs-6 mb-5">{{
                    t("global.avatar")
                  }}</label>
                  <div
                    data-kt-image-input="true"
                    class="image-input image-input-outline image-input-placeholder image-input-empty">
                    <div
                      class="image-input-wrapper w-125px h-125px"
                      :style="{
                        'background-image': data.avatar ? `url(${data.avatar})` : 'none'
                      }"></div>
                    <label
                      aria-label="Change Avatar"
                      data-bs-toggle="tooltip"
                      data-bs-original-title="Change Avatar"
                      data-kt-image-input-action="change"
                      data-kt-initialized="1"
                      class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow">
                      <i class="bi bi-pencil-fill fs-7"></i>
                      <input
                        id="user-avatar"
                        type="file"
                        name="avatar"
                        accept=".png, .jpg, .jpeg"
                        @change="handleFileInputChange($event)" />
                      <input type="hidden" name="avatar-remove" value="1" />
                    </label>
                    <span
                      aria-label="Cancel Avatar"
                      data-bs-toggle="tooltip"
                      data-bs-original-title="Cancel Avatar"
                      data-kt-image-input-action="cancel"
                      data-kt-initialized="1"
                      class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow">
                      <i class="bi bi-x fs-2"></i>
                    </span>
                    <span
                      aria-label="Remove Avatar"
                      data-bs-toggle="tooltip"
                      data-bs-original-title="Remove Avatar"
                      data-kt-image-input-action="remove"
                      data-kt-initialized="1"
                      class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow">
                      <i class="bi bi-x fs-2"></i>
                    </span>
                  </div>
                  <div class="form-text">{{ t("global.avatar-description") }}</div>
                </div>
                <div class="row fv-row mb-7">
                  <div class="col-xl-6">
                    <form-input
                      id="first-name"
                      v-model:inputValue="data.firstName"
                      :label="t('global.first-name')"
                      type="text"
                      name="first-name"
                      :placeholder="t('global.first-name')" />
                  </div>
                  <div class="col-xl-6">
                    <form-input
                      id="last-name"
                      v-model:inputValue="data.lastName"
                      :label="t('global.last-name')"
                      type="text"
                      name="last-name"
                      :placeholder="t('global.last-name')" />
                  </div>
                </div>
                <div class="fv-row mb-10">
                  <form-input
                    id="email"
                    v-model:inputValue="data.email"
                    :label="t('global.email')"
                    type="email"
                    name="email"
                    :placeholder="t('global.email')" />
                </div>
                <div
                  v-if="!isProfile"
                  ref="formPasswordMeter"
                  data-kt-password-meter="true"
                  class="fv-row mb-10">
                  <div class="mb-1">
                    <div class="position-relative mb-3">
                      <form-input
                        v-if="!isProfile"
                        id="password"
                        ref="formPassword"
                        v-model:inputValue="data.password"
                        :label="t('global.password')"
                        type="password"
                        name="password"
                        :placeholder="t('global.password')"
                        @handle-input-password="handleInputPassword" />
                      <span
                        data-kt-password-meter-control="visibility"
                        class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                        <i class="bi bi-eye-slash fs-2"></i>
                        <i class="bi bi-eye fs-2 d-none"></i>
                      </span>
                    </div>
                    <div
                      data-kt-password-meter-control="highlight"
                      class="d-flex align-items-center mb-3">
                      <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
                      <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
                      <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2" />
                      <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px" />
                    </div>
                  </div>
                  <div data-kt-translate="sign-up-hint" class="text-muted">
                    {{ t("global.password-strength") }}
                  </div>
                </div>
                <div class="fv-row mb-10">
                  <form-input
                    v-if="!isProfile"
                    id="confirm-password"
                    v-model:inputValue="data.passwordConfirmation"
                    :label="t('global.password-confirm')"
                    type="password"
                    name="confirm-password"
                    :placeholder="t('global.password-confirm')" />
                </div>
              </div>
            </div>
            <div v-show="data.accountType === 'tutor'" data-kt-stepper-element="content">
              <div class="w-100">
                <div class="pb-10 pb-lg-12">
                  <h2 class="fw-bold text-dark">{{ t("global.personal-information-title") }}</h2>
                  <div class="text-muted fw-semibold fs-6">
                    {{ t("global.personal-information-description") }}
                  </div>
                </div>
                <div class="row fv-row mb-7">
                  <div class="col-xl-6">
                    <form-input
                      id="date-of-birth"
                      v-model:inputValue="data.dateOfBirth"
                      :label="t('global.date-of-birth')"
                      :sr-only="false"
                      type="date"
                      name="date-of-birth"
                      :placeholder="t('global.date-of-birth')" />
                  </div>
                  <div class="col-xl-6">
                    <form-input
                      id="phone-number"
                      v-model:inputValue="data.phoneNumber"
                      :label="t('global.phone-number')"
                      :sr-only="false"
                      type="tel"
                      name="phone-number"
                      :placeholder="t('global.phone-number')"
                      classes="input-number" />
                  </div>
                </div>
                <div class="row fv-row mb-7">
                  <div class="col-xl-6">
                    <label for="country" class="form-label required">{{
                      t("global.country")
                    }}</label>
                    <select
                      id="country"
                      v-model="data.countryId"
                      name="country"
                      data-kt-select2="true"
                      data-allow-clear="true"
                      class="form-select form-select-lg form-select-solid">
                      <option
                        v-for="(country, index) in countries"
                        :key="index"
                        :value="country.id">
                        {{ country.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-xl-6">
                    <label for="native-language" class="form-label required">
                      {{ t("global.native-language") }}
                    </label>
                    <select
                      id="native-language"
                      v-model="data.languageId"
                      name="native-language"
                      data-kt-select2="true"
                      data-allow-clear="true"
                      class="form-select form-select-lg form-select-solid">
                      <option
                        v-for="(language, index) in languages"
                        :key="index"
                        :value="language.id">
                        {{ language.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row fv-row mb-7">
                  <div class="col-xl-6">
                    <label for="teaching-subject" class="form-label required">
                      {{ t("global.teaching-subject") }}
                    </label>
                    <select
                      id="teaching-subject"
                      v-model="data.subjectId"
                      name="teaching-subject"
                      data-kt-select2="true"
                      data-allow-clear="true"
                      class="form-select form-select-lg form-select-solid">
                      <option v-for="(subject, index) in subjects" :key="index" :value="subject.id">
                        {{ subject.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-xl-6">
                    <label for="teaching-experience" class="form-label required">
                      {{ t("global.teaching-experience") }}
                    </label>
                    <select
                      id="teaching-experience"
                      v-model="data.experienceId"
                      name="teaching-experience"
                      data-kt-select2="true"
                      data-allow-clear="true"
                      class="form-select form-select-lg form-select-solid">
                      <option
                        v-for="(experience, index) in experiences"
                        :key="index"
                        :value="experience.id">
                        {{ experience.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row fv-row">
                  <div class="col-xl-6">
                    <label for="situation" class="form-label required">{{
                      t("global.situation")
                    }}</label>
                    <select
                      id="situation"
                      v-model="data.situationId"
                      name="situation"
                      data-kt-select2="true"
                      data-allow-clear="true"
                      class="form-select form-select-lg form-select-solid">
                      <option
                        v-for="(situation, index) in situations"
                        :key="index"
                        :value="situation.id">
                        {{ situation.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="data.accountType === 'tutor'" data-kt-stepper-element="content">
              <div class="w-100">
                <div class="pb-8 pb-lg-10">
                  <h2 class="fw-bold text-dark">{{ t("global.biography-information-title") }}</h2>
                  <div class="text-muted fw-semibold fs-6">
                    {{ t("global.biography-information-description") }}
                  </div>
                </div>
                <div class="fv-row mb-10">
                  <label for="headline" class="form-label required">{{
                    t("global.headline")
                  }}</label>
                  <textarea
                    id="headline"
                    v-model="data.headline"
                    name="headline"
                    rows="3"
                    class="form-control form-control-lg form-control-solid"></textarea>
                </div>
                <div class="fv-row mb-10">
                  <label for="headline" class="form-label required">{{
                    t("global.interests")
                  }}</label>
                  <textarea
                    id="interests"
                    v-model="data.interests"
                    name="interests"
                    rows="3"
                    class="form-control form-control-lg form-control-solid"></textarea>
                </div>
                <div class="fv-row mb-10">
                  <label for="motivation" class="form-label required">{{
                    t("global.motivation")
                  }}</label>
                  <textarea
                    id="motivation"
                    v-model="data.motivation"
                    name="motivation"
                    rows="3"
                    class="form-control form-control-lg form-control-solid"></textarea>
                </div>
                <div class="fv-row mb-10">
                  <label for="specialization" class="form-label required">
                    {{ t("global.specialization") }}
                  </label>
                  <select
                    id="specialization"
                    v-model="data.specializationId"
                    name="specialization"
                    data-kt-select2="true"
                    data-allow-clear="true"
                    class="form-select form-select-lg form-select-solid">
                    <option
                      v-for="(specialization, index) in specializations"
                      :key="index"
                      :value="specialization.id">
                      {{ specialization.name }}
                    </option>
                  </select>
                </div>
                <div class="fv-row mb-10">
                  <label for="experience" class="form-label required">{{
                    t("global.experience")
                  }}</label>
                  <textarea
                    id="experience"
                    v-model="data.experience"
                    name="experience"
                    rows="3"
                    class="form-control form-control-lg form-control-solid"></textarea>
                </div>
                <div class="fv-row">
                  <label for="methodology" class="form-label required">{{
                    t("global.methodology")
                  }}</label>
                  <textarea
                    id="methodology"
                    v-model="data.methodology"
                    name="methodology"
                    rows="3"
                    class="form-control form-control-lg form-control-solid"></textarea>
                </div>
              </div>
            </div>
            <div v-show="data.accountType === 'tutor'" data-kt-stepper-element="content">
              <div class="w-100">
                <div class="pb-10 pb-lg-12">
                  <h2 class="fw-bold text-dark">{{ t("global.daily-availability-time-title") }}</h2>
                  <div class="text-muted fw-semibold fs-6">
                    {{ t("global.daily-availability-time-description") }}
                  </div>
                </div>
                <div class="row fv-row mb-7">
                  <!-- GET KEY NAME (DAY): Object.keys(data.availability)[availability.id - 1] -->
                  <div
                    v-for="availability in data.availability"
                    :key="availability.id"
                    class="form-group row mb-7">
                    <label
                      :for="`availability-${availability.id}`"
                      class="col-lg-2 col-form-label text-right py-0 text-truncate">
                      {{ t(`days.${Object.keys(data.availability)[availability.id - 1]}`) }}:
                    </label>
                    <div class="col-lg-10 d-flex flex-column gap-3">
                      <div
                        v-for="hour in availability.hours"
                        :key="hour"
                        class="form-group row align-items-end">
                        <div class="col">
                          <label
                            :for="`availability-${
                              Object.keys(data.availability)[availability.id - 1]
                            }-from-${hour.from}`"
                            class="mb-2">
                            {{ t("global.from") }}
                          </label>
                          <input
                            :id="`availability-${
                              Object.keys(data.availability)[availability.id - 1]
                            }-from-${hour.from}`"
                            v-model="hour.from"
                            :name="`availability-${
                              Object.keys(data.availability)[availability.id - 1]
                            }-from-${hour.from}`"
                            type="time"
                            class="form-control" />
                        </div>
                        <div class="col">
                          <label
                            :for="`availability-${
                              Object.keys(data.availability)[availability.id - 1]
                            }-to-${hour.to}`"
                            class="mb-2">
                            {{ t("global.to") }}
                          </label>
                          <input
                            :id="`availability-${
                              Object.keys(data.availability)[availability.id - 1]
                            }-to-${hour.to}`"
                            v-model="hour.to"
                            :name="`availability-${
                              Object.keys(data.availability)[availability.id - 1]
                            }-to-${hour.to}`"
                            type="time"
                            class="form-control" />
                        </div>
                      </div>
                      <div class="col">
                        <button
                          type="button"
                          class="btn btn-outline btn-light"
                          @click="
                            () => {
                              availability.hours.push({from: '', to: ''})
                            }
                          ">
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
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="data.accountType === 'tutor'" data-kt-stepper-element="content">
              <div class="w-100">
                <div class="pb-10 pb-lg-12">
                  <h2 class="fw-bold text-dark">{{ t("global.price-information-title") }}</h2>
                  <div class="text-muted fw-semibold fs-6">
                    {{ t("global.price-information-description") }}
                  </div>
                </div>
                <div class="row fv-row mb-7">
                  <form-input
                    id="hourly-price"
                    v-model:inputValue="data.hourlyPrice"
                    :label="t('global.hourly-price')"
                    :sr-only="false"
                    type="number"
                    name="hourly-price"
                    :placeholder="t('global.hourly-price')"
                    classes="input-number" />
                </div>
              </div>
            </div>
            <div
              v-if="!isProfile"
              v-show="data.accountType === 'tutor'"
              data-kt-stepper-element="content">
              <div class="w-100">
                <div class="pb-10 pb-lg-12">
                  <h2 class="fw-bold text-dark">
                    {{ t("global.certification-information-title") }}
                  </h2>
                  <div class="text-muted fw-semibold fs-6">
                    {{ t("global.certification-information-description") }}
                  </div>
                </div>
                <div class="row fv-row mb-7">
                  <label for="certificate-subject" class="form-label required">
                    {{ t("global.certification-subject") }}
                  </label>
                  <select
                    id="certificate-subject"
                    v-model="data.certificate.subjectId"
                    name="certificate-subject"
                    data-kt-select2="true"
                    data-allow-clear="true"
                    class="form-select form-select-lg form-select-solid">
                    <option v-for="(subject, index) in subjects" :key="index" :value="subject.id">
                      {{ subject.name }}
                    </option>
                  </select>
                </div>
                <div class="row fv-row mb-7">
                  <form-input
                    id="certificate-name"
                    v-model:inputValue="data.certificate.name"
                    :label="t('global.certification-name')"
                    :sr-only="false"
                    type="text"
                    name="certificate-name"
                    :placeholder="t('global.certification-name')" />
                </div>
                <div class="fv-row mb-7">
                  <label for="certificate-description" class="form-label required">
                    {{ t("global.certification-description") }}
                  </label>
                  <textarea
                    id="certificate-description"
                    v-model="data.certificate.description"
                    name="certificate-description"
                    rows="3"
                    class="form-control form-control-lg form-control-solid"></textarea>
                </div>
                <div class="row fv-row mb-7">
                  <form-input
                    id="certificate-issued-by"
                    v-model:inputValue="data.certificate.issuedBy"
                    :label="t('global.certification-issued-by')"
                    :sr-only="false"
                    type="text"
                    name="certificate-issued-by"
                    :placeholder="t('global.certification-issued-by')" />
                </div>
                <div class="row fv-row mb-7">
                  <div class="col-xl-6">
                    <form-input
                      id="certificate-year-from"
                      v-model:inputValue="data.certificate.yearFrom"
                      :label="t('global.certification-year-from')"
                      :sr-only="false"
                      type="number"
                      name="certificate-year-from"
                      :placeholder="t('global.certification-year-from')"
                      classes="input-number" />
                  </div>
                  <div class="col-xl-6">
                    <form-input
                      id="certificate-year-to"
                      v-model:inputValue="data.certificate.yearTo"
                      :label="t('global.certification-year-to')"
                      :sr-only="false"
                      type="number"
                      name="certificate-year-to"
                      :placeholder="t('global.certification-year-to')"
                      classes="input-number" />
                  </div>
                </div>
                <div class="fv-row">
                  <label for="certificate-file" class="fs-6 fw-semibold mb-2">{{
                    t("global.certification-file")
                  }}</label>
                  <input
                    id="certificate-file"
                    type="file"
                    name="certificate-file"
                    accept=".png, .jpg, .jpeg, .pdf"
                    class="form-control form-control-solid"
                    @change="handleCertificateFileInputChange($event)" />
                </div>
              </div>
            </div>
            <div v-show="data.accountType === 'tutor'" data-kt-stepper-element="content">
              <div class="w-100">
                <div class="pb-10 pb-lg-12">
                  <h2 class="fw-bold text-dark">{{ t("global.tutor-video-title") }}</h2>
                  <div class="text-muted fw-semibold fs-6">
                    {{ t("global.video-file-description") }}
                  </div>
                </div>
                <div class="fv-row">
                  <label for="video-file" class="fs-6 fw-semibold mb-2">{{
                    t("global.video-file")
                  }}</label>
                  <input
                    id="video-file"
                    type="file"
                    name="video-file"
                    accept=".mp4, .mkv"
                    class="form-control form-control-solid"
                    @change="handleVideoFileInputChange($event)" />
                </div>
              </div>
            </div>
            <div class="d-flex flex-stack pt-15">
              <div class="mr-2">
                <button
                  v-show="navigation.previous"
                  type="button"
                  data-kt-stepper-action="previous"
                  class="btn btn-lg btn-light-primary me-3">
                  <span class="d-inline-block svg-icon svg-icon-1x icon-rotate-rtl me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24" />
                        <path
                          d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z"
                          fill="currentColor"
                          fill-rule="nonzero"
                          transform="translate(8, 11) scale(-1, 1) translate(-8, -11)" />
                        <path
                          d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z"
                          fill="currentColor"
                          fill-rule="nonzero"
                          opacity="0.5"
                          transform="translate(15, 11) scale(-1, 1) rotate(-270) translate(-15, -11)" />
                      </g>
                    </svg>
                  </span>
                  {{ t("global.previous") }}
                </button>
              </div>
              <div>
                <button
                  v-show="navigation.submit"
                  ref="formButtonSubmit"
                  type="submit"
                  data-kt-stepper-action="submit"
                  class="btn btn-lg btn-primary">
                  <span class="indicator-label">
                    {{ t("global.submit") }}
                    <span class="d-inline-block svg-icon svg-icon-1x icon-rotate-rtl ms-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <polygon points="0 0 24 0 24 24 0 24" />
                          <path
                            d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z"
                            fill="currentColor"
                            fill-rule="nonzero" />
                          <path
                            d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z"
                            fill="currentColor"
                            fill-rule="nonzero"
                            opacity="0.5"
                            transform="translate(9, 11) rotate(-270) translate(-9, -11)" />
                        </g>
                      </svg>
                    </span>
                  </span>
                  <span class="indicator-progress">
                    {{ t("global.wait-please") }}
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </button>
                <button
                  v-show="navigation.next"
                  type="button"
                  data-kt-stepper-action="next"
                  class="btn btn-lg btn-primary">
                  {{ t("global.continue") }}
                  <span class="d-inline-block svg-icon svg-icon-1x icon-rotate-rtl ms-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24" />
                        <path
                          d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z"
                          fill="currentColor"
                          fill-rule="nonzero" />
                        <path
                          d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z"
                          fill="currentColor"
                          fill-rule="nonzero"
                          opacity="0.5"
                          transform="translate(9, 11) rotate(-270) translate(-9, -11)" />
                      </g>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <form-footer />
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onBeforeMount, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useRoute, useRouter} from "vue-router"
import {useStore} from "vuex"
import background from "../../../assets/media/auth/sign-up.png"
import StepsNavbar from "../../../components/admin/sign-up/steps-navbar.vue"
import FormFooter from "../../../components/admin/uis/form/footer.vue"
import FormInput from "../../../components/admin/uis/form/input.vue"
import axiosClient from "@/plugins/axios"

export default defineComponent({
  name: "sign-up",
  components: {StepsNavbar, FormInput, FormFooter},
  setup() {
    const {t} = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const isProfile = ref(route.path === "/profile")
    const {token} = store.state.user

    const loading = ref(false)
    const avatarSelected = ref(false)
    const certificateSelected = ref(false)
    const videoSelected = ref(false)
    const videoExtension = ref(null)
    const data = ref({
      accountType: route.query.type || "student",
      avatar: null,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      passwordConfirmation: null,
      dateOfBirth: null,
      phoneNumber: null,
      countryId: null,
      languageId: null,
      subjectId: null,
      experienceId: null,
      situationId: null,
      headline: null,
      interests: null,
      motivation: null,
      specializationId: null,
      experience: null,
      methodology: null,
      availability: {
        monday: {id: 1, hours: [{from: "", to: ""}]},
        tuesday: {id: 2, hours: [{from: "", to: ""}]},
        wednesday: {id: 3, hours: [{from: "", to: ""}]},
        thursday: {id: 4, hours: [{from: "", to: ""}]},
        friday: {id: 5, hours: [{from: "", to: ""}]},
        saturday: {id: 6, hours: [{from: "", to: ""}]},
        sunday: {id: 7, hours: [{from: "", to: ""}]}
      },
      hourlyPrice: null,
      certificate: {}
    })

    const countries = ref(null)
    const languages = ref(null)
    const subjects = ref(null)
    const experiences = ref(null)
    const situations = ref(null)
    const specializations = ref(null)

    const validation = []
    const form = ref(null)
    const formPassword = ref(null)
    const formPasswordMeter = ref(null)
    const formButtonSubmit = ref(null)
    const navigation = ref({
      next: true,
      previous: false,
      submit: false,
      finish: false
    })

    const showError = (message) => {
      Swal.fire({
        icon: "error",
        text: message,
        confirmButtonText: t("global.got-it"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-danger"}
      })
      KTUtil.scrollTop()
    }

    const showValidationError = () => {
      Swal.fire({
        icon: "error",
        text: t("errors.sign-up-fields-required"),
        confirmButtonText: t("global.got-it"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-danger"}
      }).then(() => KTUtil.scrollTop())
    }

    // Handle dropdown changes
    const handleDropdownChanges = () => {
      $("#country").change((event) => {
        data.value.countryId = event.target.value
      })

      $("#native-language").change((event) => {
        data.value.languageId = event.target.value
      })

      $("#teaching-subject").change((event) => {
        data.value.subjectId = event.target.value
      })

      $("#teaching-experience").change((event) => {
        data.value.experienceId = event.target.value
      })

      $("#situation").change((event) => {
        data.value.situationId = event.target.value
      })

      $("#specialization").change((event) => {
        data.value.specializationId = event.target.value
      })

      $("#certificate-subject").change((event) => {
        data.value.certificate.subjectId = event.target.value
      })

      document.querySelectorAll(".input-number").forEach((element) => {
        element.addEventListener("keypress", (event) => {
          if (event.which < 48 || event.which > 57 || Number(event.target.value) < 0) {
            event.preventDefault()
          }
        })
      })
    }

    // File input change handlers
    const handleFileInputChange = function handleFileInputChange(event) {
      avatarSelected.value = event.target.files[0]
      const reader = new FileReader()
      reader.readAsBinaryString(avatarSelected.value)
      reader.onload = (renderEvent) => {
        data.value.avatar = renderEvent.target.result
      }
    }

    const handleCertificateFileInputChange = (event) => {
      certificateSelected.value = event.target.files[0]
      const reader = new FileReader()
      reader.readAsBinaryString(certificateSelected.value)
      reader.onload = (renderEvent) => {
        data.value.certificate.file = renderEvent.target.result
      }
    }

    const handleVideoFileInputChange = (event) => {
      videoSelected.value = event.target.files[0]
      videoExtension.value = event.target.files[0].type
      const reader = new FileReader()
      reader.readAsBinaryString(videoSelected.value)
      reader.onload = (renderEvent) => {
        data.value.video = renderEvent.target.result
      }
    }

    // Initialize password meter
    const validatePassword = () => {
      return passwordMeter.getScore() === 100
    }

    const handleInputPassword = (value) => {
      if (value.length > 0) validation[1].updateFieldStatus("password", "NotValidated")
    }

    // Handle form submission success and error
    const handleSuccessfulSubmission = () => {
      if (isProfile.value) {
        router.push({name: "index"})
      } else {
        router.push({name: "sign-in"})
      }
    }

    const handleSubmissionError = (errorMessage) => {
      Swal.fire({
        icon: "error",
        text: errorMessage,
        confirmButtonText: t("global.sign-in"),
        buttonsStyling: false,
        customClass: {confirmButton: "btn btn-danger"}
      }).then(() => {
        if (isProfile.value) {
          router.push({name: "index"})
        } else {
          router.push({name: "sign-in"})
        }
      })
    }

    const resetFormButton = () => {
      formButtonSubmit.value.removeAttribute("data-kt-indicator")
      formButtonSubmit.value.disabled = false
      formButtonSubmit.value.ariaDisabled = false
    }

    const handleInvalidFormFields = () => {
      validation[1].revalidateField("password").then((result) => {
        if (result.toString().toLowerCase() === "invalid") {
          Swal.fire({
            icon: "error",
            text: t("errors.sign-up-password-week"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          }).then(() => KTUtil.scrollTop())
        } else {
          Swal.fire({
            icon: "error",
            text: t("errors.sign-up-fields-required"),
            confirmButtonText: t("global.got-it"),
            buttonsStyling: false,
            customClass: {confirmButton: "btn btn-danger"}
          }).then(() => KTUtil.scrollTop())
        }
      })
    }

    const handleTutorVideoSubmission = () => {
      let videoPromise = null
      if (videoSelected.value) {
        const formDataVideo = new FormData()
        formDataVideo.append("youtube_url", "https://youtube.com")
        formDataVideo.append("attachment", videoSelected.value)
        videoPromise = axiosClient.post("/tutor/video", formDataVideo)
      }

      Promise.allSettled([videoPromise])
        .then(() => {
          handleSuccessfulSubmission()
        })
        .catch(() => {
          handleSubmissionError(t("errors.sign-up-video-upload"))
        })
        .finally(() => {
          resetFormButton()
        })
    }

    const handleTutorCertificateSubmission = () => {
      let certificatePromise = null
      if (!isProfile.value) {
        const formDataCertificate = new FormData()
        formDataCertificate.append("subject_id", data.value.certificate.subjectId)
        formDataCertificate.append("certificate", data.value.certificate.name)
        formDataCertificate.append("description", data.value.certificate.description)
        formDataCertificate.append("issued_by", data.value.certificate.issuedBy)
        formDataCertificate.append("years_from", data.value.certificate.yearFrom)
        formDataCertificate.append("years_to", data.value.certificate.yearTo)
        formDataCertificate.append("attachment", certificateSelected.value)

        certificatePromise = axiosClient.post("/tutor/certifications/create", formDataCertificate, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        })
      }

      Promise.allSettled([certificatePromise])
        .then(() => {
          handleTutorVideoSubmission()
        })
        .catch(() => {
          handleSubmissionError(t("errors.sign-up-certificate-add"))
        })
    }

    const handleTutorHourlyPriceSubmission = () => {
      const formDataHourlyPrice = new FormData()
      formDataHourlyPrice.append("price", data.value.hourlyPrice)

      axiosClient
        .post("/tutor/hourly-price", formDataHourlyPrice, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        })
        .then(() => {
          handleTutorCertificateSubmission()
        })
        .catch(() => {
          handleSubmissionError(t("errors.sign-up-price-add"))
        })
    }

    const handleTutorAvailabilitySubmission = () => {
      const availabilityArray = []
      const existingAvailabilities = {} // Store existing availabilities by day ID

      // Fetch existing availabilities and map them by day ID
      axiosClient.get("/profile").then((profileResponse) => {
        const userAvailabilities = profileResponse.data.result.availabilities
        userAvailabilities.forEach((availability) => {
          if (!existingAvailabilities[availability.day_id]) {
            existingAvailabilities[availability.day_id] = []
          }
          existingAvailabilities[availability.day_id].push(availability)
        })

        // Process availability data
        Object.keys(data.value.availability).forEach((element) => {
          data.value.availability[element].hours.forEach((hour) => {
            const existingAvailability = existingAvailabilities[
              data.value.availability[element].id
            ]?.find(
              (existingHour) =>
                existingHour.hour_from === hour.from && existingHour.hour_to === hour.to
            )
            availabilityArray.push({
              status: 1,
              timezone_id: 1,
              day_id: data.value.availability[element].id,
              hour_from: hour.from,
              hour_to: hour.to,
              id: existingAvailability ? existingAvailability.id : null // Add this line to include the id if it exists
            })
          })
        })

        const availabilitiesPromise = availabilityArray.map((element) => {
          const formDataElement = new FormData()
          formDataElement.append("status", element.status)
          formDataElement.append("timezone_id", element.timezone_id)
          formDataElement.append("day_id", element.day_id)
          if (element.hour_from && element.hour_to) {
            formDataElement.append("hour_from", element.hour_from)
            formDataElement.append("hour_to", element.hour_to)

            // Check if id exists to determine if it's an update or create
            if (element.id) {
              return axiosClient.post(
                `/tutor/availabilities/update/${element.id}`,
                formDataElement,
                {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                  }
                }
              )
            }
            return axiosClient.post("/tutor/availabilities/create", formDataElement, {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
              }
            })
          }
        })

        Promise.allSettled(availabilitiesPromise)
          .then(() => {
            handleTutorHourlyPriceSubmission()
          })
          .catch(() => {
            handleSubmissionError(t("errors.sign-up-availability-add"))
          })
      })
    }

    const handleTutorBiographySubmission = () => {
      const formDataBiography = new FormData()
      formDataBiography.append("headline", data.value.headline)
      formDataBiography.append("interests", data.value.interests)
      formDataBiography.append("motivation", data.value.motivation)
      formDataBiography.append("specialization_id", data.value.specializationId)
      formDataBiography.append("experience", data.value.experience)
      formDataBiography.append("methodology", data.value.methodology)

      axiosClient
        .post("/tutor/description", formDataBiography, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        })
        .then(() => {
          handleTutorAvailabilitySubmission()
        })
        .catch(() => {
          handleSubmissionError(t("errors.sign-up-biography-add"))
        })
    }

    // Form validation setup
    const handleFormValidation = () => {
      validation.push(
        FormValidation.formValidation(form.value, {
          fields: {
            "account-type": {
              validators: {
                notEmpty: {
                  message: t("global.account-type-required")
                }
              }
            }
          },
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
              eleInvalidClass: "",
              eleValidClass: ""
            })
          }
        })
      )

      const checkEmailExists = async (email) => {
        try {
          const response = await axiosClient.get(`/check-email/${email}`)
          return response.data.exists
        } catch (error) {
          console.error(error)
          return false
        }
      }

      validation.push(
        FormValidation.formValidation(form.value, {
          fields: {
            ...(!isProfile.value
              ? {
                  avatar: {
                    validators: {
                      notEmpty: {
                        message: t("global.avatar-required")
                      }
                    }
                  }
                }
              : {}),
            "first-name": {
              validators: {
                notEmpty: {
                  message: t("global.first-name-required")
                }
              }
            },
            "last-name": {
              validators: {
                notEmpty: {
                  message: t("global.last-name-required")
                }
              }
            },
            "email": {
              validators: {
                notEmpty: {message: t("global.email-required")},
                regexp: {
                  regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("global.email-in-valid")
                },
                async: {
                  message: t("global.email-already-exists"),
                  callback: async (input) => {
                    const isEmailExists = await checkEmailExists(input.value)
                    return !isEmailExists
                  }
                }
              }
            },
            ...(!isProfile.value
              ? {
                  "password": {
                    validators: {
                      notEmpty: {message: t("global.password-required")},
                      callback: {
                        message: t("global.password-in-valid"),
                        callback(input) {
                          if (input.value.length > 0) {
                            return validatePassword()
                          }
                        }
                      }
                    }
                  },
                  "confirm-password": {
                    validators: {
                      notEmpty: {message: t("global.password-confirm-required")},
                      identical: {
                        message: t("global.password-confirm-not-same"),
                        compare() {
                          return formPassword.value.input.value
                        }
                      }
                    }
                  }
                }
              : {})
          },
          plugins: {
            trigger: new FormValidation.plugins.Trigger({
              event: {password: false, email: "keyup change"}
            }),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
              eleInvalidClass: "",
              eleValidClass: ""
            })
          }
        })
      )

      validation.push(
        FormValidation.formValidation(form.value, {
          fields: {
            "date-of-birth": {
              validators: {
                notEmpty: {
                  message: t("global.sign-up-date-of-birth-required")
                }
              }
            },
            "phone-number": {
              validators: {
                notEmpty: {
                  message: t("global.sign-up-phone-number-required")
                }
              }
            },
            "country": {
              validators: {
                notEmpty: {
                  message: t("global.sign-up-country-required")
                }
              }
            },
            "native-language": {
              validators: {
                notEmpty: {
                  message: t("global.sign-up-native-language-required")
                }
              }
            },
            "teaching-subject": {
              validators: {
                notEmpty: {
                  message: t("global.sign-up-teaching-subject-required")
                }
              }
            },
            "teaching-experience": {
              validators: {
                notEmpty: {
                  message: t("global.sign-up-teaching-experience-required")
                }
              }
            },
            "situation": {
              validators: {
                notEmpty: {
                  message: t("global.situation-required")
                }
              }
            }
          },
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
              eleInvalidClass: "",
              eleValidClass: ""
            })
          }
        })
      )

      validation.push(
        FormValidation.formValidation(form.value, {
          fields: {
            headline: {
              validators: {
                notEmpty: {
                  message: t("global.headline-required")
                }
              }
            },
            interests: {
              validators: {
                notEmpty: {
                  message: t("global.interests-required")
                }
              }
            },
            motivation: {
              validators: {
                notEmpty: {
                  message: t("global.motivation-required")
                }
              }
            },
            specialization: {
              validators: {
                notEmpty: {
                  message: t("global.specialization-required")
                }
              }
            },
            experience: {
              validators: {
                notEmpty: {
                  message: t("global.experience-required")
                }
              }
            },
            methodology: {
              validators: {
                notEmpty: {
                  message: t("global.methodology-required")
                }
              }
            }
          },
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
              eleInvalidClass: "",
              eleValidClass: ""
            })
          }
        })
      )

      validation.push(false)

      validation.push(
        FormValidation.formValidation(form.value, {
          fields: {
            "hourly-price": {
              validators: {
                notEmpty: {
                  message: t("global.hourly-price-required")
                }
              }
            }
          },
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
              eleInvalidClass: "",
              eleValidClass: ""
            })
          }
        })
      )

      validation.push(
        FormValidation.formValidation(form.value, {
          fields: !isProfile.value
            ? {
                "certificate-subject": {
                  validators: {
                    notEmpty: {
                      message: t("global.certificate-subject-is-required")
                    }
                  }
                },
                "certificate-name": {
                  validators: {
                    notEmpty: {
                      message: t("global.certificate-name-is-required")
                    }
                  }
                },
                "certificate-description": {
                  validators: {
                    notEmpty: {
                      message: t("global.certificate-description-is-required")
                    }
                  }
                },
                "certificate-year-from": {
                  validators: {
                    notEmpty: {
                      message: t("global.certificate-year-from-is-required")
                    }
                  }
                },
                "certificate-year-to": {
                  validators: {
                    notEmpty: {
                      message: t("global.certificate-year-to-is-required")
                    }
                  }
                },
                "certificate-file": {
                  validators: {
                    notEmpty: {
                      message: t("global.certificate-file-is-required")
                    }
                  }
                }
              }
            : {},
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
              eleInvalidClass: "",
              eleValidClass: ""
            })
          }
        })
      )

      validation.push(
        FormValidation.formValidation(form.value, {
          fields: !isProfile.value
            ? {
                "video-file": {
                  validators: {
                    notEmpty: {
                      message: t("global.video-file-is-required")
                    }
                  }
                }
              }
            : {},
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
              rowSelector: ".fv-row",
              eleInvalidClass: "",
              eleValidClass: ""
            })
          }
        })
      )
    }

    const handleTutorFormSubmission = () => {
      const formDataPersonal = new FormData()
      formDataPersonal.append(["first", "name"].join("_"), data.value.firstName)
      formDataPersonal.append(["last", "name"].join("_"), data.value.lastName)
      formDataPersonal.append(["date", "of", "birth"].join("_"), data.value.dateOfBirth)
      formDataPersonal.append("phone", data.value.phoneNumber)
      formDataPersonal.append(["country", "id"].join("_"), data.value.countryId)
      formDataPersonal.append(["language", "id"].join("_"), data.value.languageId)
      formDataPersonal.append(["subject", "id"].join("_"), data.value.subjectId)
      formDataPersonal.append(["experience", "id"].join("_"), data.value.experienceId)
      formDataPersonal.append(["situation", "id"].join("_"), data.value.situationId)
      formDataPersonal.append(["level", "id"].join("_"), 0)

      //if (data.value.accountType === "student" || isProfile) {
      //}
      axiosClient
        .post("/tutor/about", formDataPersonal, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        })
        .then(() => {
          handleTutorBiographySubmission()
        })
        .catch(() => {
          handleSubmissionError(t("errors.sign-up-personal-information-add"))
        })
    }

    const handleStudentFormSubmission = () => {
      const formDataPersonal = new FormData()
      formDataPersonal.append(["first", "name"].join("_"), data.value.firstName)
      formDataPersonal.append(["last", "name"].join("_"), data.value.lastName)
      formDataPersonal.append("avatar", avatarSelected.value)
      formDataPersonal.append("email", data.value.email.toLowerCase())

      axiosClient
        .post("/update-profile", formDataPersonal, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        })
        .then(() => {})
        .catch(() => {})
    }

    const handleFormSubmission = () => {
      if (formButtonSubmit.value.getAttribute("data-kt-indicator") === "on") {
        return
      }
      validation[stepperInstance.getCurrentStepIndex() - 1].validate().then((status) => {
        if (status.toString().toLowerCase() === "valid") {
          if (
            data.value.accountType === "tutor" &&
            videoSelected.value &&
            videoExtension.value !== "video/mp4"
          ) {
            Swal.fire({
              icon: "error",
              text: t("errors.video-extension"),
              confirmButtonText: t("global.got-it"),
              buttonsStyling: false,
              customClass: {confirmButton: "btn btn-danger"}
            })
            return
          }

          formButtonSubmit.value.setAttribute("data-kt-indicator", "on")
          formButtonSubmit.value.disable = true
          formButtonSubmit.value.ariaDisabled = true

          const formData = new FormData()
          formData.append("name", `${data.value.firstName} ${data.value.lastName}`)
          formData.append("email", data.value.email.toLowerCase())
          formData.append("avatar", avatarSelected.value)
          formData.append("password", data.value.password)
          formData.append(["password", "confirmation"].join("_"), data.value.passwordConfirmation)
          formData.append("type", data.value.accountType === "tutor" ? 2 : 1)

          store
            .dispatch(isProfile.value ? "changeName" : "signUp", formData)
            .then((response) => {
              if (data.value.accountType === "tutor" && isProfile.value) {
                handleTutorFormSubmission()
              } else if (isProfile.value && data.value.accountType === "student") {
                handleStudentFormSubmission()
              } else {
                handleSuccessfulSubmission()
              }
            })
            .catch((error) => {
              // if (error.response.data.message === "email-duplicated") {
              //   handleSubmissionError(t("errors.email-used"))
              // } else {
              //   handleSubmissionError(t("errors.sign-up-creating-account-error"))
              // }
            })
            .finally(() => {
              resetFormButton()
            })
        } else {
          handleInvalidFormFields()
        }
      })
    }

    onBeforeMount(() => {
      loading.value = true
    })

    // Stepper initialization and events
    let stepperInstance
    let passwordMeter = null

    const updateNavigation = (next, previous, submit) => {
      navigation.value = {next, previous, submit}
    }

    const setupStepperNavigation = (length) => {
      if (stepperInstance.getCurrentStepIndex() === 1) {
        updateNavigation(true, false, false)
      }
      if (
        stepperInstance.getCurrentStepIndex() > 1 &&
        stepperInstance.getCurrentStepIndex() <= length - 1
      ) {
        updateNavigation(true, true, false)
      }
      if (stepperInstance.getCurrentStepIndex() === length) {
        updateNavigation(false, true, true)
      }
    }

    const initializeStepper = () => {
      const stepperElement = document.querySelector("#kt_create_account_stepper")
      if (!stepperElement) return
      stepperInstance = new KTStepper(stepperElement)

      if (isProfile.value) {
        stepperInstance.goNext()
      }

      if (route.query.type) {
        stepperInstance.goNext()
        const length = data.value.accountType === "tutor" ? 8 : 2
        setupStepperNavigation(length)
      }

      stepperInstance.on("kt.stepper.changed", () => {
        // eslint-disable-next-line no-nested-ternary
        const length = data.value.accountType === "tutor" ? (isProfile.value ? 7 : 8) : 2
        setupStepperNavigation(length)
      })

      stepperInstance.on("kt.stepper.next", (stepper) => {
        validateStep(stepper)
      })

      stepperInstance.on("kt.stepper.previous", (stepper) => {
        stepper.goPrevious()
        KTUtil.scrollTop()
      })
    }

    const fetchProfileData = async () => {
      try {
        const profileResponse = await axiosClient.get("/profile")
        const user = profileResponse.data.result
        populateProfileData(user)
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        loading.value = false
      }
    }

    // Fetch data functions
    const fetchData = () => {
      if (isProfile.value) {
        fetchProfileData()
      } else {
        loading.value = false
      }

      if (!isProfile.value) {
        KTPasswordMeter.createInstances("[data-kt-password-meter]")
        passwordMeter = KTPasswordMeter.getInstance(formPasswordMeter.value)
      }
    }

    const populateTutorData = (user) => {
      const tutorAvailabilities = {
        monday: {id: 1, hours: []},
        tuesday: {id: 2, hours: []},
        wednesday: {id: 3, hours: []},
        thursday: {id: 4, hours: []},
        friday: {id: 5, hours: []},
        saturday: {id: 6, hours: []},
        sunday: {id: 7, hours: []}
      }

      Object.keys(tutorAvailabilities).forEach((tutorAvailability) => {
        user.availabilities.forEach((userAvailability) => {
          if (tutorAvailabilities[tutorAvailability].id === userAvailability.day?.id) {
            tutorAvailabilities[tutorAvailability].hours.push({
              from: userAvailability.hour_from,
              to: userAvailability.hour_to,
              id: userAvailability.id
            })
          }
        })

        tutorAvailabilities[tutorAvailability].hours.push({
          from: "",
          to: ""
        })
      })

      data.value.dateOfBirth = user.abouts[0].date_of_birth
      data.value.phoneNumber = user.abouts[0].phone
      data.value.countryId = user.abouts[0].country_id
      data.value.languageId = user.abouts[0].language_id
      data.value.subjectId = user.abouts[0].subject_id
      data.value.experienceId = user.abouts[0].experience_id
      data.value.situationId = user.abouts[0].situation_id
      data.value.headline = user.descriptions[0].headline
      data.value.interests = user.descriptions[0].interests
      data.value.motivation = user.descriptions[0].motivation
      data.value.specializationId = user.descriptions[0].specialization_id
      data.value.experience = user.descriptions[0].experience
      data.value.methodology = user.descriptions[0].methodology
      data.value.availability = tutorAvailabilities
      data.value.hourlyPrice = user.hourlyPrices[0].price
    }

    const populateProfileData = (user) => {
      if (user.abouts && user.abouts.length > 0) {
        data.value.firstName = user.abouts[0].first_name
        data.value.lastName = user.abouts[0].last_name
      }
      data.value.accountType = Number(user.type) === 2 ? "tutor" : "student"
      data.value.avatar = user.avatar
        ? `https://learning.jinnedu.com/${user.avatar}`
        : "https://learning.jinnedu.com/static/default_avatar.webp"
      data.value.email = user.email
      if (data.value.accountType === "tutor") {
        populateTutorData(user)
      }
    }

    onMounted(() => {
      initializeStepper()
      handleFormValidation()
      fetchData()
      handleDropdownChanges()

      // Initialize UI components on DOM content loaded
      KTUtil.onDOMContentLoaded(() => {
        KTComponents.init()
        KTThemeMode.init()
        KTThemeModeUser.init()
        KTImageInput.init()
      })
    })

    // Step validation functions
    const validateStep = (stepper) => {
      const currentStep = stepper.getCurrentStepIndex()
      const validator = validation[currentStep - 1]

      if (currentStep === 5 && !validateAvailability()) return

      if (validator) {
        validator.validate().then((status) => {
          if (status.toLowerCase() === "valid") {
            handleValidStep(stepper, currentStep)
          } else {
            showValidationError()
          }
        })
      } else {
        stepper.goNext()
        KTUtil.scrollTop()
      }
    }

    const validateAvailability = () => {
      if (!isAvailabilityHasAtLeastOneTime()) {
        showError(t("errors.sign-up-no-available-time"))
        return false
      }
      if (!isAvailabilityLogicallyCorrect()) {
        showError(t("errors.sign-up-available-time-in-valid"))
        return false
      }
      return true
    }

    const isAvailabilityHasAtLeastOneTime = () => {
      let flag = false
      Object.keys(data.value.availability).forEach((key) => {
        data.value.availability[key].hours.forEach((hour) => {
          if (hour.from && hour.to) flag = true
        })
      })
      return flag
    }

    const isAvailabilityLogicallyCorrect = () => {
      let flag = true
      Object.keys(data.value.availability).forEach((key) => {
        data.value.availability[key].hours.forEach((hour) => {
          if (hour.from && hour.to) {
            const fromFinal = getTimeAsDecimal(hour.from)
            const toFinal = getTimeAsDecimal(hour.to)
            if (toFinal - fromFinal < 0 || toFinal === fromFinal) flag = false
          }
        })
      })
      return flag
    }

    const getTimeAsDecimal = (time) => {
      const [hour, minute] = time.split(":")
      const hourValue = hour === "00" ? 24 : hour
      return `${hourValue}.${minute}`
    }

    const handleValidStep = (stepper, currentStep) => {
      if (currentStep === 2) {
        handleEmailCheck(stepper)
      } else if (currentStep === 3) {
        if (!validatePersonalInfo()) return
        stepper.goNext()
        KTUtil.scrollTop()
      } else if (currentStep === 6) {
        if (!validateHourlyPrice()) return
        stepper.goNext()
        KTUtil.scrollTop()
      } else if (!isProfile.value && currentStep === 7) {
        if (!validateCertificateYear()) return
        stepper.goNext()
        KTUtil.scrollTop()
      } else {
        stepper.goNext()
        KTUtil.scrollTop()
      }
    }

    const handleEmailCheck = (stepper) => {
      const formData = new FormData()
      formData.append("email", data.value.email.toLowerCase())
      if (isProfile.value) {
        axiosClient.get("/profile").then((profileResponse) => {
          const user = profileResponse.data.result
          formData.append("user_id", user.id)
          // checkEmailAvailability(formData, stepper)
          axiosClient
            .post("/check_mail", formData)
            .then((response) => {
              const profileUpdateData = new FormData()
              if (response.data.success) {
                profileUpdateData.append("first_name", `${data.value.firstName}`)
                profileUpdateData.append("last_name", `${data.value.lastName}`)
                profileUpdateData.append("email", data.value.email.toLowerCase())
                if (avatarSelected.value) {
                  profileUpdateData.append("avatar", avatarSelected.value)
                }

                // profileUpdateData.append("password", data.value.password)
                axiosClient.post("/update-profile", profileUpdateData).then(() => {
                  router.push({name: "index"})
                  Swal.fire({
                    icon: "success",
                    text: t("global.profile_updated_successfully"),
                    buttonsStyling: false,
                    customClass: {confirmButton: "btn btn-primary"}
                  })
                })
              } else {
                showError(t("errors.email-used"))
              }
            })
            .catch((error) => {
              console.error("Error checking email:", error)
              if (
                error.response &&
                error.response.data.message === "The email has already been taken."
              ) {
                showError(t("errors.email-used"))
              }
            })
        })
      } else {
        checkEmailAvailability(formData, stepper)
      }
    }

    const checkEmailAvailability = (formData, stepper) => {
      axiosClient
        .post("/check_mail", formData)
        .then((response) => {
          if (response.data.success) {
            fetchConstantsData(stepper)
          } else {
            showError(t("errors.email-used"))
          }
        })
        .catch((error) => {
          console.error("Error checking email:", error)
          if (
            error.response &&
            error.response.data.message === "The email has already been taken."
          ) {
            showError(t("errors.email-used"))
          }
        })
    }

    const fetchConstantsData = (stepper) => {
      loading.value = true
      const countriesPromise = axiosClient.get("/front/constants/countries?limit=500")
      const languagesPromise = axiosClient.get("/front/constants/languages?limit=500")
      const subjectsPromise = axiosClient.get("/front/constants/subjects")
      const experiencesPromise = axiosClient.get("/front/constants/experiences")
      const situationsPromise = axiosClient.get("/front/constants/situations")
      const specializationsPromise = axiosClient.get("/front/constants/specializations")

      Promise.allSettled([
        countriesPromise,
        languagesPromise,
        subjectsPromise,
        experiencesPromise,
        situationsPromise,
        specializationsPromise
      ])
        .then((responses) => {
          countries.value = responses[0].value.data.result.data
          languages.value = responses[1].value.data.result.data
          subjects.value = responses[2].value.data.result.data
          experiences.value = responses[3].value.data.result.data
          situations.value = responses[4].value.data.result.data
          specializations.value = responses[5].value.data.result.data
          loading.value = false
          stepper.goNext()
          KTUtil.scrollTop()
        })
        .catch((error) => {
          console.error("Error fetching constants data:", error)
          loading.value = false
        })
    }

    const validatePersonalInfo = () => {
      if (
        !data.value.dateOfBirth ||
        new Date(
          Number(data.value.dateOfBirth.split("-")[0]) + 18,
          Number(data.value.dateOfBirth.split("-")[1]) - 1,
          Number(data.value.dateOfBirth.split("-")[2])
        ) > new Date()
      ) {
        showError(t("errors.sign-up-too-young"))
        return false
      }
      if (Number.isNaN(Number(data.value.phoneNumber))) {
        showError(t("errors.sign-up-phone-number-in-valid"))
        return false
      }
      return true
    }

    const validateHourlyPrice = () => {
      if (data.value.hourlyPrice < 1 || data.value.hourlyPrice > 50) {
        showError(t("errors.sign-up-price-in-valid"))
        return false
      }
      return true
    }

    const validateCertificateYear = () => {
      const isYear = (year) => Number(year) >= 1960 && Number(year) <= 2023
      if (!isYear(data.value.certificate.yearFrom) || !isYear(data.value.certificate.yearTo)) {
        showError(t("errors.sign-up-certificate-year-in-valid"))
        return false
      }
      return true
    }

    return {
      t,
      background,
      token,
      loading,
      data,
      isProfile,
      countries,
      languages,
      subjects,
      experiences,
      situations,
      specializations,
      form,
      formPassword,
      formPasswordMeter,
      formButtonSubmit,
      navigation,
      handleFileInputChange,
      handleCertificateFileInputChange,
      handleVideoFileInputChange,
      handleInputPassword,
      handleFormSubmission
    }
  }
})
</script>

<style>
.stepper-icon {
  --bs-stepper-icon-bg-color-current: var(--bs-warning);
}

.stepper .btn[data-kt-stepper-action="previous"],
.stepper .btn[data-kt-stepper-action="next"],
.stepper .btn[data-kt-stepper-action="submit"],
.stepper .btn[data-kt-stepper-action="finish"] {
  display: flex;
  justify-content: center;
  align-items: center;
}

:root[data-bs-theme="dark"] .image-input-placeholder {
  background-image: url("../../../src/assets/media/svg/files/blank-image-dark.svg");
}

.image-input-placeholder {
  background-image: url("../../../src/assets/media/svg/files/blank-image.svg");
}

html[dir="rtl"] .icon-rotate-rtl {
  transform: rotate(180deg);
}
</style>
