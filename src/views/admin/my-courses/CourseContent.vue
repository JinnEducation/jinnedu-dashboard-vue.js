<template>
  <div class="course-content">

    <!-- Title -->
    <h2 class="item-title">
      {{ title }}
    </h2>

    <!-- Media -->
    <div class="media-wrapper">

      <!-- VIDEO / RECORDING -->
      <VideoPlayer v-if="isVideo" class="video-player" @ended="onVideoEnded" :sources="videoSource" />

      <!-- ZOOM -->
      <div v-else-if="isZoom" class="zoom-box">
        <p class="zoom-status">
          {{ zoomStatusText }}
        </p>

        <a v-if="canJoinZoom" :href="zoomJoinUrl" target="_blank" class="btn btn-primary">
          {{ t("global.join_session") }}
        </a>
      </div>

      <!-- FALLBACK -->
      <div v-else class="no-media">
        {{ t("global.no_content") }}
      </div>


    </div>

    <!-- Description -->
    <p v-if="item.description" class="description">
      {{ item.description }}
    </p>

    <!-- Actions -->
    <div class="actions">

      <button class="btn btn-primary" :disabled="!hasPrev" @click="$emit('prev')">
        {{ t("global.previous") }}
      </button>

      <button class="btn btn-primary" :disabled="!hasNext" @click="$emit('next')">
        {{ t("global.next") }}
      </button>

      <button v-if="!item.completed" class="btn btn-success" @click="$emit('complete')">
        {{ t("global.completed") }}
      </button>

    </div>


  </div>
</template>

<script setup>
import { computed } from 'vue'
import VideoPlayer from '@/components/dashboard/VideoPlayer.vue'
import { useI18n } from "vue-i18n"


const { t } = useI18n()
const emit = defineEmits(["complete", "prev", "next"]);

/* =========================
  PROPS
========================= */
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  hasPrev: {
    type: Boolean,
    default: true
  },
  hasNext: {
    type: Boolean,
    default: true
  }
})

/* =========================
  COMPUTED
========================= */
const title = computed(() => {
  if (props.item.langs?.length) {
    return props.item.langs[0].title
  }
  return props.item.title || '—'
})

function onVideoEnded() {
  // ❗ أهم سطر
  if (props.item.completed) return;

  emit("complete");
}
/* ---------- TYPE CHECK ---------- */
const isVideo = computed(() => {
  return [
    'lesson_video',
    'intro_recording',
    'workshop_recording'
  ].includes(props.item.type)
})

const isZoom = computed(() => {
  return [
    'intro_zoom',
    'workshop_zoom'
  ].includes(props.item.type)
})

/* ---------- MEDIA ---------- */
const mediaUrl = computed(() =>
  props.item?.media?.find(m => m?.media_url)?.media_url ?? null
)
function detectVideoType(url) {
  if (!url) return null;

  const cleanUrl = url.split('?')[0].toLowerCase();

  if (cleanUrl.endsWith('.m3u8')) {
    return 'application/x-mpegURL';
  }

  if (cleanUrl.endsWith('.mpd')) {
    return 'application/dash+xml';
  }

  if (cleanUrl.endsWith('.mp4')) {
    return 'video/mp4';
  }

  if (cleanUrl.endsWith('.webm')) {
    return 'video/webm';
  }

  return 'video/mp4'; // fallback
}
const videoSource = computed(() => {
  if (!mediaUrl.value) return [];

  return [
    {
      src: mediaUrl.value,
      type: detectVideoType(mediaUrl.value)
    }
  ];
});


/* ---------- ZOOM ---------- */
const zoomJoinUrl = computed(() => {
  return props.item.live_session?.join_url_attendee || null
})

const zoomStart = computed(() => {
  return props.item.live_session?.start_at
    ? new Date(props.item.live_session.start_at.replace('Z', ''))
    : null
})

const zoomEnd = computed(() => {
  return props.item.live_session?.end_at
    ? new Date(props.item.live_session.end_at.replace('Z', ''))
    : null
})

const now = () => new Date()

const canJoinZoom = computed(() => {
  if (!zoomStart.value || !zoomEnd.value) return false
  const n = now()
  return n >= zoomStart.value && n <= zoomEnd.value
})

const zoomStatusText = computed(() => {
  if (!zoomStart.value || !zoomEnd.value) {
    return t('global.live_session')
  }

  const n = now()
  if (n < zoomStart.value) return t('global.session_not_started')
  if (n > zoomEnd.value) return t('global.session_ended')
  return t('global.session_live_now')
})

</script>

<style scoped>
.course-content {
  padding: 24px;
}

.item-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}

.media-wrapper {
  margin-bottom: 16px;
}

.video-player {
  width: 100%;
  max-height: 480px;
  background: #000;
}

.zoom-box {
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.zoom-status {
  margin-bottom: 12px;
  font-weight: 500;
}

.description {
  margin: 16px 0;
  color: #555;
}

.actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  padding: 10px 18px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-success {
  background: #0d9488;
  color: #fff;
  border-color: #0d9488;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.no-media {
  padding: 24px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
