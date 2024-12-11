<script setup lang="ts">
import { Button, Popover } from 'ant-design-vue';

import { UPLOAD_FILE_TYPE } from '../upload/helper';
import { AudioContext } from './components/audio-context';
import { PictureContext } from './components/picture-context';
import { VideoContext } from './components/video-context';

const props = defineProps<{ fileType?: UPLOAD_FILE_TYPE; src?: string }>();
</script>

<template>
  <div class="flex h-full w-full items-center justify-center" @click.stop>
    <Popover
      arrow-point-at-center
      destroy-tooltip-on-hide
      placement="top"
      trigger="click"
    >
      <template #content>
        <div class="w-[120px]">
          <AudioContext
            v-if="fileType === UPLOAD_FILE_TYPE.AUDIO"
            :src="props.src!"
          />
          <VideoContext
            v-if="fileType === UPLOAD_FILE_TYPE.VIDEO"
            :src="props.src!"
          />
          <PictureContext
            v-if="fileType === UPLOAD_FILE_TYPE.PICTURE"
            :src="props.src!"
          />
        </div>
      </template>
      <slot>
        <Button size="small" type="link">查看文件</Button>
      </slot>
    </Popover>
  </div>
</template>
