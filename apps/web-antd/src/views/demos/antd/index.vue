<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { defaultFormConfig, useVbenForm } from '#/adapter/form';
import { fileUploadRule, Upload, UPLOAD_FILE_TYPE } from '#/components/upload';

const [Form] = useVbenForm({
  ...defaultFormConfig,
  schema: [
    {
      formItemClass: 'p-0',
      labelWidth: 0,
      component: 'Divider',
      fieldName: 'divider',
    },
    {
      component: 'Input',
      fieldName: 'divider',
    },
    {
      component: 'Upload',
      componentProps: {
        fileType: UPLOAD_FILE_TYPE.PICTURE,
        maxSize: 200,
        aspectRatio: 1,
      },
      fieldName: 'image',
      label: '上传文件',
      rules: fileUploadRule(),
    },
  ],
});
</script>

<template>
  <Page
    description="支持多语言，主题功能集成切换等"
    title="Ant Design Vue组件使用演示"
  >
    <Form>
      <template #image="slotProps">
        <Upload v-bind="slotProps" />
      </template>
    </Form>
  </Page>
</template>
