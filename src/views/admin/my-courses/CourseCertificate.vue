<template>
    <div class="course-content">

        <!-- Title -->
        <h2 class="item-title">
            {{ t("global.course_certificate") }}
        </h2>

        <!-- Certificate Box -->
        <div class="certificate-box">
            <p class="certificate-text">
                {{ t("global.certificate_ready") }}
            </p>

            <button class="btn btn-primary btn-download" :disabled="initialStars <= 0" @click="downloadCertificate">
                {{ t("global.download_certificate") }}
            </button>
        </div>

        <div class="card mt-2" v-if="initialStars <= 0">
            <div class="card-body p-0">
                <div class="card-px py-2 my-5">
                    <span class="hint_your">{{ t('global.your_should_set_rate') }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Name Modal -->
    <div v-if="stNameOpen" class="modal-overlay" @click.self="closeStName">
        <div class="modal-box">
            <h4 class="modal-title">
                {{ t("global.write_your_name") }}
            </h4>

            <textarea v-model="stName" class="modal-textarea" :placeholder="t('global.write_your_name')"
                rows="4"></textarea>
            

            <div class="card my-2" v-if="stName == null || stName == ''">
                <div class="card-body p-0">
                    <div class="card-px py-2 my-2">
                        <span class="hint_your">{{ t('global.hint_your_name') }}</span>
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn" @click="closeStName">
                    {{ t("global.cancel") }}
                </button>

                <button class="btn btn-primary" @click="sendCertificate">
                    {{ t("global.send") }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const BASE_URL = ref(import.meta.env.VITE_APP_BASE_URL)

/* =========================
  PROPS
========================= */
const props = defineProps({
    courseId: {
        type: Number,
        required: true
    },
    initialStars: {
        type: Number
    }
})

/* =========================
  METHODS
========================= */
const downloadCertificate = () => {
    openStName()
}
const stNameOpen = ref(false)
const stName = ref(null)

/* فتح المودال */
const openStName = () => {
    stNameOpen.value = true
}

/* إغلاق */
const closeStName = () => {
    stNameOpen.value = false
}

const sendCertificate = () => {
    window.open(
        `${BASE_URL.value}/admin/student/courses/${props.courseId}/certificate?name=${stName.value}`,
        "_blank"
    )
}
</script>

<style scoped>
.hint_your {
    color: #2563eb;
}

.course-content {
    padding: 24px;
    max-width: 720px;
    margin: 0 auto;
}

.item-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 24px;
    text-align: center;
}

.certificate-box {
    padding: 32px;
    border: 2px dashed #d1d5db;
    border-radius: 16px;
    text-align: center;
    background: #fafafa;
}

.certificate-text {
    font-size: 15px;
    color: #374151;
    margin-bottom: 20px;
}

.btn {
    padding: 12px 22px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 15px;
}

.btn-primary {
    background: #2563eb;
    color: #fff;
}

.btn-primary:hover {
    background: #1d4ed8;
}

.btn-download {
    min-width: 220px;
}


.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-box {
    width: 100%;
    max-width: 380px;
    background: #fff;
    border-radius: 14px;
    padding: 16px;
}

.modal-title {
    margin: 0 0 10px;
    font-weight: 600;
}

.modal-textarea {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    resize: none;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>
