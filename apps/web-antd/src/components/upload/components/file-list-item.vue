<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'; // 导入 Vue 的响应式 API

import {
  MdiFileDelete,
  MdiReload,
  PHAudio,
  PHImage,
  PhVideo,
} from '@vben/icons'; // 导入图标组件
import { isHttpUrl, isString } from '@vben/utils'; // 导入工具函数

import { Progress } from 'ant-design-vue'; // 导入进度条组件

import { PopoverPreviewFile } from '#/components/popover-preview-file';

import { UPLOAD_FILE_TYPE } from '../helper';
import { type FileItem, UPLOAD_FILE_STATUS } from '../types';

const emits = defineEmits<{
  (event: 'delete', id: string): void;
}>();

// 导入类型定义

// 定义 file 模型，用于双向绑定文件信息
const file = defineModel<FileItem>('file');

const fileType = inject<UPLOAD_FILE_TYPE>('fileType', UPLOAD_FILE_TYPE.PICTURE);

// 定义上传进度和状态的响应式引用
const progress = ref(0); // 上传进度
const uploadStatus = ref<UPLOAD_FILE_STATUS>(); // 上传状态

// 组件挂载后执行
onMounted(() => {
  // 检查文件是否是有效的 HTTP URL
  const isSuc = isString(file.value?.file) && isHttpUrl(file.value?.file);
  uploadStatus.value = isSuc
    ? UPLOAD_FILE_STATUS.SUCCESS // 如果是有效 URL，设置状态为成功
    : UPLOAD_FILE_STATUS.UPLOADING; // 否则，设置状态为上传中

  // 如果不是有效 URL，则开始上传
  if (!isSuc) {
    upload();
  }
});

// 计算属性：根据上传状态返回颜色
const statusColor = computed(() => {
  switch (uploadStatus.value) {
    case UPLOAD_FILE_STATUS.FAIL: {
      return 'hsl(var(--destructive-500))'; // 失败状态的颜色
    }
    case UPLOAD_FILE_STATUS.SUCCESS: {
      return 'hsl(var(--primary-500))'; // 成功状态的颜色
    }
    case UPLOAD_FILE_STATUS.UPLOADING: {
      return 'hsl(var(--yellow-500))'; // 上传中状态的颜色
    }
    default: {
      return ''; // 默认颜色
    }
  }
});

// 上传文件的异步函数
async function upload() {
  try {
    if (!file.value) return; // 如果没有文件则返回
    // TODO 上传文件

    // 为了兼容动画执行完成
    setTimeout(() => {
      if (!file.value) return; // 如果没有文件则返回
      uploadStatus.value = UPLOAD_FILE_STATUS.FAIL; // 设置状态为成功
      progress.value = 0;
      // file.value = { ...file.value, file: '' }; // 更新文件信息
    }, 240);
  } catch {
    uploadStatus.value = UPLOAD_FILE_STATUS.FAIL; // 上传失败时设置状态为失败
    progress.value = 0;
  }
}

// 重新上传
function reloadUpload() {
  uploadStatus.value = UPLOAD_FILE_STATUS.UPLOADING;
  upload();
}

// 删除文件
function deleteFile() {
  if (file.value) {
    emits('delete', file.value.id);
  }
}
</script>

<template>
  <li
    :style="{ color: statusColor }"
    class="flex w-full items-center justify-between"
  >
    <!-- 显示链接图标 -->
    <PHAudio v-if="fileType === UPLOAD_FILE_TYPE.AUDIO" class="text-[22px]" />
    <PHImage v-if="fileType === UPLOAD_FILE_TYPE.PICTURE" class="text-[22px]" />
    <PhVideo v-if="fileType === UPLOAD_FILE_TYPE.VIDEO" class="text-[22px]" />
    <template v-if="uploadStatus === UPLOAD_FILE_STATUS.SUCCESS">
      <!-- 上传成功时显示的文本 -->
      <PopoverPreviewFile
        v-if="isString(file?.file) && isHttpUrl(file?.file)"
        :file-type="fileType"
        :src="file.file"
      />
    </template>
    <div class="relative flex flex-1 items-center justify-center">
      <template v-if="uploadStatus === UPLOAD_FILE_STATUS.UPLOADING">
        <!-- 上传中显示的文本 -->
        <span>正在上传中...</span>
        <Progress
          :percent="progress"
          :show-info="false"
          :size="2"
          :stroke-color="statusColor"
          class="pointer-events-none absolute bottom-[-50%] mx-2 my-0"
          status="active"
        />
      </template>
      <template v-if="uploadStatus === UPLOAD_FILE_STATUS.FAIL">
        <!-- 上传失败时显示的文本 -->
        <span>上传失败</span>
      </template>
    </div>
    <!-- 重新上传 -->
    <div
      v-if="uploadStatus === UPLOAD_FILE_STATUS.FAIL"
      class="mr-1 cursor-pointer"
      @click="reloadUpload"
    >
      <MdiReload class="text-destructive-500 text-[22px]" />
    </div>
    <!-- 删除图标 -->
    <div
      v-if="uploadStatus !== UPLOAD_FILE_STATUS.UPLOADING"
      class="cursor-pointer"
      @click="deleteFile"
    >
      <MdiFileDelete class="text-destructive-500 text-[22px]" />
    </div>
  </li>
</template>
