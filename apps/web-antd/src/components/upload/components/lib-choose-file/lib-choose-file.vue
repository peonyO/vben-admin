<script setup lang="ts">
import type { LibChooseFileProps } from './types';

import type { VbenFormProps } from '#/adapter/form';

import { h, onMounted, ref, watch } from 'vue';

import { MdiMenu } from '@vben/icons';

import { Button, Card, message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { type CommonApi, getFileListApi } from '#/api';

import { DirectoryTree } from '../../../directory-tree';
import { PopoverPreviewFile } from '../../../popover-preview-file';
import { useLibStore } from './store';

// 定义组件的 Props 接口
interface Props extends LibChooseFileProps {}

// 定义组件的 Props
const props = defineProps<Props>();

const emits = defineEmits<{
  (event: 'upload', fileList: string[]): void;
}>();

const directoryTreeRef = ref();

/** @module 树列表 */
// #region
const libStore = useLibStore();
const { initTree } = libStore;
const { treeData, selectKey, expandedKeys } = storeToRefs(libStore);

onMounted(() => {
  initTree();
});
// #endregion

// #region Grid 表格
const gridOptions: VxeGridProps<CommonApi.FileListResult> = {
  columns: [
    { align: 'center', title: '请选择', type: 'checkbox', width: 80 },
    {
      field: 'previewUrl',
      slots: { default: 'files' },
      title: '文件预览',
      minWidth: 100,
    },
    {
      align: 'center',
      field: 'origName',
      title: '文件名称',
      minWidth: 200,
    },
  ],
  checkboxConfig: {
    trigger: 'row',
    highlight: true,
    showHeader: false,
    checkMethod,
  },
  keepSource: true,
  sortConfig: {
    multiple: true,
  },
  proxyConfig: {
    ajax: {
      query: gridQuery,
    },
  },
};

const formOptions: VbenFormProps = {
  showCollapseButton: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'origName',
      label: '文件名称',
    },
  ],
};
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

watch(
  () => selectKey.value,
  () => {
    gridApi.reload();
  },
);

async function gridQuery({ page }: any, formValues: any) {
  const { currentPage: pageNo, pageSize } = page;
  return getFileListApi({
    pageNo,
    pageSize,
    ...formValues,
    filesTypeId: selectKey.value,
    filesType: props.fileType,
  });
}

function checkMethod({ row }: { row: CommonApi.FileListResult }) {
  const reserveArr = gridApi.grid.getCheckboxReserveRecords(false) || [];
  const currentArr = gridApi.grid.getCheckboxRecords() || [];
  const arr = [...reserveArr, ...currentArr];
  return (
    arr.length < props.canNumber ||
    arr.find((item) => item.filesId === row.filesId)
  );
}

function confirm() {
  const { grid } = gridApi;
  const reserveArr = grid?.getCheckboxReserveRecords(false) || [];
  const currentArr = grid?.getCheckboxRecords() || [];
  const selectList = [...reserveArr, ...currentArr];
  if (selectList) {
    if (selectList.length === 0) {
      message.warn('请选择上传文件');
      return;
    }
    const filePath = selectList.map((item) => item.previewUrl);
    grid.clearCheckboxRow();
    grid.clearCheckboxReserve();
    emits('upload', filePath);
  }
}
// #endregion
</script>

<template>
  <div class="flex size-full gap-2">
    <DirectoryTree
      ref="directoryTreeRef"
      v-model:expanded-keys="expandedKeys"
      v-model:model-value="selectKey"
      :tree-data="treeData"
    />
    <Card
      :body-style="{ height: '100%' }"
      class="flex-1 overflow-hidden"
      size="small"
    >
      <Grid>
        <template #toolbar-actions>
          <Button
            :icon="h(MdiMenu, { class: 'text-[20px] m-auto' })"
            class="md:hidden"
            @click="directoryTreeRef.openDrawer()"
          />
        </template>
        <template #toolbar-tools>
          <Button type="primary" @click="confirm"> 确认选择 </Button>
        </template>
        <template #files="{ row }">
          <PopoverPreviewFile :file-type="fileType" :src="row.previewUrl" />
        </template>
      </Grid>
    </Card>
  </div>
</template>
