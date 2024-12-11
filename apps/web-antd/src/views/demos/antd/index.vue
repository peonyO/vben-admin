<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { UPLOAD_FILE_TYPE } from '#/components/upload';

const gridOptions: VxeGridProps = {
  columns: [
    {
      title: '图片',
      width: 100,
      field: 'image',
      cellRender: {
        name: 'CellFile',
        props: { fileType: UPLOAD_FILE_TYPE.PICTURE },
      },
    },
  ],
  data: [{ image: 'http://10.0.15.0:8888/file/image.png' }],
};

const [Grid] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <Page
    description="支持多语言，主题功能集成切换等"
    title="Ant Design Vue组件使用演示"
  >
    <Grid />
  </Page>
</template>
