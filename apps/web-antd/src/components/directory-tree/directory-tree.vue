<script setup lang="ts">
import type { Key } from 'ant-design-vue/es/_util/type';

import type { ClickMenuItem, TreeProps } from './types';

import { ref } from 'vue';

import { usePreferences } from '@vben/preferences';

import { Card, Drawer } from 'ant-design-vue';

import DirectoryTree from './tree.vue';

interface Props extends TreeProps {}

defineProps<Props>();

const emits = defineEmits<{
  (event: 'handleMenuItem', options: ClickMenuItem): void;
}>();

const modelValue = defineModel<Key>();
const treeExpandedKeys = defineModel<Key[]>('expandedKeys');

const { isMobile } = usePreferences();

const drawerOpen = ref(false);
const spinning = ref(false);

function handleMenuItem(options: ClickMenuItem) {
  emits('handleMenuItem', options);
}

defineExpose({
  openDrawer() {
    drawerOpen.value = true;
  },
  closeDrawer() {
    drawerOpen.value = false;
  },
  showLoading(show: boolean) {
    spinning.value = show;
  },
});
</script>

<template>
  <Card
    v-if="!isMobile"
    :body-style="{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }"
    :loading="spinning"
    class="w-[245px] rounded-[calc(var(--radius)-2px)]"
    size="small"
  >
    <slot name="header"></slot>
    <DirectoryTree
      v-model:expanded-keys="treeExpandedKeys"
      v-model:select-key="modelValue"
      :context-menu="contextmenu"
      :tree-data="treeData"
      class="flex-1"
      @handle-menu-item="handleMenuItem"
    />
  </Card>
  <Drawer
    v-model:open="drawerOpen"
    destroy-on-close
    placement="left"
    root-class-name="absolute"
  >
    <slot name="header"></slot>
    <DirectoryTree
      v-model:expanded-keys="treeExpandedKeys"
      v-model:select-key="modelValue"
      :context-menu="contextmenu"
      :tree-data="treeData"
      @handle-menu-item="handleMenuItem"
    />
  </Drawer>
</template>
