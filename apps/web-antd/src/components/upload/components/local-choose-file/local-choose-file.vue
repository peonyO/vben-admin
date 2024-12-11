<script setup lang="ts">
import type { LocalChooseFileProps } from './types'; // 导入类型定义

import { ref } from 'vue'; // 从 Vue 导入 ref 方法

import { ACCEPT_MAP } from './helper'; // 导入文件类型映射

// 定义组件的 Props 接口
interface Props extends LocalChooseFileProps {}

// 配置选项，设置不继承属性
defineOptions({ inheritAttrs: false });

// 定义组件的 Props
defineProps<Props>();

// 定义组件的事件，指定 'upload' 事件的参数类型
const emits = defineEmits<{
  (event: 'upload', files: File[]): void; // 当文件上传时，发出 'upload' 事件，传递文件数组
}>();

// 创建一个对文件输入元素的引用
const fileInputRef = ref<HTMLInputElement>();

// 触发文件输入框的点击事件
function locationUpload() {
  fileInputRef.value?.click(); // 如果引用存在，调用 click 方法
}

// 处理文件输入变化事件
async function handleInputFile($event: Event) {
  const target = $event.target as HTMLInputElement; // 获取事件目标，强制转换为 HTMLInputElement
  if (target.files) {
    // 检查是否有文件
    const files = [...target.files]; // 将 FileList 转换为数组
    files && emits('upload', files); // 如果有文件，发出 'upload' 事件并传递文件数组
  }
  target.value = ''; // 清空输入框的值，以便再次选择文件
}

// 将 locationUpload 方法暴露给外部
defineExpose({
  locationUpload,
});
</script>

<template>
  <input
    ref="fileInputRef"
    :accept="ACCEPT_MAP[fileType]"
    class="!hidden"
    multiple
    type="file"
    @change="handleInputFile"
  />
</template>
