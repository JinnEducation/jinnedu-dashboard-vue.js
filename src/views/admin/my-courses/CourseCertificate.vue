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

            <button
                class="btn btn-primary btn-download"
                @click="downloadCertificate"
            >
                {{ t("global.download_certificate") }}
            </button>
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
    }
})

/* =========================
  METHODS
========================= */
const downloadCertificate = () => {
    // فتح تب جديد على لارافيل
    window.open(
        `${BASE_URL.value}/admin/student/courses/${props.courseId}/certificate`,
        "_blank"
    )
}
</script>

<style scoped>
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
</style>
