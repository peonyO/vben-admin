<script setup lang="ts">
import type { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface';

import { computed, provide, ref, watch } from 'vue'; // 导入 Vue 的 computed 和 ref 函数

import { isHttpUrl, isString } from '@vben/utils'; // 导入工具函数

import { Drawer, Dropdown, Menu } from 'ant-design-vue'; // 导入 Ant Design 组件

import FileList from './components/file-list.vue'; // 导入文件列表组件
import { LibChooseFile } from './components/lib-choose-file'; // 导入库选择文件组件
import { LocalChooseFile } from './components/local-choose-file'; // 导入本地选择文件组件
import {
  checkLocalFiles,
  contextmenuList,
  getUid,
  UPLOAD_TYPE,
} from './helper'; // 导入上传文件类型、检查文件和获取唯一 ID 的辅助函数
import { type FileItem, type UploadProps } from './types'; // 导入类型定义

// 定义组件的属性类型，扩展 UploadProps 接口
interface Props extends UploadProps {}

// 禁用默认属性继承
defineOptions({ inheritAttrs: false });

// 使用 defineProps 定义组件的 props，并设置默认值
const props = withDefaults(defineProps<Props>(), {
  number: 1, // 默认上传文件数量为 1
  type: UPLOAD_TYPE.ALL, // 默认上传类型为 ALL
});

provide('fileType', props.fileType);

// 定义一个模型，用于双向绑定组件的值
const uploadFiles = defineModel<string>('value');

// 定义文件列表的响应式引用
const fileList = ref<FileItem[]>([]);

let isInternalChange: boolean = false; // 标记是否为内部变化

// 监听 uploadFiles 的变化
watch(
  () => uploadFiles.value,
  () => {
    if (!isInternalChange) {
      // 如果不是内部变化，更新文件列表
      fileList.value = uploadFiles.value
        ? uploadFiles.value?.split(',').map((item) => ({
            file: item,
            id: getUid(), // 生成唯一 ID
          }))
        : [];
    }
    isInternalChange = false; // 重置标记
  },
  { immediate: true },
);

// 监听 fileList 的变化
watch(
  () => fileList.value,
  () => {
    isInternalChange = true; // 设置为内部变化
    uploadFiles.value = fileList.value
      .map((item) =>
        isString(item.file) && isHttpUrl(item.file) ? item.file : 'file',
      )
      .join(','); // 更新 uploadFiles
  },
  {
    deep: true, // 深度监听
  },
);

// 计算属性：计算可以上传的文件数量
const canNumber = computed(() => {
  return props.number - fileList.value.length; // 计算剩余可上传的文件数量
});

const localChooseFileRef = ref();

/** @module 拖拽上传 */
// #region
// 处理文件拖放事件
function handleDrop($event: DragEvent) {
  $event.preventDefault(); // 阻止默认行为
  const target = $event.target as HTMLDivElement; // 获取目标元素
  target.classList.remove('draging'); // 移除拖动样式
  const files = $event.dataTransfer?.files; // 获取拖放的文件
  files && localUpload?.([...files]); // 调用本地上传函数
}

// 处理拖拽进入事件
function handleDragenter($event: DragEvent) {
  $event.preventDefault(); // 阻止默认行为
  const target = $event.target as HTMLDivElement; // 获取目标元素
  target.classList.add('draging'); // 添加拖动样式
}

// 处理拖拽悬停事件
function handleDragover($event: DragEvent) {
  $event.preventDefault(); // 阻止默认行为
}

// 处理拖拽离开事件
function handleDragleave($event: DragEvent) {
  const target = $event.target as HTMLDivElement; // 获取目标元素
  target.classList.remove('draging'); // 移除拖动样式
}
// #endregion

// 打开本地选择文件对话框
function openLocalChoose() {
  localChooseFileRef.value?.locationUpload();
}

/** 库上传 */
/** @module 弹窗 */
// #region
const drawerOpen = ref(false);
// #endregion

// 处理菜单点击事件
const handleClickMenu: MenuClickEventHandler = ({ key }) => {
  switch (key) {
    case UPLOAD_TYPE.LIB: {
      drawerOpen.value = true; // 处理库上传
      break;
    }
    case UPLOAD_TYPE.LOCAL: {
      openLocalChoose(); // 打开本地选择文件
      break;
    }
    default: {
      break;
    }
  }
};

// 本地上传文件处理
async function localUpload(files: File[]) {
  const newFiles = await checkLocalFiles(files, {
    maxSize: props.maxSize,
    aspectRatio: props.aspectRatio,
  });
  if (newFiles.length > canNumber.value) {
    const surplusNumber = newFiles.length - canNumber.value;
    newFiles.splice(canNumber.value, surplusNumber);
  }
  fileList.value = [
    ...fileList.value,
    ...newFiles.map((item) => ({ file: item, id: getUid() })), // 更新文件列表
  ];
}

// 库上传文件处理
function libUpload(files: string[]) {
  fileList.value = [
    ...fileList.value,
    ...files.map((item) => ({ file: item, id: getUid() })), // 更新文件列表
  ];
  drawerOpen.value = false;
}
</script>

<template>
  <div class="flex w-full max-w-[300px] flex-col gap-2">
    <Dropdown v-if="!!canNumber" :trigger="['click', 'contextmenu']">
      <div
        class="drag border-border relative box-border flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-[1px] border-dashed p-[10px]"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @dragover="handleDragover"
        @drop="handleDrop"
      >
        <p class="bg-transparent text-center leading-[24px]">
          <span>点击上传</span>
        </p>
      </div>
      <template #overlay>
        <Menu :items="contextmenuList" @click="handleClickMenu" />
      </template>
    </Dropdown>
    <FileList v-model:file-list="fileList" />
  </div>
  <LocalChooseFile
    ref="localChooseFileRef"
    :file-type="fileType"
    @upload="localUpload"
  />
  <Drawer
    v-model:open="drawerOpen"
    :body-style="{ background: 'hsl(var(--background-deep))', padding: '10px' }"
    destroy-on-close
    height="80%"
    placement="bottom"
    title="选择上传文件"
  >
    <LibChooseFile
      :can-number="canNumber"
      :file-type="fileType"
      @upload="libUpload"
    />
  </Drawer>
</template>

<style scoped>
.draging {
  border-color: hsl(var(--primary)); /* 拖动时的边框颜色 */
}

.drag {
  transition: all 0.3s; /* 添加过渡效果 */
}

.drag:hover {
  border-color: hsl(var(--primary)); /* 悬停时的边框颜色 */
}
</style>
