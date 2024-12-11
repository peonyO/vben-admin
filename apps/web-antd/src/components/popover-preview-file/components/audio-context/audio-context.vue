<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { MdiPause, MdiPlay } from '@vben/icons';

import dayjs from 'dayjs';
import { Howl } from 'howler';

const props = defineProps<{ src?: string }>();

const audioContext = ref<Howl>();

onMounted(() => {
  initAudio();
});

onUnmounted(() => {
  audioContext.value?.unload();
});

/** 总时长 */
const totalTime = ref<string>('00:00');
/** 播放状态 */
const playStatus = ref<'pause' | 'play'>('pause');
/** 已经播放时长 */
const currentTime = ref<string>('00:00');

function initAudio() {
  if (!props.src) return;
  const defaultConfig = { autoplay: false, html5: true, preload: true };
  audioContext.value = new Howl({
    ...defaultConfig,
    src: props.src,
    onload: audioLoad,
    onplay() {
      playStatus.value = 'play';
      step();
    },
    onpause() {
      playStatus.value = 'pause';
    },
    onend() {
      playStatus.value = 'pause';
    },
  });
}

function audioLoad() {
  const duration = audioContext.value?.duration();
  if (duration) {
    totalTime.value = formatSecondsToHHMMSS(Math.max(duration, 1)) as string;
  }
}

function step() {
  const seek = audioContext.value?.seek();
  if (typeof seek === 'number' && typeof seek === 'number') {
    currentTime.value = formatSecondsToHHMMSS(Math.round(seek)) as string;
  }
  requestAnimationFrame(step);
}

function handleClickAudio() {
  switch (playStatus.value) {
    case 'pause': {
      audioContext.value?.play();
      break;
    }
    case 'play': {
      audioContext.value?.pause();
      break;
    }
    default: {
      break;
    }
  }
}

/**
 * 秒 转换为 HH:MM:SS
 * @param seconds
 * @returns HH:MM:SS || MM:SS
 */
function formatSecondsToHHMMSS(seconds?: number) {
  if (!seconds) return '00:00';
  const d = dayjs.duration(seconds, 'seconds');
  const hours = String(d.hours()).padStart(2, '0');
  const minutes = String(d.minutes()).padStart(2, '0');
  const secs = String(d.seconds()).padStart(2, '0');
  return `${Number(hours) ? `${hours}:` : ''}${minutes}:${secs}`;
}
</script>

<template>
  <div class="flex flex-col items-center p-2">
    <div class="mb-2">
      <div
        class="bg-primary flex size-[50px] cursor-pointer items-center justify-center rounded-full"
        @click="handleClickAudio"
      >
        <MdiPlay
          v-if="playStatus === 'pause'"
          class="text-primary-foreground text-[30px]"
        />
        <MdiPause
          v-if="playStatus === 'play'"
          class="text-primary-foreground text-[30px]"
        />
      </div>
    </div>
    <div>
      <span>{{ currentTime }}/{{ totalTime }}</span>
    </div>
  </div>
</template>
