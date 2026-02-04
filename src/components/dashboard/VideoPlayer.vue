<template>
    <video ref="video" class="video-js vjs-big-play-centered"></video>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default {
    name: "VideoPlayer",
    emits: ["ended"],
    props: {
        sources: { type: Array, required: true }, // mp4 أو m3u8
    },
    mounted() {
        this.player = videojs(this.$refs.video, {
            controls: true,
            responsive: true,
            fluid: true,
            sources: this.sources
        });
        this.player.on("ended", () => {
            this.$emit("ended");
        });
    },
    beforeUnmount() {
        if (this.player) {
            this.player.dispose();
        }
    }
};
</script>
