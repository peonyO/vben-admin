<script setup lang="ts">
import type Player from 'video.js/dist/types/player';

import { onMounted, ref } from 'vue';

import videojs from 'video.js';

const props = defineProps<{
  className?: string;
  src?: string;
}>();

const player = ref<Player>();
const videoPlayer = ref();

function initVideo() {
  player.value = videojs(videoPlayer.value, {
    autoplay: false,
    controls: true,
    sources: [{ src: props.src }],
  });
}

onMounted(() => {
  initVideo();
});
</script>

<template>
  <video ref="videoPlayer" :class="` ${className} video-js size-full`"></video>
</template>
