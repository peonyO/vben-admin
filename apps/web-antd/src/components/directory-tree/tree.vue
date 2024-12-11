<script setup lang="ts">
import type { Key } from 'ant-design-vue/es/_util/type';

import type { ClickMenuItem, TreeProps } from './types';

import { computed } from 'vue';

import { EllipsisText } from '@vben/common-ui';

import { DirectoryTree, Dropdown, Menu, Tag, Tooltip } from 'ant-design-vue';

interface Props extends TreeProps {}

interface TreeEmits {
  (event: 'handleMenuItem', options: ClickMenuItem): void;
}

defineProps<Props>();
const emits = defineEmits<TreeEmits>();

const selectKey = defineModel<Key>('selectKey');
const expandedKeys = defineModel<Key[]>('expandedKeys');

const selectedKeys = computed({
  get() {
    return selectKey.value ? [selectKey.value] : undefined;
  },
  set(value) {
    selectKey.value = value && value[0] ? value[0] : undefined;
  },
});

function clickMenuItem(options: ClickMenuItem) {
  emits('handleMenuItem', options);
}
</script>

<template>
  <DirectoryTree
    v-model:expanded-keys="expandedKeys"
    v-model:selected-keys="selectedKeys"
    :show-icon="false"
    :tree-data="treeData"
  >
    <template #title="{ data }">
      <Dropdown :disabled="!!contextmenu?.length" :trigger="['contextmenu']">
        <div class="flex items-center">
          <img
            v-if="data.iconSrc"
            :src="data.iconSrc"
            class="mr-[5px] size-[20px]"
          />
          <div class="flex-1">
            <EllipsisText
              :max-width="180 + (data.iconSrc ? 25 : 0) + (data.desc ? 40 : 0)"
              :tooltip-max-width="200"
              :tooltip-overlay-style="{ textAlign: 'center' }"
              cursor-pointer
              placement="right"
            >
              {{ data.title }}
            </EllipsisText>
          </div>
          <Tooltip v-if="data.desc" :title="data.desc" placement="bottom">
            <Tag class="m-0" color="processing">描述</Tag>
          </Tooltip>
        </div>
        <template #overlay>
          <Menu
            :items="contextmenu"
            class="w-[150px]"
            @click="
              ({ key }) =>
                clickMenuItem({ treeItem: data, menuType: key as string })
            "
          />
        </template>
      </Dropdown>
    </template>
  </DirectoryTree>
</template>

<style>
.ant-tree-switcher-noop {
  width: 0 !important;
}
</style>
