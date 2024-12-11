<script setup lang="ts">
import type { FileItem } from '../types'; // 导入 FileItem 类型

import FileListItem from './file-list-item.vue'; // 导入 FileListItem 组件

// 定义 fileList 变量，类型为 FileItem 数组
const fileList = defineModel<FileItem[]>('fileList');

function deleteFile(id: string) {
  if (fileList.value) {
    const index = fileList.value.findIndex((item) => item.id === id);
    if (~index) {
      const cloneFileList = [...fileList.value];
      cloneFileList.splice(index, 1);
      fileList.value = cloneFileList;
    }
  }
}
</script>

<template>
  <TransitionGroup
    v-if="fileList && fileList.length > 0"
    :class="{ 'border-destructive': $attrs.isInValid }"
    class="border-border relative w-full rounded-lg border p-[10px] transition-colors"
    name="list"
    tag="ul"
  >
    <FileListItem
      v-for="(file, fileIndex) in fileList"
      :key="file.id"
      v-model:file="fileList[fileIndex]"
      @delete="deleteFile"
    />
  </TransitionGroup>
</template>

<style scoped>
/* 定义过渡动画的样式 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease; /* 所有属性在 0.5 秒内平滑过渡 */
}

.list-enter-from,
.list-leave-to {
  opacity: 0; /* 进入和离开时设置透明度为 0 */
  transform: translateX(30px); /* 进入和离开时向右移动 30 像素 */
}

.list-leave-active {
  position: absolute;
}
</style>
